<template>
    <ul id="vue-tree" style="list-style-type: none;">
        <tree-item class="tree-item"
                   :model="treeData"
                   :options="termOptions"
                   @add-a-child="addAChild"
                   @item-edit="itemEdit"
                   @item-delete="itemDelete">
        </tree-item>
    </ul>
</template>
<script>
    import Item from './Item.vue'
    export default {
        props: {
            treeData: Object,
            options: Object,
        },
        data () {
            return {
                defaultOptions: {
                    dispalyName: 'name',
                    addItem: false,
                    checkbox: false,
                    checkedIds: [],
                    checkedOpen: false,
                    openClass: 'fa fa-plus-square text-info',
                    closeClass: 'fa fa-minus-square text-danger',
                    addClass: 'fa fa-plus text-danger',
                    showEdit: false,
                    showDelete: false,
                    editClass: 'fa fa-edit',
                    deleteClass: 'fa fa-trash-o'
                },
                termOptions: {},
            }
        },
        created () {
            this.initOptions()
        },
        methods:{
            addAChild(id){
                this.$emit('add-a-child', id)
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
            },
        }
    }
</script>
