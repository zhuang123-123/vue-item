<template>
    <div style="min-width: 1600px;">
        <Card>
            <div>
                <Button icon="ios-add" type="primary" @click="handleAdd">新增</Button>
                <Button icon="ios-heart" type="primary" @click="changSatate('on')" style="margin-left: 10px;"> 启用</Button>
                <Button icon="ios-power" type="primary" @click="changSatate('off')" style="margin-left: 10px">禁用</Button>
            </div>
            <div style="margin: 10px 0">
                <Input v-model="params.keyword" placeholder="请输入渠道code" clearable style="width: 200px;" />
                <Input v-model="params.source" placeholder="请输入渠道来源" clearable style="width: 200px; margin-left: 10px;" />

                <Select v-model="params.status" filterable clearable style="width: 200px; margin-left: 10px;" placeholder="请选择状态">
                    <Option v-for="item in statusTypes" :value="item.key" :key="item.key">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px;" @click="getList(1)">查询</Button>
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
            <my-modol v-model="modal2" :title="modalType === 'add' ? '新增渠道' : modalType === 'edit' ? '编辑渠道' : '查看渠道'">
                <add-form :data="formData" @on-submit="submit" :type="modalType"></add-form>
            </my-modol>
        </Card>
        <div class="window_other_l" v-show="modal1">
            <div class="page_view">
                <span class="cancel" @click="hideWindow"> X </span>
                <div class="page_title">导入</div>
                <Form :label-width="120">
                    <FormItem label="站点名称">
                        <Select label-in-value @on-change="siteChange" v-model="params2.appName" filterable style="width: 200px;" placeholder="请选择站点名称">
                            <Option v-for="item in departmentList" :value="item.key" :key="item.key">{{item.value}} </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="站点id">
                        <Input type="text" style="width: 200px;" v-model="params2.appid" disabled />
                    </FormItem>

                    <FormItem label="请上传">
                        <label class="upload_label" for="input">上传</label>
                        <input id="input" type="file" :value="inputVal" style="display: none" @change="uploadChange" :disabled="!uploadBool" />
                        <Button icon="ios-log-out" type="primary" style="margin-left: 10px;" @click="exportReport('1')">导出模板</Button>
                        <p>{{fileName}} </p>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit">确定</Button>
                        <Button style="margin-left: 40px;" @click="hideWindow">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <iframe :src="src" frameborder="0" style="display: none;"></iframe>
    </div>
</template>

