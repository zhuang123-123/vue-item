<template>
    <div>
        <Card>
            <div>
                <Button icon="ios-add" type="primary" @click="handleAdd" v-show="addBool">新增</Button>
            </div>
            <div style="margin: 10px 0;">
                <Input v-model="params.allFindStr" placeholder="模糊搜索：id，售卖名称" style="width: 200px;" />
                <Button type="primary" style="margin-left: 10px;" @click="getList(1)">查询</Button>
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
                <Page @on-change="getList" :page-size-opts="pageSizeList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
            <my-modol v-model="modal1" :title="modalType === 'add' ? '新增售卖为' : modalType === 'edit' ? '编辑售卖为' : '查看售卖位'">
                <add-form :data="formData" @on-submit="submit" :type="modalType"></add-form>
            </my-modol>
        </Card>
    </div>
</template>
<script>
import MyModol from '_c/my-modol';
import Addform from './add-form';
import { getSellingName, getSellingList, updateSellSeatState, getSellingDetail, delSellSeat } from '@/api/selling'; 
export default {
    components: {
        MyModol,
        AddForm
    },
    data() {
        return {
            addBool: false,
            editBool: false,
            statusBool: false,
            deleteBool: false,
            columns: [
                {title: 'ID', key: 'id', align: 'center' },
                {title: '售卖为名称', key: 'name', align: 'center' },
                {title: '终端类型', key: 'terminalType', align: 'center' },
                {title: '广告位样式', key: 'designName', align: 'center'},
                { title: '广告位置',
                  key: 'positionName',
                  align: 'center'
                },
                {title: 'CPM单价', key: 'cpm', align: 'center' },
                {title: '竞价方式', key: 'biddingWay', align: 'center' },
                {
                    title: '状态',
                    key: 'statusTxt',
                    align: 'center'
                },{
                    title: '操作',
                    key: 'action',
                    width: 220,
                    align: 'center',
                    render: (h, params) => {
                        if (!this.editBool && !this.deleteBool && !this.statusBool) {
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
                                            getSellingDetail({id: params.row.id}).then(res => {
                                                this.modal1 = true;
                                                this.modalType = 'view'
                                                this.formData = Object.assign({}, res.data.data, {
                                                    modalType: 'view',
                                                })
                                            })
                                        }
                                    }
                                },
                                '查看'
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
                                            getSellingDetail({id: params.row.id}).then(res => {
                                                this.modal1 = true;
                                                this.modalType = 'edit';
                                                this.formData = Object.assign({}, res.data.data, {
                                                    modatType: 'edit'
                                                })
                                            })
                                        }
                                    }
                                },
                                this.editBool ? '编辑' : ''
                            ),
                            h(
                                'span',
                                {
                                    style: {
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        color: params.row.status == 1 ? '#cc0000' : '#00cc00'
                                    },
                                    on: {
                                        click: () => {
                                            let text = params.row.status == 1 ? '关闭' : '开启'
                                            let action = params.row.status == 1 ? 'pause' : 'restart'
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确认要' + text + '吗',
                                                onOk: () => {
                                                    updateSellSeatState({
                                                        id: params.row.id,
                                                        action: action
                                                    }).then(res => {
                                                        this.$Message.success({
                                                            content: text+ '成功'
                                                        })
                                                        this.getList();
                                                    });
                                                },
                                                concelText: '取消'
                                            })
                                        }
                                    }
                                },
                                this.statusBool ? params.row.status == 1 ? '关闭' : '开启' :''
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
                                                content: '确认要删除吗',
                                                onOk: () => {
                                                    delSellSeat({id: params.row.id}).then(res => {
                                                        this.$Message.success('删除成功');
                                                        this.getList();
                                                    })
                                                },
                                                concelText: '取消'
                                            })
                                        }
                                    }
                                },
                                this.deleteBool ? '删除' : ''
                            )
                        ])
                    } 
                }
            ],
            params: {
                allFindStr: ''
            },
            modal1: false,
            tableData: [],
            formData: {},
            total: 0,
            pageSize: 20,
            pageSizeList: [20, 50, 100],
            currentPage: 1,
            modalType: ''
        }
    },
    methods: {
        getViewData() {

        },
        getList(currentPage) {
            if (currentPage) this.currentPage = currentPage;
            getSellingList({
                page: this.currentPage,
                offset: this.pageSize,
                name: this.params.allFindStr
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total ? res.data.total : 0;
            });
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList()
        },
        // 重置
        resetList() {
            this.params.allFindStr = '';
            this.getList(1);
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.modal1 = false;
        },
        handleAdd() {
            this.modal1 = true;
            this.modalType = 'add';
        }
    },
    computed: {},
    mounted() {
        this.getList();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const menuStr = localStorage.getItem('ms_menuStr').split('|||')
            // 新增
            if (isInArray(menuStr, '/sell/add') == false) {
                vm.addBool = false
            } else {
                vm.addBool = true
            }
            // 编辑
            if (isInArray(menuStr, '/sell/edit') == false) {
                vm.editBool = false
            } else {
                vm.editBool = true
            }
            // 开启关闭
            if (isInArray(menuStr, '/sell/status') == false) {
                vm.statusBool = false
            } else {
                vm.statusBool = true
            }
            // 删除
            if (isInArray(menuStr, '/sell/del') == false) {
                vm.deleteBool = false
            } else {
                vm.deleteBool = true
            }
            function isInArray(menuStr, value) {
                for (var i = 0; i < menuStr.length; i++) {
                    if (value === menuStr[i]) {
                        return true;
                    }
                }
                return false;
            }
        })
    }
}
</script>
