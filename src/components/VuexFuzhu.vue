<template>
    <div>
        <h3>vuex辅助工具测试使用</h3>
        <h4>{{names}}</h4>
        <h5>{{manesFu}}</h5>
        <h5>Vuex中的getters的changeState: {{changeStates}}</h5>
        <button @click="muFuMutation">点击辅助获取muFu辅助</button>
        <button @click="myFuzhuActions(10)">点击辅助工具</button>
        <h5>{{count}}</h5>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
    data() {
        return {
            names: '123'
        }
    },
    computed: {
        ...mapState({
            manesFu: state => state.Vuexceshi.nameFu,
            count: state => state.Vuexceshi.count
        }),
        // 使用getters辅助函数，使用对象方式时名称可以不一致
        ...mapGetters({
            changeStates: 'changeState'
        })
    },
    methods: {
        onClick () {
            console.log(this.nameFu)
        },
        ...mapMutations({
            muFuMutation: 'muFuMutation'
        }),
        ...mapActions({
            myFuzhuActions: 'myFuActions'
        })
    }
}
</script>
