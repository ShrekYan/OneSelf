#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
方案完整性验证脚本
验证 task-scheme-generator 生成的方案是否完整可执行
"""

import sys
import re
from pathlib import Path


def verify_scheme(scheme_content):
    """验证方案完整性，返回问题列表"""
    issues = []

    # ============================================================
    # 检查 1: 是否有代码省略号
    # ============================================================
    if '...' in scheme_content:
        # 排除 import ... from ... 和 export ... from ... 的正常语法
        lines = scheme_content.split('\n')
        for i, line in enumerate(lines, 1):
            if '...' in line and 'import' not in line and 'export' not in line:
                # 检查是否在代码块内
                issues.append(
                    f"❌ 第 {i} 行：发现代码省略标记 '...'，代码不完整\n"
                    f"   内容: {line.strip()[:80]}"
                )

    # ============================================================
    # 检查 2: 是否有 TODO 标记
    # ============================================================
    todo_pattern = re.compile(r'(TODO:|todo:|FIXME:|fixme:)', re.IGNORECASE)
    lines = scheme_content.split('\n')
    for i, line in enumerate(lines, 1):
        match = todo_pattern.search(line)
        if match:
            issues.append(
                f"❌ 第 {i} 行：发现待补充标记 '{match.group(1)}'\n"
                f"   内容: {line.strip()[:80]}"
            )

    # ============================================================
    # 检查 3: 是否有占位符
    # ============================================================
    placeholder_pattern = re.compile(r'\{[a-zA-Z_][a-zA-Z0-9_]*\}')
    # 排除正常的代码占位（如 ${...}、{/* ... */} 等）
    exclude_pattern = re.compile(r'(\$\{|\/\*|\*\/)')

    lines = scheme_content.split('\n')
    for i, line in enumerate(lines, 1):
        matches = placeholder_pattern.findall(line)
        for match in matches:
            if not exclude_pattern.search(line):
                # 检查是否在代码块内，且不是合法的模板字符串
                issues.append(
                    f"⚠️  第 {i} 行：发现可能的占位符 '{match}'\n"
                    f"   内容: {line.strip()[:80]}\n"
                    f"   提示：如果这是合法代码，请忽略此警告"
                )

    # ============================================================
    # 检查 4: 是否有"方案完整性承诺"表格
    # ============================================================
    if '方案完整性承诺' not in scheme_content:
        issues.append("❌ 缺少「方案完整性承诺」表格，用户无法确认方案是否完整")

    # ============================================================
    # 检查 5: TypeScript 类型完整性（简单检查）
    # ============================================================
    # 查找函数定义，检查是否有类型声明
    func_pattern = re.compile(r'export function (\w+)\s*\(')
    funcs = func_pattern.findall(scheme_content)

    if funcs:
        # 有导出函数，检查是否有返回类型
        for func in funcs:
            # 查找 function xxx(...) : 返回类型 的模式
            func_return_pattern = re.compile(
                r'export function ' + re.escape(func) + r'\s*\([^)]*\)\s*:\s*\w+'
            )
            if not func_return_pattern.search(scheme_content):
                issues.append(
                    f"⚠️  函数 '{func}' 可能缺少返回类型声明\n"
                    f"   提示：请确保 TypeScript 类型完整"
                )

    # ============================================================
    # 检查 6: 每个代码块前是否有文件路径
    # ============================================================
    # 查找所有 ```typescript 代码块
    code_block_pattern = re.compile(r'```typescript\n(.*?)\n```', re.DOTALL)
    code_blocks = code_block_pattern.findall(scheme_content)

    if len(code_blocks) > 0:
        # 检查每个代码块前是否有文件路径说明
        # 简单检查：方案中是否有 ### 📄 前缀的文件路径标题
        file_title_pattern = re.compile(r'### 📄 ([\w/._-]+)')
        file_titles = file_title_pattern.findall(scheme_content)

        if len(file_titles) == 0:
            issues.append("❌ 未发现任何文件路径标题（'### 📄 文件路径' 格式）")
        elif len(file_titles) < len(code_blocks):
            issues.append(
                f"⚠️  代码块数量({len(code_blocks)}) > 文件路径标题数量({len(file_titles)})\n"
                f"   可能有代码块缺少对应的文件路径说明"
            )

    return issues


def main():
    if len(sys.argv) < 2:
        print("用法: python3 verify_scheme_complete.py <scheme_file>")
        print("")
        print("验证 task-scheme-generator 生成的方案是否完整可执行")
        sys.exit(1)

    scheme_file = Path(sys.argv[1])

    if not scheme_file.exists():
        print(f"❌ 文件不存在: {scheme_file}")
        sys.exit(1)

    # 读取方案内容
    with open(scheme_file, 'r', encoding='utf-8') as f:
        scheme_content = f.read()

    print("========================================")
    print("🔍 方案完整性验证 v1.0")
    print("========================================")
    print(f"📄 验证文件: {scheme_file}")
    print("")

    # 执行验证
    issues = verify_scheme(scheme_content)

    if len(issues) == 0:
        print("✅ 方案完整性验证通过！")
        print("")
        print("验证项目:")
        print("  ✅ 无代码省略标记 '...'")
        print("  ✅ 无 TODO 待补充标记")
        print("  ✅ 无明显占位符")
        print("  ✅ 包含「方案完整性承诺」表格")
        print("  ✅ 文件路径标题完整")
        print("")
        print("👉 此方案可以直接执行，无需修改")
        sys.exit(0)
    else:
        print(f"⚠️  发现 {len(issues)} 个问题：")
        print("")
        for i, issue in enumerate(issues, 1):
            print(f"{i}. {issue}")
            print("")

        print("========================================")
        print("❌ 方案完整性验证未通过")
        print("========================================")
        print("")
        print("请根据上述问题修改方案后，再次验证。")
        print("")
        print("💡 提示：")
        print("  - 所有代码必须 100% 完整，不能省略")
        print("  - 所有文件路径必须完整准确")
        print("  - TypeScript 类型声明必须完整")
        print("  - 必须包含「方案完整性承诺」表格")
        sys.exit(1)


if __name__ == "__main__":
    main()
