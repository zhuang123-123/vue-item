<template>
    <div class="cloud-rule">
        <div style="margin-bottom: 16px;">
            <Input v-model="params.ruleIdName" placeholder="搜索规则名称/规则ID" style="width: 200px;" />
            <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
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
            <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" :page-size-opts="size_opts" show-elevator show-total show-sizer />
        </div>
    </div>
</template>
<script>
import { selectNotBindRelation, saveCloudsSlotIdRule } from '@/api/cloud';
import expandRow from './table-expand.vue'
export default {
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    components: {
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
                { title: 'App端版本', key: 'version', align: 'center' },
                { title: 'App端类型', key: 'os', align: 'center' },
                { title: 'App端渠道', key: 'qid', align: 'center' },
                { title: '最后更新时间', key: 'updateTime', align: 'center' },
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
                                                content: '确定要绑定吗？',
                                                onOk: () => {
                                                    saveCloudcSlotIdRule({slotId: this.params.slotId, ruleId: params.row.ruleId}).then(res => {
                                                        this.$emit('on-submit');
                                                        this.$Message.success('绑定成功');
                                                        this.getList();
                                                    })
                                                },
                                                cancelText: '取消'
                                            })
                                        }
                                    }
                                },
                                '绑定'
                            )
                        ])
                    }
                }
            ],
            params: {
                slotId: '',
                ruleIdName: ''
            },
            tableData: [],
            total: 0,
            pageSize: 5,
            currentPage: 1,
            size_opts: [5, 10, 20, 30, 40],  
            modalType: 'add',
            sourceList: [],
        }
    },
    methods: {
        getList (currentPage) {
            if (currentPage) this.currentPage = currentPage;
            selectNotBindRelation({
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
    },
    watch: {
        data (val) {
            this.params.slotId = val.slotId;
            this.sourceList = val.sourceList;
            this.getList();
        }
    }
}
</script>
<style>
.ivu-table-wrapper{
    overflow: unset;
}
</style>
