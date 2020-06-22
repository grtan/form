<template>
  <span class="fm-list-add__root">
    <el-button icon="el-icon-plus" @click="show=true">
      新增
    </el-button>
    <el-dialog :visible.sync="show" width="70%" append-to-body>
      <v-form
        :schema="addSchema"
        :submit="submit"
      />
    </el-dialog>
  </span>
</template>

<script>
import axios from 'axios'
import VForm from '../../index'

export default {
  components: {
    VForm (resolve) {
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
  data () {
    return {
      show: false
    }
  },
  computed: {
    addSchema () {
      const addSchema = {
        title: '新增',
        type: 'object',
        required: [],
        properties: {}
      }

      Object.keys(this.schema.properties).forEach(prop => {
        if (this.schema.properties[prop].showInAdd) {
          addSchema.required.push(prop)
          addSchema.properties[prop] = this.schema.properties[prop]
        }
      })

      return addSchema
    }
  },
  methods: {
    async submit (value) {
      this.schema.add(value, axios, (fail) => {
        if (fail) {
          this.$message.error('新增失败')
          return
        }

        this.$message.success('新增成功')
        this.show = false
        this.actions.setSearch()
        this.actions.query()
      })
    }
  }
}
</script>
