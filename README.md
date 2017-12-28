# vue-simple-tree

> A simple tree component for vue.js

**v2.2.0优化核心计算方法，添加 `label` 可定制选择框样式**

## 介绍

一个简单灵活的vue.js树形组件，可作为插件使用，也可直接作为`component`使用

使用时只需传入一个树形数据绑定。

组件还提供了`增删改查`事件，你可以很方便的在组件上监听。

不止这些，

- 可定制的`增删改查`事件
- 可定制的选择框样式
- 复选框显示可选
- 初始化展开层级
- 初始化勾选
- 可选的按钮图标
- 父节点半选状态支持
- 显示字段自定义
- ...



## 演示

A [Demo](https://jiaxincui.github.io/vue-tree/dist/)

## 安装

``` bash
# install
npm install vue-simple-tree --sve
```

## 数据格式

`treeData`

- `id` 必要属性，类型 `Number`

- `name` 必要属性，类型 `String`，可自定义，默认 `name`，如： `options.itemName:'label'`

- `children` 非必要，类型 `Array`

### treeData示例
./tree.json
```json
{
  "data": [{
    "id": "1",
    "name": "Root",
    "children": [
      {
        "id": "2",
        "name": "Node2"
      },
      {
        "id": "3",
        "name": "Node3"
      },
      {
        "id": "4",
        "name": "Node4",
        "children": [
          {
            "id": "5",
            "name": "Node5"
          }
        ]
      }
    ]
  }]
}
```

## 使用示例

   有两种使用方法:

1. 局部注册
    
    `App.vue`
  
      ```vue
      <template>
        <div id="app">
          <vue-tree
            v-model="checkedIds"
            :tree-data="treeData"
            :options="options"
          />
        </div>
      </template>
      
      <script>
      import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
      import Tree from './tree.json'
   
      export default {
        name: 'app',
        components: { VueTree },
        data () {
          return {
            // 复选ids,可传入id数组作为初始选中状态,如[3,4,8]
            checkedIds: [],
            // tree数据
            treeData: Tree.data,
            // 设置项
            options: {}
          }
        }
      }
      </script>
      ```
2. 通过插件形式全局注册
    
    `main.js`

    ```js
    import App from './App'
    import Vuetree from 'vue-simple-tree'
    
    Vue.use(Vuetree)
    
    new Vue({
      el: '#app',
      template: '<App/>',
      components: { App }
    })
    ```

    `App.vue`
    
    ```vue
    <template>
      <div id="app">
        <vue-tree
          v-model="checkedIds"
          :tree-data="treeData"
          :options="options"
        />
      </div>
    </template>

    <script>
    import Tree from './tree.json';
    export default {
      name: 'app',
      data () {
        return {
          checkedIds: [],
          treeData: Tree.data,
          options: {}
        }
      }
    }
    </script>
    ```
   
## 设置选项

以下是默认设置.

你可以在`options`里覆盖默认设置，或仅设置若干项`options: {someOption: optionValue}`

你也可以绑定一个空的对象`:options="{}"`或直接忽略`options`

```
options: {
    // String,节点显示字段
    itemName: 'name',
    
    // Boolean,是否显示添加子节点按钮
    addItem: true,
    
    // Boolean,是否显示选择框
    checkbox: true,
    
    // Boolean,选中时是否展开节点
    checkedOpen: true,
    
    // Boolean,目录是否加粗显示
    folderBold: true,
    
    // String,展开按钮(默认依赖font-awesome)
    openClass: 'fa fa-plus-square text-info',
    
    // String,收缩按钮(默认依赖font-awesome)
    closeClass: 'fa fa-minus-square text-danger',
    
    // String,添加节点按钮(默认依赖font-awesome)
    addClass: 'fa fa-plus text-danger',
    
    // Boolean,是否显示编辑按钮
    showEdit: true,
    
    // Boolean,是否显示删除按钮
    showDelete: true,
    
    // String,编辑按钮(默认依赖font-awesome)
    editClass: 'fa fa-edit',
    
    // String,删除按钮(默认依赖font-awesome)
    deleteClass: 'fa fa-trash-o'
    
    // Boolean,v-model数据是否包含目录,默认`false`,如果只获取叶子节点设置为`false`
    idsWithParent: false
    
    // Number,初始化时展开层级,根节点为0,默认0
    depthOpen: 0
    
    // (v2.2新增), 选择框label选中样式
    checkedClass: 'fa fa-check-square-o fa-fw'
    
    // (v2.2新增), 选择框label半选中样式
    halfCheckedClass: 'fa fa-minus-square-o fa-fw'
    
    // (v2.2新增), 选择框label未选中样式
    unCheckedClass: 'fa fa-square-o fa-fw'
}
```
> 注意：默认设置使用了 [font-awesome](http://fontawesome.io/) 图标，
如果你继续使用默认设置，请确保这些图标能正常使用。
  
## 如何获取选择框数据?

使用 `v-model="ids"` 获取选择框数据（ `ids` 是一个只包含 `id` 的数组）
  
默认情况下 `ids` 只包含叶子节点（所有目录被过滤掉），如果你想获取包含上级目录的 `ids`，设置 `options.idsWithParent` 为 `true`

## 事件

`item-click`、`add-a-child`、 `item-edit` 、`item-delete` 分别为点击节点、添加子节点、编辑节点、删除节点事件。

这些事件绑定了操作id到监听器

## 监听器

如果需要，你可以选择绑定这些事件的其中一个或多个。

```html
<vue-tree 
  v-model="ids"
  :tree-data="treeData"
  :options="options"
  @add-a-child="addAChild"
  @item-click="itemClick"
  @item-edit="itemEdit"
  @item-delete="itemDelete"
/>

```

为绑定的事件定义监听方法，~~这些方法都接收一个当前操作id作为参数~~,（v2.2.3）当前操作 `id` 作为监听方法的第一个参数，当前 `model`作为第二个参数

```a
methods: {
  addAChild (id, item) {
    this.message.push(`触发添加子节点事件，当前节点${JSON.stringify(item)}`)
  },
  itemClick (id, item) {
    this.message.push(`触发点击事件，当前节点${JSON.stringify(item)}`)
  },
  itemEdit (id, item) {
    this.message.push(`触发编辑按钮事件，当前节点${JSON.stringify(item)}`)
  },
  itemDelete (id, item) {
    this.message.push(`触发删除按钮事件，当前节点${JSON.stringify(item)}`)
  }
}
```
## 样式

如果你想修改默认样式，一切都为你准备好了，只需要重新定义以下css类

`.vue-tree`

`.vue-tree .vue-tree-item`

`.vue-tree .item-wrapper`

`.vue-tree .item-wrapper .item-toggle`

`.vue-tree .item-wrapper .item-btn`

`.vue-tree .item-wrapper .item-btn .add-btn`

`.vue-tree .item-wrapper .item-btn .edit-btn`

`.vue-tree .item-wrapper .item-btn .delete-btn`

`.veu-tree .vue-tree-list`

`.vue-tree .item-label .checked`

`.vue-tree .item-label .un-checked`

`.vue-tree .item-label .half-checked`

## License

[MIT](https://github.com/jiaxincui/vue-tree/blob/master/LICENSE.md) © [JiaxinCui](https://github.com/jiaxincui)