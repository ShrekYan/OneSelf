#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - Run 目录初始化工具
v4.0
功能：
  1. 模式检测（--run 模式 / 正常文件模式）
  2. Run 目录创建和初始化
  3. 查找已有解析结果
  4. 清理半完成目录
  5. 保存 .last-run 指针文件
"""
import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path
import argparse
from typing import Optional, Dict, Any, Tuple

# 常量定义
RUNS_DIR = Path(".claude/runs").resolve()


def md5_hash(text: str) -> str:
    """生成 MD5 哈希（兼容 macOS/Linux）"""
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def detect_mode(input_str: str) -> dict:
    """
    检测执行模式
    返回: {
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
            available = sorted([d.name for d in RUNS_DIR.iterdir() if d.is_dir() and d.name.startswith("run-")])
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


def cleanup_incomplete_dirs() -> None:
    """清理半完成目录（有 execution-plan 但无 task-manifest）"""
    print("🧹 清理无效的半完成目录（有 execution-plan 但无 task-manifest）")

    for run_dir in RUNS_DIR.iterdir():
        if not run_dir.is_dir() or not run_dir.name.startswith("run-"):
            continue

        execution_plan = run_dir / "execution-plan.md"
        task_manifest = run_dir / "task-manifest.json"

        if execution_plan.exists() and not task_manifest.exists():
            print(f"  🗑️  清理半完成目录：{run_dir.name}")
            import shutil
            shutil.rmtree(run_dir)

    print("")


def find_existing_manifest(target_abs_path: str) -> Optional[Path]:
    """查找已有解析结果（按时间倒序，优先最新）"""
    manifests = []

    for manifest_file in RUNS_DIR.rglob("task-manifest.json"):
        try:
            with open(manifest_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                source_xmind = data.get("source_xmind", "")
                if source_xmind == target_abs_path:
                    mtime = manifest_file.stat().st_mtime
                    manifests.append((mtime, manifest_file))
        except Exception:
            continue

    if not manifests:
        return None

    # 按时间倒序，返回最新的
    manifests.sort(reverse=True)
    return manifests[0][1]


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

    # 保存 .last-run
    last_run_file = RUNS_DIR / ".last-run"
    with open(last_run_file, "w", encoding="utf-8") as f:
        f.write(f"RUN_ID={run_id}\n")
        f.write(f"RUN_DIR={run_dir}\n")
        f.write(f"TASKS_DIR={tasks_dir}\n")
        f.write(f"PROJECT_NAME={project_name}\n")
        f.write(f"TASK_NAME={task_name}\n")

    # 保存 run-info.json
    run_info = {
        "run_id": run_id,
        "source_file": str(target_file),
        "source_file_abs": target_abs_path,
        "start_time": datetime.now().isoformat(),
        "mode": "smart-execution-v4.0",
        "continue_execution": False,
        "last_resume_time": None,
        "parser_version": "4.0",
    }

    with open(run_dir / "run-info.json", "w", encoding="utf-8") as f:
        json.dump(run_info, f, indent=2, ensure_ascii=False)

    # 初始化 task-status.json
    task_status = {
        "tasks": {},
        "execution_order": [],
        "parallel_groups": [],
    }

    with open(run_dir / "task-status.json", "w", encoding="utf-8") as f:
        json.dump(task_status, f, indent=2, ensure_ascii=False)

    print("📂 新建运行目录（v4.0 单目录集中存储）")
    print(f"   📍 Run 目录：{run_dir}")
    print(f"   📂 任务结果：{tasks_dir}")
    print(f"   💡 所有文件集中保存，无需跨目录管理")
    print("")

    # ✅ 增加完成状态提示，明确告知用户哪些文件已生成，哪些待生成
    print("═" * 70)
    print("✅ 基础环境初始化完成！")
    print("─" * 70)
    print("📋 已生成的文件：")
    print("   ✅ run-info.json          - 运行元信息")
    print("   ✅ task-status.json       - 任务状态跟踪（初始为空）")
    print("   ✅ Tasks/ 目录            - 任务执行结果目录")
    print("")
    print("⏳ 待后续步骤生成（workflow 下一步自动执行）：")
    print("   ⏳ task-manifest.json     - [步骤 3] Agent 解析 XMind 后生成")
    print("   ⏳ task-definition.md     - [步骤 3] Agent 解析 XMind 后生成")
    print("   ⏳ execution-plan.md      - [步骤 3] Agent 解析 XMind 后生成")
    print("─" * 70)
    print("💡 提示：继续执行 workflow，下一步将调用 xmind-task-parser Agent")
    print("═" * 70)
    print("")

    return run_dir


def update_run_info_continue(run_dir: Path) -> None:
    """更新 run-info，标记为继续执行"""
    run_info_file = run_dir / "run-info.json"

    with open(run_info_file, "r", encoding="utf-8") as f:
        run_info = json.load(f)

    run_info["continue_execution"] = True
    run_info["last_resume_time"] = datetime.now().isoformat()

    with open(run_info_file, "w", encoding="utf-8") as f:
        json.dump(run_info, f, indent=2, ensure_ascii=False)


def save_target_path(target_abs_path: str) -> None:
    """保存目标文件路径供后续步骤使用"""
    target_path_file = RUNS_DIR / ".target-path"
    with open(target_path_file, "w", encoding="utf-8") as f:
        f.write(f"TARGET_ABS_PATH={target_abs_path}\n")


def mark_skip_parse() -> None:
    """标记跳过解析步骤"""
    (RUNS_DIR / ".skip-parse").touch()
    (RUNS_DIR / ".skip-init").touch()


def mark_need_init() -> None:
    """标记需要初始化"""
    (RUNS_DIR / ".init-needed").touch()


def mark_need_parse() -> None:
    """标记需要解析"""
    (RUNS_DIR / ".parse-needed").touch()


def mark_run_mode() -> None:
    """标记为 --run 模式"""
    (RUNS_DIR / ".run-mode").touch()


def main():
    parser = argparse.ArgumentParser(description="XMind 工作流初始化工具")
    parser.add_argument("input", help="文件路径或 --run 目录名")
    parser.add_argument("--init", action="store_true", help="执行目录初始化")
    parser.add_argument("--cleanup", action="store_true", help="只清理半完成目录")
    parser.add_argument("--lock-id", action="store_true", help="只输出文件锁 ID")

    args = parser.parse_args()

    # 确保目录存在
    RUNS_DIR.mkdir(parents=True, exist_ok=True)

    # 只清理半完成目录
    if args.cleanup:
        cleanup_incomplete_dirs()
        return

    # 只输出文件锁 ID
    if args.lock_id:
        result = detect_mode(args.input)
        if result["mode"] == "file":
            lock_id = md5_hash(result["target_abs_path"])
            print(lock_id)
        return

    # 执行目录初始化
    if args.init:
        # 读取 .target-path
        target_path_file = RUNS_DIR / ".target-path"
        if not target_path_file.exists():
            print("❌ 错误：找不到 .target-path 文件")
            sys.exit(1)

        with open(target_path_file, "r", encoding="utf-8") as f:
            line = f.readline().strip()
            target_abs_path = line.replace("TARGET_ABS_PATH=", "")

        target_file = Path(target_abs_path)
        init_run_directory(target_file)
        return

    # 正常模式检测
    print("🚀 开始 XMind 工作流 - 五要素智能执行模式 v4.0")
    print("")

    result = detect_mode(args.input)

    if result["mode"] == "run":
        # --run 模式
        run_dir = result["run_dir"]
        run_dir_name = result["run_dir_name"]

        print("🔧 模式：--run 直接指定目录")
        print(f"📂 目标目录：{run_dir}")
        print("")

        # 保存 .last-run
        last_run_file = RUNS_DIR / ".last-run"
        with open(last_run_file, "w", encoding="utf-8") as f:
            f.write(f"RUN_ID={run_dir_name}\n")
            f.write(f"RUN_DIR={run_dir}\n")

        print(f"✅ 已直接指定运行目录：{run_dir}")
        print("")

        # 标记跳过后续步骤
        mark_run_mode()
        mark_skip_parse()

    else:
        # 文件模式
        target_file = result["target_file"]
        target_abs_path = result["target_abs_path"]

        print("🔧 模式：文件路径匹配")
        print(f"📂 文件路径：{target_file}")
        print("")

        print("🔍 执行铁律：优先检查已有解析结果（创建新目录前）")
        print("")
        print(f"目标文件：{target_file}")
        print(f"绝对路径：{target_abs_path}")
        print("")

        # 保存目标路径
        save_target_path(target_abs_path)

        # 清理半完成目录
        cleanup_incomplete_dirs()

        # 查找已有解析结果
        found_manifest = find_existing_manifest(target_abs_path)

        if found_manifest:
            # 找到已有结果
            run_dir = found_manifest.parent
            run_dir_name = run_dir.name

            # 保存 .last-run
            last_run_file = RUNS_DIR / ".last-run"
            with open(last_run_file, "w", encoding="utf-8") as f:
                f.write(f"RUN_ID={run_dir_name}\n")
                f.write(f"RUN_DIR={run_dir}\n")

            print(f"✅ 找到已有解析结果：{run_dir_name}")
            print("")

            # 标记跳过后续步骤
            mark_skip_parse()
        else:
            # 未找到，标记需要初始化和解析
            print("⚠️  未找到已有解析结果，将创建新目录并执行新的解析")
            mark_need_init()
            mark_need_parse()

        print("")


if __name__ == "__main__":
    main()
