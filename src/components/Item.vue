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
                <input type="checkbox" :value="model.id" v-model="checked" @change="change">
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
                       :ids-with-parent="idsWithParent"
                       @child-checked="childChecked"
                       @half-checked="halfChecked"
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
            }
        },

        data() {
            return {
                open: false,
                checked: false
            }
        },

        created() {
            if (this.options.checkbox) {
                this.idsChange(this.options.checkedIds)
            }
        },

        computed: {
            isFolder() {
                return this.model.children && this.model.children.length
            },

            isBold() {
                return {
                    'item-bold': this.isFolder && this.options.folderBold
                }
            },

            checkedIds() {
                return this.idsWithParent
            }
        },

        methods: {
            toggle() {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },

            changeType() {
                if (!this.isFolder && this.options.addItem) {
                    this.emitAddChild(this.model.id)
                } else {
                    return
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

            change(event) {
                if (event.target.checked) {
                    this.addChecked(this.model.id);
                    if (! (this.isFolder && this.options.idsWithParent)) {
                        this.addId(this.model.id)
                    }
                    this.allChildAdd(this.model)
                } else {
                    this.delChecked(this.model.id);
                    this.delId(this.model.id)
                    this.allChildDelete(this.model)
                }
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
                let index = this.idsWithParent.indexOf(id);
                if (index >= 0) this.$delete(this.idsWithParent, index);
            },

            setHalfChecked(id) {
                this.$nextTick(function () {
                    let inputs = document.getElementsByTagName('input');
                    for (let i = 0, len = inputs.length; i < len; i++) {
                        if (parseInt(inputs[i].value, 10) === id) {
                            inputs[i].indeterminate = true;
                            this.$emit('half-checked')
                        }
                    }
                })
            },

            halfChecked() {
                this.setHalfChecked(this.model.id)
            },

            deleteHalfChecked(id) {
                this.$nextTick(function () {
                    let inputs = document.getElementsByTagName('input');
                    for (let i = 0, len = inputs.length; i < len; i++) {
                        if (parseInt(inputs[i].value, 10) === id) inputs[i].indeterminate = false
                    }
                })
            },

            childChecked(checked) {
                if (checked) {
                    this.addChecked(this.model.id);
                    let child = this.model.children;
                    let all = false;
                    for (let i = 0, len = child.length; i < len; i++) {
                        if (this.checkedIds.indexOf(child[i].id) < 0) {
                            all = false;
                            break;
                        } else {
                            all = true;
                        }
                    }
                    if (all) {
                        this.deleteHalfChecked(this.model.id);
                    } else {
                        this.setHalfChecked(this.model.id)
                    }
                } else {
                    let child = this.model.children;
                    let none = false;
                    for (let i = 0, len = child.length; i < len; i++) {
                        if (this.checkedIds.indexOf(child[i].id) >= 0) {
                            none = false;
                            break;
                        } else {
                            none = true;
                        }
                    }
                    if (none) {
                        let noneChild = true;
                        let childIds = this.allChildIds(this.model, new Array(0));
                        let checkedIds = this.checkedIds;
                        for (let i = 0, len = checkedIds.length; i < len; i++) {
                            if (childIds.indexOf(checkedIds[i]) >= 0) {
                                noneChild = false;
                                break;
                            }
                        }
                        if (noneChild) {
                            this.delChecked(this.model.id);
                            this.delId(this.model.id);
                            this.deleteHalfChecked(this.model.id)
                        }
                    } else {
                        this.setHalfChecked(this.model.id)
                    }
                }
            },

            allChildAdd(item) {
                if (item.children && item.children.length) {
                    for (let i = 0, len = item.children.length; i < len; i++) {
                        this.addChecked(item.children[i].id);
                        if (!((item.children[i].children && item.children[i].children.length) && this.options.idsWithParent)) {
                            this.addId(item.children[i].id)
                        }
                        this.allChildAdd(item.children[i]);
                    }
                }
            },

            allChildDelete(item) {
                if (item.children && item.children.length) {
                    for (let i = 0, len = item.children.length; i < len; i++) {
                        this.delChecked(item.children[i].id);
                        this.delId(item.children[i].id);
                        this.allChildDelete(item.children[i]);
                    }
                }
            },

            allChildIds(item, res) {
                if (item.children && item.children.length) {
                    for (let i = 0, len = item.children.length; i < len; i++) {
                        res.push(item.children[i].id);
                        this.allChildIds(item.children[i], res);
                    }
                }
                return res;
            },

            idsChange(val) {
                if (val.indexOf(this.model.id) >= 0) {
                    this.checked = true;
                    if (this.options.checkedOpen && this.isFolder) {
                        this.open = true
                    }
                    this.$emit('child-checked', true);
                } else {
                    this.checked = false;
                    this.$emit('child-checked', false);
                }
            }
        },

        watch: {
            checkedIds: 'idsChange'
        }
    }
</script>
