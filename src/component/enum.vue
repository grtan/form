<template>
  <!-- select -->
  <el-select
    v-if="isSelect"
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    placeholder="请选择"
    @input="$listeners.input(isBase?$event:schema.enum[$event])"
  >
    <el-option
      v-for="(value,index) in schema.enum"
      :key="index"
      :label="getSelectLabel(index)"
      :value="isBase?value:index"
      :style="schema.type==='string'&&schema.format==='color'?{background:value}:{}"
    >
      <!-- 非color -->
      <template v-if="!(schema.type==='string'&&schema.format==='color')">
        <div v-if="schema.enumNames&&schema.enumNames[index]" class="fm-select__select-item">
          <span class="fm-select__select-item--left">{{schema.enumNames[index]}}</span>
          <span class="fm-select__select-item--right">{{getShowValue(value)}}</span>
        </div>
      </template>
    </el-option>
  </el-select>
  <!-- radio -->
  <el-radio-group
    v-else
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    @input="$listeners.input(isBase?$event:schema.enum[$event])"
  >
    <el-radio v-for="(value,index) in schema.enum" :key="index" :label="isBase?value:index">
      <!-- color -->
      <template v-if="schema.type==='string'&&schema.format==='color'">
        <span
          v-if="schema.enumNames&&schema.enumNames[index]"
          :style="{color:value}"
        >{{schema.enumNames[index]}}</span>
        <span v-else class="fm-select__color" :style="{background:value}"></span>
      </template>

      <!-- image、video -->
      <el-tooltip
        v-else-if="schema.type==='string'&&['image','video'].includes(schema.format)"
        :content="schema.enumNames&&schema.enumNames[index]"
        :disabled="!schema.enumNames||!schema.enumNames[index]"
        placement="bottom"
      >
        <v-image :schema="Object.assign({},schema,{readonly:true})" :value="value"></v-image>
      </el-tooltip>

      <!-- file -->
      <el-link
        v-else-if="schema.type==='string'&&['file'].includes(schema.format)"
        :href="value"
        target="_blank"
      >{{schema.enumNames&&schema.enumNames[index]||value}}</el-link>

      <!-- 其他 -->
      <template v-else>
        <el-tooltip
          v-if="schema.enumNames&&schema.enumNames[index]"
          :content="getShowValue(value)"
          placement="bottom"
        >
          <span>{{schema.enumNames[index]}}</span>
        </el-tooltip>
        <template v-else>{{getShowValue(value)}}</template>
      </template>
    </el-radio>
  </el-radio-group>
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
}
</style>

<script>
import VImage from './image'

export default {
  components: {
    VImage
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  },
  computed: {
    isSelect() {
      if (this.schema.component === 'select') {
        if (this.schema.type === 'string') {
          return !['image', 'video', 'file'].includes(this.schema.format)
        }

        return ['number', 'address', 'range'].includes(this.schema.type)
      }

      return false
    },
    isBase() {
      return !['address', 'range'].includes(this.schema.type)
    },
    fixedValue() {
      if (!this.isBase) {
        const index = this.findIndex(this.schema.enum, this.value)

        return index !== -1 ? index : undefined
      }

      return this.value
    }
  },
  methods: {
    findIndex(list, array) {
      return list.findIndex(function (item) {
        return JSON.stringify(item) === JSON.stringify(array)
      })
    },
    getSelectLabel(index) {
      return this.schema.enumNames && this.schema.enumNames[index] || this.getShowValue(this.schema.enum[index])
    },
    getShowValue(value) {
      switch (true) {
        case this.schema.type === 'address':
          return value.join(' ')
        case this.schema.type === 'range':
          return value.join(' ～ ')
        default:
          return value
      }
    }
  }
}
</script>
