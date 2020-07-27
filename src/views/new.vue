<template>
    <div class="new">
        <h3>new</h3>
        <div>
            <h2>{{name}}</h2>
            <h3>{{initData}}</h3>
            <h3>{{num}}</h3>
            <h4>{{mixinNum}}</h4>
        </div>
        <ceshi></ceshi>
    </div>
</template>
<script>
import mixin from '../utils/mixin.js'
import ceshi from '../components/ceshi.vue'
export default {
    mixins: [mixin],
    components: {
        ceshi
    },
    data() {
        return {
            name: '混入组件',
            num: 10,
            mixinNum: this.doubleNum(10)
        }
    },
    mounted() {
        console.log('hunru组件的挂在输出')
        console.log(this.$route.path)
        console.log(this.$route.params)
    }
}
</script>

