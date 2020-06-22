<template>
  <el-button class="fm-list-multi-delete__root" icon="el-icon-delete" @click="onDelete">
    批量删除
  </el-button>
</template>

<script>
import axios from 'axios'

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
  methods: {
    async onDelete () {
      if (!this.selection.length) {
        this.$message('请先选择要删除的项')
        return
      }

      await this.$confirm('确定删除选择的项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      this.schema.multiDelete(this.selection, axios, (fail) => {
        if (fail) {
          this.$message.error('删除失败')
          return
        }

        this.$message.success('删除成功')
        this.actions.query()
      })
    }
  }
}
</script>
