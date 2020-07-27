<template>
    <div class="add-form">
        <header class="my-modal-header">
            <h3 style="font-size: 18px; color: black; margin-bottom: 16px;">{{title}} </h3>
            <div class="split_line"></div>
        </header>
        <div style="width: 900px;">
            <header style="margin: 50px 0;">
                <ul class="top">
                    <li v-for="(item, key) in titleList" :key="item" :class="key == inde ? 'active' : ''">
                        <span class="order">{{key+1}} </span>
                        <span class="title">{{item}} </span>
                        <span class="line" v-show="key != 2"></span>
                    </li>
                </ul>
            </header>
            <Form ref="fuleForm1" :model="ruleForm" :rules="ruleValidate" :label-width="150" v-show="index == 0">
                <FormItem label="规则名称" prop="ruleName">
                    <Input v-model="ruleForm.ruleName" placeholder="请输入规则名称" style="width: 70%" @keydown.native="deleteBlank" />
                </FormItem>
                <FormItem label="APP端版本" prop="version">
                    <Input v-model="ruleForm.version" placeholder="1.2.0 / all" style="width: 70%" @keydown.native="deleteBlank" />
                </FormItem>
                <FormItem label="APP端类型：" prop='os'>
                    <Select v-model="ruleForm.os" style="width:70%" placeholder="请选择APP端类型">
                        <Option v-for="item in typeList" :value="item.label" :key="item.label">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="APP端渠道：" prop='qid'>
                    <Input v-model="ruleForm.qid" placeholder="qid123456" style="width:70%" @keydown.native="deleteBlank"/>
                    <span style="color:rgba(0,0,0,0.3);margin-left:5px">all代表适配所有渠道</span>
                </FormItem>
                <FormItem style="margin-top:20px;">
                    <Button type="primary" @click="handleSubmit('ruleForm1')">下一步</Button>
                    <Button  style="margin-left: 8px" @click="handleReset()">取消</Button>
                </FormItem>
            </Form>
            <Form v-show="index==1" style="margin-left: 85px;">
                <div v-for="(item,key) in deployList" :key='item.key'>
                <FormItem label="广告来源" style="width:22%;display:inline-block">
                    <Select v-model="item.adtype" filterable style="width:60%" placeholder="请选择广告来源">
                    <Option v-for="res in sourceList" :value="res.key" :key="res.key">{{ res.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权重配置" style="width:28%;display:inline-block">
                    <Input v-model="item.weights" placeholder="请输入权重" style="width:60%" @keydown.native="deleteBlank"/>
                    <span class="_title" title="权重总和需为10000" v-show="key==0">?</span>
                </FormItem>
                <FormItem label="应用ID" style="width:22%;display:inline-block">
                    <Input v-model="item.appid" placeholder="" style="width:60%" @keydown.native="deleteBlank" :disabled='item.adtype=="A0"'/>
                </FormItem>
                <FormItem label="广告位ID" style="width:22%;display:inline-block">
                    <Input v-model="item.advid" placeholder="" style="width:60%" @keydown.native="deleteBlank" :disabled='item.adtype=="A0"'/>
                </FormItem>
                <FormItem style="width:6%;display:inline-block">
                    <Button type="dashed" @click="handleReduce(key)">删除</Button>
                </FormItem>
                </div>
                <FormItem>
                <Button type="dashed" @click="handleAdd()" style="margin-left:65px;">添加</Button>
                </FormItem>
                <FormItem style="margin-top:20px;margin-left:65px;">
                <Button type="primary" @click="handleSubmit('2')">下一步</Button>
                <Button style="margin-left: 8px" @click="handleSubmit('1')">上一步</Button>
                </FormItem>
            </Form>
            <div v-show="index == 2" style="margin-left: 50px;">
                <Form :label-width="100">
                    <FormItem label="规则名称" style="margin-bottom: 0px">
                        <span>{{ruleForm.ruleName}} </span>
                    </FormItem>
                    <FormItem label="APP端版本" style="margin-bottom: 0px;">
                        <span>{{ruleForm.version}} </span>
                    </FormItem>
                    <FormItem label="App端类型" style="margin-bottom: 0px">
                        <span>{{appLeixing[ruleForm.os]}} </span>
                    </FormItem>
                    <FormItem label="App端渠道" style="margin-bottom: 0px; word-break-all">
                        <span>{{ruleForm.qid}} </span>
                    </FormItem>
                    <div class="body_line"></div>
                    <table style="width: 500px; text-align: center; font-size: 12px; color: #515a6e; line-height: 30xp">
                        <tbody>
                            <tr>
                                <td>广告来源</td>
                                <td>所占权重</td>
                                <td>应用ID</td>
                                <td>广告位ID</td>
                            </tr>
                            <tr v-for="item in deployList" :key="item.key">
                                <td>{{layyuan[item.adtype]}} </td>
                                <td>{{item.weights}} </td>
                                <td>{{item.appid}} </td>
                                <td>{{item.advid}} </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
                <Form>
                    <FormItem style="margin-top: 20px; margin-left: 100px;">
                        <Button type="primary" @click="handleSubmit('add')">完成配置</Button>
                        <Button style="margin-left: 8px;" @click="handleSubmit('1')">上一步</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
import allList from './const.js'
import { saveOrUpdateCloudcConfigRule } from '@/api/cloud';
export default {
    components: {},
    props: {
        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: null,
        },
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // 顶部指示
            titleList: ['基本信息', '权重配置', '完成配置'],
            index: 0,  // 当前操作对象下标
            weightsNumber: 10000, // 权重总和
            sourceList: [], // 来源列表
            ruleId: '',  // 广告位规则id
            // 基本信息
            ruleForm: {
                ruleName: '',  // 规则名称
                version: '', // APP端版本
                os: '',  // App端类型
                qid: ''  // APP端渠道
            },
            laiyuan: {},
            // 权重配置
            deployList: [],
            // 验证规则
            ruleValidate: {
                ruleName: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                version: [{required: true, message: '必选'}],
                os: [{required: true, message: '必选'}],
                qid: [{required: true, message: '必填'}]
            }
        }
    },
    methods: {
        /**
         * @description 进入输入空格方法
        */
        deleteBlank (e) {
            if (e.keyCode == 32) {
                e.returnValue = false;
            }
        },
        // 点击取消
        handleReset() {
            this.$emit('on-submit');
        },
        // 添加权重配置
        handleAdd() {
            if (this.deloyList.length > 10) {
                this.$Message.warning('最多添加10条、已达到上限')
            } else {
                const obj = {
                    adtype: '',
                    weights: '',
                    advid: '',
                    appid: ''
                };
                this.deployList.push(obj);
            }
        },
        // 删除权重配置
        handleReduce (val) {
            if (this.deployList.length == 1) {
                this.$Message.warning('至少保留一条！')
            } else {
                this.deployList.splice(val, 1);
            }
        },
        // 点击下一步
        handleSubmit (name) {
            if (name == '1') {
                this.index--;
                return;
            } else if (name == '2') {
                let bool = true;  // 是否全部天写验证
                let bool2 = true; // 是否重复天写验证
                let num = 0;
                this.deployList.map((res, index) => {
                    for (let val in res) {
                        if (res.adtype == 'A0') {
                            if (res.weights === '') {
                                bool = false;
                            }
                        } else if (res[val] === '') {
                            bool = false;
                        }
                    }
                    num = num + Number(res.weights);
                    this.deployList.map((item, key) => {
                        if (res.adtype === item.adtype && res.advid === item.advid && res.appid === item.appid && index != key) {
                            bool2 = false;
                        }
                    })
                })
                if (!bool) {
                    this.$Message.warning('请填写完成所有内容')
                } else if (num != this.weightsNumber) {
                    this.$Message.warning('权重总和需要10000')
                } else if (!bool2) {
                    this.$Message.warning('请勿重复天写内容')
                } else {
                    this.index++;
                }
            } else if (name == 'add') {
                const ajaxData = Object.assign({}, this.ruleForm, {
                    array: JSON.stringify(this.deployList)
                })
                if (this.type == 'edit') {
                    ajaxData.ruleId = this.ruleId;
                }
                saveOrupdateCloudcConfigRule(ajaxData).then(res => {
                    this.index = 0;
                    this.$Message.success('保存成功');
                    this.$emit('on-submit', 'on');
                })
            } else if (name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.index++;
                    }
                })
            }
        }
    },
    mounted() {},
    conputed: {
        typeList() {
            return allList.typeList
        },
        appLeixing() {
            return allList.appLeixing
        }
    },
    watch: {
        data(val) {
            if (val.modalType == 'add') {
                this.$refs['ruleForm1'].resetFields();
                this.deployList = [{
                    adtype: '',
                    weights: '',
                    advid: '',  // 广告位id
                    appid: '',  // 应用id
                }, {
                    adtype: '',
                    weights: '',
                    advid: '',
                    appid: ''
                }, {
                    adtype: '',
                    weights: '',
                    advid: '',
                    appid: ''
                }]
            } else {
                this.deployList = JSON.parse(val.array)
            }
            this.ruleForm.ruleName = val.ruleName || '';
            this.ruleForm.version = val.version || '';
            this.ruleForm.os = val.os || '';
            this.ruleForm.qid = val.qid || '';
            this.ruleId = val.ruleId || '';
        },
        list (val) {
            this.sourceList = val;
            val.map(res => {
                this.laiyuan[res.key] = res.value;
            })
        }
    }
}
</script>
