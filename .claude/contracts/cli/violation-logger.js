/**
 * 违规记录器 - 共享模块
 *
 * 负责读取、写入、更新 review-log.json
 * 被 post-edit-check.js / auto-check.js / record-violation.js 共享使用
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.resolve(__dirname, '../../review-log.json');

export function loadLog() {
  if (!fs.existsSync(LOG_FILE)) {
    return {
      schemaVersion: '1.0',
      project: 'claude-blog-monorepo',
      violations: [],
      monthlyStats: {
        totalReviews: 0,
        totalViolations: 0,
        topViolatedDecisions: [],
      },
      lastUpdated: null,
    };
  }
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
}

export function saveLog(log) {
  log.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

function generateId(log, today) {
  const todayStr = today.replace(/-/g, '');
  const todayCount = log.violations.filter((v) => v.date === today).length;
  return `V-${todayStr}-${String(todayCount + 1).padStart(2, '0')}`;
}

function extractDecisionId(ruleId) {
  // @claude/architecture/adr-003-no-localstorage-token -> ADR-003
  const match = ruleId.match(/(adr|fadr)-\d+/i);
  return match ? match[0].toUpperCase() : ruleId;
}

/**
 * 记录 ESLint 自动检测到的违规到日志
 * @param {Array} violations - ESLint 输出的违规数组
 * @param {string} source - 记录来源（post-edit-hook / auto-check）
 * @returns {number} 实际记录的数量（去重后）
 */
export function recordViolations(violations, source = 'unknown') {
  const log = loadLog();
  const today = new Date().toISOString().split('T')[0];
  let recordedCount = 0;

  for (const v of violations) {
    // 去重：同一天同一文件同一规则只记录一次
    const duplicate = log.violations.find(
      (existing) =>
        existing.date === today &&
        existing.filePath === v.filePath &&
        existing.ruleName === v.ruleId,
    );

    if (duplicate) continue;

    const decisionId = extractDecisionId(v.ruleId);
    const newViolation = {
      id: generateId(log, today),
      date: today,
      decisionId,
      ruleName: v.ruleId,
      description: v.message,
      filePath: v.filePath,
      line: v.line,
      column: v.column,
      severity: v.severity === 2 ? 'high' : 'medium',
      fixed: false,
      notes: `自动记录 - ${source}`,
      recordedBy: source,
    };

    log.violations.unshift(newViolation);
    log.monthlyStats.totalViolations += 1;

    // 更新 topViolatedDecisions
    const decisionIndex = log.monthlyStats.topViolatedDecisions.findIndex(
      (d) => d.decisionId === decisionId,
    );
    if (decisionIndex >= 0) {
      log.monthlyStats.topViolatedDecisions[decisionIndex].count += 1;
    } else {
      log.monthlyStats.topViolatedDecisions.push({
        decisionId,
        count: 1,
        lastViolated: today,
      });
    }
    log.monthlyStats.topViolatedDecisions.sort((a, b) => b.count - a.count);

    recordedCount++;
  }

  if (recordedCount > 0) {
    log.monthlyStats.totalReviews += 1;
    saveLog(log);
  }

  return recordedCount;
}

/**
 * ✅ P0 新增：手动记录违规（供 record-violation.js CLI 工具使用）
 * @param {Object} violation - 手动输入的违规信息
 * @param {string} violation.decisionId - 决策 ID (如 ADR-003)
 * @param {string} violation.description - 违规描述
 * @param {string} violation.filePath - 文件路径
 * @param {string} violation.severity - 严重程度
 * @param {string} violation.notes - 备注
 * @returns {Object} 新创建的违规对象
 */
export function recordManualViolation(violation) {
  const log = loadLog();
  const today = new Date().toISOString().split('T')[0];

  const newViolation = {
    id: generateId(log, today),
    date: today,
    decisionId: violation.decisionId,
    ruleName: violation.ruleName || '',
    description: violation.description,
    filePath: violation.filePath || '',
    line: violation.line || 0,
    column: violation.column || 0,
    severity: violation.severity || 'medium',
    fixed: false,
    notes: violation.notes || '',
    recordedBy: 'manual',
  };

  log.violations.unshift(newViolation);
  log.monthlyStats.totalViolations += 1;

  // 更新 topViolatedDecisions
  const decisionIndex = log.monthlyStats.topViolatedDecisions.findIndex(
    (d) => d.decisionId === violation.decisionId,
  );
  if (decisionIndex >= 0) {
    log.monthlyStats.topViolatedDecisions[decisionIndex].count += 1;
  } else {
    log.monthlyStats.topViolatedDecisions.push({
      decisionId: violation.decisionId,
      count: 1,
      lastViolated: today,
    });
  }
  log.monthlyStats.topViolatedDecisions.sort((a, b) => b.count - a.count);

  saveLog(log);
  return newViolation;
}

