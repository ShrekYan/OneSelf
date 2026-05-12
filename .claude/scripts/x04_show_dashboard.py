#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 04：显示任务状态看板 + 自动执行命令
v4.5.1
功能：
  1. 调用 task_status.py 显示完整状态看板
  2. 显示版本信息、运行目录等上下文信息（🔴 v4.5.1 新增）
  3. 显示可用命令说明
  4. v4.3 新功能：启动时直接指定命令
"""
import os
import sys
import json
import subprocess
import re
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()
WORKFLOW_FILE = Path(".claude/workflows/xmind-exec.yml").resolve()


def run_shell_command(cmd: str) -> None:
    """执行 Shell 命令"""
    subprocess.run(cmd, shell=True)


def get_workflow_version() -> str:
    """获取工作流版本号"""
    if not WORKFLOW_FILE.exists():
        return "unknown"
    try:
        with open(WORKFLOW_FILE, "r", encoding="utf-8") as f:
            content = f.read()
            match = re.search(r'version:\s*([\d.]+)', content)
            if match:
                return match.group(1)
    except Exception:
        pass
    return "unknown"


def get_run_dir() -> str:
    """获取当前运行目录路径"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return "未找到"
    try:
        with open(last_run_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("RUN_DIR="):
                    return line.strip().replace("RUN_DIR=", "")
    except Exception:
        pass
    return "未找到"


def get_parser_version() -> str:
    """获取 XMind 解析器版本"""
    run_dir = get_run_dir()
    if run_dir == "未找到":
        return "unknown"
    manifest_file = Path(run_dir) / "task-manifest.json"
    if not manifest_file.exists():
        return "unknown"
    try:
        with open(manifest_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("parser_version", "unknown")
    except Exception:
        pass
    return "unknown"


def get_current_state() -> str:
    """获取当前状态机状态"""
    run_dir = get_run_dir()
    if run_dir == "未找到":
        return "ready"
    status_file = Path(run_dir) / "task-status.json"
    if not status_file.exists():
        return "ready"
    try:
        with open(status_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("current_state", "ready")
    except Exception:
        pass
    return "ready"


def main():
    # 检查是否有自动命令参数
    auto_cmd = sys.argv[1] if len(sys.argv) > 1 else None

    # 🔴 v4.5.1 新增：显示版本信息和上下文
    print("")
    print("=" * 60)
    print("📊 XMind 工作流 - 任务状态看板")
    print("=" * 60)
    print("")
    print(f"📦 工作流版本: v{get_workflow_version()}")
    print(f"📂 运行目录:   {get_run_dir()}")
    print(f"🧩 解析版本:   {get_parser_version()}")
    print(f"🎯 当前状态:   {get_current_state()}")
    print("")
    print("=" * 60)

    # 调用脚本显示完整状态看板
    print("")
    run_shell_command('python3 .claude/scripts/task_status.py --overview')

    print("")
    print("=" * 60)
    print("💡 可用指令（严格匹配，大小写不敏感）")
    print("=" * 60)
    print("  T001          → 选择 T001，进入方案生成确认")
    print("  exec T001     → 强制直接执行 T001，跳过审核（慎用）")
    print("  status        → 刷新显示状态看板")
    print("  report        → 查看执行报告")
    print("  exit          → 退出工作流")
    print("")
    print("🔴 【v4.5.1 流程说明】")
    print("   • 选择任务后先确认，确认后才生成方案")
    print("   • 方案包含：完整代码、文件清单、执行计划")
    print("   • 方案审核确认后，才真正写入文件")
    print("")
    print("🔴 【推荐流程】")
    print("   1. 输入 T001 选择任务")
    print("   2. 确认要生成此任务的方案")
    print("   3. 等待生成完整方案并仔细审核")
    print("   4. 输入 yes 确认执行（此时才写文件）")
    print("   5. 自动执行：文件写入 → tsc 检查 → lint 检查")
    print("   6. 执行完成后自动返回看板")
    print("")

    # ========================================================================
    # v4.3 新增：如果指定了 command 参数，自动执行
    # ========================================================================
    if auto_cmd and auto_cmd.strip() and auto_cmd != "null":
        print("=" * 60)
        print(f"🤖 检测到自动执行命令：{auto_cmd}")
        print("=" * 60)
        print("")
        print("⏳ 3 秒后自动执行（按 Ctrl+C 可取消）...")
        import time
        time.sleep(3)
        print("")
        print(f"✅ 自动执行命令：{auto_cmd}")
        print("")
    else:
        print("=" * 60)
        print("👉 请输入任务编号或指令（如 T001）：")
        print("=" * 60)


if __name__ == "__main__":
    main()
