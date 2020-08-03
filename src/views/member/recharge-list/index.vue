<template>
    <div>
        <Card>
            <div style="margin-bottom: 10px">
                <Input v-model="params.username" placeholder="请输入登录账号或账户id" @keypress.enter="getList" clearable style="width: 150px" />
                <Select style="width: 180px; margin-left: 10px;" clearable v-model="params.status" placeholder="请选择充值状态">
                    <Option v-for="item in stateList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Button type="primary" @click="getList(1)" style="margin-left: 10px"> 查询</Button>
                <Button type="primary" @click="reset" style="margin-left: 10px">重置</Button>
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
        <div class="view_area_l" v-show="nowImgList.length" @click="nowImgList = []">
            <div class="view_box">
                <Icon type="md-arrow-back" style="font-size: 50px" class="left" @click.stop="leftClick($event)" :style="{'color':(index!=0&& nowImgList.length>1) ? 'white' : ''}" />
                    <img :src="nowImgList[index]" alt="无效链接" />
                <Icon type="md-arrow-forward" class="right" @click.stop="rightClick($event)" :style="{'color': (index!= nowImgList.length -1 && nowImgList.length > 1) ? 'white' : ''}" />
            </div>
        </div>
    </div>
</template>

<script>
import { getToken } from '@/libs/util'
import ajax from '@/libs/api.request'
import { chargeList, rechargeStatus } from '@/api/member';
export default {
    components: {},
    data() {
        return {
            index: 0,  // 图片下标
            shenheBool: false,  // 审核权限  true: 有  false: 没有
            params: {
                username: '',  // 登录名称
                status: '',
            },
            stateList: [
                {key: '1', value: '充值成功'},
                {key: '-1', value: '充值失败'},
                {key: '0', value: '审核中'}
            ],
            nowImgList: [],  // 当前查看图片列表
            columns: [
                { title: '登录账号', key: 'userName', align: 'center'},
                { title: '企业名称', key: 'userCompany', align: 'center'},
                { title: '充值类型', key: 'typeTxt', align: 'center'},
                { title: '现金金额', key: 'remainBalance', align: 'center'},
                { title: '返点金额', key: 'remainPoint', align: 'center'},
                { title: '打款凭证', key: 'proofUrl', align: 'center',
                    render: (h, params) => {
                        if (!params.row.proofUrl || params.row.prooFurl.length == 0) return h('span', '暂无');
                        return h('div', {
                            style: {
                                cursor: 'pointer',
                                color: '#2d8cf0'
                            },
                            on: {
                                click: () => {
                                    this.nowImgList = params.row.proofUrl.split(',');
                                    console.log(this.nowImgList.length)
                                    this.index = 0;
                                }
                            }
                        }, '查看')
                    }
                },
                { title: '充值时间', key:'createAt', align: 'center'},
                { title: '审核状态', key: 'statusTxt', align: 'center'},
                { title: '备注', key: 'remark', align: 'center' },
                { 
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.status != 0) {
                            return h('span', '暂无')
                        }
                        if (!this.shenheBool) {
                            return h('span', '暂无操作')
                        }
                        return h('div', [
                            h(
                                'span',
                                {
                                    style: {
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        color: '#2d8cf0'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确认要通过吗？',
                                                onOk: () => {
                                                    rechargeStatus({id: params.row.id, action: 'pass'}).then(res => {
                                                        this.$Message.success('已通过');
                                                        this.getList();
                                                    })
                                                },
                                                cancelTxt: '取消'
                                            })
                                        }
                                    }
                                },
                                '通过'
                            ),
                            h(
                                'span',
                                {
                                    style: {
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        color: '#ff0000'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确认要拒绝么？',
                                                onOk: () => {
                                                    rechargeStatus({id: params.row.id, action: 'reject'}).then(res => {
                                                        this.$Message.success('已拒绝');
                                                        this.getList();
                                                    })
                                                },
                                                cancelText: '取消'
                                            })
                                        }
                                    }
                                },
                                '拒绝'
                            )
                        ])
                    }
                }
            ],
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        getList (currentPage) {
            if (currentPage) this.currentPage = currentPage;
            chargeList({
                keyword: this.params.username,
                status: this.params.status || '',
                page: this.currentPage,
                offset: this.pageSize,
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        reset() {
            this.params.username = '';
            this.params.status = '';
            this.getList(1);
        },
        leftClick(e){
            if (this.index <= 0) {
                return
            }
            this.index = this.index == 0 ? this.nowImgList.length-1 : this.index -1;
        },
        rightClick(e) {
            if (this.index >= this.nowImgList.length -1) {
                return
            }
            this.index = this.index == this.nowImgList.length -1 ? 0 : this.index + 1;
        }
    },
    mounted() {
        this.getList();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const menuStr = localStorage.getItem('ms_menuStr').split('|||')
            // 审核
            if (isInArray(menuStr, '/recharge/status') == false) {
                vm.shenheBool = false
            } else {
                vm.shenheBool = true
            }
            function isInArray(menuStr, value) {
                for (var i = 0; i < menuStr.length; i++) {
                    if (value === menuStr[i]) {
                        return true
                    }
                }
                return false;
            }
        })
    }
}
</script>
