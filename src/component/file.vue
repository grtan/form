<template>
  <el-link v-if="schema.readonly" class="fm-file__root" :href="value" target="_blank">{{value}}</el-link>
  <el-upload
    v-else
    class="fm-file__root"
    ref="upload"
    :action="schema.action"
    :name="schema.name"
    :headers="schema.headers"
    :with-credentials="schema.withCredentials"
    :accept="schema.accept"
    :file-list="list"
    :before-upload="onBeforeUpload"
    :on-success="onSuccess"
    :on-remove="onDelete"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>

<style lang="less">
.fm-file {
  &__root {
    .el-upload {
      float: left;
    }

    .el-upload-list {
      margin-left: 100px;
      height: 32px;

      .el-upload-list__item {
        margin-top: 0 !important;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (!value) { // 清空
          this.$refs.upload && this.$refs.upload.clearFiles()
          this.list = []
        } else if (!this.list.length || this.list[0].url !== value) { // 初始化或者重置成默认值
          this.$refs.upload && this.$refs.upload.clearFiles()
          this.list = [{
            name: value,
            url: value
          }]
        }
      }
    }
  },
  methods: {
    onValidateFail(reason) {
      reason && this.$emit('input', `validate:${reason}`)
    },
    onBeforeUpload(file) {
      if (typeof this.schema.fileValidator !== 'function') {
        return
      }

      // 检验失败后不会上传文件
      return this.schema.fileValidator(file, this.onValidateFail)
    },
    onSuccess(res, file) {
      let url

      if (typeof this.schema.urlFetcher === 'string') {
        const response = file.response
        const fn = new Function('response', `return (${this.schema.urlFetcher})`)

        url = fn(response)
      } else {
        url = this.schema.urlFetcher(file.response)
      }

      this.$refs.upload.clearFiles()
      this.list = [{
        name: file.name,
        url
      }]
      this.$emit('input', url)
    },
    onDelete() {
      this.$emit('input', undefined)
    }
  }
}
</script>
