#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 07：显示最终结果 + 下一步提示
v4.4
功能：
  1. 刷新状态看板
  2. 显示下一步操作提示
"""
import os
import sys
import subprocess
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


def run_shell_command(cmd: str) -> None:
    """执行 Shell 命令"""
    subprocess.run(cmd, shell=True)


def main():
    print("")
    print("=" * 40)
    print("✅ 任务执行完成")
    print("=" * 40)
    print("")

    # 刷新状态看板
    run_shell_command('python3 .claude/scripts/task_status.py --overview')

    print("")
    print("💡 下一步操作：")
    print("  • 选择下一个任务继续执行（如输入 T002）")
    print("  • 输入 status 刷新状态看板")
    print("  • 输入 report 查看执行报告")
    print("  • 输入 exit 退出工作流")
    print("")
    print("=" * 40)
    print("👉 请输入下一步指令：")
    print("=" * 40)


if __name__ == "__main__":
    main()