<script>
import MyModol from '_c/my-modol';
import AddForm from './add-form';
import { getToken } from '@/libs/util';
import { getConfigDict } from '@/api/common';
import axios from 'axios'
import {
    getSiteList,
    inPutExcel,
    outPutExcel,
    outPutExcelModal,
    getSspQidName,
    updateQidOnIsOff,
    selectQidChannelDetails,
    deleteQidDetailsById,
    selectChannelDetailsById
} from '@/api/media'
import { setCondition, getCondition } from '@/libs/util'
export default {
    name: 'site_page',
    components: {
        MyModol,
        AddForm
    },
    data() {
        return {
            uploadBool: true,  // 上传按钮能否点击true 可点击   false 不可点击
            maxSize: 10,  // 文件大小限制，单位 M
            src: '',  //下载地址
            modal1: false,  // 上传窗口 true: 显示  false: 隐藏
            accept: ['xlsx', 'xls'],  // 支持格式
            departmentList: [],  // 站点列表
            fileName: '',  //文件名称
            inputVal: '',  // 上传input的value值
            fileVal: '',  // 上传文件对象
            params2: {
                appName: '',
                appid: ''
            },
            qidList: [],
            columns: [
                {title: 'index', type: 'selection', width: 60, align: 'center'},
                {title: '渠道code', key: 'qidCode', align: 'center'},
                {title: '渠道号', key: 'channelName', align: 'center'},
                {title: '渠道终端', key: 'platformTxt', align: 'center'},
                {title: '渠道来源', key: 'source', align: 'center'},
                {title: '站点名称', key: 'siteTxt', align: 'center'},
                {title: '每日流量预估', key: 'showAmount', align: 'center'},
                {title: '状态', key: 'statusTxt', align: 'center'},
                {title: '操作人', key: 'opUser', align: 'center'},
                {title: '备注', key: 'description', align: 'center'},
                {title: '操作', key: 'description', align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'span',
                                {
                                    style: {
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        color: '#2d8cf0',
                                        display: params.row.qidCode.startsWith('default') ? 'none' : ''
                                    },
                                    on: {
                                        click: () => {
                                            selectChannelDetailsById({id: params.row.id}).then(res => {
                                                this.modal2 = true;
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
                                            selectChannelDetailsById({ id: params.row.id }).then(res => {
                                                this.modal2 = true;
                                                this.modalType = 'view';
                                                this.formData = res.data.data;
                                            })
                                        }
                                    }
                                },
                                '详情'
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
                                            // 是否默认渠道
                                            let isDefaultChannel = params.row.qidCode.startsWith('default')
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确认要删除吗？'，
                                                onOK: () => {
                                                    if (isDefaultChannel && params.row.appId) {
                                                        this.$Message.warning('相关站点存在，不能进行该默认渠道的删除');
                                                        return
                                                    }
                                                    deleteQidDetailsById({id: params.row.id}).then(res => {
                                                        this.getList();
                                                        this.$Message.success('删除成功')；
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
                keyword: '',  //渠道code
                source: '',  // 渠道来源
                status: '',  //状态
                platform: '-99'
            },
            statusTypes: [
                {key: '1', value: '开启'},
                {key: '0', value: '关闭'}
            ],  // 状态列表
            modal2: false,
            tableData: [],
            formData: {},
            idList: [],  // 保存当前选中所有列的id
            total: 0,
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            currentPage: 1,
            modalType: ''
        };
    },
    methods: {
        // 获取页面数据
        getViewData() {},
        // 获取站点列表
        getsiteList() {
            getSiteList().then(res => {
                const data = res.data.data;
                if (data) {
                    this.departmentList = [];
                    const arr = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.appName) == -1) {
                            const obj = {
                                key: item.id,
                                value: item.appName
                            }
                            arr.push(item.appName);
                            this.departmentList.push(obj);
                        }
                    })
                }
            })
        },
        // 站点变化
        siteChange(item) {
            if (item) {
                this.params2.appid = item.value;
            } else {
                this.params2.appid = ''
            }
        },
        uploadChange (val) {
            const file = val.target.files[0];
            const arr = file.name.split('.');
            const type = arr[arr.length - 1].toLowerCase();  // 文件格式
            const size = file.size/1024/1024;  // 文件大小
            if (this.accept.indexOf(type) == -1) {
                this.$Message.warning({
                    content: '文件格式错误！'
                })
                return false;
            } else {
                if (this.maxSize < size) {
                    this.$Message.warning({
                        content: '文件大小请不要超出' + this.maxSize + 'M'
                    })
                    return false;
                } else {
                    this.fileName = file.name;
                    this.fileVal = file;
                }
            }
        },
        handleSubmit() {
            if (this.params2.appid === '') {
                this.$Message.warning({
                    content: '请选择站点'
                })
            } else {
                if (this.fileVal == '') {
                    this.$Message.warning({
                        content: '请先上传文件'
                    })
                } else {
                    this.uploadBool = false;
                    const formData = new FormData();
                    formData.append('fileitem', this.fileVal);
                    formData.append('appId', this.params2.appid);
                    axios({
                        method: 'post',
                        url: inPutExcel,
                        headers: {
                            token: getToken(),
                        },
                        data: formData
                    }).then( res => {
                        const data = res.data;
                        switch (data.code) {
                            case '2000' :
                                if (data.data == null) {
                                    this.$Message.success({
                                        content: '上传成功'
                                    })
                                    this.uploadBool = true;
                                    this.modal1 = false;
                                    this.getList();
                                } else {
                                    this.$Modal.confirm({
                                        title: '提示',
                                        content: '上传完成，其中'+ data.data.join(',') + '重复输入，请悉知'
                                    })
                                }
                                break;
                            case '2000':
                                this.$Modal.confirm({
                                    title: '提示',
                                    content: '登录已失败,请重新登录',
                                    onOk: () => {
                                        setToken('')
                                        router.push('/login')
                                    }
                                });
                                break;
                            default:
                                this.$Modal.confirm({
                                    title: '提示',
                                    content: 'data.message',
                                });
                                break;
                        }
                    })
                }
            } 
        },
        // 导出当前模板
        exportReport(val) {
            if (val === '1') {
                this.src = outPutExcelModal+'?now='+new Date().getTime();
            } else {
                const item = Object.assign({}, this.params, {
                    qid: this.params.qid || '',
                    status: this.params.status === undefined ? '' : this.params.status
                })
                const url = outPutExcel + '?token=' + getToken() + '&qid=' + item.qid + '&qidLabel=""' + '&status=' + item.status + "&pageSize=" + this.pageSize +"&pageNumber=" + this.currentPage+'&now='+new Date().getTime();
                this.src = url;
            }
        },
        // 获取渠道列表
        getSite() {
            getSspQidName().then(res => {
                const data = res.data.data;
                if (data) {
                    const arr = [];
                    this.qidList = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.value) == -1) {
                            const obj = {
                                key: item.value,
                                value: item.value
                            };
                            arr.push(item.value);
                            this.qidList.push(obj);
                        }
                    });
                }
            })
        },
        selectTd(params) {
            this.idList = [];
            params.forEach(res => {
                this.idList.push(res.id);
            })
        },
        /**
         * 状态开关
        */
        changSatate (type) {
            if (this.idList.length === 0) {
                return;
            }
            const idList = this.idList.join(',');
            const ajaxData = {
                id: idList,
                status: null
            };
            if (type === 'on') {
                ajaxData.status = 1;
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认要启用吗？',
                    onOk: () => {
                        ipdateQidOnIsOff(ajaxDara).then(res => {
                            this.getList();
                            this.$Message.success('已开启')
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
                        updateQidOnIsOff(ajaxData).then(res => {
                            this.$Message.success('已关闭');
                            this.getList();
                        })
                    },
                    cancelText: '取消'
                })
            }
        },
        // 上传窗口显示
        uploadShow() {
            this.inputVal = '';
            this.fileVal = null;
            this.fileName = '';
            this.params2.appName = '';
            this.params2.appid = '';
            this.uploadBool = true;
            this.modal1 = true;
        },
        hideWindow() {
            inputVal = '';
            this.fileVal = null;
            this.fileName = '';
            this.params2.appName = '';
            this.params2.appid = '';
            this.uploadBool = true;
            this.modal1 = false;
        },
        getList (currentPage) {
            const _this = this;
            const ajaxData = Object.assign({}, this.params, {
                status: this.params.status || '-99'
            });
            if (currentPage) this.currentPage = currentPage;
            selectQidChannelDetails({
                page: this.currentPage,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.idList = [];
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            });
        },
        initList (pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params.keyword = '';
            this.params.source = '';
            this.params.status = '';
            this.getList(1);
        },
        submit(val) {
            if (val == 'on') {
                this.getList();
            }
            this.modal2 = false;
        },
        handleAdd() {
            this.modal2 = true;
            this.modalType = 'add';
            this.formData = {
                modalType: 'add'
            };
        },
        disBlank (event) {
            if (event.keyCode == 32) event.returnValue = false;
        }
    },
    mounted() {
        this.getViewData()
        this.getsiteList();
        this.getSite();
        this.getList();
    },
    computed: {},
    // keep-alive  生命周期-进入页面时
    activated() {
        this.modal2 = false;
        this.params.qidFlag = '';
        this.params.status = '';
        this.params.vagueContent = '';
        this.params.qid = '';
        if (this.$route.params.id) {
            this.params.qidFlag = this.$route.params.id;
            this.getList();
        }
    }
}
</script>
