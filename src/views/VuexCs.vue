<template>
    <div>
        <h3>Vuex</h3>
        <h4>{{this.$store.state.Vuexceshi.names}}</h4>
        <button @click="ceshiMutation">测试mutation</button>
        <button @click="ceshiMutation2">测试mutation(传参第二种写法)</button>
        
        <button @click="ceshiaction">测试action</button>
        <button @click="ceshiaction2">测试action(传参第二种写法)</button>


        <vuex-fuzhu></vuex-fuzhu>

    </div>
</template>
<script>
import VuexFuzhu from '../components/VuexFuzhu'
// import {mapState } from ''
export default {
    components: {
        VuexFuzhu
    },
    data() {
        return {
            name: '壮壮123',
            name2: 'zhuangzhuang123',
            nameAction: '123456789',
            nameAction2: 'action123456'
        }
    },
    methods: {
        ceshiMutation() {
            this.$store.commit('ceshiMutation', {name: this.name})
        },
        ceshiMutation2() {
            this.$store.commit({
                type: 'ceshiMutation2',
                name: this.name2
            })
        },
        //测试mutations
        ceshiaction() {
            this.$store.dispatch('ceshiaction', {name: this.nameAction})
        },
        ceshiaction2() {
            this.$store.dispatch({
                type: 'ceshiaction2',
                name: this.nameAction2
            })
        }
    }
}
</script>
