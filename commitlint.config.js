export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci'
      ]
    ],
    'subject-case': [0],
    'subject-max-length': [1, 'always', 100],
    'subject-min-length': [2, 'always', 2]
  }
}
