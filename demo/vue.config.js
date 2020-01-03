const MonacoPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('monaco')
      .use(MonacoPlugin, [{
        languages: ['javascript', 'typescript', 'json']
      }])
  }
}
