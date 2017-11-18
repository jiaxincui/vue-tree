<template>
    <ul class="vue-tree">
        <tree-item
                v-for="item in treeData"
                :model="item"
                :options="termOptions"
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
            }
        },
        data () {
            return {
                defaultOptions: {
                    itemName: 'name',
                    checkbox: true,
                    checkedIds: [],
                    checkedOpen: true,
                    folderBold: true,
                    showAdd: true,
                    showEdit: true,
                    showDelete: true,
                    addClass: 'fa fa-plus-square-o',
                    editClass: 'fa fa-edit',
                    deleteClass: 'fa fa-trash-o',
                    openClass: 'fa fa-angle-right',
                    closeClass: 'fa fa-angle-down'
                },
                termOptions: {}
            }
        },
        created () {
            this.initOptions()
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
                this.termOptions = Object.assign({}, this.defaultOptions, this.options)
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
