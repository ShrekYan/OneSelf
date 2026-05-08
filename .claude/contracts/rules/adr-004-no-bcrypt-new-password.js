/**
 * @decision ADR-004
 * @title 密码加密使用 Argon2id 算法
 * @why Argon2 是目前最安全的密码哈希算法，抗 GPU/ASIC 攻击，支持平滑迁移用户无感知，数据库同时存储 password_hash 和 password_algorithm 两个字段，验证成功后自动将 bcrypt 哈希升级为 Argon2id
 * @appliesTo services/**
 * @severity error
 * @version 1.0
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 bcrypt 哈希新密码',
      category: 'Security',
      recommended: true,
    },
    messages: {
      noBcryptNewPassword: '❌ 违反 ADR-004：禁止使用 bcrypt 哈希新密码，必须使用 argon2id',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        // 检查 bcrypt.hash 调用
        if (
          node.callee.type === 'MemberExpression'
          && node.callee.object.type === 'Identifier'
          && node.callee.object.name === 'bcrypt'
          && node.callee.property.type === 'Identifier'
          && node.callee.property.name === 'hash'
        ) {
          context.report({
            node,
            messageId: 'noBcryptNewPassword',
          });
        }
      },
    };
  },
};
