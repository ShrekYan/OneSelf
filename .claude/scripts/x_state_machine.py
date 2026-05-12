#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 状态机
v4.4
功能：
  1. 定义所有状态和状态转移规则
  2. 根据当前状态和输入返回下一个状态
"""
import sys
import json
from pathlib import Path
from typing import Dict, Tuple, Optional

# 常量
RUNS_DIR = Path(".claude/runs").resolve()

# 状态机定义：当前状态 → (输入pattern → (下一个状态, action))
STATE_MACHINE = {
    # ========================================================================
    # ready 状态：就绪，显示看板，等待用户选择任务
    # ========================================================================
    "ready": {
        # 用户选择任务 T001 → 先进入方案预览确认状态（🔴 v4.5.1 新增）
        "generate_scheme": ("scheme_previewing", "选中任务，确认是否生成方案"),
        # 查看方案
        "view_scheme": ("ready", "仅查看方案，不执行"),
        # 强制执行
        "force_execute": ("executing", "跳过审核，直接执行"),
        # 刷新状态
        "refresh_status": ("ready", "刷新状态看板"),
        # 查看报告
        "show_report": ("ready", "显示执行报告"),
        # 退出
        "exit": ("exit", "退出工作流"),
    },

    # ========================================================================
    # scheme_previewing 状态：已选中任务，等待用户确认是否生成方案
    # 🔴 v4.5.1 新增状态
    # ========================================================================
    "scheme_previewing": {
        # 用户确认生成方案 → 进入 executing 状态，开始生成方案
        "confirm_scheme": ("executing", "确认生成方案，开始执行"),
        # 用户取消，返回看板
        "go_back": ("ready", "取消选择，返回任务看板"),
        # 退出
        "exit": ("exit", "退出工作流"),
    },

    # ========================================================================
    # executing 状态：方案已显示，等待用户确认 + 执行写入
    # ========================================================================
    "executing": {
        # 用户确认执行
        "execute": ("ready", "用户确认，执行完成"),
        # 用户取消
        "cancel": ("ready", "用户取消，返回就绪状态"),
        # 用户修改方案
        "edit_scheme": ("executing", "修改方案后重新预览"),
        # 执行完成自动返回
        "_complete_": ("ready", "任务执行完成，返回就绪状态"),
        # 返回
        "go_back": ("ready", "返回就绪状态"),
    },

    # ========================================================================
    # exit 状态：终端状态
    # ========================================================================
    "exit": {
        # 终端状态，不再接受输入
    },
}


def get_next_state(current_state: str, action: str) -> Optional[Tuple[str, str]]:
    """获取下一个状态"""
    if current_state not in STATE_MACHINE:
        return None

    state_rules = STATE_MACHINE[current_state]
    if action not in state_rules:
        return None

    return state_rules[action]


def get_current_state() -> str:
    """获取当前状态"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return "ready"

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                run_dir = Path(line.strip().replace("RUN_DIR=", ""))
                status_file = run_dir / "task-status.json"
                if status_file.exists():
                    with open(status_file, "r", encoding="utf-8") as sf:
                        data = json.load(sf)
                        return data.get("current_state", "ready")

    return "ready"


def set_current_state(new_state: str) -> None:
    """设置当前状态"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                run_dir = Path(line.strip().replace("RUN_DIR=", ""))
                status_file = run_dir / "task-status.json"
                if status_file.exists():
                    with open(status_file, "r", encoding="utf-8") as sf:
                        data = json.load(sf)
                    data["current_state"] = new_state
                    with open(status_file, "w", encoding="utf-8") as sf:
                        json.dump(data, sf, indent=2, ensure_ascii=False)
                break


def get_selected_task_id() -> str:
    """获取当前选中的任务 ID"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return ""

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                run_dir = Path(line.strip().replace("RUN_DIR=", ""))
                status_file = run_dir / "task-status.json"
                if status_file.exists():
                    with open(status_file, "r", encoding="utf-8") as sf:
                        data = json.load(sf)
                        return data.get("selected_task_id", "")
    return ""


def set_selected_task_id(task_id: str) -> None:
    """设置当前选中的任务 ID"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                run_dir = Path(line.strip().replace("RUN_DIR=", ""))
                status_file = run_dir / "task-status.json"
                if status_file.exists():
                    with open(status_file, "r", encoding="utf-8") as sf:
                        data = json.load(sf)
                    data["selected_task_id"] = task_id
                    with open(status_file, "w", encoding="utf-8") as sf:
                        json.dump(data, sf, indent=2, ensure_ascii=False)
                break


def main():
    if len(sys.argv) < 2:
        # 无参数时显示所有状态定义
        print("📊 XMind 工作流状态机 v4.4")
        print("=" * 60)
        for state, transitions in STATE_MACHINE.items():
            print(f"\n🔹 状态：{state}")
            for action, (next_state, desc) in transitions.items():
                print(f"   {action:<20} → {next_state:<15} # {desc}")
        return

    command = sys.argv[1]

    if command == "get":
        # 获取当前状态
        print(get_current_state())

    elif command == "set":
        # 设置当前状态
        if len(sys.argv) > 2:
            set_current_state(sys.argv[2])
            print(f"✅ 状态已设置为：{sys.argv[2]}")

    elif command == "next":
        # 计算下一个状态
        if len(sys.argv) > 3:
            current = sys.argv[2]
            action = sys.argv[3]
            result = get_next_state(current, action)
            if result:
                next_state, desc = result
                print(f"{next_state}:{desc}")
            else:
                print(f"unknown:无匹配转移规则 {current} + {action}")


if __name__ == "__main__":
    main()
