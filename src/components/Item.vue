<template>
    <li class="vue-tree-item">
        <div class="item-wrapper" onselectstart="return false;">
            <span class="item-toggle"
                  v-if="isFolder"
                  @click="toggle">
                <i :class="[open ? options.closeClass : options.openClass]"></i>
            </span>
            <span class="item-toggle" v-else> </span>
            <span class="item-checkbox" v-if="options.checkbox">
                <input type="checkbox" :value="model.id" ref="checkbox">
                <label class="item-label" @click="toggleChecked"><span :class="[labelChecked]"></span></label>
            </span>
            <span :class="isBold"
                  @click="itemClick">{{model[options.itemName]}}
            </span>
            <span class="item-btn">
                <i class="add-btn"
                   v-if="options.showAdd"
                   @click="addChild"
                   :class="[options.addClass]"></i>&nbsp;
                <i class="edit-btn"
                   v-if="options.showEdit"
                   @click="itemEdit"
                   :class="[options.editClass]"></i>&nbsp;
                <i class="delete-btn"
                   v-if="options.showDelete"
                   @click="itemDelete"
                   :class="[options.deleteClass]"></i>
            </span>
        </div>
        <ul class="vue-tree-list" v-show="open" v-if="isFolder">
            <tree-item v-for="item in model.children"
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
                       :key="model.id">
            </tree-item>
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

        data() {
            return {
                open: false,
                // checked: false,
                // selfHalfChecked: false
            }
        },

        created() {
            if (this.options.checkbox) {
                this.idsChange(this.idsWithParent)
            }

            if (this.isFolder && this.depth < this.options.depthOpen) {
                this.open = true
            }
        },

        computed: {
            labelChecked() {
                if (this.half.indexOf(this.model.id) >= 0) {
                    return this.options.halfCheckedClass
                } else if (this.idsWithParent.indexOf(this.model.id) >= 0) {
                    return this.options.checkedClass
                } else {
                    return this.options.unCheckedClass
                }
            },

            checked() {
                return this.idsWithParent.indexOf(this.model.id) >= 0
            },

            halfChecked() {
                return this.half.indexOf(this.model.id) >= 0;
            },

            isFolder() {
                return this.model.children && this.model.children.length
            },

            isBold() {
                return {
                    'item-bold': this.isFolder && this.options.folderBold
                }
            }
        },

        watch: {
            idsWithParent: 'idsChange',
        },

        methods: {
            toggle() {
                if (this.isFolder) {
                    this.open = ! this.open
                }
            },

            changeType() {
                if (! this.isFolder && this.options.addItem) {
                    this.emitAddChild(this.model.id)
                }
            },

            itemClick() {
                this.emitItemClick(this.model.id)
            },

            addChild() {
                this.emitAddChild(this.model.id)
            },
            itemEdit() {
                this.emitItemEdit(this.model.id)
            },

            itemDelete() {
                this.emitItemDelete(this.model.id)
            },

            emitItemClick(id) {
                this.$emit('item-click', id)
            },

            emitItemEdit(id) {
                this.$emit('item-edit', id)
            },

            emitItemDelete(id) {
                this.$emit('item-delete', id)
            },

            emitAddChild(id) {
                this.$emit('add-a-child', id)
            },

            toggleChecked() {
                if (this.checked) {
                    this.delChecked(this.model.id);
                    this.delId(this.model.id);
                    this.allChildDelete(this.model)
                } else {
                    this.addChecked(this.model.id);
                    if (! this.isFolder || this.options.idsWithParent) {
                        this.addId(this.model.id)
                    }
                    this.allChildAdd(this.model);
                }
                if (this.isFolder) {
                    this.deleteHalfChecked(this.model.id);
                }
                console.log(this.idsWithParent)
                this.$emit('child-change')

            },

            addId(id) {
                if (this.ids.indexOf(id) < 0) {
                    this.$set(this.ids, this.ids.length, id);
                }
            },

            delId(id) {
                let index = this.ids.indexOf(id);
                if (index >= 0) this.$delete(this.ids, index);
            },

            addChecked(id) {
                if (this.idsWithParent.indexOf(id) < 0) {
                    this.$set(this.idsWithParent, this.idsWithParent.length, id);
                }
            },

            delChecked(id) {
                let idx = this.idsWithParent.indexOf(id);
                if (idx >= 0) this.$delete(this.idsWithParent, idx);
            },

            setHalfChecked(id) {
                if (this.half.indexOf(id) < 0) {
                    this.$set(this.half, this.half.length, id);
                }
            },

            deleteHalfChecked(id) {
                let idx = this.half.indexOf(id);
                if (idx >= 0) {
                    this.$delete(this.half, idx);

                }
            },

            childChange(checked) {
                if (checked) {

                } else {

                }


                let children = this.model.children;
                let allChild = true;
                let none = true;
                for (let i = 0, l = children.length; i < l; i++) {
                    if (this.idsWithParent.indexOf(children[i].id) < 0) {
                        allChild = false;
                        break;
                    }
                }
                if (allChild) {
                    this.deleteHalfChecked(this.model.id);
                } else {
                    for (let i = 0, l = children.length; i < l; i++) {
                        if (this.idsWithParent.indexOf(children[i].id) >= 0) {
                            none = false;
                            break;
                        }
                    }
                    if (none) {
                        console.log('none' + this.model.id)
                        this.delChecked(this.model.id)
                        this.deleteHalfChecked(this.model.id)
                    } else {
                        // console.log(this.model.id)
                        this.addChecked(this.model.id)
                        this.setHalfChecked(this.model.id);

                    }
                }
                this.$emit('child-change')
                // this.deleteHalfChecked(this.model.id)
            },

            allChildAdd(item) {
                if (item.children && item.children.length) {
                    for (let i = 0, l = item.children.length; i < l; i++) {
                        this.addChecked(item.children[i].id);
                        if (! (item.children[i].children && item.children[i].children.length) || this.options.idsWithParent) {
                            this.addId(item.children[i].id)
                        }
                        this.allChildAdd(item.children[i]);
                    }
                }
            },

            allChildDelete(item) {
                if (item.children && item.children.length) {
                    let childIds = this.allChildIds(item, new Array(0));
                    for (let i = 0, l = childIds.length; i < l; i++) {
                        this.delChecked(childIds[i]);
                        this.delId(childIds[i]);
                    }
                }
            },

            allChildIds(item, res) {
                if (item.children && item.children.length) {
                    for (let i = 0, l = item.children.length; i < l; i++) {
                        res.push(item.children[i].id);
                        this.allChildIds(item.children[i], res);
                    }
                }
                return res;
            },

            idsChange(val) {
                if (this.isFolder && this.depth < this.options.depthOpen) {
                    this.open = true
                }
                if (val.indexOf(this.model.id) >= 0) {
                    if (this.options.checkedOpen && this.isFolder) {
                        this.open = true
                    }
                    if (this.isFolder && ! this.options.idsWithParent) {
                        this.delId(val.id)
                    }
                }
            }
        }
    }
</script>
