<template>
    <Card class="cloud-rule">
        <div style="font-size: 13px; padding: 20px 10px; border: 1px solid #dcdee2; border-radius: 5px">
            <label>站点名称：</label>
            <span style="font-weight: bold">{{fromList.appName}} </span>
            <label style="margin-left: 20px;">广告位名称 </label>
            <span style="font-weight: bold">{{fromList.slotName}} </span>
        </div>
        <div style="margin: 16px 0">
            <Button icon="ios-add" type="primary" @click="handleAdd">新增绑定</Button>
            <Input v-model="params.ruleIdName" search enter-button placeholder="搜索规则名称/规则ID" style="float: right; width: 200px;" @on-search="getList()" />
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
        <my-Modal v-model="modal2" title="新增绑定">
            <add-cloud :data="formData" @on-submit="submit" :type="modalType"></add-cloud>
        </my-Modal>
    </Card>
</template>
<script>
import MyModal from '_c/my-modal';
import AddCloud from './add-cloud';
import { selectSlotIdRuleRelation, deleteCloudcSlotIdRule, getCloudcAdtype } from '@/api/cloud';
import expandRow from './table-expand.vue';
export default {
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    components: {
        MyModal,
        AddCloud,
        expandRow
    },
    data() {
        return {
            columns: [
                {
                    title: '',
                    width: 50,
                    type: 'expand',
                    align: 'center',
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: {
                                    para: JSON.parse(params.row.array),
                                    list: this.sourceList
                                }
                            }
                        })
                    }
                },
                { title: '规则ID', key: 'ruleId', align: 'center' },
                { title: '规则名称', key: 'ruleName', align: 'center' },
                { title: 'APP端版本', key: 'version', align: 'center'},
                { title: 'App端类型', key: 'os', align: 'center'},
                { title: 'App端渠道', key: 'qid', align: 'center'},
                { title: '绑定时间', key: 'bindTime', align: 'center'},
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
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
                                                content: '确定要把此规则接触绑定吗？',
                                                onOk: () => {
                                                    deleteCloudcSlotIdRule({slotId: this.params.slotId, ruleId: params.row.ruleId}).then(res => {
                                                        this.$Message.success('接触成功');
                                                        this.getList();
                                                    })
                                                },
                                                cancelText: '取消'
                                            })
                                        }
                                    }
                                },
                                '接触绑定'
                            )
                        ])
                    }
                }
            ],
            params: {
                ruleIdName: '',
                slotId: '',  //广告位id
            },
            fromList: {
                appName: '',
                slotName: ''
            },
            modal2: false,
            tableData: [],
            formData: {},
            tital: 0,
            pageSize: 10,
            currentPage: 1,
            modalType: 'add',
            sourceList: [],  // 来源列表
        }
    },
    methods: {
        getList(currentPage) {
            if (currentPage) this.currentPage = currentPage;
            selectSlotIdRuleRelation({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...this.params
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.page ? res.data.page.count : 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 获取广告来源列表
        getSourceList() {
            this.sourceList = [];
            getCloudcAdtype().then(res => {
                res.data.data.map(val => {
                    let arr = [];
                    if (arr.indexOf(val.code) == -1) {
                        arr.push(val.code);
                        let obj = {
                            key: val.code,
                            value: val.fullName
                        }
                        this.sourceList.push(obj)
                    }
                })
                this.getList();
            })
            // 请求列表数据
            if (this.$route.params.row) {
                let row = this.$route.params.row;
                this.fromList.appName = row.appName || '';
                this.fromList.slotName = row.slotName || '';
                this.params.slotId = row.slotId || '';
                this.getList();
            }
        },
        submit() {
            this.getList()
        },
        handleAdd() {
            this.modal2 = true;
            this.modalType = 'add';
            this.formData = {
                modalType: 'add',
                slotId: this.params.slotId,
                sourceList: this.sourceList,
            }
        },
        handleReset() {
            this.$emit('on-submit');
        },
    },
    mounted() {
        this.getSourceList();
    },
    // keep-alive  生命周期-进入页面时
    activated() {
        if (this.$route.params.row) {
            let row = this.$route.params.row;
            this.fromList.appName = row.appName || '';
            this.fromLIst.slotName = row.slotName || '';
            this.params.slotId = row.slotId || '';
            this.getList();
        }
    }
}
</script>
<style>
.ivu-table-wrapper {
    overflow: unset;
}
</style>
