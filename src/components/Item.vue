<template>
  <li class="vue-tree-item">
    <div class="item-wrapper" onselectstart="return false;">
      <span
        class="item-toggle"
        v-if="isFolder"
        @click="toggle"
      >
        <i :class="[open ? options.closeClass : options.openClass]"></i>
      </span>
      <span class="item-toggle" v-else> </span>
      <span class="item-checkbox" v-if="options.checkbox">
        <input type="checkbox" :checked="ids.indexOf(model.id) >= 0" v-show="false">
        <label class="item-label" @click="toggleChecked">
          <span :class="[labelIcon, labelStatus]"></span>
        </label>
      </span>
      <span class="item-name" :class="isBold"
        @click="itemClick">{{ model[options.itemName] }}
      </span>
      <span class="item-btn">
        <i
          class="add-btn"
          v-if="options.showAdd"
          @click="addChild"
          :class="[options.addClass]"
        >
        </i>&nbsp;
        <i
          class="edit-btn"
          v-if="options.showEdit"
          @click="itemEdit"
          :class="[options.editClass]"
        >
        </i>&nbsp;
        <i
          class="delete-btn"
          v-if="options.showDelete"
          @click="itemDelete"
          :class="[options.deleteClass]"
        >
        </i>
      </span>
    </div>
    <ul class="vue-tree-list" v-show="open" v-if="isFolder">
      <tree-item
        v-for="item in model.children"
        :model="item"
        :options="options"
        :ids="ids"
        :depth="depth + 1"
        :ids-with-parent="idsWithParent"
        :half="half"
        @child-change="childChange"
        @add-a-child="emitAddChild"
        @item-click="emitItemClick"
        @item-edit="emitItemEdit"
        @item-delete="emitItemDelete"
        :key="model.id"
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
      }
    },

    data () {
      return {
        open: false
      }
    },

    created () {
      if (this.options.checkbox) {
        this.idsChange(this.idsWithParent)
      }
      if (this.isFolder && this.depth < this.options.depthOpen) {
        this.open = true
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
      idsWithParent: 'idsChange'
    },

    methods: {
      toggle () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },

      itemClick () {
        this.emitItemClick(this.model.id, this.self)
      },

      addChild () {
        this.emitAddChild(this.model.id, this.self)
      },

      itemEdit () {
        this.emitItemEdit(this.model.id, this.self)
      },

      itemDelete () {
        this.emitItemDelete(this.model.id, this.self)
      },

      emitItemClick (id, item) {
        this.$emit('item-click', id, item)
      },

      emitItemEdit (id, item) {
        this.$emit('item-edit', id, item)
      },

      emitItemDelete (id, item) {
        this.$emit('item-delete', id, item)
      },

      emitAddChild (id, item) {
        this.$emit('add-a-child', id, item)
      },

      toggleChecked () {
        if (this.isFolder) {
          this.deleteHalfChecked(this.model.id)
        }
        if (this.checked) {
          this.delChecked(this.model.id)
          this.delId(this.model.id)
          this.allChildDelete(this.model)
          this.$emit('child-change', false)
        } else {
          this.addChecked(this.model.id)
          if (!this.isFolder || this.options.idsWithParent) {
            this.addId(this.model.id)
          }
          this.allChildAdd(this.model)
          this.$emit('child-change', true)
          if (this.options.checkedOpen && this.isFolder) {
            this.open = true
          }
        }
      },

      addId (id) {
        if (this.ids.indexOf(id) === -1) {
          this.$set(this.ids, this.ids.length, id)
        }
      },

      delId (id) {
        let index = this.ids.indexOf(id)
        if (index > -1) this.$delete(this.ids, index)
      },

      addChecked (id) {
        if (this.idsWithParent.indexOf(id) === -1) {
          this.$set(this.idsWithParent, this.idsWithParent.length, id)
        }
      },

      delChecked (id) {
        let idx = this.idsWithParent.indexOf(id)
        if (idx !== -1) this.$delete(this.idsWithParent, idx)
      },

      setHalfChecked (id) {
        if (this.half.indexOf(id) === -1) {
          this.$set(this.half, this.half.length, id)
        }
      },

      deleteHalfChecked (id) {
        let idx = this.half.indexOf(id)
        if (idx !== -1) {
          this.$delete(this.half, idx)
        }
      },

      childChange (checked) {
        let children
        children = this.model.children
        for (let i = 0, l = children.length; i < l; i++) {
          if (this.half.indexOf(children[i].id) !== -1) {
            this.addChecked(this.model.id)
            if (this.options.idsWithParent) {
              this.addId(this.model.id)
            }
            this.setHalfChecked(this.model.id)
            return
          }
        }
        if (checked) {
          this.addChecked(this.model.id)
          if (this.options.idsWithParent) {
            this.addId(this.model.id)
          }
          let allChecked = true
          for (let i = 0, l = children.length; i < l; i++) {
            if (this.idsWithParent.indexOf(children[i].id) === -1) {
              allChecked = false
              break
            }
          }
          if (allChecked) {
            this.deleteHalfChecked(this.model.id)
          } else {
            this.setHalfChecked(this.model.id)
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
            this.deleteHalfChecked(this.model.id)
            this.delChecked(this.model.id)
            this.delId(this.model.id)
          } else {
            this.setHalfChecked(this.model.id)
          }
          this.$emit('child-change', false)
        }
      },

      allChildAdd (item) {
        if (item.children && item.children.length) {
          for (let i = 0, l = item.children.length; i < l; i++) {
            this.addChecked(item.children[i].id)
            if (!(item.children[i].children && item.children[i].children.length) || this.options.idsWithParent) {
              this.addId(item.children[i].id)
            }
            this.allChildAdd(item.children[i])
          }
        }
      },

      allChildDelete (item) {
        if (item.children && item.children.length) {
          let childIds = this.allChildIds(item, new Array(0))
          for (let i = 0, l = childIds.length; i < l; i++) {
            this.delChecked(childIds[i])
            this.delId(childIds[i])
          }
        }
      },

      allChildIds (item, res) {
        if (item.children && item.children.length) {
          for (let i = 0, l = item.children.length; i < l; i++) {
            res.push(item.children[i].id)
            this.allChildIds(item.children[i], res)
          }
        }
        return res
      },

      idsChange (val) {
        if (this.isFolder && this.depth < this.options.depthOpen) {
          this.open = true
        }
        if (val.indexOf(this.model.id) !== -1) {
          if (this.isFolder && !this.options.idsWithParent) {
            this.delId(val.id)
          }
          this.$emit('child-change', true)
        }
      }
    }
  }
</script>
