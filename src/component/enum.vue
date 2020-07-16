<template>
  <!-- select多选、单选 -->
  <el-select
    v-if="!isFetch&&schema.component==='select'"
    class="fm-enum__root"
    :multiple="isMultiple"
    :multiple-limit="schema.maxItems"
    :disabled="schema.readonly"
    placeholder="请选择"
    :value="fixedValue"
    @input="onInput"
  >
    <el-option
      v-for="({label,value:itemValue},index) in options"
      :key="index"
      :label="label"
      :value="itemValue"
    />
  </el-select>
  <!-- checkbox多选 -->
  <el-checkbox-group
    v-else-if="!isFetch&&isMultiple"
    class="fm-enum__root"
    :disabled="schema.readonly"
    :min="schema.minItems"
    :max="schema.maxItems"
    :value="fixedValue"
    @input="onInput"
  >
    <el-checkbox
      v-for="({name,label,value:itemValue},index) in options"
      :key="index"
      :label="itemValue"
    >
      <!-- color -->
      <el-tooltip
        v-if="(isMultiple?schema.items.type:schema.type)==='string'&&['color'].includes(isMultiple?schema.items.format:schema.format)"
        :content="String(itemValue)"
        :disabled="!name"
        placement="bottom"
      >
        <span :style="{color:itemValue}">{{ label }}</span>
      </el-tooltip>

      <!-- image、video -->
      <el-tooltip
        v-else-if="(isMultiple?schema.items.type:schema.type)==='string'&&['image','video'].includes(isMultiple?schema.items.format:schema.format)"
        :content="label"
        placement="bottom"
      >
        <v-image :schema="{...(isMultiple?schema.items:schema),readonly:true}" :value="itemValue" />
      </el-tooltip>

      <!-- file -->
      <el-tooltip
        v-else-if="(isMultiple?schema.items.type:schema.type)==='string'&&['file'].includes(isMultiple?schema.items.format:schema.format)"
        :content="String(itemValue)"
        :disabled="!name"
        placement="bottom"
      >
        <el-link
          :href="itemValue"
          target="_blank"
        >
          {{ label }}
        </el-link>
      </el-tooltip>

      <!-- 其他 -->
      <el-tooltip
        v-else
        :content="isBaseData?String(itemValue):JSON.stringify(schema.enum[index].value)"
        :disabled="!name"
        placement="bottom"
      >
        <span>{{ label }}</span>
      </el-tooltip>
    </el-checkbox>
  </el-checkbox-group>
  <!-- radio单选 -->
  <el-radio-group
    v-else-if="!isFetch"
    class="fm-enum__root"
    :disabled="schema.readonly"
    :value="fixedValue"
    @input="onInput"
  >
    <el-radio
      v-for="({name,label,value:itemValue},index) in options"
      :key="index"
      :label="itemValue"
    >
      <!-- color -->
      <el-tooltip
        v-if="(isMultiple?schema.items.type:schema.type)==='string'&&['color'].includes(isMultiple?schema.items.format:schema.format)"
        :content="String(itemValue)"
        :disabled="!name"
        placement="bottom"
      >
        <span :style="{color:itemValue}">{{ label }}</span>
      </el-tooltip>

      <!-- image、video -->
      <el-tooltip
        v-else-if="(isMultiple?schema.items.type:schema.type)==='string'&&['image','video'].includes(isMultiple?schema.items.format:schema.format)"
        :content="label"
        placement="bottom"
      >
        <v-image :schema="{...(isMultiple?schema.items:schema),readonly:true}" :value="itemValue" />
      </el-tooltip>

      <!-- file -->
      <el-tooltip
        v-else-if="(isMultiple?schema.items.type:schema.type)==='string'&&['file'].includes(isMultiple?schema.items.format:schema.format)"
        :content="String(itemValue)"
        :disabled="!name"
        placement="bottom"
      >
        <el-link
          :href="itemValue"
          target="_blank"
        >
          {{ label }}
        </el-link>
      </el-tooltip>

      <!-- 其他 -->
      <el-tooltip
        v-else
        :content="isBaseData?String(itemValue):JSON.stringify(schema.enum[index].value)"
        :disabled="!name"
        placement="bottom"
      >
        <span>{{ label }}</span>
      </el-tooltip>
    </el-radio>
  </el-radio-group>
  <!-- 通过接口查询 -->
  <div v-else class="fm-enum__root fm-enum--fetch">
    <div v-if="properties.length===1&&list.length" class="fm-enum__list">
      <div v-for="(item,index) in list" :key="index" class="fm-enum__item">
        <component
          :is="typeof schema.enum.properties[properties[0]].component==='function'?schema.enum.properties[properties[0]].component():'v-base'"
          :schema="{...schema.enum.properties[properties[0]],readonly:true}"
          :value="list[index][properties[0]]"
          @input="()=>{}"
        />
        <el-button type="text" @click="onDelete(index)">
          删除
        </el-button>
      </div>
    </div>
    <!-- 这里对table使用key，是因为值不同时，高度要自适应 -->
    <el-table v-else-if="properties.length>1&&list.length" :key="JSON.stringify(list)" class="fm-enum__list" :data="list" height="auto">
      <template v-for="prop in properties">
        <el-table-column
          v-if="schema.enum.properties[prop].showInTable===undefined||schema.enum.properties[prop].showInTable"
          :key="prop"
          :label="schema.enum.properties[prop].title"
          v-bind="schema.enum.properties[prop].tableColumn||{}"
        >
          <component
            :is="schema.enum.properties[prop].displayComponent()"
            v-if="typeof schema.enum.properties[prop].displayComponent==='function'"
            slot-scope="scope"
            :schema="schema.enum.properties[prop]"
            :value="scope.row[prop]"
          />
          <v-display v-else slot-scope="scope" :schema="schema.enum.properties[prop]" :value="scope.row[prop]" />
        </el-table-column>
      </template>
      <el-table-column
        align="center"
        label="操作"
        fixed="right"
      >
        <el-button slot-scope="scope" type="text" @click="onDelete(scope.$index)">
          删除
        </el-button>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="show=true">
      选择
    </el-button>
    <el-dialog class="fm-enum__dialog" :visible.sync="show" width="75%" append-to-body>
      <v-list :schema="getListSchema(schema.enum)" />
    </el-dialog>
  </div>
