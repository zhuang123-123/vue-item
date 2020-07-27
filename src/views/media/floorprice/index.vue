<template>
<!-- 底价管理列表 -->
  <div style="min-width:1600px;">
    <Card v-show="!modal2">
      <div>
        <!-- <Button icon="ios-power" type="primary" @click="uploadShow" style="margin-left:10px;">上传</Button> -->
        <Button icon="ios-archive" type="primary" @click="exportReport">导出</Button>
      </div>
      <div style="margin:10px 0;">
        <Select v-model="params.appName" filterable style="width:200px;" placeholder="请选择站点名称" @on-change="get_slot_name">
          <Option v-for="item in siteList" :value="item.value" :key="item.key">{{ item.value }}</Option>
        </Select>
        <Select v-model="params.slotName" filterable style="width:200px;margin-left: 10px;" placeholder="请选择广告位名称">
          <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.value }}</Option>
        </Select>
        <Input v-model="params.allContent" placeholder="模糊搜索：广告位名称，id，站点名称" style="width: 200px;margin-left: 10px;" />
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
      ></Table>
      <div style="margin-top: 10px;">
      <Page @on-change="getList" :page-size-opts='pageSizeList' @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer/>
      </div>
    </Card>
    <Card v-show="modal2">
      <table-detail :data="formData"  @on-submit="submit" ></table-detail>
    </Card>
    <div class="window_other_l" v-show="modal1">
      <div class="page_view">
        <span class="cancel" @click="hideWindow">X</span>
        <div class="page_title">导入</div>
        <Form :label-width="120" >
          <FormItem label="请上传：">
            <label class="upload_label" for="input">
              上传
            </label>
            <input id="input" type="file" :value="inputVal" style="display:none" @change="uploadChange" :disabled='!uploadBool'/>
            <Button icon="ios-log-out" type="primary" style="margin-left:10px;" @click="exportTemplate">导出模板</Button>
            <p>{{fileName}}</p>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">确定</Button>
            <Button style="margin-left: 40px" @click="hideWindow">取消</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <iframe :src="src" frameborder="0" style="display:none"></iframe>
  </div>
