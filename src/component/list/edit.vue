<template>
  <span class="fm-list-edit__root">
    <el-button type="text" @click.stop="show = true"> 编辑 </el-button>
    <el-dialog :visible.sync="show" width="75%" append-to-body>
      <v-form v-if="showForm" :key="formKey" :schema="editSchema" :default-value="row" :submit="submit" />
    </el-dialog>
  </span>
</template>

<script>
import axios from '../../util/axios'
import VForm from '../../index'

export default {
  components: {
    VForm(resolve) {
      resolve(VForm)
    }
  },
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
  },
  data() {
    return {
      show: false,
      showForm: false,
      formKey: 0
    }
  },
  computed: {
    editSchema() {
      const editSchema = {
        title: '编辑',
        type: 'object',
        required: [],
        properties: {}
      }

      Object.keys(this.schema.properties).forEach(prop => {
        if (this.schema.properties[prop].showInEdit) {
          // 在编辑对话框中是否必填
          ;(this.schema.properties[prop].requiredInEdit ?? true) && editSchema.required.push(prop)
          editSchema.properties[prop] = { ...this.schema.properties[prop] }

          // 主键不能修改
          if (this.schema.properties[prop].primary) {
            editSchema.properties[prop].readonly = true
          }
        }
      })

      return editSchema
    }
  },
  watch: {
    show() {
      if (this.show) {
        clearTimeout(this.timeoutId)
        this.showForm = true
        // 没来得及销毁时确保重新创建实例
        this.formKey++
        return
      }

      // 编辑框关闭时就销毁form表单，防止存在许多没用到的实例，消耗内存、性能
      this.timeoutId = setTimeout(() => {
        this.showForm = false
      }, 500)
    }
  },
  methods: {
    async submit(value) {
      if (this.editing || !this.show) {
        return
      }

      this.editing = true
      this.schema.edit({ ...this.row, ...value }, axios, error => {
        this.editing = false

        if (error) {
          error = error instanceof Error ? error.message : '修改失败'
          error && this.$message.error(error)
          return
        }

        this.$message.success('修改成功')
        this.show = false
        this.actions.query()
      })
    }
  }
}
</script>

<style lang="less">
.fm-list-edit {
  &__root {
    margin: 0 3px;
  }
}
</style>
