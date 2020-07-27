<template>
    <div>
        vueDesign
         <a-cascader :options="options" placeholder="Please select" @change="onChange" @blur="dele" :value="chanDara" />
         
    </div>
</template>
<script>
    export default {
        data() {
            return {
                props: ['cascaderValue'],
                options: [
                    {
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [
                        {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                            value: 'xihu',
                            label: 'West Lake',
                            },
                        ],
                        },
                    ],
                    },
                    {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [
                        {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men',
                            },
                        ],
                        },
                    ],
                    },{
                        value: 'zhuangzhuang',
                        label: 'zhuangzhuang'
                    }
                ],
                chanDara: []
            };
        },
        methods: {
            onChange(value) {
                this.chanDara = value
                // console.log(value);
            },
            // deleteData() {
            //     this.chanDara = [];
            // },
            dele(value) {
                // console.log(value)
                this.chanDara = [];
            }
        },
        watch: {
            cascaderValue(val) {
                console.log(val)
            } 
        }
    }
</script>