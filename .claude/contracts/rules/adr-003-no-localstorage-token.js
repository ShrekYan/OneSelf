/**
 * @decision ADR-003
 * @title HttpOnly Cookie 为唯一 Token 存储方案
 * @why Access Token 和 Refresh Token 全部通过 HttpOnly Cookie 传输，从根本上防御 XSS 攻击窃取 Token，浏览器自动处理，减少前端代码复杂度，符合 OWASP 安全最佳实践
 * @appliesTo apps/web/**
 * @severity error
 * @version 1.0
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 localStorage 存储 Token',
      category: 'Security',
      recommended: true,
    },
    messages: {
      noLocalstorageToken: '❌ 违反 ADR-003：禁止使用 localStorage 存储 Token，必须使用 HttpOnly Cookie 方案',
    },
  },
  create(context) {
    const filename = context.filename || context.getFilename();

    // 只在前端代码中检查
    if (!filename.includes('apps/web/')) {
      return {};
    }

    return {
      MemberExpression(node) {
        // 检查 localStorage.setItem
        if (
          node.object.type === 'Identifier'
          && node.object.name === 'localStorage'
          && node.property.type === 'Identifier'
          && node.property.name === 'setItem'
        ) {
          const parent = node.parent;
          if (
            parent.type === 'CallExpression'
            && parent.callee === node
            && parent.arguments.length > 0
          ) {
            const firstArg = parent.arguments[0];
            // 检查 key 是否包含 token 相关关键字
            if (
              firstArg.type === 'Literal'
              && typeof firstArg.value === 'string'
              && firstArg.value.toLowerCase().includes('token')
            ) {
              context.report({
                node: parent,
                messageId: 'noLocalstorageToken',
              });
            }
          }
        }
      },
    };
  },
};
