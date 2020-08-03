<template>
    <div style="min-width: 1600ox;">
        <Card>
            <div>
                <Button icon="ios-add" type="primary" @click="handleAdd">新增广告主权限</Button>
            </div>
            <div style="margin: 10px 0;">
                <Input v-model="params.content" style="width: 200px;" placeholder="请输入登录账号/企业名称" />
                <Select clearable style="width: 150px; margin-left: 10px;" v-model="params.sellSeatId" placeholder="请选择售卖位">
                    <Option :value="item.sellSeatId" v-for="item in shoumaiweiList" :key="item.sellSeatId">{{item.sellSeatName}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin-left: 10px;" v-model="params.bidModel" placeholder="请选择竞价方式">
                    <Option :value="item.key" v-for="item in categoryList" :key="item.key">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
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
                <Page @on-change="getList" :page-size-opts="pageSizeList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
            <my-modal v-model="modal2" :title="modalType === 'add' ? '新增广告主权限' : '编辑广告主权限'">
                <add-form :data="formData" @on-submit="submit" :type="modalType"></add-form>
            </my-modal>
        </Card>
    </div>
</template>

<script>
import MyModal from '_c/my-modal';
import AddForm from './add-form';
import stateList from './const.js';
import {
    getPermissionPage,
    deletePermission,
    getsellseat,
    getPermissionDetail
} from '@/api/member';
export default {
    components: {
        MyModal,
        AddForm,
    },
    data() {
        return {
            loading: false,  // 加载中
            columns: [
                {title: '登录账号', key: 'account', align: 'center' },
                {title: '企业名称', key: 'companyName', align: 'center'},
                {title: '售卖位显示', key: 'sellSeatIdsDisplay', align: 'center'},
                {title: '竞价方式', key: 'bidModelsDisplay', align: 'center'},
                {title: '操作人', key: 'updatedBy', align: 'center'},
                {title: '操作时间', key: 'updatedTime', align: 'center'},
                {title: '操作',
                 key: 'action',
                 align: 'center',
                 width: 240,
                 render: (h, params) => {
                     return params.row.id == null ? '' : h('div', [
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
                                         getPermissionDetail(params.row.id).then(res => {
                                             this.formData = res.data.data;
                                             this.modal2 = true;
                                             this.formData.modalType = 'edit';
                                             this.modalType = 'edit';
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
                                             content: '确认要删除吗',
                                             onOK: () => {
                                                 deletePermission(params.row.id).then(res => {
                                                     this.$Message.success('删除成功');
                                                     this.getList();
                                                 })
                                             }
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
                content: '',  // 代理商
                sellSeatId: '',  // 广告主
                bidModel: '',  // 用户名
            },
            pageSizeList: [20, 50, 100],
            shoumaiweiList: [],  // 售卖位下拉列表
            tableData: [],
            formData: {},
            modal2: false,
            modalType: '',
            total: 0,
            pageSize: 20,
            currentPage: 1
        }
    },
    methods: {
        // 新增权限
        handleAdd() {
            this.formData = {};
            this.modal2 = true;
            this.formData.modalType = 'add';
            this.modalType = 'add';
        },
        // 获取售卖位
        getShoumaiwei() {
            let _this = this;
            getsellseat().then(res => {
                _this.shoumaiweiList = res.data.data;
            })
        },
        getList(currentPage) {
            this.loading = true;
            const ajaxData = Object.assign({}, this.params, {
                sellSeatId: this.params.sellSeatId || '',
                bidModel: this.params.bidModel || ''
            });
            if (currentPage) this.currentPage = currentPage;
            getPermissionPage({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.loading = false;
                this.tableData = res.data.data.list || [];
                this.total = res.data.data.total ? res.data.data.total : 0;
            })
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params.content = '';
            this.params.sellSeatId = '';
            this.params.bidModel = '';
            this.getList();
        },
        submit(val) {
            let _this = this;
            if (val == 'on') _this.getList();
            _this.formData = {};
            _this.modal2 = false;
            _this.formData.modalType = '';
            _this.modalType = '';
        }
    },
    computed: {
        categoryList() {
            return stateList.categoryList;
        }
    },
    mounted() {
        this.getShoumaiwei();
        this.getList();
    }
}
</script>
