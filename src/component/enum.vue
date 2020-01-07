<template>
  <!-- select -->
  <el-select
    v-if="isSelect"
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    placeholder="请选择"
    @input="$listeners.input(isBase?$event:schema.enum[$event].value)"
  >
    <el-option
      v-for="({value,name,showTip},index) in schema.enum"
      :key="index"
      :label="getSelectLabel(index)"
      :value="isBase?value:index"
      :style="schema.type==='string'&&schema.format==='color'?{background:value}:{}"
    >
      <div v-if="name&&showTip" class="fm-enum__select-item">
        <span class="fm-enum__select-item--left">{{name}}</span>
        <span class="fm-enum__select-item--right">{{getShowValue(value)}}</span>
      </div>
    </el-option>
  </el-select>
  <!-- radio -->
  <el-radio-group
    v-else
    class="fm-enum__root"
    :value="fixedValue"
    :disabled="schema.readonly"
    @input="$listeners.input(isBase?$event:schema.enum[$event].value)"
  >
    <el-radio
      v-for="({value,name,showTip,download},index) in schema.enum"
      :key="index"
      :label="isBase?value:index"
    >
      <!-- color -->
      <el-tooltip
        v-if="schema.type==='string'&&schema.format==='color'"
        :content="value"
        :disabled="!showTip"
        placement="bottom"
      >
        <span v-if="name" :style="{color:value}">{{name}}</span>
        <span v-else class="fm-enum__color" :style="{background:value}"></span>
      </el-tooltip>

      <!-- image、video -->
      <el-tooltip
        v-else-if="schema.type==='string'&&['image','video'].includes(schema.format)"
        :content="name||value"
        :disabled="!showTip"
        placement="bottom"
      >
        <v-image :schema="Object.assign({},schema,{readonly:true})" :value="value"></v-image>
      </el-tooltip>

      <!-- file -->
      <el-tooltip
        v-else-if="schema.type==='string'&&['file'].includes(schema.format)"
        :content="value"
        :disabled="!name||!showTip"
        placement="bottom"
      >
        <el-link v-if="download" :href="value" target="_blank">{{name||value}}</el-link>
        <span v-else>{{name||value}}</span>
      </el-tooltip>

      <!-- 其他 -->
      <el-tooltip
        v-else
        :content="getShowValue(value)"
        :disabled="!name||!showTip"
        placement="bottom"
      >
        <span>{{name||getShowValue(value)}}</span>
      </el-tooltip>
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
      return list.findIndex(function ({ value }) {
        return JSON.stringify(value) === JSON.stringify(array)
      })
    },
    getSelectLabel(index) {
      return this.schema.enum[index].name || this.getShowValue(this.schema.enum[index].value)
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
