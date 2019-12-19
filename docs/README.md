# Form

> 可配置的通用表单组件，配置兼容`JSON Schema`，且额外支持许多功能，如字段联动、自定义校验方法、自定义UI组件等。

## 安装

> `form`默认使用`element-ui`，所以我们还需要安装`element-ui`

```
npm config set registry http://npm.vivo.com.cn
npm i form
npm i element-ui
```

## 使用

```
import Form from 'form'
import ElementUI from 'element-ui'
```

> 由于`form`中的代码目前直接采用的`.vue`单文件的形式，所以用户需自行在`webpack`中进行转码。

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
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```