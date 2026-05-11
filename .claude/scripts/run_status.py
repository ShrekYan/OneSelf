#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - Run 目录状态汇总工具
v4.0
功能：
  1. 一条命令显示当前 run 目录的完整状态
  2. 清楚展示哪些文件已生成，哪些缺失，为什么缺失
  3. 显示下一步操作提示
"""
import sys
import json
from pathlib import Path
from typing import Dict, List, Tuple

# 常量定义
RUNS_DIR = Path(".claude/runs").resolve()


def get_file_status(file_path: Path) -> Tuple[bool, str]:
    """获取文件状态"""
    if not file_path.exists():
        return False, "❌ [缺失]"

    # 检查内容是否为空
    if file_path.stat().st_size == 0:
        return False, "⚠️  [空文件]"

    return True, "✅ [已生成]"


def load_last_run_dir() -> Path:
    """加载当前运行目录"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        print("❌ 错误：找不到 .last-run 文件")
        print("💡 提示：请先运行初始化步骤")
        sys.exit(1)

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                return Path(line.strip().replace("RUN_DIR=", "")).resolve()

    print("❌ 错误：无法从 .last-run 中找到 RUN_DIR")
    sys.exit(1)


def check_marker_files() -> List[Tuple[str, str]]:
    """检查标记文件，判断当前流程状态"""
    markers = []

    marker_defs = [
        (".parse-needed", "等待解析任务清单"),
        (".init-needed", "等待初始化 Run 目录"),
        (".run-mode", "--run 模式，继续执行已有任务"),
        (".skip-parse", "跳过解析步骤"),
        (".skip-init", "跳过初始化步骤"),
    ]

    for marker_name, description in marker_defs:
        marker_path = RUNS_DIR / marker_name
        if marker_path.exists():
            markers.append((marker_name, description))

    return markers


def display_run_status(run_dir: Path) -> None:
    """显示 Run 目录的完整状态"""
    print("")
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║                    📊 Run 目录状态汇总                        ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print("")
    print(f"📍  Run 目录: {run_dir.name}")
    print(f"📂  完整路径: {run_dir}")
    print("")

    # 定义需要检查的文件及其说明
    file_checks = [
        ("run-info.json", "运行元信息", "初始化时生成"),
        ("task-status.json", "任务状态跟踪", "初始化时生成，执行任务时更新"),
        ("task-manifest.json", "结构化任务清单", "Agent 解析 XMind 后生成"),
        ("task-definition.md", "原始任务定义", "Agent 解析 XMind 后生成"),
        ("execution-plan.md", "人类可读执行计划", "Agent 解析 XMind 后生成"),
        ("final-report.md", "最终执行报告", "所有任务完成后自动生成"),
        ("output-manifest.json", "多阶段产物清单", "所有任务完成后自动生成"),
    ]

    print("📋 文件状态：")
    print("─" * 70)

    max_name_len = max(len(name) for name, _, _ in file_checks)
    all_good = True
    has_manifest = False

    for filename, description, when_generated in file_checks:
        file_path = run_dir / filename
        exists, status = get_file_status(file_path)

        if not exists:
            all_good = False

        if filename == "task-manifest.json" and exists:
            has_manifest = True

        # 显示状态
        print(f"  {status} {filename:<{max_name_len}}  - {description}")
        if not exists:
            print(f"           💡 {when_generated}")

    print("")

    # 检查 Tasks 目录
    tasks_dir = run_dir / "Tasks"
    if tasks_dir.exists():
        task_count = len([d for d in tasks_dir.iterdir() if d.is_dir()])
        print(f"  📂 Tasks/ 目录           - {task_count} 个任务子目录")
    else:
        print(f"  ❌ Tasks/ 目录           - 缺失")
        all_good = False

    print("")

    # 检查标记文件（流程状态）
    markers = check_marker_files()
    if markers:
        print("🚦 流程状态标记：")
        print("─" * 70)
        for marker, desc in markers:
            print(f"  • {marker:<20} → {desc}")
        print("")

    # 显示任务统计（如果有 manifest）
    if has_manifest:
        try:
            with open(run_dir / "task-manifest.json", "r", encoding="utf-8") as f:
                manifest = json.load(f)
                tasks = manifest.get("tasks", [])
                print(f"📊 任务统计：")
                print("─" * 70)
                print(f"  • 总任务数: {len(tasks)} 个")

                # 统计执行模式
                mode_counts = {}
                for task in tasks:
                    mode = task.get("execution_mode", "unknown")
                    mode_counts[mode] = mode_counts.get(mode, 0) + 1

                for mode, count in sorted(mode_counts.items()):
                    print(f"    - {mode}: {count} 个")

                print("")
        except Exception as e:
            print(f"⚠️  读取 task-manifest.json 失败: {e}")
            print("")

    # 下一步提示
    print("💡 下一步操作提示：")
    print("─" * 70)

    if not (run_dir / "task-manifest.json").exists():
        if (RUNS_DIR / ".parse-needed").exists():
            print("  → 继续执行 workflow，下一步将调用 xmind-task-parser Agent 解析任务清单")
        else:
            print("  → 请先完成初始化步骤，然后调用 Agent 解析 XMind")
    else:
        print("  → 任务清单已就绪，可以开始执行任务")
        print("  → 输入 'T001' 执行第一个任务，或 'view T001' 查看方案")

    print("")
    print("═" * 70)

    if all_good:
        print("✅ 所有必需文件已就绪！")
    else:
        print("ℹ️  部分文件待生成，继续执行 workflow 即可")

    print("")


def display_summary() -> None:
    """显示简化的状态摘要（用于 workflow 每个步骤结束时）"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        print("")
        print("📊 当前状态：⏳ 环境待初始化")
        print("   → 运行目录尚未创建，继续执行 workflow 即可")
        print("")
        return

    run_dir = load_last_run_dir()

    print("")
    print("📊 当前状态：", end=" ")

    status_items = []

    if (run_dir / "run-info.json").exists():
        status_items.append("✅ 环境")
    else:
        status_items.append("❌ 环境")

    if (run_dir / "task-manifest.json").exists():
        status_items.append("✅ 任务清单")
    else:
        status_items.append("⏳ 任务清单")

    tasks_dir = run_dir / "Tasks"
    if tasks_dir.exists():
        task_count = len([d for d in tasks_dir.iterdir() if d.is_dir()])
        if task_count > 0:
            status_items.append(f"✅ {task_count} 个任务已执行")

    print(" / ".join(status_items))
    print("")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="XMind 工作流状态汇总工具")
    parser.add_argument("--summary", action="store_true", help="只显示简化摘要")
    parser.add_argument("--full", action="store_true", help="显示完整状态报告")

    args = parser.parse_args()

    if args.summary:
        display_summary()
        return

    # 默认显示完整状态
    run_dir = load_last_run_dir()
    display_run_status(run_dir)


if __name__ == "__main__":
    main()
