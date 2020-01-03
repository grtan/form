<template>
  <div :class="$style.root">
    <div :class="$style.main">
      <div ref="schema"></div>
      <div :class="$style.form">
        <div :class="$style.error" v-if="syntaxError">{{syntaxError}}</div>
        <vc-form v-else-if="schema" :key="key" :schema="schema" :submit="submit"></vc-form>
      </div>
    </div>
    <el-dialog title="表单数据" :visible.sync="showDialog">
      <div :class="$style.data" ref="data"></div>
    </el-dialog>
  </div>
</template>

<style lang="less" module>
.main {
  display: flex;
  height: 98vh;
  min-height: 700px;

  > div {
    flex: 1 1 50%;

    &:first-child {
      margin-right: 10px;
    }
  }
}

.form {
  overflow: auto;
}

.error {
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  color: red;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.8);
}

.data {
  min-height: 600px;
}
</style>

<script>
import * as monaco from 'monaco-editor'
import { debounce } from 'lodash-es'
import VcForm from 'vcform'

const schemaCode = (function () {
  const schema = {
    title: '根对象',
    type: 'object',
    required: ['key1', 'key5', 'key2', 'key3', 'key6'],
    properties: {
      key1: {
        title: '文本',
        type: 'string',
        component: 'textarea'
      },
      key2: {
        title: '数字',
        type: 'number',
        minimum: 1,
        maximum: 10,
        multipleOf: 0.5,
        default: 2.5
      },
      key3: {
        title: '图片',
        type: 'string',
        format: 'image',
        action: 'http://api.vivo.xyz/mockApi/vui/api/upload/file',
        urlFetcher () {
          return 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578054693268&di=76991714b98ae8866142f8342d6111b2&imgtype=0&src=http%3A%2F%2Ft8.baidu.com%2Fit%2Fu%3D1484500186%2C1503043093%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D1280%26h%3D853'
        },
        default: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576136084529&di=37b8b46b168f948468896739d0bd08a1&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fdc54564e9258d1092f7663c9db58ccbf6c814d30.jpg',
        hidden: 'data.key2===2'
      },
      key5: {
        title: '时间',
        type: 'range',
        format: 'datetime',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      },
      key6: {
        title: '地址',
        type: 'address'
      },
      key4: {
        title: '数组',
        type: 'array',
        minItems: 2,
        maxItems: 4,
        items: {
          title: '对象',
          type: 'object',
          required: ['key1', 'key4'],
          properties: {
            key1: {
              title: '文本',
              type: 'string',
              minLength: 5,
              maxLength: 10,
              default: 'text',
              hidden: 'data.key2===3'
            },
            key3: {
              title: '数字',
              type: 'number',
              minimum: 3,
              maximum: 7,
              default: 6
            },
            key4: {
              title: '布尔值',
              type: 'boolean',
              default: true,
              readonly: true,
              hidden: 'data.key4[0].key3===3'
            }
          }
        }
      }
    }
  }
  const fns = []
  const mark = '--:function:--'
  const value = JSON.stringify(schema, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value.toString())

      return mark
    }

    return value
  }, '\t').replace(new RegExp(`"${mark}"`, 'g'), function () {
    return fns.pop()
  })

  return `module.exports = ${value}`
}())

export default {
  name: 'home',
  components: {
    VcForm
  },
  data () {
    return {
      schemaCode: schemaCode,
      schema: undefined,
      showDialog: false,
      key: 0,
      syntaxError: ''
    }
  },
  watch: {
    schemaCode: {
      immediate: true,
      handler () {
        const module = {}
        let fn

        try {
          // eslint-disable-next-line no-new-func
          fn = new Function('module', this.schemaCode)
        } catch (e) {
          this.syntaxError = e.stack || e.message

          return
        }

        fn(module)
        this.key++
        this.schema = module.exports
      }
    }
  },
  methods: {
    submit (data) {
      this.showDialog = true
      this.$nextTick(function () {
        if (!this.dataEditor) {
          this.dataEditor = monaco.editor.create(this.$refs.data, {
            language: 'json',
            theme: 'vs-dark',
            readOnly: true,
            minimap: {
              enabled: false
            }
          })
        }

        this.dataEditor.setValue(JSON.stringify(data, null, '\t'))
      })
    }
  },
  mounted () {
    this.schemaEditor = monaco.editor.create(this.$refs.schema, {
      // value: value.replace(/[^\\]"(function(?= |\()[^"]+)"/g, ' $1').replace(/\\n/g, '\n'),
      value: this.schemaCode,
      language: 'javascript',
      theme: 'vs-dark',
      formatOnPaste: true,
      formatOnType: true,
      minimap: {
        enabled: false
      }
    })
    // 必须要延迟一段时间，否则错误无法及时获取
    this.schemaEditor.onDidChangeModelContent(debounce(() => {
      const model = this.schemaEditor.getModel()
      const markers = monaco.editor.getModelMarkers({
        owner: model.getModeId(),
        resource: model.uri
      })
      const errorMarker = markers.find((marker) => {
        return marker.severity === monaco.MarkerSeverity.Error
      })

      if (errorMarker) {
        this.syntaxError = `SyntaxError: ${errorMarker.message} at ${errorMarker.startLineNumber}:${errorMarker.startColumn}`
        return
      }

      this.syntaxError = ''
      this.schemaCode = this.schemaEditor.getValue()
    }, 1000))

    // setTimeout(() => {
    //   this.schemaEditor.trigger('', 'editor.action.formatDocument')
    // this.schemaEditor.getAction('editor.action.format').run()
    // }, 1000)
  }
}
</script>
