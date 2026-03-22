import stylelint from 'stylelint'
import standardScss from 'stylelint-config-standard-scss'
import scssPlugin from 'stylelint-scss'

export default stylelint.createConfig({
  extends: [
    standardScss
  ],
  plugins: [
    scssPlugin
  ],
  files: ['**/*.{scss,css}'],
  ignores: ['node_modules'],
  rules: {
    // 规则覆盖
    'scss/at-rule-no-unknown': [true, {
      ignoreAtRules: ['mixin', 'include', 'extend', 'if', 'else', 'for', 'each']
    }],
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-single-line-max-declarations': 3,
    'no-descending-specificity': null,
    'color-function-notation': 'modern',
    'font-family-name-quotes': 'always-where-recommended',
    'function-url-quotes': 'always',
    'selector-attribute-quotes': 'always',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    'unit-case': 'lower',
    'value-keyword-case': 'lower',
    'value-list-comma-newline-after': 'always-multi-line',
    'value-list-comma-space-after': 'always'
  }
})
