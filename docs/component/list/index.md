# List组件（v0.2.0+）

> List组件是后台管理页面常见的crud列表组件，同时该组件又可以作为Form表单组件的某个表单项的数据选择列表，形式如下

<div align="center">
  <img src="./preview.png" height="400">
</div>

- 区域1：条件查询区域
- 区域2：新增、批量删除按钮区域
- 区域3：有时候可能需要自定义一些针对整个列表数据进行处理的操作，这个自定义的操作组件就显示在该区域中
- 区域4：该区域显示一些针对单行数据进行处理的组件，用户也可以自定义处理组件
- 区域5：批量选择区域
- 区域6：有时候数据很多时需要进行分页，该区域显示分页组件

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
        query (search, axios, callback) {
          xxx
        },
        add (value, axios, callback) {
          xx
        },
        edit (value, axios, callback) {
          xxx
        },
        delete (value, axios, callback) {
          xx
        },
        multiDelete (selection, axios, callback) {
          xx
        }
      }
    }
  }
}
</script>
```

## schema

`List`组件接受一个`schema`属性，用来进行一些配置。schema是一个对象，各属性配置如下

|                    名称                    |    类型    | 必填  | 默认值  |                                                                                                                                                                                                                                                                                        描述                                                                                                                                                                                                                                                                                        |
| :----------------------------------------: | :--------: | :---: | :-----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                 properties                 |  `Object`  |  `Y`  |   `-`   |                                                                                                                                                                                                                                                 列表元素数据的各属性描述schema，与Form表单各字段的[schema](../../schema.md)一致。                                                                                                                                                                                                                                                  |
|           properties.xx.primary            | `Boolean`  |  `Y`  | `false` |                                                                                                                                                                                                             表示xx属性是主键，在`properties`的所有属性中**必须有且只有一个**属性为primary属性。当List组件作为Form组件表单项的选择列表时，会以primary属性作为表单项的值                                                                                                                                                                                                             |
|         properties.xx.showInSearch         | `Boolean`  |  `N`  | `false` |                                                                                                                                                                                                                         表示列表元素数据的xx属性是否为查询条件，为`true`时该属性会显示在查询区域中，如果有输入值，其值会携带在`query`方法的`search`参数中                                                                                                                                                                                                                         |
|         properties.xx.showInTable          | `Boolean`  |  `N`  | `true`  |                                                                                                                                                                                                                                                                      表示列表元素数据的xx属性是否在表格中显示                                                                                                                                                                                                                                                                      |
|          properties.xx.showInAdd           | `Boolean`  |  `N`  | `false` |                                                                                                                                                                                                                                                               表示列表元素数据的xx属性是否在默认新增界面的表单中显示                                                                                                                                                                                                                                                               |
|          properties.xx.showInEdit          | `Boolean`  |  `N`  | `false` |                                                                                                                                                                                                                                                               表示列表元素数据的xx属性是否在默认编辑界面的表单中显示                                                                                                                                                                                                                                                               |
| properties.xx.showInFormItem **(v0.2.1+)** | `Boolean`  |  `N`  | `false` |                                                                                                                                                                        表示当List组件作为Form组件表单项的选择列表时，选择某项数据后，xx属性是否在表单项中显示。当属性是primary属性时，默认值为true。如果有多个属性设置为true，则选择某项数据后，在表单项中会以表格形式展示选择的数据项，否则以常规方式显示                                                                                                                                                                         |
|       properties.xx.displayComponent       | `Function` |  `N`  |   `-`   |                                                                                                                                                                                                           自定义列表元素数据的xx属性在表格单元格中的显示，该函数返回vue组件对象。该组件接受`schema`、`value`两个prop，schema表示xx属性的schema规范，value表示xx属性的值                                                                                                                                                                                                            |
|         properties.xx.tableColumn          |  `Object`  |  `N`  |   `-`   |                                                                                                                                                                                         element-ui的[table-column属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)，支持除了`type`、`index`、`label`、`prop`、`selectable`、`reserve-selection`外的所有属性                                                                                                                                                                                          |
|                   table                    |  `Object`  |  `N`  |   `-`   |                                                                                                                                                                                                                                element-ui的[table属性](https://element.eleme.io/#/zh-CN/component/table#table-attributes)，支持除了`data`的所有属性                                                                                                                                                                                                                                |
|               tableSelection               |  `Object`  |  `N`  |   `-`   |                                                                                                                                                      是否开启批量选择，默认不开启。支持[table-column属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`selectable`、`reserve-selection`、`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`                                                                                                                                                      |
|                 tableIndex                 |  `Object`  |  `N`  |   `-`   |                                                                                                                                                                    是否开启索引列，默认不开启。支持[table-column属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`index`、`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`                                                                                                                                                                    |
|                tableExpand                 |  `Object`  |  `N`  |   `-`   |                                                                                                                       是否开启[展开行](https://element.eleme.io/#/zh-CN/component/table#zhan-kai-xing)，默认不开启。支持[table-column属性](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes)的`width`、`min-width`、`fixed`、`resizable`、`align`、`header-align`、`class-name`、`label-class-name`，还支持`slotComponent`属性，如下                                                                                                                       |
|         tableExpand.slotComponent          | `Function` |  `Y`  |   `-`   |                                                                                                                                                                                                                              返回自定义的展开行组件，该组件接受的props与rowOperations组件一致，另外还接受slotscope属性，格式为{ row, column, $index }                                                                                                                                                                                                                              |
|         tableEvents **(v0.2.1+)**          |  `Object`  |  `N`  |   `-`   |                                                                                                                                                                                                               element-ui的[table事件](https://element.eleme.cn/#/zh-CN/component/table#table-events)处理函数对象，如`{'row-click': function(row, column, event){}}`                                                                                                                                                                                                                |
|                 pagination                 | `Boolean`  |  `N`  | `false` |                                                                                                                                                                                                                                                                                      是否分页                                                                                                                                                                                                                                                                                      |
|                   query                    | `Function` |  `Y`  |   `-`   | 查询数据的函数，该函数接受参数为(search,axios,callback)。search为查询条件对象，如{id:xx,code:xx,page:1}。**（当List组件作为Form组件表单项的选择列表时，该查询函数必须要实现search中只存在primary属性时的查询处理，此时传给callback方法的参数的list字段为只有一个元素的数组）**；axios为axios对象，可以直接使用该对象进行ajax请求；callback为数据回调函数，形式为callback(data)，请求成功后需要将数据传入该回调函数。data格式为{total,page,pageSize,list}，total为总页数，page为当前页码，pageSize为一页显示多少数据，list为实际数据列表，当不需要分页时total、page、pageSize可不填 |
|                    add                     | `Function` |  `N`  |   `-`   |                                                                                                                                                   新增数据的函数，不填时表示不显示默认的新增按钮。该函数接受参数为(value,axios,callback)。value为新增的数据对象，如{id:xx,name:xx,project:xx}；axios为axios对象，可以直接使用该对象进行ajax请求；callback为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`                                                                                                                                                    |
|                    edit                    | `Function` |  `N`  |   `-`   |                                                                                                                                                   编辑数据的函数，不填时表示不显示默认的行编辑按钮。该函数接受参数为(value,axios,callback)。value为编辑后的行数据对象，如{name:xx,project:xx}；axios为axios对象，可以直接使用该对象进行ajax请求；callback为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`                                                                                                                                                    |
|                   delete                   | `Function` |  `N`  |   `-`   |                                                                                                                                                删除数据的函数，不填时表示不显示默认的行删除按钮。该函数接受参数为(value,axios,callback)。value为要删除的行数据对象，如{id:xx,name:xx,project:xx}；axios为axios对象，可以直接使用该对象进行ajax请求；callback为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`                                                                                                                                                 |
|                multiDelete                 | `Function` |  `N`  |   `-`   |                                                                                                                          批量删除数据的函数，不填时表示不显示默认的批量删除按钮。该函数接受参数为(selection,axios,callback)。selection为当前选中的行数据数组，如[{id:xx,name:xx,project:xx},{id:xx,name:xx,project:xx}]；axios为axios对象，可以直接使用该对象进行ajax请求；callback为回调函数，当操作成功时调用`callback()`，否则需要调用`callback(true)`                                                                                                                          |
|               rowOperations                | `Function` |  `N`  |   `-`   |                                                                                                    自定义行操作的函数，返回自定义操作的vue组件数组。这些组件都接受schema、list、index、row、search、selection、actions这些prop，schema为List组件的schema；list为整个数据列表；index为当前操作行的索引；row为当前行的数据；search为当前的查询条件对象；selection为当前批量选中的行数据数组；actions为List组件暴露出来的可操作方法的对象，目前只暴露了setSearch、query这两个方法                                                                                                     |
|             actions.setSearch              | `Function` |  `-`  |   `-`   |                                                                                                                                                                                                                                  设置List组件的查询条件，形式为setSearch(search)，search为设置的查询条件对象，当不传入search时，表示重置查询条件                                                                                                                                                                                                                                   |
|               actions.query                | `Function` |  `-`  |   `-`   |                                                                                                                                                                                                                                                                              以当前的查询条件进行查询                                                                                                                                                                                                                                                                              |
|              globalOperations              | `Function` |  `N`  |   `-`   |                                                                                                                                                                                                                                   自定义全局操作的函数，返回自定义操作的组件数组。这些组件接受的props跟rowOperations组件一致，除了没有index、row                                                                                                                                                                                                                                   |

## 提示

- schema中所有方法的this默认为List组件实例
- 当schema中设置了edit、delete时，表示所有行中都会有编辑、删除按钮，如果想在某些行中去掉这些按钮，可在这些行的值中设置showEdit、showDelete为false
- 当自定义操作组件时，如果用到了`dialog`组件，可能发现其层叠顺序不对（常见情况是对话框主体在蒙层下面），此时可以给`dialog`组件应用`append-to-body`属性