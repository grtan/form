<template>
  <el-time-picker
    v-if="schema.format==='time'"
    class="fm-time__root"
    :is-range="schema.type==='range'"
    :value-format="schema.valueFormat"
    :picker-options="pickerOptions"
    :readonly="schema.readonly"
    placeholder="选择时间"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    v-model="time"
  ></el-time-picker>
  <el-date-picker
    v-else
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
    v-model="time"
  ></el-date-picker>
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
      required: true
    }
  },
  data() {
    const options = {}

    if (this.schema.format === 'time') {
      // if (this.schema.selectableRange) {
      //   options.selectableRange = this.schema.selectableRange
      // }

      if (this.schema.valueFormat) {
        options.format = this.schema.valueFormat
      }
    } else {
      /**
       * 不管firstDayOfWeek设置多少，实际上算出来的周数始终是以周一为一周的开始，跟ISO8061一致
       * 为了界面显示一致，故将firstDayOfWeek设为1
       */
      options.firstDayOfWeek = 1
      // options.disabledDate = function (time) {
      //   // console.log(time)
      //   return false
      // }
    }

    return {
      pickerOptions: options
    }
  },
  computed: {
    momentFormat() { // 将element-ui的日期格式转换成moment格式
      return this.schema.valueFormat.replace(/y/g, 'Y').replace(/d/g, 'D')
    },
    time: {
      get() {
        let value = this.schema.type === 'range' ? (this.value ? [...this.value] : []) : (this.value || '')

        // week类型的value-format只能是Date对象
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
      set(time) {
        let value = this.schema.type === 'range' ? [...(time || ['', ''])] : (time || '')

        if (this.schema.format === 'week') {
          if (value instanceof Array) {
            value = value.map((item) => {
              return item && moment(item).format(this.momentFormat)
            })
          } else {
            value = value && moment(value).format(this.momentFormat)
          }
        }

        this.$emit('input', value)
      }
    }
  }
}
</script>
