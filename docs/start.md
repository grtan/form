# 快速开始

## 使用方法

`main.js`

```
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 完整引入element-ui
Vue.use(ElementUI)
```

`page.vue`

```
<template>
  <vc-form :schema="schema" :submit="submit"></vc-form>
</template>

<script>
import VCForm from 'vcform'

export default {
  components: {
    VCForm
  },
  data() {
    return {
      schema: {
        title: '根对象',
        type: 'object',
        required: ['key1', 'key2'],
        properties: {
          key1: {
            title: '文本',
            type: 'string',
            component: 'textarea'
          },
          key2: {
            title: '数字',
            type: 'number',
            minimum: 1,
            maximum: 10,
            multipleOf: 0.5
          },
          key5: {
            title: '时间',
            type: 'range',
            format: 'datetime',
            valueFormat: 'HH:mm'
          },
          key6: {
            title: '地址',
            type: 'address',
            format: 'city'
          },
          key4: {
            title: '数组',
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: {
              title: '对象',
              type: 'object',
              required: ['key4', 'key5'],
              properties: {
                key3: {
                  title: '数字',
                  type: 'number',
                  minimum: 3,
                  maximum: 7,
                  default: 4
                },
                key4: {
                  title: '布尔值',
                  type: 'boolean',
                  default: true,
                  readonly: true,
                  component: 'switch',
                  hidden: 'data.key4[0].key3===3'
                },
                key5: {
                  title: '颜色',
                  type: 'string',
                  format: 'color',
                  enum: ['#000', '#aaa', '#f00'],
                  enumNames: ['黑色', '白色', '红色'],
                  component: 'select'
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    submit (value) {
      ...
    }
  }
};
</script>
```

## 属性

|     名称     |    类型    |          必填          | 默认值 |                                                             描述                                                              |
| :----------: | :--------: | :--------------------: | :----: | :---------------------------------------------------------------------------------------------------------------------------: |
|    schema    |  `Object`  |          `Y`           |  `-`   |                                                  描述表单的类JSON Schema对象                                                  |
| defaultValue |  `Object`  |          `N`           |  `-`   |                                                       整个表单的默认值                                                        |
|    submit    | `Function` | `N` **(v0.2.1-为`Y`)** |  `-`   | 点击表单底部提交按钮时，通过校验后会调用该方法。接受`(data)`参数,`data`表示整个表单的值。如果没有设置，则不会显示表单底部按钮 |
|  labelWidth  |  `Number`  |          `N`           |  `80`  |                                                      label的宽度，单位px                                                      |

## 方法

|          名称          |     参数     |                                                                说明                                                                |
| :--------------------: | :----------: | :--------------------------------------------------------------------------------------------------------------------------------: |
| validate **(v0.2.2+)** | `(callback)` | 对表单进行校验，`callback`为回调函数，接受的参数格式为`(valid, result)`，`valid`表示整个表单是否校验通过，`result`为完整的校验结果 |
| getValue **(v0.2.2+)** |     `-`      |                                                          获取表单的当前值                                                          |
| setValue **(v0.2.2+)** |  `(value)`   |                                   设置表单的当前值，`value`为设置的值，需要符合表单的schema规范                                    |
|  reset **(v0.2.2+)**   |     `-`      |                                                              重置表单                                                              |