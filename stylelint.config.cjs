const standardScss = require('stylelint-config-standard-scss')
const scssPlugin = require('stylelint-scss')

module.exports = {
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
    'value-keyword-case': 'lower',
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global']
    }],
    'declaration-block-no-shorthand-property-overrides': null
  }
}
