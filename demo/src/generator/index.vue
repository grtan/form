<template>
  <div :class="$style.root">
    <div :class="$style.components">
      <div :class="$style.component" v-for="({name,description}) in components" :key="name" @drag>
        <div>{{name}}</div>
        <div>{{description}}</div>
      </div>
    </div>
    <div :class="$style.content"></div>
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
}
</style>

<script>
import { components } from './data'

export default {
  data () {
    return {
      components
    }
  }
}
</script>
