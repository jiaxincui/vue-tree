<template>
  <ul class="vue-tree-list">
    <tree-item
      v-for="(item, idx) in treeData"
      :ids="ids"
      :ids-with-parent="idsWithParent"
      :model="item"
      :options="termOptions"
      :depth="0"
      :state="state"
      :key="idx"
      @handle="handle"
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
          label: 'label',
          checkbox: true,
          checkedOpen: true,
          folderBold: true,
          idsWithParent: true,
          depthOpen: 0,
          openIcon: 'fa fa-angle-right',
          closeIcon: 'fa fa-angle-down',
          halfCheckedIcon: 'fa fa-minus-square-o fa-fw',
          checkedIcon: 'fa fa-check-square-o fa-fw',
          uncheckedIcon: 'fa fa-square-o fa-fw'
        },
        termOptions: {},
        idsWithParent: [],
        state: 0
      }
    },

    created () {
      this.initOptions()
      this.idsWithParent = this.ids.slice(0)
    },

    watch: {
      options: {
        handler: function (val) {
          this.initOptions()
        },
        deep: true
      }
    },

    methods: {
      handle (item) {
        this.$emit('handle', item)
      },
      initOptions () {
        this.termOptions = Object.assign({}, this.defaultOptions, this.options)
        this.idsWithParent = this.ids.slice(0)
      }
    }
  }
</script>
