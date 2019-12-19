<template>
  <el-form
    v-if="!hidden"
    ref="form"
    :class="['fm-item__root',{'fm-item--root':isRoot,'fm-item--combined':!isBase}]"
    :label-width="`${isBase?labelWidth:0}px`"
    :model="model"
    :rules="rules"
    :status-icon="true"
    :show-message="isBase"
    :inline-message="true"
    @validate="onValidate"
  >
    <el-form-item :label="isBase?schema.title:''" prop="value">
      <!-- 对象 -->
      <template v-if="schema.type==='object'">
        <el-collapse v-if="value" :class="{'fm-item--root':isRoot}" :value="['1']">
          <el-collapse-item name="1" :disabled="isRoot">
            <div class="fm-item__header" slot="title">
              <el-row type="flex" justify="space-between">
                <el-col :span="15">
                  <span
                    class="fm-item__label"
                    :style="{width:`${labelWidth}px`}"
                    :data-required="required?'*':''"
                  >{{schema.title}}</span>
                  <span
                    v-if="schema.description"
                    class="fm-item__description"
                  >{{schema.description}}</span>
                </el-col>
                <el-col v-if="error" class="fm-item__error" :span="7">{{error}}</el-col>
              </el-row>
            </div>
            <component
              ref="object"
              :is="typeof schema.component==='function'?schema.component():'v-object'"
              :schema="schema"
              :value="value"
              :root-value="rootData"
              @validate="$set(validateResult.properties, ...arguments)"
              @destroy="$delete(validateResult.properties,$event)"
            ></component>
          </el-collapse-item>
        </el-collapse>
      </template>

      <!-- 数组 -->
      <template v-else-if="schema.type==='array'">
        <el-collapse v-if="value" :class="{'fm-item--root':isRoot}" :value="['1']">
          <el-collapse-item name="1" :disabled="isRoot">
            <div class="fm-item__header" slot="title">
              <el-row type="flex" justify="space-between">
                <el-col :span="12">
                  <span
                    class="fm-item__label"
                    :style="{width:`${labelWidth}px`}"
                    :data-required="required?'*':''"
                  >{{schema.title}}</span>
                  <span
                    v-if="schema.description"
                    class="fm-item__description"
                  >{{schema.description}}</span>
                </el-col>
                <el-col v-if="error" class="fm-item__error" :span="8">{{error}}</el-col>
                <el-col v-if="typeof schema.component!=='function'" class="fm-item__add" :span="4">
                  <el-button type="primary" @click.stop="$refs.array.onAdd">新增</el-button>
                </el-col>
              </el-row>
            </div>
            <component
              ref="array"
              :is="typeof schema.component==='function'?schema.component():'v-array'"
              :schema="schema"
              :value="value"
              :root-value="rootData"
              @validate="$set(validateResult.items, ...arguments)"
              @destroy="validateResult.items.splice($event, 1)"
            ></component>
          </el-collapse-item>
        </el-collapse>
      </template>

      <!-- 基本类型、地址、时间范围 -->
      <div v-else class="fm-item__content">
        <component
          :is="typeof schema.component==='function'?schema.component():'v-base'"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></component>
        <div class="fm-item__description--content" v-if="schema.description">{{schema.description}}</div>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="less">
.fm-item {
  &__root {
    &.fm-item--combined {
      &:not(.fm-item--root) {
        margin: 5px 5px 5px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;

        & + .fm-item__root {
          margin-top: 25px;
        }
      }

      > .el-form-item {
        margin-bottom: 0;
      }
    }

    .el-collapse {
      border: none;

      .el-collapse-item.is-disabled {
        > div {
          > .el-collapse-item__header {
            cursor: default;

            .el-collapse-item__arrow {
              display: none;
            }
          }
        }
      }

      .el-collapse-item__header {
        border-bottom-color: #ebeef5;
        margin-bottom: 1em;
        padding: 0.2em 0;
        height: auto;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        cursor: pointer;
      }

      &:not(.fm-item--root) {
        > .el-collapse-item {
          > .el-collapse-item__wrap {
            > .el-collapse-item__content {
              margin-left: 2em;
              font-size: inherit;
            }
          }
        }
      }

      .el-collapse-item__wrap {
        border: none;

        .el-collapse-item__content {
          padding-bottom: 0;
        }
      }
    }

    .el-form-item__error--inline {
      box-sizing: border-box;
      margin-left: 0;
      padding-left: 1em;
      width: 30%;
    }
  }

  &__header {
    flex: auto;
    font-weight: normal;
  }

  &__label {
    display: inline-block;
    box-sizing: border-box;
    padding-right: 12px;
    text-align: right;

    &::before {
      content: attr(data-required);
      margin-right: 4px;
      color: #f56c6c;
    }
  }

  &__description {
    font-size: 0.8em;
    font-weight: bold;

    &--content {
      margin-top: 0.6em;
      line-height: 1;
    }
  }

  &__error {
    color: #f56c6c;
  }

  &__add {
    padding-right: 20px;
    text-align: right;
  }

  &__content {
    float: left;
    width: 70%;
  }
}
</style>

