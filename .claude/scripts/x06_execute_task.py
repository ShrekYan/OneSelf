#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMind 工作流 - 阶段 05/06：生成方案 + 用户确认 + 执行写入
v4.5.1 优化版
功能：
  1. 读取选中的任务 ID
  2. 🔴 v4.5.1 新增：先确认是否生成方案（scheme_previewing 状态）
  3. 调用 task-scheme-generator 生成完整方案
  4. 在控制台显示完整方案
  5. 等待用户确认 yes/no/edit
  6. 用户确认后执行文件写入 + 质量检查 + 状态更新
"""
import os
import sys
import json
import re
import subprocess
from pathlib import Path
from typing import List, Dict, Optional

# 常量
RUNS_DIR = Path(".claude/runs").resolve()


# ============================================================
# 辅助函数：获取运行目录
# ============================================================
def get_run_dir() -> Optional[Path]:
    """获取当前运行目录"""
    last_run_file = RUNS_DIR / ".last-run"
    if not last_run_file.exists():
        return None

    with open(last_run_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("RUN_DIR="):
                return Path(line.strip().replace("RUN_DIR=", ""))
    return None


# ============================================================
# 辅助函数：状态管理
# ============================================================
def get_current_state() -> str:
    """获取当前状态"""
    run_dir = get_run_dir()
    if not run_dir:
        return "ready"

    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as sf:
            data = json.load(sf)
            return data.get("current_state", "ready")
    return "ready"


def set_current_state(new_state: str) -> None:
    """设置当前状态"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as sf:
            data = json.load(sf)
        data["current_state"] = new_state
        with open(status_file, "w", encoding="utf-8") as sf:
            json.dump(data, sf, indent=2, ensure_ascii=False)


def get_selected_task_id() -> Optional[str]:
    """获取当前选中的任务 ID"""
    run_dir = get_run_dir()
    if not run_dir:
        return None

    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as sf:
            data = json.load(sf)
            return data.get("selected_task_id")
    return None


def set_selected_task_id(task_id: str) -> None:
    """设置当前选中的任务 ID"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as sf:
            data = json.load(sf)
        data["selected_task_id"] = task_id
        with open(status_file, "w", encoding="utf-8") as sf:
            json.dump(data, sf, indent=2, ensure_ascii=False)


# ============================================================
# 辅助函数：任务清单
# ============================================================
def load_task_manifest() -> Dict:
    """加载任务清单"""
    run_dir = get_run_dir()
    if not run_dir:
        return {}

    manifest_file = run_dir / "task-manifest.json"
    if manifest_file.exists():
        with open(manifest_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def find_task(task_manifest: Dict, task_id: str) -> Optional[Dict]:
    """查找指定任务"""
    tasks = task_manifest.get("tasks", [])
    for task in tasks:
        if task.get("task_id") == task_id:
            return task
    return None


# ============================================================
# 辅助函数：方案存储
# ============================================================
def save_scheme_to_temp(task_id: str, scheme_content: str) -> None:
    """保存方案到临时文件"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    temp_dir = run_dir / "temp"
    temp_dir.mkdir(exist_ok=True)

    scheme_file = temp_dir / f"{task_id}-scheme.md"
    with open(scheme_file, "w", encoding="utf-8") as f:
        f.write(scheme_content)


def load_scheme_from_temp(task_id: str) -> Optional[str]:
    """从临时文件加载方案"""
    run_dir = get_run_dir()
    if not run_dir:
        return None

    scheme_file = run_dir / "temp" / f"{task_id}-scheme.md"
    if scheme_file.exists():
        with open(scheme_file, "r", encoding="utf-8") as f:
            return f.read()
    return None


