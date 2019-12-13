<template>
  <div>
    <item
      :class="$style.form"
      :schema="schema"
      :validate-on-init="validateOnInit"
      v-model="value"
      @validate="onValidate"
    ></item>
    <el-button @click="validate">校验</el-button>
  </div>
</template>

<style lang="less" module>
.form {
  text-align: left;
}
</style>

<script>
import Item from './component/item'

export default {
  components: {
    Item
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    validateOnInit: {
      type: Boolean,
      default: false
    },
    action: {
      // required: true,
      type: String
    }
  },
  data() {
    return {
      value: undefined
    }
  },
  watch: {
    value: {
      handler(value, oldValue) {
        console.log('deep watch', value)
        // console.log(JSON.stringify(value), JSON.stringify(oldValue))
      },
      deep: true
    }
  },
  created() {
    // setTimeout(() => {
    //   this.$children[0].validate(function (result) {
    //     console.log('检测结果', result)
    //   })
    // }, 2000)
  },
  methods: {
    validate() {
      this.$children[0].validate(function (result) {
        console.log('检测结果', result)
      })
    },
    onValidate(validateResult) {
      console.log('validateResult', validateResult)
    }
  }
}
</script>
