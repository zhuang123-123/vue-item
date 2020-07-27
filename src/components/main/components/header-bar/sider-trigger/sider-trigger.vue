<template>
    <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']" href=""><Icon :type="icon" :size="size" /></a>
</template>
<script>
export default {
    name: 'siderTrigger',
    props: {
        collapse: Boolean,
        icon: {
            type: String,
            default: 'navicon-round'
        },
        size: {
            type: Number,
            default: 26
        }
    },
    methods: {
        handleChange() {
            this.$emit('on-change', !this.collapsed)
        }
    },
    mounted() {
        console.log(this.collapsed)
    }
}
</script>
