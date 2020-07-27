<template>
    <div>
        <h3>vue-design-parent</h3>
        <!-- <button @click="close">新建</button> -->
        <vue-design :cascaderValue="regionVal"></vue-design>
        <Button @click="deleteData">删除内容</Button>
    </div>
</template>
<script>
import vueDesign from './vueDesign.vue'
export default {
    components: {
        vueDesign
    },
    data() {
        return {
            clos: false,
            regionVal: []
        }
    },
    methods: {
        // close() {
        //     this.$emit('chuangeizizujian', )
        // }
        deleteData() {
            this.regionVal = [];
        }
    }
}
</script>