/**
 * ✅ P0 新增：标记已修复的违规
 *
 * 工作原理：
 * 1. 找出所有 fixed: false 且 filePath 在本次修改文件列表中的违规
 * 2. 对每个文件重新跑 ESLint 检查
 * 3. 如果该违规的规则不再触发，说明已修复，标记 fixed: true
 *
 * @param {Array} modifiedFiles - 本次修改的文件路径列表
 * @returns {number} 被标记为已修复的违规数量
 */
export function markFixedViolations(modifiedFiles) {
  const log = loadLog();
  const today = new Date().toISOString().split('T')[0];
  let fixedCount = 0;

  // 找出需要检查的违规：未修复 + 文件在本次修改列表中
  const violationsToCheck = log.violations.filter(
    (v) => !v.fixed && modifiedFiles.includes(v.filePath),
  );

  if (violationsToCheck.length === 0) {
    return 0;
  }

  // 按文件分组
  const violationsByFile = {};
  for (const v of violationsToCheck) {
    if (!violationsByFile[v.filePath]) {
      violationsByFile[v.filePath] = [];
    }
    violationsByFile[v.filePath].push(v);
  }

  // 对每个文件重新跑 ESLint 检查
  for (const [filePath, fileViolations] of Object.entries(violationsByFile)) {
    // 确定文件所属服务
    // 注意：filePath 是绝对路径，s.cwd 是相对路径，所以用 includes 匹配
    const SERVICES = [
      { name: 'web', cwd: 'apps/web' },
      { name: 'backend', cwd: 'services/backend' },
      { name: 'auth-service', cwd: 'services/auth-service' },
      { name: 'log-service', cwd: 'services/log-service' },
    ];

    let service = null;
    for (const s of SERVICES) {
      if (filePath.includes(s.cwd)) {
        service = s;
        break;
      }
    }

    if (!service) continue;

    try {
      const relativePath = path.relative(service.cwd, filePath);
      const formatterPath = path.relative(
        path.join(process.cwd(), service.cwd),
        path.join(__dirname, 'eslint-formatter.js'),
      );

      const output = execFileSync(
        'npx',
        ['eslint', relativePath, '-f', `./${formatterPath}`],
        {
          cwd: service.cwd,
          encoding: 'utf8',
        },
      );

      // 解析当前文件的违规规则
      const currentViolations = [];
      const match = output.match(/__VIOLATION_DATA__([\s\S]*?)__END__/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          currentViolations.push(...parsed.map((v) => v.ruleId));
        } catch {}
      }

      // 标记已修复的违规
      for (const v of fileViolations) {
        if (!currentViolations.includes(v.ruleName)) {
          // 规则不再触发，说明已修复
          const index = log.violations.findIndex((item) => item.id === v.id);
          if (index !== -1) {
            log.violations[index].fixed = true;
            log.violations[index].fixedDate = today;
            fixedCount++;
          }
        }
      }
    } catch (e) {
      // ESLint 退出码 1 表示有违规，正常情况，继续处理
      const output = e.stdout || '';
      const currentViolations = [];
      const match = output.match(/__VIOLATION_DATA__([\s\S]*?)__END__/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          currentViolations.push(...parsed.map((v) => v.ruleId));
        } catch {}
      }

      for (const v of fileViolations) {
        if (!currentViolations.includes(v.ruleName)) {
          const index = log.violations.findIndex((item) => item.id === v.id);
          if (index !== -1) {
            log.violations[index].fixed = true;
            log.violations[index].fixedDate = today;
            fixedCount++;
          }
        }
      }
    }
  }

  if (fixedCount > 0) {
    saveLog(log);
  }

  return fixedCount;
}

export default {
  recordViolations,
  recordManualViolation,
  markFixedViolations,
  loadLog,
  saveLog,
  LOG_FILE,
};
