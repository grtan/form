<template>
  <div>
    <el-row v-for="(item,index) in value" :key="index">
      <el-col :span="20">
        <v-object
          ref="items"
          :schema="schema.items"
          :value="value[index]"
          :root-value="rootValue"
          @input="$event!==value[index]&&$set(value,index,$event)"
          @validate="onValidate(index,$event)"
          @destroy="onDestroy(index)"
        ></v-object>
      </el-col>
      <el-col :class="$style.delete" :span="4">
        <el-button type="danger" @click="onDelete(index)">删除</el-button>
      </el-col>
    </el-row>
    <div :class="$style.add">
      <el-button type="danger" @click="onAdd">新增</el-button>
    </div>
  </div>
</template>

<style lang="less" module>
.delete,
.add {
  padding-right: 42px;
  text-align: right;
}
</style>

<script>
import VObject from './object'

export default {
  components: {
    VObject
  },
  props: {
    schema: { // 当前字段的定义
      required: true,
      type: Object
    },
    value: { // 当前字段的值
      required: true,
      type: Array
    },
    rootValue: { // 整个表单的值
      required: true
    }
  },
  methods: {
    onAdd () {
      this.value.push(undefined)
    },
    onDelete (index) {
      this.value.splice(index, 1)
    },
    onValidate (index, result) {
      // 子元素触发校验事件时需要继续传递给父组件，以便父组件在校验结果中添加该元素的结果
      this.$emit('validate', index, result)
    },
    onDestroy (index) {
      // 子元素销毁时需要继续传递给父组件，以便父组件在校验结果中丢弃该元素的结果
      this.$emit('destroy', index)
    },
    validate () { // 校验方法，必须提供，供父组件调用来进行校验
      // 父组件会对数组本身进行校验，这里只需要对各个元素进行校验
      ; (this.$refs.items || []).forEach(function (item) {
        item.validate()
      })
    }
  }
}
</script>
