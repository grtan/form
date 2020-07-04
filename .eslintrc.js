module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [{
    files: ['**/*.vue'],
    extends: [
      'standard-with-typescript',
      'plugin:vue/recommended'
    ],
    rules: {
      'vue/max-attributes-per-line': ['warn', {
        'singleline': 6, // 一行属性 最多有6个属性
      }]
    }
  }, {
    files: ['**/*.js?(x)'],
    extends: [
      'standard'
    ]
  }, {
    files: ['**/*.ts?(x)'],
    parserOptions: {
      project: './tsconfig.json'
    },
    extends: [
      'standard-with-typescript'
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }]
}