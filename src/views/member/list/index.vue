<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <Input v-model="params.userName" placeholder="请输入用户名(手机号)" style="width: 150px" />
                <Select v-model="params.coreAgentId" filterable style="width: 150px; margin-left: 10px;" placeholder="请选择核代" @on-change="hedaiChange">
                    <Option v-for="item in hedaiList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Select v-model="params.agentId" filterable style="width: 150px; margin-left: 10px;" placeholder="请选择代理商" @on-change="agentChange">
                    <Option v-for="item in agentList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Select v-model="params.userId" filterable style="width: 150px; margin-left: 10px;" plaecholder="请选择广告主">
                    <Option v-for="item in adverterList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>

                <Input v-model="params.salesman" placeholder="请输入销售人员" style="width: 150px; margin-left: 10px" />
                <Inpit v-model="params.operators" placeholder="请输入运营人员" style="width: 150px; margin-left: 10px;" />
                <Inpit v-model="params.reviewer" placeholder="请输入审核人员" style="width: 150px; margin-left: 10px;" />
                <Select v-model="params.statusflag" style="width: 150px; margin-left: 10px;" placeholder="请选择审核状态">
                    <Option v-for="item in dimensionList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置</Button>
            </div>
            <Table
                class="table"
                ref="tables"
                :total="total"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                :loading="loading">
            </Table>
            <div style="margin-top: 10px;">
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer >
            </div>
        </Card>
    </div>
</template>

<script>
import stateList from './const.js';
import {
    selectUserInfoDetails,
    selectAdvGroupDetails,
    getAdvGroupDetails
} from '@/api/advertisement';
import { getSspMemberDetails} from '@/api/member';
export default {
    data() {
        return {
            loading: false,  // 加载中
            columns: [
                { title: '用户id', key: 'userId', align: 'center'},
                { title: '公司名', key: 'companyName' },
                {
                    title: '用户名',
                    key: 'userName',
                    align: 'center',
                    width: 85,
                    render: (h, params) => {
                        return h(
                            'Poptip',
                            {
                                props: {
                                    trigger: 'hover',
                                    placement: 'right'
                                }
                            },
                            [
                                h(
                                    'p',
                                    {
                                        style: {
                                            color: '#2d8cf0',
                                            cursor: 'pointer'
                                        }
                                    },
                                    params.row.userName
                                ),
                                h(
                                    'div',
                                    {
                                        slot: 'content'
                                    },
                                    [
                                        h(
                                            'a',
                                            {
                                                style: {
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    display: 'block'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.$router.push({name: '_record', params: {userName: params.row.userName}})
                                                    }
                                                }
                                            },
                                            '查看操作日志'
                                        )
                                    ]
                                )
                            ]
                        )
                    }
                },
                { title: '代理商', key: 'pCompanyName' },
                { title: '代理用户', key: 'pIserName' },
                { title: '姓名', key: 'realName' },
                { title: 'email', key: 'email' },
                { title: '手机号', key: 'cellphone' },
                { title: '注册时间', key: 'registerDate' },
                { title: 'qq', key: 'qq' },
                { title: '地址', key: 'address' },
                { title: '审核状态', key: 'statusflag',
                    render: (h, params) => h('span', {}, params.row.statusflag == 0 ? '未上传资质整数' : params.row.statusflag == 1 ? '待审核' : params.row.statusflag == 2 ? '审核未通过' : params.row.statusflag == 3 ? '审核通过' : '')
                },
                { title: '现金余额', key: 'banlance' },
                { title: '返点余额', key: 'virtualBalance' },
                { title: '冻结金额', key: 'forzenBalance'},
                { title: '总余额', key: 'totalBalance' },
                { title: '可用余额', key: 'disposableBalance' },
                { title: '折扣', key: 'discountRate' },
                { title: '状态', key: 'isActive',
                    render: (h, params) => h('span', {}, params.row.isActive == 0 ? '禁用' : params.row.isActive == 1 ? '正常' : '')
                },
                { title: '运营人员', key: 'operators' },
                { title: '销售人员', key: 'salesman'},
            ],
            params: {
                coreAgentId: '',  // 核代
                agentId: '',  // 代理商
                userId: '',  // 广告主
                userName: '',  // 用户名
                salesman: '',  // 销售人员
                operators: '',  // 运营人员
                statusflag: '',  // 审核状态
            },
            hedaiList: [],  // 核代列表
            agentList: [],  // 代理商列表
            adverterList: [],  // 广告主列表
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        };
    },
    methods: {
        /**
         * @description 获取核代列表
        */
       getHedai() {
           selectUserInfoDetails({type: 3}).then(res => {
               const data = res.data.data || [];
               this.hedaiList = [];
               data.map(item => {
                   const obj = {
                       key: item.userId,
                       value: item.companyName || item.userName
                   }
                   this.hedaiList.push(obj);
               })
           })
       },
       /**
        * @description 获取代理商列表
       */
        getAgent(val) {
            const value = val || '';
            selectUserInfoDetails({type: 1, coreAgentId: value}).then(res => {
                const data = res.data.data || [];
                this.agentList = [];
                data.map(item => {
                    const obj = {
                        key: item.userId,
                        value: item.companyName || item.userName
                    }
                    this.agentList.push(obj);
                })
            })
        },
        /**
         * @description 获取广告主列表
        */
        getAdveter(val) {
            const value = val || '';
            selectUserInfoDetails({type: 2, agentId: value}).then(res => {
                const data = res.data.data || [];
                this.adverterList = [];
                data.map(item => {
                    const obj = {
                        key: item.userId,
                        value: item.companyName || item.userName
                    }
                    this.adverterList.push(obj);
                })
            })
        },
        /**
         * @description 核代变化
        */
        hedaiChange(val) {
            this.params.agentId = '';
            this.getAgent(val);
        },
        /**
            * @description 代理商变化
        */
        agentChange(val) {
            this.params.userId = '';
            this.getAdveter(val);
        },
        getList(currentPage) {
            this.loading = true;
            const ajaxData = Object.assign({}, this.params, {
                type: this.params.type || '',
            });
            if (currentPage) this.currentPage = currentPage;
            getSspMemberDetails({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.loading = false;
                this.tableData = res.data.data || [];
                this.total = res.data.page ? res.data.page.count : 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params.coreAgentId = '';
            this.params.agentId = '';
            this.params.userId =  '';
            this.params.userName = '';
            this.params.operators = '';
            this.params.salesman = '';
            this.params.reviewer = '';
            this.params.statusflag = '';
            this.getList();
        },
    },
    computed: {
        dimensionList() {
            return stateList.groupList;
        }
    },
    mounted() {
        if (this.$route.params.userName) {
            this.params.userName = this.$route.params.userName;
        }
        this.getHedai();
        this.getAgent();
        this.getAdveter();
        this.getList();
    }
}
</script>
<style lang="less">
.table {
    .ivu-table-cell {
        padding-left: 3px;
        padding-right: 3px;
    }
}
</style>
