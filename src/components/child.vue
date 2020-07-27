<template>
    <div class="child">
        <template v-for="item in items">
            {{item.id}}-- {{item.data}}== {{item.sec}}
        </template>
        <h4>{{title}}</h4>

    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true  // 必填
        },
        title: {
            type: String,
            default: ""
        },
        value: {
            type: Boolean,  // 类型
            default: false  // 默认值
        }
    },
    watch: {
        value(val) {
            console.log(val)
        }
    }
}
</script>
