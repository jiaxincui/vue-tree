<template>
  <ul class="vue-tree">
    <tree-item
      v-for="item in treeData"
      :ids="ids"
      :ids-with-parent="idsWithParent"
      :model="item"
      :options="termOptions"
      :depth="0"
      @add-a-child="addAChild"
      @item-click="itemClick"
      @item-edit="itemEdit"
      @item-delete="itemDelete"
      :key="item.id"
    />
  </ul>
</template>

<script>
  import Item from './Item.vue'
  import '../vue-tree.css'

  export default {
    components: { 'tree-item': Item },

    model: {
      prop: 'ids',
      event: 'change'
    },

    props: {
      treeData: {
        type: Array,
        default: function () {
          return []
        }
      },
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      ids: {
        type: Array,
        default: function () {
          return []
        }
      }
    },

    data () {
      return {
        defaultOptions: {
          itemName: 'name',
          checkbox: true,
          checkedOpen: true,
          folderBold: true,
          idsWithParent: true,
          depthOpen: 0,
          showAdd: true,
          showEdit: true,
          showDelete: true,
          addClass: 'fa fa-plus-square-o',
          editClass: 'fa fa-edit',
          deleteClass: 'fa fa-trash-o',
          openClass: 'fa fa-angle-right',
          closeClass: 'fa fa-angle-down',
          halfCheckedClass: 'fa fa-minus-square-o fa-fw',
          checkedClass: 'fa fa-check-square-o fa-fw',
          unCheckedClass: 'fa fa-square-o fa-fw'
        },
        termOptions: {},
        idsWithParent: []
      }
    },

    created () {
      this.initOptions()
    },

    watch: {
      options: {
        handler: function (val) {
          this.initOptions()
        },
        deep: true
      },
      ids: {
        handler: function (val) {
          this.idsWithParent = val.slice(0)
        },
        deep: true
      }
    },

    methods: {
      addAChild (id, item) {
        this.$emit('add-a-child', id, item)
      },
      itemClick (id, item) {
        this.$emit('item-click', id, item)
      },
      itemEdit (id, item) {
        this.$emit('item-edit', id, item)
      },
      itemDelete (id, item) {
        this.$emit('item-delete', id, item)
      },
      initOptions () {
        this.termOptions = Object.assign({}, this.defaultOptions, this.options)
        this.idsWithParent = this.ids.slice(0)
      }
    }
  }
</script>
