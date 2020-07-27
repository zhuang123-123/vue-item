<template>
    <div>
        <Card>
            <div style="margin: 10px 0">
                <Form ref="formValidate" :model="formValidate" :inline="true">
                    <FormItem prop="agent">
                        <Select @on-clear="formValidate.hostGuest = ''" @on-open-change="formValidate.hostGuest = ''" clearabel style="width: 150px;" v-model="formValidate.agent" filterable placeholder="请选择代理商">
                            <Option style="width: 150px;" :value="item.id" v-for="item in agentlist" :key="item.id">{{item.companyName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="hostGuest">
                        <selectPage style="width: 150px;" v-model="formValidate.hostGuest" :parentMsg="formValidate.agent"></selectPage>
                    </FormItem>
                    <FormItem prop="grade">
                        <Select clearabel style="width: 148px;" v-model="formValidate.grade" filterable placeholder="请选择广告组状态">
                            <Option style="width: 150px;" :value="item.dictCode" v-for="item in statusList" :key="item.dictCode">{{item.dictName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="originality">
                        <Input v-model="formValidate.originality" style="width: 200px;" placeholder="请输入广告组名称/组ID"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
                        <Button @click="handleReset('formValidate')" style="margin: 0 10px 0 8px;">重置</Button>
                    </FormItem>
                </Form>
            </div>
            <Table
                class="table"
                ref="tables"
                :total="dataCount"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                :loading="loading">
            </Table>
            <div style="margin-top: 10px;">
                <!-- 分页 -->
                <Page 
                    :total="dataCount" :current="pageNum"
                    :page-size="pageSize" show-total show-elevator
                    show-sizer :page-size-opts="pageSizeList" @on-page-size-change="changepize" @on-change="changepage" />
            </div>
        </Card>
    </div>
</template>
<script>
import selectPage from '@/selectPage.vue';
import MyModal from '_c/my-modal'
import { groupLent, creativeSelect, guestSelect } from '@/api/hzz';
import { configDic } from '@/api/common';
export default {
    components: {
        MyModal,
        selectPage
    },
    data() {
        return {
            formValidate: {
                agent: null,
                hostGuest: null,
                status: null,
                originality: '',
                grade: null,
            },
            loading: false,  // 加载中
            //分页
            dataCount: 0,  // 初始化信息总条数
            pageNum: 1, // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            // 代理商
            agendList: [],
            // 广告主、直客
            hostGuestList: [],
            // 广告计划状态
            statusList: [],
            // 推广目标列表
            targetList: [
                {key: '1', value: '网页'},
                {key: '2', value: '应用下载'},
                {key: '3', value: '小程序'},
                {key: '4', value: '唤醒链接'},
            ],
            // 列表
            columns: [
                {
                    title: '组ID',
                    align: 'center',
                    key: 'groupId'
                }, {
                    title: '广告组名称',
                    align: 'center',
                    key: 'name'
                }, {
                    title: '广告主名称',
                    align: 'center',
                    key: 'companyName'
                }, {
                    title: '推广目标',
                    align: 'center',
                    key: 'promotionTarget',
                    render: (h, params) => {
                        const _text = this.targetList.filter(item => item.key === params.row.promotionTarget)[0].value
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, _text),
                        ])
                    }
                }, {
                    title: '广告组状态',
                    align: 'center',
                    key: 'groupDeliveryStatus',
                    render: (h, params) => h('span', {},
                        this.statusList.map(res => {
                            if (res.dictCode == params.row.groupDeliveryStatus) {
                                return res.dictName
                            }
                        })
                    )
                }, {
                    title: '广告计划数',
                    align: 'center',
                    key: 'adNum',
                    render: (h, params) => {
                        let a = params.row.adUnNumBers ? params.row.adUnNumBers : 0
                        let b = params.row.adNum ? params.row.adNum : 0
                        let _text = a + '/' + b
                        return h('div', [
                            h('span', {
                                style: {
                                    color: 'rgb(0, 153, 255)',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: '_ad-list',
                                            params: {
                                                groupId: params.row.groupId
                                            }
                                        });
                                    }
                                }
                            }, _text),
                        ])
                    }
                }, {
                    title: '广告创意数',
                    align: 'center',
                    key: 'creativityNum',
                    render: (h, params) => {
                        let a = params.row.creativityNum ? params.row.creativityNum : 0
                        let b = params.row.creativityUnNumber ? params.row.creativityUnNumber : 0
                        let _text = a + '/' + b
                        return h('div', [
                            h('span', {
                                style: {
                                    color: 'rgb(0, 153, 255)',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: '_creative',
                                            params: {
                                                groupId: params.row.groupId
                                            }
                                        })
                                    }
                                }
                            }, _text),
                        ])
                    }
                }, {
                    title: '预算',
                    align: 'center',
                    key: 'dailyBudget',
                    render: (h, params) => {
                        return h('div', [
                            h('span', params.row.dailyBudget == '-1' ? '不限' : params.row.dailyBudget)
                        ]);
                    }
                }, {
                    title: '日消耗',
                    align: 'center',
                    key: 'cost'
                }
            ],
            tableData: []
        }
    },
    computed: {},
    mounted() {
        this.getGroupDeliveryStatusList()
        this.accountsList()
        this.creativeList()
        this.guestClick();
    },
    methods: {
        // 获取广告组状态列表
        getGroupDeliveryStatusList() {
            configDict({type: 'groupDeliveryStatus'}).then(res => {
                this.statusList = res.data.data;
            })
        },
        // 列表
        accountsList() {
            let self = this;
            self.loading = true;
            let data = {
                pageNum: self.pageNum,
                pageSize: self.pageSize,
                agentId: self.formValidate.agent,
                adUserId: self.formValidate.hostGuest,
                deliveryStatus: self.formValidate.grade,
                name: self.formValidate.originality
            }
            groupLent(data).then(res => {
                self.tableData = res.data.data.list;
                self.dataCount = res.data.data.total;
                self.loading = false;
            }).catch(error => {})
        },
        // 创意下拉
        creativeList () {
            let self = this;
            var data = {
                category: 2
            }
            creativeSelect(data).then(res => {
                self.agentList = res.data.data;
            })
        },
        daili () {
            this.guestClick();
        },
        guestClick() {
            let self = this;
            let data = {
                id: self.formValidate.agent
            }
            guestSelect(data).then(res => {
                console.log('广告主/直客')
                console.log(res)
                self.hostGuestList = res.data.data;
            })
        },
        dakai (data) {
            if (data == true) {
                this.formValidate.hostGuest = '';
            }
        },
        // 查询
        handleSubmit () {
            this.pageNum = 1;
            this.accountsList();
        },
        // 重置
        handleReset (formValidate) {
            this.$refs['formValidate'].resetFields();
            this.pageNum = 1;
            this.accountsList();
        },
        // 分页
        changepage (index) {
            this.pageNum = index;
            this.accountsList();
        },
        // 显示条数
        changepize (val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.accountsList();
        }
    },
    // keep-alive  生命周期-进入页面时
    activated() {}
}
</script>
<style lang="less">
.detailsClass .ivu-form-item {
    margin-bottom: 15px;
}
.table {
    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
}
</style>
