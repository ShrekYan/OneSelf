# Research: 小贝工具库

**Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

## Overview

本文件为全局研究索引，汇总跨阶段决策和架构选择。阶段相关决策请参考各阶段文档。

## Global Decisions

### Decision 1: 保持单一 Feature 组织

**Decision**: 小贝工具库作为单一 feature 组织，包含字符串工具、数字工具和数组工具三个阶段。

**Rationale**: 用户明确要求"生成一个 Speckit feature，而不是三个 feature"。三个阶段属于同一工具库的不同能力集合，保持单一 feature 便于统一管理和维护。

**Alternatives considered**:

- 拆分为三个独立 feature：不采纳，违背用户明确要求。

### Decision 2: 使用 stages/ 目录分片管理阶段文档

**Decision**: 在 `specs/002-xiaobei-utils/stages/` 目录下为每个阶段创建独立文档目录。

**Rationale**: 当前三个阶段已让根目录文件明显膨胀；如果未来扩展到 10 个阶段，继续把全部细节集中在根目录文件中，会带来 AI 上下文浪费、信息稀释、阶段间约束误串、审查困难和后续维护成本上升。

**Alternatives considered**:

- 继续使用根目录单一文件：不采纳，会导致文件过大难以维护。

### Decision 3: 全局约束 - 不包含单元测试交付要求

**Decision**: 整个小贝工具库 feature 不规划单元测试交付要求，验收以功能契约、类型声明和行为边界说明为准。

**Rationale**: 用户已明确澄清"去除单元测试"。因此当前 feature 不再把任何单元测试作为交付或验收要求。

**Alternatives considered**:

- 保留部分单元测试：不采纳，违背用户最新澄清。

### Decision 4: 全局约束 - 无新增外部依赖

**Decision**: 所有工具函数均使用 JavaScript 原生能力实现，不引入第三方库。

**Rationale**: 工具函数均为基础能力，原生 JavaScript 已足够满足需求；避免为简单工具函数引入不必要的依赖。

**Alternatives considered**:

- 引入 lodash 等工具库：不采纳，增加不必要的依赖复杂度。

### Decision 5: 保留 contracts/ 目录兼容旧路径

**Decision**: 保留 `contracts/` 目录作为兼容入口，同时在 stages/ 目录中创建规范的阶段文档。

**Rationale**: 当前 tasks.md、checklist 和历史文档中有很多引用指向 contracts/ 目录，直接删除会破坏现有工作流和链接。

**Alternatives considered**:

- 直接删除 contracts/ 目录：不采纳，会破坏现有链接。

## Stage Research References

| Stage ID | Stage Name | Stage Plan (Design Decisions)                                    |
| -------- | ---------- | ---------------------------------------------------------------- |
| 01       | 字符串工具 | [stages/01-string-utils/plan.md](stages/01-string-utils/plan.md) |
| 02       | 数字工具   | [stages/02-number-utils/plan.md](stages/02-number-utils/plan.md) |
| 03       | 数组工具   | [stages/03-array-utils/plan.md](stages/03-array-utils/plan.md)   |

## Stage-Specific Decisions Summary

### 字符串工具阶段

- 采用原生字符串语义（trim、uppercase、lowercase）
- 使用单一文件 `apps/web/src/utils/string.ts` 承载

### 数字工具阶段

- 采用基础 number 语义进行加减运算
- 数字格式化采用千分位展示规则
- 使用单一文件 `apps/web/src/utils/number.ts` 承载

### 数组工具阶段

- 数组去重采用浅层唯一性规则
- 数组排序采用默认升序规则，不修改原数组
- 数组过滤采用同步 predicate
- 使用单一文件 `apps/web/src/utils/array.ts` 承载
