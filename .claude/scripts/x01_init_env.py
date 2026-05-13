#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 01：初始化环境 + 竞态防护
v4.4
功能：
  1. 调用 run_initializer.py 检测模式
  2. 竞态条件防护（基于目录锁）
  3. 显示当前状态摘要
"""
import os
import sys
import time
import subprocess
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


def run_shell_command(cmd: str, capture: bool = False) -> str:
    """执行 Shell 命令"""
    if capture:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip()
    else:
        subprocess.run(cmd, shell=True)
        return ""


def detect_mode_and_get_lock_id(input_path: str) -> str:
    """检测模式并获取锁 ID"""
    return run_shell_command(
        f'python3 .claude/scripts/run_initializer.py "{input_path}" --lock-id',
        capture=True
    )


def acquire_lock(lock_file: Path, max_retries: int = 10) -> bool:
    """获取目录锁（竞态防护）
    最多重试 10 次，累计等待约 55 秒
    """
    print("🔒 P0 竞态条件检查...")

    for i in range(1, max_retries + 1):
        try:
            lock_file.mkdir()
            print("✅ 拿到锁，继续执行")
            return True
        except FileExistsError:
            print(f"⏳ 另一个窗口正在处理，等待 {i} 秒...")
            time.sleep(i)

    print("")
    print("❌ 超时：另一个窗口仍在处理，请稍后重试")
    print("   如果确认没有其他窗口在运行，请手动删除：")
    print(f"   rmdir {lock_file}")
    return False


def release_lock(lock_file: Path) -> None:
    """释放锁"""
    try:
        lock_file.rmdir()
    except:
        pass


def main():
    if len(sys.argv) < 2:
        print("❌ 错误：缺少 input 参数")
        sys.exit(1)

    input_path = sys.argv[1]

    # --------------------------------------------------------------------------
    # 1. 调用初始化脚本检测模式
    # --------------------------------------------------------------------------
    # 支持传递 --task 参数
    task_arg = ""
    if len(sys.argv) > 2:
        task_arg = f' --task {sys.argv[2]}'

    run_shell_command(f'python3 .claude/scripts/run_initializer.py "{input_path}"{task_arg}')

    # --------------------------------------------------------------------------
    # 2. 竞态条件防护（物理多开专用）
    # --------------------------------------------------------------------------
    # 检查是否是 run 模式（不需要锁）
    is_run_mode = RUNS_DIR / ".run-mode"
    if not is_run_mode.exists():
        # 获取锁 ID
        lock_id = detect_mode_and_get_lock_id(input_path)
        lock_file = RUNS_DIR / f".lock.{lock_id}"

        # 获取锁
        if not acquire_lock(lock_file):
            sys.exit(1)

        # 注册退出时自动释放锁（在 Python 中用 atexit）
        import atexit
        atexit.register(lambda: release_lock(lock_file))

        print("")

    # --------------------------------------------------------------------------
    # 3. 显示当前状态摘要
    # --------------------------------------------------------------------------
    if (RUNS_DIR / ".last-run").exists():
        run_shell_command('python3 .claude/scripts/run_status.py --summary')
    else:
        print("")
        print("📊 当前状态：⏳ 环境待初始化")
        print("   → 运行目录尚未创建，继续执行 workflow 即可")
        print("")


if __name__ == "__main__":
    main()
