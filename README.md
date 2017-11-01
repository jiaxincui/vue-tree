# vue-simple-tree

> A simple tree component for vue.js

## 介绍

一个简单灵活的vue.js树形组件，可作为插件使用，也可直接`import`项目文件

使用时只需绑定`treeData`和`options`即可。

组件还提供了`增删改`事件，你可以很方便的在组件上监听。

不止这些，

- 绑定数据即可显示树形视图
- 增删改事件支持
- 可选是否显示复选框
- 初始化选择勾选
- 可选的按钮图标
- 双击触发添加节点事件
- 父节点半选状态
- 可自定义显示字段
- 可选择的按钮显示
- ...



## 演示

A [Demo](https://jiaxincui.github.io/vue-tree/dist/)

## 安装

``` bash
# install
npm install vue-simple-tree --sve-dev
```

## 使用示例

有两种使用方法:

1. 局部注册component(推荐)
    `App.vue`
  
      ```
      <template>
        <div id="app">
            <vue-tree :tree-data="treeData" :options="options"></vue-tree>
        </div>
      </template>
      
      <script>
      import VueTree from 'vue-simple-tree/src/components/Vue-tree.vue'
      export default {
          name: 'app',
          components: { VueTree },
          data () {
              return {
                  treeData: {
                      name: '根目录[1]',
                      id: 1,
                      children: [
                          { name: '一级节点[2]', id: 2},
                          { name: '一级节点[3]', id: 3},
                          {
                              name: '二级节点[4]', id: 4,
                              children: [
                                  {
                                      name: '三级节点[5]', id: 5,
                                      children: [
                                          { name: '四级节点[6]', id: 6},
                                          { name: '四级节点[8]', id: 8},
                                          { name: '四级节点[30]', id: 30},
                                      ]
                                  },
                                  { name: '三级节点[9]', id: 9},
                                  { name: '三级节点[10]', id: 10},
                                  {
                                      name: '三级节点[11]', id: 11,
                                      children: [
                                          { name: '四级节点[12]', id: 12},
                                          { name: '四级节点[13]', id: 13},
                                      ]
                                  }
                              ]
                          }
                      ]
                  },
                  // 设置项
                  options: {},
              }
          },
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
    
    ```
    <template>
      <div id="app">
          <vue-tree :tree-data="treeData" :options="options"></vue-tree>
      </div>
    </template>
    
    <script>
    export default {
        name: 'app',
        data () {
            return {
                treeData: {
                    id: 1,
                    name: 'Root'
                },
                options: {},
            }
        },
    }
    </script>
    ```
    
###treeData数据格式
```
    treeData: {
        // id,必须字段，且字段名只能是id
        id: 1,
        // name,必须字段，字段名可任意如display_name，如不是默认name须在options.itemName设置
        name: 'Root',
        // children,非必需，如果有以数组出现
        children: [
            {id: 2, name: 'Node2'},
            {id: 3, name: 'Node3'}
        ]
    }
```
## 设置选项

以下代码中是默认设置。

你可以在`options`里覆盖默认设置，或仅包含个别设置的项`options: {someOption: true}`

当然如果你想继续使用默认设置，你可以不用绑定`options`或绑定一个空的对象
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

`add-a-child`、 `item-edit` 、`item-delete` 分别为添加子节点、编辑节点、删除节点事件。

这3个事件仅仅是传递当前id到监听器，并未实质操作treeData，因为增删改数据在父组件更新后会传递到tree视图。

## 监听器

如果需要，你可以选择绑定这些事件的其中一个或多个。

> 注意:叶子节点双击事件也会触发`add-a-child`

```html
<vue-tree 
    :tree-data="treeData" 
    :options="options" 
    @add-a-child="addAChild" 
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

`.vue-tree .item-wrapper .item-btn .edit-btn`

`.vue-tree .item-wrapper .item-btn .delete-btn`

`.vue-tree-list`

`.vue-tree-list .tree-add`

## License

[MIT](https://github.com/jiaxincui/vue-tree/blob/master/LICENSE.md) © [JiaxinCui](https://github.com/jiaxincui)