<script>
import Big from 'big.js'
import VObject from './object'
import VArray from './array'
import VBase from './base'

function noop() { }

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
    VObject,
    VArray,
    VBase
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
      const {
        type,
        format,
        message,
        pattern,
        minLength,
        maxLength,
        minimum,
        maximum,
        multipleOf,
        minItems,
        maxItems,
        uniqueItems,
        validator
      } = this.schema
      const rules = {
        value: []
      }

      this.required && rules.value.push({
        type,
        required: true,
        message: '输入不能为空'
      })

      switch (true) {
        case type === 'string':
          if (typeof minLength === 'number') {
            rules.value.push({
              type,
              min: minLength,
              message: `不能少于${minLength}个字符`
            })
          }

          if (typeof maxLength === 'number') {
            rules.value.push({
              type,
              max: maxLength,
              message: `不能超过${maxLength}个字符`
            })
          }

          // 文件校验
          if (['image', 'video', 'file'].includes(format)) {
            rules.value.push({
              validator(rule, value, callback) {
                if (value.startsWith('validate:')) {
                  callback(new Error(value.replace(/^validate\:/, '')))
                } else {
                  callback()
                }
              }
            })
          }

          break
        case type === 'number':
          if (typeof minimum === 'number') {
            rules.value.push({
              type,
              min: minimum,
              message: `不能小于${minimum}`
            })
          }

          if (typeof maximum === 'number') {
            rules.value.push({
              type,
              max: maximum,
              message: `不能大于${maximum}`
            })
          }

          if (typeof multipleOf === 'number') {
            rules.value.push({
              validator(rule, value, callback) {
                if (new Big(value).mod(multipleOf).toString() !== '0') {
                  callback(new Error(`请输入${multipleOf}的倍数`))
                } else {
                  callback()
                }
              }
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
                    return callback(new Error(`地址详情最少输入${minLength}个字符`))
                  }

                  callback()
                }
              })
            }

            if (typeof maxLength === 'number') {
              rules.value.push({
                validator(rule, value, callback) {
                  if (value[3] && value[3].length > maxLength) {
                    return callback(new Error(`地址详情最多输入${maxLength}个字符`))
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

          rules.value.push({
            validator(rule, value, callback) {
              const list = []
              let keyGenerator

              switch (true) {
                case uniqueItems instanceof Array:
                  keyGenerator = function (item) {
                    const key = []

                    uniqueItems.forEach(function (name) {
                      key.push(item[name])
                    })

                    return JSON.stringify(key)
                  }
                  break
                case typeof uniqueItems === 'function':
                  keyGenerator = function (item) {
                    return uniqueItems(item)
                  }
                  break
                case !!uniqueItems:
                  keyGenerator = function (item) {
                    return JSON.stringify(item)
                  }
                  break
              }

              if (keyGenerator && value.some(function (item) {
                const key = keyGenerator(item)
                const exist = list.includes(key)

                list.push(key)

                return exist
              })) {
                return callback(new Error('包含重复元素'))
              }

              callback()
            }
          })

          break
      }

      // 自定义校验函数
      if (typeof validator === 'function') {
        rules.value.push({
          validator(rule, value, callback) {
            validator(value, callback)
          }
        })
      }

      return rules
    }
  },
  watch: {
    fixedValue: {
      immediate: true,
      handler(value, oldValue) {
        // computed属性只要返回对象，不管值有没有变化都一定会触发watch
        value !== oldValue && this.$emit('input', value)
      }
    },
    value() {
      // 确保this.value初始化后再进行校验
      if (!this.canValidate) {
        return
      }

      /**
       * 这里为什么不在watch fixedValue里调用，是因为computed属性只要返回对象，不管值有没有变化都一定会触发watch
       */
      this.$refs.form && this.$refs.form.validate(noop)
    },
    fixedValidateResult: {
      immediate: true,
      handler(value) {
        this.validateResult = value
      }
    },
    validateResult(value) {
      // 非根组件
      !this.isRoot && this.$emit('validate', value)
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

      try {
        if (typeof expression === 'string') {
          // 必须要将this.rootData的影响范围降到最小，否则rootData被修改后所有字段的fixedValue都要重新计算
          // eslint-disable-next-line no-unused-vars
          const data = JSON.parse(JSON.stringify(this.rootData))

          // eslint-disable-next-line no-eval
          hidden = !!eval(expression)
        } else if (typeof expression === 'function') {
          hidden = !!expression(JSON.parse(JSON.stringify(this.rootData)))
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
    onValidate(...args) {
      this.error = args[2] || ''
      this.$set(this.validateResult, 'valid', args[1])
      this.$set(this.validateResult, 'message', args[2] || '')
    },
    validate(callback) { // 校验整个表单
      this.$refs.form.validate(noop)
      this.$refs.object && this.$refs.object.validate()
      this.$refs.array && this.$refs.array.validate()
      // 根组件
      this.isRoot && this.$nextTick(function () {
        callback(...travel(this.validateResult).reverse())
      })
    }
  },
  beforeDestroy() {
    this.$emit('destroy')
  }
}
</script>
