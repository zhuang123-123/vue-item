<template>
    <!-- 广告创意管理列表 -->
    <div style="min-width: 1600px;">
        <Card>
            <div style="margin: 10px 0;">
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.agent" filterable placeholder="请选择代理商">
                    <Option :value="item.id" v-for="item in agentList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.ad" filterable placeholder="请选择广告主/直客">
                    <Option :value="item.id" v-for="item in userList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.plan" filterable placeholder="请选择广告计划" >
                    <Option :value="item.id" v-for="item in planList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.plan_status" filterable placeholder="请选择广告计划">
                    <Option :value="item.id" v-for="item in statusList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.idea_status" filterable placeholder="请选择广告创意状态">
                    <Option :value="item.id" v-for="item in idea_status_list" :key="item.key">{{item.value}} </Option>
                </Select>
                <Input v-model="formValidate.keyword" placeholder="模糊查询：广告创意名称或者id" style="width: 200px; margin: 5px 10px 5px 0" />
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.sell_id" filterable placeholder="请选择售卖位">
                    <Option :value="item.id" v-for="item in sellList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.design" filterable placeholder="请选择广告样式">
                    <Option :value="item.id" v-for="item in styleList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0" v-model="formValidate.level" filterable placeholder="请选择广告等级">
                    <Option :value="item.id" v-for="item in levelList" :key="item.id">{{item.value}} </Option>
                </Select>
                <treeselect 
                    style="width: 150px; margin: 5px 10px 5px 0" 
                    :multiple="false"
                    :options="tradeList"
                    placeholder="请选择行业"
                    v-model="formValidate.trade" 
                />

                <Button type="primary" @click="handleSubmit()"> 查询</Button>
                <Button @click="handleReset()" style="margin: 0 10px 0 8px"> 重置</Button>
            </div>
            <Table
                class="table"
                ref="tables"
                :total="dataCount"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                :loading="loading">
            </Table>
            <div style="margin-top: 10px">
                <Page @on-change="getList" @on-page-size-change="initList" :total="dataCount" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
        <my-modal v-model="details" title="创意审核">
            <div class="detailsClass">
                <Form ref="formly" :model="formly" :label-width="110">
                    <h3 style="margin-bottom: 10px; margin-top: 20px;">所属广告计划</h3>
                    <FormItem label="广告计划名称">
                        {{formly.plan_name}}
                    </FormItem>
                    <FormItem label="售卖位">
                        {{formly.sell_name}}
                    </FormItem>
                    <FormItem label="投放时间">
                        {{formly.start_at + '至' + formly.end_at}}
                    </FormItem>
                    <FormItem label="计费方式">
                        {{formly.free_type_price+ '元/' + formly.free_type}}
                    </FormItem>
                    <h3 style="margin-bottom: 20px; margin-top: 20px;">基本信息</h3>
                    <FormItem label="广告创意名称">
                        <span>{{formly.idea_name}} </span>
                    </FormItem>
                    <FormItem label="推广链接">
                        <span>{{formly.link}} </span> 
                    </FormItem>
                    <FormItem label="广告样式">
                        <span>{{formly.design_name}} </span>
                    </FormItem>
                    <FormItem label="素材">
                        <div class="demo-upload-list" v-for="(item, index) in listImg" :key="index">
                            <template>
                                <img :src="item" @click="showView(item)" />
                            </template>
                        </div>
                    </FormItem>
                    <FormItem label="视频" v-if="formly.video && formly.video.length">
                        <div v-for="(one, index) in formly.video" :key="index">
                            <span class="seeVideoBtn" @click="videoView(one)"> 查看视频</span>
                        </div>
                    </FormItem>
                    <FormItem label="创意标题"> 
                        <span v-for="(item, index) in listTitle" :key="index">
                            {{item}}
                        </span>
                    </FormItem>
                    <FormItem label="副标题">
                        <span>{{formly.sub_title}} </span>
                    </FormItem>
                    <FormItem label="来源">
                        <span>{{formly.source}} </span>
                    </FormItem>
                    <FormItem label="状态">
                        <span>{{formly.review_status_txt}} </span>
                    </FormItem>
                    <FormItem label="广告等级" required>
                        <Select clearable style="width: 200px;" v-model="formly.level" filterable :disabled="viewType == 'view'" placeholder="请选择广告等级">
                            <Option :value="item.id" v-for="item in levelList" :key="item.id">{{item.value}} </Option>
                        </Select>
                        <span style="margin-left: 10px; color: rgb(204, 204, 204);">(注：审核通过时必填)</span>
                    </FormItem>
                    <FormItem label="行业分类标注" prop="sectors">
                        <treeselect 
                            :disabled="viewType == 'view'"
                            :multiple="false"
                            :options="tradeList"
                            placeholder="请选择行业"
                            v-model="formly.trade" 
                        />
                    </FormItem>
                    <FormItem label="备注" required>
                        <Input :disabled="viewType == 'view'" v-model="formly.remark" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入备注。。。" />
                    </FormItem>
                    <FormItem>
                        <Button @click="examineClick(2)" :disabled="viewType=='view'" type="primary">通过</Button>
                        <Button @click="examineClick(3)" :disabled="viewType=='view'" style="margin-left: 8px">拒绝</Button>
                    </FormItem>
                </Form>
            </div>
        </my-modal>
        <div v-show="showPic" @click="showHide" class="windowPic">
            <img :src="imgSr" alt="无效地址" style="max-width: 100%"/>
        </div>
        <div v-show="showVideo" @click="showHide" class="windowPic">
            <video controls :src="videoSr" sutoplay muted alt="无效地址" id="video" @click="hideVideo" style="max-width: 100%" >当前浏览器不支持视频播放</video>
        </div>
    </div>
