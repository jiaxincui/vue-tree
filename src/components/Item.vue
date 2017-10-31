<template>
    <li class="vue-tree-item">
        <div class="item-wrapper" onselectstart="return false;">
            <span v-if="options.checkbox">
                <input type="checkbox" :value="model.id" v-model="checked" @change="change">
            </span>
            <span :style="{fontWeight: isFolder && options.folderBold ? 'bold' : 'normal'}"
                  @click="toggle"
                  @dblclick="changeType">{{model[options.dispalyName]}}
            </span>
            <span class="item-toggle"
                  v-if="isFolder"
                  @click="toggle">
                <i :class="[open ? options.closeClass : options.openClass]"></i>
            </span>
            <span class="item-btn">
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
                       @child-checked="childChecked"
                       @add-a-child="emitAddChild"
                       @item-edit="emitItemEdit"
                       @item-delete="emitItemDelete"
                       :key="model.id">
            </tree-item>
            <li class="tree-add" @click="addChild" v-if="options.addItem">
                <small><i :class="[options.addClass]"></i></small>
            </li>
        </ul>
    </li>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: 'tree-item',
        props: {
            model: Object,
            options: Object,
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
                return this.model.children &&
                    this.model.children.length
            },
            checkedIds() {
                return this.options.checkedIds
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
            addChild() {
                this.emitAddChild(this.model.id)
            },
            itemEdit() {
                this.emitItemEdit(this.model.id)
            },
            itemDelete() {
                this.emitItemDelete(this.model.id)
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
                    this.allChildAdd(this.model)
                } else {
                    this.delChecked(this.model.id);
                    this.allChildDelete(this.model)
                }
            },
            addChecked(id) {
                if (this.options.checkedIds.indexOf(id) < 0) {
                    Vue.set(this.options.checkedIds, this.options.checkedIds.length, id);
                }
            },
            delChecked(id) {
                let index = this.options.checkedIds.indexOf(id);
                if (index >= 0) Vue.delete(this.options.checkedIds, index);
            },
            childChecked(checked) {
                if (checked) {
                    this.addChecked(this.model.id)
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
                            this.deleteHalfChecked(this.model.id)
                        }
                    } else {
                        this.setHalfChecked(this.model.id)
                    }
                }
            },
            setHalfChecked(id) {
                this.$nextTick(function () {
                    let inputs = document.getElementsByTagName('input');
                    for (let i = 0, len = inputs.length; i < len; i++) {
                        if (parseInt(inputs[i].value, 10) === id) inputs[i].indeterminate = true
                    }
                })
            },
            deleteHalfChecked(id) {
                this.$nextTick(function () {
                    let inputs = document.getElementsByTagName('input');
                    for (let i = 0, len = inputs.length; i < len; i++) {
                        if (parseInt(inputs[i].value, 10) === id) inputs[i].indeterminate = false
                    }
                })
            },
            allChildAdd(item) {
                if (item.children && item.children.length) {
                    for (let i = 0, len = item.children.length; i < len; i++) {
                        this.addChecked(item.children[i].id);
                        this.allChildAdd(item.children[i]);
                    }
                }
            },
            allChildDelete(item) {
                if (item.children && item.children.length) {
                    for (let i = 0, len = item.children.length; i < len; i++) {
                        this.delChecked(item.children[i].id);
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

<style scoped>
    .vue-tree-item {
        cursor: pointer;
        padding: 5px
    }
    .item-btn {
        display: none;
        padding-left: 20px
    }
    .item-wrapper:hover .item-btn {
        display: inline
    }
</style>