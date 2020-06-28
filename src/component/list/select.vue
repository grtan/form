<template>
  <el-button type="text" @click="onClick">
    选择
  </el-button>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    search: {
      type: Object,
      required: true
    },
    selection: {
      type: Array,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  }
}
</script>
