<template>
  <el-form-item class="fmgen-item__root" label="活动名称">
    <component :is="component"></component>
    <el-button type="danger" icon="el-icon-delete"></el-button>
  </el-form-item>
</template>

<style lang="less">
@name: el-form-item;

.fmgen-item__root {
  &.@{name} {
    cursor: move;
    border: 1px dashed transparent;

    &:hover {
      border-color: #409eff;

      > .@{name}__content {
        > .el-button:last-child {
          display: block;
        }
      }
    }

    > .@{name}__content {
      padding-bottom: 24px;

      > .el-button:last-child {
        display: none;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 5px 10px;
        border-radius: 0;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    component () {
      switch (this.name) {
        case 'input':
        case 'textarea':
          return 'el-input'
        case 'color':
          return 'el-color-picker'
      }

      return 'el-input'
    }
  }
}
</script>
