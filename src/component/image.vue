<template>
  <div v-if="value || !schema.readonly" :class="['fm-image__root', { 'fm-image--uploaded': schema.readonly || value }]">
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
      <i v-if="!schema.readonly && !value" class="el-icon-plus" />
      <div v-else ref="box" class="fm-image__box">
        <img v-if="schema.format === 'image'" :src="value" />
        <video v-else :src="value">您的浏览器不支持 video 标签</video>
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
      <img v-if="schema.format === 'image'" width="100%" :src="value" />
      <video v-else :src="value" controls>您的浏览器不支持 video 标签</video>
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
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      progress: 0,
      preview: false // 是否显示预览界面
    }
  },
  methods: {
    onValidateFail(reason) {
      reason && this.$emit('input', `validate:${reason}`)
    },
    validateSize(file, maxWidth, maxHeight) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = e => {
          const data = e.target.result
          const image = new Image()
          image.onload = () => {
            const { width, height } = image
            if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
              reject(this.$message.error(`图片尺寸不能超过${maxWidth} * ${maxHeight}px`))
            } else if (maxWidth && width > maxWidth) {
              reject(this.$message.error(`图片宽度不能超过${maxWidth}px`))
            } else if (maxHeight && height > maxHeight) {
              reject(this.$message.error(`图片高度不能超过${maxHeight}px`))
            } else {
              resolve({ width, height })
            }
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
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__box {
    position: relative;
    box-sizing: border-box;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    height: 100%;

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }

    video {
      display: block;
      width: 100%;
      height: 100%;
    }

    > div {
      position: absolute;
      left: -1px;
      right: -1px;
      top: -1px;
      bottom: -1px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
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
    video {
      display: block;
      outline: none;
      width: 100%;
      max-height: 500px;
    }
  }
}
</style>
