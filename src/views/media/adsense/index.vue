<template>
    <div style="min-width: 1600px;">
        <Card>
            <div>
                <Button icon="ios-add" type="primary" @click="addSubmit('on')"> 新增</Button>
                <Button icon="ios-heart" type="primary" @click="changeState('on')" style="margin-left: 10px;">启用</Button>
                <Button icon="ios-power" type="primary" @click="changeState('off')" style="margin-left: 10px;">停用</Button>
            </div>
            <div style="margin: 10px 0;">
                <Select v-model="params.list" style="width: 200px;" placeholder="请选择" @on-change="selectionChange">
                    <Option v-for="item in dimensionList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Select v-model="params.value" filterable style="width: 200px; margin-left: 10px;" placeholder="请选择">
                    <Option v-for="item in departmentList" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Input v-model="params.allContent" placeholder="模糊搜索：id, 名称的搜索" style="width: 200px; margin-left: 10px;" />
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置</Button>
            </div>
            <Table
                ref="tables"
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
            <my-modal v-model="modal2" :title="modalType === 'add' ? '新增广告位' : modalType === 'edit' ? '编辑广告位' : '查看广告位'">
                <add-form :data="formData" @on-submit="submit" :type="modalType"></add-form>
            </my-modal>
        </Card>
    </div>
</template>

