<template>
  <div class="fm-address__root" v-if="addressList">
    <el-cascader
      v-model="address"
      :options="addressList"
      :props="{expandTrigger: 'hover'}"
      :filterable="true"
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

<style lang="less">
.fm-address {
  &__root {
    .el-cascader {
      > .el-input {
        width: 50%;
        min-width: 300px;
      }
    }

    .el-textarea {
      margin-top: 15px;
    }
  }
}
</style>

<script>
import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(function (response) {
  return response.data
})

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
  data() {
    return {
      addressList: undefined
    }
  },
  computed: {
    filter() { // 是否过滤特殊地区
      return this.schema.filter !== undefined ? !!this.schema.filter : true
    },
    address: {
      get() {
        const value = this.value || []

        return value.slice(0, {
          province: 1,
          city: 2,
          area: 3,
          detail: 3
        }[this.schema.format])
      },
      set(address) {
        const value = [...address]

        this.schema.format === 'detail' && value.push(this.detail)
        this.$emit('input', value)
      }
    },
    detail: {
      get() {
        return (this.value && this.value[3]) || ''
      },
      set(detail) {
        const value = [...this.value]

        value[3] = detail
        this.$emit('input', value)
      }
    }
  },
  methods: {
    async getAddress() {
      const address = await axiosInstance.get(`//shequwsdl.vivo.com.cn/shequ/address_${this.filter ? 'filter' : 'full'}.json`)

      this.addressList = this.format(address)
    },
    format(address, level = 0) { // 格式化地址数据
      const data = []
      const target = {
        province: 0,
        city: 1,
        area: 2,
        detail: 2
      }[this.schema.format]

      if (address instanceof Array) {
        address.forEach(function (value) {
          data.push({
            label: value,
            value: value
          })
        })
      } else {
        Object.keys(address).forEach(value => {
          const item = {
            label: value,
            value: value
          }

          if (level < target) {
            item.children = this.format(address[value], level + 1)
          }

          data.push(item)
        })
      }

      return data
    }
  },
  created() {
    typeof this.schema.fetcher === 'function' ? this.schema.fetcher((address) => {
      this.addressList = address
    }) : this.getAddress()
  }
}
</script>
