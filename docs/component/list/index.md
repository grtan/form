# List 组件（v0.2.0+）

> List 组件是后台管理页面常见的 crud 列表组件，同时该组件又可以作为 Form 表单组件的某个表单项的数据选择列表，形式如下

<div align="center">
  <img src="./preview.png" height="400">
</div>

- 区域 1：条件查询区域
- 区域 2：新增、批量删除按钮区域
- 区域 3：有时候可能需要自定义一些针对整个列表数据进行处理的操作，这个自定义的操作组件就显示在该区域中
- 区域 4：该区域显示一些针对单行数据进行处理的组件，用户也可以自定义处理组件
- 区域 5：批量选择区域
- 区域 6：有时候数据很多时需要进行分页，该区域显示分页组件

## [playground](http://vui.vivo.xyz:9002/#/list)

## 用法

```html
<template>
  <vc-list :schema="schema" />
</template>

<script>
  import { List as VcList } from 'vcform'

  export default {
    components: {
      VcList
    },
    data() {
      return {
        schema: {
          properties: {
            code: {
              title: '编码',
              type: 'string',
              primary: true,
              showInSearch: true,
              showInAdd: true,
              showInEdit: true,
              tableColumn: {
                align: 'center'
              }
            },
            name: {
              title: '名称',
              type: 'string',
              showInSearch: true,
              showInAdd: true,
              showInEdit: true,
              tableColumn: {
                align: 'center'
              }
            },
            desc: {
              title: '描述',
              type: 'string',
              component: 'textarea',
              showInAdd: true,
              showInEdit: true,
              tableColumn: {
                align: 'center'
              }
            }
          },
          pagination: true,
          table: {
            stripe: true
          },
          tableSelection: {
            align: 'center'
          },
          tableIndex: {
            align: 'center'
          },
          query(search, axios, callback) {
            xxx
          },
          add(value, axios, callback) {
            xx
          },
          edit(value, axios, callback) {
            xxx
          },
          delete(value, axios, callback) {
            xx
          },
          multiDelete(selection, axios, callback) {
            xx
          }
        }
      }
    }
  }
</script>
```

## schema

`List`组件接受一个`schema`属性，用来进行一些配置。schema 是一个对象，各属性配置如下

