<template>
    <div>
        <Card>
            <div style="margin: 10px 0;">
                <Form ref="formValidate" :model="formValidate" :inline="true">
                    <FormItem prop="objectName">
                        <Input v-model="formValidate.objectName" style="width: 200px;" placeholder="请输入操作对象名称"></Input>
                    </FormItem>
                    <FormItem prop="originality">
                        <DatePicker
                            :value="date"
                            @on-change='timeChange'
                            :options="pickerOptions"
                            format="yyyy-MM-dd"
                            :transfer="true" split-panels
                            type="daterange"
                            placeholder="Select date"
                            style="width: 200px;"></DatePicker>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
                        <Button @click="handleReset('formValidate')" style="margin: 0 10px 0 8px">重置</Button>
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
                    show-sizer :page-size-opts="pageSizeList"
                    @on-page-size-change="changepize"
                    @on-change="changepage"></Page>
            </div>
        </Card>
    </div>
</template>
<script>
import { getOperatelog } from '@/api/system';
export default {
    components: {},
    data() {
        return {
            date: [this.getNowTime(-6), this.getNowTime()],
            pickerOptions: {
                // 限制日期
                disabledDate: this.disabledDate
            },
            formValidate: {
                userName: '',
                objectName: ''
            },
            loading: false,  // 
            // 分页
            dataCount: 0, // 初始化信息总条数
            pageNum: 1,  // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            // 列表
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    type: 'index'
                }, {
                    title: '操作账号',
                    align: 'center',
                    key: 'userName'
                }, {
                    title: 'ip地址',
                    align: 'center',
                    key: 'ip'
                }, {
                    title: '菜单模块',
                    align: 'center',
                    key: 'opObject'
                }, {
                    title: '操作对象名称',
                    align: 'center',
                    key: 'opObjectName'
                }, {
                    title: '操作功能',
                    align: 'center',
                    key: 'opAction'
                }, {
                    title: '操作内容',
                    align: 'center',
                    key: 'remark'
                }, {
                    title: '操作时间',
                    align: 'center',
                    key: 'createAt'
                }
            ],
            tableData: []
        }
    },
    computed: {},
    mounted() {
        this.accountsList();
    },
    methods: {
        // 列表
        accountsList () {
            let self = this;
            let data = {
                page: self.pageNum,
                offset: self.pageSize,
                start_at: self.date[0] || self.getNowTime(-6),
                end_at: self.date[1] || self.getNowTime(),
                object_name: self.formValidate.objectName
            }
            let beginTime = new Date(data.start_at).getTime();
            let endTime = new Date(data.end_at).getTime();
            //限制只能查询30天范围的数据
            if (endTime-beginTime > 29 * 86400000) {
                self.$Message.error('时间区间不能超过30天');
                return false;
            }
            self.loading = true;
            getOperatelog(data).then(res => {
                self.tableData = res.data.data || [];
                self.dataCount = res.data.total || 0;
                self.loading = false;
            }).catch(error => {})
        },
        // 查询
        handleSubmit () {
            this.pageNum = 1;
            this.accountsList();
        },
        // 重置
        handleReset (formValidate) {
            this.$refs['formValidate'].resetFields();
            this.data = [this.getNowTime(-6), this.getNowTime()];
            this.pageNum = 1;
            this.accountsList();
        },
        // 分页
        changepage (index) {
            this.pageNum = index;
            this,accountsList();
        },
        // 显示条数
        changepize (val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.accountsList();
        },
        timeChange(val){
            this.date = val;
        },
        disabledDate (val) {
            return val.getTime() > new Date().getTime()
        },
        getNowTime (val) {
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
        }
    }
}
</script>
<style lang="less">
.detailsClass .ivu-form-item {
    margin-bottom: 15px;
}
.table{
    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
}
</style>
