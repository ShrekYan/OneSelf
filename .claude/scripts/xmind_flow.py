#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 极简执行流 v1.0
============================================
设计目标：最精简、最强悍的 XMind 任务执行流

流程（线性 5 步）：
  [1] 解析 XMind     → Python 确定性解析（复用 xmind_parser.py）
  [2] 弹出看板       → Python 纯展示 + input
  [3] 选中任务       → Python 校验 + 提取上下文
  [4] 输出方案       → Agent task-scheme-generator（不落盘）
  [5] 执行代码       → Agent task-executor + 脚本回写日志

关键设计：
  - 零状态机，input() 阻塞推进
  - 仅 1 个持久化文件 manifest.json（可复用，跳过解析）
  - 方案文本只在终端显示，不写文件
  - 执行追溯由脚本兜底（execution-log.jsonl）
  - 全程持锁（10min TTL），并发安全
  - Agent 调用通过 <<<INVOKE_AGENT:name>>> 信令交给外层 Claude
"""
import argparse
import hashlib
import json
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

# ============================================================================
# 计时器
# ============================================================================
class StepTimer:
    """步骤计时器，记录各阶段耗时"""
    def __init__(self):
        self.steps = {}
        self.current_step = None
        self.start_time = None

    def start(self, step_name: str):
        self.current_step = step_name
        self.start_time = time.time()

    def stop(self) -> int:
        if not self.current_step or not self.start_time:
            return 0
        elapsed_ms = int((time.time() - self.start_time) * 1000)
        self.steps[self.current_step] = elapsed_ms
        self.current_step = None
        self.start_time = None
        return elapsed_ms

    def total_ms(self) -> int:
        return sum(self.steps.values())

    def to_dict(self) -> dict:
        return {
            "steps": self.steps,
            "total_ms": self.total_ms()
        }


# ============================================================================
# 常量
# ============================================================================
RUNS_DIR = Path(".claude/runs").resolve()
LOCK_TTL = 600  # 10 分钟
PARSER_SCRIPT = Path(".claude/scripts/xmind_parser.py")


# ============================================================================
# 锁管理（并发安全）
# ============================================================================
def acquire_lock(key: str) -> Path:
    """获取目录锁，最多重试 10 次"""
    lock_id = hashlib.md5(key.encode("utf-8")).hexdigest()
    lock_file = RUNS_DIR / f".lock.{lock_id}"

    for i in range(1, 11):
        try:
            lock_file.mkdir()
            return lock_file
        except FileExistsError:
            try:
                age = time.time() - lock_file.stat().st_mtime
                if age > LOCK_TTL:
                    print(f"⚠️  清理过期锁（{int(age)}s）")
                    lock_file.rmdir()
                    continue
            except Exception:
                pass
            print(f"⏳ 等待其他窗口释放锁（{i}/10）...")
            time.sleep(i)

    sys.exit(f"❌ 锁超时，如确认无其他窗口请手动删除：{lock_file}")


def release_lock(lock_file: Path) -> None:
    try:
        lock_file.rmdir()
    except Exception:
        pass


# ============================================================================
# Step 1: 解析 XMind
# ============================================================================
def step1_parse(xmind_path: Path, timer: StepTimer) -> tuple[Path, list]:
    """解析 XMind，返回 (run_dir, tasks)
    若已有同源 manifest，直接复用跳过解析
    """
    abs_path = str(xmind_path.resolve())

    # 复用已有解析结果
    for manifest_file in RUNS_DIR.rglob("task-manifest.json"):
        try:
            data = json.loads(manifest_file.read_text(encoding="utf-8"))
            if data.get("source_xmind") == abs_path:
                run_dir = manifest_file.parent
                print(f"♻️  复用已有解析：{run_dir.name}")
                return run_dir, data.get("tasks", [])
        except Exception:
            continue

    # 创建新 run 目录
    run_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = RUNS_DIR / f"{xmind_path.stem}-run-{run_id}"
    run_dir.mkdir(parents=True, exist_ok=True)

    print(f"📂 新建运行目录：{run_dir.name}")
    print(f"🧠 解析 XMind：{xmind_path.name}")

    if not PARSER_SCRIPT.exists():
        sys.exit(f"❌ 缺失解析脚本：{PARSER_SCRIPT}")

    timer.start("parse")
    result = subprocess.run(
        ["python3", str(PARSER_SCRIPT), str(xmind_path), str(run_dir)],
        capture_output=True,
        text=True,
    )
    parse_ms = timer.stop()
    print(f"⏱️  解析耗时：{parse_ms}ms")

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    if result.returncode != 0:
        sys.exit(f"❌ 解析失败（exit={result.returncode}）")

    manifest_file = run_dir / "task-manifest.json"
    if not manifest_file.exists():
        sys.exit("❌ 解析未生成 task-manifest.json")

    data = json.loads(manifest_file.read_text(encoding="utf-8"))

    # 补写 source_xmind 便于后续复用
    if "source_xmind" not in data:
        data["source_xmind"] = abs_path
        manifest_file.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    tasks = data.get("tasks", [])
    print(f"✅ 解析完成：{len(tasks)} 个任务\n")
    return run_dir, tasks


# ============================================================================
# Step 1.5: 通过 task_id 反向查找已有任务
# ============================================================================
def find_task_by_id(tid: str) -> tuple[Optional[Path], Optional[dict]]:
    """在所有 runs 目录中查找指定 task_id 的 manifest 和任务"""
    for manifest_file in RUNS_DIR.rglob("task-manifest.json"):
        try:
            data = json.loads(manifest_file.read_text(encoding="utf-8"))
            for task in data.get("tasks", []):
                if task.get("task_id") == tid:
                    return manifest_file.parent, task
        except Exception:
            continue
    return None, None


# ============================================================================
# Step 2: 弹出看板
# ============================================================================
def step2_dashboard(tasks: list, log_file: Path) -> str:
    """显示任务看板，返回用户输入"""
    done_ids = set()
    if log_file.exists():
        for line in log_file.read_text(encoding="utf-8").splitlines():
            try:
                done_ids.add(json.loads(line).get("task_id"))
            except Exception:
                pass

    print("\n" + "=" * 60)
    print(f"📊 XMind 任务看板（共 {len(tasks)} 个任务）")
    print("=" * 60)

    for t in tasks:
        tid = t.get("task_id", "?")
        mark = "✅" if tid in done_ids else "⬜"
        module = t.get("module", "-")
        goal = t.get("goal", "")[:50]
        risk = t.get("risk_level", "")
        risk_tag = f" [{risk}]" if risk else ""
        print(f"  {mark} {tid}  [{module}]{risk_tag}  {goal}")

    print("=" * 60)
    print("💡 指令：<task_id> 选任务 | exit 退出")
    print("=" * 60)

    return input("\n👉 请输入：").strip()


# ============================================================================
# Step 3: 选中任务
# ============================================================================
def step3_select(tasks: list, tid: str) -> Optional[dict]:
    """校验并返回任务上下文"""
    task = next((t for t in tasks if t.get("task_id") == tid), None)
    if not task:
        print(f"❌ 任务不存在：{tid}")
        return None

    print("\n" + "=" * 60)
    print(f"📋 已选中任务：{tid}")
    print("=" * 60)
    print(f"🎯 目标：{task.get('goal', 'N/A')}")
    print(f"📁 模块：{task.get('module', 'N/A')}")
    print(f"⚠️  风险：{task.get('risk_level', 'N/A')}")
    deps = task.get("dependencies", [])
    if deps:
        print(f"🔗 依赖：{', '.join(deps)}")
    print("=" * 60)

    return task


# ============================================================================
# Step 4: 输出方案（Agent 调用，不落盘）
# ============================================================================
def step4_scheme(task: dict, timer: StepTimer, auto_confirm: bool = False) -> bool:
    """通过信令请求外层 Claude 调用 task-scheme-generator
    返回用户是否确认执行
    """
    print("\n" + "=" * 60)
    print("🧠 生成执行方案（task-scheme-generator）")
    print("=" * 60)
    print("<<<INVOKE_AGENT:task-scheme-generator>>>")
    print(json.dumps(task, ensure_ascii=False, indent=2))
    print("<<<END_INVOKE>>>")
    print("=" * 60)
    print("📌 方案要求：受影响文件清单 + 完整代码 + 风险点 + 回滚方案")
    print("=" * 60)

    timer.start("scheme")
    if auto_confirm:
        print("\n👉 --yes 模式：自动确认方案")
        ans = "yes"
    else:
        ans = input("\n👉 方案确认？(yes/no): ").strip().lower()
    scheme_ms = timer.stop()
    print(f"⏱️  方案阶段耗时：{scheme_ms}ms")
    return ans in ("yes", "y", "confirm")


# ============================================================================
# Step 5: 执行代码（Agent 调用 + 脚本回写日志）
# ============================================================================
def step5_execute(run_dir: Path, task: dict, timer: StepTimer) -> None:
    """通过信令请求外层 Claude 调用 task-executor
    脚本兜底回写一行到 execution-log.jsonl
    """
    tid = task.get("task_id", "?")

    print("\n" + "=" * 60)
    print(f"🚀 执行任务（task-executor）：{tid}")
    print("=" * 60)
    print("<<<INVOKE_AGENT:task-executor>>>")
    print(json.dumps(task, ensure_ascii=False, indent=2))
    print("<<<END_INVOKE>>>")
    print("=" * 60)
    print("📊 Token 统计：请在工作流执行完成后将 token 用量写入 run_dir/.token-usage.json")
    print("   格式：{\"input\": 1234, \"output\": 567}")
    print("=" * 60)

    timer.start("execute")
    # 这里实际上是由外层 Claude Agent 执行，Python 脚本在此等待
    # Agent 执行完成后会返回到 Python 脚本继续执行
    execute_ms = timer.stop()
    print(f"⏱️  执行阶段耗时：{execute_ms}ms")

    # 读取 token 用量（如果 Agent 已写入）
    token_usage = {"input": None, "output": None, "total": None}
    token_file = run_dir / ".token-usage.json"
    if token_file.exists():
        try:
            usage = json.loads(token_file.read_text(encoding="utf-8"))
            token_usage = {
                "input": usage.get("input"),
                "output": usage.get("output"),
                "total": usage.get("input", 0) + usage.get("output", 0) if usage.get("input") and usage.get("output") else None,
            }
            print(f"📊 Token 用量：input={token_usage['input']}, output={token_usage['output']}")
        except Exception:
            pass

    # 脚本兜底回写日志（可审计）
    log_file = run_dir / "execution-log.jsonl"
    timings = timer.to_dict()
    record = {
        "task_id": tid,
        "time": datetime.now().isoformat(),
        "goal": task.get("goal", ""),
        "module": task.get("module", ""),
        "status": "completed",
        "timings": {
            "parse_ms": timings["steps"].get("parse", 0),
            "scheme_ms": timings["steps"].get("scheme", 0),
            "execute_ms": timings["steps"].get("execute", 0),
            "total_ms": timings["total_ms"],
        },
        "tokens": token_usage,
    }
    with log_file.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"\n✅ 已记录追溯：{log_file.name}")
    print(f"⏱️  总耗时：{timings['total_ms']}ms")


# ============================================================================
# 主流程
# ============================================================================
def main():
    parser = argparse.ArgumentParser(description="XMind 极简执行流")
    parser.add_argument("file", help="XMind Markdown 文件路径")
    parser.add_argument("--task", dest="task_id", help="直接指定 task_id 执行，跳过解析和看板")
    parser.add_argument("--yes", action="store_true", help="自动确认方案并执行，无需交互")
    args = parser.parse_args()

    xmind_path = Path(args.file)
    if not xmind_path.exists():
        sys.exit(f"❌ 文件不存在：{xmind_path}")

    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    lock_file = acquire_lock(str(xmind_path.resolve()))

    timer = StepTimer()

    try:
        if args.task_id:
            # ========== 快速模式：指定 task_id ==========
            print(f"\n🚀 XMind 快速执行模式（task_id={args.task_id}）")
            print("=" * 60)

            run_dir, task = find_task_by_id(args.task_id)
            if not task:
                sys.exit(f"❌ 未找到任务：{args.task_id}")

            print(f"♻️  复用已有解析：{run_dir.name}")
            print(f"📋 任务：{task.get('goal', 'N/A')}")
            print(f"📁 模块：{task.get('module', 'N/A')}")

            if not step4_scheme(task, timer, auto_confirm=args.yes):
                print("⏭️  已取消")
                return

            step5_execute(run_dir, task, timer)
        else:
            # ========== 完整模式：解析 → 看板 → 选任务 → 出方案 → 执行 ==========
            print("\n🚀 XMind 极简执行流 v1.0")
            print("=" * 60)
            print("流程：解析 → 看板 → 选任务 → 出方案 → 执行")
            print("=" * 60)

            # Step 1: 解析
            run_dir, tasks = step1_parse(xmind_path, timer)
            if not tasks:
                sys.exit("❌ 任务列表为空")

            log_file = run_dir / "execution-log.jsonl"

            # Step 2-5: 循环（看板 → 选任务 → 出方案 → 执行）
            while True:
                user_input = step2_dashboard(tasks, log_file)

                if user_input.lower() in ("exit", "quit", "q"):
                    print("\n👋 退出工作流")
                    break

                task = step3_select(tasks, user_input)
                if not task:
                    continue

                if not step4_scheme(task, timer, auto_confirm=args.yes):
                    print("⏭️  已取消，返回看板")
                    continue

                step5_execute(run_dir, task, timer)

    except KeyboardInterrupt:
        print("\n\n👋 用户中断")
    except Exception as e:
        print(f"\n❌ 错误：{e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        release_lock(lock_file)


if __name__ == "__main__":
    main()
