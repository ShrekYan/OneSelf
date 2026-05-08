/**
 * @decision ADR-006
 * @title Prisma 模型 PascalCase 命名规范
 * @why 所有 Prisma 模型名使用 PascalCase 大驼峰命名，数据库表名保持 snake_case 下划线命名（通过 @@map 映射，无需使用 as any 绕过类型检查，代码类型安全，减少潜在 bug
 * @appliesTo services/**
 * @severity error
 * @version 1.0
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 (prisma as any)',
      category: 'Type Safety',
      recommended: true,
    },
    messages: {
      noPrismaAsAny: '❌ 违反 ADR-006：禁止使用 (prisma as any)，Prisma 模型名必须使用 PascalCase',
    },
  },
  create(context) {
    return {
      TSAsExpression(node) {
        // 检查 (prisma as any) 模式
        if (
          node.expression.type === 'Identifier'
          && node.expression.name.toLowerCase().includes('prisma')
          && node.typeAnnotation.type === 'TSAnyKeyword'
        ) {
          context.report({
            node,
            messageId: 'noPrismaAsAny',
          });
        }

        // 检查 (this.prisma as any) 模式
        if (
          node.expression.type === 'MemberExpression'
          && node.expression.property.type === 'Identifier'
          && node.expression.property.name.toLowerCase().includes('prisma')
          && node.typeAnnotation.type === 'TSAnyKeyword'
        ) {
          context.report({
            node,
            messageId: 'noPrismaAsAny',
          });
        }
      },
    };
  },
};
