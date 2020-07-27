<template>
    <div>
        <Button type="primary" icon="ios-search">搜索</Button>
        <Button><Icon type="ios-arrow-back" size="15" color="red"></Icon> search</Button>
        <Icon type="ios-checkmark" />
        <Icon type="android-close"></Icon>

        <i-table width="550" border :columns="columns2" :data="data3"></i-table>

        
    </div>
</template>
<script>
    // import { getList } from '../api/iview.js'
    export default {
        data () {
            return {
                columns2: [
                    {
                        title: '姓名',
                        key: 'name',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        width: 100
                    },
                    {
                        title: '省份',
                        key: 'province',
                        width: 100
                    },
                    {
                        title: '市区',
                        key: 'city',
                        width: 100
                    },
                    {
                        title: '地址',
                        key: 'address',
                        width: 200
                    },
                    {
                        title: '邮编',
                        key: 'zip',
                        width: 100
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
                        render (h, params) {
                            return h("div", [
                                h(
                                    "span", 
                                    {
                                        style: {
                                            cursor: 'pointer',
                                            marginRight: '10px',
                                            color: '#2d8cf0'
                                        },
                                        on: {
                                            click: () => {
                                                console.log(params.row._index)
                                            }
                                        }
                                    },
                                     "查看"
                                ),
                                h(
                                    "span", {}, "编辑"
                                )
                            ]);
                        }
                    }
                ],
                data3: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居',
                        province: '北京市',
                        city: '朝阳区',
                        zip: 100000
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗',
                        province: '北京市',
                        city: '海淀区',
                        zip: 100000
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道',
                        province: '上海市',
                        city: '浦东新区',
                        zip: 100000
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道',
                        province: '广东',
                        city: '南山区',
                        zip: 100000
                    }
                ]
            }
        },
        methods: {
            getLists: function () {
                // getList({
                //     page: 1,
                //     offset: 20,
                //     name: ''

                // }).then(res => {
                //     console.log(res)
                // })
                this.axios({
                    url: 'pcbasedata/actual02',
                    method: 'get',
                    params: {
                       callbackparam: 'jQuery112406461467470090052_1593401110400',
                       _: 1593401111426
                    } 
                }).then(res => {
                    console.log(res)
                })
            }
        },
        mounted() {
           this.getLists()
        }
    }
</script>