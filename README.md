# vue-simple-tree

> A simple tree component for vue.js

**2.0版本增加multi tree支持,注意:此版本绑定的tree数据结构和1.x版本不同,2.0加入了`[]`包裹,以支持multi tree**

## 介绍

一个简单灵活的vue.js树形组件，可作为插件使用，也可直接作为`component`使用

使用时只需传入一个树形数据绑定。

组件还提供了`增删改查`事件，你可以很方便的在组件上监听。

不止这些，

- 可定制的`增删改查`事件
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
npm install vue-simple-tree --sve-dev
```

## 数据格式

`treeData`

> `id`必要属性,`Number`

> `name`必要属性,`String`,可自定义,默认`name`,如`options.itemName:'display_name'`

> `children`非必要,`Array`

treeData示例
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

1. 局部注册component(推荐)
    
    `App.vue`
  
      ```vue
      <template>
        <div id="app">
            <vue-tree v-model="checkedIds" :tree-data="treeData" :options="options"></vue-tree>
        </div>
      </template>
      
      <script>
      import VueTree from 'vue-simple-tree/src/components/Vue-tree.vue'
      import Tree from 'tree.json';
      export default {
          name: 'app',
          components: { VueTree },
          data () {
              return {
                  // 复选ids
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
2. 全局注册，通过插件形式注册全局component
    
    `main.js`

    ```js
    import App from './App'
    import Vuetree from 'vue-simple-tree'
    
    Vue.use(Vuetree);
    
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
          <vue-tree v-model="checkedIds" :tree-data="treeData" :options="options"></vue-tree>
      </div>
    </template>
    
    <script>
    import Tree from 'tree.json';
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

你可以在`options`里覆盖默认设置，或仅设置若干项`options: {someOption: true}`

你也可以绑定一个空的对象`:options="{}"`或直接忽略`options`

```
options: {
    // String,节点显示字段
    itemName: 'name',
    // Boolean,是否显示添加子节点按钮
    addItem: true,
    // Boolean,是否显示选择框
    checkbox: true,
    // Array,初始化时选中id
    checkedIds: [], 
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
}
```
> 注意：默认设置使用了`font-awesome`的图标，以及`bootstrap`的情景颜色，如果你继续使用默认设置，请引入这两个`css`库

## 事件

`item-click`、`add-a-child`、 `item-edit` 、`item-delete` 分别为点击节点、添加子节点、编辑节点、删除节点事件。

这些事件绑定了操作id到监听器

## 监听器

如果需要，你可以选择绑定这些事件的其中一个或多个。

```html
<vue-tree 
    :tree-data="treeData"
    :options="options"
    @add-a-child="addAChild"
    @item-click="itemClick"
    @item-edit="itemEdit"
    @item-delete="itemDelete">
</vue-tree>
```

为绑定的事件定义监听方法，这些方法都接收一个当前操作id作为参数

```
methods: {
    addAChild(id) {
        console.log('点击了添加子节点按钮，父节点ID[' + id + ']')
    },
    itemClick(id) {
        console.log('点击了节点，节点ID[' + id + ']')
    },
    itemEdit(id) {
        console.log('点击了编辑按钮，节点ID[' + id + ']')
        },
    itemDelete(id) {
        console.log('点击了删除按钮，节点ID[' + id + ']')
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

`.vue-tree-list`

## License

[MIT](https://github.com/jiaxincui/vue-tree/blob/master/LICENSE.md) © [JiaxinCui](https://github.com/jiaxincui)