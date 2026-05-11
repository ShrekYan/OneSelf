#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 严格命令解析器
v4.4
功能：
  1. 严格正则匹配，不做模糊猜测
  2. 大小写不敏感
  3. 返回 action:target 格式
"""
import os
import sys
import re
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()

# 命令匹配模式（正则，大小写不敏感）
COMMAND_PATTERNS = [
    # 🔹 任务编号：严格匹配 "T" + 数字（如 T001、T002）
    (r'^[Tt](\d{1,3})$', 'generate_scheme'),
    # 🔹 查看方案：严格匹配 "VIEW Txxx"
    (r'^[Vv][Ii][Ee][Ww] [Tt](\d{1,3})$', 'view_scheme'),
    # 🔹 强制执行：严格匹配 "EXEC Txxx"
    (r'^[Ee][Xx][Ee][Cc] [Tt](\d{1,3})$', 'force_execute'),
    # 🔹 确认执行：严格匹配 "YES"
    (r'^[Yy][Ee][Ss]$', 'execute'),
    # 🔹 取消执行：严格匹配 "NO"
    (r'^[Nn][Oo]$', 'cancel'),
    # 🔹 修改方案：严格匹配 "EDIT " 开头
    (r'^[Ee][Dd][Ii][Tt] (.*)$', 'edit_scheme'),
    # 🔹 其他命令
    (r'^[Ss][Tt][Aa][Tt][Uu][Ss]$', 'refresh_status'),
    (r'^[Rr][Ee][Pp][Oo][Rr][Tt]$', 'show_report'),
    (r'^[Ee][Xx][Ii][Tt]$', 'exit'),
    (r'^[Bb][Aa][Cc][Kk]$', 'go_back'),
]


def parse_command(user_input: str) -> str:
    """解析用户输入，返回 action:target 格式"""
    # 去除首尾空格
    user_input = user_input.strip()

    for pattern, action in COMMAND_PATTERNS:
        match = re.match(pattern, user_input)
        if match:
            if match.groups():
                # 有捕获组（如 T001 捕获 001，或者 EDIT xxx 捕获内容）
                target = match.group(1)
                # 如果是任务编号，需要补全为 Txxx 格式
                if action in ['generate_scheme', 'view_scheme', 'force_execute']:
                    if target.isdigit():
                        task_id = f"T{target.zfill(3)}"
                        return f"{action}:{task_id}"
                return f"{action}:{target}"
            else:
                # 无捕获组（如 status、exit）
                return action

    # 未知命令
    return f"unknown:{user_input}"


def check_auto_command() -> str:
    """检查是否有自动命令文件（一次性使用）"""
    auto_cmd_file = RUNS_DIR / ".auto-command"
    if auto_cmd_file.exists():
        with open(auto_cmd_file, "r", encoding="utf-8") as f:
            auto_cmd = f.read().strip()
        auto_cmd_file.unlink()  # 用完即删，只执行一次
        if auto_cmd:
            print(f"🤖 执行自动命令：{auto_cmd}", file=sys.stderr)
            return auto_cmd
    return ""


def main():
    # 优先检查自动命令文件
    auto_cmd = check_auto_command()
    if auto_cmd:
        print(parse_command(auto_cmd))
        return

    # 从 stdin 读取用户输入
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
    else:
        user_input = sys.stdin.read().strip()

    print(parse_command(user_input))


if __name__ == "__main__":
    main()
