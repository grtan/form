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
    <el-table :data="list" v-bind="tableConfig" @selection-change="onSelectionChange">
      <el-table-column v-if="schema.tableExpand" type="expand" v-bind="schema.tableExpand">
        <component
          :is="schema.tableExpand.slotComponent()"
          slot-scope="scope"
          :slotscope="scope"
          :schema="schema"
          :list="list"
          :index="scope.$index"
          :row="scope.row"
          :search="search"
          :selection="selection"
          :actions="actions"
        />
      </el-table-column>
      <el-table-column v-if="schema.tableSelection" type="selection" v-bind="schema.tableSelection" />
      <el-table-column v-if="schema.tableIndex" type="index" v-bind="schema.tableIndex" />
      <template v-for="(propSchema,prop) in schema.properties">
        <el-table-column
          v-if="propSchema.showInTable===undefined||!!propSchema.showInTable"
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
        v-if="schema.edit||schema.delete||typeof schema.rowOperations==='function'"
        align="center"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <v-edit
            v-if="schema.edit&&(scope.row.showEdit===undefined||!!scope.row.showEdit)"
            :schema="schema"
            :list="list"
            :index="scope.$index"
            :row="scope.row"
            :search="search"
            :selection="selection"
            :actions="actions"
          />
          <v-delete
            v-if="schema.delete&&(scope.row.showDelete===undefined||!!scope.row.showDelete)"
            :schema="schema"
            :list="list"
            :index="scope.$index"
            :row="scope.row"
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
      required: true
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
    },
    tableConfig () {
      return {
        ...{
          height: 'auto'
        },
        ...this.schema.table
      }
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
