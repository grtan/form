<template>
  <div class="fm-list__root">
    <div class="fm-list__header">
      <div class="fm-list__search">
        <template v-if="searchProps.length">
          <div
            v-for="prop in searchProps"
            :key="prop"
            class="fm-list__search-item"
          >
            {{ schema.properties[prop].title }}
            <v-base
              v-model="search[prop]"
              :schema="schema.properties[prop]"
            />
          </div>
          <el-button icon="el-icon-search" @click="query">
            查询
          </el-button>
          <el-button @click="setSearch(),query()">
            重置
          </el-button>
        </template>
      </div>
      <div class="fm-list__operations">
        <v-add
          v-if="schema.add"
          :schema="schema"
          :list="list"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
        <v-multi-delete
          v-if="schema.multiDelete"
          :schema="schema"
          :list="list"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
      </div>
    </div>
    <div v-if="typeof schema.globalOperations==='function'" class="fm-list__global-operations">
      <component
        :is="component"
        v-for="(component,index) in schema.globalOperations()"
        :key="index"
        :schema="schema"
        :list="list"
        :selection="selection"
        :actions="actions"
      />
    </div>
    <el-table :data="list" height="auto" @selection-change="onSelectionChange">
      <el-table-column v-if="schema.selection" type="selection" align="center" />
      <template v-for="(propSchema,prop) in schema.properties">
        <el-table-column
          v-if="propSchema.showInTable===undefined||!!propSchema.showInTable"
          :key="prop"
          align="center"
          :label="propSchema.title"
        >
          <component
            :is="propSchema.displayComponent()"
            v-if="typeof propSchema.displayComponent==='function'"
            slot-scope="scope"
            :schema="propSchema"
            :value="scope.row[prop]"
          />
          <v-display v-else slot-scope="scope" :schema="propSchema" :value="scope.row[prop]" />
        </el-table-column>
      </template>
      <el-table-column
        v-if="schema.edit||schema.delete||typeof schema.rowOperations==='function'"
        align="center"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <v-edit
            v-if="schema.edit"
            :schema="schema"
            :list="list"
            :index="scope.$index"
            :search="search"
            :selection="selection"
            :actions="actions"
          />
          <v-delete
            v-if="schema.delete"
            :schema="schema"
            :list="list"
            :index="scope.$index"
            :search="search"
            :selection="selection"
            :actions="actions"
          />
          <template v-if="typeof schema.rowOperations==='function'">
            <component
              :is="component"
              v-for="(component,index) in schema.rowOperations()"
              :key="index"
              :schema="schema"
              :list="list"
              :index="scope.$index"
              :search="search"
              :selection="selection"
              :actions="actions"
            />
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="typeof schema.expand==='function'" type="expand">
        <component
          :is="schema.expand()"
          slot-scope="props"
          :slotscope="props"
          :schema="schema"
          :list="list"
          :index="scope.$index"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="schema.pagination&&total"
      :current-page.sync="search.page"
      :total="total"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
    />
  </div>
</template>

