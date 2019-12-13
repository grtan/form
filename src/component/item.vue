<template>
  <el-form
    v-if="!hidden"
    ref="form"
    :class="[$style.container,{[$style.root]:isRoot,[$style.combined]:!isBase}]"
    :label-width="`${isBase?labelWidth:0}px`"
    :model="model"
    :rules="rules"
    :status-icon="true"
    :show-message="isBase"
    :inline-message="true"
    @validate="onValidate"
  >
    <el-form-item :label="isBase?schema.title:''" prop="value" ref="formitem">
      <!-- 对象 -->
      <template v-if="schema.type==='object'">
        <el-collapse v-if="value" :class="{[$style.root]:isRoot}" :value="['1']">
          <el-collapse-item name="1" :disabled="isRoot">
            <div :class="$style.header" slot="title">
              <el-row type="flex" justify="space-between">
                <el-col :span="15">
                  <span :class="$style.label" :style="{width:`${labelWidth}px`}">{{schema.title}}</span>
                  <span v-if="schema.description" :class="$style.description">{{schema.description}}</span>
                </el-col>
                <el-col v-if="error" :class="$style.error" :span="7">{{error}}</el-col>
              </el-row>
            </div>
            <!-- 这里用schema.properties来迭代，是为了保证属性的顺序一致 -->
            <template v-for="(propSchema,prop) in schema.properties">
              <v-item
                v-if="value.hasOwnProperty(prop)"
                v-model="value[prop]"
                ref="objectChildren"
                :key="prop"
                :schema="propSchema"
                :required="schema.required&&schema.required.includes(prop)||propSchema.type==='array'&&!!propSchema.minItems"
                :root-value="rootData"
                @validate="onObjectValidate(prop,$event)"
              ></v-item>
            </template>
          </el-collapse-item>
        </el-collapse>
      </template>

      <!-- 数组 -->
      <template v-else-if="schema.type==='array'">
        <el-collapse v-if="value" :class="{[$style.root]:isRoot}" :value="['1']">
          <el-collapse-item name="1" :disabled="isRoot">
            <div :class="$style.header" slot="title">
              <el-row type="flex" justify="space-between">
                <el-col :span="12">
                  <span :class="$style.label" :style="{width:`${labelWidth}px`}">{{schema.title}}</span>
                  <span v-if="schema.description" :class="$style.description">{{schema.description}}</span>
                </el-col>
                <el-col v-if="error" :class="$style.error" :span="8">{{error}}</el-col>
                <el-col :class="$style.add" :span="4">
                  <el-button type="primary" @click.stop="addItem">新增</el-button>
                </el-col>
              </el-row>
            </div>
            <el-row v-for="(item,index) in value" :key="index" type="flex" justify="space-between">
              <el-col :span="20">
                <v-item
                  ref="arrayChildren"
                  :schema="schema.items"
                  :value="value[index]"
                  :root-value="rootData"
                  @input="$event!==value[index]&&$set(value,index,$event)"
                  @validate="onArrayValidate(index,$event)"
                ></v-item>
              </el-col>
              <el-col :class="$style.delete" :span="3">
                <el-button type="danger" @click="deleteItem(index)">删除</el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </template>

      <!-- 基本类型、地址、时间范围 -->
      <div v-else :class="$style.content">
        <component
          :is="typeof schema.component==='function'?schema.component():'v-base'"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></component>
        <!-- <v-base v-else :schema="schema" :value="value" @input="$listeners.input"></v-base> -->
        <div :class="$style.description" v-if="schema.description">{{schema.description}}</div>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="less" module>
