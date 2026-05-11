#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 05：生成方案预览 + 具体执行计划
v4.4
功能：
  1. 显示方案预览流程说明
  2. 全部内容仅在控制台显示，不写任何文件
  3. 更新状态为 scheme-previewed
"""
import os
import sys
import subprocess
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


def main():
    print("=" * 40)
    print("📋 方案预览流程（纯内存，零文件写入）")
    print("=" * 40)
    print("")
    print("🔴 用户选择任务后，将执行以下流程：")
    print("")
    print("1. 📖 读取 T001 任务信息")
    print("2. 🧠 调用 task-scheme-generator 生成方案")
    print("   → 完整代码内容")
    print("   → 文件操作清单（创建/修改的文件）")
    print("   → 质量检查步骤（tsc + lint）")
    print("   → 执行统计（文件数、预计时间）")
    print("3. 👀 所有内容在控制台完整显示")
    print("4. 📝 更新状态为: scheme-previewed")
    print("5. ❓ 等待用户确认: yes / no / edit 意见")
    print("")
    print("=" * 40)
    print("💡 用户确认后才执行下一步")
    print("=" * 40)


if __name__ == "__main__":
    main()