</template>

<style lang="less">
.fm-enum {
  &__root {
    &.fm-enum--fetch {
      display: flex;
      align-items: flex-start;

      > .el-button {
        flex: none;
      }
    }

    .el-radio {
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 0;

      .el-radio__label {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  &__list {
    flex: auto;
    margin-right: 2em;

    &.el-table {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  &__item {
    display: flex;
    align-items: center;

    &:not(:first-child) {
      margin-top: 0.7em;
    }

    > .el-button:last-child {
      margin-left: 1em;
    }
  }

  &__dialog {
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
import axios from '../util/axios'
import VBase from './base'
import VImage from './image'
import VList from './list/index'
import VSelect from './list/select'
import VDisplay from './list/display'

export default {
  components: {
    VBase (resolve) {
      resolve(VBase)
    },
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
      type: [String, Number, Boolean, Object, Array],
      default: undefined
    }
  },
  data () {
    return {
      show: false,
      list: []
    }
  },
  computed: {
    // 是否多选
    isMultiple () {
      return this.schema.type === 'array'
    },
    // 是否为基础数据类型
    isBaseData () {
      return ['string', 'number', 'boolean'].includes(this.isMultiple ? this.schema.items.type : this.schema.type)
    },
    // 是否从接口获取数据，为true时只支持string,number,boolean基础数据类型，为false时支持所有数据类型
    isFetch () {
      return !(this.schema.enum instanceof Array)
    },
    options () {
      const options = []

      this.schema.enum.forEach(({ name, value }, index) => {
        options.push({
          name,
          label: name || (this.isBaseData ? value : JSON.stringify(value)),
          value: this.isBaseData ? value : index
        })
      })

      return options
    },
    // 主属性
    primary () {
      if (!this.isFetch) {
        return
      }

      const primary = Object.keys(this.schema.enum.properties).find(prop => {
        return this.schema.enum.properties[prop].primary
      })

      if (primary === undefined) {
        throw new Error('当schema.enum为对象时，properties中必须要存在唯一的primary属性')
      }

      return primary
    },
    // 从列表中选择数据后在form表单项中显示的属性列表
    properties () {
      if (!this.isFetch) {
        return []
      }

      return Object.keys(this.schema.enum.properties).filter((prop) => {
        const { primary, showInFormItem } = this.schema.enum.properties[prop]

        return (primary && showInFormItem === undefined) || showInFormItem
      })
    },
    fixedValue () {
      if (this.isFetch) {
        return
      }

      if (!this.isBaseData) {
        const indexs = []
        const values = this.isMultiple ? this.value : [this.value]

        values.forEach((value) => {
          const index = this.findIndex(this.schema.enum, value)

          indexs.push(index !== -1 ? index : undefined)
        })

        return this.isMultiple ? indexs : indexs[0]
      }

      return this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler () {
        if (!this.isFetch) {
          return
        }

        // 值为空
        if ((this.isMultiple && !this.value.length) || (!this.isMultiple && this.value === undefined)) {
          this.list = []
          return
        }

        const list = (this.isMultiple ? this.value : [this.value]).map(id => {
          return this.list.find(item => {
            return item[this.primary] === id
          })
        })

        // 如果this.list中已经包含了所有数据
        if (!list.includes(undefined)) {
          this.list = list
          return
        }

        // 重新请求数据
        this.schema.enum.query({
          [this.primary]: this.isMultiple ? [...this.value] : this.value
        }, axios, ({ list }) => {
          this.list = list.slice(0, this.isMultiple ? this.value.length : 1)
        })
      }
    }
  },
  methods: {
    findIndex (list, data) {
      return list.findIndex(function ({ value }) {
        return JSON.stringify(value) === JSON.stringify(data)
      })
    },
    // 获取list组件schema
    getListSchema (schema) {
      const self = this
      const Select = {
        ...VSelect,
        methods: {
          onClick () {
            self.show = false

            if (!self.isMultiple) {
              self.$emit('input', this.row[self.primary])
              return
            }

            // 已经选择过
            if (self.value.includes(this.row[self.primary])) {
              return
            }

            self.value.push(this.row[self.primary])
          }
        }
      }

      return {
        ...schema,
        rowOperations () {
          const components = [Select]

          if (typeof schema.rowOperations === 'function') {
            components.unshift(...schema.rowOperations.call(this))
          }

          return components
        }
      }
    },
    // isFetch为false时调用
    onInput (value) {
      let values

      if (this.isBaseData) {
        values = this.isMultiple ? value : [value]
      } else {
        values = (this.isMultiple ? value : [value]).map(index => {
          return this.schema.enum[index].value
        })
      }

      if (!this.isMultiple) {
        // 如果是对象
        if (this.schema.type === 'object') {
          Object.keys(this.schema.properties).forEach(prop => {
            this.$set(this.value, prop, values[0][prop])
          })
          return
        }

        return this.$emit('input', values[0])
      }

      // 多选时按照UI显示来排序
      this.value.splice(0, this.value.length, ...values.map(item => {
        return {
          index: this.schema.enum.findIndex(({ value }) => {
            return JSON.stringify(value) === JSON.stringify(item)
          }),
          value: item
        }
      }).sort((a, b) => {
        return a.index - b.index
      }).map(({ value }) => {
        return value
      }))
    },
    // isFetch为true时调用
    onDelete (index) {
      if (!this.isMultiple) {
        return this.$emit('input', undefined)
      }

      this.value.splice(index, 1)
    }
  }
}
</script>
