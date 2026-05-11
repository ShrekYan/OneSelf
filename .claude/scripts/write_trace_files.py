#!/usr/bin/env python3
"""
统一追溯文件写入脚本 v2.0

功能：
1. 扁平化结构：写入 {TASK_ID}_scheme.md 方案追溯文件
2. 扁平化结构：写入 {TASK_ID}_result.md 执行结果文件
3. 自动验证文件写入
4. 失败自动重试（最多 2 次）

v2.0 更新：
- 改为扁平化文件结构：Tasks/T001_scheme.md, Tasks/T001_result.md
- 不再创建每个任务的子目录，简化管理

用法：
    python3 write_trace_files.py <run_dir> <task_id> <type> <content_file>
    - type: scheme | result
"""

import os
import sys
import json
import time


def write_file_with_retry(file_path: str, content: str, max_retries: int = 2) -> bool:
    """
    带重试机制的文件写入

    Args:
        file_path: 文件路径
        content: 文件内容
        max_retries: 最大重试次数

    Returns:
        bool: 是否写入成功
    """
    for attempt in range(max_retries + 1):
        try:
            # 确保目录存在
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            # 验证文件是否真正写入
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                if file_size > 0:
                    if attempt > 0:
                        print(f"  ✅ 重试 {attempt} 次后写入成功")
                    return True
                else:
                    print(f"  ⚠️  第 {attempt + 1} 次尝试：文件大小为 0")
            else:
                print(f"  ⚠️  第 {attempt + 1} 次尝试：文件未创建")

        except Exception as e:
            print(f"  ⚠️  第 {attempt + 1} 次尝试失败：{str(e)}")

        # 如果不是最后一次尝试，等待一下再重试
        if attempt < max_retries:
            time.sleep(0.5)

    print(f"  ❌ 重试 {max_retries} 次后仍然失败")
    return False


def write_trace_file(run_dir: str, task_id: str, trace_type: str, content: str) -> bool:
    """
    写入追溯文件

    Args:
        run_dir: 运行目录
        task_id: 任务 ID
        trace_type: 追溯类型 (scheme | result)
        content: 文件内容

    Returns:
        bool: 是否写入成功
    """
    # 构建文件路径（扁平化结构：Tasks/T001_scheme.md）
    tasks_dir = os.path.join(run_dir, 'Tasks')
    os.makedirs(tasks_dir, exist_ok=True)
    file_path = os.path.join(tasks_dir, f'{task_id}_{trace_type}.md')

    print(f"📝 写入 {task_id}_{trace_type}.md 到：{file_path}")

    # 写入文件（带重试）
    success = write_file_with_retry(file_path, content)

    if success:
        file_size = os.path.getsize(file_path)
        print(f"  ✅ 写入成功（{file_size} 字节）")
    else:
        print(f"  ❌ 写入失败")

    return success


def main():
    if len(sys.argv) < 4:
        print("❌ 参数不足")
        print("用法：python3 write_trace_files.py <run_dir> <task_id> <type> <content_file>")
        print("   或：python3 write_trace_files.py <run_dir> <task_id> <type> - （从标准输入读取内容）")
        sys.exit(1)

    run_dir = sys.argv[1]
    task_id = sys.argv[2]
    trace_type = sys.argv[3]

    # 验证 trace_type
    if trace_type not in ['scheme', 'result']:
        print(f"❌ 无效的类型：{trace_type}，必须是 scheme 或 result")
        sys.exit(1)

    # 读取内容
    if len(sys.argv) >= 5 and sys.argv[4] != '-':
        # 从文件读取
        content_file = sys.argv[4]
        with open(content_file, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        # 从标准输入读取
        content = sys.stdin.read()

    # 写入文件
    success = write_trace_file(run_dir, task_id, trace_type, content)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
