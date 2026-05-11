#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新任务状态脚本 v4.0
用法: python3 update_status.py <run_dir> <task_id> <new_status>

支持的状态枚举：
- pending          → 待执行
- scheme-previewed → 方案已预览，待用户确认
- scheme-confirmed → 方案已确认，待执行
- executing       → 执行中
- completed        → 已完成
- reviewing       → 审核中
- skipped         → 已跳过
"""

import json
import sys
from pathlib import Path
from datetime import datetime


# 🔴 支持的状态枚举（唯一真相源）
VALID_STATUSES = {
    "pending",
    "scheme-previewed",
    "scheme-confirmed",
    "executing",
    "completed",
    "reviewing",
    "skipped",
}

# 推荐的状态迁移路径（仅作提示，不强制）
STATUS_FLOW = {
    "pending": ["scheme-previewed", "executing", "skipped"],
    "scheme-previewed": ["scheme-confirmed", "pending", "skipped"],
    "scheme-confirmed": ["executing", "scheme-previewed", "pending", "skipped"],
    "executing": ["completed", "scheme-previewed", "pending"],
    "reviewing": ["completed", "scheme-previewed", "pending", "skipped"],
}


def main():
    if len(sys.argv) < 4:
        print("用法: python3 update_status.py <run_dir> <task_id> <new_status>")
        print("")
        print("支持的状态：")
        for s in sorted(VALID_STATUSES):
            print(f"  - {s}")
        sys.exit(1)

    run_dir = Path(sys.argv[1])
    task_id = sys.argv[2]
    new_status = sys.argv[3]

    # 🔴 状态验证
    if new_status not in VALID_STATUSES:
        print(f"❌ 无效的状态: {new_status}")
        print(f"   支持的状态: {', '.join(sorted(VALID_STATUSES))}")
        sys.exit(1)

    status_file = run_dir / "task-status.json"

    if not status_file.exists():
        print(f"❌ 状态文件不存在: {status_file}")
        sys.exit(1)

    # 读取状态文件
    with open(status_file, 'r', encoding='utf-8') as f:
        status = json.load(f)

    if task_id not in status['tasks']:
        print(f"❌ 任务不存在: {task_id}")
        sys.exit(1)

    # 更新状态
    old_status = status['tasks'][task_id]['status']
    status['tasks'][task_id]['status'] = new_status

    # 更新时间戳
    now = datetime.now().isoformat()
    if 'updated_at' not in status:
        status['updated_at'] = {}
    status['updated_at'][task_id] = now

    # 写回文件
    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(status, f, indent=2, ensure_ascii=False)

    # 状态图标显示
    status_icons = {
        "pending": "⏸️",
        "scheme-previewed": "👁️",
        "scheme-confirmed": "✔️",
        "executing": "⚡",
        "completed": "✅",
        "reviewing": "📋",
        "skipped": "⏭️",
    }

    old_icon = status_icons.get(old_status, "")
    new_icon = status_icons.get(new_status, "")

    print(f"✅ 状态更新: {task_id} {old_icon} {old_status} → {new_icon} {new_status}")

    # 提示推荐的下一步状态
    if new_status in STATUS_FLOW:
        next_states = STATUS_FLOW[new_status]
        if next_states:
            next_icons = [f"{status_icons.get(s, '')} {s}" for s in next_states]
            print(f"   💡 推荐的下一步状态: {', '.join(next_icons)}")


if __name__ == "__main__":
    main()
