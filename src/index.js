import VueTree from './components/Vue-tree.vue';

VueTree.install = function(Vue) {
    Vue.component('vue-tree', VueTree)
};

export default VueTree