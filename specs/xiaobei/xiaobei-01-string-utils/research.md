# Research: 小贝字符串工具函数

## Decision: 使用现有主字符串工具作为主能力入口

**Rationale**: 仓库中已存在 `apps/web/src/utils/string.ts`，适合作为 `trim`、`uppercase`、`lowercase` 三个主工具能力的承载文件。继续使用该文件可避免重复定义主入口，也能保持工具目录职责清晰。

**Alternatives considered**:

- 新建另一个主工具文件：会造成主能力入口不清晰，且与现有文件重复。
- 将字符串工具放入共享包：当前需求只限定在前端工具目录，跨系统共享会扩大范围。

## Decision: 备份字符串工具使用独立入口

**Rationale**: 用户明确提出“备份字符串工具函数”。独立文件 `apps/web/src/utils/string-backup.ts` 可以清晰表达备用能力，同时在契约中要求与主工具保持同等行为，便于后续契约核对。

**Alternatives considered**:

- 在主工具文件内混合导出备份函数：文件职责不够清晰，不利于区分主入口和备用入口。
- 仅通过别名重导出主工具：实现更简单，但不能清晰体现“备份工具函数”作为独立入口的可识别性。

## Decision: 输入范围限定为字符串值

**Rationale**: 规格假设已明确“输入域为 string values only”。这能保持工具函数契约简单、可核对、类型清晰，避免为非字符串输入设计额外容错行为。

**Alternatives considered**:

- 接受 `null` / `undefined` 并返回空字符串：会扩大当前契约范围，且与澄清后的 string-only 输入域不一致。
- 接受任意值并转换为字符串：会引入隐式转换风险，不符合类型明确目标。

## Decision: 不新增运行时依赖

**Rationale**: 去空格和大小写转换均可由语言原生能力完成。新增依赖会增加维护成本，不符合简单性要求。

**Alternatives considered**:

- 引入第三方字符串库：能力过重，且当前需求只包含三个简单转换。

## Decision: 去除单元测试要求

**Rationale**: 用户已澄清“去除单元测试”。本阶段不新增或运行单元测试，验证范围收敛为契约核对、TypeScript 类型检查和 lint，避免被现有无关测试配置问题阻塞。

**Alternatives considered**:

- 继续运行 `npm run test:run`：与用户澄清冲突，且当前测试套件存在与本功能无关的配置失败。
- 为字符串工具新增 Vitest 用例：超出本阶段明确范围。
