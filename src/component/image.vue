<template>
  <div v-if="url || !schema.readonly" :class="['fm-image__root', { 'fm-image--uploaded': schema.readonly || url }]">
    <el-upload
      ref="upload"
      :action="schema.action || ''"
      :name="schema.name"
      :headers="schema.headers"
      :with-credentials="schema.withCredentials"
      :accept="schema.accept"
      :data="schema.data"
      list-type="picture-card"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
    >
      <el-progress
        v-if="schema.progressWidth && progress !== 0 && progress !== 100"
        class="fm-circle-progress"
        :width="schema.progressWidth"
        type="circle"
        :percentage="progress"
        :show-text="false"
      ></el-progress>
      <i v-if="!schema.readonly && !url" class="el-icon-plus" />
      <div v-else ref="box" class="fm-image__box">
        <img v-if="schema.format === 'image'" :src="url" />
        <video v-else :src="url">您的浏览器不支持 video 标签</video>
        <el-row type="flex" justify="center" @click.native.stop>
          <el-col :span="6">
            <i class="el-icon-zoom-in" @click="onPreview" />
          </el-col>
          <el-col v-if="!schema.readonly" :span="6">
            <i class="el-icon-edit" @click="onEdit" />
          </el-col>
          <el-col v-if="!schema.readonly" :span="6">
            <i class="el-icon-delete" @click="onDelete" />
          </el-col>
        </el-row>
      </div>
    </el-upload>
    <el-dialog class="fm-image__preview" :visible.sync="preview" append-to-body>
      <img v-if="schema.format === 'image'" :src="url" />
      <video v-else :src="url" controls>您的浏览器不支持 video 标签</video>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Object],
      default: undefined
    }
  },
  data() {
    return {
      progress: 0,
      preview: false // 是否显示预览界面
    }
  },
  computed: {
    url() {
      return this.value && this.value.url ? this.value.url : this.value
    }
  },
  methods: {
    onValidateFail(reason) {
      reason && this.$emit('input', `validate:${reason}`)
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    calculateSize(size, maxSize, type) {
      maxSize = Number.isFinite(maxSize) ? `<${maxSize}` : maxSize
      if (!this.eval(size + (maxSize.startsWith('=') ? '=' : '') + maxSize)) {
        return `,${type}应${maxSize}px`
      }
      return ''
    },
    validateMsg(width, height, maxWidth, maxHeight) {
      const msg =
        (maxWidth ? this.calculateSize(width, maxWidth, '宽度') : '') +
        (maxHeight ? this.calculateSize(height, maxHeight, '高度') : '')

      return msg ? `图片尺寸不正确${msg}` : ''
    },
    validateSize(file, maxWidth, maxHeight) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = e => {
          const data = e.target.result
          const image = new Image()
          image.onload = () => {
            const { width, height } = image
            const _message = this.validateMsg(width, height, maxWidth, maxHeight)
            _message ? reject(this.$message.error(_message)) : resolve({ width, height })
          }
          image.src = data
        }
        reader.readAsDataURL(file)
      })
    },
    onBeforeUpload(file) {
      this.progress = 0
      const { format, maxSize, maxWidth, maxHeight } = this.schema
      if (maxSize) {
        const isLt2M = file.size / 1024 / 1024 < maxSize
        if (!isLt2M) {
          this.$message.error(`上传大小不能超过 ${maxSize}MB`)
          return false
        }
      }

      if (format === 'image' && (maxWidth || maxHeight)) {
        return this.validateSize(file, maxWidth, maxHeight)
      }

      if (typeof this.schema.fileValidator !== 'function') {
        return
      }

      // 检验失败后不会上传文件
      return this.schema.fileValidator(file, this.onValidateFail)
    },
    onProgress(event, file, fileList) {
      this.progress = event.percent === 100 ? 99 : event.percent
      if (typeof this.schema.fileProgress !== 'function') {
        return
      }
      return this.schema.fileProgress(event, file, fileList)
    },
    onSuccess(res, file) {
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
      this.$emit('input', url)

      this.progress = 100
    },
    onPreview() {
      this.preview = true
    },
    onEdit() {
      this.$refs.box.click()
    },
    onDelete() {
      this.$emit('input', undefined)
    }
  }
}
</script>

<style lang="less">
.fm-image {
  &__root {
    .el-upload {
      position: relative;

      .fm-image--uploaded& {
        border: none;
      }
    }

    .fm-circle-progress {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }
  }

  &__box {
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    height: 100%;
    position: relative;

    img {
      left: 50%;
      max-height: 100%;
      max-width: 100%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    video {
      display: block;
      height: 100%;
      width: 100%;
    }

    > div {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px;
      bottom: -1px;
      left: -1px;
      opacity: 0;
      position: absolute;
      right: -1px;
      top: -1px;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }

      i {
        color: #fff;
        font-size: 20px;
      }
    }
  }

  &__preview {
    .el-dialog {
      width: 70%;
    }

    .el-dialog__body {
      align-items: center;
      display: flex;
      height: calc(75vh - 90px);
      justify-content: center;
    }

    img,
    video {
      max-height: 100%;
      max-width: 100%;
      object-fit: scale-down;
      outline: none;
    }
  }
}
</style>
