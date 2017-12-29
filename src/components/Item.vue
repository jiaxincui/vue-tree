<template>
  <li class="vue-tree-item">
    <div class="item-wrapper" onselectstart="return false;">
      <span
        class="item-toggle"
        v-if="isFolder"
        @click="toggle"
      >
        <i
          :class="[open ? options.closeClass : options.openClass]"
        />
      </span>
      <span
        v-else
        class="item-toggle"
      />
      <span class="item-checkbox" v-if="options.checkbox">
        <label class="item-label" @click="toggleChecked">
          <span :class="[labelIcon, labelStatus]"></span>
        </label>
      </span>
      <span
        class="item-name"
        :class="isBold"
        @click="handle"
      >
        {{ model[options.itemName] }}
      </span>
      <span class="item-btn">
      </span>
    </div>
    <ul v-if="isFolder" v-show="open" class="vue-tree-list">
      <tree-item
        v-for="(item, idx) in model.children"
        :model="item"
        :options="options"
        :ids="ids"
        :depth="depth + 1"
        :ids-with-parent="idsWithParent"
        :half="half"
        :state="itemState"
        :key="idx"
        @handle="emitHandle"
        @child-change="childChange"
      />
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'tree-item',

    props: {
      model: {
        type: Object,
        default: function () {
          return {}
        }
      },

      options: {
        type: Object,
        default: function () {
          return {}
        }
      },

      depth: {
        type: Number,
        default: 0
      },

      ids: {
        type: Array,
        default: function () {
          return []
        }
      },

      idsWithParent: {
        type: Array,
        default: function () {
          return []
        }
      },

      half: {
        type: Array,
        default: function () {
          return []
        }
      },

      state: {
        type: Number,
        default: 0
      }
    },

    data () {
      return {
        open: false,
        itemState: 0
      }
    },

    created () {
      if (this.isFolder && this.depth < this.options.depthOpen) {
        this.open = true
      }
      if (this.options.checkbox) {
        if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          this.itemState = this.itemState + 1
          if (this.options.idsWithParent) {
            this.$emit('child-change', true)
          } else {
            if (this.isFolder) {
              this.delChecked()
              this.delId()
            }
          }
        }
        if (this.state > 0) {
          this.addChecked()
          if (!this.isFolder || this.options.idsWithParent) {
            this.addId()
          }
          this.itemState = this.itemState + 1
        }
      }
    },

    computed: {
      labelIcon () {
        if (this.half.indexOf(this.model.id) !== -1) {
          return this.options.halfCheckedClass
        } else if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          return this.options.checkedClass
        } else {
          return this.options.unCheckedClass
        }
      },

      labelStatus () {
        if (this.half.indexOf(this.model.id) !== -1) {
          return 'half-checked'
        } else if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          return 'checked'
        } else {
          return 'un-checked'
        }
      },

      checked () {
        return this.idsWithParent.indexOf(this.model.id) !== -1
      },

      halfChecked () {
        return this.half.indexOf(this.model.id) !== -1
      },

      isFolder () {
        return this.model.children && this.model.children.length
      },

      isBold () {
        return {
          'item-bold': this.isFolder && this.options.folderBold
        }
      },

      self () {
        let self = Object.assign({}, this.model, {children: []})
        delete self.children
        return self
      }
    },

    watch: {
      state (val, old) {
        if (val > old) {
          this.addChecked()
          if (!this.isFolder || this.options.idsWithParent) {
            this.addId()
          }
          this.itemState = this.itemState + 1
        } else {
          this.delChecked()
          this.delId()
          this.deleteHalfChecked(this.model.id)
          this.itemState = this.itemState - 1
        }
      }
    },

    methods: {
      toggle () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },

      handle () {
        this.emitHandle(this.self)
      },

      emitHandle (item) {
        this.$emit('handle', item)
      },

      toggleChecked () {
        if (this.isFolder) {
          this.deleteHalfChecked()
        }
        if (this.checked) {
          this.delChecked()
          this.delId()
          this.$emit('child-change', false)
          this.itemState = this.itemState - 1
        } else {
          this.addChecked()
          if (!this.isFolder || this.options.idsWithParent) {
            this.addId()
          }
          this.$emit('child-change', true)
          if (this.options.checkedOpen && this.isFolder) {
            this.open = true
          }
          this.itemState = this.itemState + 1
        }
      },

      addId () {
        if (this.ids.indexOf(this.model.id) === -1) {
          this.$set(this.ids, this.ids.length, this.model.id)
        }
      },

      delId () {
        let index = this.ids.indexOf(this.model.id)
        if (index > -1) {
          this.$delete(this.ids, index)
        }
      },

      addChecked () {
        if (this.idsWithParent.indexOf(this.model.id) === -1) {
          this.$set(this.idsWithParent, this.idsWithParent.length, this.model.id)
        }
      },

      delChecked () {
        let idx = this.idsWithParent.indexOf(this.model.id)
        if (idx !== -1) {
          this.$delete(this.idsWithParent, idx)
        }
      },

      setHalfChecked () {
        if (this.half.indexOf(this.model.id) === -1) {
          this.$set(this.half, this.half.length, this.model.id)
        }
      },

      deleteHalfChecked () {
        let idx = this.half.indexOf(this.model.id)
        if (idx !== -1) {
          this.$delete(this.half, idx)
        }
      },

      childChange (checked) {
        let children
        children = this.model.children
        for (let i = 0, l = children.length; i < l; i++) {
          if (this.half.indexOf(children[i].id) !== -1) {
            this.addChecked()
            if (this.options.idsWithParent) {
              this.addId()
            }
            this.setHalfChecked()
            this.$emit('child-change', true)
            return
          }
        }
        if (checked) {
          this.addChecked()
          if (this.options.idsWithParent) {
            this.addId()
          }
          let allChecked = true
          for (let i = 0, l = children.length; i < l; i++) {
            if (this.idsWithParent.indexOf(children[i].id) === -1) {
              allChecked = false
              break
            }
          }
          if (allChecked) {
            this.deleteHalfChecked()
          } else {
            this.setHalfChecked()
          }
          this.$emit('child-change', true)
        } else {
          let nonChecked = true
          for (let i = 0, l = children.length; i < l; i++) {
            if (this.idsWithParent.indexOf(children[i].id) !== -1) {
              nonChecked = false
              break
            }
          }
          if (nonChecked) {
            this.deleteHalfChecked()
            this.delChecked()
            this.delId()
          } else {
            this.setHalfChecked()
          }
          this.$emit('child-change', false)
        }
      }
    }
  }
</script>
