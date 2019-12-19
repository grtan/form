<template>
  <div class="fm-array__root">
    <el-row
      v-for="(item,index) in value"
      :key="index"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <el-col :span="20">
        <v-item
          ref="items"
          :schema="schema.items"
          :value="value[index]"
          :root-value="rootValue"
          @input="$event!==value[index]&&$set(value,index,$event)"
          @validate="$emit('validate',index,$event)"
          @destroy="$emit('destroy',index)"
        ></v-item>
      </el-col>
      <el-col class="fm-array__delete" :span="3">
        <el-button type="danger" @click="onDelete(index)">删除</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
.fm-array {
  &__delete {
    padding-right: 42px;
    text-align: right;
  }
}
</style>

<script>
import VItem from './item'

export default {
  components: {
    VItem(resolve) {
      resolve(VItem)
    }
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Array
    },
    rootValue: { // 整个表单的值
      required: true
    }
  },
  methods: {
    onAdd() {
      this.value.push(undefined)
    },
    onDelete(index) {
      this.value.splice(index, 1)
    },
    validate() { // 校验整个表单
      ; (this.$refs.items || []).forEach(function (item) {
        item.validate()
      })
    }
  }
}
</script>
