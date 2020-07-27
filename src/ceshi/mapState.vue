<template>
    <div class="hello">
        <h1>{{msg}} </h1>
        <h2>{{$store.state.count}} </h2>
        <h2>{{count}} </h2>
        <button @click="clickAdd">新增</button>

        <button @click="ADD">+</button>

    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            msg: 'Vuex text'
        }
    },
    // 方式1：在计算属性computed中直接赋值
    computed: {
        count() {
            // this指的是main.js中的vue实例对象
            return  this.$store.state.count;
        }
    },
    // 方式2：通过mapState的对象来赋值
    computed: mapState({
        // es5
        count: function (state) {
            return state.count;
        },
        // es6
        count: state => state.count;
    }),
    // 方式3：通过mapState的对象来赋值
    computed: mapState(['count']),
    //方式4：通过mapState的JSON来赋值
    computed: mapState({
        count: 'count'
    }),
    methods: {
        clickAdd() {
            // 分发action中的add方法
            this.$store.dispatch('add', 1)
        },
        mapMutations() {
            'ADD'
        }
    }
}
</script>
