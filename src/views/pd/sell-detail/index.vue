<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <Select v-model="params.sale" filterable style="width: 150px;" placeholder="请选择售卖位" @on-change="getList(1)">
                    <Option v-for="item in sellList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
                <ul class="declare">
                    <li>
                        <span style="background-color: #d7d7d7" class="block"></span>
                        <span>未投放</span>
                    </li>
                    <li>
                        <span style="background-color: #0033cc" class="block"></span>
                        <span>投放中</span>
                    </li>
                    <li>
                        <span style="background-color: #cc6600" class="block"></span>
                        <span>带投放</span>
                    </li>
                    <li>
                        <span style="background-color: #009900" class="block"></span>
                        <span>未占用</span>
                    </li>
                </ul>
            </div>
            <table class="table1" border="0" cellspacing="0">
                <tr>
                    <td v-for="(item, index) in tableData1" :key="index" style="position: relative" :class="(item.status === '投放中' || item.status === '带投放') ? 'ownPop' : 'other'">
                        <div class="top" :style="{'backgroundColor': item.status == '未投放' ? '#d7d7d7' : item.status == '投放中' ? '#0033cc' : item.status == '带投放' ? '#cc6600' : item.status == '未占用' ? '#009900' : '', 'color': item.status == '未投放' ? '#333333' : 'white'}">{{item.data}} </div>
                        <div class="ivu-tooltip bottom">
                            <div class="ivu-tooltip-rel">
                                <span>{{item.feePrice ? item.feePrice + '元/cpm' : '--'}} </span>
                            </div>
                            <div class="ivu-tooltip-popper ivu-tooltip-light" style="position: absolute; will-change: top, left; width: 100%; left: 0; top: 73px;" v-placement="bottom">
                                <div class="ivu-tooptip-inner">
                                    <p>
                                        <span>广告主</span>
                                        <span>{{item.company}} </span>
                                    </p>
                                    <p>
                                        <span>计费单价 </span>
                                        <span>{{item.feePrice+'元/cpm'}} </span>
                                    </p>
                                    <p>
                                        <span>冻结金额</span>
                                        <span>{{item.amount}} </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <div style="margin: 10px 0;">
                <span style="font-weight: bold; margin-right: 10px; font-size: 18px"> 历实数据查看</span>
                <DatePicker type="daterange" v-model="time" @on-change="timeChange" format="yyyy-MM-dd" placeholder="请选择时间区间" style="width: 200px"></DatePicker>
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
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
    </div>
</template>

<script>
import { scheduleList } from '@/api/pd';
import { siteSelectorList } from '@/api/website'
export default {
    data() {
        return {
            loading: false, // 加载中
            sellList: [],  // 售卖位列表
            columns: [
                { title: '日期', key: 'createAt', align: 'center' },
                { title: '售卖位名称', key: 'sellName', align: 'center' },
                { title: '广告主名称', key: 'company', align: 'center' },
                { title: '广告计划名称', key: 'planName', align: 'center' },
                { title: '累计消耗', key: 'cost', align: 'center' }
            ],
            params: {
                start_at: '',
                end_at: '',
                sale: '',  // 售卖位
            },
            time: [],
            tableData: [],
            tableData1: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        // 获取页面下拉数据
        getViewData() {
            // 售卖下拉框（投放位置）
            siteSelectorList().then(res => {
                this.sellList = res.data.data;
                this.params.sale = this.sellList[0].id;
                this.time = [this.getNowTime(-30), this.getNowTime()];
                this.params.start_at = this.time[0];
                this.params.end_at = this.time[1];
                this.getList();
            })
        },
        // 获取时间
        getNowTime(val) {
            let data = new Date();
            if (val) {
                date = new Date(date.getTime() + 86400000 * val);
            }
            let seperator1 = '-';
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
        // 时间变化
        timeChange(val) {
            this.params.start_at = val[0] || this.getNowTime(-30);
            this.params.end_at = val[1] || this.getNowTime();
            this.getList(1);
        },
        getList(currentPage) {
            this.loading = true;
            const ajaxData = Object.assign({}, this.params, {
                start_at: this.params.start_at.split('-').join(''),
                end_at: this.params.end_at.split('-').join(''),
                sale: this.params.sale || '-99'
            })
            if (currentPage) this.currentPage = currentPage;
            scheduleList({
                page: this.currentPage,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.loading = false;
                this.tableData = res.data.data.table.response || [];
                this.tableData1 = res.data.data.time || [];
                this.total = res.data.data.table.count || 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        }
    },
    computed: {},
    mounted() {
        this.getViewData();
        this.time = [this.getNowTime(-30), this.getNowTime()];
        this.timeChange(this.time);
    }
}
</script>
