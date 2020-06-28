<template>
  <div class="fm-display__root">
    <!-- 带label的枚举 -->
    <div v-if="label" class="fm-display__text" :title="label">
      {{ label }}
    </div>

    <!-- 字符串 -->
    <template v-else-if="schema.type==='string'">
      <!-- 颜色 -->
      <el-tooltip v-if="schema.format==='color'" :content="value">
        <el-color-picker
          :value="value"
          :show-alpha="schema.showAlpha"
          :color-format="schema.colorFormat"
          :predefine="schema.predefine"
          :disabled="true"
        />
      </el-tooltip>

      <!-- 图片、视频 -->
      <v-image
        v-else-if="['image','video'].includes(schema.format)"
        :schema="{...schema,readonly:true}"
        :value="value"
      />

      <!-- 文件 -->
      <v-file
        v-else-if="schema.format==='file'"
        :schema="{...schema,readonly:true}"
        :value="value"
      />

      <!-- 日期、时间 -->
      <div
        v-else-if="['time','datetime','year','month','week','date'].includes(schema.format)"
        class="fm-display__text"
        :title="value"
      >
        {{ value }}
      </div>

      <!-- 普通字符串 -->
      <div v-else class="fm-display__text" :title="value">
        {{ value }}
      </div>
    </template>

    <!-- 数字 -->
    <div v-else-if="schema.type==='number'" class="fm-display__text" :title="value">
      {{ value }}
    </div>

    <!-- 布尔值 -->
    <el-switch
      v-else-if="schema.type==='boolean'"
      :value="value"
      :disabled="true"
    />

    <!-- 地址 -->
    <div v-else-if="schema.type==='address'" class="fm-display__text" :title="value.join('/')">
      {{ value.join('/') }}
    </div>

    <!-- 日期、时间范围 -->
    <div v-else-if="schema.type==='range'" class="fm-display__text" :title="value.join(' 至 ')">
      {{ value.join(' 至 ') }}
    </div>

    <!-- 对象、数组 -->
    <div v-else class="fm-display__text" :title="JSON.stringify(value)">
      {{ JSON.stringify(value) }}
    </div>
  </div>
</template>

<style lang="less">
.fm-display {
  &__root {
    display: inline-block;
    vertical-align: middle;
  }

  &__text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
  }
}
</style>

<script>
import VImage from '../image'
import VFile from '../file'

export default {
  components: {
    VImage,
    VFile
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
    label(){
      if(!(this.schema.enum instanceof Array)){
        return ''
      }

      const item=this.schema.enum.find(({value})=>{
        if(['address', 'range'].includes(this.schema.type)){
          return JSON.stringify(value) === JSON.stringify(this.value)
        }

        return value===this.value
      })

      return item && item.name
    }
  }
}
</script>
