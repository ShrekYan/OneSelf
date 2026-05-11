#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 03：确定性脚本解析 + Agent 兜底
v4.4
功能：
  1. 优先使用 xmind_parser.py 快速解析（0.5 秒）
  2. 校验解析结果完整性
  3. 脚本失败时自动降级调用 Agent 兜底
"""
import os
import sys
import json
import subprocess
from pathlib import Path

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


def run_shell_command(cmd: str, capture: bool = False) -> int:
    """执行 Shell 命令，返回退出码"""
    result = subprocess.run(cmd, shell=True, capture_output=capture, text=True)
    return result.returncode


def get_run_dir() -> Path:
    """从 .last-run 获取当前运行目录"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        print("❌ 错误：找不到 .last-run 文件")
        print("💡 可能原因：")
        print("   1. 初始化步骤未执行")
        print("   2. 工作流步骤顺序有误")
        print("💡 修复方法：")
        print("   1. 确保步骤 2 已执行：run_initializer.py --init")
        print("   2. 或手动重新运行完整工作流")
        sys.exit(1)

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                return Path(line.strip().replace("RUN_DIR=", "")).resolve()

    print("❌ 错误：无法从 .last-run 中找到 RUN_DIR")
    sys.exit(1)


def verify_parse_result(run_dir: Path) -> bool:
    """校验解析结果完整性"""
    print("🔍 校验解析结果完整性...")
    all_ok = True

    # 检查所有必需的文件
    required_files = [
        "task-manifest.json",
        "task-status.json",
        "execution-plan.md",
        "task-definition.md",
    ]

    for filename in required_files:
        file_path = run_dir / filename
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"   ✅ {filename} ({size} 字节)")
        else:
            print(f"   ❌ {filename} 缺失")
            all_ok = False

    # 验证 JSON 格式
    manifest_path = run_dir / "task-manifest.json"
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            json.load(f)
        print("   ✅ task-manifest.json JSON 格式正确")
    except:
        print("   ❌ task-manifest.json JSON 格式错误")
        all_ok = False

    return all_ok


def show_parse_summary(run_dir: Path) -> None:
    """显示解析结果统计"""
    print("")
    print("📊 解析结果统计：")

    manifest_path = run_dir / "task-manifest.json"
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        tasks = manifest.get("tasks", [])
        print(f"   任务数量：{len(tasks)}")
        if "execution_plan" in manifest:
            duration = manifest["execution_plan"].get("estimated_duration", "未知")
            print(f"   预计耗时：{duration}")

        for task in tasks:
            task_id = task.get("task_id", "")
            module = task.get("module", "")
            goal = task.get("goal", "")[:50]
            print(f"   {task_id}: {module} - {goal}...")
    except Exception as e:
        print(f"   ⚠️  无法读取统计信息：{e}")


def main():
    if len(sys.argv) < 2:
        print("❌ 错误：缺少 input 参数")
        sys.exit(1)

    input_path = sys.argv[1]

    # 获取 RUN_DIR
    run_dir = get_run_dir()

    print("=" * 40)
    print("🚀 确定性脚本解析 v1.0（优先执行）")
    print("=" * 40)
    print(f"📄 输入文件：{input_path}")
    print(f"📂 输出目录：{run_dir.name}")
    print("")

    # ============================================================
    # ✅ 直接执行脚本，捕获结果
    # ============================================================
    exit_code = run_shell_command(
        f'python3 .claude/scripts/xmind_parser.py "{input_path}" "{run_dir}"'
    )

    print("")

    if exit_code == 0:
        print("✅ 脚本解析成功！")
        print("")

        # ============================================================
        # ✅ 校验解析结果完整性
        # ============================================================
        all_ok = verify_parse_result(run_dir)
        print("")

        if all_ok:
            print("✅ 所有校验通过！")
            show_parse_summary(run_dir)

            # ✅ 移除解析标记，后续步骤不会再调用 Agent
            parse_needed = RUNS_DIR / ".parse-needed"
            if parse_needed.exists():
                parse_needed.unlink()

            print("")
            print("=" * 40)
            print("✅ 解析完成（确定性脚本模式）")
            print("=" * 40)
            print("")
        else:
            print("❌ 校验未通过")
            print("   → 自动降级调用 Agent 兜底")
            print("")
            # 保留标记，继续用 Agent

    elif exit_code == 2:
        print("⚠️  脚本无法解析复杂结构（退出码 2）")
        print("   → 自动降级调用 Agent 兜底")
        print("")
        # 保留标记，继续用 Agent

    else:
        print(f"❌ 脚本执行错误（退出码：{exit_code}）")
        print("   → 自动降级调用 Agent 兜底")
        print("")
        # 保留标记，继续用 Agent


if __name__ == "__main__":
    main()