.container {
  &.combined {
    &:not(.root) {
      margin: 5px 5px 5px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow: hidden;

      & + .container {
        margin-top: 25px;
      }
    }

    > :global(.el-form-item) {
      margin-bottom: 0;
    }
  }

  :global(.el-collapse) {
    border: none;

    :global(.el-collapse-item.is-disabled) {
      > div {
        > :global(.el-collapse-item__header) {
          cursor: default;

          :global(.el-collapse-item__arrow) {
            display: none;
          }
        }
      }
    }

    :global(.el-collapse-item__header) {
      border-bottom-color: #ebeef5;
      margin-bottom: 1em;
      padding: 0.2em 0;
      height: auto;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      cursor: pointer;
    }

    .header {
      flex: auto;
      font-weight: normal;

      .label {
        display: inline-block;
        box-sizing: border-box;
        padding-right: 12px;
        text-align: right;
      }

      .description {
        font-size: 0.8em;
        font-weight: bold;
      }

      .error {
        color: #f56c6c;
      }

      .add {
        padding-right: 20px;
        text-align: right;
      }
    }

    .delete {
      padding-right: 42px;
      text-align: right;
    }

    &:not(.root) {
      > :global(.el-collapse-item) {
        > :global(.el-collapse-item__wrap) {
          > :global(.el-collapse-item__content) {
            margin-left: 2em;
            font-size: inherit;
          }
        }
      }
    }

    :global(.el-collapse-item__wrap) {
      border: none;

      :global(.el-collapse-item__content) {
        padding-bottom: 0;
      }
    }
  }

  .content {
    float: left;
    width: 70%;

    .description {
      margin-top: 0.6em;
      font-size: 0.8em;
      font-weight: bold;
      line-height: 1;
    }
  }

  :global(.el-form-item__error--inline) {
    box-sizing: border-box;
    margin-left: 0;
    padding-left: 1em;
    width: 30%;
  }
}
</style>

<script>
import VBase from './base.vue'

const noop = function () { }

function ajax(url) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([{
        name: 'name1',
        value: 'value1'
      }, {
        name: 'name2',
        value: 'value2'
      }])
    }, 1000)
  })
}

/**
 * 遍历校验结果并过滤掉一些无用数据
 * valid 表示整个表单是否校验通过
 */
function travel(item = {}, valid = true) {
  const result = {}

  Object.keys(item).forEach(function (key) {
    switch (key) {
      case 'valid':
      case 'message':
        result[key] = item[key]

        if (key === 'valid' && !result[key]) {
          valid = result[key]
        }

        break
      case 'properties':
        const properties = {}

        Object.keys(item[key]).forEach(function (prop) {
          const [child, val] = travel(item[key][prop], valid)

          if (child) {
            properties[prop] = child
          }

          if (!val) {
            valid = val
          }
        })

        if (Object.keys(properties).length) {
          result[key] = properties
        }
        break
      case 'items':
        const items = []

        item[key].forEach(function (item) {
          const [child, val] = travel(item, valid)

          items.push(child)

          if (!val) {
            valid = val
          }
        })

        if (items.some(function (child) {
          return child
        })) {
          result[key] = items
        }
        break
    }
  })

  return [Object.keys(result).length ? result : undefined, valid]
}

