## 本项目特定规则

1. **Co-Author**: 每次自动生成的 commit 需要添加：
   ```
   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   ```

2. **多个改动**: 如果一次提交包含多个不相关改动，建议分成多个 commit，每个 commit 对应一个逻辑改动。

3. **输出语言**:
   - `type`: 保持英文（兼容工具链）
   - `scope`: 中文/英文均可
   - `description`: **必须使用中文**
   - `body` / `footer`: **必须使用中文**

4. **Header 格式**: 必须遵循 `type(<scope>): <description>` 格式。

---

## 检查清单 (Checklist)

生成 commit 信息前，请确认：

- [ ] type 是否符合允许的类型？
- [ ] scope 是否正确对应模块？
- [ ] description 是否简洁清晰（< 30 个汉字）？
- [ ] description 是否不以句号结尾？
- [ ] 是否符合 `type(scope): description` 格式？
- [ ] 破坏性变更是否已在 BREAKING CHANGE 中说明？
- [ ] 关联 Issue 是否正确标注？