<template>
    <div>
        <Form ref="manageForm" :model="manageForm" :label-width="150" style="min-height: 310px;">
            <div v-show="type === 'transfer' || type === 'recharge' || type === 'mandate'">
                <FormItem label="账户名称">
                    <p>{{manageForm.userName}} </p>
                </FormItem>
                <FormItem label="企业名称">
                    <p>{{manageForm.companyName}} </p>
                </FormItem>
                <div v-if="type === 'recharge'">
                    <FormItem label="现金充值" required>
                        <Input v-model="manageForm.cash" type="number" />
                    </FormItem>
                    <FormItem label="返点充值" required>
                        <Input v-model="manageForm.rebates" type="number" />
                    </FormItem>
                    <FormItem label="上传凭证" required>
                        <Upload
                            multiple
                            ref="uploadButton"
                            :data="uploadData"
                            :headers="headers"
                            type="drag"
                            name="name"
                            :disabled='uploadDisabled'
                            :show-upload-list="false"
                            :on-progress="onProgress"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :action="url">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="color: #3399ff"></Icon>
                                <p>{{cuetext || 'Click or drag files here to upload'}} </p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem>
                        <ul class="uploadUI">
                            <li v-for="(item, key) in uploadList" :key="item">
                                <Img :src="item" alt="" >
                                <span @click="deleteUploadPic(key)"> x </span>
                            </li>
                        </ul>
                    </FormItem>
                    <FormItem label="备注" required>
                        <Input v-model="manageForm.remark" :maxlength="32" @on-keydown="deleteBlank" />
                    </FormItem>
                </div>
                <div v-show="type==='transfer'">
                    <FormItem label="账户余额">
                        <span>{{manageForm.banlance}}元 </span> <span>(现金余额：{{manageForm.cashBalance}}元；返点余额：{{manageForm.virtualBalance}}元)</span>
                    </FormItem>
                    <FormItem label="转入账户">
                        <Input v-model="transferForm.userName" type="text" />
                    </FormItem>
                    <FormItem label="转账金额（￥）">
                        <Input v-model="transferForm.cash" type="number" />
                    </FormItem>
                </div>
            </div>
            <div v-show="type === 'change'">
                <FormItem label="原用户名">
                    <p>{{changeForm.user}} </p>
                </FormItem>
                <FormItem label="新用户名">
                    <Input v-model="changeForm.userName" type="text" />
                </FormItem>
            </div>
            <div v-show="type === 'mandate'">
                <FormItem label="原代理商">
                    <p>{{manageForm.pcompanyName}} </p>
                </FormItem>
                <FormItem label="广告代理商">
                    <Select v-model="mandateForm.agentId" filterable style="width: 150px;" placeholder="请选择代理商">
                        <Option v-for="item in agentList" :value="item.key" :key="item.key">{{item.value}} </Option>
                    </Select>
                </FormItem>
            </div>

            <div v-show="type === 'limiting'">
                <FormItem label="广告终止投放时的最大余额">
                    <Input v-model="limitForm.advStopBalance" type="text" />
                </FormItem>
                <FormItem label="广告固定速率减速最大余额">
                    <Input v-model="inmitForm.advFixedSlowBalance" type="text" />
                </FormItem>
                <FormItem label="广告按公式减速的最大余额">
                    <Input v-model="limitForm.advFlexibleSlowBalance" type="text" />
                </FormItem>
                <FormItem label="减速比例">
                    <Input v-model="limitForm.slowRatio" placeholder="输入范围：0.01 ~ 1" type="number" max="1" min="0.01" />
                </FormItem>
                <FormItem label="可容忍的损耗">
                    <Input v-model="limitForm.lossMoney.account" type="text" placeholder="请输入account值" />
                </FormItem>
                <FormItem>
                    <Input v-model="limitForm.lossMoney.cpm" type="text" placeholder="请输入cpm值" />
                </FormItem>
                <FormItem>
                    <Input  v-model="limitForm.lossMoney.cpc" type="text" placeholder="请输入cpc值"/>
                </FormItem>
                <FormItem label="平均上报时间(s)">
                    <Input v-model="limitForm.advRepTime.cpm" type="text" placeholder="请输入cpm值" />
                </FormItem>
                <FormItem>
                    <input v-model="limitForm.advRepTime.cpc" type="text" placeholder="请输入cpc值" />
                </FormItem>
                <FormItem label="折扣">
                    <Input v-model="limitForm.discountRate.h5" type="text" placeholder="请输入h5值" />
                </FormItem>
                <FormItem>
                    <Input v-model="limitForm.discountRate.app" type="text" placeholder="请输入app值" />
                </FormItem>
                <FormItem>
                    <Input v-model="limitForm.discountRate.pc" type="text" placeholder="请输入pc值" />
                </FormItem>
            </div>

            <div v-show="type === 'qualificationAudit'">
                <div><h3 style="float: left;">基本信息</h3> <span style="float: left;">&nbsp;&nbsp;(该部分内容只作为参考，字段可能为空)</span> </div>
                <div style="clear: both; margin-bottom: 5px;"></div>
                <FormItem label="账户运营人员名称">
                    <p>{{qualificationAuditForm.operatorName}} </p>
                </FormItem>
                <FormItem label="账户运营人员邮箱">
                    <p>{{qualificationAuditForm.operatorEmail}} </p>
                </FormItem>
                <FormItem label="注册时间">
                    <p>{{qualificationAuditForm.registrationTime}} </p>
                </FormItem>
                <div><h3 style="margin: 5px auto;">资质信息部分</h3></div>
                <FormItem label="企业名称">
                    <p>{{qualificationAuditForm.companyName}} </p>
                </FormItem>
                <FormItem label="企业地址">
                    <p>{{qualificationAuditForm.companyAddress}} </p>
                </FormItem>
                <FormItem label="营业执照号码">
                    <p>{{qualificationAuditForm.businessLicenseNo}} </p>
                </FormItem>
                <FormItem label="营业执照图片">
                    <img v-for="item in qualificationAuditForm.businessLicenseImage" :src="item" :key="item" class="img-cl" alt="">
                </FormItem>
                <FormItem label="行业">
                    <p>{{qualificationAuditForm.industryName}} </p>
                </FormItem>
                <FormItem label="DSP运营人员">
                    <Input v-model="qualificationAuditForm.dspOperator" type="text" />
                </FormItem>
                <FormItem label="DSP销售人员">
                    <Input v-model="qualificationAuditForm.dspSales" type="text" />
                </FormItem>
                <FormItem label="审核备注" required>
                    <Input v-model="qualificationAuditForm.remark" type="text" @on-keydown="deleteBlank" />
                </FormItem>
            </div>

            <FormItem v-show="type === 'qualificationAudit' && showStatusAuditFlag" style="margin-top: 20px;">
                <Button type="primary" @click="handleSubmit('manageForm', 2)">通过</Button>
                <Button style="margin-left: 8px;" @click="handleSubmit('manageForm', 3)">拒绝</Button>
            </FormItem>
            <FormItem v-show="type !== 'qualificationAudit'" style="margin-top: 20px;">
                <Button type="primary" @click="handleSubmit('manageForm')">确认</Button>
                <Button style="margin-left: 8px;" @click="handleReset('manageForm')">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { getToken, getNumber, setToken, setNumber } from '@/libs/util';