<style lang="less">
.fm-list {
  &__root {
    display: flex;
    flex-direction: column;
    height: 100%;

    > .el-table {
      > .el-table__fixed-right {
        > .el-table__fixed-body-wrapper {
          > table {
            > tbody {
              > tr {
                > td:last-child {
                  > .cell {
                    > *:not(:first-child) {
                      margin-left: 8px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    > .el-pagination {
      flex: none;
      padding: 15px 0;
      text-align: center;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex: none;
    padding: 15px 0;
  }

  &__search {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      display: flex;
      align-items: center;
      margin-right: 20px;

      > .fm-base__root {
        margin-left: 6px;
      }
    }
  }

  &__operations {
    flex: none;
    margin-left: 30px;

    > * {
      margin-left: 10px;
    }
  }

  &__global-operations {
    flex: none;
    margin-bottom: 15px;
  }
}
</style>

<script>
import axios from 'axios'
import VBase from '../base'
import VDisplay from './display'
import VAdd from './add'
import VEdit from './edit'
import VDelete from './delete'
import VMultiDelete from './multi-delete'

export default {
  components: {
    VBase (resolve) {
      resolve(VBase)
    },
    VDisplay,
    VAdd,
    VEdit,
    VDelete,
    VMultiDelete
  },
  props: {
    schema: {
      type: Object,
      default () {
        return {
          properties: {
            a: {
              title: '图片',
              type: 'string',
              format: 'image',
              primary: true,
              showInTable: true, // 默认为true
              showInAdd: true,
              showInEdit: true
            },
            b: {
              title: '视频',
              type: 'string',
              format: 'video'
            },
            c: {
              title: '颜色',
              type: 'string',
              format: 'color',
              showInAdd: true,
              showInEdit: true
            },
            d: {
              title: '文件',
              type: 'string',
              format: 'file'
            },
            f: {
              title: '日期',
              type: 'string',
              format: 'datetime',
              showInSearch: true
            },
            g: {
              title: '普通字符串',
              type: 'string',
              showInSearch: true,
              enum: [{
                value: '值1'
              }, {
                value: '值2'
              }, {
                value: '值3',
                default: true
              }],
              component: 'select'
            },
            h: {
              title: '布尔值',
              type: 'boolean',
              displayComponent () {
                return VDisplay
              }
            },
            i: {
              title: '地址',
              type: 'address'
            },
            j: {
              title: '日期范围',
              type: 'range'
            }
          },
          selection: true, // 是否可以选择行
          pagination: true, // 是否需要分页
          query ({ a, b, page }, axios, callback) {
            // eslint-disable-next-line standard/no-callback-literal
            callback({
              total: 100,
              page: 1,
              pageSize: 15,
              list: [{
                a: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                b: 'https://wwwstatic.vivo.com.cn/vivoportal/files/resource/product/1591943782550/images/x50pro-night-video.mp4',
                c: '#333333'
              }, {
                a: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                b: 'https://wwwstatic.vivo.com.cn/vivoportal/files/resource/product/1591943782550/images/x50pro-night-video.mp4',
                d: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                h: true,
                i: ['浙江省', '杭州市', '余杭区', '奥克斯创智1号']
              }, {
                a: 'xxx',
                b: 'xx',
                f: '2020-01-08 00:00:26',
                g: '撒大噶说噶傻大个',
                h: false,
                j: ['2019-12-12 11:30:45', '2019-12-22 11:30:45']
              }]
            })
          },
          /**
           * 字符串表示按规范执行的请求url
           * 函数表示自定义处理
           * 没有该字段表示没有新增按钮
           */
          add (value, axios, next) {
            next()
          },
          edit (value, axios, next) {
            next()
          },
          delete (value, axios, next) {
            next()
          },
          // multiDelete (selection, axios, next) {
          //   axios.request({
          //     url: 'http://portal-service-dev.vmic.xyz/api/problem'
          //   }).then((data) => {
          //     console.log(data)
          //     next()
          //   })
          // },
          multiDelete: 'http://portal-service-dev.vmic.xyz/api/problem',
          // 全局操作组件
          globalOperations () {
            return [VMultiDelete]
          },
          // 行操作组件
          rowOperations () {
            return []
          }
          // 展开行
          // expand () {

          // }
        }
      }
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      pageSize: 15,
      search: {},
      selection: [],
      actions: {
        setSearch: this.setSearch,
        query: this.query
      }
    }
  },
  computed: {
    searchProps () {
      return Object.keys(this.schema.properties).filter(prop => {
        return this.schema.properties[prop].showInSearch
      })
    }
  },
  watch: {
    'search.page': 'query'
  },
  created () {
    this.setSearch()
    this.query()
  },
  methods: {
    setSearch (search) {
      if (search) {
        this.search = {
          ...this.search,
          ...search
        }
        return
      }

      // 重置搜索条件
      search = this.schema.pagination ? { page: 1 } : {}
      this.searchProps.forEach(prop => {
        if (this.schema.properties[prop].default !== undefined) {
          search[prop] = this.schema.properties[prop].default
        }
      })
      this.search = search
    },
    async query () {
      const params = {}

      Object.keys(this.search).forEach(prop => {
        if (this.search[prop] !== undefined) {
          params[prop] = this.search[prop]
        }
      })

      this.schema.query(params, axios, ({ total, page, pageSize, list }) => {
        this.list = list

        if (this.schema.pagination) {
          this.total = total
          this.search.page = page
          this.pageSize = pageSize
        }
      })
    },
    onSelectionChange (selection) {
      this.selection = selection
    }
  }
}
</script>
