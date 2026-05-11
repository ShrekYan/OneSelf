#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 Agent 输出中提取内容并写入文件（Workflow 管控版 v4.0）
支持 xmind-task-parser 的分隔符格式
"""

import sys
import os
import re
import json
from pathlib import Path


def extract_content(output, start_marker, end_marker):
    """从 Agent 输出中提取指定标记之间的内容"""
    pattern = re.escape(start_marker) + r'(.*?)' + re.escape(end_marker)
    match = re.search(pattern, output, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def save_file(filepath, content):
    """保存内容到文件"""
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ 已保存: {filepath}")
    return True


def main():
    if len(sys.argv) < 3:
        print("用法: python3 parse_agent_output.py <agent_output_file> <run_dir>")
        print("")
        print("支持的 Agent 类型:")
        print("  - xmind-task-parser: 提取 task-manifest / task-status / execution-plan / run-info")
        sys.exit(1)

    agent_output_file = sys.argv[1]
    run_dir = Path(sys.argv[2])

    # 创建运行目录
    run_dir.mkdir(parents=True, exist_ok=True)

    # 读取 Agent 输出
    with open(agent_output_file, 'r', encoding='utf-8') as f:
        output = f.read()

    print("========================================")
    print("📋 Workflow 文件写入器 v4.0")
    print("========================================")
    print("")

    # ==================== 处理 xmind-task-parser 输出 ====================

    # 1. 提取并保存 task-manifest.json
    manifest_content = extract_content(output, '===TASK-MANIFEST-START===', '===TASK-MANIFEST-END===')
    if manifest_content:
        manifest_path = run_dir / 'task-manifest.json'
        # 验证 JSON 格式
        try:
            json.loads(manifest_content)
            save_file(manifest_path, manifest_content)
        except json.JSONDecodeError as e:
            print(f"❌ task-manifest.json JSON 格式错误: {e}")
    else:
        print("⚠️  未找到 task-manifest.json 内容")

    # 2. 提取并保存 task-status.json
    status_content = extract_content(output, '===TASK-STATUS-START===', '===TASK-STATUS-END===')
    if status_content:
        status_path = run_dir / 'task-status.json'
        try:
            json.loads(status_content)
            save_file(status_path, status_content)
        except json.JSONDecodeError as e:
            print(f"❌ task-status.json JSON 格式错误: {e}")
    else:
        print("⚠️  未找到 task-status.json 内容")

    # 3. 提取并保存 execution-plan.md
    plan_content = extract_content(output, '===EXECUTION-PLAN-START===', '===EXECUTION-PLAN-END===')
    if plan_content:
        plan_path = run_dir / 'execution-plan.md'
        save_file(plan_path, plan_content)
    else:
        print("⚠️  未找到 execution-plan.md 内容")

    # 4. 提取并保存 run-info.json
    run_info_content = extract_content(output, '===RUN-INFO-START===', '===RUN-INFO-END===')
    if run_info_content:
        run_info_path = run_dir / 'run-info.json'
        try:
            json.loads(run_info_content)
            save_file(run_info_path, run_info_content)
        except json.JSONDecodeError as e:
            print(f"❌ run-info.json JSON 格式错误: {e}")
    else:
        print("⚠️  未找到 run-info.json 内容")

    print("")
    print("========================================")
    print("✅ 所有文件已由 Workflow 完成写入")
    print("========================================")
    print("")
    print("📁 运行目录:", run_dir)
    print("")
    print("🔍 文件列表:")
    for f in sorted(run_dir.glob('*')):
        if f.is_file():
            size = f.stat().st_size
            print(f"   - {f.name} ({size} 字节)")


if __name__ == "__main__":
    main()
