<template>
    <div class="add-form">
        <div style="font-size: 13px; padding: 20px 10px; border: 1px solid #dcdee2; margin-bottom: 20px; border-radius: 5px">
            <label>站点名称：</label>
            <span>{{fromList.appName || ''}} </span>
            <label style="margin-left: 20px;">广告位名称：</label>
            <span>{{fromList.slotName || ''}} </span>
            <label style="margin-left: 20px;">广告位id：</label>
            <span>{{fromList.slotId || ''}} </span>
            <label style="margin-left: 20px;">是否为信息流</label>
            <span>{{fromList.isFeedsStr || ''}} </span>
        </div>
        <div style="margin: 10px 0;">
            <Select filterable v-model="params.qid" style="width: 200px;" placeholder="请选择渠道">
                <Option v-for="item in qidList" :value="item.key" :key="item.key">{{item.value}} </Option>
            </Select>
            <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
            <Button style="margin-left: 10px;" @click="resetList">重置</Button>
        </div>
        <Table
            :data="tableData"
            :columns="columns">
        </Table>
        <div style="width: 300px; margin: 50px auto;">
            <Button style="primary" @click="handleAdd" style="width: 120px; margin-right: 60px;">新增</Button>
            <BUtton @click="handleReset" style="width: 120px;">返回</BUtton>
        </div>
        <my-modal v-model="modal2" :title="modalType === 'add' ? '新增底价' : '编辑底价'">
            <add-form :data="formData" @close-page="submit" :type="modalType" :list="qidList"></add-form>
        </my-modal>
    </div>
</template>
<script>
import MyModal from '_c/my-modal';
import AddForm from './add-form';
import { getFloorDetails, selectSspFloorPriceRemarkById, deleteSspFloorPriceByid, getSspQidName } from '@/api/media';
import { getConfigDict } from '@/api/common';
export default {
    components: {
        MyModal,
        AddForm
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            params: {
                qid: ''
            },
            qidList: [],
            formData: {},
            modalType: '',  // 新增或者编辑
            modal2: false,
            fromList: {
                appName: '',
                slotName: '',
                slotId: '',
                terminal: '',
                isFeeds: '',  // 是否信息流类型广告
                isFeedsStr: '',  // 是否信息流类型广告翻译
            },
            columns: [
                { title: '广告位名称', key: 'slotName' },
                { title: '渠道CODE', key: 'qid',
                    render: (h, params) => {
                        return h('span', params.row.qid == 'all' ? '不限' : params.row.qid)
                    }
                },
                { title: '页数', key: 'pgnum',
                    render: (h, params) => {
                        return h('span', params.row.pgnum == '0' ? '不限' : params.row.pgnum)
                    }
                },
                {   title: '位置', key: 'idx',
                    render: (h, params) => {
                        return h('span', params.row.idx == '0' ? '不限' : params.row.idx)
                    }
                },
                { title: 'miniCpm', key: 'minCpmDay' },
                { title: 'K值', key: 'krate' },
                { title: '类型', key: '',
                    render: (h, params) => {
                        return h('span', (params.row.qid === 'all' && params.row.pgnum === '0' && params.row.idx === '0') ? '默认底价' : '新增底价')
                    }
                },
                { title: '操作', key: 'action', width: 120, align: 'center',
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
                                            this.tableData.map(res => {
                                                if (res.id === params.row.id) {
                                                    this.formData = res;
                                                    if (res.qid === 'all' && res.pgnum === '0' && res.idx === '0') {
                                                        this.modalType = 'edit_other';
                                                        this.formData.mpdalType = 'edit_other';
                                                    } else {
                                                        this.formData.modalType = 'edit';
                                                        this.modalType = 'edit';
                                                    }
                                                    this.modal2 = true;
                                                }
                                            })
                                        }
                                    }
                                },
                                '编辑'
                            ),h('span',
                                {
                                    style: {
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        color: '@2d8cf0'
                                    },
                                    on: {
                                        click: () => {
                                            if (params.row.qid === 'all' && params.row.pgnum === '0' && params.row.idx === '0') {
                                                return ;
                                            }
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确认要删除吗',
                                                onOk: () => {
                                                    deleteSspFloorPriceByid(params.row.id).then(res => {
                                                        this.$Message.success('删除成功');
                                                        this.getList();
                                                    })
                                                },
                                                cancelText: '取消'
                                            })
                                        }
                                    }
                                },
                                (params.row.qid === 'all' && params.row.pgnum === '0' && params.row.idx === '0') ? '' : '删除'
                            )
                        ])
                    }
                }
            ],
            id: '',
            tableData: [],
            feedsList: []  // 是否信息流类型广告
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            getConfigDict('yesNo').then(res => {  // 获取是否信息流类型广告状态  0-否； 1-是
                this.feedsList = res;
            })
        },
        handleReset() {
            this.$emit('on-submit');
        },
        handleAdd() {
            this.modal2 = true;
            this.modalType = 'add';
            getFloorDetails({
                allContent: this.id
            }).then(res => {
                this.formData = {
                    appName: res.data.data.list[0].appName,
                    isFeeds: res.data.data.list[0].isFeeds,
                    slotName: res.data.data.list[0].slotName,
                    slotId: res.data.data.list[0].slotId,
                    id: res.data.data.list[0].id,
                    modalType: 'add'
                }
            })
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.formData = {};
            this.modal2 = false;
        },
        getList() {
            selectSspFloorPriceRemarkById({id: this.id, allContent: this.params.qid || ''}).then(res => {
                this.tableData = res.data.data || [];
                this.tableData.map(res => {
                    if (res.qid === 'all' && res.pgnum === '0' && res.idx === '0') {
                        const obj = this.tableData.indexOf(res);
                        this.tableData.splice(objj, 1);
                        this.tableData.unshift(res);
                    }
                })
                if (this.tableData.length) {
                    this.fromList = res.data.data[0];
                    this.fromList.isFeedsStr = this.feedsList.find(s => s.code == this.fromList.isFeeds).name || ''
                }
            })
        },
        resetList() {
            this.params = {
                qid: ''
            },
            this.getList();
        },
        selectChannel() {
            getSspQidName({appid: this.id}).then(res => {
                this.qidList = [];
                const arr = [];
                res.data.data.map(item => {
                    if (arr.indexOf(item.value) == -1) {
                        const obj = {
                            key: item.value,
                            value: item.value
                        }
                        arr.push(item.value);
                        this.qidList.push(obj);
                    }
                })
            })
        }
    },
    watch: {
        data(val) {
            this.id = val.id;
            this.getList();
            this.selectChannel();
        }
    }
}
</script>
<style lang="less" scoped>
</style>
