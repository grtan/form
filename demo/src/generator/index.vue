<template>
  <div :class="$style.root">
    <div :class="$style.components">
      <div
        :class="$style.component"
        v-for="({name,description}) in components"
        :key="name"
        draggable="true"
        @dragstart="ondragstart($event,name)"
      >
        <div>{{name}}</div>
        <div>{{description}}</div>
      </div>
    </div>
    <el-form
      label-width="80px"
      @dragenter.native="ondragenter"
      @dragover.native="ondragover"
      @drop.native="ondrop"
    >
      <item v-for="(component,index) in items" :key="index" :name="component"></item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通用配置" name="first">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="审批人">
            <el-input v-model="formInline.user" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="formInline.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="组件配置" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="表单配置" name="third">角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="less" module>
.root {
  display: flex;

  .components {
    border: 1px solid;
    min-width: 150px;

    .component {
      margin: 10px;
      border: 1px solid;
      cursor: move;
    }
  }

  :global {
    .el-form {
      flex: auto;
      margin: 50px;
      border: 1px solid;
    }
  }
}
</style>

<script>
import { components } from './data'
import Item from './item'

export default {
  components: {
    Item
  },
  data () {
    return {
      components,
      items: []
    }
  },
  methods: {
    ondragstart (event, name) {
      event.dataTransfer.setData('component', name)
    },
    ondragenter (event) {
      event.preventDefault()
    },
    ondragover (event) {
      event.preventDefault()
    },
    ondrop (event) {
      event.preventDefault()
      this.items.push(event.dataTransfer.getData('component'))
    }
  }
}
</script>
