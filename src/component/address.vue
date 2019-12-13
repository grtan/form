<template>
  <div :class="$style.root">
    <el-cascader
      v-model="address"
      :options="data"
      :props="{expandTrigger: 'hover'}"
      :disabled="schema.readonly"
    ></el-cascader>
    <el-input
      v-if="schema.format==='detail'"
      type="textarea"
      :rows="2"
      :maxlength="schema.maxLength"
      :minlength="schema.minLength"
      :show-word-limit="typeof schema.maxLength==='number'"
      :readonly="schema.readonly"
      placeholder="请输入地址详情"
      v-model="detail"
    ></el-input>
  </div>
</template>

<style lang="less" module>
.root {
  :global(.el-cascader) {
    > :global(.el-input) {
      width: 50%;
      min-width: 300px;
    }
  }

  :global(.el-textarea) {
    margin-top: 15px;
  }
}
</style>

<script>
import data from './address-data'

export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      data
    }
  },
  computed: {
    address: {
      get () {
        const value = this.value || []

        return value.slice(0, {
          province: 1,
          city: 2,
          area: 3,
          detail: 3
        }[this.schema.format])
      },
      set (address) {
        const value = [...address]

        this.schema.format === 'detail' && value.push(this.detail)
        this.$emit('input', value)
      }
    },
    detail: {
      get () {
        return (this.value && this.value[3]) || ''
      },
      set (detail) {
        const value = [...this.value]

        value[3] = detail
        this.$emit('input', value)
      }
    }
  }
}
</script>
