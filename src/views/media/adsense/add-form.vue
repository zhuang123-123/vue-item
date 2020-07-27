<template>
    <div class="add-form">
        <Form ref="adsenseForm" :model="adsenseForm" :rules="ruleValidate" :label-width="120" style="min-height: 500px">
            <FormItem label="广告位id" v-show="type != 'add'">
                <Input  v-model="adsenseForm.slotId" disabled/>
            </FormItem>
            <FormItem label="广告位名称" prop="slotName">
                <Input v-model="adsenseForm.slotName" placeholder="支持中文+数字加大小字母，上限20位" :maxlength="20" :disabled="viewBool" />
            </FormItem>
            <FormItem label="站点名称" prop="appId">
                <Select v-model="adsenseForm.appId" placeholder="请选择站点名称" filterable :disabled="type != 'add'" @on-change="websiteChange">
                    <Option v-for="item in websiteList" :value="item.id" :key="item.id">{{item.appName}} </Option>
                </Select>
            </FormItem>
            <FormItem label="页面类型" prop="pgtype">
                <Select v-model="adsenseForm.pgtype" placeholder="请选择页面类型" filterable :disabled="viewBool">
                    <Option v-for="item in pageTypes" :value="item.code" :key="item.code">{{item.name}} </Option>
                </Select>
            </FormItem>

            <FormItem label="售卖位">
                <Input v-model="adsenseForm.shellSeatName" disabled />
            </FormItem>

            <FormItem label="广告请求个数" prop="adnum">
                <InputNumber v-model="adsenseForm.adnum" :disabled="viewBool" :min="1" :max="9" />
            </FormItem>

            <FormItem label="广告位样式" prop="styleIds">
                <CheckboxGroup v-model="adsenseForm.styleIds">
                    <Checkbox v-for="item in styleNameList" :label="item.id" :key="item.id" :disabled="viewBool">{{item.value}} </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="收费时机" prop="chargeType">
                <Select v-model="adsenseForm.chargeType" placeholder="请选择收费时机" :disabled="viewBool">
                    <Option v-for="item in chargeTimeList" :value="item.code" :key="item.code">{{item.name}} </Option>
                </Select>
            </FormItem>
            <FormItem label="推荐底价" prop="floorPrice">
                <InputNumber v-model="adsenseForm.floorPrice" :disabled="viewBool" :min="1" style="width: 20%"></InputNumber>
                <span style="margin-left: 10px;">元：CPM</span>
            </FormItem>
            <FormItem label="是否信息流" prop="isFeeds">
                <RadioGroup v-model="adsenseForm.isFeeds">
                    <Radio v-for="item in statusTypes" :label="item.key" :disabled="type != 'add'">{{item.value}} </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="状态" prop="status">
                <span>{{adsenseForm.status == 1 ? '开' : '关'}} </span>
            </FormItem>
            <FormItem label="更新时间" v-show="type != 'add'">
                <Input v-model="adsenseForm.updateTime" disabled />
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('adsenseForm')" :disabled="viewBool"> 确定</Button>
                <Button style="margin-left: 8px" @click="handleReset('adsenseForm')">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { addadsense, styleNameList, updateadsense, getSiteName } from '@/api/media';
