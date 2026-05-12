#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
任务执行完成钩子 - 自动生成追溯文件
v1.0
功能：
  1. 接收任务ID和修改的文件列表
  2. 自动生成 Tasks/T001/scheme.md
  3. 自动生成 Tasks/T001/result.md
  4. 自动更新任务状态为 completed
  5. 自动重置状态机

【设计原则】完全独立运行，不修改任何现有脚本，不影响现有功能

用法：
  python3 .claude/scripts/x07_on_complete.py T001 --files="file1.ts,file2.ts"
  python3 .claude/scripts/x07_on_complete.py T001 --files="file1.ts" --tsc=true --lint=true
"""
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


# ============================================================
# 辅助函数
# ============================================================
def get_run_dir() -> Path:
    """获取当前运行目录（从 .last-run 文件）"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        raise FileNotFoundError(f"找不到 .last-run 文件: {last_run_file}")

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                run_dir_path = Path(line.strip().replace("RUN_DIR=", ""))
                if run_dir_path.exists():
                    return run_dir_path

    raise FileNotFoundError("找不到有效的运行目录")


def generate_scheme_md(task_id: str, files: list) -> str:
    """生成 scheme.md 内容"""
    files_list = "\n".join(f"- `{f}`" for f in files)

    return f"""# {task_id} 执行方案

## 修改文件列表
{files_list}

## 说明
此任务由 Claude Code 工作流自动执行，追溯文件在执行完成后自动生成。
"""


def generate_result_md(task_id: str, files: list, tsc_pass: bool, lint_pass: bool) -> str:
    """生成 result.md 内容"""
    files_list = "\n".join(f"- ✅ 写入: {f}" for f in files)

    return f"""# {task_id} 执行结果

## 执行时间
{datetime.now().isoformat()}

## 文件操作
{files_list}

## 质量检查结果
- TypeScript: {'✅ 通过' if tsc_pass else '❌ 失败'}
- ESLint: {'✅ 通过' if lint_pass else '❌ 失败'}
"""


# ============================================================
# 主函数
# ============================================================
def main():
    parser = argparse.ArgumentParser(
        description="任务执行完成后自动生成追溯文件",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python3 .claude/scripts/x07_on_complete.py T001 --files="apps/web/src/api/normal/index.ts"
  python3 .claude/scripts/x07_on_complete.py T001 --files="file1.ts,file2.ts" --tsc=true --lint=true
        """
    )
    parser.add_argument("task_id", help="任务ID，如 T001")
    parser.add_argument("--files", required=True, help="修改的文件列表，逗号分隔")
    parser.add_argument("--tsc", default="true", help="TypeScript检查是否通过")
    parser.add_argument("--lint", default="true", help="ESLint检查是否通过")

    args = parser.parse_args()

    try:
        # 获取运行目录
        run_dir = get_run_dir()
        task_id = args.task_id.upper()
        files = [f.strip() for f in args.files.split(",") if f.strip()]
        tsc_pass = args.tsc.lower() == "true"
        lint_pass = args.lint.lower() == "true"

        print("=" * 60)
        print(f"📝 生成追溯文件: {task_id}")
        print("=" * 60)
        print(f"📂 运行目录: {run_dir.name}")
        print(f"📁 文件数量: {len(files)}")
        print("")

        # 1. 创建 Tasks/T001 目录
        tasks_dir = run_dir / "Tasks" / task_id
        tasks_dir.mkdir(parents=True, exist_ok=True)

        # 2. 写入 scheme.md
        scheme_content = generate_scheme_md(task_id, files)
        scheme_file = tasks_dir / "scheme.md"
        with open(scheme_file, "w", encoding="utf-8") as f:
            f.write(scheme_content)
        print(f"   ✅ Tasks/{task_id}/scheme.md")

        # 3. 写入 result.md
        result_content = generate_result_md(task_id, files, tsc_pass, lint_pass)
        result_file = tasks_dir / "result.md"
        with open(result_file, "w", encoding="utf-8") as f:
            f.write(result_content)
        print(f"   ✅ Tasks/{task_id}/result.md")

        # 4. 更新任务状态
        status_file = run_dir / "task-status.json"
        if status_file.exists():
            with open(status_file, "r", encoding="utf-8") as f:
                status_data = json.load(f)

            # 确保 tasks 字段存在
            if "tasks" not in status_data:
                status_data["tasks"] = {}
            if task_id not in status_data["tasks"]:
                status_data["tasks"][task_id] = {}

            status_data["tasks"][task_id]["status"] = "completed"
            status_data["current_state"] = "ready"
            status_data["selected_task_id"] = ""

            with open(status_file, "w", encoding="utf-8") as f:
                json.dump(status_data, f, indent=2, ensure_ascii=False)
            print(f"   ✅ 任务状态更新为 completed")
        else:
            print(f"   ⚠️  未找到 task-status.json，跳过状态更新")

        print("")
        print("=" * 60)
        print("🎉 追溯文件生成完成")
        print("=" * 60)
        print("")
        print("📋 已生成的文件:")
        print(f"   {tasks_dir / 'scheme.md'}")
        print(f"   {tasks_dir / 'result.md'}")

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
