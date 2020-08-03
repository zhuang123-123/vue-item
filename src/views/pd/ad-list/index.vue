<template>
    <div style="min-width: 1600px;">
        <Card>
            <div style="margin: 10px 0;">
                <Select clearable style="width: 150px;" v-model="formValidate.agent" filterable placeholder="请选择代理商" @on-change="agentChange">
                    <Option style="width: 150px;" :value="item.id" v-for="item in agentList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin-left: 10px" v-model="formValidate" filterable placeholder="请选择广告主/直客">
                    <Option style="width: 150px;" :value="item.id" v-for="item in userList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Select clearable style="width: 150px; margin-left: 10px" v-model="formValidate.status" filterable placeholder="请选择广告计划状态">
                    <Option style="width: 150px;" :value="item.id" v-for="item in modeList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Input v-model="formValidate.keyword" placeholder="模糊查询：广告计划名称或id" style="width: 200px; margin-left: 10px;" />
                <Select clearable style="width: 150px; margin-left: 10px;" v-model="formValidate.sell" filterable placeholder="请选择售卖位">
                    <Option style="width: 150px;" :value="item.id" v-for="item in sellList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Button type="primary" style="margin-left: 10px" @click="getList(1)">查询</Button>
                <Button style="margin-left: 10px;" @click="resetList">重置 </Button>
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
            <div style="margin-top: 10px;">
                <Page @on-change="getList" @on-page-size-change="initList" :tital="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
        </Card>
        <my-modal v-model="details" title="计划详情">
            <div class="detailsClass1">
                <Form ref="formly" :model="formly" :label-width="110">
                    <h3 style="margin-bottom: 10px; margin-top: -10px;">基本信息</h3>
                    <FormItem label="计划名称">
                        {{formly.plan_name}}
                    </FormItem>
                    <FormItem label="终端类型">
                        {{formly.plat}}
                    </FormItem>
                    <FormItem label="售卖位名称">
                        {{ formly.sell_name}}
                    </FormItem>
                    <FormItem label="投放时间">
                        {{formly.times}}
                    </FormItem>
                    <FormItem label="计费方式">
                        {{formly.priceType}}
                    </FormItem>
                    <div style="border-bottom: 1px solid #333333; margin-bottom: 20px;"></div>
                    <div v-for="(item, index) in creativeList" :key="index" style="padding-bottom: 20px; border-bottom: 1px solid #333333; margin-bottom: 20px;">
                        <h3 style="margin-bottom: 10px;">创意{{index+1}}基本信息 </h3>
                        <FormItem label="广告创意名称">
                            <span>{{item.idea_name}} </span>
                        </FormItem>
                        <FormItem label="推广链接">
                            <span>{{item.link}} </span>
                        </FormItem>
                        <FormItem label="广告样式">
                            <span>{{item.design_name}} </span>
                        </FormItem>
                        <FormItem label="素材">
                            <div class="demo-upload-list" v-for="(one, index) in item.image" :key="index">
                                <template>
                                    <img :src="one" @click="showView(one)" />
                                </template>
                            </div>
                        </FormItem>
                        <FormItem label="视频" v-show="item.video.length">
                            <div v-for="(onem, index) in item.video" :key="index">
                                <span class="seeVideoBtn" @click="showVideo(one)"> 查看视频</span>
                            </div>
                        </FormItem>
                        <FormItem label="创意标题">
                            <span v-for="(item, index) in item.title" :key="index">
                                {{item}}
                            </span>
                        </FormItem>
                        <FormItem label="副标题">
                            <span>{{item.sub_title.join('') }} </span>
                        </FormItem>
                        <FormItem label="来源">
                            <span>{{item.source}} </span>
                        </FormItem>
                        <FormIten label="创意状态" required>
                            <Select clearable style="width: 100px;" :disabled="viewType=='view'" v-model="item.status" filterable placeholder="请选择创意状态" @on-change="statusChange(index)">
                                <Option :value="item.id" v-for="item in switchList" :key="item.id">{{item.value}} </Option>
                            </Select>
                        </FormIten>
                        <FormItem label="广告等级" required v-show="item.status == '1'">
                            <Select clearable style="width: 200px;" v-model="item.level" :disabled="viewType == 'view'" filterable placeholder="请选择广告等级">
                                <Option :value="item.id" v-for="item in levelList" :key="item.id">{{item.value}} </Option>
                            </Select>
                            <span style="margin-left: 10px; color: rgb(204, 204, 204);">(注：审核通过时必填) </span>
                        </FormItem>
                        <FormItem label="行业分类" required v-show="item.status == '1'">
                            <treeselect 
                                :disabled="viewType=='view'" 
                                style="width: 200px;"
                                :multiple="false"
                                :options="tradeList"
                                placeholder="请选择行业"
                                v-model="item.trade" />
                            <span style="margin-left: 10px; color: rgb(204, 204, 204);">(注：审核通过时必填)</span>
                        </FormItem>
                    </div>
                    <FormItem label="计划审核备注">
                        <Input :disabled="viewType=='view'" v-model="formly.remark" type="textarea" placeholder="请输入备注。。。" />
                    </FormItem>
                    <FormItem>
                        <Button @click="examineClick(1)" :disabled="viewType == 'view'" type="primary">审核通过</Button>
                        <Button @click="examineClick(2)" :disabled="viewType == 'view'" style="margin-left: 8px">审核拒绝</Button>
                    </FormItem>
                </Form>
            </div>
        </my-modal>
        <div v-show="showPic" @click="showHide" class="windowPic">
            <img :src="imgSr" alt="无效地址" style="max-width: 100%" />
        </div>
        <my-modal v-model="timeShow" title="计划详情" style="height: min-height: 60%">
            <Form ref="formly" :model="formly" :label-width="110">
                <h3 style="margin-bottom: 10px; margin-top: -10px;">投放时间修改</h3>
                <FormItem label="计划名称">
                    {{formly.plan_name}}
                </FormItem>
                <FormItem label="售卖位名称">
                    {{formly.sell_name}}
                </FormItem>
                <FormItem label="投放开始时间">
                    <DatePicker type="date" v-model="startAt" placeholder="请选择投放开始时间" format="yyyy-MM-dd" @on-change="startChange" style="width: 200px;"></DatePicker>
                    <span></span>
                    <Select placeholder="请选择小时" style="width: 100px; margin-left: 10px" v-model="params.start_hour">
                        <Option v-for="item in hourList" :value="item.key" :key="item.key">{{item.value}} </Option>
                    </Select>
                </FormItem>
                <FormItem label="投放结束时间">
                    <DatePicker type="date" v-model="endAt" placeholder="请选择投放结束时间" format="yyyy-MM-dd" @on-change="endChange" style="width: 200px"></DatePicker>
                    <Select placeholder="请选择小时" style="width: 100px; margin-left: 10px;" v-model="params.end_hour">
                        <Option v-for="item in hourList" :value="item.key" :key="item.key">{{item.value}} </Option>
                    </Select>
                </FormItem>
            </Form>
        </my-modal>
        <div class="view_area" v-show="nowImgSrc!=''" @click="nowImgSrc=''">
            <div class="view_box">
                <video controls name="media" autoplay muted :src="nowImgSrc" id="video" @click="hideVideo"></video>
            </div>
        </div>
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import MyModal from '_c/my-modal'
import {
    getPlanList,
    getAgentList,
    getUserList,
    planDetail,
    getDictionaryList,
    rejectPlan,
    approvePlan,
    pausePlan,
    deletePlan,
    editPlan
} from '@/api/pd';
import {
    siteSelectorList,
    getSectorsFirst
} from '@/api/website';
import { configDict, getConfigDict } from '@/api/common';
export default {
    components: {
        MyModal,
        Treeselect
    },
    data() {
        return {
            startAt: '',  // 编辑显示开始时间
            endAt: '',  // 编辑显示结束时间
            shenheBool: false,  // 审核权限 true: 有 false: 没有
            toufangBool: false,  // 投放时间修改权限 true: 有 false : 没有
            pauseBool: false,  // 暂停投放权限  true: 有 false: 没有
            deleteBool: false,  // 计划删除权限  true: 有  false: 没有
            imgSr: '',  //当前全屏查看图片地址
            showPic: false,  // 图片显示控制值 true: 显示  false: 不显示
            timeShow: false, // 修改时间框显示和隐藏
            viewType: '',     // view：查看模式  edit: 编辑模式
            nowImgSrc: '',  // 视频地址
            params: {
                start_tme: '',  // 开始时间
                end_time: '',  // 结束时间
                start_hour: '',  // 开始小时
                end_hour: '',  // 结束小时
            },
            hourList:[
                {key:'00:00:00',value:'00:00'},
                {key:'01:00:00',value:'01:00'},
                {key:'02:00:00',value:'02:00'},
                {key:'03:00:00',value:'03:00'},
                {key:'04:00:00',value:'04:00'},
                {key:'05:00:00',value:'05:00'},
                {key:'06:00:00',value:'06:00'},
                {key:'07:00:00',value:'07:00'},
                {key:'08:00:00',value:'08:00'},
                {key:'09:00:00',value:'09:00'},
                {key:'10:00:00',value:'10:00'},
                {key:'11:00:00',value:'11:00'},
                {key:'12:00:00',value:'12:00'},
                {key:'13:00:00',value:'13:00'},
                {key:'14:00:00',value:'14:00'},
                {key:'15:00:00',value:'15:00'},
                {key:'16:00:00',value:'16:00'},
                {key:'17:00:00',value:'17:00'},
                {key:'18:00:00',value:'18:00'},
                {key:'19:00:00',value:'19:00'},
                {key:'20:00:00',value:'20:00'},
                {key:'21:00:00',value:'21:00'},
                {key:'22:00:00',value:'22:00'},
                {key:'23:00:00',value:'23:00'},
                {key:'23:59:59',value:'24:00'}
            ],//小时列表
            interestList: [],  // 兴趣列表
            userList: [],  // 用户列表
            typeIndex2: '',
            membrane: true,
            timeBox: [],
            adPlanId: '',
            typeIndex: '',
            deliveryPlatform: '',
            formEnt: {},
            hide: false,
            ceshi: ['全部渠道', '已选渠道'],
            data2: [],
            targetKeys2: [],
            courses: [],
            checkAllGroup: [],
            tradeList: [],  // 广告行业列表
            levelList: [],  // 等级列表
            shenheList: [],  // 
            nowId: '',  // 当前处理对象计划id
            switchList: [
                { id: 1, value: '审核通过' },
                { id: -1, value: '审核拒绝'},
            ],
            // 计划详情
            formly: {
                plan_name: '',
                sell_name: '',
                plat: '',  // 终端类型
                times: '',
                priceType: '',
                remark: '',  // 备注
            },
            directional: false,
            details: false,
            formValidate: {
                agent: null,  // 代理商
                keyword: null,  // 关键字
                ad: null,  // 广告主直客
                status: null,  // 投放状态
            },
            creativeList: [],
            loading: false,   // 加载中
            // 分页
            dataCount: 0,  // 初始化信息总条数
            pageNum: 1,  // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            total: 0,
            // 代理商
            agentList: [],
            // 投放状态
            modeList: [
                { id: '-1', value: '审核拒绝' },
                { id: '0', value: '新建审核' },
                { id: '1', value: '带投放' },
                { id: '2', value: '投放中' },
                { id: '3', value: '投放结束'},
                { id: '4', value: '永删除'}
            ],
            // 售卖位列表
            sellList: [],
            // 列表
            columns: [
                {
                    title: '计划ID',
                    align: 'center',
                    minWidth: 50,
                    key: 'plan_id'
                },
                {
                    title: '广告计划名称',
                    align: 'center',
                    key: 'plan_name'
                },
                {
                    title: '广告主名称',
                    align: 'center',
                    key: 'company'
                },
                {
                    title: '广告投放状态',
                    align: 'center',
                    key: 'put_status',
                    render: (h, params) => {
                        const _text = this.modeList.filter(item => item.id == params.row.put_status)[0].value
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                }
                            }, _text),
                        ]);
                    }
                },
                {
                    title: '广告创意数',
                    align: 'center',
                    key: 'idea_detail'
                },
                {
                    title: '冻结金额',
                    align: 'center',
                    key: 'freeze_amount'
                },
                {
                    title: '日消耗',
                    align: 'center',
                    key: 'daily_sum'
                },
                {
                    title: '总消耗',
                    align: 'center',
                    key: 'plan_sum'
                },
                {
                    title: '付费方式',
                    align: 'center',
                    key: 'payment'
                },
                {
                    title: '出价',
                    align: 'center',
                    key: 'offer_price'
                },
                {
                    title: '投放开始时间',
                    align: 'center',
                    key: 'startAt',
                    width: 80
                },
                {
                    title: '投放结束时间',
                    align: 'center',
                    key: 'endAt',
                    width: 80,
                    render: (h, params) => {
                        return h('span', params.row.endAt.replace(/23:59:59/, '24:00:00'))
                    }
                },
                {
                    title: '投放终端',
                    align: 'center',
                    key: 'platform'
                },
                {
                    title: '售卖位',
                    align: 'center',
                    key: 'sell_name'
                },
                {
                    title: '备注',
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
                                    cursor: 'pointer',
                                    color: '#0099ff'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        planDetail({id: params.row.id}).then(res => {
                                            self.viewType = 'view';
                                            self.nowId = res.data.data.id;
                                            self.formly.plan_name = res.data.data.plan_name;
                                            self.formly.sell_name = res.data.data.sell_name;
                                            self.formly.plat = res.data.data.platform;
                                            self.formly.times = res.data.data.startAt + '至' + res.data.data.endAt.replace(/23:59:59/, '24:00:00');
                                            self.formly.priceType = res.data.data.ammount + '元/' + res.data.data.ammount_type;
                                            self.details = true;
                                            this.formly.remark = '';
                                            self.creativeList = [];
                                            res.data.data.ideaList.map(item => {
                                                let obj = {};
                                                if (item.review_status == 0) {
                                                    obj = Object.assign({}, item, {
                                                        status: '',
                                                        level: '',
                                                        trade: null
                                                    })
                                                } else if (item.review_status == 1) {
                                                    obj = Object.assign({}, item, {
                                                        status: 1
                                                    })
                                                } else if (item.review_status == -1) {
                                                    obj = Object.assign({}, item, {
                                                        status: -1,
                                                        level: '',
                                                        trade: null
                                                    })
                                                }
                                                self.creativeList.push(obj)
                                            })
                                            this.shenheList.push(obj);
                                        }).catch(error => {})
                                    }
                                }
                            }, '详情'
                            ),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    color: '#0099ff'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        planDetail({id: params.row.id}).then(res => {
                                            self.timeShow = true;
                                            self.nowId = res.data.data.id;
                                            self.formly.plan_name = res.data.data.plan_name;
                                            self.formly.sell_name = res.data.data.sell_name;

                                            self.params.start_time = res.data.data.startAt.split('')[0];
                                            self.params.start_hour = res.data.data.startAt.split('')[1];
                                            self.params.end_time = res.data.data.endAt.split('')[0];
                                            self.params.ent_hour = res.data.data.endAt.split('')[1];
                                            self.startAt = self.params.start_time;
                                            self.endAt = self.params.end_time;
                                        }).catch(error => {})
                                    }
                                }
                            },
                            (params.row.put_status == 0 || params.row.put_status == 1) && this.toufangBool ? '投放时间修改' : ''
                            ),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    color: '#0099ff'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        self.deliveryPlatform = params.row.deliveryPlatform;
                                        planDetail({id: params.row.id}).then(res => {
                                            self.viewType = 'edit';
                                            self.nowId = res.data.data.id;
                                            self.formly.plan_name = res.data.data.plan_name;
                                            self.formly.sell_name = res.data.data.sell_name;
                                            self.formly.plat = res.data.data.platform;
                                            self.formly.times = res.data.data.startAt + '至' + res.data.data.endAt.replace(/23:59:59/, '24:00:00');
                                            self.formly.priceType = res.data.data.ammount + '元/' + res.data.data.ammount_type;
                                            self.details = true;
                                            this.formly.remark = '';
                                            self.creativeList = [];
                                            res.data.data.ideaList.map(item => {
                                                let obj = {};
                                                if (item.review_status == 0) {
                                                    obj = Object.assign({}, item, {
                                                        status: '',
                                                        level: '',
                                                        trade: null
                                                    })
                                                } else if (item.review_status == 1) {
                                                    obj = Object.assign({}, item, {
                                                        status: 1
                                                    })
                                                } else if (item.review_status == -1) {
                                                    obj =  Object.assign({}, item, {
                                                        status: -1,
                                                        level: '',
                                                        trade: null
                                                    })
                                                }
                                                self.creativeList.push(obj)
                                            })
                                            this.shenheList.push(obj);
                                        }).catch(error => {})
                                    }
                                }
                            },
                            (params.row.put_status == 0 && this.shenheBool) ? '计划审核' : ''
                            ),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    color: '#0099ff'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '计划状态将被更新位投放结束, 不饿能后续的投放, 是否进行操作?',
                                            onOk: () => {
                                                pausePlan({id: params.row.id}).then(res => {
                                                    this.$Message.success('操作成功');
                                                    this.getList();
                                                })
                                            },
                                            cancelText: '取消'
                                        })
                                    }
                                }
                            },(params.row.put_statue == 1 || params.row.put_status == 2) && this.pauseBool ? '投放结束' : ''),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    color: '#0099ff'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '确认要删除吗',
                                            onOk: () => {
                                                deletePlan({id: params.row.id}).then(res => {
                                                    this.$Message.success('删除成功');
                                                    this.getList();
                                                })
                                            },
                                            cancelText: '取消'
                                        })
                                    }
                                }
                            }, (params.row.put_status == -1 || params.row.put_status == 3) && this.deleteBool ? '删除' : '')
                        ])
                    }
                }
            ],
            tableData: [],
        }
    },
    mounted() {
        this.getInterestList();
        this.agentChange();
        this.getList();
        document.getElementById('video').onended = function () {
            _this.nowImgSrc = '';
        }
    },
    methods: {
        btnClick() {
            if (!this.params.start_time) {
                this.$Message.error('请选择投放开始时间');
                return false;
            }
            if (!this.params.start_hour) {
                this.$Message.error('请选择投放开始小时')
                return false;
            }
            if (!this.params.end_time) {
                this.$Message.error('请选择投放结束时间')
                return false;
            }
            if (!this.params.end_hour) {
                this.$Message.error('请选择投放结束小时');
                return false
            }
            const data = {
                id: this.nowId,
                start_at: this.params.start_time + '' + this.params.start_hour,
                end_at: this.params.end_time + '' + this.params.end_hour,
            }
            editPlan(data).then(res => {
                this.timeShow = false;
                this.$Message.success('修改成功');
                this.getList();
            })
        },
        // 查看视频
        showVideo(item) {
            this.nowImgSrc = item;
        },
        hideVideo(e) {
            e.stopPropagation()
        },
        cancel() {
            this.timeShow = false;
        },
        // 开始时间变化
        startChange(val) {
            this.params.start_time = val;
        },
        // 结束时间变化
        endChange (val) {
            this.params.end_time = val;
        },
        // 点击展示全图
        showView(val) {
            this.imgSr = val;
            this.showPic = true;
        },
        // 隐藏图片-视频
        showHide(e) {
            this.showPic = false;
        },
        // 获取下拉数据
        getInterestList() {
            // 代理商下拉框
            getAgentList().then(res => {
                this.agentList = res.data.data;
            })
            //售卖位下拉框(投放位置)
            siteSelectorList().then(res => {
                this.sellList = res.data.data;
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
                        if (item.id != para.id) {
                            let paraObj = {};
                            paraObj.id = String(para.id);
                            paraObj.label = para.value;
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
        },
        // 获取广告主数据
        agentChange(val) {
            this.formValidate.ad = '';
            getUserList({user_id: val || '-99'}).then(res => {
                this.userList = res.data.data;
            })
        },
        // 创意状态变化
        statusChange (index) {
            this.creativeList[index].trade = null;
            this.creativeList[index].level = '';
        },
        // 列表
        getList(currentPage) {
            if (currentPage) this.pageNum = currentPage;
            const ajaxData = Object.assign({}, this.formValidate, {
                agent: this.formValidate.agent || '-99',
                ad: this.formValidate.ad || '-99',
                sell: this.formValidate.sell || '-99',
                status: this.formValidate.status || '-99'
            })
            getPlanList({
                page: this.pageNum,
                offset: this.pageSize,
                ...ajaxData
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            })
        },
        examineClick (val) {
            let self = this;
            if (val == 1) {
                let bool = true;  // 判断选项是否全部选择
                let bool1 = false;  // 判断是否有一条创意为审核通过
                let arr = [];
                this.creativeList.map((res, index) => {
                    if (res.status == 1) {
                        bool1 = true;
                        if (!res.level) {
                            bool = false;
                            this.$Message.error('创意'+ (index+1) +'等级未选择')
                        } else if (!res.trade) {
                            bool = false;
                            this.$Message.error('创意'+ (index+1) + '行业未选择')
                        }
                    } else if (!res.status) {
                        bool = false;
                        this.$Message.error('创意'+ (index+1) + '状态未选择')
                    }
                    let obj = {
                        idea_id: res.id,
                        level: res.level,
                        trade: res.trade,
                        status: res.status
                    }
                    arr.push(obj)
                })
                if (!bool) return;
                if (!bool) {
                    this.$Message.error('至少有一条创意状态为审核通过')
                    return
                };
                approvePlan({id: this.nowId, remark: this.formly.remark, idea: JSON.stringify(arr)}).then(res => {
                    this.$Message.success('审核已通过')
                    this.details = false;
                    this.getList();
                })
            } else if (val == 2) {
                let arr = [];
                this.creativeList.map((res, index) => {
                    let obj = {
                        idea_id: res.id,
                        level: res.level,
                        trade: res.trade,
                        status: res.status
                    }
                    arr.push(obj)
                })
                if (!this.formly.remark) {
                    this.$Message.error('请填写计划备注')
                    return false;
                }
                rejectPlan({id: this.nowId, remark: this.formly.remark, idea: JSON.stringify(arr)}).then(res => {
                    this.$Message.error('审核已拒绝');
                    this.details = false;
                    this.getList();
                })
            }
        },
        checkAllGroupChange (data) {
            let list = [];
            data.map(item => {
                if (item == 0 || Number.isNaN(item) == true) {

                } else {
                    list.push(item)
                }
            })
            if (list.length === this.courses.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        handleChange2 (newTargetKeys) {
            this.targetKeys2 = newTargetKeys;
        },
        // 查询
        handleSubmit() {
            this.pageNum = 1;
            this.getList();
        },
        initList(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        // 重置
        resetList() {
            this.formValidate.agent = null;
            this.formValidate.keyword = '';
            this.formValidate.ad = null;
            this.formValidate.sell = null;
            this.formValidate.status = null;
            this.getList(1);
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const menuStr = localStorage.getItem('ms_menuStr').split('|||')
            // 审核
            if (isInArray(menuStr, '/plan/approve') == false) {
                vm.shenheBool = false
            } else {
                vm.shenheBool = true
            }
            // 投放时间修改
            if (isInArray(menuStr, '/plan/edit') == false) {
                vm.toufangBool = false
            } else {
                vm.toufangBool = true
            }
            // 暂停投放
            if (isInArray(menuStr, '/plan/pause') == false) {
                vm.puseBool = false
            } else {
                vm.pauseBool = true
            }
            // 删除
            if (isInArray(menuStr, '/plan/delete') == false) {
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
