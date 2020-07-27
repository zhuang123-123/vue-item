<template>
    <div class="cloud-rule">
        <div v-show="!modal2">
            <Card>
                <div style="margin-bottom: 16px;">
                    <Button icon="ios-add" type="primary" @click="handleAdd">新增规则</Button>
                    <Input v-model="params.ruleName" search enter-button placeholder="搜索规则名称/规则ID" style="float: right; width: 200px;" @on-search="getList()" />
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
        <div v-show="modal2" style="margin: auto; min-width: 1000px;">
            <Card>
                <add-form :data="formData" @on-submit="submit" :list="sourceList" :type="modalType" :title="modalType === 'add' ? '新增规则' : modalType === 'edit' ? '编辑规则' : '查看规则'"></add-form>
            </Card>
        </div>
    </div>
</template>
<script>
import MyModal from '_c/my-modal';
import AddForm from './add-form';
import { getCloudcConfigRuleInfo, getCloudcAdtype, deleteCloudcConfigRuleState } from '@/api/cloud';
import expandRow from './table-expand.vue'
export default {
    name: 'shielding_page',
    components: {
        MyModal,
        AddForm,
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
                }, {
                    title: '规则ID', key: 'ruleId', align: 'center'
                },
                { title: '规则名称', key: 'ruleName', align: 'center' },
                { title: 'APP端版本', key: 'version', align: 'center' },
                { title: 'App端类型', key: 'os', align: 'center',
                    filters: [
                        {value: 'Android', label: '安卓' },
                        {value: 'ios', label: 'IOS' },
                        {value: 'all', label: 'all'}
                    ],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.os == value;
                    },
                    render: (h, params) => h('span', {}, params.row.os == 'Android' ? '安卓' : params.row.os == 'ios' ? 'IOS' : params.row.os == 'all' ? 'all' : '')
                },
                {title: 'APP端渠道', key: 'qid', align: 'center' },
                {title: '最后更新时间', key: 'updateTime', align: 'center', sortable: true},
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
                                            this.modal2 = true;
                                            this.modalType = 'edit';
                                            this.formData = Object.assign({}, params.row, {
                                                modalType: 'edit'
                                            })
                                        }
                                    }
                                },
                                '编辑'
                            ),
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
                                                content: '确认要删除吗？'，
                                                onOk: () => {
                                                    deleteCloudcConfigRuleState({ruleId: params.row.ruleId, status: 0}).then(res => {
                                                        this.$Message.success('删除成功');
                                                        this.getList();
                                                    })
                                                },
                                                cancelText: '取消'
                                            })
                                        }
                                    }
                                },
                                '删除'
                            )
                        ])
                    }
                }
            ],
            params: {
                ruleName: ''
            },
            modal2: false,
            tableData: [],
            formData: {},
            total: 0,
            pageSize: 10,
            currentPage: 1,
            modalType: 'add',
            sourceList: [],  // 来源列表
        };
    },
    methods: {
        getList (currentPage) {
            if (currentPage) this.currentPage = currentPage;
            getCloudcConfigRuleInfo({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...this.params
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.page ? res.data.page.count : 0;
            })
        },
        initList (pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 获取广告来源列表
        getSourceLiist() {
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
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.modal2 = false;
        },
        handleAdd() {
            this.modal2 = true;
            this.modalType = 'add';
            this.formData = {
                sourceList: this.sourceList,
                modalType: 'add'
            }
        }
    },
    mounted() {
        this.getSourceList();
    },
    activated() {}
}
</script>
