<template>
  <div :class="$style.root">
    <!-- 字符串 -->
    <template v-if="schema.type==='string'">
      <!-- 普通字符串 -->
      <template v-if="!schema.format">
        <el-input
          v-if="!schema.enum"
          :value="value"
          :readonly="schema.readonly"
          @input="$listeners.input"
          placeholder="请输入内容"
        ></el-input>
        <!-- 固定枚举 -->
        <template v-else-if="(schema.enum instanceof Array)">
          <el-select
            v-if="schema.component==='select'"
            :value="value"
            @input="$listeners.input"
            placeholder="请选择"
          >
            <el-option
              v-for="(value,index) in schema.enum"
              :key="value"
              :label="schema.enumNames&&schema.enumNames[index]||value"
              :value="value"
            ></el-option>
          </el-select>
          <el-radio-group v-else :value="value" @input="$listeners.input">
            <el-radio
              v-for="(value,index) in schema.enum"
              :key="value"
              :label="value"
            >{{schema.enumNames&&schema.enumNames[index]||value}}</el-radio>
          </el-radio-group>
        </template>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>

      <!-- 颜色 -->
      <template v-else-if="schema.format==='color'">
        <el-color-picker
          v-if="!schema.enum"
          :value="value"
          :disabled="schema.readonly"
          @input="$listeners.input"
          show-alpha
        ></el-color-picker>
        <!-- 固定枚举 -->
        <template v-else-if="(schema.enum instanceof Array)">
          <el-select
            v-if="schema.component==='select'"
            :value="value"
            @input="$listeners.input"
            placeholder="请选择"
          >
            <el-option
              v-for="(value,index) in schema.enum"
              :key="value"
              :label="schema.enumNames&&schema.enumNames[index]||value"
              :value="value"
              :style="{background:value}"
            ></el-option>
          </el-select>
          <el-radio-group v-else :value="value" @input="$listeners.input">
            <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
              <span
                v-if="schema.enumNames&&schema.enumNames[index]"
                :style="{color:value}"
              >{{schema.enumNames[index]}}</span>
              <el-color-picker v-else :value="value" :disabled="true" show-alpha></el-color-picker>
            </el-radio>
          </el-radio-group>
        </template>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>

      <!-- 图片 -->
      <template v-else-if="schema.format==='image'">
        <v-image v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-image>
        <!-- 固定枚举 -->
        <el-radio-group v-else :value="value" @input="$listeners.input">
          <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
            <el-link
              v-if="schema.enumNames&&schema.enumNames[index]"
              :href="value"
              target="_blank"
            >{{schema.enumNames[index]}}</el-link>
            <v-image v-else :schema="Object.assign({},schema,{readonly:true})" :value="value"></v-image>
          </el-radio>
        </el-radio-group>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>

      <!-- 视频 -->
      <template v-else-if="schema.format==='video'">
        <v-image v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-image>
        <!-- 固定枚举 -->
        <el-radio-group
          v-else-if="(schema.enum instanceof Array)"
          :value="value"
          @input="$listeners.input"
        >
          <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
            <el-link
              v-if="schema.enumNames&&schema.enumNames[index]"
              :href="value"
              target="_blank"
            >{{schema.enumNames[index]}}</el-link>
            <v-image v-else :schema="Object.assign({},schema,{readonly:true})" :value="value"></v-image>
          </el-radio>
        </el-radio-group>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>

      <!-- 文件 -->
      <template v-else-if="schema.format==='file'">
        <v-file v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-file>
        <!-- 固定枚举 -->
        <el-radio-group
          v-else-if="(schema.enum instanceof Array)"
          :value="value"
          @input="$listeners.input"
        >
          <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
            <el-link
              v-if="schema.enumNames&&schema.enumNames[index]"
              :href="value"
              target="_blank"
            >{{schema.enumNames[index]}}</el-link>
            <v-file v-else :schema="Object.assign({},schema,{readonly:true})" :value="value"></v-file>
          </el-radio>
        </el-radio-group>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>

      <!-- 日期、时间 -->
      <template
        v-else-if="['time','datetime','year','month','week','date'].includes(schema.format)"
      >
        <v-time v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-time>
        <!-- 固定枚举 -->
        <template v-else-if="(schema.enum instanceof Array)">
          <el-select
            v-if="schema.component==='select'"
            :value="value"
            @input="$listeners.input"
            placeholder="请选择"
          >
            <el-option
              v-for="(value,index) in schema.enum"
              :key="value"
              :label="schema.enumNames&&schema.enumNames[index]||value"
              :value="value"
            >
              <el-row
                v-if="schema.enumNames&&schema.enumNames[index]"
                type="flex"
                justify="space-between"
              >
                <el-col :span="7">{{schema.enumNames[index]}}</el-col>
                <el-col :span="16" style="text-align:right;color:#aaa">{{value}}</el-col>
              </el-row>
            </el-option>
          </el-select>
          <el-radio-group v-else :value="value" @input="$listeners.input">
            <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
              <el-tooltip
                v-if="schema.enumNames&&schema.enumNames[index]"
                :content="value"
                placement="bottom"
              >
                <span>{{schema.enumNames[index]}}</span>
              </el-tooltip>
              <template v-else>{{value}}</template>
            </el-radio>
          </el-radio-group>
        </template>
        <!-- 从接口获取枚举结果，展示列表组件来选择 -->
      </template>
    </template>

    <!-- 数字 -->
    <template v-else-if="schema.type==='number'">
      <!-- 输入数字 -->
      <el-input-number
        v-if="!schema.enum"
        :value="value"
        @input="$listeners.input"
        controls-position="right"
      ></el-input-number>
      <!-- 固定枚举 -->
      <template v-else-if="(schema.enum instanceof Array)">
        <el-select
          v-if="schema.component==='select'"
          :value="value"
          @input="$listeners.input"
          placeholder="请选择"
        >
          <el-option
            v-for="(value,index) in schema.enum"
            :key="value"
            :label="schema.enumNames&&schema.enumNames[index]||value"
            :value="value"
          >
            <el-row
              v-if="schema.enumNames&&schema.enumNames[index]"
              type="flex"
              justify="space-between"
            >
              <el-col :span="16">{{schema.enumNames[index]}}</el-col>
              <el-col :span="7" style="text-align:right;color:#aaa">{{value}}</el-col>
            </el-row>
          </el-option>
        </el-select>
        <el-radio-group v-else :value="value" @input="$listeners.input">
          <el-radio v-for="(value,index) in schema.enum" :key="value" :label="value">
            <el-tooltip
              v-if="schema.enumNames&&schema.enumNames[index]"
              :content="value+''"
              placement="bottom"
            >
              <span>{{schema.enumNames[index]}}</span>
            </el-tooltip>
            <template v-else>{{value}}</template>
          </el-radio>
        </el-radio-group>
      </template>
      <!-- 从接口获取枚举结果 -->
    </template>

    <!-- 布尔值 -->
    <template v-else-if="schema.type==='boolean'">
      <el-switch
        v-if="schema.component==='switch'"
        :disabled="schema.readonly"
        :value="value"
        @input="$listeners.input"
      ></el-switch>
      <el-checkbox v-else :disabled="schema.readonly" :value="value" @input="$listeners.input"></el-checkbox>
    </template>

    <!-- 地址 -->
    <template v-else-if="schema.type==='address'">
      <v-address v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-address>
      <!-- 固定枚举 -->
      <template v-else-if="(schema.enum instanceof Array)">
        <el-select
          v-if="schema.component==='select'"
          :value="findIndex(schema.enum,value)!==-1?findIndex(schema.enum,value):undefined"
          placeholder="请选择"
          @input="$listeners.input(schema.enum[$event])"
        >
          <el-option
            v-for="(value,index) in schema.enum"
            :key="index"
            :label="schema.enumNames&&schema.enumNames[index]||value.join(' ')"
            :value="index"
          >
            <el-row
              v-if="schema.enumNames&&schema.enumNames[index]"
              type="flex"
              justify="space-between"
            >
              <el-col :span="7">{{schema.enumNames[index]}}</el-col>
              <el-col :span="16" style="text-align:right;color:#aaa">{{value.join(' ')}}</el-col>
            </el-row>
          </el-option>
        </el-select>
        <el-radio-group v-else :value="value" @input="$listeners.input">
          <el-radio v-for="(value,index) in schema.enum" :key="index" :label="value">
            <el-tooltip
              v-if="schema.enumNames&&schema.enumNames[index]"
              :content="value.join(' ')"
              placement="bottom"
            >
              <span>{{schema.enumNames[index]}}</span>
            </el-tooltip>
            <template v-else>{{value.join(' ')}}</template>
          </el-radio>
        </el-radio-group>
      </template>
    </template>

    <!-- 日期、时间范围 -->
    <template v-else-if="schema.type==='range'">
      <v-time v-if="!schema.enum" :schema="schema" :value="value" @input="$listeners.input"></v-time>
      <!-- 固定枚举 -->
      <template v-else-if="(schema.enum instanceof Array)">
        <el-select
          v-if="schema.component==='select'"
          :value="findIndex(schema.enum,value)!==-1?findIndex(schema.enum,value):undefined"
          placeholder="请选择"
          @input="$listeners.input(schema.enum[$event])"
        >
          <el-option
            v-for="(value,index) in schema.enum"
            :key="index"
            :label="schema.enumNames&&schema.enumNames[index]||value.join(' - ')"
            :value="index"
          >
            <el-row
              v-if="schema.enumNames&&schema.enumNames[index]"
              type="flex"
              justify="space-between"
            >
              <el-col :span="7">{{schema.enumNames[index]}}</el-col>
              <el-col :span="16" style="text-align:right;color:#aaa">{{value.join(' - ')}}</el-col>
            </el-row>
          </el-option>
        </el-select>
        <el-radio-group v-else :value="value" @input="$listeners.input">
          <el-radio v-for="(value,index) in schema.enum" :key="index" :label="value">
            <el-tooltip
              v-if="schema.enumNames&&schema.enumNames[index]"
              :content="value.join(' - ')"
              placement="bottom"
            >
              <span>{{schema.enumNames[index]}}</span>
            </el-tooltip>
            <template v-else>{{value.join(' - ')}}</template>
          </el-radio>
        </el-radio-group>
      </template>
    </template>
  </div>
</template>

<style lang="less" module>
.root {
  :global(.el-radio) {
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 0;

    :global(.el-radio__label) {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>

<script>
import VImage from './image'
import VFile from './file'
import VAddress from './address'
import VTime from './time'

export default {
  components: {
    VImage,
    VFile,
    VAddress,
    VTime
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      // type: [String, Number, Boolean],
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    },
    findIndex(list, array) {
      return list.findIndex(function (item) {
        return JSON.stringify(item) === JSON.stringify(array)
      })
    }
  }
}
</script>
