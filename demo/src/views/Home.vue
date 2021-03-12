<template>
  <div :class="$style.root">
    <div :class="$style.main">
      <div ref="code"></div>
      <div :class="$style.form">
        <div :class="$style.error" v-if="syntaxError">{{syntaxError}}</div>
        <vc-form
          v-else-if="config"
          :key="key"
          :label-width="config.labelWidth"
          :schema="config.schema"
          :default-value="config.defaultValue"
          :submit="submit"
        ></vc-form>
      </div>
    </div>
    <el-dialog title="表单数据" :visible.sync="showDialog">
      <div :class="$style.data" ref="data"></div>
    </el-dialog>
  </div>
</template>

<style lang="less" module>
.root {
  :global(.my-address textarea) {
    background: #51a528;
  }
}

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
import { editor, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api'
import { debounce } from 'lodash-es'
// import VcForm from 'vcform'
import VcForm from '../../../src/index'

const monaco = { editor, MarkerSeverity }
const code = (function () {
  const code = {
    labelWidth: 100,
    schema: {
      title: '根对象',
      description: '整个表单',
      type: 'object',
      required: ['key1', 'key5', 'key2', 'key3', 'key6', 'key23'],
      properties: {
        key1: {
          title: '文本',
          type: 'string',
          component: 'textarea'
        },
        key2: {
          title: '比例',
          type: 'number',
          minimum: 1,
          maximum: 10,
          multipleOf: 0.5,
          default: 2.5
        },
        key33: {
          title: '颜色',
          description: 'showTip为true时显示更详细提示',
          type: 'string',
          format: 'color',
          enum: [{
            value: '#000000',
            showTip: true
          }, {
            value: '#ff0000',
            name: 'color 2',
            showTip: true
          }]
        },
        key31: {
          title: '颜色2',
          type: 'string',
          format: 'color',
          component: 'select',
          enum: [{
            value: '#000000'
          }, {
            value: '#ff0000',
            name: 'color 2'
          }, {
            value: '#00ff00',
            name: 'color 3',
            showTip: true
          }]
        },
        key34: {
          title: '文件',
          description: '第一个文件鼠标移上去可下载',
          type: 'string',
          format: 'file',
          enum: [{
            value: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/20200106/20200106152153951985_original.jpg',
            name: 'file 1',
            showTip: true,
            download: true
          }, {
            value: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/47/10000647_1554776920286_750x750.png',
            name: 'file 2',
            showTip: true
          }]
        },
        key3: {
          title: '图片',
          description: '当比例为2时隐藏',
          type: 'string',
          format: 'image',
          action: 'http://api.vivo.xyz/mockApi/vui/api/upload/file',
          urlFetcher () {
            return 'https://shopstatic.vivo.com.cn/vivoshop/commodity/99/10001399_1566458712423_750x750.png'
          },
          // default: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/20191216/20191216180402203875_original.jpg',
          hidden: 'data.key2===2'
        },
        key11: {
          title: '视频',
          description: '当比例为2时隐藏',
          type: 'string',
          format: 'image',
          progressWidth: 20,
          action: 'https://game-tfu.vivo.com.cn/upload?certMode=1',
          urlFetcher () {
            return 'https://shopstatic.vivo.com.cn/vivoshop/commodity/99/10001399_1566458712423_750x750.png'
          }
        },
        key23: {
          title: '文件',
          type: 'string',
          format: 'file',
          action: 'http://api.vivo.xyz/mockApi/vui/api/upload/file',
          urlFetcher () {
            return 'https://shopstatic.vivo.com.cn/vivoshop/commodity/00/4100_1534852336284hd_bi_750x750.png'
          }
          // default: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/90/10001790_1575449339508_750x750.png'
        },
        key5: {
          title: '时间',
          type: 'range',
          format: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        key55: {
          title: '月份',
          type: 'range',
          format: 'month',
          valueFormat: 'yyyy-MM'
        },
        key6: {
          title: '地址',
          description: '地址详情输入区使用了自定义样式',
          type: 'address',
          className: 'my-address'
        },
        key66: {
          title: 'excel',
          type: 'object',
          format: 'excel',
          required: ['person', 'ticket'],
          properties: {
            person: {
              type: 'array',
              minItems: 3,
              maxItems: 10,
              items: {
                type: 'object',
                required: ['name', 'id', 'age', 'birthday'],
                properties: {
                  name: {
                    type: 'string'
                  },
                  id: {
                    type: 'string'
                  },
                  age: {
                    type: 'number'
                  },
                  birthday: {
                    type: 'string'
                  }
                }
              }
            },
            ticket: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  address: {
                    type: 'string'
                  },
                  start: {
                    type: 'string'
                  },
                  end: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        key4: {
          title: '数组',
          description: '2-4项',
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
                description: '只读',
                type: 'boolean',
                default: true,
                readonly: true,
                hidden: 'data.key4[0].key3===3'
              }
            }
          }
        }
      }
    },
    defaultValue: {
      key1: 'asdsadff',
      key2: 2.5,
      key3: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/00/4100_1534852336284hd_bi_750x750.png',
      key23: 'https://shopstatic.vivo.com.cn/vivoshop/commodity/99/10001399_1566458712423_750x750.png',
      key5: [
        '2020-01-08 00:00:00',
        '2020-02-12 00:00:00'
      ],
      key6: [
        '河南省',
        '洛阳市',
        '汝阳县'
      ],
      key4: [
        {
          key1: 'text阿舒服',
          key3: 6,
          key4: true
        }
      ]
    }
  }
  const fns = []
  const mark = '----:function:----'
  const value = JSON.stringify(code, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value.toString())

      return mark
    }

    return value
  }, '\t').replace(new RegExp(`"${mark}"`, 'g'), function () {
    return fns.shift()
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
      code,
      config: undefined,
      showDialog: false,
      key: 0,
      syntaxError: ''
    }
  },
  watch: {
    code: {
      immediate: true,
      handler (value) {
        const module = {}
        let fn

        try {
          // eslint-disable-next-line no-new-func
          fn = new Function('module', value)
        } catch (e) {
          this.syntaxError = e.stack || e.message

          return
        }

        fn(module)
        this.key++
        this.config = module.exports
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
    this.codeEditor = monaco.editor.create(this.$refs.code, {
      value: this.code,
      language: 'javascript',
      theme: 'vs-dark',
      formatOnPaste: true,
      formatOnType: true,
      minimap: {
        enabled: false
      }
    })
    // 必须要延迟一段时间，否则错误无法及时获取
    this.codeEditor.onDidChangeModelContent(debounce(() => {
      const model = this.codeEditor.getModel()
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
      this.code = this.codeEditor.getValue()
    }, 1000))
  }
}
</script>
