#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 任务状态显示工具
v4.0
功能：
  1. 显示任务清单概览表格
  2. 跨窗口依赖检查
  3. 并发文件修改警告
"""
import os
import sys
import json
from pathlib import Path
from collections import defaultdict

# 常量定义
RUNS_DIR = Path(".claude/runs").resolve()


def load_last_run_dir() -> Path:
    """加载当前运行目录"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        print("❌ 错误：找不到 .last-run 文件")
        sys.exit(1)

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                return Path(line.strip().replace("RUN_DIR=", "")).resolve()

    print("❌ 错误：无法从 .last-run 中找不到 RUN_DIR")
    sys.exit(1)


def display_task_overview(run_dir: Path) -> None:
    """显示任务清单概览"""
    manifest_file = run_dir / "task-manifest.json"
    status_file = run_dir / "task-status.json"

    if not manifest_file.exists():
        print(f"❌ 错误：找不到 task-manifest.json")
        return

    # 读取任务清单
    with open(manifest_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # 读取任务状态
    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as f:
            status = json.load(f)
    else:
        status = {"tasks": {}}

    print(f"📋 运行目录：{run_dir.name}")
    print("=" * 70)
    print(f"{'任务ID':<6} {'目标':<35} {'执行模式':<15} {'状态':<10}")
    print("=" * 70)

    for task in manifest.get("tasks", []):
        task_id = task.get("task_id", "")
        goal = task.get("goal", "")
        mode = task.get("execution_mode", "review-first")

        # 获取状态
        task_status = status.get("tasks", {}).get(task_id, {}).get("status", "pending")

        # 模式图标
        if mode == "plan-only":
            mode_icon = "📋 plan-only"
        elif mode == "review-first":
            mode_icon = "👀 review-first"
        else:
            mode_icon = "⚡ auto-exec"

        # 状态图标（完整状态枚举）
        if task_status == "completed":
            status_icon = "✅"
        elif task_status == "scheme-previewed":
            status_icon = "👁️"
        elif task_status == "scheme-confirmed":
            status_icon = "✔️"
        elif task_status == "executing":
            status_icon = "⚡"
        elif task_status == "reviewing":
            status_icon = "📋"
        elif task_status == "skipped":
            status_icon = "⏭️"
        else:
            status_icon = "⏸️"

        # 截断过长的目标
        goal_display = goal[:33] + ("..." if len(goal) > 33 else "")

        print(f"  {task_id:<4} | {goal_display:<35} | {mode_icon:<15} | {status_icon} {task_status}")

    print("=" * 70)


def check_dependencies(run_dir: Path) -> None:
    """跨窗口依赖检查"""
    print("🔗 P1 跨窗口依赖检查...")

    manifest_file = run_dir / "task-manifest.json"
    if not manifest_file.exists():
        print("  ⚠️  找不到 task-manifest.json，跳过依赖检查")
        print("")
        return

    with open(manifest_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    tasks = manifest.get("tasks", [])
    warnings = 0

    for task in tasks:
        task_id = task.get("task_id", "")
        deps = task.get("explicit_dependencies", [])
        if deps:
            print(f"  {task_id}: 依赖 {', '.join(deps)}")

    if warnings > 0:
        print(f"  ⚠️  共 {warnings} 个任务存在未完成的依赖")

    print("")


def check_concurrent_modifications() -> None:
    """并发文件修改警告检查"""
    print("⚠️  P1 并发文件修改检查...")

    conflict_count = 0
    file_owners = defaultdict(list)

    # 收集所有已修改的文件
    for result_file in RUNS_DIR.rglob("result*.md"):
        if result_file.is_file():
            run_dir = result_file.parent
            run_name = run_dir.name

            try:
                with open(result_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        # 匹配 ✅ 文件路径 或 📝 文件路径 格式
                        if (line.startswith("✅ ") or line.startswith("📝 ")) and any(
                            ext in line for ext in [
                                ".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".yml", ".yaml", ".json", ".md"
                            ]
                        ):
                            # 提取文件路径
                            file_path = line[2:].strip()
                            # 移除 "(已创建)" 和 "(已更新)"
                            for suffix in [" (已创建)", " (已更新)"]:
                                if file_path.endswith(suffix):
                                    file_path = file_path[: -len(suffix)]

                            if file_path and run_name not in file_owners[file_path]:
                                file_owners[file_path].append(run_name)
            except Exception:
                continue

    # 检查冲突
    for file_path, owners in file_owners.items():
        if len(owners) > 1:
            conflict_count += 1
            print(f"  ⚠️  {file_path}")
            print(f"     → 被以下目录修改：{' '.join(owners)}")

    if conflict_count == 0:
        print("  ✅ 未检测到跨窗口文件修改冲突")
    else:
        print("")
        print("  💡 提示：以上文件已被多个窗口修改，可能存在冲突")
        print("     执行时会再次警告，也可以使用 exec 强制执行")

    print("")


def display_execution_modes() -> None:
    """显示执行模式说明"""
    print("📊 执行模式说明（每个任务独立）：")
    print("")
    print("  📋 plan-only     → 只生成方案，不执行代码")
    print("  👀 review-first  → 生成方案 + 理由，用户确认后再执行（默认）")
    print("  ⚡ auto-exec     → 自动执行，不需要确认")
    print("")


def display_instructions() -> None:
    """显示可用指令说明"""
    print("========================================")
    print("📊 状态看板使用说明：")
    print("========================================")
    print("")
    print("所有方案和执行结果都会被永久保存，100% 可追溯。")
    print("")

    print("可用指令：")
    print("  T001         → 执行 T001（根据该任务的 execution_mode 决定是否需要确认）")
    print("  view T001    → 只查看 T001 方案，不执行")
    print("  exec T001    → 强制直接执行 T001，跳过审核")
    print("  yes          → 确认当前方案，开始执行")
    print("  no           → 取消当前任务")
    print("  edit 你的修改意见 → 根据你的意见调整方案，支持多轮迭代")
    print("                  示例：edit 把枚举名改成 DepartType，放到 constants 目录")
    print("  status       → 刷新显示状态看板")
    print("  report       → 查看执行报告")
    print("  exit         → 退出工作流，生成最终报告")
    print("")


def display_traceability_files(run_dir: Path) -> None:
    """显示可追溯文件清单"""
    print("========================================")
    print("📦 强制保存的可追溯文件（v4.1 扁平化结构）：")
    print(f"  • Tasks/T001_scheme.md → 每个任务的完整代码方案")
    print(f"  • Tasks/T001_result.md → 每个任务的执行结果 + 质量检查")
    print(f"  • task-status.json          → 任务状态跟踪（包含 execution_mode）")
    print(f"  • task-manifest.json        → 结构化任务清单（五要素完整信息）")
    print(f"  • run-info.json             → 运行元信息")
    print(f"  • task-definition.md        → 原始任务定义")
    print(f"  • execution-plan.md         → 人类可读执行计划")
    print(f"  • final-report.md           → 最终执行报告（所有任务完成后）")
    print("========================================")
    print("")

    print(f"⚠️  关键：必须以 {run_dir}/task-status.json 为状态的唯一真相来源")
    print("请按以下顺序读取：")
    print(f"  1. 首先读取 {run_dir}/task-status.json → 获取所有任务的真实状态 + execution_mode")
    print(f"  2. 然后读取 {run_dir}/task-manifest.json → 补充任务的五要素完整信息")
    print("")

    print("特别注意：")
    print("  • 每个任务的 status 必须从 task-status.json 读取")
    print("  • 每个任务的 execution_mode 决定执行行为")
    print("")
    print("状态枚举说明：")
    print("  • pending          = 'completed'        → [✅] 已完成")
    print("  • status = 'pending'          → [⏸️] 待执行")
    print("  • status = 'scheme-previewed' → [👁️] 方案已预览待确认")
    print("  • status = 'scheme-confirmed' → [✔️] 方案已确认待执行")
    print("  • status = 'executing'      → [⚡] 执行中")
    print("  • status = 'reviewing'      → [📋] 审核中")
    print("  • status = 'skipped'          → [⏭️] 已跳过")
    print("  • 不要将已完成的任务显示为待执行")
    print("")

    print("然后显示当前所有任务的状态看板（显示每个任务的 execution_mode）")
    print("")


def display_post_execution_logic() -> None:
    """显示任务执行后逻辑"""
    print("📋 任务执行后逻辑：")
    print("  1. 每个任务执行完成后，自动检查所有任务状态")
    print("  2. 如果所有任务都是 completed 或 skipped，自动生成 final-report.md")
    print("  3. 生成报告后显示提示：🎉 所有任务已完成，最终报告已生成")
    print("")


def display_interaction_flow() -> None:
    """显示方案确认交互流程"""
    print("💡 方案确认交互流程（重要）：")
    print("  当方案展示后，你可以：")
    print("")
    print("  • yes        → ✅ 确认方案，开始执行代码")
    print("  • no         → ❌ 取消任务，不执行任何修改")
    print("  • edit + 意见 → 🔄 根据你的修改意见重新生成方案")
    print("                  支持多轮迭代，直到你满意再输入 yes 确认")
    print("")
    print("  示例：edit 把枚举名改成 DepartType，放到 constants 目录")
    print("")


def display_command_behavior(run_dir: Path) -> None:
    """显示用户指令行为说明"""
    print("💡 任务指令说明（task-executor v3.0 - 先审后写）：")
    print("  • 当用户输入 T001 时：")
    print("    1. 读取 T001 的 execution_mode")
    print("    2. 如果是 plan-only：只在控制台展示方案，不写任何文件，不执行")
    print("    3. 如果是 review-first：控制台展示方案 + 理由 → 用户确认后才写文件 + 执行")
    print("    4. 如果是 auto-exec：直接生成方案并执行，执行完成后一次性写文件")
    print(f"    5. 自动记录当前任务到 {run_dir}/.current-task（仅记录 task_id）")
    print("")
    print("  • 当用户输入 exec T001 时：")
    print("    强制直接执行，忽略 execution_mode")
    print("")

    print("💡 【铁律 - 6 条红线全部保留，只调整写入时机】")
    print("  ✅ 红线 1：scheme.md 必须写，但只在 yes 确认后写（第一次也是最后一次）")
    print("  ✅ 红线 2：result.md 必须写，执行完成后写")
    print("  ✅ 红线 3：task-status.json 必须更新，执行完成后更新")
    print("  ✅ 红线 4：代码方案必须完整，不能用摘要")
    print("  ✅ 红线 5：严禁自动推进到下一个任务")
    print("  ✅ 红线 6：所有任务完成时自动生成 final-report.md")
    print("")
    print("  💡 内存迭代，零中间文件：")
    print("  ✅ 所有 edit 迭代都在内存中完成，不写任何中间文件")
    print("  ✅ no 取消时，什么都不写，干净退出")
    print("")

    print("💡 用户指令行为：")
    print("  • T00x → 读取任务 → 控制台展示方案 → 不写任何文件 → 等待 yes/no/edit")
    print("  • edit xxx → 内存中修改方案 → 控制台展示 → 不写任何文件")
    print("  • yes → 写 scheme.md → 执行代码 → 写 result.md → 更新 status → 清理状态")
    print("  • no → 清理状态 → 不写任何文件 → 干净退出")
    print("  • exec T00x → 直接执行 → 执行完一次性写所有文件")
    print("")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="XMind 工作流任务状态工具")
    parser.add_argument("--overview", action="store_true", help="只显示任务清单概览")
    parser.add_argument("--deps", action="store_true", help="只显示依赖检查")
    parser.add_argument("--conflicts", action="store_true", help="只显示并发修改检查")
    parser.add_argument("--modes", action="store_true", help="只显示执行模式说明")
    parser.add_argument("--full", action="store_true", help="显示完整状态看板")

    args = parser.parse_args()

    # 加载当前运行目录
    run_dir = load_last_run_dir()

    if args.overview:
        display_task_overview(run_dir)
        return

    if args.deps:
        check_dependencies(run_dir)
        return

    if args.conflicts:
        check_concurrent_modifications()
        return

    if args.modes:
        display_execution_modes()
        return

    # 默认显示完整状态看板
    print("")
    print("========================================")
    print("✅ XMind 解析完成！进入五要素智能执行模式 v4.0")
    print("========================================")
    print("")

    display_task_overview(run_dir)
    check_dependencies(run_dir)
    check_concurrent_modifications()
    display_execution_modes()
    display_instructions()
    display_traceability_files(run_dir)
    display_post_execution_logic()
    display_interaction_flow()
    display_command_behavior(run_dir)


if __name__ == "__main__":
    main()