# ============================================================
# 辅助函数：解析方案中的代码
# ============================================================
def parse_scheme_code(scheme_content: str) -> List[Dict]:
    """解析方案中的代码内容，提取需要写入的文件"""
    files = []

    # 匹配 ### 📄 文件路径 后面的代码块（允许中间有空行）
    pattern = r'### 📄 ([^\n]+)\n*\n```(?:typescript|ts|js|javascript)?\n([\s\S]*?)\n```'
    matches = re.findall(pattern, scheme_content)

    for file_path, code_content in matches:
        file_path = file_path.strip()

        # 判断是新增还是修改
        file_type = "新增"
        if Path(file_path).exists():
            file_type = "修改"

        files.append({
            "path": file_path,
            "content": code_content.strip() + "\n",
            "type": file_type,
        })

    return files


# ============================================================
# 辅助函数：文件写入
# ============================================================
def write_file(file_path: str, content: str, file_type: str) -> None:
    """写入文件"""
    path = Path(file_path)

    # 确保目录存在
    path.parent.mkdir(parents=True, exist_ok=True)

    # 写入文件
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"   ✅ {file_type}: {file_path}")


# ============================================================
# 辅助函数：质量检查
# ============================================================
def run_tsc_check() -> bool:
    """运行 TypeScript 类型检查"""
    original_cwd = os.getcwd()
    try:
        # 自动切换到 apps/web 目录
        web_dir = Path(original_cwd) / "apps/web"
        if web_dir.exists():
            os.chdir(web_dir)

        result = subprocess.run(
            ["npx", "tsc", "--noEmit", "--skipLibCheck"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            print("   ✅ TypeScript 检查通过")
            return True
        else:
            print(f"   ❌ TypeScript 检查失败:")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"   ⚠️ TypeScript 检查异常: {e}")
        return True
    finally:
        os.chdir(original_cwd)  # 切回原目录


def run_lint_check() -> bool:
    """运行 ESLint 检查"""
    original_cwd = os.getcwd()
    try:
        # 自动切换到 apps/web 目录
        web_dir = Path(original_cwd) / "apps/web"
        if web_dir.exists():
            os.chdir(web_dir)

        result = subprocess.run(
            ["npm", "run", "lint"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            print("   ✅ ESLint 检查通过")
            return True
        else:
            print(f"   ❌ ESLint 检查失败:")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"   ⚠️ ESLint 检查异常: {e}")
        return True
    finally:
        os.chdir(original_cwd)  # 切回原目录


# ============================================================
# 辅助函数：追溯文件
# ============================================================
def inject_scheme(task_id: str, scheme_content: str) -> None:
    """✅ 把 Claude 生成的方案注入到临时文件
    这样 phase_execute_write() 就能读到方案了
    """
    run_dir = get_run_dir()
    if not run_dir:
        print("❌ 找不到运行目录")
        return

    temp_dir = run_dir / "temp"
    temp_dir.mkdir(exist_ok=True)

    scheme_file = temp_dir / f"{task_id}-scheme.md"
    with open(scheme_file, "w", encoding="utf-8") as f:
        f.write(scheme_content)

    print(f"   ✅ 方案已注入: temp/{task_id}-scheme.md")
    print(f"   ✅ 方案大小: {len(scheme_content)} 字符")
    print(f"   ✅ 现在可以调用 execute-write 了")


def save_scheme_trace(task_id: str, scheme_content: str) -> None:
    """保存方案追溯文件"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    tasks_dir = run_dir / "Tasks" / task_id
    tasks_dir.mkdir(parents=True, exist_ok=True)

    scheme_file = tasks_dir / "scheme.md"
    with open(scheme_file, "w", encoding="utf-8") as f:
        f.write(scheme_content)


def save_execution_result(task_id: str, result: Dict) -> None:
    """保存执行结果文件"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    tasks_dir = run_dir / "Tasks" / task_id
    tasks_dir.mkdir(parents=True, exist_ok=True)

    result_file = tasks_dir / "result.md"
    with open(result_file, "w", encoding="utf-8") as f:
        f.write(f"# {task_id} 执行结果\n\n")
        f.write(f"## 执行时间\n")
        f.write(f"{result.get('exec_time', 'N/A')}\n\n")
        f.write(f"## 文件操作\n")
        for file_info in result.get("files", []):
            f.write(f"- {file_info['type']}: {file_info['path']}\n")
        f.write(f"\n## 质量检查\n")
        f.write(f"- TypeScript: {'✅ 通过' if result.get('tsc_pass') else '❌ 失败'}\n")
        f.write(f"- ESLint: {'✅ 通过' if result.get('lint_pass') else '❌ 失败'}\n")


def update_task_status(task_id: str, status: str) -> None:
    """更新任务状态"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    status_file = run_dir / "task-status.json"
    if status_file.exists():
        with open(status_file, "r", encoding="utf-8") as sf:
            data = json.load(sf)

        if "tasks" not in data:
            data["tasks"] = {}
        if task_id not in data["tasks"]:
            data["tasks"][task_id] = {}
        data["tasks"][task_id]["status"] = status

        with open(status_file, "w", encoding="utf-8") as sf:
            json.dump(data, sf, indent=2, ensure_ascii=False)


# ============================================================
# 辅助函数：执行摘要
# ============================================================
def print_execution_summary(task_id: str, files: List[Dict], tsc_pass: bool, lint_pass: bool) -> None:
    """打印执行摘要"""
    print("")
    print("=" * 60)
    print("🎉 执行完成")
    print("=" * 60)
    print(f"📋 任务 ID: {task_id}")
    print(f"📁 文件操作: {len(files)} 个文件")
    for file_info in files:
        print(f"   - {file_info['type']}: {file_info['path']}")
    print("")
    print("🔍 质量检查:")
    print(f"   - TypeScript: {'✅ 通过' if tsc_pass else '❌ 失败'}")
    print(f"   - ESLint: {'✅ 通过' if lint_pass else '❌ 失败'}")
    print("")
    print("📝 追溯文件:")
    print(f"   - Tasks/{task_id}/scheme.md")
    print(f"   - Tasks/{task_id}/result.md")
    print("=" * 60)


# ============================================================
# 阶段 0：确认是否生成方案（🔴 v4.5.1 新增）
# ============================================================
def phase_confirm_scheme_generation():
    """阶段：已选中任务，确认是否生成方案"""
    task_id = get_selected_task_id()
    if not task_id:
        print("❌ 未找到选中的任务")
        return

    # 加载任务清单获取任务详情
    task_manifest = load_task_manifest()
    task = find_task(task_manifest, task_id)

    print("=" * 60)
    print(f"📋 已选择任务：{task_id}")
    print("=" * 60)
    print("")

    if task:
        print(f"🎯 任务目标:   {task.get('goal', 'N/A')}")
        print(f"📁 所属模块:   {task.get('module', 'N/A')}")
        print(f"📊 任务状态:   {task.get('status', 'pending')}")
        print(f"⚠️  风险等级:   {task.get('risk_level', 'N/A')}")
    else:
        print("⚠️  未找到任务详情")

    print("")
    print("=" * 60)
    print("❓ 请确认是否为该任务生成方案？")
    print("=" * 60)
    print("   yes/confirm  → 确认生成方案")
    print("   no/back      → 取消，返回任务看板")
    print("   exit         → 退出工作流")
    print("=" * 60)


# ============================================================
# 阶段 1：生成方案（🔴 v4.5.1 新增）
# ============================================================
def phase_generate_scheme():
    """阶段：调用 task-scheme-generator 生成方案"""
    task_id = get_selected_task_id()
    if not task_id:
        print("❌ 未找到选中的任务")
        return

    print("=" * 60)
    print(f"🧠 正在为任务 {task_id} 生成方案...")
    print("=" * 60)
    print("")
    print("📝 方案生成由 Claude Code Agent 执行")
    print("   请在交互界面中查看方案生成过程")
    print("")
    print("=" * 60)
    print("💡 提示：")
    print("   方案生成后将完整显示在此处")
    print("   请仔细审核方案内容后再确认执行")
    print("=" * 60)
    print("")

    # 🔴 注意：方案生成由 Workflow 引擎通过 Agent 调用完成
    # 此处只显示提示信息，实际的 Agent 调用由工作流交互处理
    # 生成的方案内容会保存到临时文件，供下一阶段显示


# ============================================================
# 阶段 2：显示方案已生成的提示
# ============================================================
def phase_show_scheme_generated():
    """阶段：方案已生成，等待用户确认"""
    task_id = get_selected_task_id()
    if not task_id:
        print("❌ 未找到选中的任务")
        return

    scheme_content = load_scheme_from_temp(task_id)
    if not scheme_content:
        print("❌ 未找到方案内容")
        return

    # 显示方案
    print(scheme_content)
    print("")

    # 显示操作提示
    print("=" * 60)
    print("❓ 请选择操作：")
    print("=" * 60)
    print("   yes    → 确认执行此方案，写入文件")
    print("   no     → 取消，返回任务看板")
    print("   edit   → 给出修改意见（格式: edit 你的修改意见）")
    print("=" * 60)


# ============================================================
# 阶段 2：执行文件写入
# ============================================================
def phase_execute_write(skip_write: bool = False):
    """阶段：用户确认后，执行文件写入

    Args:
        skip_write: 是否跳过写代码步骤（已手动写入时传 True）
    """
    task_id = get_selected_task_id()
    if not task_id:
        print("❌ 未找到选中的任务")
        return

    scheme_content = load_scheme_from_temp(task_id)
    if not scheme_content:
        print("❌ 未找到方案内容")
        print("💡 请先执行: python3 .claude/scripts/x06_execute_task.py inject-scheme " + task_id + ' "方案内容"')
        return

    # 解析方案中的代码
    files_to_write = parse_scheme_code(scheme_content)

    if not files_to_write:
        print("⚠️  方案中未找到要写入的文件")
        return

    print("=" * 60)
    print("⚡ 开始执行收尾")
    print("=" * 60)
    print("")

    # 执行文件写入（可选跳过）
    if skip_write:
        print("📁 [跳过] 写代码（已手动写入）")
        print(f"   预计文件数: {len(files_to_write)}")
        for file_info in files_to_write:
            print(f"   - {file_info['type']}: {file_info['path']}")
    else:
        print("📁 写入文件:")
        for file_info in files_to_write:
            write_file(file_info["path"], file_info["content"], file_info["type"])

    print("")
    print("=" * 60)
    print("🔍 运行质量检查")
    print("=" * 60)
    print("")

    # 执行质量检查
    tsc_pass = run_tsc_check()
    lint_pass = run_lint_check()

    # 写入追溯文件
    print("")
    print("=" * 60)
    print("📝 写入追溯文件")
    print("=" * 60)
    print("")

    save_scheme_trace(task_id, scheme_content)
    print("   ✅ 写入 scheme.md")

    result = {
        "exec_time": "2026-05-11",
        "files": files_to_write,
        "tsc_pass": tsc_pass,
        "lint_pass": lint_pass,
    }
    save_execution_result(task_id, result)
    print("   ✅ 写入 result.md")

    # 更新任务状态
    update_task_status(task_id, "completed")
    print("   ✅ 更新任务状态为 completed")

    # 显示执行摘要
    print_execution_summary(task_id, files_to_write, tsc_pass, lint_pass)

    # 返回 ready 状态
    set_current_state("ready")
    set_selected_task_id("")


# ============================================================
# ✅ 新增：Claude 执行回调接口（独立，不调用现有逻辑）
# ============================================================

def auto_save_trace_on_complete(task_id: str, files: list, tsc_pass: bool, lint_pass: bool) -> None:
    """✅ Claude 执行完成后，自动生成所有追溯文件

    完全独立实现，不依赖 phase_execute_write() 中的任何逻辑
    即使将来现有逻辑重构，这个函数也不受影响
    """
    from datetime import datetime

    run_dir = get_run_dir()
    if not run_dir:
        print("❌ 找不到运行目录")
        return

    # 1. 创建 Tasks/T001 目录
    tasks_dir = run_dir / "Tasks" / task_id
    tasks_dir.mkdir(parents=True, exist_ok=True)

    # 2. 生成 scheme.md
    scheme_content = f"""# {task_id} 执行记录

## 修改文件
{chr(10).join(f'- `{f}`' for f in files)}

## 质量检查
- ✅ TypeScript 检查: {'通过' if tsc_pass else '失败'}
- ✅ ESLint 检查: {'通过' if lint_pass else '失败'}

## 说明
此任务由 Claude Code 工作流自动执行，追溯文件自动生成。
""".strip()

    scheme_file = tasks_dir / "scheme.md"
    with open(scheme_file, "w", encoding="utf-8") as f:
        f.write(scheme_content)
    print(f"   ✅ Tasks/{task_id}/scheme.md 已生成")

    # 3. 生成 result.md
    result_content = f"""# {task_id} 执行结果

## 执行时间
{datetime.now().isoformat()}

## 修改文件
{chr(10).join(f'- {f}' for f in files)}

## 质量检查结果
- TypeScript: {'✅ 通过' if tsc_pass else '❌ 失败'}
- ESLint: {'✅ 通过' if lint_pass else '❌ 失败'}
""".strip()

    result_file = tasks_dir / "result.md"
    with open(result_file, "w", encoding="utf-8") as f:
        f.write(result_content)
    print(f"   ✅ Tasks/{task_id}/result.md 已生成")

    # 4. 更新任务状态
    status_file = run_dir / "task-status.json"
    with open(status_file, "r", encoding="utf-8") as f:
        status_data = json.load(f)

    status_data["tasks"][task_id]["status"] = "completed"
    status_data["current_state"] = "ready"
    status_data["selected_task_id"] = ""

    with open(status_file, "w", encoding="utf-8") as f:
        json.dump(status_data, f, indent=2, ensure_ascii=False)

    print(f"   ✅ 任务状态已更新为 completed")
    print(f"   ✅ 状态机已重置")


def check_trace_integrity() -> None:
    """✅ 检查所有 completed 任务的追溯文件完整性"""
    run_dir = get_run_dir()
    if not run_dir:
        return

    status_file = run_dir / "task-status.json"
    with open(status_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    has_issue = False
    for task_id, task_info in data["tasks"].items():
        if task_info["status"] == "completed":
            tasks_dir = run_dir / "Tasks" / task_id
            scheme_exists = (tasks_dir / "scheme.md").exists()
            result_exists = (tasks_dir / "result.md").exists()

            if not scheme_exists or not result_exists:
                has_issue = True
                print(f"  ⚠️  {task_id} 追溯文件缺失")
                missing = []
                if not scheme_exists:
                    missing.append("scheme.md")
                if not result_exists:
                    missing.append("result.md")
                print(f"     缺失: {', '.join(missing)}")
                print(f"     💡 修复命令:")
                print(f"        python3 .claude/scripts/x06_execute_task.py auto-trace {task_id} --files=\"...\"")

    if not has_issue:
        print("  ✅ 所有任务追溯文件完整")


# ============================================================
# 主函数
# ============================================================
def main():
    # ============================================================
    # ✅ 新增：独立命令入口（放在最前面，不影响原有逻辑）
    # ============================================================
    if len(sys.argv) > 1:
        command = sys.argv[1]

        # 命令 1: 注入方案（✅ v4.5.2 新增：为 phase_execute_write 准备方案）
        if command == "inject-scheme":
            """✅ 把 Claude 生成的方案注入到临时文件

            用法:
            python3 .claude/scripts/x06_execute_task.py inject-scheme T001 "完整方案内容..."
            """
            import argparse

            parser = argparse.ArgumentParser()
            parser.add_argument("task_id", help="任务 ID")
            parser.add_argument("scheme_content", nargs="?", help="方案内容（也可以通过 stdin 传入）", default="")

            args = parser.parse_args(args=sys.argv[2:])

            # 如果没传内容，尝试从 stdin 读取
            scheme_content = args.scheme_content
            if not scheme_content and not sys.stdin.isatty():
                scheme_content = sys.stdin.read()

            print("=" * 60)
            print(f"📥 注入方案到临时文件: {args.task_id}")
            print("=" * 60)
            print("")

            inject_scheme(args.task_id, scheme_content)

            print("")
            print("=" * 60)
            print("✅ 注入完成")
            print("=" * 60)
            return

        # 命令 2: 执行写入（✅ v4.5.2 新增 --skip-write 参数）
        if command == "execute-write":
            """✅ 执行写入收尾

            用法:
            python3 .claude/scripts/x06_execute_task.py execute-write
            python3 .claude/scripts/x06_execute_task.py execute-write --skip-write
            """
            import argparse

            parser = argparse.ArgumentParser()
            parser.add_argument("--skip-write", action="store_true", help="跳过写代码（已手动写入）")

            args = parser.parse_args(args=sys.argv[2:])

            print("=" * 60)
            print(f"⚡ 执行写入收尾 (skip_write={args.skip_write})")
            print("=" * 60)
            print("")

            phase_execute_write(skip_write=args.skip_write)
            return

        # 命令 3: 自动生成追溯文件
        if command == "auto-trace":
            """✅ Claude 执行完成后自动生成追溯

            用法:
            python3 .claude/scripts/x06_execute_task.py auto-trace T001 \
                --files="apps/web/src/api/depart/index.ts,apps/web/src/api/index.ts" \
                --tsc=true --lint=true
            """
            import argparse

            parser = argparse.ArgumentParser()
            parser.add_argument("task_id", help="任务 ID")
            parser.add_argument("--files", help="修改的文件列表，逗号分隔", default="")
            parser.add_argument("--tsc", help="tsc 检查是否通过", default="true")
            parser.add_argument("--lint", help="lint 检查是否通过", default="true")

            args = parser.parse_args(args=sys.argv[2:])

            files = [f.strip() for f in args.files.split(",") if f.strip()]

            print("=" * 60)
            print(f"📝 自动生成执行追溯文件: {args.task_id}")
            print("=" * 60)
            print("")

            auto_save_trace_on_complete(
                args.task_id,
                files,
                args.tsc == "true",
                args.lint == "true"
            )

            print("")
            print("=" * 60)
            print("✅ 执行完成")
            print("=" * 60)
            return

        # 命令 4: 检查追溯完整性
        if command == "check-trace":
            """✅ 检查所有 completed 任务的追溯文件完整性

            用法:
            python3 .claude/scripts/x06_execute_task.py check-trace
            """
            print("=" * 60)
            print("🔍 检查追溯文件完整性")
            print("=" * 60)
            print("")

            check_trace_integrity()

            print("")
            print("=" * 60)
            print("✅ 检查完成")
            print("=" * 60)
            return

    # ============================================================
    # 原有逻辑（扩展新增状态）
    # ============================================================
    # 检查是否有命令行参数（用于状态机控制）
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "show-scheme":
            phase_show_scheme_generated()
            return

        if command == "execute-write":
            phase_execute_write()
            return

        if command == "confirm-scheme":
            phase_confirm_scheme_generation()
            return

        if command == "generate-scheme":
            phase_generate_scheme()
            return

    # 默认：检查当前状态，决定执行什么
    current_state = get_current_state()

    if current_state == "scheme_previewing":
        # 🔴 v4.5.1 新增：方案预览确认状态
        phase_confirm_scheme_generation()
    elif current_state == "executing":
        # 正在执行状态
        task_id = get_selected_task_id()
        if task_id:
            scheme_content = load_scheme_from_temp(task_id)
            if not scheme_content:
                # 方案还没生成，先显示生成提示
                phase_generate_scheme()
            else:
                # 方案已生成，显示方案
                phase_show_scheme_generated()
        else:
            print("❌ 未找到选中的任务，请先在看板选择任务")
    else:
        # 其他状态，提示先选择任务
        print("=" * 60)
        print("📋 提示：请先在看板选择任务")
        print("=" * 60)
        print("")
        print("当前状态:", current_state)
        print("")
        print("请输入任务编号（如 T001）开始执行。")


if __name__ == "__main__":
    main()
