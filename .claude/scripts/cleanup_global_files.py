#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理旧版本的全局中间文件（竞态根源）
v5.0 架构不再需要这些文件

删除的文件：
  - .init-needed
  - .target-path
  - .last-run
  - .auto-command
  - .parse-needed
  - .skip-init
  - .skip-parse
  - .run-mode
"""
import os
from pathlib import Path

RUNS_DIR = Path(".claude/runs").resolve()

# 需要清理的全局中间文件列表
GLOBAL_FILES = [
    ".init-needed",
    ".target-path",
    ".last-run",
    ".auto-command",
    ".parse-needed",
    ".skip-init",
    ".skip-parse",
    ".run-mode",
]


def main():
    print("=" * 60)
    print("🧹 清理旧版本全局中间文件（竞态根源）")
    print("=" * 60)
    print("")
    print(f"📂 目录: {RUNS_DIR}")
    print("")

    deleted_count = 0
    for filename in GLOBAL_FILES:
        file_path = RUNS_DIR / filename
        if file_path.exists():
            try:
                if file_path.is_file():
                    file_path.unlink()
                else:
                    file_path.rmdir()
                print(f"  ✅ 已删除: {filename}")
                deleted_count += 1
            except Exception as e:
                print(f"  ❌ 删除失败: {filename} - {e}")

    print("")
    if deleted_count > 0:
        print(f"✅ 已删除 {deleted_count} 个全局中间文件")
        print("")
        print("💡 v5.0 架构不再需要这些文件，所有状态在内存中传递")
    else:
        print("✅ 没有需要清理的全局中间文件")

    print("")
    print("=" * 60)


if __name__ == "__main__":
    main()
