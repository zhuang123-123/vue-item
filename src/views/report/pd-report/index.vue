<template>
    <div>
        <Card>
            <div>
                <Button icon="ios-heart" type="primary" @click="changSatate('on')" style="margin-left: 10px;">启用</Button>
                <Button icon="ios-power" type="primary" @click="changSatate('off')" style="margin-left: 10px"> 禁用</Button>
            </div>
            <div style="margin: 10px 0;">
                <DatePicker type="date" :value="params.date" @on-change="changeTime" format="yyyyMMdd" placement="bottom-start" split-panels placeholder="请选择时间" style="width: 180px"></DatePicker>

                <Input v-model="params.adTitle" placeholder="请输入广告计划名称" style="width: 200px; margin-left: 10px;" />

                <Select v-model="params.userId" style="width: 200px; margin-left: 10px;" placeholder="请选择广告主" filterable>
                    <Option v-for="item in adverterList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>

                <Button type="primary" style="margin-left: 10px;" @click="getList()"> 查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置</Button>
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
import { getPdDetails } from '@/api/report';
import { selectUserInfoDetails } from '@/api/advertisement'
export default {
    data() {
        return {
            adverterList: [],  //广告主列表
            columns: [
                { title: '广告主ID', key: '', align: 'center' },
                { title: '广告计划', key: '' },
                { title: '审核状态', key: '' },
                { title: '广告主', key: '' },
                { title: '曝光量', key: '' },
                { title: '点击量', key: '' },
                { title: '点击率', key: '' },
                { title: 'CPM', key: '' },
                { title: 'CPC', key: '' },
                { title: '消耗金额（元）', key: '' },
            ],
            params: {
                userId: '',
                value: '',
                adTitle: '',
                date: this.getNowTime(),
            },
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        /**
         * @description 获取广告主列表
        */
       getAdveter() {
           selectUserInfoDetails({ type: 2 }).then(res => {
               const data = res.data.data || [];
               this.adverterList = [];
               data.map(item => {
                   const obj = {
                       key: item.userId,
                       value: item.companyName || item.userName
                   };
                   this.adverterList.push(obj);
               })
           })
       },
       /**
        * @description 获取当前时间
        * @param val:天数 正数为未来天数，负数为过去天数
       */
        getNowTime(val) {
            let date = new Date();
            if (val) {
                date = new Date(date.getTime() + 86400000 * val)
            }
            var seperator1 = '';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        changeTime(val) {
            this.params.date = val;
        },
        getList(currentPage) {
            const ajaxData = Object.assign({}, this.params, {
                userId: this.params.userId || ''
            })
            if (currentPage)  this.currentPage = currentPage;
            getPdDetails({
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
            this.getList();
        },
        // 重置
        resetList() {
            this.params.userId = '';
            this.params.value = '';
            this.params.adTitle = '';
            this.params.date = this.getNowTime();
            this.getList();
        }
    },
    mounted() {
        this.getAdveter();
        this.getList();
    }
}
</script>
