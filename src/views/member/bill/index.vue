<template>
    <div>
        <Card>
            <div style="margin: 10 0;">
                <DatePicker type="daterange" v-model="time" @on-change="timeChange" format="yyyy-MM-dd" placeholder="请选择时间区域" style="width: 200px"></DatePicker>
                <Input v-model="params.keyword" placeholder="请输入登录账户/企业名称" style="width: 180px; margin-left: 10px;" />
                <Select v-model="params.type" clearable filterable style="width: 150px; margin-left: 10px;" placeholder="请选择账单类型">
                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList(1)">查询</Button>
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
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
    </div>
</template>
<script>
import {sspMemberBill, getTypeList } from '@/api/member';
export default {
    data() {
        return {
            loading: false,  // 记载中
            typeList: [],  // 账单类型列表
            columns: [
                { title: '登录账号', key: 'userName', align: 'center' },
                { title: '企业名称', key: 'userCompany', align: 'center'},
                { title: '账单类型', key: 'typeTxt', align: 'center'},
                { title: '现金金额', key: 'remainBalance', align: 'center'},
                { title: '反点金额', key: 'remainPoint', align: 'center'},
                { title: '金额汇总', key: 'remainAmount', align: 'center' },
                { title: '日期', key: 'createAt', align: 'center'},
                { title: '交易号', key: 'payNo', align: 'center'},
                { title: '备注', key: 'remark', align: 'center'}
            ],
            params: {
                keyword: '',  // 广告主名称或企业名称
                type: '',  // 账单类型
            },
            time: [],
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        // 获取页面下拉数据
        getViewData() {
            getTypelist().then(res => {
                this.typeList = res.data.data;
            })
        },
        // 获取时间
        getNowTime(val) {
            let date = new Date();
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
            this.params.start_at = val[0] || this.getNowTime(-7);
            this.params.end_at = val[1] || this.getNowTime()
        },
        getList(currentPage) {
            this.loading = true;
            const ajaxData = Object.assign({}, this.params, {
                type: this.params.type || '',
            })
            if (currentPage) this.currentPage = currentPage;
            sspMemberBill({
                page: this.currentPage,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.loading = false;
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            });
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params.keyword = '';
            this.params.type = '';
            this.getList(1);
        }
    },
    computed: {},
    mounted() {
        this.getViewData();
        this.time = [this.getNowTime(-7), this.getNowTime()];
        this.timeChange(this.time);
        this.getList();
    }
}
</script>
<style lang="less">
    .table{
        .ivu-table-cell {
            padding-left: 3px;
            padding-right: 3px;
        }
    }
</style>
