<template>
  <div :class="$style.root">
    <!-- 这里用schema.properties来迭代，是为了保证属性的顺序一致 -->
    <template v-for="(propSchema,prop) in schema.properties">
      <v-item
        v-if="value.hasOwnProperty(prop)"
        v-model="value[prop]"
        ref="item"
        :key="prop"
        :schema="propSchema"
        :required="schema.required&&schema.required.includes(prop)||propSchema.type==='array'&&!!propSchema.minItems"
        :root-value="rootValue"
        @validate="onValidate(prop,$event)"
      ></v-item>
    </template>
  </div>
</template>

<script>
import VItem from './item'

export default {
  components: {
    VItem
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Array
    },
    rootValue: { // 整个表单的值
      required: true
    }
  },
  data() {
    return {
      data
    }
  },
  methods: {
    onValidate(prop, result) {
      this.$set(this.validateResult.properties, prop, result)
    },
  }
}
</script>
