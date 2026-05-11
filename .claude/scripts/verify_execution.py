#!/usr/bin/env python3
"""
执行验证脚本 v1.0

功能：
1. 验证业务文件是否真正写入
2. 验证追溯文件（scheme.md / result.md）是否完整
3. 输出验证报告

用法：
    python3 verify_execution.py <run_dir> <task_id> <file_list>
    示例：python3 verify_execution.py run_dir T001 "apps/web/src/utils/string.ts,apps/web/src/utils/__tests__/string.test.ts"
"""

import os
import sys
import json
from typing import List, Dict


def verify_file(file_path: str, check_content: bool = True) -> Dict:
    """
    验证单个文件

    Args:
        file_path: 文件路径
        check_content: 是否检查文件内容

    Returns:
        dict: 验证结果
    """
    result = {
        'path': file_path,
        'exists': False,
        'size': 0,
        'has_content': False,
        'status': '❌ 缺失'
    }

    full_path = os.path.join(os.getcwd(), file_path)
    if not os.path.isabs(file_path):
        full_path = os.path.join(os.getcwd(), file_path)
    else:
        full_path = file_path

    if os.path.exists(full_path):
        result['exists'] = True
        result['size'] = os.path.getsize(full_path)

        if result['size'] > 0:
            result['has_content'] = True
            result['status'] = f'✅ 正常（{result["size"]} 字节）'
        else:
            result['status'] = '⚠️  空文件'
    else:
        result['status'] = '❌ 缺失'

    return result


def verify_trace_files(run_dir: str, task_id: str) -> List[Dict]:
    """
    验证追溯文件（扁平化结构：Tasks/T001_scheme.md）

    Args:
        run_dir: 运行目录
        task_id: 任务 ID

    Returns:
        list: 验证结果列表
    """
    tasks_dir = os.path.join(run_dir, 'Tasks')

    trace_files = [
        os.path.join(tasks_dir, f'{task_id}_scheme.md'),
        os.path.join(tasks_dir, f'{task_id}_result.md'),
    ]

    results = []
    for file_path in trace_files:
        file_name = os.path.basename(file_path)
        verify_result = verify_file(file_path)
        verify_result['name'] = f'追溯文件：{file_name}'
        results.append(verify_result)

    return results


def verify_business_files(file_list: str) -> List[Dict]:
    """
    验证业务文件

    Args:
        file_list: 逗号分隔的文件路径列表

    Returns:
        list: 验证结果列表
    """
    results = []
    files = [f.strip() for f in file_list.split(',') if f.strip()]

    for file_path in files:
        verify_result = verify_file(file_path)
        verify_result['name'] = f'业务文件：{file_path}'
        results.append(verify_result)

    return results


def print_report(business_results: List[Dict], trace_results: List[Dict]):
    """
    打印验证报告

    Args:
        business_results: 业务文件验证结果
        trace_results: 追溯文件验证结果
    """
    print("")
    print("=" * 60)
    print("📊 执行验证报告")
    print("=" * 60)
    print("")

    # 业务文件验证
    print("📁 业务文件验证：")
    print("-" * 60)
    business_ok = 0
    business_total = len(business_results)
    for result in business_results:
        print(f"  {result['status']} - {result['name']}")
        if result['exists'] and result['has_content']:
            business_ok += 1
    print("")

    # 追溯文件验证
    print("📋 追溯文件验证：")
    print("-" * 60)
    trace_ok = 0
    trace_total = len(trace_results)
    for result in trace_results:
        print(f"  {result['status']} - {result['name']}")
        if result['exists'] and result['has_content']:
            trace_ok += 1
    print("")

    # 汇总
    print("=" * 60)
    total_ok = business_ok + trace_ok
    total = business_total + trace_total
    print(f"✅ 验证通过：{total_ok}/{total}")

    if total_ok == total:
        print("   所有文件验证通过！")
    else:
        print("   ⚠️  部分文件验证失败，请检查")
    print("=" * 60)
    print("")


def main():
    if len(sys.argv) < 4:
        print("❌ 参数不足")
        print("用法：python3 verify_execution.py <run_dir> <task_id> <file_list>")
        print("示例：python3 verify_execution.py run_dir T001 \"apps/web/src/utils/string.ts,apps/web/src/utils/__tests__/string.test.ts\"")
        sys.exit(1)

    run_dir = sys.argv[1]
    task_id = sys.argv[2]
    file_list = sys.argv[3]

    # 验证业务文件
    business_results = verify_business_files(file_list)

    # 验证追溯文件
    trace_results = verify_trace_files(run_dir, task_id)

    # 打印报告
    print_report(business_results, trace_results)

    # 返回退出码
    all_ok = all(r['exists'] and r['has_content'] for r in business_results + trace_results)
    sys.exit(0 if all_ok else 1)


if __name__ == '__main__':
    main()
