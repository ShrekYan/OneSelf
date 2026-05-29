# 02. 测试、安全与合规 Command 模板

## 分类定位

面向测试框架、安全扫描、依赖审计、监管合规与无障碍审计的 command。该类命令通常需要给出严重级别、证据、复现方式、修复建议和持续治理方案。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `test-harness.md` | Comprehensive Test Harness Generator | 测试框架、测试数据、CI 集成 |
| `security-scan.md` | Security Scan and Vulnerability Assessment | 漏洞报告、风险评估、修复优先级 |
| `deps-audit.md` | Dependency Audit and Security Analysis | 依赖漏洞、许可证合规、升级建议 |
| `compliance-check.md` | Regulatory Compliance Check | GDPR/HIPAA/SOC2/PCI-DSS 合规报告 |
| `accessibility-audit.md` | Accessibility Audit and Testing | WCAG 审计、键盘/读屏/对比度测试 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Audit or Test Command Title}

You are a {testing/security/compliance/accessibility} expert specializing in {standards_and_tools}.

## Context
The user needs to validate {target} against {quality_bar}. Focus on actionable findings, risk prioritization, and repeatable verification.

## Requirements
$ARGUMENTS

## Instructions

### 1. Scope Identification
- Identify application, package, dependency, API, UI, or process scope.
- Identify applicable standards, policies, or test levels.
- Define assumptions and exclusions.

### 2. Automated Checks
- Select tools and rulesets.
- Run or describe scan/test strategy.
- Normalize results into common severity format.

### 3. Manual / Expert Review
- Validate false positives.
- Inspect high-risk areas.
- Add manual test scenarios where automation is insufficient.

### 4. Findings and Remediation
For each finding include:
- Severity
- Evidence
- Impact
- Affected location
- Recommended fix
- Verification method

### 5. Continuous Governance
- CI/CD integration.
- Regression checks.
- Ownership and recurring review cadence.

## Output Format
Return:
- Executive Summary
- Scope
- Tooling / Standards
- Findings by Severity
- Remediation Plan
- Verification Checklist
- Continuous Governance Recommendations
```

## 统一发现项字段

```yaml
finding:
  id: 唯一编号
  severity: Critical | High | Medium | Low | Info
  category: security | compliance | accessibility | dependency | test
  standard: OWASP | WCAG | GDPR | HIPAA | SOC2 | PCI-DSS | license | custom
  location: 文件、URL、依赖包或流程位置
  evidence: 证据
  impact: 影响
  recommendation: 修复建议
  verification: 验证方式
  owner: 建议负责人，可选
```

## 子类型字段

### A. 测试框架

```yaml
test_harness:
  language: python | javascript | typescript | java | go | other
  framework: pytest | jest | vitest | junit | playwright | cypress | other
  test_levels:
    - unit
    - integration
    - e2e
    - contract
  fixtures: []
  ci_steps: []
```

### B. 安全扫描

```yaml
security_scan:
  dimensions:
    - OWASP Top 10
    - secrets
    - dependency vulnerabilities
    - headers
    - API security
    - infrastructure
  risk_matrix:
    likelihood: low | medium | high
    impact: low | medium | high
```

### C. 合规检查

```yaml
compliance:
  regulations:
    - GDPR
    - HIPAA
    - SOC2
    - PCI-DSS
  controls: []
  audit_trail: []
  data_subject_rights: []
```

### D. 无障碍审计

```yaml
accessibility:
  wcag_level: A | AA | AAA
  checks:
    - automated axe/pa11y
    - keyboard navigation
    - screen reader
    - color contrast
    - mobile accessibility
  assistive_tech: []
```
