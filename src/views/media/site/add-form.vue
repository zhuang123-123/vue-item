<template>
    <div class="add-form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="min-height: 500px;">
            <FormItem label="id:" v-show="type !== 'add'">
                <Input v-model="formValidate.id" disabled @on-keypress="disBlank" />
            </FormItem>
            <FormItem label="终端类型" prop="platform">
                <Select v-model="formValidate.platform" placeholder="请选择终端类型" :disabled="viewBoolA || viewBool">
                    <Option v-for="item in terminalTypeList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
            </FormItem>
            <FormItem label="站点名称" prop="site_name">
                <Input v-model="formValidate.site_name" placeholder="大小写英文、数字、汉字、下划线的字符、字数在20个以内" :disabled="viewBool" :maxlength="20" @on-keypress="disBlank" />
            </FormItem>
            <FormItem label="站点类型" prop="site_type">
                <Select v-model="formValidate.site_type" placeholder="请选择站点类型" :disabled="viewBool">
                    <Option v-for="item in webTypeList" :value="item.id" :key="item.id">{{item.value}} </Option>
                </Select>
            </FormItem>
            <FormItem :label="webTitle+ ':'" prop="page_url">
                <Input v-model="formValidate.page_url" type="textarea" :rows="3" :placeholder="webHolder" :disabled="viewBool" :maxlength=500 @on-keypress="disBlank" />
            </FormItem>
            <FormItem label="对接形式：" prop="docking_form">
                <RadioGroup v-model="formValidate.docking_form">
                    <Radio v-for="item in docking_formList" :label="item.key" :key="item.key" :disabled="viewBool">{{item.value}} </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="站点负责人" prop="leader">
                <Input v-model="formValidate.leader" :disabled="viewBool" :maxlength=10 @on-keypress="disBlank" />
            </FormItem>
            <FormItem label="白名单校验" prop="is_white">
                <RadioGroup v-model="formValidate.is_white">
                    <Radio v-for="item in statusTypes" :label="item.key" :key="item.key" :disabled="viewBool">{{item.name}} </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="独立站点" prop="is_inde">
                <RadioGroup v-model="formValidate.is_inde">
                    <Radio v-for="item in statusTypes" :label="item.key" :key="item.key" :disabled="viewBool">{{item.value}} </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="formValidate.description" type="textarea" :rows="2" :disabled="viewBool" :maxlength="50" @on-keypress="disBlank" />
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="viewBool">确定 </Button>
                <Button style="margin-left: 8px;" @click="handleReset('formValidate')"> 取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { addSiteData, updateSiteData, getPlatList, getSiteName } from '@/api/media';
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
            formValidate: {
                id: '',  // id
                docking_form: '',  // 客户对接方式
                platform: '',  //终端类型
                site_name: '',  // 站点名称
                page_url: '',  // 网页地址
                site_type: '',  // 站点类型
                is_white: 1,  //  白名单校验
                leader: '',  // 站点负责人
                description: '',  // 备注
                is_inde: 1,  // 独立站点
            },
            regex_pc: /^(http|https):\/\//,
            regex_phone: /^[A-Za-z0-9_.]+$/,
            regex_leader: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            ruleValidate: {
                platform: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                site_name: [
                    {
                        required: true,
                        message: '必填'
                    },
                    {
                        trigger: 'blur',
                        type: 'string',
                        message: '站点名称只能为大小写英文、数字、汉字、下划线的字符，字数在20个以内',
                        pattern: /^[A-Za-z0-9\u4e00-\u9fa5_]{1, 20}$/
                    }
                ],
                site_type: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                docking_form: [
                    {
                        required: true,
                        message: '必填'
                    }
                ],
                leader: [
                    {
                        trigger: 'blur',
                        type: 'string',
                        message: '站点负责人只能为大小写英文、胡子、汉字的字符，字数在10个以内',
                        pattern: /^[A-Za-z0-9\u4e00-\u9fa5_]{1, 10}$/
                    }
                ],
                page_url: [
                    {
                        required: true,
                        message: '必填',
                        error: 'cuowu'
                    }
                ],
                is_white: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                is_inde: [
                    {
                        required: true,
                        message: '必选'
                    }
                ]
            },
            docking_formList: [
                {key: 'client', value: '客户端对接'},
                {key: 'server', value: '服务端对接'}
            ],
            statusTypes: [
                {key: 1, value: '是', name: '开'},
                {key: 0, value: '否', name: '关'}
            ],  // 状态集合
            viewBool: false,  // 可编辑状态值， 查看模式为true（不可编辑） 非查看模式 false （可编辑）
            viewBoolA: false,  // 编辑时终端类型不可修改
            webTypeList: [],  // 站点类型选项
            terminalTypeList: [],  // 终端
        }
    },
    methods: {
        disBlank(event) {
            if (event.keyCode ==  32) event.returnValue = false;
        },
        // 获取页面字典数据
        getViewData() {
            // 获取终端字典
            getPlatList().then(res => {
                this.terminalTypeList = res.data.data;
            })
            // 获取站点类型
            getSiteName().then(res => {
                this.webTypeList = res.data.data;
            })
        },
        handleSubmit(name) {
            if (this.type === 'view') {
                return false;
            }
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.formValidate.platform === 36) {
                        if (!this.regex_phone.text(this.formValidate.page_url)) {
                            this.$Modal.confirm({
                                title: '提示',
                                content: '包名格式错误',
                            })
                            return false;
                        }
                    } else if (!this.regex_pc.test(this.formValidate.page_url)) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '网页地址前缀格式错误, 请使用：http://或者https://'
                        })
                        return false;
                    }
                    if (this.formValidate.page_url.indexOf('') >= 0) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '包名或网页地址不能含有空格'
                        })
                        return false;
                    }
                    if (this.formValidate.leader && !this.regex_leader.test(this.formValidate.leader)) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '站点负责人输入格式有误'
                        })
                        return false;
                    }
                    const data = Object.assign({}, this.formValidate, {
                        page_url: this.formValidate.page_url.replace(/,/g, ',')
                    })
                    if (this.type === 'add') {
                        addSiteData(data).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('站点新增成功');
                        })
                    } else if (this.type === 'edit') {
                        updateSiteData(data).then(res => {
                            this.$emit('on-submit', on);
                            this.$Message.success('更新成功')
                        })
                    } else {
                        return false;
                    }
                }
            })
        },
        handleReset(name) {
            if (this.type === 'add') {
                this.$Modal.confirm({
                    title: '提示',
                    content: '已输入的内容讲不会被保存，是否进行取消操作？',
                    onOk: () => {
                        this.$refs[name].resetFields();
                        this.$emit('on-submit');
                    },
                    cancelText: '取消'
                })
            } else {
                this.$refs[name].resetFields();
                this.$emit('on-submit')
            }
        }
    },
    mounted() {
        this.getViewData();
        switch (this.type) {
            case 'view':
                this.viewBool = true;
                this.formValidate.id = this.datat.id || '';
                this.formValidate.platform = this.data.platform;
                this.formValidate.site_name = this.data.value;
                this.formValidate.page_url = this.data.pageUrl;
                this.formValidate.site_type = this.data.siteType;
                this.formValidate.is_white = this.data.isWhite;
                this.formValidate.leader = this.data.leader;
                this.formValidate.description = this.data.description;
                this.formValidate.is_inde = this.data.isInde;
                this.formValidate.docking_form = this.data.dockingForm;
                break;
            case 'edit':
                this.viewBoolA = true;
                this.formValidate.id = this.data.id || '';
                this.formValidate.platform = this.data.platform;
                this.formValidate.site_name = this.data.value;
                this.formValidate.page_url = this.data.pageUrl;
                this.formValidate.site_type = this.data.siteType;
                this.formValidate.is_white = this.data.isWhite;
                this.formValidate.leader = this.data.leader;
                this.formValidate.description = this.data.description;
                this.formValidate.is_inde = this.data.isInde;
                this.formValidate.docking_form = this.data.dockingForm;
                break;
            case 'add':
                break;
            default:
                break;
        }
    },
    computed: {
        // 网页地址选项名称转换
        webTitle() {
            return this.formValidate.platform == 36 ? '包名' : '网页地址';
        },
        webHolder() {
            return this.formValidate.platform == 36 ? '请输入包名：com' : '请输入网页地址：http(s)://'
        }
    }
}
</script>
