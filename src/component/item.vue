<template>
  <el-form
    v-if="!hidden"
    ref="form"
    :class="[
      'fm-item__root',
      { 'fm-item--root': isRoot, 'fm-item--combined': !isBaseUI, 'fm-item--invalid': error },
      typeof schema.className === 'function' ? schema.className(path, value) : schema.className
    ]"
    :label-width="`${isBaseUI ? global.labelWidth : 0}px`"
    size="mini"
    :model="model"
    :rules="rules"
    :status-icon="true"
    :show-message="isBaseUI"
    :inline-message="true"
    @validate="onValidate"
  >
    <el-form-item :label="isBaseUI ? schema.title : ''" prop="value">
      <!-- 对象 -->
      <template v-if="schema.type === 'object'">
        <template v-if="value">
          <!-- 单选 -->
          <div v-if="schema.enum" :class="['fm-item__content', { 'fm-item__content--valid': !error }]">
            <v-enum :schema="schema" :value="value" />
            <div v-if="schema.description" class="fm-item__description--content">
              {{ schema.description }}
            </div>
          </div>
          <!-- excel导入数据 -->
          <div
            v-else-if="schema.format === 'excel'"
            :class="['fm-item__content', { 'fm-item__content--valid': !error }]"
          >
            <v-excel :schema="schema" :value="value" />
            <div v-if="schema.description" class="fm-item__description--content">
              {{ schema.description }}
            </div>
          </div>
          <el-collapse v-else :class="{ 'fm-item--root': isRoot }" :value="['1']">
            <el-collapse-item name="1" :disabled="isRoot">
              <div slot="title" class="fm-item__header">
                <el-row type="flex" justify="space-between">
                  <el-col :span="15">
                    <span
                      class="fm-item__label"
                      :style="{ width: `${global.labelWidth}px` }"
                      :data-required="required ? '*' : ''"
                      >{{ schema.title }}</span
                    >
                    <span v-if="schema.description" class="fm-item__description">{{ schema.description }}</span>
                  </el-col>
                  <el-col v-if="error" class="fm-item__error" :span="7">
                    {{ error }}
                  </el-col>
                </el-row>
              </div>
              <component
                :is="typeof schema.component === 'function' ? schema.component() : 'v-object'"
                ref="object"
                :schema="schema"
                :value="value"
                :path="path"
                @validate="$set(validateResult.properties, ...arguments)"
                @destroy="$delete(validateResult.properties, $event)"
              />
            </el-collapse-item>
          </el-collapse>
        </template>
      </template>

      <!-- 数组 -->
      <template v-else-if="schema.type === 'array'">
        <template v-if="value">
          <!-- 多选 -->
          <div v-if="schema.enum" :class="['fm-item__content', { 'fm-item__content--valid': !error }]">
            <v-enum :schema="schema" :value="value" />
            <div v-if="schema.description" class="fm-item__description--content">
              {{ schema.description }}
            </div>
          </div>
          <el-collapse v-else :class="{ 'fm-item--root': isRoot }" :value="['1']">
            <el-collapse-item name="1" :disabled="isRoot">
              <div slot="title" class="fm-item__header">
                <el-row type="flex" justify="space-between">
                  <el-col :span="12">
                    <span
                      class="fm-item__label"
                      :style="{ width: `${global.labelWidth}px` }"
                      :data-required="required ? '*' : ''"
                      >{{ schema.title }}</span
                    >
                    <span v-if="schema.description" class="fm-item__description">{{ schema.description }}</span>
                  </el-col>
                  <el-col v-if="error" class="fm-item__error" :span="8">
                    {{ error }}
                  </el-col>
                  <el-col v-if="typeof schema.component !== 'function'" class="fm-item__add" :span="4">
                    <el-button type="primary" @click.stop="$refs.array.onAdd"> 新增 </el-button>
                  </el-col>
                </el-row>
              </div>
              <component
                :is="typeof schema.component === 'function' ? schema.component() : 'v-array'"
                ref="array"
                :schema="schema"
                :value="value"
                :path="path"
                @validate="$set(validateResult.items, ...arguments)"
                @destroy="validateResult.items.splice($event, 1)"
              />
            </el-collapse-item>
          </el-collapse>
        </template>
      </template>

      <!-- 基本类型、地址、时间范围 -->
      <div v-else :class="['fm-item__content', { 'fm-item__content--valid': !error }]">
        <component
          :is="typeof schema.component === 'function' ? schema.component() : 'v-base'"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        />
        <div v-if="schema.description" class="fm-item__description--content">
          {{ schema.description }}
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import Big from 'big.js'
import { checkValidation, validateValue } from '../util/validate'
import VObject from './object'
import VExcel from './excel'
import VArray from './array'
import VBase from './base'
import VEnum from './enum'

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export default {
  components: {
    VObject,
    VExcel,
    VArray,
    VBase,
    VEnum
  },
  provide() {
    return this.provideData
  },
  inject: {
    fmGlobal: {
      default: undefined
    }
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: undefined
    },
    required: {
      // 是否必填
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    // 当前项在json数据结构中的位置
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      error: '', // 错误信息
      validateResult: undefined // 校验结果
    }
  },
  computed: {
    isRoot() {
      // 是不是根组件
      return !this.fmGlobal || this.$parent.$options.name === 'VCForm'
    },
    provideData() {
      // 共享给后代组件的数据
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this

      return this.isRoot
        ? {
            fmGlobal: {
              get value() {
                // 整个表单的值
                return self.value
              },
              get labelWidth() {
                // label宽度
                return self.labelWidth
              },
              inited: false // 整个表单是否已初始化
            }
          }
        : {}
    },
    isBaseUI() {
      // 是不是基础展示类型
      return (
        !['object', 'array'].includes(this.schema.type) ||
        !!this.schema.enum ||
        (this.schema.type === 'object' && this.schema.format === 'excel')
      )
    },
    global() {
      // 全局数据
      return !this.isRoot ? this.fmGlobal : this.provideData.fmGlobal
    },
    hidden() {
      // 当前组件是否需要隐藏
      return this.isHidden(this.schema)
    },
    fixedValue() {
      // 根据schema并剔除隐藏的项后生成最终的value
      const schema = this.schema
      let { type, default: defaultValue } = schema
      let data

      // 拷贝默认值
      if (typeof defaultValue === 'object') {
        defaultValue = JSON.parse(JSON.stringify(defaultValue))
      }

      switch (type) {
        case 'object':
          data = this.value || defaultValue || {}

          // 当前组件需要隐藏，删除所有属性
          if (this.hidden) {
            Object.keys(data).forEach(key => {
              this.$delete(data, key)
            })
            break
          }

          // 如果对象的某个属性被隐藏时，从对象中删除该属性
          Object.keys(schema.properties).forEach(prop => {
            const hidden = this.isHidden(schema.properties[prop])

            if (hidden) {
              // eslint-disable-next-line no-prototype-builtins
              return data.hasOwnProperty(prop) && this.$delete(data, prop)
            }

            // eslint-disable-next-line no-prototype-builtins
            if (!data.hasOwnProperty(prop)) {
              // 给子属性设置初始值，不能统一设置成undefined，不然基本类型有默认值时初始化时就会触发校验
              /**
               * 当value初始为undefined时，el-input-number会触发input事件，导致覆盖掉fixedValue设置的默认值
               */
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
                  value = defaultValue instanceof Array ? defaultValue : []
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
          data = this.value instanceof Array ? this.value : defaultValue instanceof Array ? defaultValue : []
          this.hidden && data.splice(0) // 当前组件需要隐藏，删除所有元素
          break
        default:
          // eslint-disable-next-line valid-typeof
          data = typeof this.value === type ? this.value : typeof defaultValue === type ? defaultValue : undefined
          this.hidden && (data = undefined) // 当前组件需要隐藏，置为undefined
      }

      return data
    },
    fixedValidateResult() {
      // 根据schema并剔除隐藏的项后生成最终的validateResult
      const schema = this.schema
      let data

      if (this.hidden) {
        // 当前组件需要隐藏
        return undefined
      }

      switch (schema.type) {
        case 'object':
          data = this.validateResult || {
            // 基础UI展示类型没有后代校验结果
            ...(this.isBaseUI ? undefined : { properties: {} })
          }
          break
        case 'array':
          data = this.validateResult || {
            ...(this.isBaseUI ? undefined : { items: [] })
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
    // 校验规则，除了主动调用form组件validate方法外，后代input、radio、checkbox等组件blur或值变化时都会触发校验
    rules() {
      const {
        type,
        format,
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

      this.required &&
        !['image', 'video', 'file'].includes(format) &&
        rules.value.push({
          type: (function () {
            if (['address', 'range'].includes(type)) {
              return 'array'
            }

            return type
          })(),
          required: true,
          message: '输入不能为空'
        })

      switch (true) {
        case type === 'string':
          if (Number.isInteger(minLength) && minLength >= 0) {
            rules.value.push({
              type,
              min: minLength,
              message: `不能少于${minLength}个字符`
            })
          }

          if (Number.isInteger(maxLength) && maxLength >= 0) {
            rules.value.push({
              type,
              max: maxLength,
              message: `不能超过${maxLength}个字符`
            })
          }

          // 文件校验
          if (['image', 'video', 'file'].includes(format)) {
            const { required } = this
            rules.value.push({
              validator(rule, value, callback) {
                value = value && value.url ? value.url : value
                if (required && !value) {
                  callback(new Error('请上传资源'))
                } else if (value && value.startsWith('validate:')) {
                  callback(new Error(value.replace(/^validate:/, '')))
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
              switch (
                value.findIndex(function (item) {
                  return !item
                })
              ) {
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

          if ((format || 'detail') === 'detail') {
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
        case type === 'object':
          // 单选或excel导入数据
          if (this.schema.enum || format === 'excel') {
            rules.value.push({
              validator: (rule, value, callback) => {
                const { valid, path } = validateValue(this.schema, this.value)
                let message = ''

                if (!valid) {
                  if (this.schema.enum) {
                    message = `${path}位置`
                  } else if (format === 'excel') {
                    const sheet = path.replace(/^\.([^[]+).*$/, '$1')
                    const row = path.replace(/^\.[^[]+(?:\[(\d+)\].*)?$/, '$1')
                    const column = path.replace(/^\.[^[]+(?:\[\d+\](?:\.(.*))?)?$/, '$1')

                    if (sheet) {
                      message += `工作表${sheet}`

                      if (row) {
                        // 行数包含标题行
                        message += `第${Number(row) + 2}行`

                        if (column) {
                          message += `${column}列`
                        }
                      }
                    }
                  }

                  message += '校验失败'
                }

                callback(valid ? undefined : new Error(message))
              }
            })
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

              if (
                keyGenerator &&
                value.some(function (item) {
                  const key = keyGenerator(item)
                  const exist = list.includes(key)

                  list.push(key)

                  return exist
                })
              ) {
                return callback(new Error('包含重复元素'))
              }

              callback()
            }
          })

          // 多选
          if (this.schema.enum) {
            rules.value.push({
              validator: (rule, value, callback) => {
                const { valid, path } = validateValue(this.schema, this.value)
                let message = ''

                if (!valid) {
                  const index = path.replace(/^\[(\d+)\].*$/, '$1')
                  const pos = path.replace(/^\[\d+\](.*)$/, '$1')

                  if (index) {
                    message += `第${Number(index) + 1}个选项`

                    if (pos) {
                      message += `的位置${pos}`
                    }
                  }

                  message += '校验失败'
                }

                callback(valid ? undefined : new Error(message))
              }
            })
          }

          break
      }

      // 自定义校验函数
      if (typeof validator === 'function') {
        rules.value.push({
          validator(rule, value, callback) {
            validator(JSON.parse(JSON.stringify(value)), callback)
          }
        })
      }

      // 这里加个空的校验函数是为了执行this.$refs.form.validate()时一定会给出校验结果
      rules.value.push({
        validator(rule, value, callback) {
          callback()
        }
      })

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
    model: {
      immediate: true,
      handler() {
        // 确保表单初始化后再进行校验，且同一个tick内只校验一次
        if (!this.global.inited || this.formValidated) {
          return
        }

        this.formValidated = true
        // 必须等重新render后再校验，否则form的model数据还是原来的旧值
        this.$nextTick(function () {
          this.formValidated = false
          this.$refs.form.validate(noop)
        })
      }
    },
    fixedValidateResult: {
      immediate: true,
      handler(value, oldValue) {
        if (value === oldValue) {
          return
        }

        this.validateResult = value
      }
    },
    validateResult: {
      immediate: true,
      handler(value, oldValue) {
        if (this.isRoot || value === oldValue) {
          return
        }

        this.$emit('validate', value)
      }
    }
  },
  created() {
    this.isRoot &&
      this.$nextTick(function () {
        // 整个表单初始化完成
        this.global.inited = true
      })
  },
  beforeDestroy() {
    this.$emit('destroy')
  },
  methods: {
    isHidden(schema) {
      // 根据schema判断是否需要隐藏
      const expression = schema.hidden
      let hidden

      try {
        if (typeof expression === 'string') {
          // 必须要将this.rootData的影响范围降到最小，否则rootData被修改后所有字段的fixedValue都要重新计算
          const data = JSON.parse(JSON.stringify(this.global.value))
          // eslint-disable-next-line no-new-func
          const fn = new Function('data', `return !!(${expression})`)

          hidden = fn(data)
        } else if (typeof expression === 'function') {
          hidden = !!expression(JSON.parse(JSON.stringify(this.global.value)))
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
    validate(callback) {
      // 校验整个表单
      this.$refs.form.validate(noop)
      this.$refs.object && this.$refs.object.validate()
      this.$refs.array && this.$refs.array.validate()
      // 根组件
      this.isRoot &&
        this.$nextTick(function () {
          if (typeof callback === 'function') {
            const [completeResult, { valid }] = checkValidation(this.validateResult)

            callback(valid, completeResult)
          }
        })
    }
  }
}
</script>

<style lang="less">
@normal: #dcdfe6;
@hover: #c0c4cc;
@focus: #409eff;
@invalid: #f56c6c;

.fm-item {
  &__root {
    &.fm-item--combined {
      &:not(.fm-item--root) {
        margin: 5px 5px 5px 0;
        border: 1px solid @normal;
        border-radius: 5px;
        overflow: hidden;

        &:hover {
          border-color: @hover;
        }

        &.fm-item--invalid {
          border-color: @invalid;
        }

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

      .el-collapse-item__wrap {
        border: none;

        .el-collapse-item__content {
          padding-bottom: 0;
        }
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
    color: #bbb;
    font-size: 0.8em;

    &--content {
      margin: 0.8em 0;
      color: #bbb;
      font-size: 0.8em;
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

    &--valid {
      .el-input__inner,
      .el-textarea__inner {
        border-color: @normal !important;

        &:hover {
          border-color: @hover !important;
        }

        &:focus {
          border-color: @focus !important;
        }
      }
    }
  }
}
</style>
