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
