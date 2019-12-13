<template>
  <div :class="[$style.root,{[$style.uploaded]:schema.readonly||value}]">
    <el-upload
      ref="upload"
      :action="schema.action"
      list-type="picture-card"
      :show-file-list="false"
      :on-success="onSuccess"
    >
      <i v-if="!schema.readonly&&!value" class="el-icon-plus"></i>
      <div v-else :class="$style.box" ref="box">
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
    <el-dialog :class="$style.dialog" :visible.sync="preview">
      <img v-if="schema.format==='image'" width="100%" :src="value" />
      <video v-else :src="value" controls>您的浏览器不支持 video 标签</video>
    </el-dialog>
  </div>
</template>

<style lang="less" module>
.root {
  :global(.el-upload) {
    .uploaded& {
      border: none;
    }

    .box {
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
  }

  .dialog {
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
  data () {
    return {
      preview: false // 是否显示预览界面
    }
  },
  methods: {
    onSuccess (res, file) {
      this.$refs.upload.clearFiles()
      this.$emit('input', file.url)
    },
    onPreview () {
      this.preview = true
    },
    onEdit () {
      this.$refs.box.click()
    },
    onDelete () {
      this.$emit('input', '')
    }
  }
}
</script>