</template>

<script>
import Treeselect from '@riopgae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import selectPage from '@/selectPage.vue'
import MyModal from '_c/my-modal'
import {
    getCreativeList,
    getAgentList,
    getUserList,
    getDictionaryList,
    getCreativeInfo,
    rejectCreative,
    approveCreative,
    pauseCreative,
    deleteCreative,
    planNameList
} from '@/api/pd';
import {siteSelectorList, getSectorsFirst } from '@/api/website';
import { getDesignList } from '@/api/media';
export default {
    components: {
        MyModal,
        selectPage,
        Treeselect
    },
    data() {
        return {
            shenheBool: false,  // 审核权限 true: 有  false: 没有
            pauseBool: false,  // 暂停投放权限  true: 有 false：没有
            deleteBool: false,  // 删除权限true: 有 false: 没有
            imgSr: '',  // 当前全屏查看图片地址
            videoSr: '',  //当前全屏查看视频地址
            showPic: false,  // 图片显示控制值, true显示 false 不显示
            showVideo: false,  // 视频显示控制值 true: 显示 false: 不显示
            agentList: [],  // 代理商列表
            userList: [],  // 广告主列表
            planList: [],  // 计划列表
            styleList: [],  // 样式列表
            viewType: '',  // view： 查看  edit： 编辑
            // 广告状态列表
            statusList: [
                { id: '-1', value: '审核拒绝' },
                { id: '0', value: '新建审核' },
                { id: '1', value: '带投放' },
                { id: '2', value: '投放中'},
                { id: '3', value: '投放结束'},
                { id: '4', value: '已删除'}
            ],
            idea_status_list: [
                { key: '1', value: '启用中' },
                { key: '0', value: '审核中' },
                { key: '-1', value: '审核拒绝'},
                { key: '2', value: '暂停' },
                { key: '3', value: '已删除' },
                { key: '4', value: '投放结束' }
            ],  // 广告创意状态列表
            sellList: [],  // 售卖位列表
            designList: [],  // 样式列表
            levelList: [],  // 等级列表
            tradeList: [],  //广告行业列表
            cyID: '',
            listImg: [],
            listTitle: [],
            // 创意审核
            formly: {},
            details: false,
            ied: [],
            creativeStatus: [],
            searchKey: false,
            formValidate: {
                agent: null,//代理商
                ad: null,//广告主、直客
                plan: null,//	广告计划
                plan_status: null,//广告计划状态
                idea_status: null,//广告创意状态
                keyword: '',//创意名称或者id
                design: null,//广告样式
                level: null,//广告等级
                trade: null,//广告行业
                sell_id: null//售卖位
            },
            loading: false, //加载中
			// 分页
			dataCount: 0, // 初始化信息总条数
            pageNum: 1, // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            // 列表
            columns: [
                {
                    title: '创意ID',
                    align: 'center',
                    minWidth: 40,
                    key: 'idea_id'
                },
                {
                    title: '广告创意名称',
                    align: 'center',
                    minWidth: 40,
                    key: 'idea_name'
                },
                {
                    title: '广告计划名称',
                    align: 'center',
                    minWidth: 40,
                    key: 'plan_name'
                },
                {
                    title: '广告主名称',
                    align: 'center',
                    key: 'company'
                },
                {
                    title: '售卖位',
                    align: 'center',
                    key: 'sell_name'
                },
                {
                    title: '广告样式',
                    align: 'center',
                    key: 'design_name'
                },
                {
                    title: '推广链接',
                    minWidth: 40,
                    align: 'center',
                    key: 'link',
                    render: (h, params) => {
                        if(params.row.link) {
                        　　return h('div', [
                        　　　　h('Tooltip', {
                        　　　　    props: {
                                        placement: 'bottom',
                                        theme: "light"
                                    },
                        　　　　}, [
                        　　　　h('span', {
                                    domProps: {
                                        innerHTML: params.row.link
                                    }
                        　　　　　　}),
                        　　　　　　h('span', {
                        　　　　　　　　 slot: 'content',
                        　　　　　　　　 style: { whiteSpace: 'normal', wordBreak: 'break-all' },
                                        domProps: {
                                            innerHTML: params.row.link
                                        }
                        　　　　　　})
                        　　　　])
                        　　])
                        } else {
                        　　return h('div', [
                        　　　　h('span','暂无')
                        　　])
                        }
                    }
                },
                {
                    title: '日消耗',
                    align: 'center',
                    key: 'daily_sum'
                },
                {
                    title: '广告计划状态',
                    align: 'center',
                    key: 'plan_put_status',
                    render: (h, params) => {
						const _text = this.statusList.filter(item => item.id == params.row.plan_put_status)[0].value
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                }
                            }, _text),
                        ]);
                    }
                },
                {
                    title: '广告创意状态',
                    align: 'center',
                    key: 'put_status',
                    render: (h, params) => {
						const _text = this.idea_status_list.filter(item => item.key == params.row.put_status)[0].value
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                }
                            }, _text),
                        ]);
                    }
                },
                {
                    title: '广告等级',
                    align: 'center',
                    key: 'levelName'
                },
                {
                    title: '行业分类',
                    align: 'center',
                    key: 'tradeName',
                },
                {
                    title: '审核备注',
                    align: 'center',
                    key: 'remark'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor:'pointer',
                                    color: '#0099FF'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        self.cyID = params.row.id;
                                        let data = {
                                            id: params.row.id
                                        }
                                        getCreativeInfo(data).then(res=>{
                                            self.viewType = 'view';
                                            self.details = true;
                                            self.formly = res.data.data;
                                            if(self.formly.sub_title) {
                                                self.formly.sub_title = self.formly.sub_title.join('');
                                            }
                                            if(self.formly.image) {
                                                self.listImg = self.formly.image;
                                            }
                                            if(self.formly.title) {
                                                self.listTitle = self.formly.title;
                                            }
                                        }).catch(error=>{})
                                    }
                                }
                            }, '查看'),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor:'pointer',
                                    color: '#0099FF'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        self.cyID = params.row.id;
                                        let data = {
                                            id: params.row.id
                                        }
                                        getCreativeInfo(data).then(res=>{
                                            self.viewType = 'edit';
                                            self.details = true;
                                            self.formly = res.data.data;
                                            if(self.formly.sub_title) {
                                                self.formly.sub_title = self.formly.sub_title.join('');
                                            }
                                            if(self.formly.image) {
                                                self.listImg = self.formly.image;
                                            }
                                            if(self.formly.title) {
                                                self.listTitle = self.formly.title;
                                            }
                                        }).catch(error=>{})
                                    }
                                }
                            }, (params.row.put_status == -1||params.row.put_status == 0||params.row.put_status == 1||params.row.put_status == 2)&&this.shenheBool?'创意审核':''),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor:'pointer',
                                    color: 'rgb(255, 0, 0)'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title:'提示',
                                            content:'广告创意状态变更为已暂停，将不再进行广告创意的投放，是否进行暂停操作？',
                                            onOk:()=>{
                                                pauseCreative({id:params.row.id}).then(res=>{
                                                    this.$Message.success('暂停成功');
                                                    this.getList();
                                                })
                                            },
                                            cancelText:'取消'  
                                        })
                                    }
                                }
                            },(params.row.put_status == 1&&this.pauseBool)?'结束投放':''),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor:'pointer',
                                    color: 'rgb(255, 0, 0)'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title:'提示',
                                            content:'确认要删除吗？',
                                            onOk:()=>{
                                                deleteCreative({id:params.row.id}).then(res=>{
                                                    this.$Message.success('删除成功');
                                                    this.getList();
                                                })
                                            },
                                            cancelText:'取消'  
                                        })
                                    }
                                }
                            }, ((params.row.put_status == -1||params.row.put_status == 2)&&this.deleteBool)?'删除':'')
                        ]);
                    }
                }
            ],
            tableData: []
        };
    },
    computed: {

    },
    mounted() {
        this.agentChange();
        this.initSelects();
        this.getList();
        let _this = this;
        document.getElementById('video').onended =  function () {
            _this.showVideo = false;
            _this.videoSr = '';
        };
    },
    methods: {
        // 获取下拉框数据
        initSelects() {
            // 代理商下拉框
            getAgentList().then(res => {
                this.agentList = res.data.data;
            })
            // 售卖位下拉框（投放位置）
            siteSelectorList().then(res => {
                this.sellList = res.data.data;
            })
            // 样式列表
            getDasignList().then(res => {
                this.styleList = res.data.data;
            })
            // 获取行业列表
            getSectorsFirst({level: '2'}).then(res => {
                this.tradeList = [];
                res.data.data.map(item => {
                    let obj = {};
                    obj.id = String(item.id)
                    obj.label = item.value;
                    obj.children = [];
                    item.child.map(para => {
                        if (item.id != para,id) {
                            let paraObj = {};
                            paraObj.id = String(para.id);
                            paraObj.label = para,value;
                            obj.children.push(paraObj)
                        }
                    })
                    this.tradeList.push(obj);
                })
            })
            // 获取等级列表
            getDictionaryList({type: 'level'}).then(res => {
                this.levelList = res.data.data;
            })
            planNameList().then(res => {
                this.planList = res.data.data;
            })
        },
        //获取广告主数据
        agentChange(val) {
            getUserList({user_id: val || '-99'}).then(res => {
                this.userList = res.data.data;
            })
        },
        // 点击展示全图
        showView(val) {
            this.imgSr = val;
            this.showPic = true;
        },
        // 隐藏图片-视频
        showHide(e) {
            this.videoSr = '';
            this.showPic = false;
            this.showVideo = false;
        },
        // 查看视频
        videoView(val) {
            this.videoSr = val;
            this.showVideo = true;
        },
        hideVideo(e) {
            e.stopPropagation();
        },
        // 列表
        getList(currentPage) {
            if (currentPage) this.pageNum = currentPage;
            const ajaxData = Object.assign({}, this.formValidate, {
                agent: this.formValidate.agent || '-99',
                ad: this.formValidate.ad || '-99',
                plan: this.formValidate.plan || '-99',
                plan_status: this.formValidate.plan_status || '-99',
                idea_status: this.formValidate.idea_status || '-99',
                design: this.formValidate.design || '-99',
                level: this.formValidate.level || '-99',
                trade: this.formValidate.trade || '-99',
                sell_id: this.formValidate.sell_id || '-99'
            })
            getCreativeList({
                page: this.pageNum,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data || [];
                this.dataCount = res.data.total || 0;
            })
        },
        examineClick (key) {
            // 2-通过；3-拒绝
            switch (key) {
                case 2:
                    if (!this.formly.level) {
                        this.$Message.error('请选择广告等级')
                        return false
                    }
                    if (!this.formly.trade) {
                        this.$Message.error('请选择行业分类')
                        return false
                    }
                    approveCreative({id: this.formly.id, level: this.formly.level, trade: this.formly.trade, remark: this.formly.remark || ''}).then(res => {
                        this.$Message.success('审核通过成功');
                        this.details = false;
                        this.getList();
                    })
                    break;
                case 3:
                    if (!this.formly.remark) {
                        this.$Message.error('请填写备注')
                        return false
                    }
                    rejectCreative({id: this.formly.id, remark: this.formly.remark || ''}).then(res => {
                        this.$Message.success('审核拒绝通知')
                        this.details = false;
                        this.getList();
                    })
                    break;
                default:
                    break;
            }
        },
        // 查询
        handleSubmit() {
            this.pageNum = 1;
            this.getList();
        },
        // 重置
        handleReset (formValidate) {
            this.formValidate.agent = null;
            this.formValidate.ad = null;
            this.formValidate.plan_status = null;
            this.formValidate.plan = null;
            this.formValidate.idea_status = null;
            this.formValidate.keyword = '';
            this.formValidate.design = null;
            this.formValidate.level = null;
            this.formValidate.trade =null;
            this.formValidate.sell_id = null;
            this.pageNum = 1;
            this.accountsList();
        },
        // 显示隐藏搜索框
        changeSearch(bool) {
            this.searchKey = bool;
        },
        // 获取table每行ID
        selectChange(data) {
            this.creativeStatus = data.map(item => item.deliveryStatus);
            this.ied = data.map(item => item.id);
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const menuStr = localStorage.getItem('ms_menuStr').split('|||')
            // 审核
            if (isInArray(menuStr, '/idea/approve') == false) {
                vm.shenheBool = false
            } else {
                vm.senheBool = true;
            }
            // 结束投放
            if (isInArray(menuStr, '/idea/pause') == false) {
                vm.pauseBool = false
            } else {
                vm.pauseBool = true
            }
            // 删除
            if (isInArray(menuStr, '/idea/delete') == false) {
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
