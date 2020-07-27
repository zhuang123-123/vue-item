<template>
    <div>
       <h2> scrollIng</h2>
       <p v-for="item in list" v-bind:key="item">
           Line:
           <span v-text="item"></span>
       </p>
       <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
          <loading slot="spinner"></loading>
       </infinite-loading>
    </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import Loading from '../components/Loading'

import { setTimeout } from 'timers';
export default {
    components: {
        InfiniteLoading,
        Loading
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
        onInfinite() {
            setTimeout(() => {
                const temp = [];
                for (let i = this.list.length + 1; i <= this.list.length + 20; i++) {
                    temp.push(i);
                }
                this.list = this.list.concat(temp);
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }, 1000)
        }
    }
}
</script>
<style>

</style>


