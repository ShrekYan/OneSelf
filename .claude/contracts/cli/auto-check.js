#!/usr/bin/env node
/**
 * Claude Code 生成代码后自动检查架构规则
 *
 * ✅ v2.0 重构：使用共享的 violation-logger.js 模块
 *
 * 使用方式：
 *   node .claude/contracts/cli/auto-check.js
 */

import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { recordViolations, markFixedViolations } from './violation-logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// 需要检查的服务目录
const SERVICES = [
  { name: 'web', cwd: 'apps/web' },
  { name: 'backend', cwd: 'services/backend' },
  { name: 'auth-service', cwd: 'services/auth-service' },
  { name: 'log-service', cwd: 'services/log-service' },
];

// 获取 git status 中修改的文件（检测 Claude 刚修改的文件，包括未追踪的新文件）
function getModifiedFiles() {
  try {
    // git status --porcelain 同时包含已修改和未追踪的文件
    // 已修改：M 前缀，未追踪：?? 前缀
    const output = execFileSync('git', ['status', '--porcelain'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });
    return output
      .trim()
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const match = line.trim().match(/^(\S+)\s+(.+)$/);
        if (!match) return null;
        return {
          status: match[1],
          filePath: match[2],
        };
      })
      .filter((f) => f && f.filePath.match(/\.(ts|tsx|js|jsx)$/));
  } catch (e) {
    return [];
  }
}

// 检查单个文件
function checkFile(fileInfo) {
  const { filePath } = fileInfo;

  // 确定属于哪个服务
  let service = null;
  for (const s of SERVICES) {
    if (filePath.startsWith(s.cwd)) {
      service = s;
      break;
    }
  }

  if (!service) {
    return null;
  }

  // 计算相对服务目录的路径
  const relativePath = path.relative(service.cwd, filePath);

  try {
    const formatterPath = path.relative(
      path.join(PROJECT_ROOT, service.cwd),
      path.join(__dirname, 'eslint-formatter.js'),
    );

    const output = execFileSync(
      'npx',
      ['eslint', relativePath, '-f', `./${formatterPath}`],
      {
        cwd: path.join(PROJECT_ROOT, service.cwd),
        encoding: 'utf8',
      },
    );

    return {
      service: service.name,
      filePath,
      hasViolations: output.includes('@claude/architecture/'),
      rawOutput: output,
    };
  } catch (e) {
    // ESLint 报错时也返回结果（因为有违规时 ESLint 会退出码非 0）
    const output = e.stdout || e.message || '';
    const hasViolations = String(output).includes('@claude/architecture/');
    return {
      service: service.name,
      filePath,
      hasViolations,
      rawOutput: String(output),
    };
  }
}

// 从 formatter 输出中解析结构化违规数据
function parseViolationsFromOutput(rawOutput) {
  const match = rawOutput.match(/__VIOLATION_DATA__([\s\S]*?)__END__/);
  if (!match) return [];

  try {
    return JSON.parse(match[1]);
  } catch {
    return [];
  }
}

function main() {
  console.log('🔍 Claude Code 架构合规性自动检查');
  console.log('='.repeat(60));

  // 获取 git 中修改的文件
  const modifiedFiles = getModifiedFiles();

  if (modifiedFiles.length === 0) {
    console.log('✅ 没有检测到修改的代码文件');
    process.exit(0);
  }

  console.log(`检测到 ${modifiedFiles.length} 个修改的文件：`);
  modifiedFiles.forEach((f) => console.log(`  ${f.status} ${f.filePath}`));
  console.log('');

  // 逐个检查
  const results = modifiedFiles.map(checkFile).filter((r) => r !== null);

  if (results.length === 0) {
    console.log('✅ 没有需要检查的文件');
    process.exit(0);
  }

  // 统计结果
  const passed = results.filter((r) => !r.hasViolations).length;
  const failed = results.filter((r) => r.hasViolations).length;

  console.log(`\n📊 检查结果：`);
  console.log(`  ✅ 通过: ${passed}`);
  console.log(`  ❌ 架构违规: ${failed}`);

  // 显示违规详情并记录
  const violations = results.filter((r) => r.hasViolations);

  // ✅ P0 新增：先检查并标记已修复的违规
  const filesToCheckFullPath = modifiedFiles.map((f) =>
    path.isAbsolute(f.filePath) ? f.filePath : path.join(PROJECT_ROOT, f.filePath),
  );
  const fixedCount = markFixedViolations(filesToCheckFullPath);
  if (fixedCount > 0) {
    console.log(`\n✨ 检测到 ${fixedCount} 条违规已自动标记为已修复`);
  }

  if (violations.length > 0) {
    console.log(`\n❌ 发现 ${violations.length} 个架构违规：`);
    console.log('-'.repeat(60));

    const allViolations = [];
    for (const v of violations) {
      console.log(`\n📁 文件: ${v.filePath}`);

      // 显示人类可读的错误信息（去掉数据标记部分）
      const displayOutput = v.rawOutput.replace(
        /__VIOLATION_DATA__[\s\S]*?__END__/,
        '',
      );
      console.log(displayOutput);

      // 解析结构化数据
      const parsed = parseViolationsFromOutput(v.rawOutput);
      allViolations.push(...parsed);
    }

    // ✅ 记录违规
    if (allViolations.length > 0) {
      const recordedCount = recordViolations(allViolations, 'auto-check');
      console.log(`\n📝 已自动记录 ${recordedCount} 条架构违规到 review-log.json`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('⚠️  请修正违规后再提交');
    process.exit(1);
  } else {
    console.log('\n✅ 所有生成的代码均符合架构规则');
    process.exit(0);
  }
}

main().catch(console.error);
