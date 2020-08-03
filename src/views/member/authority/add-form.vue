<template>
    <div>
        <Form ref="authorityForm" :model="authorityForm" :rules="ruleValidate" :label-width="120">
            <FormItem label="登录账号" v-show="type == 'add'">
                <selectPage style="width: 150px;" v-model="accountName" @onChange="accountChange"></selectPage>
                <span v-show="accountName" style="margin-left: 20px; color: #3582fb;"> 企业名称</span>
            </FormItem>
            <FormItem label="登录账号" v-show="type == 'edit'">
                <span>{{account}} </span>
                <span style="margin-left: 20px; color: #3582fb;">企业名称：{{companyName}}</span>
            </FormItem>
            <FormItem label="售卖位展示" style="margin-bottom: 0">
                <span style="color: #3582fb; font-size: 12px"> 注：只会针对有权限控制的售卖位进行管理</span>
            </FormItem>
            <FormItem prop="sellSeatIds">
                <Card>
                    <CheckboxGroup v-model="authorityForm.sellSeatIds">
                        <Checkbox v-for="item in shoumaiweiList" :label="item.key" :key="item.key" >{{item.value}} </Checkbox>
                    </CheckboxGroup>
                </Card>
            </FormItem>
            <FormItem label="竞价方式管理" style="margin-bottom: 0">
                <span>注： rtb的竞价模式不进行权限控制</span>
            </FormItem>
            <FormItem>
                <CheckboxGroup v-model="authorityForm.bidModels">
                    <Checkbox v-for="item in categoryList" :label="item.key" :key="item.key">{{item.value}} </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('authorityForm')">确认</Button>
                <Button style="margin-left: 8px;" @click="handleReset('authorityForm')">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import stateList from './const.js';
import { getsellseat, addsellseat, updatePermission } from '@/api/member';
import selectPage from './selectPage.vue';
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
    components: {
        selectPage
    },
    data() {
        return {
            bottonBool: true,  // 按钮可点击判断值 true: 可点击  false: 点击无反应
            companyName: '',  // 企业名称
            nowId: '',  // 当前操作对象
            account: '',  // 公司名字
            accountName: {},  // 登录账号对象
            authorityForm: {
                sellSeatIds: [],  // 售卖位
                bidModels: [],
            },
            shoumaiweiList: [],  // 售卖位列表
            ruleValidate: {
                account: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                sellSeatIds: [
                    {
                        required: true,
                        message: '必选'
                    }
                ]
            },
            // 广告位样式
            viewBool: false  // 可编辑状态值：查看模式为true(不可编辑) 非查看模式 false(可编辑)
        }
    },
    methods: {
        accountChange(val) {
            this.companyName = val || '';
        },
        // 获取售卖位下拉列表
        getShoumaiwei() {
            let _this = this;
            getsellseat().then(res => {
                let arr = res.data.data || [];
                let arr1 = [];
                arr.map(res => {
                    let obj = {
                        key: String(res.sellSeatId),
                        value: res.sellSeatName
                    }
                    arr1.push(obj);
                })
                _this.shoumaiweiList = arr1;
            })
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.type == 'add') {
                        // 判断当前选中了登录账号选项
                        if (this.accountName && this.accountName.adUserId) {

                        } else {
                            this.$Message.error('请选择登录账号')
                            return;
                        }
                        let ajaxData = Object.assign({}, this.authorityForm, {
                            adUserId: this.accountName.adUserId,
                            account: this.accountName.account,
                            sellSeatIds: this.authorityForm.sellSeatids.join(','),
                            bidModels: this.authorityForm.bidModels.join(',')
                        });
                        addsellseat(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('创建成功')
                        })
                    } else if (this.type == 'edit') {
                        let ajaxData = {
                            id: this.nowId,
                            sellSeatIds: this.authorityForm.sellSeatIds.join(','),
                            bidModels: this.authorityForm.bidModels.join(',')
                        };
                        updatePermission(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('修改成功');
                        })
                    }
                }
            })
        },
        handleReset(name) {
            this.$emit('on-submit');
        }
    },
    computed: {
        categoryList() {
            return stateList.categoryList
        }
    },
    mounted() {
        this.getShouMaiwei();
    },
    watch: {
        data(val) {
            let _this = this;
            _this.$refs['authorityForm'].resetFields();
            if (val.modalType == 'edit') {
                _this.account = val.account;
                _this.companyName = val.companyName;
                _this.nowId = val.id;
                if (val.sellSeatIds) {
                    _this.authorityForm.sellSeatIds = val.sellSeatIds.split(',');
                } else {
                    _this.authorityForm.sellSeatIds = [];
                }
                if (val.bidModels) {
                    _this.authorityForm.bidModels = val.bidModels.split(',');
                } else {
                    _this.authorityForm.bidModels = [];
                }
            } else {
                _this.mowId = '';
                _this.companyName = '';
                _this.account = '';
                _this.accountName = {};
                _this.authorityForm.sellSeatIds = [];
                _this.authorityForm.bidModels = [];
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
