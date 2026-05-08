#!/usr/bin/env node
/**
 * Claude Code PostToolUse 钩子：代码编辑完成后自动检查架构合规性
 *
 * ✅ v2.0 重构：违规记录逻辑移到主脚本，更可控、更易调试
 *
 * 功能：
 * 1. 每次 Claude 编辑/写入文件后，自动检查是否违反架构契约
 * 2. 发现违规时输出清晰的错误信息
 * 3. ✅ 自动记录到 review-log.json（主脚本处理，不依赖 formatter）
 */

import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { recordViolations, markFixedViolations } from './violation-logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = process.cwd();

// 需要检查的服务目录
const SERVICES = [
  { name: 'web', cwd: 'apps/web' },
  { name: 'backend', cwd: 'services/backend' },
  { name: 'auth-service', cwd: 'services/auth-service' },
  { name: 'log-service', cwd: 'services/log-service' },
];

// 从 stdin 读取 Claude 传入的工具调用信息
async function readToolInput() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
  });
}

// 检查单个文件是否违反架构规则
function checkFile(filePath) {
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

  // 只检查代码文件
  if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) {
    return null;
  }

  try {
    const relativePath = path.relative(service.cwd, filePath);
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
      filePath,
      service: service.name,
      success: true,
      hasViolations: output.includes('@claude/architecture/'),
      rawOutput: output,
    };
  } catch (e) {
    // ESLint 发现违规时会退出码非 0，这是正常的
    const output = e.stdout || e.message || '';
    const hasViolations = String(output).includes('@claude/architecture/');

    return {
      filePath,
      service: service?.name || 'unknown',
      success: false,
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

async function main() {
  const input = await readToolInput();

  // 从输入中提取修改的文件路径
  let filesToCheck = [];

  if (input && input.tool_input) {
    // Edit/Write 工具的 file_path 参数
    if (input.tool_input.file_path) {
      filesToCheck.push(input.tool_input.file_path);
    }
    // MultiEdit 的 paths
    if (Array.isArray(input.tool_input.paths)) {
      filesToCheck = [...filesToCheck, ...input.tool_input.paths];
    }
  }

  // 如果没有找到文件信息，通过 git 检测所有修改的文件（包括未追踪的新文件）
  if (filesToCheck.length === 0) {
    try {
      // 1. 已追踪文件的修改
      const gitDiffOutput = execFileSync('git', ['diff', '--name-only'], {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
      });
      const modifiedFiles = gitDiffOutput.trim().split('\n').filter(Boolean);

      // 2. 未追踪的新文件（Claude 刚创建的全新文件）
      const gitLsOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
      });
      const untrackedFiles = gitLsOutput.trim().split('\n').filter(Boolean);

      filesToCheck = [...new Set([...modifiedFiles, ...untrackedFiles])];
    } catch {
      // git 失败时静默退出
      process.exit(0);
    }
  }

  if (filesToCheck.length === 0) {
    process.exit(0);
  }

  // 逐个检查
  const results = filesToCheck
    .map((filePath) => checkFile(filePath))
    .filter((r) => r !== null);

  const violations = results.filter((r) => r.hasViolations);

  // ✅ P0 新增：先检查并标记已修复的违规
  const filesToCheckFullPath = filesToCheck.map((f) =>
    path.isAbsolute(f) ? f : path.join(PROJECT_ROOT, f),
  );
  const fixedCount = markFixedViolations(filesToCheckFullPath);
  if (fixedCount > 0) {
    console.log(`✨ 检测到 ${fixedCount} 条违规已自动标记为已修复`);
  }

  if (violations.length > 0) {
    console.error('\n' + '='.repeat(70));
    console.error('⚠️  架构合规性检查 - 发现违规');
    console.error('='.repeat(70));

    // 收集所有结构化违规数据
    const allViolations = [];
    for (const v of violations) {
      console.error(`\n📁 文件: ${v.filePath}`);

      // 显示人类可读的错误信息（去掉数据标记部分）
      const displayOutput = v.rawOutput.replace(
        /__VIOLATION_DATA__[\s\S]*?__END__/,
        '',
      );
      console.error(displayOutput);

      // 解析结构化数据用于记录
      const parsed = parseViolationsFromOutput(v.rawOutput);
      allViolations.push(...parsed);
    }

    // ✅ 主脚本统一记录违规
    if (allViolations.length > 0) {
      const recordedCount = recordViolations(allViolations, 'post-edit-hook');
      console.error(
        `\n📝 已自动记录 ${recordedCount} 条架构违规到 review-log.json`,
      );
    }

    console.error('💡 请修正后重新生成');
    console.error('='.repeat(70));

    // 退出码非 0，让 Claude 知道有问题
    process.exit(1);
  } else {
    console.log('✅ 架构合规性检查 - 通过');
    process.exit(0);
  }
}

main().catch((err) => {
  // 出错时不阻断，避免影响正常流程
  console.error('架构检查出错:', err.message);
  process.exit(0);
});
