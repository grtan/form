<template>
  <el-link v-if="schema.readonly" :href="value" target="_blank">{{value}}</el-link>
  <el-upload
    v-else
    :class="$style.root"
    ref="upload"
    :action="schema.action"
    :file-list="list"
    :on-success="onSuccess"
    :on-remove="onDelete"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>

<style lang="less" module>
.root {
  :global(.el-upload) {
    float: left;
  }

  :global(.el-upload-list) {
    margin-left: 100px;
    height: 32px;

    :global(.el-upload-list__item) {
      margin-top: 0 !important;
    }
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
      required: true
    }
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    onSuccess (res, file) {
      this.$refs.upload.clearFiles()
      this.list = [{
        name: file.name,
        url: file.response.data.url || 'xxxx'
      }]
      this.$emit('input', file.response.data.url || 'xxxx')
    },
    onDelete () {
      this.$emit('input', '')
    }
  }
}
</script>
