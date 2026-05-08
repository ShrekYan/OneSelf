/**
 * @decision FADR-003
 * @title MobX 双轨状态管理架构
 * @why 全局状态和页面状态分层，避免状态污染，局部状态随页面生命周期自动销毁无内存泄漏，全局状态单一入口便于追踪和调试，符合 MobX 最佳实践，类型安全
 * @appliesTo apps/web/**
 * @severity error
 * @version 1.0
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 observer() HOC，必须使用 useObserver() Hook',
      category: 'MobX',
      recommended: true,
    },
    messages: {
      noMobxObserverHoc: '❌ 违反 FADR-003：禁止使用 observer() HOC，必须使用 useObserver() Hook',
    },
  },
  create(context) {
    const filename = context.filename || context.getFilename();

    // 只在前端代码中检查
    if (!filename.includes('apps/web/')) {
      return {};
    }

    return {
      CallExpression(node) {
        // 检查 observer(Component) 调用
        if (
          node.callee.type === 'Identifier'
          && node.callee.name === 'observer'
        ) {
          context.report({
            node,
            messageId: 'noMobxObserverHoc',
          });
        }
      },
    };
  },
};
