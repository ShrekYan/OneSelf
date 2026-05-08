/**
 * @decision ADR-002
 * @title 认证服务与业务服务分离
 * @why Token 签发、刷新、验证完全由 auth-service 负责，安全策略统一管理，未来支持多业务服务接入时无需重复实现认证逻辑
 * @appliesTo services/backend/**, services/log-service/**
 * @severity error
 * @version 1.0
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'backend 服务禁止引入 jsonwebtoken',
      category: 'Architecture',
      recommended: true,
    },
    messages: {
      noJwtInBackend: '❌ 违反 ADR-002：backend 服务禁止引入 jsonwebtoken，Token 验证必须通过 auth-service HTTP 调用',
    },
  },
  create(context) {
    const filename = context.filename || context.getFilename();

    // 只在非 auth-service 的后端服务中检查
    if (filename.includes('services/auth-service/')) {
      return {};
    }

    if (!filename.includes('services/backend/') && !filename.includes('services/log-service/')) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'jsonwebtoken') {
          context.report({
            node,
            messageId: 'noJwtInBackend',
          });
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier'
          && node.callee.name === 'require'
          && node.arguments.length > 0
          && node.arguments[0].type === 'Literal'
          && node.arguments[0].value === 'jsonwebtoken'
        ) {
          context.report({
            node,
            messageId: 'noJwtInBackend',
          });
        }
      },
    };
  },
};