<script>
import MyModal from '_c/my-modal'
import AddForm from './add-form'
import {
    getadsenseList,
    updateSlotOnIsOff,
    getSiteDetails,
    getSspSlotName,
    getSiteName,
    getadsenseDetail,
    queryAdsenseStyle,
    getSellingName,
    deleteSlot
} from '@/api/media'
import { getConfigDict } from '@/api/common';
export default {
    name: 'site_page',
    components: {
        MyModal,
        AddForm
    },
    data() {
        return {
            // 广告位查询维度
            dimensionList: [
                {key: 'slotName', value: '广告位名称'},
                {key: 'appName', value: '站点名称'},
                {key: 'shellSeatName', value: '售卖位'},
                {key: 'styleName', value: '广告位样式'},
                {key: 'status', value: '状态'}
            ],
            departmentLis: [],  // 查询维度值对应列表
            columns: [
                {title: 'index', type: 'selection', align: 'center', width: 31},
                {title: '广告位id', key: 'slotId', align: 'center'},
                {title: '广告位名称', key: 'slotName', align: 'center'},
                {title: '站点名称', key: 'appName', align: 'center'},
                {title: '售卖位', key: 'shellSeatName', align: 'center'},
                {title: '广告位样式', key: 'styleName', align: 'center'},
                {title: '页面类型', key: 'pgtype', align: 'center',
                    render: (h, params) => h('span', {}, 
                        this.pageTypes.map(res => {
                            if (res.code === params.row.pgtype) {
                                return res.name
                            }
                        })
                    )
                },
                {title: '推荐底价', key: 'floorPrice', align: 'center'},
                {title: '状态', key: 'status', align: 'center',
                    render: (h, params) => {
                        const _text = this.statusTypes.filter(item => item.key === params.row.status)[0]
                        const text = _text.value ? _text.value : params.row.status == 1 ? '开': '关'
                        return h('span', {}, text)
                    }
                },
                {title: '更新时间', key: 'updateTime', align: 'center',
                    render: (h, params) => {
                        if (params.row.updateTime) {
                            return h('div', [
                                h('p', params.row.updateTime.split('')[0]),
                                h('p', params.row.updateTime.split('')[1])
                            ]);
                        }
                    }
                },
                {title: '操作', key: 'action', align: 'center', width: 230,
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
                                            getadsenseDetail(params.row.id).then(res => {
                                                this.modal2 = true;
                                                this.modalType = 'view';
                                                this.formData = Object.assign({}, res.data.data, {
                                                    modalType: 'view'
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
                                            getadsenseDetail(params.row.id).then(res => {
                                                this.modal2 = true;
                                                this.modalType = 'edit';
                                                this.formData = Object.assign({}, res.data.data, {
                                                    modalType: 'edit'
                                                })
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
                                            this.$router.push({name: 'floorprice', params: {id: params.row.slotId}})
                                        }
                                    }
                                },
                                '底价管理'
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
                                                content: '管相关售卖位含有该广告位，也会将该广告位进行删除，是否进行删除？',
                                                onOk: () => {
                                                    deleteSlot(params.row.slotId).then(res => {
                                                        this.getList();
                                                        this.$Message.success('已删除');
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
                list: '',
                value: '',
                allContent: ''
            },
            ajaxData: {
                slotName: '',  // 广告位名称
                appName: '',  // 站点名称
                shellSeatName: '',  //售卖位置名称
                styleName: '',  // 广告样式名称
                status: '',  // 广告位状态
                allContent: ''  // 模糊查询
            },
            statusTypes: [],  // 状态列表
            modal2: false,  // 广告位详情显示控制
            tableData: [],
            formData: {},  // 广告位详情数据
            idList: [],  //保存当前选中所有lieid
            total: 0,
            pageSize: 20,
            pageSizeList: [20, 50, 100],
            currentPage: 1,
            modalType: 'add',
            pageTypes: [],  // 页面类型
        }
    },
    methods: {
        // 获取页面数据
        getViewData() {
            // 获取状态
            getConfigDict('specialSwitch').then(res => {
                this.statusTypes = [];
                res.map(res => {
                    let obj = {
                        key: res.code,
                        value: res.name
                    }
                    this.statusTypes.push(obj)
                })
            });
            // 获取页面类型
            getConfigDict('pageType').then(res => {
                this.pageTypes = res
            })
        },
        selectTd(params) {
            this.idList = [];
            params.forEach(res => {
                this.idList.push(res.id);
            })
        },
        addSubmit() {
            this.modal2 = true;
            this.modalType = 'add';
            this.formData = {
                modalType: 'add'
            }
        },
        /**
        *状态开关
        */
        changState (type) {
            if (this.idList.length === 0) {
                return
            }
            const idList = this.idList.join(',');
            const ajaxData = {
                id: idList,
                statue: null
            }
            if (type === 'on') {
                ajaxData.status = 1;
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认要启用吗？',
                    onOk: () => {
                        updateSlotOnIsOff(ajaxData).then(res => {
                            this.getList();
                            this.$Message.success('已开启');
                        })
                    },
                    cancelText: '取消'
                })
            } else if (type === 'off') {
                ajaxData.status = 0;
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认要停用么？',
                    onOk: () => {
                        updateSlotOnIsOff(ajaxData).then(res => {
                            this.getList();
                            this.$Message.success('已关闭');
                        })
                    },
                    cancelText: '取消'
                })
            }
        },
        // 查询维度变化
        selectionChange(params) {
            this.departmentList = [];
            this.params.value = '';
            switch (params) {
                case 'slotName':
                    getSspSlotName().then(res => {
                        const data = res.data.data;
                        if (data) {
                            const arr = [];
                            const arr2 = [];
                            data.forEach(item => {
                                if (arr2.indexOf(item.slotName) == -11) {
                                    arr.push({
                                        key: item.slotName,
                                        value: item.slotName
                                    });
                                    arr2.push(item.slotName)
                                }
                            });
                            this.departmentList = arr;
                        }
                    });
                    break;
                case 'appName':
                    getSiteName().then(res => {
                        const data = res.data.data;
                        if (data) {
                            const arr = [];
                            data.forEach(item => {
                                if (arr.indexOf(item.appName) == -1) {
                                    const obj = {
                                        key: item.appName,
                                        value: item.appName
                                    }
                                    arr.push(item.appName);
                                    this.departmentList.push(obj);
                                }
                            });
                        }
                    })
                    break;
                case 'shellSeatName':
                    getSellingName({terminal: ''}).then(res => {
                        const data = res.data.data;
                        if (data) {
                            const arr = [];
                            data.forEach(item => {
                                arr.push({
                                    key: item.dictName,
                                    value: item.dictName
                                })
                            })
                            this.departmentList = arr;
                        }
                    })
                    break;
                case 'styleName':
                    this.getStyle();
                    break;
                case 'status':
                    this.departmentList = this.statusTypes;
                    break;
                default:
                    break;
            }
        },
        getList (currentPage) {
            const _this = this;
            const ajaxData = Object.assign({}, this.ajaxData);
            if (currentPage) this.currentPage = currentPage;
            if (this.params.value || this.params.value === 0) {
                ajaxData[this.params.list] = this.params.value;
            } 
            ajaxData['allContent'] = this.params.allContent || '';
            getadsenseList({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.idList = [];
                this.tableData = res.data.data.list || [];
                this.total = res.data.data.total || 0;
            });
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList(this.currentPage);
        },
        // 重置
        resetList() {
            this.params = {
                list: '',
                value: '',
                allContent: ''
            };
            this.getList();
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.modal2 = false;
        },
        handleAdd(siteId) {
            getSiteDetails(siteId).then(res => {
                this.modalType = 'add';
                this.modal2 = true;
                const item = res.data.data[0];
                this.formData = {
                    appId: item.id,
                    appName: item.appName,
                    terminal: item.terminal
                }
            })
        },
        getStyle() {
            queryAdsenseStyle('all').then(res => {
                this.departmentList = [];
                let arr = [];
                res.data.data.map(res => {
                    if (arr.indexOf(res.styleName) == -1) {
                        const obj = {
                            key: res.styleName,
                            value: res.styleName
                        }
                        this.departmentList.push(obj);
                        arr.push(res.styleName)
                    }
                })
            })
        }
    },
    computed: {},
    mounted() {
        this.getViewData();
        if (this.$route.params.type && this.$route.params.type == 'add') {
            this.handleAdd(this.$route.params.id);
        }
        this.getList();
    }
}
</script>
