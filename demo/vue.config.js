const MonacoPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    // config.resolve
    //   .alias
    //   .set('vcform', path.resolve(process.cwd(), '../'))

    // config.module
    //   .rule('eslint')
    //   .exclude
    //   .add(/dist\/vcform\.js$/)

    config
      .plugin('monaco')
      .use(MonacoPlugin, [{
        languages: ['javascript', 'typescript', 'json']
      }])
  }
}
