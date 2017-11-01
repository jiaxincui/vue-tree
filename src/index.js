import VueTree from './components/VueTree.vue';

VueTree.install = function(Vue) {
    Vue.component('vue-tree', VueTree)
};

export default VueTree