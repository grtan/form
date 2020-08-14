<template>
  <el-time-picker
    v-if="schema.format==='time'"
    v-model="time"
    class="fm-time__root"
    :is-range="schema.type==='range'"
    :value-format="schema.valueFormat"
    :picker-options="pickerOptions"
    :readonly="schema.readonly"
    placeholder="选择时间"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
  <el-date-picker
    v-else
    v-model="time"
    class="fm-time__root"
    :type="schema.type==='range'&&['datetime','month','date'].includes(schema.format)?`${schema.format}range`:schema.format"
    :format="schema.valueFormat"
    :value-format="schema.format!=='week'?schema.valueFormat:undefined"
    :unlink-panels="true"
    :picker-options="pickerOptions"
    :readonly="schema.readonly"
    placeholder="选择时间"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

<script>
import moment from 'moment'

export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Array],
      default: undefined
    }
  },
  computed: {
    pickerOptions () {
      const options = this.schema.format === 'time' ? {
        format: this.schema.valueFormat
      } : {}

      return {
        ...options,
        ...this.schema.pickerOptions
      }
    },
    momentFormat () { // 将element-ui的日期格式转换成moment格式
      return this.schema.valueFormat.replace(/y/g, 'Y').replace(/d/g, 'D')
    },
    time: {
      get () {
        let value = this.schema.type === 'range' ? (this.value ? [...this.value] : []) : (this.value || '')

        /**
         * date-picker的type=week时，无法应用WW格式到value-format中
         * 所以只能将时间设置成Date对象
         */
        if (this.schema.format === 'week') {
          if (value instanceof Array) {
            value = value.map((item) => {
              return item && moment(item, this.momentFormat).toDate()
            })
          } else {
            value = value && moment(value, this.momentFormat).toDate()
          }
        }

        return value
      },
      set (time) {
        // 点击date-picker的清空按钮时，time为null
        let value = this.schema.type === 'range' ? [...(time || [])] : (time || '')

        /**
         * date-picker的type=week时，无法应用WW格式到value-format中
         * 此时的返回值为Date对象，而不是格式化字符串，需要自行转换成格式化字符串
         * moment计算的周数与el-date-picker是一致的
         */
        if (this.schema.format === 'week') {
          if (value instanceof Array) {
            value = value.map((item) => {
              return (item instanceof Date) ? moment(item).format(this.momentFormat) : item
            })
          } else {
            value = (value instanceof Date) ? moment(value).format(this.momentFormat) : value
          }
        }

        this.$emit('input', value)
      }
    }
  }
}
</script>