import { getConfigDict } from '@/api/common';
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
        const rexpPosInt = /^[1-9][0-9]*?$/; // 正整数
        const rexpInt = /^[1-9][0-9]*(\.\d+)?$/; // 正整数
        return {
            showId: false, // 是否这是你hi样式id(新建隐藏、其他显示)
            bottonBool: true, // 按钮可点击判断true：可点击 false：点击无反应
            adsenseForm: {
                appId: '',//站点
                id: '', // id
                slotId: '', //广告位id
                slotName: '',  // 广告位名称
                appName: '', //站点名称
                pgtype: '', // 页面类型
                shellSeatName: '',  // 售卖位
                adnum: 1,  // 广告请求个数，默认为1
                styleIds: [], //广告位请求样式
                chargeType: '',  //收费时机
                floorPrice: null,  // 推荐底价
                isFeeds: 0,  // 是否信息liu： 默认--关
                statue: 1,  // 状态--默认：开
                updateTime: '1',  // 更新时间
                slotImgs: '1',  // 广告位示例
                slotDesc: '1',  // 广告位描述
            },
            ruleValidate: {
                slotName: [
                    {required: true, message: '必填'},
                    {type: 'string', message: '广告位名称格式不正确', pattern: /^[A-Za-z0-9_\u4e00-\u9fa5]{1, 20}$/}
                ],
                appId: [{required: true, message: '必选'}],
                pgtype: [{required: true, message: '必选'}],
                adnum: [
                    {required: true, message: '必填'},
                    {required: true, message: '听输入整数', pattern: rexpPosint}
                ],
                styleIds: [{required: true, message: '必选'}],
                chargeType: [{required: true, message: '必选'}],
                floorPrice: [{required: true, message: '必选'}],
                status: [{required: true, message: '必选'}]
            },
            statusTypes: [],  // 否信息流选项列表
            websiteList: [], // 站点名称
            dataList: [],
            styleNameList: [],  // 广告位样式
            pageTypes: [], // 页面类型
            chargeTimeList: [], // 收费时机
            viewBool: false, // 可编辑状态值，查看模式为true(不可编辑) 非查看模式 false(可编辑)
            terminalTypeList: 'wap,pc,app'
        }
    },
    methods: {
        initDictData() {
            getConfigDict('pageType').then(res => {  // 获取页面类型列表
                this.pageTypes = res;
            });
            getConfigDict('chargeTime').then(res => { // 广告收费时机
                this.chargeTimeList = res;
            });
            getConfigDict('yesNo').then(res => { // 获取是否信息流选项列表
                this.statusTypes = [];
                res.map(res => {
                    let obj = {
                        key: Number(res.code),
                        value: res.name
                    }
                    this.statusTypes.push(obj);
                })
            });
        },
        // 获取站点列表
        getSiteList() {
            getSiteName().then(res => {
                const data = res.data.data;
                if (data) {
                    this.websiteList = [];
                    const arr = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.appName) == -1) {
                            arr.push(item.appName);
                            this.websiteList.push(item);
                        }
                    })
                }
            })
        },
        // 站点变化
        websiteChange (val, bool) {
            let _this = this;
            if (!bool) {
                this.adsenseForm.styleIds = [];
            }
            this.styleNameList = [];
            if (val) {
                this.websiteList.map(res => {
                    if (res.id == val) {
                        _this.adsenseForm.appName = res.appName;
                        styleNameList(res.terminal).then(res => {
                            if (res.data.data) {
                                res.data.data.map(res => {
                                    const obj = {
                                        id: String(res.id),
                                        value: res.styleName
                                    }
                                    this.styleNameList.push(obj);
                                })
                            }
                        })
                    }
                })
            } else {
                this.styleNameList = [];
            }
        },
        handleSubmit(name) {
            let _this = this;
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (_this.adsenseForm.floorPrice > 1000) {
                        this.$Message.error('底价不能大于1000');
                        return false;
                    }
                    if (_this.adsenseForm.adnum > 9 || _this.adsenseForm.adnum < 0) {
                        this.$Message.error('广告请求个数请在1~9之间');
                        return false;
                    }
                    const ajaxData = {
                        appId: _this.adsenseForm.appId,
                        slotName: _this.adsenseForm.slotName,
                        appName: _this.adsenseForm.appName,
                        pgtype: _this.adsenseForm.pgtype,
                        shellSeatName: _this.adsenseForm.shellSeatName,
                        adnum: _this.adsenseForm.adnum,
                        styleIds: _this.adsenseForm.styleIds.join(','),
                        chargeType: _this.adsenseForm.chargeType,
                        floorPrice: _this.adsenseForm.floorPrice,
                        isFeeds: _this.adsenseForm.isFeeds,
                        status: _this.adsenseForm.status,
                        slotImgs: _this.adsenseForm.slotImgs,
                        slotDesc: _this.adsenseForm.slotDesc
                    }
                    if (_this.type === 'add') {
                        addadsense(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('创建广告位成功');
                        });
                    } else if (this.type === 'edit') {
                        ajaxData.id = _this.adsenseForm.id;
                        ajaxData.slotId = _this.adsenseForm.slotId;
                        updateadsense(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('编辑广告位成功')
                        });
                    } else {
                        return false;
                    }
                } else {

                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.$emit('on-submit');
        }
    },
    computed: {},
    mounted() {
        this.initDictData()
        this.getSiteList()
    },
    watch: {
        data (val) {
            this.$refs['adsenseForm'].resetFields();
            if (val.modalType === 'add') {
                styleNameList(this.terminalTypeList).then(res => {
                    if (res.data.data) {
                        this.styleNameList = [],
                        res.data.data.map(res => {
                            const obj = {
                                id: String(res.id),
                                value: res.styleName
                            }
                            this.styleNameList.push(obj);
                        })
                    }
                })
                this.styleNameList = [];
                this.$refs['adsenseForm'].resetFields();
                this.showId = false;
                this.adsenseForm = {
                    appId: '', // 站点id
                    id: '',  // id
                    slotId: '', // 广告位id
                    slotName: '',  // 广告位名称
                    pgtype: '',  // 页面类型
                    adnum: 1,  // 广告请求个数
                    styleIds: [],  // 广告位请求样式   
                    chargeType: '',  // 收费时机
                    floorPrice: null,  // 推荐底价
                    isFeeds: 0,  // 是否信息流
                    status: 1, // 状态
                    updateTime: '',  // 更新时间
                    slotImgs: '1',  // 广告位示例
                    slotDesc: '1',  // 广告位描述
                };
                this.$refs['adsenseForm'].resetFields();
            } else {
                this.adsenseForm.slotName = val.slotName;
                this.adsenseForm.slotId = val.slotId;
                this.adsenseForm.id = val.id;
                if (val.styleIds) {
                    this.adsenseForm.styleIds = val.styleIds.split(',')
                } else {
                    this.adsenseForm.styleIds = [];
                }
                this.adsenseForm.pgtype = val.pgtype || '';
                this.adsenseForm.chargeType = val.chargeType;
                this.adsenseForm.adnum = val.adnum === undefined ? 1 : val.adnum;
                this.adsenseForm.floorPrice = Number(val.floorPrice) || null;
                this.adsenseForm.updateTime = val.updateTime;
                this.adsenseForm.isFeeds = val.isFeeds === undefined ? 0 : val.isFeeds;
                this.adsenseForm.status = val.status === undefined ? 1 : val.status;
                this.adsenseForm.appId = Number(val.appId);
                this.adsenseForm.appName = val.appName;
                if (val.modalType == 'edit') {
                    this.websiteChange(this.adsenseForm.appId, true);
                } else {
                    styleNameList(this.terminalTypeList).then(res => {
                        if (res.data.data) {
                            this.styleNameList = [],
                            res.data.data.map(res => {
                                const obj = {
                                    id: String(res.id),
                                    value: res.styleName
                                }
                                this.styleNameList.push(obj);
                            })
                        }
                    })
                }
            }
            this.adsenseForm.shellSeatName = val.shellSeatName || '';
        },
        type (val) {
            if (val === 'view') {
                this.viewBool = true;
            } else {
                this.viewBool = false;
            }
            if (val === 'add') {
                this.showId = false;
                this.$refs['adsenseForm'].resetFields();
            } else {
                this.showId = true;
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
