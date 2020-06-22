module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'plugin:vue/recommended'],
  rules: {
    'vue/max-attributes-per-line': ['warn', {
      'singleline': 6, // 一行属性 最多有6个属性
    }]
  }
}