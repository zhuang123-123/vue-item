<template>
    <div style="min-width: 1600px">
        <Card>
            <Button @click="batchReject" type="primary">批量拒绝</Button>
            <div style="margin: 10px 0;">
                <Form ref="formValidate" :v-model="formValidate" :inline="true">
                    <FormItem prop="agent">
                        <Select @on-clear="formValidate.hostGuest=''" @on-open-change="formValidate.hostGuest = ''" clearable style="width: 150px;" v-model="formValidate.agent" filterable placeholder="请选择代理商">
                            <Option style="width: 150px;" :value="item.id" v-for="item in agentList" :key="item.id">{{item.companyName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="hostGuest">
                        <selectPage style="width: 150px;" v-model="formValidate.hostGuest" :parentMsg="formValidate.agent"></selectPage>
                    </FormItem>
                    <FormItem prop="group">
                        <Select clearable style="width: 148px;" v-model="formValidate.group" @on-change="getPlanByGroup" filterable placeholder="请选择广告组">
                            <Option :value="item.id" v-for="item in groupList" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="plan">
                        <Select clearable style="width: 148px;" v-model="formValidate.plan" filterable placeholder="请选择广告计划">
                            <Option :value="item.id" v-for="item in planList" :key="item.id">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="status">
                        <Select clearable style="width: 148px" v-model="formValidate.status" filterable placeholder="请选择审核状态">
                            <Option :value="item.code" v-for="item in statusList" :key="item.code">{{item.name}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="originality">
                        <Input v-model="formValidate.originality" style="width: 200px;" placeholder="请输入广告创意名称/创意ID"></Input>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="position">
                        <Select @on-change="positionClick" @on-open-change="showqi" clearable style="width: 148px;" v-model="formValidate.position" filterable placeholder="请选择投放位置">
                            <Option style="width: 150px;" :value="item.dictCode" v-for="item in positionList" :key="item.dictCode">{{item.dictName}} </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="style">
                        <Select clearable style="width:148px;" v-model="formValidate.style" filterable placeholder="请选择广告样式" not-found-text="请先选择投放位置">
                            <Option style="width:150px;" :value="item.id" v-for='item in styleList' :key='item.id'>{{item.styleName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="grade">
                        <Select clearable style="width:148px;" v-model="formValidate.grade" filterable placeholder="请选择广告等级">
                            <Option :value="item.code" v-for='item in gradeList' :key='item.code'>{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="searchKey" prop="industry">
                        <Select clearable style="width:148px;" v-model="formValidate.industry" filterable placeholder="请选择行业分类">
                            <Option :value="item.id" v-for='item in industryList' :key='item.id'>{{item.value}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="width: 20%;" prop="qid">
                        <FormItem>
                            <div style="float: left;">
                                <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
                                <Button @click="handleReset('formValidate')" style="margin: 0 10px 0 8px">重置</Button>
                            </div>
                            <div style="float: right;">
                                <div style="cursor: pointer;" @click="changeSearch(false)" v-if="searchKey">收起 <span><Icon type="md-arrow-dropup" /></span> </div>
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
                <Page
                    :total="dataCount" :current="pageNum"
                    :page-size="pageSize" show-total show-elevator
                    show-sizer :page-size-opts="pageSizeList" @on-page-size-change="changepize" @on-change="changepage"></Page>
            </div>
        </Card>
        <my-modal v-model="details" title="创意审核">
            <h3 style="margin-bottom: 20px; margin-top: -10px;">基本信息</h3>
            <div class="detailsClass">
                <Form ref="formly" :model="formly" :label-width="110">
                    <FormItem label="广告创意名称：" prop="reason">
                        <span>{{ formly.name }}</span>
                    </FormItem>
                    <FormItem label="投放终端：" prop="reason">
                        <span>{{ formly.deliveryTerminal }}</span>
                    </FormItem>
                    <FormItem label="落地页链接：" prop="reason">
                        <span>{{ formly.url }}</span>
                    </FormItem>
                    <FormItem label="投放位置：" prop="reason">
                        <span>{{ formly.deliveryLocationName }}</span>
                    </FormItem>
                    <FormItem label="广告样式：" prop="reason">
                        <span>{{ formly.styleName }}</span>
                    </FormItem>
                    <FormItem label="素材：" prop="reason">
                        <div class="demo-upload-list" v-for="(item,index) in listImg" :key="index">
                            <template>
                                <img :src="item" @click="showView(item)">
                            </template>
                        </div>
                    </FormItem>
                    <FormItem label="视频：" v-show="formly.videoUrl">
                        <span style="color:rgb(0, 153, 255);cursor:pointer" @click="videoView(formly.videoUrl)">查看</span>
                    </FormItem>
                    <FormItem label="创意标题：" prop="reason">
                        <span v-for="(item,index) in listTitle" :key="index">
                            {{ item }}
                        </span>
                    </FormItem>
                    <FormItem label="副标题：" prop="reason">
                        <span>{{ formly.subtitle }}</span>
                    </FormItem>
                    <FormItem label="来源：" prop="reason">
                        <span>{{ formly.adSource }}</span>
                    </FormItem>
                    <FormItem label="广告等级：" prop="reason">
                        <Select clearable style="width:200px;" v-model="formly.adRank" filterable placeholder="请选择广告等级">
                            <Option :value="item.code" v-for='item in gradeList' :key='item.code'>{{item.name}}</Option>
                        </Select>
                        <span style="margin-left:10px;color:rgb(204, 204, 204);">（注：审核通过时必填）</span>
                    </FormItem>
                    <FormItem label="行业分类：" prop="reason">
                        <Select clearable style="width:200px;" v-model="formly.industry" filterable placeholder="请选择行业分类">
                            <Option :value="item.id" v-for='item in industryList' :key='item.id'>{{item.value}}</Option>
                        </Select>
                        <span style="margin-left:10px;color:rgb(204, 204, 204);">（注：审核通过时必填）</span>
                    </FormItem>
                    <FormItem label="备注：" prop="reason">
                        <Input v-model="formly.approvalReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注..."></Input>
                    </FormItem>
                    <FormItem>
                        <Button @click="examineClick(2)" type="primary">通过</Button>
                        <Button @click="examineClick(3)" style="margin-left: 8px">拒绝</Button>
                    </FormItem>
                </Form>
            </div>
        </my-modal>
        <!-- 批量拒绝原因弹框 -->
        <my-modal v-model="batchRejectFlag" title="拒绝通过">
            <div class="detailsClass">
                <Form ref="batchRejectForm" :v-model="batchRejectForm" :label-width="110">
                    <h3 style="margin-bottom: 5px; margin-top: -10px;">请填写拒绝理由</h3>
                    <Input v-model="batchRejectForm.batchRejectReason" type="textarea" :autosize="{minRows: 3, maxRows: 5}" :maxlength="120" placeholder="请输入拒绝的理由..."></Input>
                    <div style="width: 250px; margin: 20px auto;">
                        <Button style="width: 100px" @click="cancelBatchReject">取消</Button>
                        <Button style="margin-left: 50px; width: 100px;" type="primary" @click="submitBatchReject">确定</Button>
                    </div>
                </Form>
            </div>
        </my-modal>
        <div v-show="showPic" @click="showHide" class="windowPic">
            <img :src="imgSrc" alt="无效地址" style="max-width: 100%" />
        </div>
        <div v-show="showVideo" @click="showHide" class="windowPic">
            <video class="_video_" controls :src="videoSr" alt="无效地址" style="max-width: 100%">当前浏览器不支持视频播放</video>
        </div>
    </div>
</template>
<script>
import selectPage from '@/selectPage.vue'
import MyModal from '_c/my-modal'
import {
    creative,
    createtiveSelect,
    guestSelect,
    guestEdel,
    guestJj,
    selectOption,
    planSelect,
    sellseatSelect,
    sellseatSelectStyle,
    sellseatSelectIndustry
} from '@/api/hzz'
import { getConfigDict } from '@/api/common'
export default {
    components: {
        MyModal,
        selectPage
    },
    data() {
        return {
            imgSr: '',  // 当前全屏查看图片地址
            videSr: '',  // 当前全屏查看视频地址
            showPic: false,  // 图片显示控制值 true显示 false不显示
            showVideo: false,  // 视频显示控制值，true显示  false不显示
            batchRejectFlag: false,
            batchRejectForm: {
                batchRejectReason: null,  // 批量拒绝原因
            },
            disabledT: false,
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
                agent: null,
                hostGuest: null,
                group: null,
                plan: null,
                status: null,
                originality: '',
                position: null,
                style: null,
                grade: null,
                industry: null
            },
            loading: false,  // 加载中
            // 分页
            dataCount: 0,  // 初始化信息总条数
            pageNum: 1, // 页数
            pageSize: 20,  // 条数
            pageSizeList: [20, 50, 100],
            //代理商
            agentList: [],
            // 广告主、直客
            hostGuestList: [],
            // 广告组
            groupList: [],
            // 根据组过滤的广告计划
            planList: [],
            // 加载的所有广告计划
            planAllList: [],
            // 广告创意状态
            toufangStateList: [
                {key: '1', value: '启用中'},
                {key: '2', value: '审核通过'},
                {key: '3', value: '审核中'},
                {key: '4', value: '审核拒绝'},
                {key: '5', value: '创意已删除'}
            ],
            //审核状态
            statusList: [],
            // 投放位置
            positionList: [],
            // 广告样式
            styleList: [],
            // 广告等级
            gradeList: [],
            // 行业
            industryList: [],
            // 列表
            columns: [
                {
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '创意ID',
                    align: 'center',
                    minWidth: 40,
                    key: 'id'
                },
                {
                    title: '广告创意名称',
                    align: 'center',
                    minWidth: 40,
                    key: 'name'
                },
                {
                    title: '广告计划名称',
                    align: 'center',
                    minWidth: 40,
                    key: 'planName'
                },
                {
                    title: '广告组名称',
                    align: 'center',
                    minWidth: 40,
                    key: 'groupName'
                },
                {
                    title: '广告主名称',
                    align: 'center',
                    key: 'companyName'
                },
                {
                    title: '投放目标',
                    align: 'center',
                    key: 'promotionTarget'
                },
                {
                    title: '落地页/下载链接',
                    minWidth: 40,
                    align: 'center',
                    key: 'address',
                    render: (h, params) => {
                        if (params.row.url) {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        placement: 'bottom',
                                        theme: 'light'
                                    }
                                }, [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: params.column._width * 0.5 + 'px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        domProps: {
                                            innerHTML: params.row.url
                                        }
                                    }),
                                    h('span', {
                                        slot: 'content',
                                        style: { whiteSpace: 'normal', wordBreak: 'break-all'},
                                        domProps: {
                                            innerHTML: params.row.url
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
                {
                    title: '投放位置',
                    align: 'center',
                    key: 'deliveryLocation',
                    render: (h, params) => {
                        let self = this;
                        const text = self.positionList.filter(item => item.dictCode === params.row.deliveryLocation)[0]
                        const _text = text ? text.dictName : text;
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                }
                            }, _text)
                        ]);
                    }
                },
                {
                    title: '广告样式',
                    align: 'center',
                    key: 'styleName'
                },
                {
                    title: '日消耗',
                    align: 'center',
                    key: 'cost'
                },
                {
                    title: '广告等级',
                    align: 'center',
                    key: 'adRank'
                },
                {
                    title: '行业分类',
                    align: 'center',
                    key: 'industryName',
                },
                {
                    title: '广告创意状态',
                    align: 'center',
                    key: 'deliverStatus',
                    render: (h, params) => {
                        const _text = this.toufangStateList.filter(item => item.key == params.row.deliveryStatus)[0].value;
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, _text),
                        ]);
                    } 
                },
                {
                    title: '审核人',
                    align: 'center',
                    key: 'approvedBy'
                },
                {
                    title: '备注',
                    align: 'center',
                    key: 'approvalReason'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
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
                                        self.cyID = params.row.id;
                                        let data = {
                                            id: params.row.id
                                        }
                                        guestEdel(data).then(res => {
                                            self.formly = res.data.data;
                                            if (self.formly.approvalStatus != 1) {
                                                self.disabledT = true;
                                            } else {
                                                self.disabledT = false;
                                            }
                                            if (self.formly.material) {
                                                self.listImg = self.formly.material.split(',');
                                            }
                                            if (self.formly.title) {
                                                self.listTitle = self.formly.title.split(',');
                                            }
                                            self.details = true;
                                        }).catch(error => {})
                                    }
                                }
                            }, '创意审核')
                        ])
                    }
                }
            ],
            tableData: []
        };
    },
    computed: {

    },
    mounted() {
        this.formValidate.plan = this.$route.params.adPlanId;
        this.formValidate.group = this.$route.params.groupId;
        this.getViewData()
        this.initSelects()
        this.accountsList()
        this.agentUserList()
    },
    methods: {
        // 获取页面数据
        getViewData() {
            // 获取审核状态
            getConfigDict('approveType').then(res => {
                this.statusList = res;
            })
        },
        // 点击展示全图
        showView (val) {
            this.imgSr = val;
            this.showPic = true;
        },
        // 隐藏图片-视频
        showHide (e) {
            if (e.target.className == '_video_') return
            this.showPic = false;
            this.showVideo = false;
        },
        // 查看视频
        videoView (val) {
            this.videoSr = val;
            this.showVideo = true;
        },
        batchReject() {  // 批量拒绝打开弹窗
            if (!this.ied || this.ied.lengthh == 0 || this.ied == '') {
                this.$Message.warning('请选择广告创意！');
                return
            }
            let bool = false;
            this.creativeStatus.map(item => {
                if (item == 5) {
                    bool = true
                }
            })
            if (bool) {
                this.$Message.warning('当前创意已删除，不可以重复操作');
                return;
            }
            this.batchRejectFlag = true
        },
        cancelBatchReject() {
            this.batchRejectFlag = false
            this.batchRejectForm.batchRejectReason = null
        },
        initSelects() {
            selectOption().then(res => {  // 广告组下拉
                this.groupList = res.data.data;
            })
            getConfigDict('adv_level').then(res => {
                // 广告等级
                this.gradeList = res;
            })
            planSelect().then(res=> {
                // 广告计划
                this.planAllList = res.data.data
                this.planList = this.planAllList
            })
            sellseatSelect().then(res => {
                // 投放位置
                this.positionList = res.data.data;
            }).catch(error => {})
            sellseatSelectIndustry().then(res => {
                // 行业分类
                this.industryList = res.data.data;
            }).catch(error => {})
        },
        // 列表
        accountsList () {
            let self = this;
            self.loading = true;
            let data = {
                pageNum: self.pageNum,
                pageSize: self.pageSize,
                agentId: self.formValidate.agent,
                adUserId: self.formValidate.hostGuest,
                adGroupId: self.formValidate.group,
                adPlanId: self.formValidate.plan,
                approvalStatus: self.formValidate.status,
                creativityStr: self.formValidate.originality,
                deliveryLocation: self.formValidate.position,
                adStyle: self.formVaalidate.style,
                adRank: self.formValidate.grade,
                industry: self.formValidate.industry
            }
            creative(data).then(res => {  // 列表
                self.tableData = res.data.data.list;
                self.dataCount = res.data.data.total;
                self.loading = false;
            }).catch(error => {})
        },
        positionClick() {
            let self = this;
            sellseatSelectStyle(self.formValidate.position).then(res=> { // 广告样式
                self.styleList = res.data.data;
            }).catch(error => {})
        },
        shouqi (data) {
            if (data == true) {
                this.formValidate.style = '';
            }
        },
        // 批量拒绝
        submitBatchReject() {
            if (!this.ied || this.ied.length == 0 || this.ied == '') {
                this.$Message.warning('请选择数据报表！');
                return
            }
            if (!this.batchRejectForm.batchRejectReason || this.batchRejectForm.batchRejectReason == '') {
                this.$Message.warning('请输入拒绝原因!');
                return
            }
            let data = {
                ids: this.ied.join(','),
                approvalReason: this.batchRejectForm.batchRejectReason
            }
            guestJj(data).then(res => {
                this.$Message.error('已拒绝！')；
                thisaccountsList();
                this.ied = [];
                this.batchRejectFlag = false
                this.batchRejectForm.batchRejectReason = null
            }).catch(error => {})
        },
        examineClick (key) {
            // 2-通过；3-拒绝
            let status = key;
            let adRank = this.formly.adRank || null
            let industry = this.formly.industry || null
            let approvalReason = this.formly.approvalReason || null
            if (status == 2) {
                if (!adRank) {
                    this.$Message.error('审核通过时，广告等级不能为空');
                    return
                }
                if (!industry) {
                    this.$Message.error('审核通过时，行业分类不能为空');
                    return
                }
                if (!approvalReason) {
                    this.$Messae.error('审核通过时，备注不能为空')
                    return
                }
            } else if (status == 3) {
                if (!approvalReason) {
                    this.$Message.error('审核拒绝时，备注不能为空')
                    return
                }
            } else {
                console.info('创意审核的审批状态错误！')
                return
            }
            let data = {
                id: this.cyID,
                adRank: adRank,
                industry: industry,
                approvalStatus: status,
                approvalReason: approvalReason
            }
            guestExamine(data).then(res => {
                if (status == 2) {
                    this.$Message.success('审核通过')
                } else {
                    this.$Message.success('已拒绝')
                }
                this.details = false;
                this.accountsList();
            }).catch(error => {})
        },
        dakai (data) {
            if (data == true) {
                this.formValidate.hostGuest = '';
            }
        },
        // 代理商
        agentUserList () {
            let self = this;
            let data = {
                category: 2
            }
            creativeSelect(data).then(res => {  // 代理商
                self.agentList = res.data.data;
            })
        },
        // 查询
        handleSubmit () {
            this.pageNum = 1;
            this.accountsList();
        },
        // 重置
        handleReset (formValidate) {
            this.styleList = [];
            this.formValidate.agent = null;
            this.formValidate.hostGuest = null;
            this.formValidate.group = null;
            this.formValudate.plan = null;
            this.formValudate.status = null;
            this.formValudate.originality = '';
            this.formValudate.position = null;
            this.formValuidate.style = null;
            this.formValidate.grade = null;
            this.formValidate.grade = null;
            this.formValidate.industry = null;
            this.pageNum = 1;
            this.accountsList();
        },
        // 显示隐藏搜索框
        changeSearch (bool) {
            this.searchKey = bool;
        },
        // 获取table每行ID
        selectChange (data) {
            this.creativeStatus = data.map(item => item.deliveryStatus);
            this.ied = data.map(item => item.id)
        },
        // 分页
        changepage (index) {
            this.pageNum = index;
            this.accountsList();
        },
        // 显示条数
        changepize (val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.accountsList();
        },
        // 广告组选择变化时，查询对应的广告计划
        getPlanByGroup () {
            let groupId = this.formValidate.group
            if (!groupId) {
                this.planList = this.planAllList
                return
            }
            this.planList = this.planAllList.filter(s => s.groupId === groupId)
        }
    }
}
</script>
<style lang="less">
.detailsClass .ivu-form-item {
    margin-bottom: 15px;
}
.table {
    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
}
.demo-upload-list {
    display: inline-block;
    width: 61px;
    height: 61px;
    text-align: center;
    line-height: 61px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 15px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.windowPic {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(0,0,0,.3);
    img,video {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 80%;
        max-height: 80%;
    }
}
</style>
