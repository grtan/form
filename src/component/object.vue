<template>
  <div class="fm-object__root">
    <!-- 这里用schema.properties来迭代，是为了保证隐藏再显示后属性的顺序仍然一致 -->
    <template v-for="(propSchema, prop) in schema.properties">
      <!-- eslint-disable vue/no-mutating-props -->
      <v-item
        v-if="value.hasOwnProperty(prop)"
        ref="properties"
        :key="prop"
        v-model="value[prop]"
        :schema="propSchema"
        :required="
          (schema.required && schema.required.includes(prop)) || (propSchema.type === 'array' && !!propSchema.minItems)
        "
        :path="`${path}['${prop}']`"
        @validate="$emit('validate', prop, $event)"
        @destroy="$emit('destroy', prop)"
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
    },
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    validate() {
      // 校验整个表单
      ;(this.$refs.properties || []).forEach(function (item) {
        item.validate()
      })
    }
  }
}
</script>
