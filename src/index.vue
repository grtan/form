<template>
  <div class="fm__root">
    <v-item ref="form" class="fm__body" :schema="schema" :label-width="labelWidth" v-model="value"></v-item>
    <div class="fm__footer">
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="warning" @click="onReset">重置</el-button>
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
      type: Number
    }
  },
  data() {
    return {
      value: undefined
    }
  },
  methods: {
    onConfirm() {
      this.$refs.form.validate((valid, detail) => {
        valid && this.submit(JSON.parse(JSON.stringify(this.value)))
      })
    },
    onReset() {
      this.value = undefined
    }
  }
}
</script>
