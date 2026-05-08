/**
 * ESLint 自定义 Formatter - 仅负责输出美观的错误信息
 *
 * ✅ 重构说明：记录逻辑已移到 post-edit-check.js 主脚本中
 * 本 formatter 只负责：格式化输出 + 返回结构化数据
 */

export default function (results, context) {
  let output = '';
  let errorCount = 0;
  const architectureViolations = [];

  for (const result of results) {
    const messages = result.messages.filter(
      (m) => m.ruleId && m.ruleId.startsWith('@claude/architecture/'),
    );

    if (messages.length === 0) continue;

    errorCount += messages.length;
    output += `\n📁 文件: ${result.filePath}\n`;

    for (const message of messages) {
      output += `  ${message.line}:${message.column}  ${message.message}\n`;
      output += `  规则: ${message.ruleId}\n\n`;

      architectureViolations.push({
        ruleId: message.ruleId,
        filePath: result.filePath,
        line: message.line,
        column: message.column,
        message: message.message,
        severity: message.severity,
      });
    }
  }

  if (errorCount > 0) {
    output += '='.repeat(70) + '\n';
    output += `❌ 发现 ${errorCount} 个架构违规\n`;
    output += '='.repeat(70) + '\n';
  }

  // 把结构化数据附加到输出末尾，主脚本可以解析
  // 格式：__VIOLATION_DATA__ + JSON + __END__
  output += '__VIOLATION_DATA__';
  output += JSON.stringify(architectureViolations);
  output += '__END__\n';

  return output;
}
