#!/usr/bin/env node
/**
 * 架构违规记录 CLI 工具
 *
 * ✅ v2.0 重构：复用 violation-logger.js 共享模块
 *
 * 使用方式:
 *   # 交互式记录
 *   node .claude/contracts/cli/record-violation.js
 *
 *   # 直接传参记录
 *   node .claude/contracts/cli/record-violation.js --decision ADR-003 --desc "localStorage 存 token"
 *
 *   # 显示统计信息
 *   node .claude/contracts/cli/record-violation.js --stats
 */

import { recordManualViolation, loadLog } from './violation-logger.js';

// 解析命令行参数
function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        result[key] = value;
        i++;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

// 交互式询问
async function promptQuestion(question) {
  process.stdout.write(question + ': ');
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function interactiveMode() {
  console.log('📝 记录架构违规 - 交互式模式');
  console.log('='.repeat(50));

  const violation = {
    decisionId: await promptQuestion('决策 ID (如 ADR-003)'),
    description: await promptQuestion('违规描述'),
    filePath: await promptQuestion('文件路径 (可选)'),
    severity: (await promptQuestion('严重程度 (high/medium/low，默认 medium)')) || 'medium',
    notes: await promptQuestion('备注 (可选，如：是 Claude 生成的还是人写的？)'),
  };

  if (!violation.decisionId || !violation.description) {
    console.error('❌ 决策 ID 和描述不能为空');
    process.exit(1);
  }

  const result = recordManualViolation(violation);
  console.log(`\n✅ 已记录: ${result.id}`);
  console.log(`   决策: ${result.decisionId}`);
  console.log(`   描述: ${result.description}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`
架构违规记录工具 v2.0

使用方式:
  交互式:        node record-violation.js
  直接传参:      node record-violation.js --decision ADR-003 --desc "xxx" [--file "src/xxx"] [--severity high]
  查看统计:      node record-violation.js --stats

参数说明:
  --decision, -d    决策 ID (如 ADR-003)
  --desc, -m        违规描述
  --file, -f        文件路径
  --severity, -s    严重程度 (high/medium/low，默认 medium)
  --notes, -n       备注
  --stats           显示统计信息
  --help, -h        显示帮助

✅ v2.0 改进：复用 violation-logger.js 共享模块，代码更简洁可靠
    `);
    process.exit(0);
  }

  if (args.stats) {
    const log = loadLog();
    console.log('\n📊 架构违规统计');
    console.log('='.repeat(50));
    console.log(`总违规数: ${log.violations.length}`);
    console.log(`已修复数: ${log.violations.filter((v) => v.fixed).length}`);
    console.log(`待修复数: ${log.violations.filter((v) => !v.fixed).length}`);
    console.log(`最后更新: ${log.lastUpdated || '无'}`);
    console.log('\nTop 违反规则:');
    log.monthlyStats.topViolatedDecisions.slice(0, 5).forEach((d) => {
      console.log(`  ${d.decisionId}: ${d.count} 次`);
    });
    console.log('');
    process.exit(0);
  }

  // 直接传参模式
  if (args.decision || args.d) {
    const violation = {
      decisionId: args.decision || args.d,
      description: args.desc || args.m || '',
      filePath: args.file || args.f || '',
      severity: args.severity || args.s || 'medium',
      notes: args.notes || args.n || '',
      ruleName: '',
    };

    if (!violation.decisionId || !violation.description) {
      console.error('❌ 必须提供 --decision 和 --desc 参数');
      process.exit(1);
    }

    const result = recordManualViolation(violation);
    console.log(`✅ 已记录: ${result.id}`);
    process.exit(0);
  }

  // 交互式模式
  await interactiveMode();
  process.exit(0);
}

main().catch(console.error);
