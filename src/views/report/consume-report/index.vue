<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <DatePicker type="daterange" :value="time" @on-change="changeTime" format="yyyy-MM-dd" placement="bottom-start" split-panels placeholder="请选择时间区间" style="width: 180px"></DatePicker>
                
                <Select v-model="params.coreAgentId" filterable style="width: 150px; margin-left: 10px;" placeholder="请选择核代" @on-change="hedaiChange" >
                    <Option v-for="item in hedaiList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Select v-model="params.agentId" filterable style="width: 150px; margin-left: 10px;" placeholder="请选择代理商" @on-change="agentChange">
                    <Option v-for="item in agentList" :value="item.key" :key="item.key">{{item,value}} </Option>
                </Select>
                <Select v-model="params.company" filterable style="width: 150px; margin-left: 10px;" placeholder="请选择广告主">
                    <Option v-for="item in adverterList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>

                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询 </Button>
                <Button style="margin-left: 10px;" @click="resetList"> 重置 </Button>
            </div>
            <Table
                class="table"
                ref="tables"
                :total='total'
                editable
                search-place="top"
                :data="tableData"
                :columns="columns">
            </Table>
            <div style="margin-top: 10px">
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
    </div>
</template>

<script>
import {
    selectUserInfoDetails
} from '@/api/advertisement';
import {
    getEverydayconsumeList
} from '@/api/report';
export default {
    data() {
        return {
            hedaiList: [],  // 核代列表
            agentList: [],  // 代理商列表
            adverterList: [],  // 广告主列表
            columns: [
                { title: '日期', key: 'dt', align: 'center' },
                { title: '代理商', key: 'fcompanyname' },
                { title: '广告主', key: 'companyName' },
                { title: '现金账号消耗金额（元）', key: 'cost_banlance' },
                { title: '虚拟账号消耗金额（元）', key: 'cost_vbanlance' }
            ],
            time: [this.getNowTime(-1), this.getNowTime()],
            params: {
                coreAgentId: '',  // 核代
                agentId: '',  // 代理商
                company: '',  //广告主
            },
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        };
    },
    methods: {
        /**
         * @description  获取核代列表
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
            selectUserInfoDetails({type: 1, coreagentId: value}).then(res=> {
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
            selectUserInfoDetails({type: 2, agentId: value}).then(res=> {
                const date = res.data.data || [];
                this.adverterList = [];
                data.map(item => {
                    const obj = {
                        key: item.userId,
                        value: item.companyName || item.userName,
                    }
                    this.adverterList.push(obj);
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
                        key: item.userid,
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
        /**
         * @description 时间变化
        */
        changeTime(val) {
            this.time = val;
        },
        /**
         * @description 获取当前时间
         * @param val 天数，正数为未来天数，负数为过去天数
        */
        getNowTime(val) {
            let date = new Date();
            if (val) {
                date = new Date(date.getTime() + 86400000 * val);
            }
            var seperator1 = '-';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >=0 && strDate <= 9)  {
                strDate = '0' + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        getList(currentPage) {
            const ajaxData = Object.assign({}, this.params, {
                startTime: this.time[0].split('-').join(''),
                endTime: this.time[1].split('-').join(''),
                coreAgentId: this.params.coreAgentId || '',
                agentId: this.params.agentId || '',
                company: this.params.company || ''
            })
            if (currentPage) this.currentPage = currentPage;
            getEverydayconsumeList({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.page ? res.data.page.count : 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList()
        },
        // 重置
        resetList() {
            this.time = [this.getNowTime(-1), this.getNowTime()]
            this.params.coreAgentId = '';
            this.params.agentId = '';
            this.params.company = '';
            this.getList();
        }
    },
    computed: {},
    mounted() {
        this.getHedai();
        this.getAgent();
        this.getAdveter();
        this.getList();
    }
}
</script>
