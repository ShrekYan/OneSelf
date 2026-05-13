#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 单进程并发安全版 v5.0
核心设计：
  1. 全程单进程，零全局中间文件（.init-needed/.last-run/.target-path/.auto-command 全部删除）
  2. 全程持有锁，天然并发安全
  3. 所有状态在内存中传递，不落地到全局文件
  4. 锁 TTL 自动清理（10 分钟）

功能：
  1. 模式检测（文件模式 / --run 模式）
  2. 全局锁获取与释放（带 TTL 自动清理）
  3. 查找已有解析结果 / 创建新的 run 目录
  4. XMind 解析
  5. 显示状态看板
  6. 任务选择与执行
"""
import os
import sys
import json
import time
import hashlib
import argparse
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Any

# 常量定义
RUNS_DIR = Path(".claude/runs").resolve()
LOCK_TTL_SECONDS = 600  # 10 分钟锁过期


# ============================================================================
# 1. 锁管理模块（并发安全核心）
# ============================================================================
def md5_hash(text: str) -> str:
    """生成 MD5 哈希（兼容 macOS/Linux）"""
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def cleanup_expired_locks() -> None:
    """清理所有过期的锁文件"""
    for lock_file in RUNS_DIR.glob(".lock.*"):
        try:
            age = time.time() - lock_file.stat().st_mtime
            if age > LOCK_TTL_SECONDS:
                print(f"🧹 自动清理过期锁：{lock_file.name}（已存在 {int(age)} 秒）")
                lock_file.rmdir()
        except Exception:
            pass


def acquire_lock(lock_id: str, max_retries: int = 10) -> Optional[Path]:
    """获取目录锁（原子操作）
    返回：锁文件路径，获取失败返回 None
    """
    lock_file = RUNS_DIR / f".lock.{lock_id}"

    print("🔒 竞态条件检查...")

    for i in range(1, max_retries + 1):
        try:
            lock_file.mkdir()
            print("✅ 拿到锁，继续执行")
            return lock_file
        except FileExistsError:
            # 检查锁是否过期
            try:
                age = time.time() - lock_file.stat().st_mtime
                if age > LOCK_TTL_SECONDS:
                    print(f"⚠️  检测到过期锁（{int(age)} 秒），自动清理并重试")
                    lock_file.rmdir()
                    continue
            except Exception:
                pass

            print(f"⏳ 另一个窗口正在处理，等待 {i} 秒...")
            time.sleep(i)

    print("")
    print("❌ 超时：另一个窗口仍在处理，请稍后重试")
    print("   如果确认没有其他窗口在运行，请手动删除：")
    print(f"   rmdir {lock_file}")
    return None


def release_lock(lock_file: Path) -> None:
    """释放锁"""
    try:
        lock_file.rmdir()
    except Exception:
        pass


# ============================================================================
# 2. 模式检测模块
# ============================================================================
def detect_mode(input_str: str) -> Dict:
    """
    检测执行模式
    返回：{
        "mode": "run" | "file",
        "run_dir": Optional[Path],  # --run 模式时有效
        "target_file": Optional[Path],  # 文件模式时有效
        "target_abs_path": str | None,  # 文件模式时有效
    }
    """
    input_str = input_str.strip()

    # 检测 --run 模式
    if input_str.startswith("--run"):
        run_dir_name = input_str.replace("--run", "", 1).strip()
        run_dir = (RUNS_DIR / run_dir_name).resolve()

        # 检查目录是否存在
        if not run_dir.exists():
            print(f"❌ 错误：目录不存在：{run_dir}")
            print("")
            print("可用的 run 目录：")
            available = sorted([d.name for d in RUNS_DIR.iterdir() if d.is_dir() and not d.name.startswith(".")])
            for d in available[:10]:
                print(f"  {d}")
            sys.exit(1)

        # 检查必要文件是否存在
        if not (run_dir / "task-manifest.json").exists():
            print(f"❌ 错误：目录中找不到 task-manifest.json")
            sys.exit(1)

        if not (run_dir / "task-status.json").exists():
            print(f"❌ 错误：目录中找不到 task-status.json")
            sys.exit(1)

        return {
            "mode": "run",
            "run_dir": run_dir,
            "run_dir_name": run_dir_name,
        }

    # 正常文件模式
    else:
        target_file = Path(input_str).resolve()
        if not target_file.exists():
            print(f"❌ 错误：文件不存在：{target_file}")
            sys.exit(1)

        return {
            "mode": "file",
            "target_file": target_file,
            "target_abs_path": str(target_file),
        }


# ============================================================================
# 3. Run 目录管理模块
# ============================================================================
def parse_filename(file_path: Path) -> tuple[str, str]:
    """
    智能识别文件名格式
    格式 A：{项目名}-{任务名}.md（多阶段/多任务项目）
    格式 B：{需求名}.md（单需求，无阶段）
    返回: (project_name, task_name)
    """
    file_name = file_path.stem

    if "-" in file_name:
        parts = file_name.split("-", 1)
        project_name = parts[0]
        task_name = parts[1]
    else:
        project_name = "单需求"
        task_name = file_name

    return project_name, task_name


def find_existing_run(target_abs_path: str) -> Optional[Path]:
    """查找已有解析结果（按时间倒序，优先最新）"""
    manifests = []

    for manifest_file in RUNS_DIR.rglob("task-manifest.json"):
        try:
            with open(manifest_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                source_xmind = data.get("source_xmind", "")
                if source_xmind == target_abs_path:
                    mtime = manifest_file.stat().st_mtime
                    manifests.append((mtime, manifest_file.parent))
        except Exception:
            continue

    if not manifests:
        return None

    # 按时间倒序，返回最新的
    manifests.sort(reverse=True)
    return manifests[0][1]


def init_run_directory(target_file: Path) -> Path:
    """
    初始化新的 Run 目录
    返回: Run 目录路径
    """
    file_name = target_file.stem
    project_name, task_name = parse_filename(target_file)
    target_abs_path = str(target_file.resolve())

    # 生成 RUN_ID
    run_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir_name = f"{file_name}-run-{run_id}"
    run_dir = RUNS_DIR / run_dir_name
    tasks_dir = run_dir / "Tasks"

    # 创建目录结构
    run_dir.mkdir(parents=True, exist_ok=True)
    tasks_dir.mkdir(parents=True, exist_ok=True)

    # 保存 run-info.json
    run_info = {
        "run_id": run_id,
        "source_file": str(target_file),
        "source_xmind": target_abs_path,
        "start_time": datetime.now().isoformat(),
        "mode": "smart-execution-v5.0",
        "continue_execution": False,
        "last_resume_time": None,
        "parser_version": "5.0",
    }

    with open(run_dir / "run-info.json", "w", encoding="utf-8") as f:
        json.dump(run_info, f, indent=2, ensure_ascii=False)

    # 初始化 task-status.json
    task_status = {
        "tasks": {},
        "execution_order": [],
        "parallel_groups": [],
        "current_state": "ready",
        "selected_task_id": "",
    }

    with open(run_dir / "task-status.json", "w", encoding="utf-8") as f:
        json.dump(task_status, f, indent=2, ensure_ascii=False)

    print("📂 新建运行目录（v5.0 单进程并发安全版）")
    print(f"   📍 Run 目录：{run_dir}")
    print(f"   📂 任务结果：{tasks_dir}")
    print("")

    return run_dir


# ============================================================================
# 4. XMind 解析模块
# ============================================================================
def parse_xmind(run_dir: Path, target_file: Path) -> bool:
    """解析 XMind 文件
    优先使用确定性脚本解析，失败时降级调用 Agent
    """
    print("=" * 60)
    print("🚀 确定性脚本解析 v1.0（优先执行）")
    print("=" * 60)
    print(f"📄 输入文件：{target_file}")
    print(f"📂 输出目录：{run_dir.name}")
    print("")

    # 直接执行脚本
    result = subprocess.run(
        ["python3", ".claude/scripts/xmind_parser.py", str(target_file), str(run_dir)],
        capture_output=True,
        text=True,
    )

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)

    exit_code = result.returncode
    print("")

    if exit_code == 0:
        print("✅ 脚本解析成功！")
        print("")

        # 校验解析结果
        all_ok = verify_parse_result(run_dir)
        print("")

        if all_ok:
            print("✅ 所有校验通过！")
            show_parse_summary(run_dir)
            print("")
            print("=" * 60)
            print("✅ 解析完成（确定性脚本模式）")
            print("=" * 60)
            print("")
            return True
        else:
            print("❌ 校验未通过")
            print("   → 暂不支持 Agent 兜底，请确保 XMind 文件格式正确")
            return False

    elif exit_code == 2:
        print("⚠️  脚本无法解析复杂结构（退出码 2）")
        print("   → 暂不支持 Agent 兜底，请简化 XMind 结构")
        return False

    else:
        print(f"❌ 脚本执行错误（退出码：{exit_code}）")
        return False


def verify_parse_result(run_dir: Path) -> bool:
    """校验解析结果完整性"""
    print("🔍 校验解析结果完整性...")
    all_ok = True

    # 检查所有必需的文件
    required_files = [
        "task-manifest.json",
        "task-status.json",
        "execution-plan.md",
        "task-definition.md",
    ]

    for filename in required_files:
        file_path = run_dir / filename
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"   ✅ {filename} ({size} 字节)")
        else:
            print(f"   ❌ {filename} 缺失")
            all_ok = False

    # 验证 JSON 格式
    manifest_path = run_dir / "task-manifest.json"
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            json.load(f)
        print("   ✅ task-manifest.json JSON 格式正确")
    except Exception:
        print("   ❌ task-manifest.json JSON 格式错误")
        all_ok = False

    return all_ok


def show_parse_summary(run_dir: Path) -> None:
    """显示解析结果统计"""
    print("")
    print("📊 解析结果统计：")

    manifest_path = run_dir / "task-manifest.json"
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        tasks = manifest.get("tasks", [])
        print(f"   任务数量：{len(tasks)}")
        if "execution_plan" in manifest:
            duration = manifest["execution_plan"].get("estimated_duration", "未知")
            print(f"   预计耗时：{duration}")

        for task in tasks:
            task_id = task.get("task_id", "")
            module = task.get("module", "")
            goal = task.get("goal", "")[:50]
            print(f"   {task_id}: {module} - {goal}...")
    except Exception as e:
        print(f"   ⚠️  无法读取统计信息：{e}")


# ============================================================================
# 5. 状态看板模块
# ============================================================================
def show_dashboard(run_dir: Path, command: Optional[str] = None) -> None:
    """显示任务状态看板"""
    # 读取版本信息
    version = "5.0"
    parser_version = "unknown"

    manifest_file = run_dir / "task-manifest.json"
    if manifest_file.exists():
        try:
            with open(manifest_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                parser_version = data.get("parser_version", "unknown")
        except Exception:
            pass

    status_file = run_dir / "task-status.json"
    current_state = "ready"
    if status_file.exists():
        try:
            with open(status_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                current_state = data.get("current_state", "ready")
        except Exception:
            pass

    print("")
    print("=" * 60)
    print("📊 XMind 工作流 - 任务状态看板（v5.0 并发安全版）")
    print("=" * 60)
    print("")
    print(f"📦 工作流版本: v{version}")
    print(f"📂 运行目录:   {run_dir}")
    print(f"🧩 解析版本:   {parser_version}")
    print(f"🎯 当前状态:   {current_state}")
    print(f"🔒 锁保护:     ✓ 全程持有（并发安全）")
    print("")
    print("=" * 60)

    # 调用 task_status.py 显示完整状态（v5.0 并发安全版：直接传目录，无竞态）
    print("")
    subprocess.run(["python3", ".claude/scripts/task_status.py", "--dir", str(run_dir), "--overview"])

    print("")
    print("=" * 60)
    print("💡 可用指令（严格匹配，大小写不敏感）")
    print("=" * 60)
    print("  T001          → 选择 T001，进入方案生成确认")
    print("  exec T001     → 强制直接执行 T001（慎用）")
    print("  status        → 刷新显示状态看板")
    print("  report        → 查看执行报告")
    print("  exit          → 退出工作流")
    print("")
    print("🔴 【流程说明】")
    print("   1. 输入任务编号选择任务")
    print("   2. 确认要生成此任务的方案")
    print("   3. 等待 Claude 生成完整方案并仔细审核")
    print("   4. 确认执行后写入文件 + 质量检查")
    print("")
    print("=" * 60)


# ============================================================================
# 6. 任务执行模块（简化版）
# ============================================================================
def select_task(run_dir: Path, task_id: str) -> bool:
    """选择任务"""
    # 读取 task-manifest.json
    manifest_file = run_dir / "task-manifest.json"
    if not manifest_file.exists():
        print(f"❌ 找不到任务清单文件")
        return False

    with open(manifest_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # 查找任务
    tasks = manifest.get("tasks", [])
    task = None
    for t in tasks:
        if t.get("task_id") == task_id:
            task = t
            break

    if not task:
        print(f"❌ 找不到任务：{task_id}")
        return False

    # 更新状态
    status_file = run_dir / "task-status.json"
    with open(status_file, "r", encoding="utf-8") as f:
        status_data = json.load(f)

    status_data["selected_task_id"] = task_id
    status_data["current_state"] = "scheme_previewing"

    with open(status_file, "w", encoding="utf-8") as f:
        json.dump(status_data, f, indent=2, ensure_ascii=False)

    print("")
    print("=" * 60)
    print(f"📋 已选择任务：{task_id}")
    print("=" * 60)
    print("")
    print(f"🎯 任务目标:   {task.get('goal', 'N/A')}")
    print(f"📁 所属模块:   {task.get('module', 'N/A')}")
    print(f"📊 任务状态:   {task.get('status', 'pending')}")
    print(f"⚠️  风险等级:   {task.get('risk_level', 'N/A')}")
    print("")
    print("=" * 60)
    print("❓ 请确认是否为该任务生成方案？")
    print("=" * 60)
    print("   yes/confirm  → 确认生成方案")
    print("   no/back      → 取消，返回任务看板")
    print("   exit         → 退出工作流")
    print("=" * 60)

    return True


# ============================================================================
# 7. 主流程
# ============================================================================
def main():
    parser = argparse.ArgumentParser(description="XMind 工作流（v5.0 并发安全版）")
    parser.add_argument("input", help="XMind Markdown 文件路径或 --run 目录名")
    parser.add_argument("--task", help="直接执行指定任务 ID")
    parser.add_argument("--command", help="启动时直接执行命令")

    args = parser.parse_args()

    # 确保目录存在
    RUNS_DIR.mkdir(parents=True, exist_ok=True)

    # 自动清理过期锁
    cleanup_expired_locks()

    # 模式检测
    result = detect_mode(args.input)

    # 计算锁 ID 并获取锁
    if result["mode"] == "file":
        lock_id = md5_hash(result["target_abs_path"])
    else:
        lock_id = result["run_dir_name"]

    # 获取锁（全程持有）
    lock_file = acquire_lock(lock_id)
    if not lock_file:
        sys.exit(1)

    try:
        # 注册退出时自动释放锁
        import atexit
        atexit.register(lambda: release_lock(lock_file))

        print("")
        print("🚀 XMind 工作流 v5.0（单进程并发安全版）")
        print("=" * 60)
        print("✅ 零全局中间文件，无竞态风险")
        print("✅ 全程持有锁，物理多开安全")
        print("=" * 60)
        print("")

        if result["mode"] == "file":
            target_file = result["target_file"]
            target_abs_path = result["target_abs_path"]

            print(f"📄 源文件: {target_file}")
            print("")

            # 查找已有 run 或创建新的
            existing_run = find_existing_run(target_abs_path)

            if existing_run:
                run_dir = existing_run
                print(f"✅ 复用已有解析结果：{run_dir.name}")
                print("")
            else:
                # 创建新的 run 目录
                run_dir = init_run_directory(target_file)

                # 执行解析
                parse_success = parse_xmind(run_dir, target_file)
                if not parse_success:
                    print("❌ 解析失败，退出")
                    sys.exit(1)
        else:
            run_dir = result["run_dir"]
            print(f"✅ 使用指定目录：{run_dir.name}")
            print("")

        # 显示看板
        show_dashboard(run_dir, args.command)

        # 如果指定了任务，直接选择
        if args.task:
            select_task(run_dir, args.task)

        # 显示下一步提示
        print("")
        print("👉 请输入任务编号或指令（如 T001、status、exit）：")
        print("")

    except KeyboardInterrupt:
        print("")
        print("")
        print("👋 用户中断，退出工作流")
        print("")
        # 释放锁（atexit 会自动处理）
        sys.exit(0)
    except Exception as e:
        print("")
        print(f"❌ 发生错误：{e}")
        import traceback
        traceback.print_exc()
        # 释放锁（atexit 会自动处理）
        sys.exit(1)


if __name__ == "__main__":
    main()