|                    名称                    |    类型    | 必填 | 默认值  |                                                                                                                                                                                                                                                                                                     描述                                                                                                                                                                                                                                                                                                      |
| :----------------------------------------: | :--------: | :--: | :-----: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                 properties                 |  `Object`  | `Y`  |   `-`   |                                                                                                                                                                                                                                                             列表元素数据的各属性描述 schema，与 Form 表单各字段的[schema](../../schema.md)一致。                                                                                                                                                                                                                                                              |
|           properties.xx.primary            | `Boolean`  | `Y`  | `false` |                                                                                                                                                                                                                     表示 xx 属性是主键，在`properties`的所有属性中**必须有且只有一个**属性为 primary 属性。当 List 组件作为 Form 组件表单项的选择列表时，会以 primary 属性作为表单项的值                                                                                                                                                                                                                      |
|         properties.xx.showInSearch         | `Boolean`  | `N`  | `false` |                                                                                                                                                                                                                                     表示列表元素数据的 xx 属性是否为查询条件，为`true`时该属性会显示在查询区域中，如果有输入值，其值会携带在`query`方法的 `search`参数中                                                                                                                                                                                                                                      |
|         properties.xx.showInTable          | `Boolean`  | `N`  | `true`  |                                                                                                                                                                                                                                                                                  表示列表元素数据的 xx 属性是否在表格中显示                                                                                                                                                                                                                                                                                   |
|          properties.xx.showInAdd           | `Boolean`  | `N`  | `false` |                                                                                                                                                                                                                                                                           表示列表元素数据的 xx 属性是否在默认新增界面的表单中显示                                                                                                                                                                                                                                                                            |
| properties.xx.requiredInAdd **(v1.1.0+)**  | `Boolean`  | `N`  | `true`  |                                                                                                                                                                                                                                                                       表示列表元素数据的 xx 属性在默认新增界面的表单中显示时，是否必填                                                                                                                                                                                                                                                                        |
|          properties.xx.showInEdit          | `Boolean`  | `N`  | `false` |                                                                                                                                                                                                                                                                           表示列表元素数据的 xx 属性是否在默认编辑界面的表单中显示                                                                                                                                                                                                                                                                            |
| properties.xx.requiredInEdit **(v1.1.0+)** | `Boolean`  | `N`  | `true`  |                                                                                                                                                                                                                                                                       表示列表元素数据的 xx 属性在默认编辑界面的表单中显示时，是否必填                                                                                                                                                                                                                                                                        |
| properties.xx.showInFormItem **(v0.2.1+)** | `Boolean`  | `N`  | `false` |                                                                                                                                                                                 表示当 List 组件作为 Form 组件表单项的选择列表时，选择某项数据后，xx 属性是否在表单项中显示。当属性是 primary 属性时，默认值为 true。如果有多个属性设置为 true，则选择某项数据后，在表单项中会以表格形式展示选择的数据项，否则以常规方式显示                                                                                                                                                                                  |
|       properties.xx.displayComponent       | `Function` | `N`  |   `-`   |                                                                                                                                                                                                                  自定义列表元素数据的 xx 属性在表格单元格中的显示，该函数返回 vue 组件对象。该组件接受`schema`、`value`两个 prop，schema 表示 xx 属性的 schema 规范，value 表示 xx 属性的值                                                                                                                                                                                                                   |
|         properties.xx.tableColumn          |  `Object`  | `N`  |   `-`   |                                                                                                                                                                                                      element-ui 的[table-column 属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)，支持除了`type`、`index`、`label`、`prop`、`selectable`、`reserve-selection`外的所有属性                                                                                                                                                                                                      |
|                   table                    |  `Object`  | `N`  |   `-`   |                                                                                                                                                                                                                                            element-ui 的[table 属性](https://element.eleme.io/#/zh-CN/component/table#table-attributes)，支持除了`data`的所有属性                                                                                                                                                                                                                                             |
|               tableSelection               |  `Object`  | `N`  |   `-`   |                                                                                                                                                                   是否开启批量选择，默认不开启。支持[table-column 属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`selectable`、`reserve-selection`、`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`                                                                                                                                                                   |
|                 tableIndex                 |  `Object`  | `N`  |   `-`   |                                                                                                                                                                                 是否开启索引列，默认不开启。支持[table-column 属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`index`、`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`                                                                                                                                                                                 |
|                tableExpand                 |  `Object`  | `N`  |   `-`   |                                                                                                                                    是否开启[展开行](https://element.eleme.io/#/zh-CN/component/table#zhan-kai-xing)，默认不开启。支持[table-column 属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`，还支持`slotComponent`属性，如下                                                                                                                                    |
|         tableExpand.slotComponent          | `Function` | `Y`  |   `-`   |                                                                                                                                                                                                                                        返回自定义的展开行组件，该组件接受的 props 与 rowOperations 组件一致，另外还接受 slotscope 属性，格式为{ row, column, $index }                                                                                                                                                                                                                                         |
|         tableEvents **(v0.2.1+)**          |  `Object`  | `N`  |   `-`   |                                                                                                                                                                                                                            element-ui 的[table 事件](https://element.eleme.cn/#/zh-CN/component/table#table-events)处理函数对象，如`{'row-click': function(row, column, event){}}`                                                                                                                                                                                                                            |
|                 pagination                 | `Boolean`  | `N`  | `false` |                                                                                                                                                                                                                                                                                                   是否分页                                                                                                                                                                                                                                                                                                    |
|                   query                    | `Function` | `Y`  |   `-`   | 查询数据的函数，该函数接受参数为(search,axios,callback)。search 为查询条件对象，如{id:xx,code:xx,page:1}。**（当 List 组件作为 Form 组件表单项的选择列表时，该查询函数必须要实现 search 中只存在 primary 属性时的查询处理，此时传给 callback 方法的参数的 list 字段为只有一个元素的数组）**；axios 为 axios 对象，可以直接使用该对象进行 ajax 请求；callback 为数据回调函数，形式为 callback(data)，请求成功后需要将数据传入该回调函数。data 格式为{total,page,pageSize,list}，total 为总页数，page 为当前页码，pageSize 为一页显示多少数据，list 为实际数据列表，当不需要分页时 total、page、pageSize 可不填 |
|                    add                     | `Function` | `N`  |   `-`   |                                                                                                                                      新增数据的函数，不填时表示不显示默认的新增按钮。该函数接受参数为(value,axios,callback)。value 为新增的数据对象，如{id:xx,name:xx,project:xx}；axios 为 axios 对象，可以直接使用该对象进行 ajax 请求；callback 为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`或者`callback(new Error('xxxx'))` **(v1.0.2+)**                                                                                                                                      |
|                    edit                    | `Function` | `N`  |   `-`   |                                                                                                                                      编辑数据的函数，不填时表示不显示默认的行编辑按钮。该函数接受参数为(value,axios,callback)。value 为编辑后的行数据对象，如{name:xx,project:xx}；axios 为 axios 对象，可以直接使用该对象进行 ajax 请求；callback 为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`或者`callback(new Error('xxxx'))` **(v1.0.2+)**                                                                                                                                      |
|                   delete                   | `Function` | `N`  |   `-`   |                                                                                                                                   删除数据的函数，不填时表示不显示默认的行删除按钮。该函数接受参数为(value,axios,callback)。value 为要删除的行数据对象，如{id:xx,name:xx,project:xx}；axios 为 axios 对象，可以直接使用该对象进行 ajax 请求；callback 为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`或者`callback(new Error('xxxx'))` **(v1.0.2+)**                                                                                                                                   |
|                multiDelete                 | `Function` | `N`  |   `-`   |                                                                                                            批量删除数据的函数，不填时表示不显示默认的批量删除按钮。该函数接受参数为(selection,axios,callback)。selection 为当前选中的行数据数组，如[{id:xx,name:xx,project:xx},{id:xx,name:xx,project:xx}]；axios 为 axios 对象，可以直接使用该对象进行 ajax 请求；callback 为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`或者`callback(new Error('xxxx'))` **(v1.0.2+)**                                                                                                             |
|               rowOperations                | `Function` | `N`  |   `-`   |                                                                                                        自定义行操作的函数，返回自定义操作的 vue 组件数组。这些组件都接受 schema、list、index、row、search、selection、actions 这些 prop，schema 为 List 组件的 schema；list 为整个数据列表；index 为当前操作行的索引；row 为当前行的数据；search 为当前的查询条件对象；selection 为当前批量选中的行数据数组；actions 为 List 组件暴露出来的可操作方法的对象，目前只暴露了 setSearch、query 这两个方法                                                                                                         |
|             actions.setSearch              | `Function` | `-`  |   `-`   |                                                                                                                                                                                                                                        设置 List 组件的查询条件并进行查询，形式为 setSearch(search)，search 为设置的查询条件对象，当不传入 search 时，表示重置查询条件                                                                                                                                                                                                                                        |
|               actions.query                | `Function` | `-`  |   `-`   |                                                                                                                                                                                                                                                                            以当前的查询条件进行查询，等效于`actions.setSearch({})`                                                                                                                                                                                                                                                                            |
|              globalOperations              | `Function` | `N`  |   `-`   |                                                                                                                                                                                                                                              自定义全局操作的函数，返回自定义操作的组件数组。这些组件接受的 props 跟 rowOperations 组件一致，除了没有 index、row                                                                                                                                                                                                                                              |

## 提示

- schema 中所有方法的 this 默认为 List 组件实例
- 当 schema 中设置了 edit、delete 时，表示所有行中都会有编辑、删除按钮，如果想在某些行中去掉这些按钮，可在这些行的值中设置 showEdit、showDelete 为 false
- 当自定义操作组件时，如果用到了`dialog`组件，可能发现其层叠顺序不对（常见情况是对话框主体在蒙层下面），此时可以给`dialog`组件应用`append-to-body`属性
