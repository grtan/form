<template>
  <div :class="$style.root">
    <div :class="$style.main">
      <div ref="code"></div>
      <div :class="$style.form">
        <div :class="$style.error" v-if="syntaxError">{{syntaxError}}</div>
        <vc-list
          v-else-if="schema"
          :key="key"
          :schema="schema"
        ></vc-list>
      </div>
    </div>
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
      flex: 0 1 35%;
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
import { List as VcList } from 'vcform'

const monaco = { editor, MarkerSeverity }
const code = (function () {
  const code = function () {
    var children = {}
    var data = {
      pageSize: 10,
      list: (function () {
        var list = []
        var hasChildren

        for (var i = 0; i < 33; i++) {
          hasChildren = Math.random() > 0.5

          if (hasChildren) {
            children['code' + i] = []
          }

          list.push({
            code: 'code' + i,
            name: '名称' + i,
            scene: '场景' + parseInt(Math.random() * 6),
            status: parseInt(Math.random() * 3),
            desc: '描述' + i,
            hasChildren
          })
        }

        return list
      }())
    }

    module.exports = {
      properties: {
        code: {
          title: '编码',
          type: 'string',
          primary: true,
          showInSearch: true,
          showInAdd: true,
          showInEdit: true
        },
        name: {
          title: '名称',
          type: 'string',
          showInSearch: true,
          showInAdd: true,
          showInEdit: true
        },
        scene: {
          title: '场景',
          type: 'string',
          showInAdd: true,
          showInEdit: true,
          enum: {
            properties: {
              code: {
                title: '编码',
                type: 'string',
                primary: true
              },
              name: {
                title: '名称',
                type: 'string'
              },
              desc: {
                title: '描述',
                type: 'string',
                component: 'textarea'
              }
            },
            query (search, axios, callback) {
              // eslint-disable-next-line standard/no-callback-literal
              callback({
                list: (function () {
                  var list = []

                  for (var i = 0; i < 6; i++) {
                    list.push({
                      code: 'code' + i,
                      name: '名称' + i,
                      desc: '描述' + i
                    })
                  }

                  return list
                }())
              })
            }
          }
        },
        status: {
          title: '状态',
          type: 'number',
          enum: [{
            name: '未上线',
            value: 0
          }, {
            name: '已上线',
            value: 1
          }, {
            name: '已删除',
            value: 2
          }],
          component: 'select',
          showInAdd: true,
          showInEdit: true
        },
        desc: {
          title: '描述',
          type: 'string',
          component: 'textarea',
          showInAdd: true,
          showInEdit: true
        }
      },
      pagination: true,
      selection: true,
      query (search, axios, callback) {
        const list = []

        data.list.forEach(function (item) {
          if (search.code && !item.code.includes(search.code)) {
            return
          }

          if (search.name && !item.name.includes(search.name)) {
            return
          }

          list.push(item)
        })

        // eslint-disable-next-line standard/no-callback-literal
        callback({
          total: list.length,
          page: search.page,
          pageSize: 10,
          list: list.slice(10 * (search.page - 1), 10 * search.page)
        })
      },
      add (value, axios, callback) {
        data.list.push(value)
        callback()
      },
      edit (value, axios, callback) {
        var index = data.list.findIndex(function (item) {
          return item.code === value.code
        })

        if (index !== -1) {
          data.list.splice(index, 1, value)
        } else {
          // 子级数据
          Object.keys(children).find(function (key) {
            index = children[key].findIndex(function (item) {
              return item.code === value.code
            })

            if (index !== -1) {
              children[key].splice(index, 1, value)
              return true
            }
          })
        }

        callback()
      },
      delete (value, axios, callback) {
        var index = data.list.findIndex(function (item) {
          return item.code === value.code
        })

        if (index !== -1) {
          data.list.splice(index, 1)
        } else {
          // 子级数据
          Object.keys(children).find(function (key) {
            index = children[key].findIndex(function (item) {
              return item.code === value.code
            })

            if (index !== -1) {
              console.log(key, index)
              children[key].splice(index, 1)
              return true
            }
          })
        }

        callback()
      },
      multiDelete (selection, axios, callback) {
        selection.forEach(function (value) {
          data.list.splice(data.list.findIndex(function (item) {
            return item.code === value.code
          }), 1)
        })
        callback()
      },
      table: {
        stripe: true,
        'row-key': 'code',
        lazy: true,
        load (tree, treeNode, resolve) {
          var len = 1 + Math.random() * 3

          for (let i = 0; i < len; i++) {
            children[tree.code].push({
              code: tree.code + '-' + i,
              name: '名称' + i,
              scene: '场景' + parseInt(Math.random() * 6),
              status: parseInt(Math.random() * 3),
              desc: '描述' + i,
              showEdit: Math.random() > 0.5,
              showDelete: Math.random() > 0.5
            })
          }

          setTimeout(function () {
            resolve(children[tree.code])
          }, 1000)
        }
      }
    }
  }
  var fn = code.toString()

  return fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}'))
}())

export default {
  name: 'list',
  components: {
    VcList
  },
  data () {
    return {
      code,
      schema: undefined,
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
        this.schema = module.exports
      }
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
