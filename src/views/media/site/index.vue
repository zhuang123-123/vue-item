<template>
    <div style="min-width: 1600px;">
        <Card>
            <div>
                <Button icon="ios-add" type="primary" @click="handleAdd">新增 </Button>
                <Button icon="ios-heart" type="primary" @click="changState('on')" style="margin-left: 10px;">启用</Button>
                <Button icon="ios-power" type="primary" @click="changState('on')" style="margin-left: 10px;">停用</Button>
            </div>
            <div style="margin: 10px 0;">
                <Input v-model="params.keyword" clearable placeholder="模糊搜索：id, 站点名称" style="width: 200px" />
                <Select v-model="params.platform" clearable style="width: 200px; margin-left: 10px;" placeholder="请选择终端类型">
                    <Option v-form="item in terminalTypeList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select v-model="params.site_type" filterable clearable style="width: 200px; margin-left: 10px" placeholder="请选择站点类型">
                    <Option v-for="item in webTypeList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置</Button>
            </div>

            <Table
                ref="table"
                :total="total"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                @on-select="selectTd"
                @on-select-cancel="selectTd"
                @on-select-all="selectTd"
                @on-select-all-cancel="selectTd">
            </Table>
            <div style="margin-top: 10px;">
                <Page @on-change="getList" :page-size-opts="pageSizeList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
            <my-modol v-model="modal1" :title="modalType === 'add' ? '新增站点' : modalType === 'edit' ? '编辑站点' : '查看站点'">
                <add-form :data="formData" @on-submit="submit" :type="modalType"></add-form>
            </my-modol>
        </Card>
    </div>
</template>

<script>
import MyModol from '_c/my-modol';
import AddForm from './add-form';
import { getSiteForm, getSiteDetails, updateSiteState, deleteSspApplicationById, getPlatList, getSiteName } from '@/api/media';
import { getConfigDict } from '@/api/common';
export default {
    name: 'site_page',
    components: {
        MyModol,
        AddForm
    },
    data() {
        return {
            departmentList: [],  // 查询维度值对比列表
            statusTypes: [
                {key: '1', value: '开启'},
                {key: '0', value: '关闭'}
            ],  // 状态集合
            //终端
            terminalTypeList: [],
            columns: [
                {title: 'index', type: 'selection', align: 'center', width: 60,
                    style: {
                        display: 'block'
                    }
                },
                {title: '站点ID', key: 'uuid', align: 'center'},
                {title: '站点名称', key: 'value', align: 'center'},
                {title: '终端类型', key: 'platformTxt', align: 'center'},
                {title: '站点类型', key: 'siteTypeTxt', align: 'center'},
                {title: '网站地址/包名', key: 'pageUrl', width: 200, align: 'center',
                    render: (h, params) => {
                        if (params.row.pageUrl) {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        placement: 'top',
                                        theme: 'light'
                                    }
                                }, [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: params.column._width * 0.5 + 'px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                        domProps: {
                                            innerHTML: params.row.pageUrl
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content',
                                        style: {
                                            minWidth: '500px',
                                            textAlign: 'center'
                                        },
                                        domProps: {
                                            innerHTML: params.row.pageUrl
                                        }
                                    })
                                ])
                            ])
                        } else {
                            return h('div', [
                                h('span', '暂无')
                            ])
                        }
                    }
                },
                {title: '站点负责人', key: 'leader', align: 'center'},
                {title: '独立站点', key: 'independence', align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.isInde === 1 ? '是' : '否')
                    }
                },
                {title: '状态', key: 'statusTxt', align: 'center'},
                {title: '备注', key: 'description', align: 'center'},
                {title: '更新时间', key: 'updateAt', align: 'center'},
                {title: '操作', key: 'action', align: 'center', width: 200,
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
                                            getSiteDetails({id: params.row.id}).then(res => {
                                                this.mpdal1 = true;
                                                this.modalType = 'view';
                                                this.formData = res.data.data;
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
                                            getSiteDetails({id: params.row.id}).then(res => {
                                                this.modal1 = true;
                                                this.modalType = 'edit';
                                                this.formData = res.data.data;
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
                                                content: '是否进行删除',
                                                onOk: () => {
                                                    deleteSspAppLicationById({id: params.row.id}).then(res => {
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
                keyword: '',
                platform: '',  // 平台类型-终端类型
                site_type: '',  //应用类型-站点类型
                status: '',  // 站点状态
            },
            modal1: false,
            tableData: [],
            formData: {},
            idList: [],  // 保存当前选中所有列的id
            total: 0,
            pageSize: 20,
            currentPage: 1,
            modalType: '',
            webTypeList: [],  // 站带你类型选项
        }
    },
    methods: {
        // 获取页面字典数据
        getViewData() {
            // 获取状态字典
            getConfigDict('specialSwitch').then(res => {
                this.statusTypes = [];
                res.map(res => {
                    let obj = {
                        code: Number(res.code),
                        name: res.name
                    }
                    this.statusTypes.push(obj);
                })
            });
            // 获取是否独立站点字典
            getConfigDict('yesNo').then(res => {
                this.independenceList = res;
            })
            // 获取终端字典
            getPlatList().then(res => {
                this.terminalTypeList = res.data.data;
            })
            // 获取站点类型
            getSiteName().then(res => {
                this.webTypeList = res.data.data;
            })
        },
        selectTd(params) {
            this.idList = [];
            params.forEach(res => {
                this.idList.push(res.id);
            })
        },
        changSatate(type) {
            if (this.isList.length === 0) {
                return
            }
            const idList = this.idList.join(',');
            const ajaxData = {
                id: idList,
                status: null
            }
            if (type === 'on') {
                ajaxData.status = 1;
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认要启用么？',
                    onOk: () => {
                        updateSiteState(ajaxData).then(res => {
                            this.$Message.success('已开启');
                            this.getList()
                        })
                    },
                    cancelText: '取消'
                })
            } else if (type === 'off') {
                ajaxData.status = 0;
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认要停用？',
                    onOk: () => {
                        updateSiteState(ajaxData).then(res => {
                            this.getList();
                            this.$Message.success('已关闭');
                        })
                    },
                    cancelText: '取消'
                })
            }
        },
        getList(currentPage) {
            this.idList = [];
            let ajaxData = Object.assign({}, this.params, {
                platform: this.params.platform || '-99',
                site_type: this.params.site_type || '-99',
                status: this.params.status || '-99'
            });
            if (currentPage) this.currentPage = currentPage;
            getSiteForm({
                page: this.currentPage,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            })
        },
        initList (pageSize) {
            this.pageSize = pageSize
            this.getList();
        },
        // 重置
        resetList() {
            this.params.keyword = '';
            this.params.platform = '';
            this.params.site_type = '';
            this.params.status = '';
            this.currentPage = 1
            this.getList();
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.modal = false;
        },
        handleAdd() {
            this.modal1 = true;
            this.modalType = 'add';
        }
    },
    computed: {

    },
    mounted() {
        this.getViewData();
        this.getList();
    }
}
</script>
