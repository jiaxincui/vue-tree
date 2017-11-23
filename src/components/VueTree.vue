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
                :key="item.id">
        </tree-item>
    </ul>
</template>

<script>
    import Item from './Item.vue'
    import '../vue-tree.css'

    export default {
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

                },
                termOptions: {},
                idsWithParent: []
            }
        },

        created () {
            this.initOptions()
        },

        computed: {
            initIds() {
                return this.ids;
            }
        },

        methods:{
            addAChild(id){
                this.$emit('add-a-child', id)
            },
            itemClick(id){
                this.$emit('item-click', id)
            },
            itemEdit(id) {
                this.$emit('item-edit', id)
            },
            itemDelete(id) {
                this.$emit('item-delete', id)
            },
            initOptions () {
                this.termOptions = Object.assign({}, this.defaultOptions, this.options);
                if (! (this.termOptions.checkedIds && this.termOptions.checkedIds.length) || this.ids.length) {
//                    for (let i = 0, len = this.ids.length; i < len; i++) {
//                        this.idsWithParent.push(this.ids[i])
//                    }
                    this.idsWithParent = this.ids.slice(0)
//                    this.idsWithParent = this.ids.sort();
//                    this.$set(this.idsWithParent)
//                    this.idsWithParent = Object.assign({}, this.idsWithParent, this.initIds)
                }
            }
        },

        components: {'tree-item': Item},

        watch: {
            options: {
                handler: function (val, oldVal) {
                    this.initOptions()
                },
                deep: true
            }
        }
    }
</script>
