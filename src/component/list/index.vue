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
            {{ fixedSchema.properties[prop].title }}
            <v-base
              v-model="search[prop]"
              :schema="fixedSchema.properties[prop]"
            />
          </div>
          <el-button @click="setSearch()">
            重置
          </el-button>
        </template>
      </div>
      <div class="fm-list__operations">
        <v-add
          v-if="fixedSchema.add"
          :schema="fixedSchema"
          :list="list"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
        <v-multi-delete
          v-if="fixedSchema.multiDelete"
          :schema="fixedSchema"
          :list="list"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
      </div>
    </div>
    <div v-if="typeof fixedSchema.globalOperations==='function'" class="fm-list__global-operations">
      <component
        :is="component"
        v-for="(component,index) in fixedSchema.globalOperations()"
        :key="index"
        :schema="fixedSchema"
        :list="list"
        :selection="selection"
        :actions="actions"
      />
    </div>
    <el-table :data="list" v-bind="tableProps" v-on="tableEvents">
      <el-table-column v-if="fixedSchema.tableExpand" type="expand" v-bind="fixedSchema.tableExpand">
        <component
          :is="fixedSchema.tableExpand.slotComponent()"
          slot-scope="scope"
          :slotscope="scope"
          :schema="fixedSchema"
          :list="list"
          :index="scope.$index"
          :row="scope.row"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
      </el-table-column>
      <el-table-column v-if="fixedSchema.tableSelection" type="selection" v-bind="fixedSchema.tableSelection" />
      <el-table-column v-if="fixedSchema.tableIndex" type="index" v-bind="fixedSchema.tableIndex" />
      <template v-for="(propSchema,prop) in fixedSchema.properties">
        <el-table-column
          v-if="propSchema.showInTable===undefined||propSchema.showInTable"
          :key="prop"
          :label="propSchema.title"
          v-bind="propSchema.tableColumn||{}"
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
        v-if="fixedSchema.edit||fixedSchema.delete||typeof fixedSchema.rowOperations==='function'"
        align="center"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <v-edit
            v-if="fixedSchema.edit&&(scope.row.showEdit===undefined||!!scope.row.showEdit)"
            :schema="fixedSchema"
            :list="list"
            :index="scope.$index"
            :row="scope.row"
            :search="search"
            :selection="selection"
            :actions="actions"
          />
          <v-delete
            v-if="fixedSchema.delete&&(scope.row.showDelete===undefined||!!scope.row.showDelete)"
            :schema="fixedSchema"
            :list="list"
            :index="scope.$index"
            :row="scope.row"
            :search="search"
            :selection="selection"
            :actions="actions"
          />
          <template v-if="typeof fixedSchema.rowOperations==='function'">
            <component
              :is="component"
              v-for="(component,index) in fixedSchema.rowOperations()"
              :key="index"
              :schema="fixedSchema"
              :list="list"
              :index="scope.$index"
              :row="scope.row"
              :search="search"
              :selection="selection"
              :actions="actions"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="fixedSchema.pagination&&total"
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
    padding: 10px 0;
  }

  &__search {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      display: flex;
      align-items: center;
      margin: 5px 15px 5px 0;

      > .fm-base__root {
        margin-left: 6px;
      }
    }
  }

  &__operations {
    display: flex;
    align-items: center;
    margin-left: 30px;

    > * {
      margin: 5px 0 5px 10px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  &__global-operations {
    flex: none;
    margin-bottom: 15px;
  }
}
</style>

<script>
import axios from '../../util/axios'
import { debounce, cloneDeepWith } from 'lodash-es'
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
      required: true
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      pageSize: 15,
      search: {}, // 查询条件
      selection: [], // 选中的行数据
      actions: {
        setSearch: this.setSearch,
        query: this.query
      }
    }
  },
  computed: {
    fixedSchema () {
      return cloneDeepWith(this.schema, (value) => {
        // 绑定所有方法的this为组件实例
        if (typeof value === 'function') {
          return value.bind(this)
        }
      })
    },
    // 主属性
    primary () {
      const primary = Object.keys(this.fixedSchema.properties).find(prop => {
        return this.fixedSchema.properties[prop].primary
      })

      if (primary === undefined) {
        throw new Error('List组件的properties中必须要存在唯一的primary属性')
      }

      return primary
    },
    searchProps () {
      return Object.keys(this.fixedSchema.properties).filter(prop => {
        return this.fixedSchema.properties[prop].showInSearch
      })
    },
    tableProps () {
      return {
        height: 'auto',
        // 默认以主键为行key
        'row-key': this.primary,
        ...this.fixedSchema.table
      }
    },
    tableEvents () {
      const events = { ...this.fixedSchema.tableEvents }

      events['selection-change'] = (...args) => {
        this.onSelectionChange(...args)

        if (typeof events['selection-change'] === 'function') {
          events['selection-change']()
        }
      }

      return events
    }
  },
  watch: {
    search: {
      deep: true,
      handler: 'query'
    }
  },
  created () {
    this.setSearch()
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
      search = this.fixedSchema.pagination ? { page: 1 } : {}
      this.searchProps.forEach(prop => {
        search[prop] = this.fixedSchema.properties[prop].default
      })
      this.search = search
    },
    query: debounce(async function () {
      const params = {}

      Object.keys(this.search).forEach(prop => {
        if (this.search[prop] !== undefined) {
          params[prop] = this.search[prop]
        }
      })

      this.fixedSchema.query(params, axios, ({ total, page, pageSize, list }) => {
        this.list = list

        if (this.fixedSchema.pagination) {
          this.total = total
          this.search.page = page
          this.pageSize = pageSize
        }
      })
    }, 400),
    onSelectionChange (selection) {
      this.selection = selection
    }
  }
}
</script>
