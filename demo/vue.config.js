const MonacoPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('monaco')
      .use(MonacoPlugin, [{
        languages: ['javascript', 'typescript', 'json']
      }])

    config.resolve
      .symlinks(false)

    // list组件的demo演示代码不能压缩
    config.optimization
      .minimize(false)

    // config.resolve.alias
    //   .set('vcform', path.resolve(__dirname, '../src/index.vue'))

    // config.module
    //   .rule('eslint')
    //   .exclude
    //   .add(path.resolve(__dirname, '../src'))
  }
}
