<template>
  <div class="fm-excel__root">
    <el-upload
      ref="upload"
      :action="''"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :auto-upload="false"
      :file-list="list"
      :on-change="onChange"
      :on-remove="onDelete"
    >
      <el-button size="small" type="primary" plain>
        选择excel文件
      </el-button>
    </el-upload>
  </div>
</template>

<style lang="less">
.fm-excel {
  &__root {
    > div {
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
import XLSX from 'xlsx'

export default {
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    onChange ({ name, raw: file }) {
      const reader = new FileReader()

      reader.onload = e => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, {
          type: 'array'
        })

        Object.keys(this.schema.properties).forEach(sheet => {
          const list = !workbook.Sheets[sheet] ? [] : XLSX.utils.sheet_to_json(workbook.Sheets[sheet]).map(row => {
            const fixedRow = {}

            Object.keys(this.schema.properties[sheet].items.properties).forEach(column => {
              fixedRow[column] = row[column] !== undefined ? row[column] : undefined
            })

            return fixedRow
          })

          /**
           * 必须要先执行$delete，在执行$set。
           * 如果只执行$set，因为这些属性已经存在了，不会触发value的watch，导致item组件不会进行校验
           * 一个事件循环内即使改变多次value，由于vue内部做了优化，也只会触发一次watch
           */
          this.$delete(this.value, sheet)
          this.$set(this.value, sheet, list)
        })
      }
      reader.readAsArrayBuffer(file)
      // 文件列表始终只显示最新的文件
      this.list = [{
        name
      }]
    },
    onDelete () {
      Object.keys(this.schema.properties).forEach(sheet => {
        this.$delete(this.value, sheet)
        this.$set(this.value, sheet, [])
      })
    }
  }
}
</script>
