# 自定义组件

任何类型的字段都支持自定义组件，将`component`属性定义成返回`vue`组件对象的函数就可以实现。

* 自定义组件接收`schema`、`value`、`rootValue`三个`prop`，`rootValue`只有`array`和`object`类型能接收到
* 自定义组件需要自行维护校验结果，每个字段都有对应的校验结果。必须保证校验结果格式无误，否则可能导致校验结果错误

下面demo的校验结果如下

```
{
  "valid": true
  "message": ""
  "properties": {
    "key1": {
      "valid": false,
      "message": "输入不能为空"
    },
    "key2": {
      "valid": true,
      "message": "",
      "items": [
        {
          "properties": {
            "key1": {
              "valid": false,
              "message": "输入不能为空"
            },
            "key2": {
              "valid": true,
              "message": ""
            },
            "key3": {
              "valid": true,
              "message": ""
            }
          }
        },
        {
          "properties": {
            "key1": {
              "valid": false,
              "message": "输入不能为空"
            },
            "key2": {
              "valid": true,
              "message": ""
            },
            "key3": {
              "valid": true,
              "message": ""
            }
          }
        }
      ]
    }
  }
}
```

## Demo

下面的例子中`key2`字段使用了自定义组件

```
<template>
  <vc-form :schema="schema" :submit="submit"></vc-form>
</template>

<script>
import VCForm from 'vcform'
import VArray from '../demo/array'

export default {
  components: {
    VCForm
  },
  data() {
    return {
      schema: {
        title: '根对象',
        type: 'object',
        required: ['key1'],
        properties: {
          key1: {
            title: '数字',
            type: 'number'
          },
          key2: {
            title: '数组',
            type: 'array',
            component () {
              return VArray
            },
            items: {
              title: '对象',
              type: 'object',
              required: ['key1', 'key3'],
              properties: {
                key1: {
                  title: '文本',
                  type: 'string',
                  minLength: 5,
                  maxLength: 10,
                  hidden: 'data.key1===3'
                },
                key2: {
                  title: '数字',
                  type: 'number',
                  minimum: 3,
                  maximum: 7
                },
                key3: {
                  title: '布尔值',
                  type: 'boolean',
                  default: true,
                  readonly: true,
                  hidden: 'data.key2[0].key2===3'
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

[custom-component-demo/array.vue](../custom-component-demo/array.vue)如下

```
<template>
  <div>
    <el-row v-for="(item,index) in value" :key="index">
      <el-col :span="20">
        <v-object
          ref="items"
          :schema="schema.items"
          :value="value[index]"
          @input="$event!==value[index]&&$set(value,index,$event)"
          @validate="onValidate(index,$event)"
          @destroy="onDestroy(index)"
        ></v-object>
      </el-col>
      <el-col :class="$style.delete" :span="4">
        <el-button type="danger" @click="onDelete(index)">删除</el-button>
      </el-col>
    </el-row>
    <div :class="$style.add">
      <el-button type="danger" @click="onAdd">新增</el-button>
    </div>
  </div>
</template>

<style lang="less" module>
.delete,
.add {
  padding-right: 42px;
  text-align: right;
}
</style>

<script>
import VObject from './object'

export default {
  components: {
    VObject
  },
  props: {
    schema: { // 当前字段的定义
      required: true,
      type: Object
    },
    value: { // 当前字段的值
      required: true,
      type: Array
    }
  },
  methods: {
    onAdd() {
      this.value.push(undefined)
    },
    onDelete(index) {
      this.value.splice(index, 1)
    },
    onValidate(index, result) {
      // 子元素触发校验事件时需要继续传递给父组件，以便父组件在校验结果中添加该元素的结果
      this.$emit('validate', index, result)
    },
    onDestroy(index) {
      // 子元素销毁时需要继续传递给父组件，以便父组件在校验结果中丢弃该元素的结果
      this.$emit('destroy', index)
    },
    validate() { // 校验方法，必须提供，供父组件调用来进行校验
      // 父组件会对数组本身进行校验，这里只需要对各个元素进行校验
      ; (this.$refs.items || []).forEach(function (item) {
        item.validate()
      })
    }
  }
}
</script>
```

[custom-component-demo/object.vue](../custom-component-demo/object.vue)如下

```
<template>
  <div v-if="value" :class="$style.root">
    <!-- 这里用schema.properties来迭代，是为了保证隐藏再显示后属性的顺序仍然一致 -->
    <template v-for="(propSchema,prop) in schema.properties">
      <v-base
        v-if="value.hasOwnProperty(prop)"
        v-model="value[prop]"
        ref="properties"
        :key="prop"
        :schema="propSchema"
        :required="schema.required&&schema.required.includes(prop)"
        @validate="onValidate(prop,$event)"
        @destroy="onDestroy(prop)"
      ></v-base>
    </template>
  </div>
</template>

<style lang="less" module>
.root {
  margin-bottom: 20px;
  padding-top: 20px;
  border: 1px solid;
}
</style>

<script>
import VBase from './base'