export default {
  name: 'v-item',
  components: {
    VBase
  },
  provide() {
    return this.immediateValidate === undefined ? {
      immediateValidate: this.validateOnInit
    } : {}
  },
  inject: {
    immediateValidate: {
      default: undefined
    }
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    },
    rootValue: { // 整个表单的值
      default: undefined
    },
    required: { // 是否必填
      type: Boolean,
      default: false
    },
    validateOnInit: { // 初始化时是否校验
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      error: '', // 错误信息
      validateResult: undefined // 校验结果
    }
  },
  computed: {
    isRoot() { // 是不是根组件
      return !this.rootValue
    },
    isBase() { // 是不是基本数据类型
      return !['object', 'array'].includes(this.schema.type)
    },
    rootData() { // 根组件数据（即整个表单的数据）
      // 根组件最初是没有rootValue的
      return this.rootValue || this.value
    },
    initValidate() { // 初始化时是否校验
      return this.immediateValidate === undefined ? this.validateOnInit : this.immediateValidate
    },
    hidden() { // 当前组件是否需要隐藏
      return this.isHidden(this.schema)
    },
    fixedValue() { // 根据schema并剔除隐藏的项后生成最终的value
      const schema = this.schema
      const { type, default: defaultValue } = schema
      let data

      switch (type) {
        case 'object':
          data = this.value || defaultValue || {}

          // 当前组件需要隐藏，删除所有属性
          if (this.hidden) {
            Object.keys(data).forEach((key) => {
              this.$delete(data, key)
            })
            break
          }

          // 如果对象的某个属性被隐藏时，从对象中删除该属性
          Object.keys(schema.properties).forEach(prop => {
            const hidden = this.isHidden(schema.properties[prop])

            if (hidden) {
              return data.hasOwnProperty(prop) && this.$delete(data, prop)
            }

            if (!data.hasOwnProperty(prop)) {
              // 给子属性设置初始值，不能统一设置成undefined，不然基本类型有默认值时初始化时就会触发校验
              const type = schema.properties[prop].type
              const defaultValue = schema.properties[prop].default
              let value

              switch (type) {
                case 'object':
                  value = defaultValue || {}
                  break
                case 'array':
                case 'address':
                case 'range':
                  value = defaultValue instanceof Array ? defaultValue : (type === 'range' ? ['', ''] : [])
                  break
                default:
                  // eslint-disable-next-line valid-typeof
                  value = typeof defaultValue === type ? defaultValue : undefined
              }

              this.$set(data, prop, value)
            }
          })
          break
        case 'array':
        case 'address':
        case 'range':
          data = this.value instanceof Array ? this.value : (defaultValue instanceof Array ? defaultValue : (type === 'range' ? ['', ''] : []))
          this.hidden && data.splice(0) // 当前组件需要隐藏，删除所有元素
          break
        default:
          // eslint-disable-next-line valid-typeof
          data = typeof this.value === type ? this.value : (typeof defaultValue === type ? defaultValue : undefined)
          this.hidden && (data = undefined) // 当前组件需要隐藏，置为undefined
      }

      return data
    },
    fixedValidateResult() { // 根据schema并剔除隐藏的项后生成最终的validateResult
      const schema = this.schema
      let data

      if (this.hidden) { // 当前组件需要隐藏
        return undefined
      }

      switch (schema.type) {
        case 'object':
          data = this.validateResult || {
            properties: {}
          }

          // 如果对象的某个属性被隐藏时，从对象中删除该属性
          Object.keys(schema.properties).forEach(prop => {
            const hidden = this.isHidden(schema.properties[prop])

            if (hidden && data.properties.hasOwnProperty(prop)) {
              this.$delete(data.properties, prop)
            }
          })
          break
        case 'array':
          data = this.validateResult || {
            items: []
          }
          break
        default:
          data = this.validateResult || {}
      }

      return data
    },
    model() {
      return {
        value: this.value
      }
    },
    rules() { // 校验规则
      const { type, format, message, pattern, minLength, maxLength, minimum, maximum, minItems, maxItems, validator } = this.schema
      const rules = {
        value: []
      }

      // 定义了校验函数
      if (typeof validator === 'function') {
        rules.value.push({
          validator(rule, value, callback) {
            validator(value, callback)
          }
        })
      }

      this.required && rules.value.push({
        type,
        required: true,
        message: '输入不能为空'
        // trigger: 'change'
      })

      !!pattern && rules.value.push({
        type,
        pattern,
        message: message || '请输入正确的格式'
        // trigger: 'change'
      })

      switch (true) {
        case type === 'string':
          if (typeof minLength === 'number') {
            rules.value.push({
              type,
              min: minLength,
              message: `不能少于${minLength}个字符`
              // trigger: 'change'
            })
          }

          if (typeof maxLength === 'number') {
            rules.value.push({
              type,
              max: maxLength,
              message: `不能超过${maxLength}个字符`
              // trigger: 'change'
            })
          }

          break
        case type === 'number':
          if (typeof minimum === 'number') {
            rules.value.push({
              type,
              min: minimum,
              message: `不能小于${minimum}`
              // trigger: 'change'
            })
          }

          if (typeof maximum === 'number') {
            rules.value.push({
              type,
              max: maximum,
              message: `不能大于${maximum}`
              // trigger: 'change'
            })
          }
          break
        case type === 'address':
          rules.value.push({
            validator(rule, value, callback) {
              switch (value.findIndex(function (item) {
                return !item
              })) {
                case 0:
                  callback(new Error('请选择省份'))
                  break
                case 1:
                  callback(new Error('请选择城市'))
                  break
                case 2:
                  callback(new Error('请选择区域'))
                  break
                case 3:
                  callback(new Error('请输入详细地址'))
                  break
                default:
                  callback()
              }
            }
          })

          if (format === 'detail') {
            if (typeof minLength === 'number') {
              rules.value.push({
                validator(rule, value, callback) {
                  if (!value[3] || value[3].length < minLength) {
                    return callback(new Error(`详细地址最少输入${minLength}个字符`))
                  }

                  callback()
                }
              })
            }

            if (typeof maxLength === 'number') {
              rules.value.push({
                validator(rule, value, callback) {
                  if (value[3] && value[3].length > maxLength) {
                    return callback(new Error(`详细地址最多输入${maxLength}个字符`))
                  }

                  callback()
                }
              })
            }
          }

          break
        case type === 'array':
          if (typeof minItems === 'number') {
            rules.value.push({
              type,
              // ...(!minItems ? {} : {
              //   required: true
              // }),
              min: minItems,
              message: `不能少于${minItems}个元素`
            })
          }

          if (typeof maxItems === 'number') {
            rules.value.push({
              type,
              max: maxItems,
              message: `不能超过${maxItems}个元素`
            })
          }
          break
      }

      return rules
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        // 如果初始化时不校验
        if (!this.initValidate && !this.canValidate) {
          return
        }

        // 同一个事件循环中只触发一次，同时也是确保组件元素被渲染、this.value为最终值后再进行校验
        if (this.formValidated) {
          return
        }

        this.formValidated = true
        this.$nextTick(function () {
          this.formValidated = false
          /**
           * 这里为什么不在watch fixedValue里调用，是因为computed属性只要返回对象，不管属性值有没有变化都一定会触发watch
           */
          this.$refs.form && this.$refs.form.validate(noop)
        })
      }
    },
    fixedValue: {
      immediate: true,
      handler(value, oldValue) {
        this.$emit('input', value)
      }
    },
    fixedValidateResult: {
      immediate: true,
      handler(value) {
        this.validateResult = value
      }
    },
    validateResult: {
      deep: true,
      handler(value) {
        if (this.rootValue) { // 非根组件
          return this.$emit('validate', value)
        }

        /**
         * 同一个事件循环中只会触发一次validate事件
         * 由于watch value中使用了$nextTick，这里必须嵌套3层$nextTick才行，否则如果同时修改了value和validateResult，会触发两次事件
         * 上面的特殊情况指的是删除数组元素时
         */
        if (this.validateEmitted) {
          return
        }

        this.validateEmitted = true
        this.$nextTick(function () {
          this.$nextTick(function () {
            this.$nextTick(function () {
              this.validateEmitted = false
              this.$emit('validate', travel(this.validateResult).reverse())
            })
          })
        })
      }
    }
  },
  created() {
    this.$nextTick(function () {
      this.canValidate = true
    })
  },
  methods: {
    isHidden(schema) { // 根据schema判断是否需要隐藏
      const expression = schema.hidden
      let hidden

      // 基本类型
      if (typeof expression !== 'string') {
        hidden = !!expression
      } else {
        try {
          // 必须要将this.rootData的影响范围降到最小，否则rootData被修改后所有字段的fixedValue都要重新计算
          // eslint-disable-next-line no-unused-vars
          const data = this.rootData

          // eslint-disable-next-line no-eval
          hidden = eval(expression)
        } catch (e) {
          hidden = false
        }
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
    addItem() {
      this.value.push(undefined)
    },
    deleteItem(index) {
      this.value.splice(index, 1)
      this.validateResult.items.splice(index, 1)
    },
    onValidate(...args) {
      this.error = args[2] || ''
      this.$set(this.validateResult, 'valid', args[1])
      this.$set(this.validateResult, 'message', args[2] || '')
    },
    onObjectValidate(prop, result) {
      this.$set(this.validateResult.properties, prop, result)
    },
    onArrayValidate(index, result) {
      this.$set(this.validateResult.items, index, result)
    },
    validate(callback) { // 校验整个表单
      this.$refs.form.validate(noop)
        ;[...(this.$refs.objectChildren || []), ...(this.$refs.arrayChildren || [])].forEach(function (child) {
          child.validate()
        })

      // 根组件
      !this.rootValue && this.$nextTick(function () {
        callback(travel(this.validateResult).reverse())
      })
    }
  }
}
</script>
