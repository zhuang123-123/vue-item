<template>
    <div>
        <Card>
            <div style="margin-bottom: 10px;">
                <Input v-model="username" placeholder="请输入登录账号或账户id" @keypress.enter="getList" clearable style="width: 150px; margin: 5px 10px 5px 0" />
                <Select clearable style="width: 150px; margin: 5px 10px 5px 0;" v-model="zz_status" filterable placeholder="请选择资质审核状态">
                    <Option :value="item.id" v-for="item in statusList" :key="item.id">{{item.value}} </Option>
                </Select>
                <Button type="primary" @click="getList(1)" style="margin-left: 10px;">查询</Button>
            </div>
            <Table
                ref="tables"
                :total="total"
                editable
                search-place="top"
                :data="tableData"
                :columns="columns">
            </Table>
            <div style="margin-top: 10px;">
                <Page @on-change="getList" @on-page-size-change="initList" :total="total" :pageSize="pageSize" show-elevator show-total show-sizer />
            </div>
            <div class="window_other_l" v-show="modal1">
                <div class="page_view">
                    <span class="cancel" @click="submit">x</span>
                    <div class="page_title">充值</div>
                    <Form ref="chargeForm" :model="chargeForm" :rules="ruleValidate" :label-width="120" style="padding-top: 30px;">
                        <FormItem label="登录页账号">
                            <span>{{account}} </span>
                        </FormItem>
                        <FormItem label="企业名称">
                            <span>{{companyName}} </span>
                        </FormItem>
                        <FormItem label="现金充值" prop="cash">
                            <Input v-model="chargeForm.cash" type="number" style="width: 250px;" @on-keypress="disBlank" />
                        </FormItem>
                        <FormItem label="返点充值" prop="point">
                            <Input v-model="chargeForm.point" type="number" style="width: 250px" @on-keypress="disBlank" />
                        </FormItem>
                        <FormItem label="上传凭证" prop="capture">
                            <Upload
                                style="width: 150px"
                                multiple
                                ref="uploadButton"
                                :headers="headers"
                                name='image'
                                :disabled="uploadDisabled"
                                :show-upload-list='false'
                                :on-progress="onProgress"
                                :before-upload="boforeUpload"
                                :on-success="onSuccess"
                                :on-error="onError"
                                :action="url">
                                <Button icon="ios-cloud-upload-outline">{{cuetext || '上传凭证'}} </Button>
                            </Upload>
                            <span style="color: #999999">(注：凭证个数在1-6个之间，每张图片不大于5M)</span>
                        </FormItem>
                        <FormItem>
                            <ul class="img_area">
                                <li v-for="(item, index) in chargeForm.capture" :key="index">
                                    <img :src="item" alt="">
                                    <span class="icon" @click="deleteUploadPic(index)"></span>
                                </li>
                            </ul>
                        </FormItem>
                        <FormItem label="备注" prop="remark">
                            <Input v-model="chargeForm.remark" style="width: 250px" @on-keypress="disBlank" />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit()">确定</Button>
                            <Button style="margin-left: 8px;" @click="handleReset()">取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="window_other_l" v-show="modal4">
                <div class="page_view" style="height: 50%;">
                    <span class="cancel" @click="submit">x</span>
                    <div class="page_title">人员配置</div>
                    <Form :label-width="120" style="padding-top: 30px;">
                        <FormItem label="登录账号">
                            <span>{{account}} </span>
                        </FormItem>
                        <FormItem label="企业名称">
                            <span>{{companyName}} </span>
                        </FormItem>
                        <FormItem label="DSP运营人员">
                            <Select v-model="memberPara.operate_leader" placeholder="请选择运营人员" filterable multiple :max-tag-count="3">
                                <Option v-for="item in sellList" :value="item.id" :key="item.id">{{item.name}} </Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="memberSubmit()">确定</Button>
                            <Button style="margin-left: 10px;" @click="handleReset()">取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Card>
        <div class="view_area" v-show="nowImgSrc!=''" @click="nowImgSrc=''">
            <div class="view_box">
                <img :src="nowImgSrc" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import { getToken } from '@/libs/util'
