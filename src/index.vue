<template>
  <div class="fm__root">
    <v-item
      ref="form"
      v-model="value"
      class="fm__body"
      :schema="schema"
      :label-width="labelWidth"
    />
    <div class="fm__footer">
      <el-button
        type="primary"
        @click="onConfirm"
      >
        确定
      </el-button>
      <el-button
        type="warning"
        @click="setValue(defaultValue)"
      >
        重置
      </el-button>
    </div>
  </div>
</template>

<style lang="less">
.fm {
  &__body {
    text-align: left;
  }

  &__footer {
    margin-top: 20px;
    text-align: center;

    .el-button + .el-button {
      margin-left: 30px;
    }
  }
}
</style>

<script>
import VItem from './component/item'

export default {
  name: 'VCForm',
  components: {
    VItem
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    submit: {
      required: true,
      type: Function
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    defaultValue: {
      type: [String, Number, Boolean, Object, Array],
      default: undefined
    }
  },
  data () {
    return {
      value: undefined
    }
  },
  watch: {
    defaultValue: {
      deep: true,
      immediate: true,
      handler (value) {
        this.setValue(value, !!this.inited)
        this.inited = true
      }
    }
  },
  methods: {
    setValue (value, validate = true) {
      this.value = value === undefined ? undefined : JSON.parse(JSON.stringify(value))
      // 重置时有些字段还是初始值没有进行编辑，无法触发自动校验，只能手动进行校验
      validate && this.$nextTick(function () {
        this.$refs.form.validate()
      })
    },
    onConfirm () {
      this.$refs.form.validate((valid, detail) => {
        // this.value为undefined时JSON.parse会报错
        valid && this.submit(this.value && JSON.parse(JSON.stringify(this.value)))
      })
    }
  }
}
</script>
