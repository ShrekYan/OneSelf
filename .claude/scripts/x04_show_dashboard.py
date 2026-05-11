#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 04：显示任务状态看板 + 自动执行命令
v4.4
功能：
  1. 调用 task_status.py 显示完整状态看板
  2. 显示可用命令说明
  3. v4.3 新功能：启动时直接指定命令
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
    # 检查是否有自动命令参数
    auto_cmd = sys.argv[1] if len(sys.argv) > 1 else None

    print("")
    print("=" * 40)
    print("✅ XMind 解析完成！请选择任务开始执行")
    print("=" * 40)
    print("")

    # 调用脚本显示完整状态看板
    run_shell_command('python3 .claude/scripts/task_status.py --overview')

    print("")
    print("=" * 40)
    print("💡 可用指令（严格匹配，大小写不敏感）")
    print("=" * 40)
    print("  T001          → 查看 T001 方案预览（含执行计划）")
    print("  view T001     → 只查看 T001 方案，不执行")
    print("  exec T001     → 强制直接执行 T001，跳过审核（慎用）")
    print("  status        → 刷新显示状态看板")
    print("  report        → 查看执行报告")
    print("  exit          → 退出工作流")
    print("")
    print("🔴 【v4.3 新功能】启动时直接指定命令")
    print("   • 示例：/workflow xmind-exec.yml --input xxx --command T001")
    print("   • 示例：/workflow xmind-exec.yml --input xxx --command 'exec T001'")
    print("")
    print("🔴 【v4.2 重要说明】")
    print("   • 命令必须严格匹配格式，不做模糊猜测")
    print("   • 推荐使用：T001 → 预览方案 → yes 确认执行")
    print("   • exec Txxx 跳过审核模式请谨慎使用")
    print("   • 不支持 '执行T002' 这类非标准命令")
    print("")
    print("🔴 【执行流程】")
    print("   1. 选择任务（如输入 T001）")
    print("   2. 查看方案预览 + 具体执行计划")
    print("   3. 输入 yes 确认执行（此时才真正写文件）")
    print("   4. 执行完成后自动更新状态")
    print("")

    # ========================================================================
    # v4.3 新增：如果指定了 command 参数，自动执行
    # ========================================================================
    if auto_cmd and auto_cmd.strip() and auto_cmd != "null":
        print("=" * 40)
        print(f"🤖 检测到自动执行命令：{auto_cmd}")
        print("=" * 40)
        print("")
        print("⏳ 3 秒后自动执行（按 Ctrl+C 可取消）...")
        import time
        time.sleep(3)
        print("")
        print(f"✅ 自动执行命令：{auto_cmd}")
        print("")
    else:
        print("=" * 40)
        print("👉 请输入任务编号或指令（如 T001）：")
        print("=" * 40)


if __name__ == "__main__":
    main()
