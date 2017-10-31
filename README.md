# vue-simple-tree

> A simple tree component for vue.js

## 介绍
一个简单灵活的vue.js树形组件，可作为插件使用，也可直接`import`项目文件

使用时只需绑定`treeData`和`options`即可。组件还提供了`增删改`事件，你可以很方便的在组件上监听。

## 演示

一个演示 [Demo](https://jiaxincui.github.io/vue-tree/dist/)

## 安装

``` bash
# install
npm install vue-simple-tree --sve-dev
```

### 使用示例
main.js
```js
import Vuetree from 'vue-simple-tree'
Vue.use(Vuetree)
```

App.vue
```html
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
            treeData:{  //treeData 树形数据，id是必须选项，name可自定（见设置项）
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
            options: {}, //设置项
        }
    },
}
</script>
```

**注意：默认设置使用了`font-awesome`的图标，以及`bootstrap`的情景颜色，如果你继续使用默认设置，请引入这两个`css`库**

## 设置选项
以下为默认选项。

如果你想继续使用默认设置只需传递一个空的对象`options: {}`，

或仅包含个别设置的项`options: {someOption: true}`
```
options: {
    dispalyName: 'name', //显示名称字段
    addItem: true, //是否显示添加子节点按钮
    checkbox: true, //是否显示多选框
    checkedIds: [], //初始化时选中项id
    checkedOpen: true, //选中时是否展开节点
    folderBold: true, //目录是否加粗显示
    openClass: 'fa fa-plus-square text-info', //展开按钮(font-awesome)
    closeClass: 'fa fa-minus-square text-danger', //收缩按钮(font-awesome)
    addClass: 'fa fa-plus text-danger', //添加节点按钮(font-awesome)
    showEdit: true, //是否显示编辑按钮
    showDelete: true, //是否显示删除按钮
    editClass: 'fa fa-edit', //编辑按钮(font-awesome)
    deleteClass: 'fa fa-trash-o' //删除按钮(font-awesome)
}
```

### 事件

`add-a-child`、 `item-edit` 、`item-delete` 分别为添加子节点、编辑节点、删除节点事件。

这3个事件仅仅是传递当前id到监听器，并未实质操作treeData，因为增删改数据在父组件更新后会传递到tree视图。

#### 监听器

如果需要，你可以选择绑定这些事件的其中一个或多个。

**注意:叶子节点双击事件也会触发`add-a-child`**

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

## License

[MIT](https://github.com/jiaxincui/vue-tree/blob/master/LICENSE.md) © [JiaxinCui](https://github.com/jiaxincui)