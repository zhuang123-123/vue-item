<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <DatePicker type="daterange" v-model="time" @on-change="timeChange" format="yyyy-MM-dd" placeholder="请选择时间区间" style="width: 200px; margin: 5px 10px 5px 0;"></DatePicker>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0;" v-model="params.agent" filterable placeholder="请选择代理商" @on-change="agentChange">
                    <Option style="width: 150px;" :value="item.id" v-for="item in agentList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0;" v-model="params.ad" filterable placeholder="请选择广告主/直客">
                    <Option style="width: 150px;" :value="item.id" v-for="item in userList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="params.plan" filterable placeholder="请选择广告计划名称">
                    <Option style="width: 150px;" :value="item.id" v-for="item in planList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Input v-model="params.idea_name" placeholder="请输入广告创意名称" style="width: 150px; margin: 5px 10px 5px 0;" />
                <Input v-model="params.sell" placeholder="请输入售卖位" style="width: 150px; margin: 5px 10px 5px 0;" />
                <Input v-model="params.position" placeholder="请输入广告位置" style="width: 150px; margin: 5px 10px 5px 0;" />
                <Input v-model="params.design" placeholder="请输入广告样式" style="width: 150px; margin: 5px 10px 5px 0;" />
                <Button type="primary" style="margin: 5px 10px 5px 0;" @click="getList(1)">查询</Button>
                <Button style="margin: 5px 10px 5px 0;" @click="resetList">重置</Button>
            </div>
            <Table
                ref="tables"
                :total="total"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns">
            </Table>
            <div style="margin-top: 10px;">
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
    </div>
</template>

<script>
import { getPdDetails } from '@/api/pd-report';
import { getPlanList, getAgentList, getUserList, getDictionaryList, planNameList } from '@/api/pd';
import { getBiddingList, adsenseList } from '@/api/selling';
import { getDesignList } from '@/api/media';
import { siteSelectorList } from '@/api/website'
export default {
    data() {
        return {
            agentList: [],
            userList: [], //用户列表
            sellList: [], // 售卖位
            planList: [],  // 计划列表
            styleList: [],  // 样式选择框
            positionList: [],  // 广告位置
            time: [],
            // 投放状态
            modeList: [
                { id: '-1', value: '审核拒绝' },
                { id: '0', value: '新建审核' },
                { id: '1', value: '带投放' },
                { id: '2', value: '投放中' },
                { id: '3', value: '投放结束' },
                { id: '4', value: '已删除' }
            ],
            idea_status_list: [
                { id: '1', value: '启用中' },
                { id: '0', value: '审核中' },
                { id: '-1', value: '审核拒绝' },
                { id: '2', value: '暂停' },
                { id: '3', value: '已删除' },
                { id: '4', value: '投放结束' }
            ],  // 广告创意状态列表
            columns: [
                { title: '日期', key: 'createAt', align: 'center' },
                { title: '广告创意id', key: 'idEaId', align: 'center' },
                { title: '广告创意名称', key: 'ideaName', align: 'center' },
                { title: '广告计划名称', key: 'planName', align: 'center' },
                { title: '企业名称', key: 'company', align: 'center' },
                { title: '售卖未', key: 'sellName', align: 'center' },
                { title: '广告位置', key: 'positionName', align: 'center' },
                { title: '广告样式', key: 'designName', align: 'center' },
                { title: '投放区间', key: 'start_at', align: 'center', 
                    render: (h, params) => {
                        return h('span', params.row.startAt + '至' + params.row.endAt)
                    }
                },
                { title: '付费方式', key: 'freeType', align: 'center' },
                { title: '出价', key: 'freeTypePrice', align: 'center' },
                { title: '消耗', key: 'cost', align: 'center' },
                { title: '展现量', key: 'shown', align: 'center' },
                { title: '点击量', key: 'click', align: 'center' },
                { title: '点击率', key: 'ctr', align: 'center' },
                { title: 'CPC', key:  'cpc', align: 'center' },
                { title: 'CPM', key: 'cpm', align: 'center' }
            ],
            params: {
                start_at: '',
                end_at: '',
                agent: '',
                ad: '',
                plan: '',
                idea_name,
                sell: '',
                position: '',
                design: ''
            },
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
        }
    },
    methods: {
        // 获取下拉框
        getInterestList() {
            // 代理商下拉框
            getAgentList().then(res => {
                this.agentList = res.data.data;
            })
            // 售卖位下拉框
            siteSelectorList().then(res => {
                this.sellList = res.data.data;
            })
            //计划名称下拉框
            planNameList().then(res => {
                this.planList = res.data.data;
            })
            // 样式列表
            getDesignList().then(res => {
                this.styleList = res.data.data;
            })
            adsenseList({platform: '', design: '', site: '', name: ''}).then(res => {
                this.positionList = res.data.data || [];
            })
        },
        timeChange(val) {
            this.params.start_at = val[0] || this.getNowTime(-7);
            this.params.end_at = val[1] || this.getNowTime()
        },
        // 获取广告主数据
        agentChange(val) {
            this.params.ad = '';
            getUserList({user_id: val || '-99'}).then(res => {
                this.UserList = res.data.data;
            })
        },
        /**
         * @description 获取当前时间
         * @param val: 天数，正数为未来天数，复数为过去天数
        */
        getNowTime(val) {
            let date = new Date();
            if (val) {
                date = new Date(date.getTime() + 8640000 * val);
            }
            var seperator1 = '-';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        getList(currentPage) {
            const ajaxData = Object.assign({}, this.params, {
                agent: this.params.agent || '-99',
                ad: this.params.ad || '-99',
                plan: this.params.plan || '-99',
                sell: this.params.sell,
                position: this.params.position,
                design: this.params.design
            });
            if (currentPage) this.currentPage = currentPage;
            getPdDetails({
                page: this.currentPage,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params.agent = '';
            this.params.pd = '';
            this.params.plan =  '';
            this.params.idea_name = '';
            this.params.sell = '';
            this.params.position = '';
            this.params.design = '';
        },
    },
    mounted() {
        this.time = [this.getNowTime(-7), this.getNowTime()];
        this.timeChange(this.time);
        this.getList();
        this.getInterestList();
        this.agentChange();
    }
}
</script>
