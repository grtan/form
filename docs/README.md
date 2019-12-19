# VCForm

> 可配置的`vue`通用表单组件，配置兼容`JSON Schema`，且额外支持许多功能，如字段联动、自定义校验方法、自定义UI组件等。

## 安装

> `vcform`使用到了`element-ui`，所以我们还需要安装`element-ui`

```
npm config set registry http://npm.vivo.com.cn
npm i vue element-ui vcform
```

## 注意

> 由于`vcform`中的代码目前还是`.vue`文件源码的形式，所以用户需自行在`webpack`中进行处理。

`webpack`配置

```
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!vcform\/)/,
        use: {
          loader: 'babel-loader',
          options: {
            ...
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          },
        ],
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```