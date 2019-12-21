<template>
  <div class="fm-base__root">
    <!-- 字符串 -->
    <template v-if="schema.type==='string'">
      <!-- 颜色 -->
      <template v-if="schema.format==='color'">
        <!-- 固定枚举 -->
        <v-enum
          v-if="(schema.enum instanceof Array)"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-enum>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
        <!-- 普通输入 -->
        <el-color-picker
          v-else
          :value="value"
          :show-alpha="schema.showAlpha"
          :color-format="schema.colorFormat"
          :predefine="schema.predefine"
          :disabled="schema.readonly"
          @input="$listeners.input"
        ></el-color-picker>
      </template>

      <!-- 图片、视频 -->
      <template v-else-if="['image','video'].includes(schema.format)">
        <!-- 固定枚举 -->
        <v-enum
          v-if="(schema.enum instanceof Array)"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-enum>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
        <!-- 普通输入 -->
        <v-image v-else :schema="schema" :value="value" @input="$listeners.input"></v-image>
      </template>

      <!-- 文件 -->
      <template v-else-if="schema.format==='file'">
        <!-- 固定枚举 -->
        <v-enum
          v-if="(schema.enum instanceof Array)"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-enum>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
        <!-- 普通输入 -->
        <v-file v-else :schema="schema" :value="value" @input="$listeners.input"></v-file>
      </template>

      <!-- 日期、时间 -->
      <template
        v-else-if="['time','datetime','year','month','week','date'].includes(schema.format)"
      >
        <!-- 固定枚举 -->
        <v-enum
          v-if="(schema.enum instanceof Array)"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-enum>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
        <!-- 普通输入 -->
        <v-time v-else :schema="schema" :value="value" @input="$listeners.input"></v-time>
      </template>

      <!-- 普通字符串 -->
      <template v-else>
        <!-- 固定枚举 -->
        <v-enum
          v-if="(schema.enum instanceof Array)"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-enum>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
        <!-- 富文本 -->
        <v-richtext
          v-else-if="schema.component==='richtext'"
          :schema="schema"
          :value="value"
          @input="$listeners.input"
        ></v-richtext>
        <!-- 普通输入 -->
        <el-input
          v-else
          :value="value"
          :type="schema.component==='textarea'?'textarea':undefined"
          :minlength="typeof schema.minLength==='number'?schema.minLength:undefined"
          :maxlength="typeof schema.maxLength==='number'?schema.maxLength:undefined"
          :readonly="schema.readonly"
          placeholder="请输入内容"
          @input="$listeners.input"
        ></el-input>
      </template>
    </template>

    <!-- 数字 -->
    <template v-else-if="schema.type==='number'">
      <!-- 固定枚举 -->
      <v-enum
        v-if="(schema.enum instanceof Array)"
        :schema="schema"
        :value="value"
        @input="$listeners.input"
      ></v-enum>
      <!-- 从接口获取枚举结果 -->
      <!-- 普通输入 -->
      <el-input-number
        v-else
        :value="value"
        :min="typeof schema.minimum==='number'?schema.minimum:undefined"
        :max="typeof schema.maximum==='number'?schema.maximum:undefined"
        :step="typeof schema.multipleOf==='number'?schema.multipleOf:undefined"
        :step-strictly="typeof schema.multipleOf==='number'"
        @input="$listeners.input"
      ></el-input-number>
    </template>

    <!-- 布尔值 -->
    <template v-else-if="schema.type==='boolean'">
      <el-switch
        v-if="schema.component==='switch'"
        :value="value"
        :disabled="schema.readonly"
        @input="$listeners.input"
      ></el-switch>
      <el-checkbox v-else :disabled="schema.readonly" :value="value" @input="$listeners.input"></el-checkbox>
    </template>

    <!-- 地址 -->
    <template v-else-if="schema.type==='address'">
      <!-- 固定枚举 -->
      <v-enum
        v-if="(schema.enum instanceof Array)"
        :schema="schema"
        :value="value"
        @input="$listeners.input"
      ></v-enum>
      <!-- 普通输入 -->
      <v-address v-else :schema="schema" :value="value" @input="$listeners.input"></v-address>
    </template>

    <!-- 日期、时间范围 -->
    <template v-else-if="schema.type==='range'">
      <!-- 固定枚举 -->
      <v-enum
        v-if="(schema.enum instanceof Array)"
        :schema="schema"
        :value="value"
        @input="$listeners.input"
      ></v-enum>
      <!-- 普通输入 -->
      <v-time v-else :schema="schema" :value="value" @input="$listeners.input"></v-time>
    </template>
  </div>
</template>

<script>
import VEnum from './enum'
import VImage from './image'
import VFile from './file'
import VAddress from './address'
import VTime from './time'
import VRichtext from './richtext/index'

export default {
  components: {
    VEnum,
    VImage,
    VFile,
    VAddress,
    VTime,
    VRichtext
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  }
}
</script>
