<template>
  <div :class="['fm-image__root',{'fm-image--uploaded':schema.readonly||value}]">
    <el-upload
      ref="upload"
      :action="schema.action||''"
      :name="schema.name"
      :headers="schema.headers"
      :with-credentials="schema.withCredentials"
      :accept="schema.accept"
      list-type="picture-card"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      :on-success="onSuccess"
    >
      <i v-if="!schema.readonly&&!value" class="el-icon-plus"></i>
      <div v-else class="fm-image__box" ref="box">
        <img v-if="schema.format==='image'" :src="value" />
        <video v-else :src="value">您的浏览器不支持 video 标签</video>
        <el-row type="flex" justify="center" @click.native.stop>
          <el-col :span="6">
            <i class="el-icon-zoom-in" @click="onPreview"></i>
          </el-col>
          <el-col :span="6" v-if="!schema.readonly">
            <i class="el-icon-edit" @click="onEdit"></i>
          </el-col>
          <el-col :span="6" v-if="!schema.readonly">
            <i class="el-icon-delete" @click="onDelete"></i>
          </el-col>
        </el-row>
      </div>
    </el-upload>
    <el-dialog class="fm-image__preview" :visible.sync="preview">
      <img v-if="schema.format==='image'" width="100%" :src="value" />
      <video v-else :src="value" controls>您的浏览器不支持 video 标签</video>
    </el-dialog>
  </div>
</template>

<style lang="less">
.fm-image {
  &__root {
    .el-upload {
      .fm-image--uploaded& {
        border: none;
      }
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
  data() {
    return {
      preview: false // 是否显示预览界面
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

        url = eval(this.schema.urlFetcher)
      } else {
        url = this.schema.urlFetcher(file.response)
      }

      this.$refs.upload.clearFiles()
      this.$emit('input', url)
    },
    onPreview() {
      this.preview = true
    },
    onEdit() {
      this.$refs.box.click()
    },
    onDelete() {
      this.$emit('input', '')
    }
  }
}
</script>