import ajax from '@/libs/api.request'
import {
    financeIndex,
    chargeMoney,
    getQualificationAuditInfo,
    approveUser,
    rejectUser,
    transferMoney,
    getSellList,
    addassign
} from '@/api/member';
import { ownerSelectorList } from '@/api/website'
export default {
    components: {},
    data() {
        return {
            shenheBool: false,  // 审核功能权限  true: 显示  false: 不显示
            memberBool: false,  // 人员配置功能权限 true: 显示 false: 不显示
            transferBool: false, // 转账功能权限 true: 显示 false: 不显示
            rechargeBool: false,  // 充值功能权限 true: 显示 false: 不显示
            username: '',  // 登录名称--查询条件
            zz_status: '',  // 资质状态--查询条件
            account: '',  // 登录账号
            nowId: '',  // 当前操作对象id
            companyName: '',  // 企业名称
            userList: [],  // 广告用户转账列表
            sellList: [],  // 销售运营人员列表
            nowImgSrc: '',  // 当前查看图片集合
            uploadDisabled: false,  // 上传按钮蝌蚪点击 false: 可点击 true: 不可点击
            url: ajax.baseUrl+ '/v1/upload/image',  // 上传地址
            headers: {
                'X-MAXIMUM-KEY': getToken()
            },
            cuetext: '',  // 上传提示语
            chargeForm: {
                cash: '',  // 现金
                point: '',  // 返点
                capture: [], 
                remark: ''
            },
            userInfo: {
                name: '', // 企业名称
                address: '',  // 企业地址
                code: '',  // 营业执照号码
                imgList: '',  // 营业执照图片
                trade: '',  // 行业
                remark: '',  // 审核备注
            },
            statusList: [
                {id: '0', value: '审核中'},
                {id: '1', value: '审核成功'},
                {id: '-1', value: '审核拒绝'}
            ],
            transferForm: {
                account: '',  // 转入账户
                companyName: '',  //企业名称
                amount: '',  // 转入金额
                username: '',  //登录账户
                banlance: '',  // 余额
                cashBalance: '',  // 现金余额
                virtualBalance: '',  // 虚拟余额
            },
            // 人员配置
            memberPara: {
                operate_leader: [],  // 运营人员
                sell_leader: [], // 销售人员
            },
            picMessage: {
                size: 5,  // 图片大小限制
                uploadPicNum: 6,  // 图片可上传数量
                format: ['png', 'jpg', 'jpeg', 'gif'],  // 图片格式
            },
            columns: [
                {title: '账号id', key: 'uuid', align: 'center'},
                { title: '登录账号', key: 'account', align: 'center'},
                { title: '企业名称', key: 'company', align: 'center'},
                { title: '账户类型', key: 'account_type_txt', align: 'center'},
                { title: '代理商账户', key: 'parent_name', align: 'center'},
                { title: '现金金额', key: 'remain_balance', align: 'center'},
                { title: '返点金额', key: 'remain_point', align: 'center'},
                { title: '资质审核状态', key: 'license_status_txt', align: 'center'},
                { title: '账号状态', key: 'user_status_txt', align: 'center'},
                { title: 'dsp运营人员', key: 'operate_leader', align: 'center'},
                { title: 'dsp销售人员', key: 'sell_leader', align: 'center'},
                { title: '注册时间', align: 'center', key: 'create_at'},
                { title: '备注', key: 'license_remark', align: 'center'},
                { 
                    title: '操作',
                    key: 'action',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        if (!this.shenheBool && !this.transferBool && !this.rechargeBool && !this.memberBool) {
                            return h('span', '暂无操作')
                        }
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
                                            getQualificationAuditInfo({user_id: params.row.user_id}).then(res => {
                                                this.userInfo.name = res.data.data.company;
                                                this.userInfo.address = res.data.data.address;
                                                this.userInfo.code = res.data.data.license;
                                                this.userInfo.imgList = res.data.data.image ? res.data.data.image.split(',') : [];
                                                this.userInfo.trade = res.data.data.trade || '暂无';
                                                this.nowId = res.data.data.user_id;
                                                this.userInfo.remark = '';
                                                this.modal2 = true;
                                            })
                                        }
                                    }
                                },
                                this.shenheBool ? '资质审核' : ''
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
                                            getQualificationAuditInfo({user_id: params.row.user_id}).then(res => {
                                                this.account = res.data.data.account;
                                                this.companyName = res.data.data.company;
                                                this.memberPara.operate_leader = res.data.data.operate_leader ? res.data.data.operate_leader.split(',') : [];
                                                this.memberPara.sell_leader = res.data.data.sell_leader ? res.data.data.sell_leader.split(',') : [];
                                                this.nowId = res.data.data.user_id;
                                                this.modal4 = true;
                                            })
                                        }
                                    }
                                },
                                this.memberBool ? '人员配置' : ''
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
                                            this.chargeForm.cash = '';
                                            this.chargeForm.point = '';
                                            this.chargeForm.capture = [];
                                            this.chargeForm.remark = '';
                                            this.$refs.chargeForm.resetFields();
                                            getQualificationAuditInfo({user_id: params.row.user_id}).then(res => {
                                                this.account = res.data.data.account;
                                                this.companyName = res.data.data.company;
                                                this.nowId = res.data.data.user_id;
                                                this.modal1 = true;
                                            })
                                        }
                                    }
                                },
                                this.rechargeBool? '充值' : ''
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
                                            this.transferForm.account = '';
                                            this.transferForm.amount = '';
                                            getQualificationAuditInfo({user_id: params.row.user_id}).then(res => {
                                                this.transferForm.userName = res.data.data.account;
                                                this.tranfserForm.companyName = res.data.data.company;
                                                this.transferForm.banlance = res.data.dara.remain_amount;
                                                this.transferForm.cashBalance = res.data.data.remain_balance;
                                                this.transferForm.virtualBalance = res.data.data.remain_balance;
                                                this.nowId = res.data.data.user_id;
                                                this.modal3 = true;
                                            })
                                        }
                                    }
                                },
                                this.transferBool ? '转账' : ''
                            )
                        ])
                    }
                }
            ],
            ruleValidate: {
                cash: [
                    {
                        required: true,
                        message: '必填'
                    }, {
                        type: 'string',
                        message: '现金充值不能小于0',
                        pattern: /^[0-9]\d*$/
                    }
                ],
                point: [
                    {required: true, message: '必填'},
                    {type: 'string', message: '返点不能小于0', pattern: /^[0-9]\d*$/}
                ],
                capture: [
                    {required: true, message: '最少传一张'}
                ]
            },
            modal1: false,  // 充值页面显示控制
            modal2: false,  // 基本信息页面显示控制
            modal3: false,  // 转账页面显示控制
            modal4: false,  // 人员配置页面显示控制
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            modalType: ''
        }
    },
    methods: {
        // 获取页面下拉数据
        getView() {
            ownerSelectorList().then(res => {
                this.userList = res.data.data;
            })
            getSellList().then(res => {
                this.sellList = [];
                res.data.data.map(res => {
                    let obj = {
                        id: String(res.id),
                        name: res.name
                    }
                    this.sellList.push(obj)
                })
            })
        },
        // 上传过程中
        onProgress() {
            this.uploadDisabled = true;
            this.cuetext = '文件上传中...'
        },
        // 上传之前
        boforeUpload(val) {
            if (this.chargeForm.capture.length == this.picMessage.uploadPicNum) {
                this.$Message.error('图片已达上限, 请先删除后再上传');
                return false;
            }
            if (val.size > this.picMessage.size*1024*1024) {
                this.$Message.error('图片超过限制');
                return false;
            }
            if (this.picMessage.format.indexOf(val.type.split('/')[1].toLowerCase()) == -1) {
                this.$Message.error('格式上传错误');
                return false;
            }
        },
        // 上传图片
        onSuccess(response, file, fileList) {
            this.uploadDisabled = false;
            this.cuetext = '';
            switch (response.code) {
                case 200:
                    if (this.chargeForm.capture.length < this.picMessage.uploadPicNum) {
                        this.chargeForm.capture.push(response.data.url);
                    }
                    break;
                case 6001:
                case 6002:
                    this.$Modal.confirm({
                        title: '提示',
                        content: '登录已失效, 请重新登录',
                        onOk: () => {
                            setToken('')
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
                    this.chargeForm.capture.splice(key, 1);
                },
                cancelText: '取消'
            })
        },
        // 广告主审核
        shenhe_click(val) {
            switch (val) {
                case '1':
                    approveUser({remark: this.userInfo.remark, user_id: this.nowId}).then(res => {
                        this.$Message.success('审核已通过')
                        this.modal2 = false;
                        this.getList();
                    })
                    break;
                case '2':
                    rejectUser({remark: this.userInfo.remark, user_id: this.nowId}).then(res => {
                        this.$Message.success('审核已拒绝')
                        this.modal2 = false;
                        this.getList();
                    })
                    break;
                default:
                    break;
            }
        },
        getList (currentPage) {
            if (currentPage) this.currentPage = currentPage;
            financeIndex({
                keyword: this.username,
                zz_status: this.zz_status || '-99',
                page: this.currentPage,
                offset: this.pageSize
            }).then(res => {
                this.tableData = res.data.data || [];
                this.total = res.data.total || 0;
            })
        },
        initList (pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        handleSubmit() {
            const _this = this;
            this.$refs['chargeForm'].validate(valid => {
                if (valid) {
                    const ajaxData = {
                        user_id: this.nowId,
                        remain_balance: this.chargeForm.cash,
                        remain_point: this.chargeForm.point,
                        remark: this.chargeForm.remark,
                        proof_url: _this.chargeForm.capture.join(',')
                    }
                    ajaxData.iwner_id = _this.nowId;
                    chargeMoney(ajaxData).then(res => {
                        _this.modal1 = false;
                        _this.$Message.success('充值提交成功');
                        _this.getList();
                    })
                }
            })
        },
        // 转账
        transferSubmit() {
            if (!this.transferForm.account) {
                this.$message.error('请输入转入账户');
                return false
            }
            if (!this.transferForm.amount) {
                this.$Message.error('请输入转入金额');
                return false
            }
            transferMoney({user_id: this.nowId, account_id: this.transferForm.account, amount: this.transferForm.amount}).then(res => {
                this.$Message.success('转账成功');
                this.getList();
                this.transferForm.account = '';
                this.transferForm.amount = '';
                this.nowId = '';
                this.modal3 = false;
            })
        },
        // 人员配置
        memberSubmit() {
            const ajaxData = {
                id: this.nowId,
                operate_leader: this.memberPara.operate_leader.join(','),
                sell_leader: this.memberPara.sell_leader.join(','),
            }
            addassign(ajaxData).then(res => {
                this.$Message.success('配置成功')
                this.modal4 = false;
                this.getList();
            })
        },
        handleReset() {
            this.modal1 = false;
            this.modal2 = false;
            this.modal3 = false;
            this.modal4 = false;
        },
        submit() {
            this.modal1 = false;
            this.modal2 = false;
            this.modal3 = false;
            this.modal4 = false;
        },
        handleAdd() {
            this.chargeForm.cash = '';
            this.chargeForm.point = '';
            this.chargeForm.remark = '';
            this.modal1 = true;
            this.modalType = 'add';
        },
        disBlank (event) {
            if (event.keyCode == 32) event.returnValue = false;
        }
    },
    mounted() {
        this.getView();
        this.getList();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const menuStr = localStorage.getItem('ms_menuStr').split('|||')
            // 资质审核
            if (isInArray(menuStr, '/ad/approve') == false) {
                vm.shenheBool = false
            } else {
                vm.shenBool = true
            }
            // 人员配置
            if (isInArray(menuStr, '/ad/assign') == false) {
                vm.memberBool = false
            } else {
                vm.memberBool = true
            }
            // 转账
            if (isInArray(menuStr, '/ad/transfer') == false) {
                vm.transferBool = false
            } else {
                vm.transferBool = true
            }
            // 充值
            if (isInArray(menuStr, '/ad/recharge') == false) {
                vm.rechargeBool = false
            } else {
                vm.rechargeBool = true
            }

            function isInArray(menuStr, value) {
                for (var i = 0; i < menuStr.length; i++) {
                    if (value === menuStr[i]) {
                        return true
                    }
                }
                return false;
            }
        })
    }
}
</script>
