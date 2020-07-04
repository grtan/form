<template>
  <el-link v-if="schema.readonly" class="fm-file__root" :href="value" target="_blank">
    {{ value }}
  </el-link>
  <el-upload
    v-else
    ref="upload"
    class="fm-file__root"
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
    <el-button size="small" type="primary">
      点击上传
    </el-button>
  </el-upload>
</template>

<style lang="less">
.fm-file {
  &__root {
    div& {
      display: flex;
      align-items: center;
    }

    .el-upload-list {
      flex: auto;
      margin-left: 1em;
      width: 0;

      &__item {
        margin-top: 0;

        &:nth-child(2) {
          height: 0;
        }
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
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      list: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (value) {
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
    onValidateFail (reason) {
      reason && this.$emit('input', `validate:${reason}`)
    },
    onBeforeUpload (file) {
      if (typeof this.schema.fileValidator !== 'function') {
        return
      }

      // 检验失败后不会上传文件
      return this.schema.fileValidator(file, this.onValidateFail)
    },
    onSuccess (res, file) {
      let url

      if (typeof this.schema.urlFetcher === 'string') {
        const response = file.response
        // eslint-disable-next-line no-new-func
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
    onDelete () {
      this.$emit('input', undefined)
    }
  }
}
</script>