</template>
<script>
import MyModal from '_c/my-modal';
import TableDetail from './table-detail';
import { getToken, getNumber } from '@/libs/util'
import axios from 'axios'
import {
    inPutExcel_floor,
    getFloorExcelTemplate,
    getOutPutFloorDetails,
    getSiteName,
    getSlotNameByAppId,
    getFloorDetails
} from '@/api/media';
import { setCondition, getCondition } from '@/libs/util'
export default {
    name: 'floorprice_page',
    components: {
        MyModal,
        TableDetail
    },
    data() {
        return {
            modal1: false,  // 上传窗口  true: 显示  false: 隐藏
            accept: ['xlsx', 'xls'],  // 支持格式
            maxSize: 10,  // 文件大小限制， 单位M
            uploadBool: true,  // 上传按钮是否能点击
            fileName: '',  //文件名称
            inputVal: '',  // 上传input的value值
            fileVal: '',  //上传文件对象
            src: '',
            siteList: [],  // 站点列表
            departmentList: [],  // 广告位列表
            idList: [],
            siteId: '',
            columns: [
                {title: 'id', key: 'id', align: 'center'},
                {title: '广告位id', key: 'slotId', align: 'center'},
                {title: '广告位名称', key: 'slotName', align: 'center'},
                {title: '站点名称', key: 'appName', align: 'center'},
                {title: '渠道CODE', key: 'qid', align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.qid == 'all' ? '不限' : params.row.id)
                    }
                },
                {title: 'miniCpm', key: 'minCpmDay', align: 'center'},
                {title: 'K值', key: 'krate', align: 'center'},
                {
                    title: '操作', key: 'action', align: 'center',
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
                                            this.formData = {
                                                id: params.row.slotId,
                                                modalType: 'view'
                                            }
                                        }
                                    }
                                },
                                '底价明细'
                            )
                        ])
                    }
                }
            ],
            params: {
                appName: '',
                slotName: '',
                allContent: ''
            },
            modal2: false,
            tableData: [],
            formData: {},
            total: 0,
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            currentPage: 1,
            modalType: ''
        }
    },
    methods: {
        // 上传窗口显示
        uploadShow() {
            this.inputVal = '';
            this.fileVal = '';
            this.fileName = '';
            this.uploadBool = true;
            this.modal1 = true;
        },
        // 隐藏上传页面
        hideWindow() {
            this.inputVal = '';
            this.fileVal = '';
            this.fileName = '';
            this.uploadBool = true;
            this.modal1 = false;
        },
        uploadChange(val) {
            const file = val.target.files[0];
            const arr = file.name.split('.');
            const type = arr[arr.length-1].toLowerCase();  // 文件格式
            const size = file.size/1024/1024;  // 文件大小
            if (this.accept.indexOf(type) == -1) {
                this.$Message.warning({
                    content: '文件格式错误'
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
            if (this.fileVal == '') {
                this.$Message.warning({
                    content: '请先上传文件'
                })
            } else {
                this.uploadBool = false;
                const formData = new FormData();
                formData.append('fileitem', this.fileVal);
                axios({
                    method: 'post',
                    url: inPutExcel_floor,
                    headers: {
                        'token': getToken(),
                        'Login-Serial-Number': getNumber()
                    },
                    data: formData
                }).then(res => {
                    const data = res.data;
                    switch (data.code) {
                        case '2000':
                            this.$Message.success({
                                content: '上传成功'
                            })
                            this.uploadBool = true;
                            this.modal1 = false;
                            this.getList();
                            break;
                        case '2000':
                            this.$Modal.confirm({
                                title: '提示',
                                content: '登录已失效,请重新登录',
                                onOk: () => {
                                    setToken('')
                                    router.push('/login')
                                }
                            })
                            break;
                        default:
                            this.$Modal.confirm({
                                title: '提示',
                                content: data.message
                            });
                            break;
                    }
                })
            }
        },
        // 导出模板
        exportTemplate() {
            this.src = getFloorExcelTemplate+ '?now=' + new Data().getTime();
        },
        // 导出当前模板
        exportReprot() {
            const url = getOutPutFloorDetails + "?token=" + getToken() + '&loginSerialNumber='+ getNumber() + '&slotName='+ this.params.slotName + '&appName=' + this.params.appName+ '&allContent='+ this.params.allContent+'&pageSize='+this.pageSize+'&pageNumber='+this.currentPage+'&now='+new Date().getTime();
             this.src = url;
        },
        get_site_name() {
            getSiteName().then(res => {
                const data = res.data.data;
                if (data) {
                    this.siteList = [];
                    const arr = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.appName) == -1) {
                            const obj = {
                                key: item.id,
                                value: item.appName
                            }
                            arr.push(item.appName);
                            this.siteList.push(obj);
                        }
                    })
                }
            })
        },
        // 有联动关系
        get_slot_name() {
            this.departMentList = [];
            this.siteList.map(res => {
                if (res.value === this.params.appName) {
                    this.siteId = res.key;
                }
            })
            this.params.slotName = '';
            getSlotNameByAppId(this.siteId).then(res => {
                const data = res.data.data;
                if (data) {
                    const arr = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.slotName) == -1) {
                            const obj = {
                                key: item.slotName,
                                value: item.slotName
                            }
                            err.push(item.slotName);
                            this.departmentList.push(obj);
                        }
                    })
                }
            })
        },
        getList(currentPage) {
            if (this.params.slotName === undefined) {
                this.params.slotName = '';
            }
            const ajaxData = Object.assign({}, this.params, {
                appName: this.params.appName || '',
                slotName: this.params.slotName || '',
                allContent: this.params.allContent,
            })
            if (currentPage) this.currentPage = currentPage;
            getFloorDetails({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data.list || [];
                this.total = res.data.data.total || 0;
            });
        },
        initList (pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.params = {
                appName: '',
                slotName: '',
                allContent: '',
            };
            this.departmentList = [];
            this.getList();
        },
        submit(val) {
            if (val == 'on') this.getList();
            this.modal2 = false;
        },
        handleAdd() {
            this.$Message.success({
                content: '暂未开发'
            })
        }
    },
    mounted() {
        this.get_site_name();
        if (this.$route.params.id) {
            this.params.allContent = this.$route.params.id;
            this.getList();
        } else {
            this.getList();
        }
    },
    // keep-alive 生命周期-进入页面时
    activated() {
        if (this.$route.params.id) {
            this.modal1 = false;
            this.modal2 = false;
            this.params = {
                appName: '',
                slotName: '',
                allContent: ''
            };
            this.params.allContent = this.$route.params.id;
            this.getList();
        }
    }
}
</script>
