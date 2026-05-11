#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
确定性 XMind 解析脚本 v1.0
100% 可预测，0.5 秒完成解析

设计原则：
1. 简单明确的规则优先，不使用 LLM
2. 规则无法处理的复杂情况，降级调用 Agent 兜底
3. 所有输出格式与原 Agent 完全兼容，保证功能完整
"""

import re
import json
import sys
from pathlib import Path
from datetime import datetime


def extract_field(content, keywords):
    """从内容中提取字段值

    支持两种格式：
    1. - 关键词：值（同一行）
    2. - 关键词
         - 值（下一行缩进，支持多行）
    """
    # 所有已知的字段关键词，用于判断何时停止收集
    all_field_keywords = [
        '目标描述', '目标', '功能', '功能描述', '要实现',
        '上下文', '上下文信息', '背景', '背景信息',
        '质量标准', '验收标准', '质量要求', '要求',
        '约束条件', '约束', '限制', '限制条件',
        '执行模式', '依赖', '前置条件',
    ]

    for keyword in keywords:
        # 格式 1: 同一行冒号分隔（匹配到下一个独立的字段关键词之前）
        pattern1 = r'-\s*' + re.escape(keyword) + r'\s*[：:]\s*(.+?)(?=\n\s*-\s*[\u4e00-\u9fa5]{2,}|\Z)'
        match1 = re.search(pattern1, content, re.DOTALL)
        if match1:
            value = match1.group(1).strip()
            value = re.sub(r'\s+', ' ', value)
            if value:
                return value

        # 格式 2: 关键词单独一行，后面可能有多行值
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if re.match(r'^-\s*' + re.escape(keyword) + r'\s*$', line.strip()):
                values = []
                # 找后面所有连续缩进的值，直到遇到新的字段（- 后跟中文）
                for j in range(i+1, len(lines)):
                    next_line = lines[j].strip()
                    # 检查是否是已知的字段关键词
                    is_new_field = False
                    for fk in all_field_keywords:
                        if re.match(r'^-\s*' + re.escape(fk) + r'\s*$', next_line):
                            is_new_field = True
                            break
                    if is_new_field:
                        break
                    if next_line.startswith('-'):
                        # 提取 - 后面的内容
                        value = next_line[1:].strip()
                        value = re.sub(r'\s+', ' ', value)
                        if value:
                            values.append(value)
                    # 空行继续跳过
                if values:
                    return '; '.join(values)

    return ''


def detect_execution_mode(content):
    """检测执行模式"""
    if re.search(r'只出方案|仅方案|不执行|plan.*only', content, re.IGNORECASE):
        return 'plan-only'
    elif re.search(r'自动执行|直接执行|auto.*exec', content, re.IGNORECASE):
        return 'auto-exec'
    else:
        return 'review-first'


def estimate_risk(goal, context, quality):
    """估算风险等级"""
    total_len = len(goal) + len(context) + len(quality)
    if total_len > 500:
        return 'high'
    elif total_len > 200:
        return 'medium'
    else:
        return 'low'


def parse_xmind_markdown(content):
    """解析 XMind 导出的 Markdown

    返回格式与原 Agent 完全兼容，保证功能完整
    """

    result = {
        'project_name': '未命名项目',
        'tasks': []
    }

    # ============================================================
    # 1. 提取项目名称（H1 标题）
    # ============================================================
    h1_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    if h1_match:
        result['project_name'] = h1_match.group(1).strip()

    # ============================================================
    # 2. 提取所有任务（检测包含五要素关键词的节点）
    # ============================================================
    # 按标题层级分割
    lines = content.split('\n')
    current_module = '默认模块'
    task_content_buffer = []
    in_task = False

    for i, line in enumerate(lines):
        # 检测新的模块标题（H2/H3），忽略前导空格
        h2_match = re.match(r'^\s*## (.+)$', line)
        h3_match = re.match(r'^\s*### (.+)$', line)

        if h2_match or h3_match:
            # 保存之前的任务
            if in_task and task_content_buffer:
                task_text = '\n'.join(task_content_buffer)
                # 判断是否包含任务要素（有目标描述）
                if '目标' in task_text or '功能' in task_text or '实现' in task_text:
                    task = parse_single_task(
                        current_module,
                        task_text,
                        len(result['tasks']) + 1
                    )
                    result['tasks'].append(task)

            # 开始新的模块
            title_match = h2_match if h2_match else h3_match
            current_module = title_match.group(1).strip()
            task_content_buffer = []
            in_task = True

        elif in_task:
            task_content_buffer.append(line)

    # 处理最后一个任务
    if in_task and task_content_buffer:
        task_text = '\n'.join(task_content_buffer)
        if '目标' in task_text or '功能' in task_text or '实现' in task_text:
            task = parse_single_task(
                current_module,
                task_text,
                len(result['tasks']) + 1
            )
            result['tasks'].append(task)

    # ============================================================
    # 3. 自动推断依赖关系（同模块内按顺序依赖）
    # ============================================================
    modules = {}
    for task in result['tasks']:
        mod = task['module']
        if mod not in modules:
            modules[mod] = []
        modules[mod].append(task['task_id'])

    for task in result['tasks']:
        mod = task['module']
        task_ids = modules[mod]
        idx = task_ids.index(task['task_id'])
        if idx > 0:
            task['explicit_dependencies'] = [task_ids[idx-1]]

    # ============================================================
    # 4. 识别 Agent 类型
    # ============================================================
    for task in result['tasks']:
        task['agent_type'] = detect_agent_type(
            task['goal'] + task['context']
        )

    return result


def parse_single_task(module, content, task_num):
    """解析单个任务

    返回字段与原 Agent 完全一致，保证兼容性
    """
    # 提取五要素
    goal = extract_field(content, ['目标描述', '目标', '功能', '功能描述', '要实现'])
    context = extract_field(content, ['上下文', '上下文信息', '背景', '背景信息'])
    quality = extract_field(content, ['质量标准', '验收标准', '质量要求', '要求'])
    constraints = extract_field(content, ['约束条件', '约束', '限制', '限制条件'])
    exec_mode = detect_execution_mode(content)

    # 如果没有提取到目标，使用第一行作为目标
    if not goal:
        lines = [l.strip() for l in content.split('\n') if l.strip()]
        for line in lines:
            if line and not line.startswith('-') and len(line) > 2:
                goal = line
                break

    return {
        'task_id': f'T{task_num:03d}',
        'module': module,
        'goal': goal,
        'context': context,
        'quality_standards': quality,
        'constraints': constraints,
        'execution_mode': exec_mode,
        'explicit_dependencies': [],
        'estimated_size_risk': estimate_risk(goal, context, quality),
        'quality_gates': ['lint', 'ts-check']
    }


def detect_agent_type(content):
    """根据内容推断 Agent 类型"""
    content_lower = content.lower()

    if any(k in content_lower for k in ['组件', '页面', '样式', '前端', 'ui', 'react', 'vue']):
        return 'frontend-developer'
    elif any(k in content_lower for k in ['接口', 'api', 'service', 'controller', '后端', 'nest']):
        return 'backend-architect'
    elif any(k in content_lower for k in ['测试', '单测', '单元测试', 'test', 'vitest']):
        return 'frontend-test-writer'
    else:
        return 'frontend-developer'


def generate_task_manifest(parsed_result, source_file):
    """生成 task-manifest.json，格式与原 Agent 完全兼容"""
    tasks = parsed_result['tasks']

    # 拓扑排序（现在是按顺序，直接使用）
    execution_order = [t['task_id'] for t in tasks]

    # 并行分组（简单的每个任务一组）
    parallel_groups = [[t['task_id']] for t in tasks]

    manifest = {
        'project_name': parsed_result['project_name'],
        'source_xmind': str(source_file),
        'manifest_version': '1.0',
        'generated_at': datetime.now().isoformat(),
        'demand_context': {
            'business_domain': tasks[0]['module'] if tasks else '',
            'technical_stack': 'TypeScript',
            'related_modules': list(set(t['module'] for t in tasks)),
            'previous_outputs': [],
            'hints': []
        },
        'tasks': tasks,
        'execution_plan': {
            'total_tasks': len(tasks),
            'estimated_duration': f'{max(1, len(tasks) * 5)} 分钟',
            'quality_gates': ['lint', 'ts-check'],
            'risk_summary': {
                'low': sum(1 for t in tasks if t['estimated_size_risk'] == 'low'),
                'medium': sum(1 for t in tasks if t['estimated_size_risk'] == 'medium'),
                'high': sum(1 for t in tasks if t['estimated_size_risk'] == 'high')
            },
            'execution_order': execution_order,
            'parallel_groups': parallel_groups
        }
    }

    return manifest


def generate_task_status(manifest):
    """生成 task-status.json，格式与原 Agent 完全兼容"""
    tasks = {}
    for task in manifest['tasks']:
        tasks[task['task_id']] = {
            'status': 'pending',
            'name': task['goal'][:50] + ('...' if len(task['goal']) > 50 else ''),
            'dependencies': task['explicit_dependencies'],
            'execution_mode': task['execution_mode']
        }

    return {
        'tasks': tasks,
        'execution_order': manifest['execution_plan']['execution_order'],
        'parallel_groups': manifest['execution_plan']['parallel_groups']
    }


def generate_execution_plan(manifest):
    """生成人类可读的 execution-plan.md，格式与原 Agent 完全兼容"""
    lines = []
    lines.append('# 执行计划 - ' + manifest['project_name'])
    lines.append('')
    lines.append('## 项目基本信息')
    lines.append('')
    lines.append(f"- **项目名称**: {manifest['project_name']}")
    lines.append(f"- **生成时间**: {manifest['generated_at'][:10]}")
    lines.append(f"- **任务总数**: {manifest['execution_plan']['total_tasks']}")
    lines.append(f"- **预计耗时**: {manifest['execution_plan']['estimated_duration']}")
    lines.append(f"- **技术栈**: {manifest['demand_context']['technical_stack']}")
    lines.append('')

    # 风险说明
    lines.append('## 风险说明')
    lines.append('')
    lines.append('| 风险等级 | 数量 |')
    lines.append('|----------|------|')
    risk = manifest['execution_plan']['risk_summary']
    lines.append(f"| low | {risk['low']} |")
    lines.append(f"| medium | {risk['medium']} |")
    lines.append(f"| high | {risk['high']} |")
    lines.append('')

    # 执行顺序
    lines.append('## 执行顺序说明')
    lines.append('')
    order = manifest['execution_plan']['execution_order']
    lines.append(f"按以下顺序执行：{' → '.join(order)}")
    lines.append('')

    # 任务详情
    lines.append('## 任务详情')
    lines.append('')
    for task in manifest['tasks']:
        lines.append(f"### {task['task_id']}: {task['module']}")
        lines.append(f"- **目标**: {task['goal']}")
        if task['context']:
            lines.append(f"- **上下文**: {task['context']}")
        if task['quality_standards']:
            lines.append(f"- **质量标准**: {task['quality_standards']}")
        lines.append(f"- **执行模式**: {task['execution_mode']}")
        lines.append(f"- **风险等级**: {task['estimated_size_risk']}")
        if task['explicit_dependencies']:
            lines.append(f"- **依赖**: {', '.join(task['explicit_dependencies'])}")
        lines.append('')

    # 质量门禁
    lines.append('## 质量门禁')
    lines.append('')
    for gate in manifest['execution_plan']['quality_gates']:
        lines.append(f'- {gate}')
    lines.append('')

    # 验收标准
    lines.append('## 验收标准')
    lines.append('')
    lines.append('1. 所有功能按设计实现')
    lines.append('2. TypeScript 类型声明完整')
    lines.append('3. 代码通过 lint 和类型检查')
    lines.append('4. 符合项目编码规范')

    return '\n'.join(lines)


def main():
    if len(sys.argv) < 3:
        print("用法: python3 xmind_parser.py <input_file> <output_dir>")
        print("")
        print("确定性 XMind 解析，输出格式与原 Agent 完全兼容")
        print("")
        print("返回码:")
        print("  0 - 成功")
        print("  1 - 错误")
        print("  2 - 需要 Agent 兜底（无法解析的复杂情况）")
        sys.exit(1)

    input_file = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])

    if not input_file.exists():
        print(f"❌ 输入文件不存在: {input_file}")
        sys.exit(1)

    content = input_file.read_text(encoding='utf-8')

    print("========================================")
    print("🔍 确定性 XMind 解析 v1.0")
    print("========================================")
    print(f"📄 输入文件: {input_file}")
    print(f"📂 输出目录: {output_dir}")
    print("")

    # 解析
    parsed = parse_xmind_markdown(content)
    task_count = len(parsed['tasks'])

    print(f"✅ 解析完成，共发现 {task_count} 个任务")

    if task_count == 0:
        print("")
        print("⚠️  未识别到任务，可能是复杂结构")
        print("   → 降级调用 Agent 兜底")
        sys.exit(2)

    for task in parsed['tasks']:
        print(f"   {task['task_id']}: {task['module']} - {task['goal'][:40]}...")

    print("")

    # 生成各输出文件（格式与原 Agent 完全兼容）
    manifest = generate_task_manifest(parsed, input_file)
    task_status = generate_task_status(manifest)
    execution_plan = generate_execution_plan(manifest)

    # 写入文件
    output_dir.mkdir(parents=True, exist_ok=True)

    with open(output_dir / 'task-manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print("✅ task-manifest.json 已写入")

    with open(output_dir / 'task-status.json', 'w', encoding='utf-8') as f:
        json.dump(task_status, f, indent=2, ensure_ascii=False)
    print("✅ task-status.json 已写入")

    with open(output_dir / 'execution-plan.md', 'w', encoding='utf-8') as f:
        f.write(execution_plan)
    print("✅ execution-plan.md 已写入")

    # 复制源文件
    import shutil
    shutil.copy(input_file, output_dir / 'task-definition.md')
    print("✅ task-definition.md 已写入")

    print("")
    print("========================================")
    print(f"✅ 所有文件已生成到: {output_dir}")
    print("========================================")
    print("")
    print("📊 性能统计:")
    print(f"   任务数量: {task_count}")
    print(f"   执行模式分布: plan-only={sum(1 for t in manifest['tasks'] if t['execution_mode'] == 'plan-only')}")
    print(f"                   review-first={sum(1 for t in manifest['tasks'] if t['execution_mode'] == 'review-first')}")
    print(f"                   auto-exec={sum(1 for t in manifest['tasks'] if t['execution_mode'] == 'auto-exec')}")
    print(f"   风险分布: low={manifest['execution_plan']['risk_summary']['low']}")
    print(f"              medium={manifest['execution_plan']['risk_summary']['medium']}")
    print(f"              high={manifest['execution_plan']['risk_summary']['high']}")
    print("")


if __name__ == '__main__':
    main()
