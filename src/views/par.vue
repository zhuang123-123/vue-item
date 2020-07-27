<template>
    <div>
        <child :items="events" :title="childChuan"></child>
    </div>

</template>

<script>
    import Child from '../components/child'
    export default {
        components: { Child },
        data() {
            return {
                events: [
                    {id: 0, data: 'one0', sec: 'one00'},
                    {id: 1, data: 'one1', sec: 'one11'},
                    {id: 2, data: 'one2', sec: 'one22'},
                    {id: 3, data: 'one3', sec: 'one33'},
                    {id: 4, data: 'one4', sec: 'one44'}
                ],
                childChuan: '传值'
            }
        }
    }
</script>