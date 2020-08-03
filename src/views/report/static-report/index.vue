<template>
    <!-- 离线订单报表 -->
    <div style="min-width: 160px;">
        <Card>
            <div style="margin: 10px 0;">
                <Form ref="formValidate" :model="formValidate" :inline="true">
                    <FormItem prop="hostGuest">
                        <DatePicker
                            :value="date"
                            @on-change="timeChange"
                            :options="pickerOptions"
                            :transfer="true" split-panels type="daterange" placeholder="Select date" style="width: 200px;"></DatePicker>
                    </FormItem>
                    <FormItem prop="agent">
                        <Select @on-clear="formValidate.hostGuest=''" @on-open-change="formValidate.hostGuest=''" clearable style="width: 150px;" v-model="formValidate.agent" filterable placeholder="请选择代理商">
                            <Option style="width: 150px;" :value="item.id" v-for="item in agentList" :key="item.id">{{item.companyName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="hostGuest">
                        <SelectPage style="width: 150px;" v-model="formValidate.hostGuest" :parentMsg="formValidate.agent"></SelectPage>
                    </FormItem>
                    <FormItem prop="group">
                        <Select clearable style="width: 148px;" v-model="formValidate.group" @on-change="getPlanByGroup" filterable placeholder="请选择广告组">
                            <Option style="width: 150px;" :value="item.id" v-for="item in groupList" :key="item.id">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="plan">
                        <Select clearable style="width: 148px;" v-model="formValidate.plan" filterable placeholder="请选择广告计划">
                            <Option style="width: 150px;" :value="item.id" v-for="item in planList" :key="item.id">{{item.value}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="creativityName">
                        <Input v-model="formValidate.creativityName" style="width: 200px;" placeholder="请输入广告创意名称" />
                    </FormItem>
                    <FormItem v-show="position">
                        <Select @on-change="positionClick" @on-open-change="shouqi" clearable style="width: 148px;" v-model="formValidate.position" filterable placeholder="请选择投放位置">
                            <Option style="width: 150px;" :value="item.dictCode" v-for="item in positionList" :key="item.dictCode">{{item.dictName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="style">
                        <Select clearable style="width: 148px;" v-model="formValidate.style" filterable placeholder="请选择广告样式" not-found-text="请先选择投放位置">
                            <Option style="width: 150px;" :value="item.id" v-for="item in styleList" :key="item.id">{{item.styleName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="grade">
                        <Select clearable style="width: 148px;" v-model="formValidate.grade" filterable placeholder="请选择广告计划状态">
                            <Option style="width: 150px;" :value="item.scope" v-for="item in statusList" :key="item.scope">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searckKey" prop="deliveryMethod">
                        <Select clearable style="width: 148px;" v-model="formValidate.deliveryMethod" filterable placeholder="请选择投放方式">
                            <Option style="width: 150px;" :value="item.scope" v-for="item in touFangList" :key="item.scope">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searckKey" prop="paymentMethod">
                        <Select clearable style="width: 148px;" v-model="formValidate.paymentMethod" filterable placeholder="请选择付费方式">
                            <Option style="width: 150px;" :value="item.scope" v-for="item in paymentMethodList" :key="item.scope">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem style="width: 20%;" prop="qid">
                        <FormItem>
                            <div style="float: left;">
                                <Button type="primary" @click="handleSubmit('formValidate')"> 查询 </Button>
                                <Button @click="handleReset('formValidate')" style="margin: 0 10px 0 8px">重置 </Button>
                            </div>
                            <div style="float: right;">
                                <div style="cursor: pointer;" @click="changeSearch(false)" v-if="searchKey"> 收起</div>
                                <div style="cursor: pointer;" @click="changeSearch(true)" v-if="!searckKey">展开</div>
                            </div>
                        </FormItem>
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
                <Page 
                    :total="dataCount" :current="pageNum"
                    :page-size="pageSize" show-total show-elevator
                    show-sizer :page-size-opts="pageSizeList" @on-page-size-change="changepize" @on-change='changepage' />
            </div>
        </Card>
    </div>
</template>

<script>
import MyModal from '_c/my-modal';
import selectPage from '@/selectPage.vue';
import {getConfigDict} from '@/api/common';
import {
    getOffLineList,
    creativeSelect,
    selectOption,
    planSelect,
    sellseatSelect,
    sellseatSelectStyle
} from '@/api/hzz';
export default {
    components: {
        MyModal,
        selectPage
    },
    data() {
        return {
            date: [this.getNowTime(-1), this.getNowTime(-1)],
            pickerOptions: {
                // 限制日期
                disabledDate: this.disabledDate
            },
            searchKey: false,
            formValidate: {
                agent: null,
                hostGurst: null,
                group: null,
                plan: null,
                status: null,
                creativityName: '',
                position: null,
                style: null,
                grade: 1,
                deliveryMethod: null,
                paymentMethod: null
            },
            loading: false,  // 记载中
            // 分页
            dataCount: 0,  // 初始化信息总条数
            pageNum: 1,  // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            // 代理商
            agentList: [],
            // 广告主、直客
            hostGuestList: [],
            // 广告组
            groupList: [],
            // 根据组过滤的广告计划
            planList: [],
            // 加载的所有广告计划
            planAllList: [],
            // 投放位置
            positionList: [],
            // 广告样式
            styleList: [],
            // 广告计划状态
            statusList: [
                { key: '', value: '不限' },
                { key: 0, value: '带投放' },
                { key: 1, value: '投放中' },
                { key: 2, value: '组删除' },
                { key: 3, value: '组关闭' },
                { key: 4, value: '组预算不足' },
                { key: 5, value: '计划关闭' },
                { key: 6, value: '投放时间未开始' },
                { key: 7, value: '投放时间结束' },
                { key: 8, value: '计划已删除' },
                { key: 9, value: '无广告创意开启' },
                { key: 10, value: '账户余额不足' },
                { key: 11, value: '计划预算不足' }
            ],
            // 投放方式
            touFangList: [
                { id: '', name: '不限' },
                { id: 1, name: '标准' },
                { id: 2, name: '匀速' }
            ],
            // 付费方式
            paymentMethodList: [
                { id: '', name: '不限' },
                { id: 2, name: 'CPC' },
                { id: 1, name: 'CPM' }
            ],
            // 列表
            columns: [
                { title: '广告创意名称', key: 'creativityName', align: 'center', minWidth: 40 },
                { title: '广告计划名称', key: 'planName', align: 'center', minWidth: 40 },
                { title: '广告组名称', key: 'groupName', align: 'center', minWidth: 40 },
                { title: '投放位置', key: 'deliveryLocationName', align: 'center' },
                { title: '广告样式', key: 'styleName', align: 'center' },
                { title: '广告计划状态', key: 'deliveryStatus', align: 'center', minWidth: 30,
                    render: (h, params) => {
                        const _text = this.statusList.filter(item => item.scope == params.row.deliveryStatus)[0].name
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, _text)
                        ])
                    }
                },
                { title: '投放方式', key: 'deliveryMethod', align: 'center',
                    render: (h, params) => {
                        const _text = this.touFangList.filter(item => item.scope == params.row.deliveryMethod)[0].name
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, _text)
                        ])
                    }
                },
                { title: '投放日期', align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    marginRight: '10px'
                                }
                            }, params.row.deliveryStartTime.substring(0, 11) + '至' + params.row.deliveryEndTime.substring(0, 11))
                        ])
                    }
                },
                { title: '计划日预算', key: 'budgetAmount', align: 'center',
                    render: (h, params) => {
                        let i = params.row.budgetAmount.indexOf('.');
                        return h('div', [
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                }
                            }, params.row.budgetAmount.substring(0, i))
                        ])
                    }
                },
                { title: '付费方式', key: 'paymentMethod', align: 'center',
                    render: (h, params) => {
                        const _text = this.paymentMethodList.filter(item => item.scope == params.row.paymentMethod)[0].name
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, _text)
                        ])
                    }
                },
                { title: '出价', key: 'bidAmount', align: 'center' },
                { title: '消耗', key: 'cost', align: 'center' },
                { title: '展现量(真实)', key: 'displayVolume', align: 'center', width: 100 },
                { title: '展现量(客户端)', key: 'virtualVolume', align: 'center', width: 110 },
                { title: '点击量', key: 'clickVolume', align: 'center' },
                { title: '点击率(真实)', key: 'clickRate', align: 'center', width: 100,
                    render: (h, params) => {
                        return h('div', [h('span', params.row.clickRate+ '%' )]);
                    }
                },
                { title: '点击率(客户端)', key: 'virtualClickRate', align: 'center', width: 110,
                    render: (h, params) => {
                        return h('div', [h('span', params.row.virtualClickRate+ '%' )])
                    }
                }
            ],
            tableData: []
        }
    },
    computed: {},
    mounted() {
        this.getViewData();
        selectOption().then(res => {
            this.groupList = res.data.data;
        })
        planSelect().then(res => {
            this.planAllList = res.data.data
            this.planList = this.planAllList
        })
        sellseatSelect().then(res => {
            this.positionList = res.data.data;
        }).catch(error => {})
        this.offLineReportList();
        this.agentUserList();
    },
    methods: {
        // 获取页面数据
        getViewData() {
            // 获取广告计划状态
            getConfigDict('planType').then(res => {
                this.statusList = res;
            });
            // 获取付费方式
            getConfigDict('payType').then(res => {
                this.paymentMethodList = res;
            })
            // 获取投放方式
            getConfigDict('pullType').then(res => {
                this.touFangList = res;
            })
        },
        disabledDate(val) {
            return val.getTime() > new Date().getTime()-86400000
        },
        timeChange(val) {
            this.data = val;
        },
        // 列表
        offLineReportList() {
            let self = this;
            self.loading = true;
            let data = {
                pageNum: self.pageNum,
                pageSize: self.pageSuze,
                beginTime: self.data[0] || self.getNowTime(-1),
                endTime: self.date[1] || self.getNowTime(-1),
                agentUserId: self.formValidate.agent,
                queryUserId: self.formValidate.group,
                deliveryMethod: self.formValidate.deliveryMethod,
                adPlanId: self.formValidate.plan,
                creativityName: self.formValidate.creativityName,
                deliveryLocation: self.formValidate.position,
                adStyle: self.formValidate.style,
                deliveryLocation: self.formValidate.grade,
                paymentMethod: self.formValidate.paymentMethod
            }
            getOffLineList(data).then(res => {
                self.tableData = res.data.data.list;
                self.dataCount = res.data.data.total;
                self.loading = false;
            }).catch(error => {})
        },
        positionClick() {
            let self = this;
            sellseatSelectStyle(self.formValidate.position).then(res => {
                self.styleList = res.data.data;
            }).catch(error => {})
        },
        shouqi (data) {
            if (data == true) {
                this.formValidate.style = '';
            }
        },
        dakai (data) {
            if (data == true) {
                this.formValidate.hostGuest = '';
            }
        },
        // 代理商
        agentUserList () {
            let self = this;
            let data = {
                category: 2
            }
            creativeSelect(data).then(res => {
                self.agentList = res.data.data
            })
        },
        // 查询
        handleSubmit() {
            this.pageNum = 1;
            this.offLineReportList();
        },
        // 重置
        handleReset (formValidate) {
            this.styleList = [];
            this.formValidate.agent = null;
            this.formValidate.group = null;
            this.formValidate.plan = null;
            this.formValidate.status = null;
            this.formValidate.creativityName = '';
            this.formValidate.position = null;
            this.formValidate.style = null;
            this.formValidate.grade = 1;
            this.formValidate.deliveryMethod = null;
            this.formValidate.paymentMethod = null;
            this.pageNum = 1;
            this.offLineReportList();
        },
        getNowTime (val) {
            let date = new Date();
            if (val) {
                date = new Date(data.getTime() + 86400000 * val);
            }
            let seperator1 = '';
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            let currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        // 显示隐藏搜索框
        changeSearch(bool) {
            this.searchKey = bool;
        },
        // 分页
        changepage (index) {
            this.pageNum = index;
            this.offLineReportList()
        },
        // 显示条数
        changepize (val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.offLineReportList();
        },
        // 广告组选择变化时，查询对应的广告计划
        getPlanByGroup() {
            let groupId = this.formValidate.group
            if (!groupId) {
                this.planList = this.planAllList
                return
            }
            this.planList = this.planAllList.filter(s => s.groupId === groupId)
        }
    }
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
