<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <DatePicker type="daterange" :value="time" @on-change="changeTime" format="yyyy-MM-dd" placeholder="bottom-start" split-panels placeholder="请选择时间区间" style="width: 180px"></DatePicker>
                <Input v-model="params.hisId" placeholder="模糊搜索： 投放ID" style="width: 150px; margin-left: 10px;" />
                <Input v-model="params.qid" placeholder="模糊搜索：渠道号" style="width: 150px; margin-left: 10px;" />
                <Select v-model="params.sourceType" style="width: 150px; margin-left: 10px" placeholder="请选择终端">
                    <Option v-for="item in dimensionList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置</Button>
            </div>
            <Table
                ref="tables"
                :total="total"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                :loading="loading">
            </Table>
            <div style="margin-top: 10px;">
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
    </div>
</template>

<script>
import commonConst from '_c/common/commonConst.js';
import { getQidDetailList } from '@/api/report'
export default {
    data() {
        return {
            loading: false,  // 加载中
            columns: [
                { title: '日期', key: 'dt', align: 'center' },
                { title: '终端', key: 'sourcetype' },
                { title: '投放ID', key: 'advid' },
                { title: '渠道', key: 'qid' },
                { title: '展现PV', key: 'show_pv' },
                { title: '展现UV', key: 'show_uv' },
                { title: '点击PU', key: 'click_uv' },
                { title: '消耗', key: 'realcost' } 
            ],
            time: [this.getNowTime(-7), this.getNowTime()],
            params: {
                sdate: '',  //开始时间
                edate: '',  // 结束时间
                hisId: '',  // 投放id
                qid: '',  // 渠道号
                sourceType: '',  // 终端
            },
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        /**
         * @description 时间变化
        */
        changeTime(val) {
            this.time = val;
        },
        /**
         * @description 获取当前时间
         * @param val: 天数，正数为未来天数，负数为过去天数
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
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        getList(currentPage) {
            this.loading = true;
            const ajaxData = Object.assign({}, this.params, {
                sdate: this.time[0].split('-').join(''),
                edate: this.time[1].split('-').join(''),
                sourceType: this.params.sourceType || ''
            });
            if (currentPage) this.currentPage = currentPage;
            getQidDetailList({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.loading = false;
                this.tableData = res.data.data || [];
                this.total = res.data.page ? res.data.page.count : 0;
            });
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.time = [time.getNowTime(-7), this.getNowTime()],
            this.params.sdate = '';
            this.params.edate = '';
            this.params.hisId = '';
            this.params.qid = '';
            this.params.sourceType = '';
            this.getList();
        }
    },
    computed: {
        dimensionList() {
            return commonConst.terminalTypeList;
        }
    },
    mounted() {
        this.getList();
    }
}
</script>
