<template>
    <div style="min-width: 1600px;">
        <Card>
            <div style="margin: 10px 0;">
                <Form ref="formValidate" :model="formValidate" :inline="true">
                    <FormItem prop="agent">
                        <Select @on-clear="formValidate.hostGuest = ''" @on-open-change="formValidate.hostGuest = ''" clearable style="width: 150px;" v-model="formValidate.agent" filterable placeholder="请选择代理商">
                            <Option style="width: 150px;" :value="item.id" v-for="item in agentList" :key="item.id">{{item.companyName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="hostGuest">
                        <selectPage style="width: 150px" v-model="formValidate.hostGuest" :parentMsg="formValidate.agent"></selectPage>
                    </FormItem>
                    <FormItem prop="group">
                        <Select clearable style="width: 148px;" v-model="formValidate.group" filterable placeholder="请选择广告组">
                            <Option style="width: 150px;" :value="item.id" v-for="item in groupList" :key="item.id">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="plan">
                        <Select clearable style="width: 148px;" v-model="formValidate.plan" filterable placeholer="请选择广告计划状态">
                            <Option style="width: 150px;" :value="item.code" v-for="item in planList" :key="iten.code">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="originality">
                        <Input v-model="formValidate.originality" style="width: 200px;" placeholder="请输入广告计划名称/计划ID"></Input>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="terminal">
                        <Select @on-change="zhongduan" @on-open-change="shouqi" clearable style="width: 148px;" v-model="firmValidate.terminal" filterable placeholder="请选择投放终端">
                            <Option style="width: 150px;" :value="item.id" v-for="item in terminalList" :key="iten,id">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="position">
                        <Select clearable style="width: 148px;" v-model="formValidate.position" filterable placeholder="请选择投放位置" not-found-text="请先选择投放终端">
                            <Option style="width: 150px;" :value="item.dictCode" v-for="item in positionList" :key="item.codeCode">{{item.dictName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="date">
                        <DatePicker type="daterange" split-panels placeholder="选择日期" style="width: 200px;" :value="timeBox" @on-change="setTime"></DatePicker>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="mode">
                        <Select clearable style="width: 148px;" v-model="formValidate.mode" filterable placeholder="请选择投放方式">
                            <Option style="width: 150px;" :value="item.code" v-for="item in modeList" :key="item.code">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="bidding">
                        <Select clearable style="width: 148px;" v-model="formValidate.bidding" filterable placeholder="请选择竞价方式">
                            <Option style="width: 150px;" :value="item.code" v-for="item in biddingList" :key="item.code">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="pay">
                        <Select clearable style="width: 148px;" v-model="formValidate.pay" filterable placeholder="请选择付费方式">
                            <Option style="width: 150px;" :value="item.code" v-for="item in payList" :key="item.code">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem style="width: 20%;" prop="qid">
                        <FormItem>
                            <div style="float: left;">
                                <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
                                <Button @click="handleReset('formValidate')" style="margin: 0 10px 0 8px;">重置</Button>
                            </div>
                            <div style="float: right;">
                                <div style="cursor: pointer;" @click="changeSearch(false)" v-if="searchKey">收起 <span><Icon type="md-arrow-dropup" /></span></div>
                                <div style="cursor: pointer;" @click="changeSearch(true)" v-if="!searchKey">展开 <span><Icon type="md-arrow-dropdown" /></span></div>
                            </div>
                        </FormItem>
                    </FormItem>
                </Form>
            </div>
            <Table
                class="table"
                ref="tables"
                :total="dataCount"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns"
                :loading="loading"
                @on-selection-change="selectChange">
            </Table>
            <div style="margin-top: 10px;">
                <!-- 分页 -->
                <Page 
                    :total="dataCount" :current="pageNum"
                    :page-size="pageSize" show-total show-elevator
                    show-sizer :page-size-opts="pageSizeList" @on-page-size-change="changepize" @on-change="changepage" />
            </div>
        </Card>
        <my-modal v-model="details" title="计划详情">
            <div class="detailsClass1">
                <Form ref="formly" :model="formly" :label-width="110">
                    <h3 style="margin-bottom: 10px; margin-top: -10px;">基本信息</h3>
                    <FormItem label="广告位名称" prop="reason">
                        {{formly.adPlanName}}
                    </FormItem>
                    <FormItem label="所属广告组" prop="reason">
                        {{formly.adGroupName}}
                    </FormItem>
                    <FormItem label="推广目标" prop="reason">
                        {{textEnt}}
                    </FormItem>
                    <h3 style="margin-bottom: 10px">投放范围</h3>
                    <FormItem label="投放平台" prop="reason">
                        {{ formly.deliveryPlatform == 'MOBILE' ? '移动端' : 'PC'}}
                    </FormItem>
                    <FormItem label="终端" prop="reason">
                        {{ formly.deliveryTerminal}}
                    </FormItem>
                    <FormItem v-if="deliveryPlatform != 'PC'" label="APP" prop="reason">
                        <span v-if="formly.deliveryApp == 'all' || formly.deliveryApp == 'All'">不限</span>
                        <span v-else>{{formly.deliveryApp}} </span>
                    </FormItem>
                    <FormItem label="系统" prop="reason">
                        <span v-if="formly.deliveryOs == 'all' || formly.deliveryOs == 'All'">不限</span>
                        <span v-else>{{formly.deliveryOs }} </span>
                    </FormItem>
                    <FormItem label="投放位置" prop="reason">
                        {{formly.deliveryLocationName}}
                    </FormItem>
                    <h3 style="margin-bottom: 10px;"> 广告定向</h3>
                    <FormItem label="投放地域" prop="reason">
                        <span v-if="formly.area == 'all' || formly.area == 'All'">不限</span>
                        <span v-else>{{formly.area}} </span>
                    </FormItem>
                    <FormItem label="性别" prop="reason">
                        <span v-if="formly.gender == 'all' || formly.gender == 'All'">不限</span>
                        <span v-if="formly.gender == 'MAN'">男</span>
                        <span v-if="formly.gender == 'WOMAN'">女</span>
                    </FormItem>
                    <FormItem label="年龄：" prop="reason">
                        <span v-if="formly.age == 'all' || formly.age == 'All'">不限</span>
                        <span v-else>{{formly.age}} </span>
                    </FormItem>
                    <FormItem label="兴趣偏好" prop="reason">
                        <span v-if="formly.interestPreference == 'all' || formly.interestPreference == 'All'">不限</span>
                        <span v-else>{{formly.interestPreference}} </span>
                    </FormItem>
                    <div v-if="deliveryPlatform != 'PC'">
                        <FormItem label="网络环境" prop="reason">
                            <span v-if="formly.network == 'all' || formly.network == 'All'">不限</span>
                            <span v-else>{{formly.network}} </span>
                        </FormItem>
                        <FormItem label="网络运营商" prop="reason">
                            <span v-if="formly.networkOperators == 'all' || formly.networkOperators == 'ALL'">不限</span>
                            <span v-else>{{formly.networkOperators}} </span>
                        </FormItem>
                        <FormItem label="手机品牌" prop="reason">
                            <span v-if="formly.mobileBrands == 'all'|| formly.mobileBrands == 'All'" >不限</span>
                            <span v-else>{{formly.mobileBrands}} </span>
                        </FormItem>
                        <FormItem label="App定向" prop="reason">
                            <span v-if="formly.appOrientation == 'all' || formly.appOrientation == 'All'">不限</span>
                            <span v-else>{{formly.appOrientation }} </span>
                        </FormItem>
                    </div>
                    <FormItem label="收入水平" prop="reason">
                        <span v-if="formly.incomeLevel == 'all' || formly.incomeLevel == 'All'">不限</span>
                        <span v-else>{{formly.incomeLevel }} </span>
                    </FormItem>
                    <FormItem label="消费水平" prop="reason">
                        <span v-if="formly.consumeLevel == 'all' || formly.consumeLevel == 'ALL'">不限</span>
                        <span v-else>{{formly.consumeLevel}} </span>
                    </FormItem>
                    <h3 style="margin-bottom: 10px;"> 预算出价</h3>
                    <FormItem label="日预算" prop="reason">
                        {{formly.budgetAmount}}
                    </FormItem>
                    <FormItem label="投放日期" v-if="formly.deliveryEndTime.indexOf('2009') == -1">
                        <p>{{ formly.deliveryStartTime}}</p>
                        <p>{{ formly.deliveryEndTime }}</p>
                    </FormItem>
                    <FormItem label="投放日期" v-else>
                        <p>立即长期投放</p>
                    </FormItem>
                    <FormItem label="投放方式" prop="reason">
                        <span v-if="formly.deliveryMethod == 'STANDARD'">标准</span>
                        <span v-else>匀速</span>
                    </FormItem>
                    <FormItem label="竞价方式" prop="reason">
                        <span v-if="formly.biddingMethod == 'RTB'">实时竞价</span>
                        <span v-else>优先投放</span>
                    </FormItem>
                    <FormItem label="付费方式" prop="reason">
                        <span>{{formly.paymentMethod }} </span>
                    </FormItem>
                    <FormItem label="出价" prop="reason">
                        <span>￥{{formly.bidAmount}}</span>
                    </FormItem>
                    <FormItem label="频次控制" v-if="formly.frrquencyType == 'CUSTOM'">
                        <span>每个计划{{formly.displayFrequency=='EVERY_HOUR' ? '每小时' : '每天'}}向每个用户展现{{formly.displayTimes}}次</span>
                    </FormItem>
                    <FormItem label="频次控制" v-else>
                        <span>不限</span>
                    </FormItem>
                </Form>
            </div>
        </my-modal>
        <my-modal v-model="directional" title="定向配置">
            <div class="detailsClass1">
                <Form ref="formEnt" :model="formEnt" :label-width="133">
                    <h3 style="margin-bottom: 10px; margin-top: -10px;">基本信息</h3>
                    <FormItem label="广告位名称" prop="reason">
                        {{formEnt.adPlanName}}
                    </FormItem>
                    <FormItem label="所属广告组" prop="reason">
                        {{formEnt.adGroupName}}
                    </FormItem>
                    <FormItem label="投放终端" prop="reason">
                        {{formEnt.deliveryTerminal}}
                    </FormItem>
                    <p style="border-bottom: 2px solid #ccc;"></p>
                    <h3 style="display: inline-block; margin-bottom: 10px; margin-top: 20px">定向配置</h3>
                    <span @click="hide = true, membrane = false" style="float: right; margin-top: 20px; cursor: pointer; color: #0099ff">编辑</span>
                    <div v-show="membrane" style="position: absolute; background: pink; z-index: 9999; width: 92%; height: 55%; opacity: 0; cursor: not-allowed;"></div>
                    <FormItem label="站点定向" prop="reason">
                        <RadioGroup v-model="typeIndex2">
                            <Radio label="ALL">全部</Radio>
                            <Radio label="自定义"></Radio>
                        </RadioGroup>
                        <div v-if="typeIndex2 == '自定义'">
                            <Card>
                                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                    <Checkbox style="margin: 10px;" v-for="item in courses" :label="item.id" :key="item.id">
                                        <span style="color: black;">{{item.appName}} </span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </Card>
                        </div>
                    </FormItem>
                    <FormItem label="渠道定向" prop="reason">
                        <RadioGroup v-model="typeIndex">
                            <Radio label="All">全部</Radio>
                            <Radio label="自定义"></Radio>
                        </RadioGroup>
                        <Transfer
                            v-if="typeIndex != 'All'"
                            style="margin: 20px 0 0 0;"
                            :titles="ceshi"
                            :data="data2"
                            :target-keys="targetKeys2"
                            filterable
                            @on-change="handleChange2">
                        </Transfer>
                    </FormItem>
                    <FormItem label="是否设置为打底广告" prop="reason">
                        <RadioGroup v-model="formEnt.isBottomAdv">
                            <Radio label="N">否</Radio>
                            <Radio label="Y">是</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="hide == true">
                        <Button @click="examineClick" type="primary">更新</Button>
                        <Button @click="hide = false, directional = false" style="margin-left: 8px;">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </my-modal>
    </div>
</template>
<script>
import selectPage from '@/selectPage.vue'
import MyModal from '_c/my-modal'
import {
    planList,
    planDetail,
    channelList,
    creativeSelect,
    guestSelect,
    planEdit,
    selectOption,
    getSspSiteNameZd,
    sellseatSelect
} from '@/api/hzz'
import { configDict, getConfigDict } from '@/api/common';
export default {
    components: {
        MyModal,
        selectPage
    },
    data() {
        return {
            interestList: [],
            typeIndex2: '',
            membrane: true,
            timeBox: [],
            textEnt: '',
            targetList: [
                {
                    id: 'WEB_PAGE',
                    name: '网页'
                }, {
                    id: 'APP_DOWNLOAD',
                    name: '应用下载'
                }, {
                    id: 'APPLETS',
                    name: '小程序'
                }, {
                    id: 'WAKE_LINK',
                    name: '唤醒链接'
                }
            ],
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
            // 计划详情
            formly: {
                deluveryEndTime: '',
            },
            directional: false,
            details: false,
            ied: [],
            searchKey: false,
            formValidate: {
                startTime: '',
                endTime: '',
                agent: null,
                hostGuest: null,
                group: null,
                plan: null,
                bidding: '',
                originality: '',
                position: null,
                terminal: null,
                mode: null,
                pay: null
            },
            loading: false,  // 加载中
            // 分页
            dataCount: 0, // 初始化信息总条数
            pageNum: 1,  // 页数
            pageSize: 20, // 条数
            pageSizeList: [20, 50, 100],
            // 代理商
            agentList: [],
            // 广告主、直客
            hostGuestList: [],
            // 广告组
            groupList: [],
            // 广告计划
            planList: [],
            //投放位置
            positionList: [],
            // 投放终端
            terminalList: [
                {
                    id: 'WAP_AND_APP',
                    name: 'WAP/APP'
                }, {
                    id: 'WAP',
                    name: 'WAP'
                }, {
                    id: 'APP',
                    name: 'APP'
                }, {
                    id: 'PC',
                    name: 'PC'
                }
            ],
            // 投放方式
            modeList: [],
            // 竞价方式
            biddingList: [],
            // 付费方式
            payList: [],
            // 投放目标
            mubiaoList: [
                {id: '', name: '不限'},
                {id: 'WEB_PAGE', name: '网页'},
                {id: 'APP_DOWNLOAD', name: '应用下载'},
                {id: 'APPLETS', name: '小程序'},
                {id: 'WAKE_LINK', name: '唤醒链接'}
            ],
            // 列表
            columns: [
                {
                    title: '计划ID',
                    align: 'center',
                    minWidth: 50,
                    key: 'adPlanId'
                }, {
                    title: '广告计划名称',
                    align: 'center',
                    key: 'adPlanName'
                }, {
                    title: '广告组名称',
                    align: 'center',
                    key: 'adGroupName'
                }, {
                    title: '广告投放状态',
                    align: 'center',
                    key: 'deliveryStatus',
                    render: (h, params) => {
                        const _text = this.planList.filter(item => item.code === params.row.deliveryStatus)[0].name
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                }
                            }, _text),
                        ])
                    }
                }, {
                    title: '广告创意数',
                    align: 'center',
                    key: 'address',
                    render: (h, params) => {
                        let approvalCount = params.row.approvalCreativityCount ? params.row.approvalCreativityCount : 0
                        let totalCount = params.row.totalCreativityCount ? params.row.titalCreativityCount : 0
                        let _text = totalCount + '/' + approvalCount
                        return h('div', [
                            h('span', {
                                style: {
                                    color: 'rgb(0, 153, 255)',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: '_creative',
                                            params: {
                                                adPlanId: params.row.adPlanId
                                            }
                                        })
                                    }
                                }
                            }, _text)
                        ])
                    }
                }, {
                    title: '日预算',
                    align: 'center',
                    key: 'budgetAmount'
                }, {
                    title: '日消耗',
                    align: 'center',
                    key: 'todayCost'
                }, {
                    title: '竞价方式',
                    align: 'center',
                    key: 'biddingMethod',
                    render: (h, params) => {
                        const _text = this.biddingList.filter(item => item.code === params.row.biddingMethod)[0].name
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                }
                            }, _text)
                        ])
                    }
                }, {
                    title: '付费方式',
                    align: 'center',
                    key: 'paymentMethod'
                }, {
                    title: '出价',
                    align: 'center',
                    key: 'bidAmount'
                }, {
                    title: '投放日期',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {

                            }.params.row.deliveryEndTime.indexOf('2099') != -1 ? '长期投放' : params.row.deliveryStartTime.substring(0, 11) + '至' + params.row.deliveryEndTime.substring(0, 11))
                        ])
                    }
                }, {
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
                                    color: '#0099FF'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        self.deliveryPlatform = params.row.deliveryPlatform;
                                        let data = {
                                            adPlanId: params.row.adPlanId
                                        }
                                        planDetail(data).then(res => {
                                            self.formly = res.data.data;
                                            self.textEnt = self.targetList.filter(item => item.id === self.formly.promotionTarget)[0].name;
                                            self.details = true;
                                            let str = self.formly.interestPreserence || ''
                                            if (str !== 'All') {
                                                let s = str.split(',').map(a => this.interestList.find(res => a == res.dictCode).dictName).join(',') || ''
                                                self.formly.interestPreference = s
                                            }
                                        }).catch( error => {})
                                    }
                                }
                            }, '计划详情'),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    color: '#0099FF'
                                },
                                on: {
                                    click: () => {
                                        let self = this;
                                        self.membrane = true;
                                        let type = {
                                            terminal: params.row.deluveryTerminal
                                        }
                                        getSspSiteNameZd(type).then(res => {
                                            self.couses = res.data.data;
                                        }).catch(error => {})
                                        self.adPlanId = params.row.adPlanId;
                                        let ent = {
                                            dterminal: params.row.deliveryTerminal
                                        }
                                        channelList(ent).then(res => {
                                            let mo = res.data.data;
                                            let mockData = [];
                                            for (var i = 1; i <= 1000; i++) {
                                                mockData.push({
                                                    key: mo[i].value,
                                                    label: mo[i].name
                                                });
                                                self.data2 = mockData;
                                            }
                                        }).catch(error => {})
                                        let data = {
                                            adPlanId: params.row.adPlanId
                                        }
                                        planDetail(data).then(res => {
                                            self.formEnt = res.data.data;
                                            if (self.formEnt.deliveryApp == 'ALL') {
                                                self.typeIndex2 = 'All';
                                                self.checkAllGroup = [];
                                            } else {
                                                self.typeIndex2 = '自定义';
                                                self.checkAllGroup = self.formEnt.deliveryApp.split(',').map(Number);
                                            }
                                            if (self.formEnt.deliveryChannel == 'All') {
                                                self.typeIndex = 'All'
                                            } else {
                                                self.typeIndex = '自定义'
                                                self.targetKeys2 = res.data.data.deliveryChannel.split(',');
                                            }
                                            self.hide = false;
                                            self.directional = true
                                        })
                                    }
                                }
                            }, '定向配置')
                        ])
                    }
                }
            ],
            tableData: []
        }
    },
    mounted() {
        this.formValidate.group = this.$route.params.groupId;
        this.getInterestList();
        this.accountsList();
        this.creativeList();
        this.guestClick();
    },
    methods: {
        getInterestList() {
            // 获取站点类型列表
            configDict({type: 'interest'}).then(res => {
                this.interestList = res.data.data;
            })
            // 获取广告组
            selectOption().then(res => {
                this.groupList = res.data.data;
            });
            // 获取广告计划状态
            getConfigDict('planType').then(res => {
                this.planList = res;
            });
            // 获取竞价方式
            getConfigDict('againstType').then(res => {
                this.biddingList = res;
            })
            // 获取付费方式
            getConfigDict('payType').then(res => {
                this.payList = res;
            })
            // 获取投放方式
            getConfigDict('pullType').then(res => {
                this.modeList = res;
            })
        },
        // 列表
        accountsList() {
            let self = this;
            self.loading = true;
            let data = {
                pageNum: self.pageNum,
                pageSize: self.pageSize,
                agentUserId: self.formValidate.agent,
                queryUserId: self.formValidate.hostGuest,
                adGroupId: self.formValidate.group,
                deliveryStatus: self.formValidate.group,
                adPlanName: self.formValidate.originality,
                deliveryTerminal: self.formValidate.terminal,
                deliveryLocation: self.formValidate.position,
                deliveryStartTime: self.formValidate.startTime,
                deliveryEndTime: self.formValidate.endTime,
                deliveryMethod: self.formValidate.mode,
                biddingMethod: self.formValidate.bidding,
                paymentMethod: self.formValidate.pay
            }
            planList(data).then(res => {
                self.tableData = res.data.data.list;
                self.dataCount = res.data.data.total;
                self.loading = false;
            }).catch(error => {})
        },
        examineClick() {
            let self = this;
            let arr;
            if (self.typeIndex == 'All') {
                arr = 'All'
            } else {
                arr = self.targetKeys2.join(',')
            }
            let checkAllGroupId;
            if (self.typeIndex2 == '自定义') {
                checkAllGroupID = self.checkAllGroup.join(',')
            } else {
                checkAllGroupID = 'All'
            }
            let data = {
                adPlanId: self.adPlanId,
                deliveryApp: checkAllGroupID,
                deliveryChannel: arr,
                isBottomAdv: self.formEnt.isBottomAdv
            }
            planEdit(data).then(res => {
                self.$Message.success('编辑成功');
                self.accountsList();
                self.directional = false;
            }).catch(error => {})
        },
        // 获取投放位置下拉
        zhongduan() {
            let self = this;
            let data = {
                terminal: self.formValidate.terminal
            }
            sellseatSelect(data).then(res => {
                self.positionList = res.data.data;
            }).catch(error => {})
        },
        // 创意下拉
        creativeList () {
            let self = this;
            var data = {
                category: 2
            }
            creativeSelect(data).then(res => {
                self.agentList = res.data.data;
            })
        },
        dakai (data) {
            if (data == true) {
                this.formValidate.hostGuest = '';
            }
        },
        shouqi (data) {
            if (data == true) {
                this.formValidate.position = '';
            }
        },
        daili () {
            this.guestClick();
        },
        guestClick() {
            let self = this;
            let data = {
                id: self.formValidate.agent
            }
            guestSelect(data).then(res => {
                self.hostGuestList = res.data.data
            })
        },
        checkAllGroupChange (data) {
            let list = [];
            data.map(item => {
                if (item == 0 || Number.isNan(item) == true) {

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
        setTime (data) {
            this.formValidate.startTime = date[0] + '00:00:00';
            this.formValidate.endTime = date[1] + '23:59:59';
        },
        // 查询
        handleSubmit () {
            this.pageNum = 1;
            this.accountsList();
        },
        // 重置
        handleReset (formValidate) {
            this.formValidate.agent = null;
            this.formValidate.hostGuest = null;
            this.formValidate.group = null;
            this.formValidate.plan = null;
            this.formValidate.bidding = null;
            this.formValidate.originality = '';
            this.formValidate.position = null;
            this.formValidate.terminal = null;
            this.formValidate.mode = null;
            this.formValidate.pay = null;
            this.positionList = '';
            this.formValidate.statrTime = '';
            this.formValidate.endTime = '';
            this.timeBox = [];
            this.pageNum = 1;
            this.accountsList();
        },
        // 显示隐藏搜索框
        changeSearch(bool) {
            this.searchKey = bool;
        },
        // 获取table每行ID
        selectChange (data) {
            this.ied = data.map(item => item.id);
        },
        // 分页
        changepage (index) {
            this.pageNum = index;
            this.accountsList();
        },
        // 显示条数
        changepize (val) {
            this.pageNum = 1;
            this.pageSize = val
            this.accountsList();
        }
    }
}
</script>
<style lang="less">
.detailsClass1 .ivu-form-item {
    margin-bottom: 5px;
}
.detailsClass1 .ivu-card-body {
    padding: 0;
}
.table {
    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
}
</style>
