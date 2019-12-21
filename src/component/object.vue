<template>
  <div class="fm-object__root">
    <!-- 这里用schema.properties来迭代，是为了保证隐藏再显示后属性的顺序仍然一致 -->
    <template v-for="(propSchema,prop) in schema.properties">
      <v-item
        v-if="value.hasOwnProperty(prop)"
        v-model="value[prop]"
        ref="properties"
        :key="prop"
        :schema="propSchema"
        :required="schema.required&&schema.required.includes(prop)||propSchema.type==='array'&&!!propSchema.minItems"
        @validate="$emit('validate',prop,$event)"
        @destroy="$emit('destroy',prop)"
      ></v-item>
    </template>
  </div>
</template>

<script>
import VItem from './item'

export default {
  components: {
    VItem(resolve) {
      resolve(VItem)
    }
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Object
    }
  },
  methods: {
    validate() { // 校验整个表单
      ; (this.$refs.properties || []).forEach(function (item) {
        item.validate()
      })
    }
  }
}
</script>
