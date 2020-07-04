<template>
  <!-- select -->
  <el-select
    v-if="schema.enum instanceof Array&&isSelect"
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    placeholder="请选择"
    @input="$listeners.input(isBase?$event:schema.enum[$event].value)"
  >
    <el-option
      v-for="({value:enumValue,name,showTip},index) in schema.enum"
      :key="index"
      :label="getSelectLabel(index)"
      :value="isBase?enumValue:index"
      :style="schema.type==='string'&&schema.format==='color'?{background:enumValue}:{}"
    >
      <div v-if="name&&showTip" class="fm-enum__select-item">
        <span class="fm-enum__select-item--left">{{ name }}</span>
        <span class="fm-enum__select-item--right">{{ getShowValue(enumValue) }}</span>
      </div>
    </el-option>
  </el-select>
  <!-- radio -->
  <el-radio-group
    v-else-if="schema.enum instanceof Array"
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    @input="$listeners.input(isBase?$event:schema.enum[$event].value)"
  >
    <el-radio
      v-for="({value:enumValue,name,showTip,download},index) in schema.enum"
      :key="index"
      :label="isBase?enumValue:index"
    >
      <!-- color -->
      <el-tooltip
        v-if="schema.type==='string'&&schema.format==='color'"
        :content="enumValue"
        :disabled="!showTip"
        placement="bottom"
      >
        <span v-if="name" :style="{color:enumValue}">{{ name }}</span>
        <span v-else class="fm-enum__color" :style="{background:enumValue}" />
      </el-tooltip>

      <!-- image、video -->
      <el-tooltip
        v-else-if="schema.type==='string'&&['image','video'].includes(schema.format)"
        :content="name||enumValue"
        :disabled="!showTip"
        placement="bottom"
      >
        <v-image :schema="Object.assign({},schema,{readonly:true})" :value="enumValue" />
      </el-tooltip>

      <!-- file -->
      <el-tooltip
        v-else-if="schema.type==='string'&&['file'].includes(schema.format)"
        :content="enumValue"
        :disabled="!name||!showTip"
        placement="bottom"
      >
        <el-link v-if="download" :href="enumValue" target="_blank">
          {{ name||enumValue }}
        </el-link>
        <span v-else>{{ name||enumValue }}</span>
      </el-tooltip>

      <!-- 其他 -->
      <el-tooltip
        v-else
        :content="getShowValue(enumValue)"
        :disabled="!name||!showTip"
        placement="bottom"
      >
        <span>{{ name||getShowValue(enumValue) }}</span>
      </el-tooltip>
    </el-radio>
  </el-radio-group>
  <!-- 通过接口查询 -->
  <div v-else class="fm-enum__root">
    <el-button type="text" @click="show=true">
      选择
    </el-button>
    <el-dialog class="fm-enum__list" :visible.sync="show" width="70%" append-to-body>
      <v-list :schema="getListSchema(schema.enum)" />
    </el-dialog>
    <!-- 这里对table使用key，是因为值不同时，高度要自适应 -->
    <el-table v-if="fixedValue.length" :key="JSON.stringify(fixedValue)" :data="fixedValue" height="auto">
      <template v-for="(propSchema,prop) in schema.enum.properties">
        <el-table-column
          v-if="propSchema.showInTable===undefined||propSchema.showInTable"
          :key="prop"
          :label="propSchema.title"
          v-bind="propSchema.tableColumn||{}"
        >
          <component
            :is="propSchema.displayComponent()"
            v-if="typeof propSchema.displayComponent==='function'"
            slot-scope="scope"
            :schema="propSchema"
            :value="scope.row[prop]"
          />
          <v-display v-else slot-scope="scope" :schema="propSchema" :value="scope.row[prop]" />
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<style lang="less">
.fm-enum {
  &__root {
    .el-radio {
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 0;

      .el-radio__label {
        display: inline-block;
        vertical-align: middle;
      }
    }

    > .el-table {
      margin-top: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  &__select-item {
    display: flex;
    justify-content: space-between;

    &--right {
      margin-left: 2em;
      color: rgb(132, 146, 166);
    }
  }

  &__color {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }

  &__list {
    > .el-dialog {
      > .el-dialog__body {
        > .fm-list__root {
          max-height: 65vh;
          min-height: 45vh;
        }
      }
    }
  }
}
</style>

<script>
import VImage from './image'
import VList from './list/index'
import VSelect from './list/select'
import VDisplay from './list/display'

export default {
  components: {
    VImage,
    VDisplay,
    VList (resolve) {
      resolve(VList)
    }
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Array],
      default: undefined
    }
  },
  data () {
    // 从接口获取数据时的主属性
    const primary = this.schema.enum instanceof Array ? '' : Object.keys(this.schema.enum.properties).find(prop => {
      return this.schema.enum.properties[prop].primary
    })

    if (primary === undefined) {
      throw new Error('当schema.enum为对象时，properties中必须要存在唯一的primary属性')
    }

    return {
      show: false,
      primary,
      list: (this.schema.enum instanceof Array || this.value === undefined) ? [] : [{
        [primary]: this.value
      }]
    }
  },
  computed: {
    isSelect () {
      if (this.schema.component === 'select') {
        if (this.schema.type === 'string') {
          return !['image', 'video', 'file'].includes(this.schema.format)
        }

        return ['number', 'address', 'range'].includes(this.schema.type)
      }

      return false
    },
    isBase () {
      return !['address', 'range'].includes(this.schema.type)
    },
    fixedValue () {
      // 从接口获取数据
      if (!(this.schema.enum instanceof Array)) {
        return this.list
      }

      if (!this.isBase) {
        const index = this.findIndex(this.schema.enum, this.value)

        return index !== -1 ? index : undefined
      }

      return this.value
    }
  },
  methods: {
    findIndex (list, array) {
      return list.findIndex(function ({ value }) {
        return JSON.stringify(value) === JSON.stringify(array)
      })
    },
    getSelectLabel (index) {
      return this.schema.enum[index].name || this.getShowValue(this.schema.enum[index].value)
    },
    getShowValue (value) {
      switch (true) {
        case this.schema.type === 'address':
          return value.join(' ')
        case this.schema.type === 'range':
          return value.join(' ～ ')
        default:
          return value
      }
    },
    // 获取list组件schema
    getListSchema (schema) {
      const self = this
      const operations = typeof schema.rowOperations === 'function' ? schema.rowOperations() : []
      const Select = {
        ...VSelect,
        methods: {
          onClick () {
            self.show = false
            self.list = [this.row]
            self.$listeners.input(this.row[self.primary])
          }
        }
      }

      return {
        ...schema,
        rowOperations () {
          return [
            ...operations,
            Select
          ]
        }
      }
    }
  }
}
</script>