import { sendfontmessage } from '@/api/system';
import { auditQualification, getQualificationAuditInfo, sspMemberRecharge, sspMemberTransfer,
    sspMemberMaintainContact, sspMemberSpeedLimit, sspMemberUserName } from '@api/member';
import { selectUserInfoDetails } from '@/api/advertisement';
import ajax from '@/libs/api.request'
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: null
        }    
    },
    data() {
        return {
            PHONE_RULE: /^\d{11}?$/,  //手机号正则
            EMAIL_RULE: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2, 4}$/,  // 邮箱正则
            uploadDisabled: false,  // 上传按钮可否点击 false:可点击  true: 不可点击
            bottonBool: true,  // 按钮可点击判断值  true: 可点击  false: 点击无反应
            userId: '',  // 用户id
            url: ajax.baseUrl + '/upload/img',  // 新的上传地址
            // 上传图片headers
            headers: {
                'token': getToken(),
                'Login-Serial-Number': getNumber()
            },
            cuetext: '',  // 上传中提示语
            uploadData: {
                isCheckSize: false,
                width: 0,
                height: 0
            },
            uploadList: [],  // 已上传列表
            //充值参数
            manageForm: {
                userName: '',  // 用户名
                companyName: '',
                cash: null,  // 现金充值
                rabates: null,  // 返点充值
                voucher: '',  // 打款凭证
                remark: '',  // 备注
                banlance: '',
                cashBalance: '',
                virtualBalance: '',
                pcompanyName: '',  // 原代理商
            },
            // 转账参数
            transferForm: {
                userName: '',
                cash: null
            },
            // 修改用户名
            changeForm: {
                user: '',  // 原用户名
                userName: '',  // 新用户名
            },
            // 委托代理
            mandateForm: {
                userName: '',  // 用户名
                companyName: '',  // 公司名称
                accountType: '',  // 账户类型
                agentId: '',  // 委托代理商id
            },
            // 限速操作
            limitForm: {
                accountType: '',  //账户类型
                advStopBalance: '',  // 广告终止时的最大余额
                advFixedSlowBalance: '',  // 广告固定速率减速最大余额
                advFlexibleSlowBalance: '',  // 广告按公式减速的最大余额
                slowRatio: '',  //减速比例
                lossMoney: {},  // 可容忍的损耗
                advRepTime: {},  // 平均上报时间
                discountRate: {},  // 折扣
            },
            // 资质审核参数
            qualificationAuditForm: {
                id: '',
                adUserId: '',
                companyName: '',
                companyAddress: '',
                businessLicenseNo: '',
                businessLicenseImage: [],
                industry: '',
                industryName: '',
                status: '',
                dspOperator: '',
                dspSales: '',
                remark: '',
                email: '',
                registrationTime: '',
                operatorEmail: '',
                operatorName: ''
            },
            agentList: [], // 代理商列表
            // 广告位模式
            viewBool: false,  // 可编辑状态值： 查看模式为true(不可编辑) 非查看模式false(可编辑)；
            showStatusAuditFlag: true
        };
    },
    methods: {
        // 进制输入空格
        deleteBlank(event) {
            if (event.keyCode == 32) {
                event.returnValue = false;
            }
        },
        getQualificationAuditFormData() {
            // 查看广告审核详情
            getQualificationAuditInfo(this.userId).then(res => {
                const data = res.data.data;
                if (data && data !== '') {
                    this.qualificationAuditForm.id = data.id || '';
                    this.qualificationAuditForm.adUserId = data.adUserId || '';
                    this.qualificationAuditForm.companyName = data.companyName || '';
                    this.qualificationAuditForm.companyAddress = data.companyAddress || '';
                    this.qualificationAuditForm.businessLicenseNo = data.businessLicenseNo || '';
                    this.qualificationAuditForm.industry = data.industry || '';
                    this.qualificationAudirForm.industryName = data.industryName || '其他';
                    this.qualificationAuditForm.status = data.status || '';
                    this.qualificationAuditForm.dspOperator = data.dspOperator || '';
                    this.qualificationAuditForm.dspSales = data.dspSales || '';
                    this.qualificationAuditForm.remark = data.remark || '';
                    this.qualificationAuditForm.email = data.email || '';
                    this.qualificationAuditForm.operatorName = data.operatorName || '';
                    this.qualificationAuditForm.operatorEmail = data.operatorEmail || '';
                    this.qualificationAuditForm.registrationTime = data.registrationTime || '';
                    let images = data.businessLicenseImage;
                    if (image && images !== '') {
                        this.qualificationAuditForm.businessLicenseImage = images.split(',')
                    } else {
                        this.qualificationAuditForm.businessLicenseImage = [];
                    }
                    let qs = this.qualificationAuditForm.status || -1;
                    if (qs === 3) {
                        // 通过，未通过隐藏按钮
                        this.showStatusAuditFlag = false
                    }
                }
            })
        },
        /**
         * @description 获取代理商列表
        */
        getAgent() {
            selectUserInfoDetails({category: 2, parentId: '0'}).then(res => {
                const data = res.data.data || [];
                this.agentList = [];
                data.map(item => {
                    const obj = {
                        key: item.userId,
                        value: item.companyName || item.userName,
                    }
                    this.agentList.push(obj);
                })
            })
        },
        /**
         * 消息推送账户类型
        */
        checkAllGroupChange (val) {
            if (val[val.length-1] == '-1') {
                this.manageForm.isAll = ['-1'];
            } else {
                if (val.indexOf('-1') != -1) {
                    this.manageForm.isAll.shift();
                }
            }
        },
        // 上传过程中
        onProgress() {
            this.uploadDisabled = true;
            this.cuetext = '文件上传中...'
        },
        // 上传成功
        onSuccess(response,file, fileList) {
            this.uploadDisabled = false;
            this.cuetext = '';
            switch (response.code) {
                case '200':
                    this.uploadList.push(response.data.url);
                    break;
                    case '31000':
                        this.$Modal.confirm({
                            title: '提示',
                            content: '登录已失效，请重新登录',
                            onOk: () => {
                                setToken('')
                                setNumber('')
                                this.$router.push('/login')
                            },
                        });
                        break;
                    default:
                        this.$Message.warning(response.message);
                        break;
            }
        },
        // 上传失败
        onError(error, file, fileList) {
            this.cuetext = '';
            this.uploadDisabled = false;
        },
        // 删除上传图片
        deleteUploadPic(key) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认要删除吗',
                onOk: () => {
                    this.uploadList.splice(key, 1);
                },
                cancelText: '取消'
            })
        },
        handleSubmit(name, auditStatus) {
            // auditStatus: 1- 待审核、2-审核通过、3-审核拒绝
            switch (this.type) {
                case 'recharge':
                    if (this.manageForm.cash === this.manageForm.rebates && this.manageForm.rebates === '') {
                        this.$Message.warning('请输入充值金额');
                        return false;
                    }
                    if ((this.manageForm.rebates != '' && this.manageForm.rebates < 0) || (this.manageForm.cash != '' && this.manageForm.cash < 0)) {
                        this.$Message.warning('充值金额不能小于0');
                        return false;
                    }
                    if (this.uploadList.length === 0) {
                        this.$Message.warning('请上传凭证');
                        return false;
                    }
                    if (this.manageForm.remark == '') {
                        this.$Message.warning('请输入备注');
                        return false;
                    }
                    let ajaxData1 = {
                        account: this.manageForm.userName,
                        cash: this.manageForm.cash,
                        rebates: this.manageForm.rebates,
                        voucher: this.uploadList.join(',');
                        remark: this.manageForm.remark
                    }
                    sspMemberRecharge(ajaxData1).then(res => {
                        this.$Message.success('充值成功');
                        this.uploadList = [];
                        this.$emit('on-submit', 'on');
                    })
                    break;
                case 'transfer':
                    if (this.transferForm.userName === '') {
                        this.$Message.warning('请输入账户');
                        return false;
                    }
                    if (!this.PHONE_RULE.test(this.transferForm.userName) && !this.EMAIL_RULE.test(this.transferForm.userName)) {
                        this.$Message.warning('账号输入错误，请重新输入手机账号或者邮箱账号');
                        return false;
                    }
                    if (this.transferForm.cash == '' || this.transferForm.cash <= 0) {
                        this.$Message.warning('请输入转账金额');
                        return false;
                    }
                    let ajaxData2 = Object.assign({}, this.transferForm, {
                        userId: this.userId
                    })
                    sspMemberTransfer(ajaxData2).then(res => {
                        this.$Message.success('转账成功');
                        this.$emit('on-submit', 'on');
                    })
                    break;
                case 'mandate':
                    if (this.mandateForm.agentId === '') {
                        this.$Message.warning('请选择广告代理商');
                        return false;
                    }
                    let ajaxData3 = {
                        id: this.userId,
                        parentId: this.mandateForm.agentId
                    }
                    sspMemberMaintainContact(ajaxData3).then(res => {
                        this.$Message.success('委托成功');
                        this.$emit('on-submit', 'on');
                    })
                    break;
                case 'limiting':
                    let ajaxData4 = Object.assign({}, this.limitForm, {
                        userId: this.userId,
                        slowRatio: this.limitForm.slowRatio/100,
                        lossMoney: JSON.stringify(this.limitForm.lossMoney),
                        advRepTime: JSON.stringify(this.limitForm.advRepTime),
                        discounRate: JSON.stringify(this.limitForm.discountRate),
                    })
                    sspMemberSpeedLimit(ajaxData4).then(res => {
                        this.limitForm.advStopBalance = '';
                        this.limitForm.advFixedSlowBalance = '';
                        this.limitForm.advFlexibleSlowBalance = '';
                        this,limitForm.slowRatio = '';
                        this,limitForm.lossMoney = {};
                        this.limitForm.advRepTime = {};
                        this.limitForm.discountRate = {};
                        this.$Message.success('修改成功');
                        this.$emit('on-submit', 'on')
                    })
                    break;
                case 'change':
                    if (this.changeForm.userName === '') {
                        this.$Message.warning('请输入用户名')
                        return false
                    }
                    let ajaxData5 = {
                        userId: this.userId,
                        userName: this.changeForm.userName
                    }
                    sspMemberUserName(ajaxData5).then(res => {
                        this.changeForm.userName = '';
                        this.$Message.success('修改成功');
                        this.$emit('on-submit', 'on');
                    })
                    break;
                case 'qualificationAudit':
                    if (this.qualificationAuditForm.remark == '') {
                        this.$Message.warning('审核备注不能为空')
                        return false;
                    }
                    let ajaxData6 = {
                        id: this.userId,
                        dspOperator: this.qualificationAuditForm.dspOperator,
                        dspSales: this.qualificationAuditForm.dspSales,
                        remark: this.qualificationAuditForm.remark,
                        status: auditStatus
                    }
                    auditQualification(ajaxData6).then(res => {
                        this.qualificationAuditForm.id = '';
                        this.qualificationAuditForm.adUserId ='';
                        this.qualificationAuditForm.companyName = '';
                        this.qualificationAuditForm.companyAddress = '';
                        this.qualificationAuditForm.businessLicenseNo = '';
                        this.qualificationAuditForm.industry = '';
                        this.qualificationAuditForm.industryName = '';
                        this.qualificationAuditForm.status = '';
                        this.qualificationAuditForm.dspOperator = '';
                        this.qualificationAuditForm.dspSales = '';
                        this.qualificationAuditForm.remark = '';
                        this.qualificationAuditForm.email = '';
                        this.qualificationAuditForm.registrationTime = '';
                        this.qualificationAuditForm.businessLicenseImage = [];
                        this.$Message.success("审核成功");
                        this.$emit("on-submit",'on');
                    })
                    break;
                default:
                    break;
            }
        },
        handleReset (name) {
            this.$emit('on-submit');
        },
        /**
         * @description 处理数据，通过key获取相应value
        */
        dealdata(para1, para2) {
            let arr = [];
            para1.map(res => {
                para2.map(item => {
                    if (res.key == item) {
                        arr.push(res.value);
                    }
                })
            })
            return arr.join(',');
        }
    },
    mounted() {
        this.getAgent();
    },
    watch: {
        data(val) {
            this.$refs['manageForm'].resetFields();
            this.manageForm.userName = val.account;
            this.manageForm.banlance = Number(val.caseBalance) + Number(val.virtualBalance);
            this.manageForm.cashBalance = val.cashBalance;
            this.manageForm.virtualBalance = val.virtualBalance;
            this.manageForm.companyName = val.companyName;
            this.manageForm.pcompanyName = val.pcompanyName;
            this.userId = val.id;
            switch (val.modalType) {
                case 'recharge':
                    this.uploadList = [];
                    this.manageForm.cash = null;
                    this.manageForm.rebates = null;
                    this.manageForm.voucher = '';
                    this.manageForm.remark = '';
                    break;
                case 'transfer':
                    this.transferForm.userName = '';
                    this.transforForm.cash = '';
                    break;
                case 'mandate':
                    this.mandateForm.userName = val.userName;
                    this.mandateForm.companyName = val.companyName;
                    this.mandateForm.accountType = val.accountType;
                    this.mandateForm.agentId = '';
                    break;
                case 'change':
                    this.changeForm.user = val.userName;
                    break;
                case 'limiting':
                    this.limitForm.accountType = val.accountType;
                    this.limitForm.advStopBalance = val.advStopBalance;
                    this.limitForm.advFixedSlowBalance = val.advFixedSlowBalance;
                    this.limiteForm.advFlexibleSlowBalance = val.advFlexibleSlowBalance;
                    this.limitForm.slowRatio = val.slowRatio * 100;
                    this.limitForm.lossMoney = JSON.parse(val.lossMoney);
                    this.limitForm.advRepTime = JSON.parse(val.advRepTime);
                    this.limitForm.discountRate = JSON.parse(val.discountRate);
                    break;
                case 'qualificationAudit':
                    this.showStatusAuditFlag = true
                    this.getQualificationAuditFormData();
                    break;
                default:
                    break;
            }
        },
        type(val) {
            if (val === 'view') {
                this.viewBool = false;
            } else {
                this.viewBool = true;
            }
        }
    }
}
</script>
