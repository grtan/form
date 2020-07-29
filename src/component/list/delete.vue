<template>
  <el-button class="fm-list-delete__root" type="text" @click.stop="onDelete">
    删除
  </el-button>
</template>

<style lang="less">
.fm-list-delete {
  &__root {
    margin: 0 3px;
  }
}
</style>

<script>
import axios from '../../util/axios'

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
  methods: {
    async onDelete () {
      await this.$confirm('确定删除该项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      this.schema.delete(this.row, axios, (fail) => {
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