export default {
  components: {
    VBase
  },
  inject: ['fmGlobal'], // 整个表单共享的数据（只读）
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      validateResult: { // 校验结果
        properties: {}
      }
    }
  },
  computed: {
    fixedValue() { // 根据schema并剔除隐藏的项后生成最终的value
      const schema = this.schema
      const { default: defaultValue } = schema
      let data = this.value || defaultValue || {}

      // 如果对象的某个属性被隐藏时，从对象中删除该属性
      Object.keys(schema.properties).forEach(prop => {
        const hidden = this.isHidden(schema.properties[prop])

        if (hidden) {
          return data.hasOwnProperty(prop) && this.$delete(data, prop)
        }

        if (!data.hasOwnProperty(prop)) {
          this.$set(data, prop, undefined)
        }
      })

      return data
    }
  },
  watch: {
    fixedValue: {
      immediate: true,
      handler(value, oldValue) {
        value !== oldValue && this.$emit('input', value)
      }
    }
  },
  methods: {
    isHidden(schema) { // 根据schema判断是否需要隐藏
      const expression = schema.hidden
      let hidden

      try {
        if (typeof expression === 'string') {
          // this.fmGlobal.value表示整个表单的当前值，必须将影响范围降到最小
          // eslint-disable-next-line no-unused-vars
          const data = JSON.parse(JSON.stringify(this.fmGlobal.value))

          // eslint-disable-next-line no-eval
          hidden = !!eval(expression)
        } else if (typeof expression === 'function') {
          hidden = !!expression(JSON.parse(JSON.stringify(this.fmGlobal.value)))
        } else {
          hidden = !!expression
        }
      } catch (e) {
        hidden = false
      }

      if (hidden) {
        return hidden
      }

      switch (schema.type) {
        case 'object':
          // 如果对象的所有属性被隐藏，那该对象也隐藏
          hidden = Object.keys(schema.properties).every(prop => {
            return this.isHidden(schema.properties[prop])
          })
          break
        case 'array':
          // 如果子元素隐藏的话，该数组也隐藏
          hidden = this.isHidden(schema.items)
          break
      }

      return hidden
    },
    onValidate(prop, result) {
      // 添加prop属性的校验结果
      this.$set(this.validateResult.properties, prop, result)
    },
    onDestroy(prop) {
      // 删除prop属性的校验结果
      this.$delete(this.validateResult.properties, prop)
    },
    validate() { // 必须
      // 对自身value进行校验
      if (typeof this.schema.validator === 'function') {
        this.schema.validator(JSON.parse(JSON.stringify(this.value)), (error) => {
          this.$set(this.validateResult, 'valid', !error)
          this.$set(this.validateResult, 'message', error ? error.message : '')
        })
      }

      // 对各属性进行校验
      ; (this.$refs.properties || []).forEach(function (item) {
        item.validate()
      })
    }
  },
  created() {
    // 将校验结果传递给父组件
    this.$emit('validate', this.validateResult)
  },
  beforeDestroy() {
    // 通知父组件，以便父组件删除本元素的校验结果
    this.$emit('destroy')
  }
}
</script>
```

[custom-component-demo/base.vue](../custom-component-demo/base.vue)如下

```
<template>
  <div :class="$style.root">
    <el-row>
      <el-col :class="$style.label" :span="3">{{schema.title||''}}{{required?'(必填)':''}}</el-col>
      <el-col :span="15">
        <!-- 字符串 -->
        <el-input
          v-if="schema.type==='string'"
          :value="value"
          :readonly="schema.readonly"
          @input="$listeners.input"
          placeholder="请输入内容"
        ></el-input>

        <!-- 数字 -->
        <el-input-number
          v-else-if="schema.type==='number'"
          :value="value"
          @input="$listeners.input"
        ></el-input-number>

        <!-- 布尔值 -->
        <el-checkbox v-else :disabled="schema.readonly" :value="value" @input="$listeners.input"></el-checkbox>
      </el-col>
      <el-col v-if="error" :class="$style.error" :span="5">{{error}}</el-col>
    </el-row>
  </div>
</template>

<style lang="less" module>
.root {
  margin-bottom: 20px;

  .label {
    padding-right: 1em;
    text-align: right;
  }

  .error {
    padding-left: 1em;
    color: red;
  }
}
</style>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Boolean]
    },
    required: { // 是否必填
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      error: ''
    }
  },
  computed: {
    fixedValue () {
      const schema = this.schema
      const { type, default: defaultValue } = schema

      // eslint-disable-next-line valid-typeof
      return typeof this.value === type ? this.value : (typeof defaultValue === type ? defaultValue : undefined)
    }
  },
  watch: {
    fixedValue: {
      immediate: true,
      handler (value) {
        this.$emit('input', value)
      }
    },
    value () {
      this.validate()
    }
  },
  methods: {
    validate () {
      this.error = ''

      if (this.required && ['', undefined].includes(this.value)) {
        this.error = '请输入值'
      }

      this.$emit('validate', {
        valid: !this.error,
        message: this.error
      })
    }
  },
  beforeDestroy () {
    // 通知父组件，以便父组件删除本元素的校验结果
    this.$emit('destroy')
  }
}
</script>
```