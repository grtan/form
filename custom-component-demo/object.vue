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
