<template>
  <span class="fm-list-add__root">
    <el-button icon="el-icon-plus" @click="show = true"> 新增 </el-button>
    <el-dialog :visible.sync="show" width="75%" append-to-body>
      <v-form v-if="formKey" :key="formKey" :schema="addSchema" :submit="submit" />
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
      formKey: 0
    }
  },
  computed: {
    addSchema() {
      const addSchema = {
        title: '新增',
        type: 'object',
        required: [],
        properties: {}
      }

      Object.keys(this.schema.properties).forEach(prop => {
        if (this.schema.properties[prop].showInAdd) {
          ;(this.schema.properties[prop].requiredInAdd ?? true) && addSchema.required.push(prop)
          addSchema.properties[prop] = this.schema.properties[prop]
        }
      })

      return addSchema
    }
  },
  watch: {
    show() {
      if (!this.show) {
        return
      }

      // 显示时创建新实例
      this.formKey++
    }
  },
  methods: {
    async submit(value) {
      if (this.adding || !this.show) {
        return
      }

      this.adding = true
      this.schema.add(value, axios, error => {
        this.adding = false

        if (error) {
          error = error instanceof Error ? error.message : '新增失败'
          // 没有error信息时不提示
          error && this.$message.error(error)
          return
        }

        this.$message.success('新增成功')
        this.show = false
        this.actions.setSearch()
      })
    }
  }
}
</script>
