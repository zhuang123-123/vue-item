<template>
    <div>
        <div class="add-form">
            <Form ref="sellingValdata" :model="sellingValdata" :rules="ruleValidate" :label-width="135" style="min-height: 500px">
                <FormItem label="售卖位名称：" prop="name">
                    <Input v-model="sellingValdata.name" placeholder="请输入售卖位名称1-20个字" :disabled='viewBool' @keydown.native="disBlank"/>
                </FormItem>
                <FormItem label="终端类型：" prop="terminal_type">
                <CheckboxGroup v-model="sellingValdata.terminal_type" @on-change="terminalsChange('terminal')">
                    <Checkbox v-for='item in terminalTypeList' :label="item.key" :key='item.key' :disabled='viewBool' >{{item.value}}</Checkbox>
                </CheckboxGroup>
                </FormItem>
                <FormItem label="支持样式：" prop="design_id">
                <CheckboxGroup v-model="sellingValdata.design_id" @on-change="terminalsChange">
                    <Checkbox v-for='item in styleNameList' :label="item.key" :key='item.key' :disabled='viewBool'>{{item.value}}</Checkbox>
                </CheckboxGroup>
                </FormItem>
                <FormItem label="广告位选择：" prop="position_id">
                <input type="text" v-model="sellingValdata.position_id" v-show="false">
                <Button type="primary" @click="advertChange" :disabled="(bool1 || viewBool)">选择</Button>
                </FormItem>
                <FormItem>
                <Table
                    :data="tableData"
                    :columns="columns"
                ></Table>
                </FormItem>
                <FormItem label="竞价方式：" prop="bidding_way">
                    <RadioGroup v-model="sellingValdata.bidding_way" >
                        <Radio v-for="item in priorityList" :label="item.key" :key="item.key" :disabled='viewBool'>{{item.value}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="CPM单价：" prop="cpm">
                    <Input type="number" v-model="sellingValdata.cpm" :disabled='viewBool' @keydown.native="disBlank"/>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="sellingValdata.remark" :disabled='viewBool' @keydown.native="disBlank"/>
                </FormItem>
                <FormItem label="状态：">
                    <span>{{sellingValdata.status== 1 ? '开':'关'}}</span>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('sellingValdata')" :disabled='viewBool'>确定</Button>
                    <Button  style="margin-left: 8px" @click="handleReset('sellingValdata')">取消</Button>
                </FormItem>
            </Form>
        </div>
        <div class="adsenseTable" v-if="bool2">
            <header class="my-modal-header">
                <h4>广告位选择</h4>
                <div class="icon-wrap">
                    <Icon @click.native="hideView" :size="35" type="ios-close" style="cursor: pointer;" />
                </div>
            </header>
            <div style="margin: 20px 0;">
                <Select v-model="params2.site" style="width: 120px" placeholder="请选择站带你名称">
                    <Option v-for="item in siteList" :value="item.key" :key="item.key">{{item.value}}</Option>
                </Select>
                <Input v-model="params.name" placeholder="模糊搜索: id, 名称" style="width: 180px; margin-left: 10px;" />
                <Button type="primary" style="margin-left: 10px;" @click="getList()">查询</Button>
                <Button style="margin-left: 10px;" @click="retList()">重置</Button>
            </div>
            <div style="max-height: 400px; overflow-y: scroll;">
                <Table
                    :columns="columns2"
                    :data="tableData2"
                    @on-select="selectTd"
                    @on-select-cancel="selectTd"
                    @on-select-all="selectTd"
                    @on-select-all-cancel="selectTd">
                </Table>
            </div>
            <div style="width: 250px; margin: 20px auto;">
                <Button style="width: 100px;" type="primary" @click="submitAdsense" :disabled="viewBool">确定</Button>
                <Button style="margin-left: 50px; width: 100px;" @click="hideView">取消</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { getConfigDict } from '@/api/common';
import { getSiteName, getAdsenceDetailList, getPlatList, getDesignList, getSiteList } from '@/api/media';
import { insertSellSeat, updateSellSeat, adsenseList, getBiddingList } from '@/api/selling';
export default {
    props: {
        type: {
            tyoe: String,
            default: ''
        },
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            // 已选数据表格集合
            tableData: [],
            tableData2: [],
            // 广告位选择id
            columns: [
                { title: '广告位id', key: 'positionId', align: 'center' },
                { title: '广告位名称', key: 'positionName' },
                { title: '站点名称', key: 'site' },
                { title: '支持样式', key: 'designName' },
            ],
            columns2: [
                {
                    title: 'index',
                    width: 60,
                    align: 'center',
                    type: 'selection',
                    style: {
                        display: 'block'
                    }
                }, {
                    title: '广告位id', key: 'positionId', align: 'center' },
                { title: '广告位名称', key: 'positionName'},
                { title: '站点名称', key: 'site' },
                { title: '支持样式', key: 'designName' }
            ],
            sellingValdate: {
                id: '',
                name: '',
                terminal_type: [],
                design_id: [],
                bidding_way: null,
                status: 1,
                cpm: '',
                position_id: [],
                remark: '',
            },
            params2: {
                site: '',
                name: ''
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: '必填'
                    },
                    {
                        type: 'String',
                        message: '样式名称格式不正确',
                        pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1, 20}$/
                    }
                ],
                terminal_type: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                design_id: [
                    {
                        required: true,
                        message: '必选'
                    }
                ],
                position_id: [{
                    required: true,
                    message: '必选'
                }],
                bidding_way: [{
                    required: true,
                    message: '必选'
                }],
                cpm: [{
                    required: true,
                    message: '必填'
                }]
            },
            terminalTypeList: [],
            priorityList: [],
            authortyList: [],
            // 广告位样式
            styleNameList: [],
            siteList: [],
            adsenseId: [],
            bool1: true,
            bool2: false,
            userGroupList: [],
            defaultList: [],
            viewBool: false,
        }
    },
    methods: {
        disBlank (event) {
            if (event.keyCode == 32) event.returnValue = false;
        },
        getViewData() {
            // 获取终端类型
            getPlatList().then(res => {
                this.terminalTypeList = [];
                res.data.data.map(res => {
                    let obj = {
                        key: String(res.id),
                        value: res.value
                    }
                    this.terminalTypeList.push(obj);
                })
            });
            getBiddingList().then(res => {
                this.priorityList = [];
                res.data.data.map(res => {
                    let obj = {
                        key: red.id,
                        value: res.value
                    }
                    this.priorityList.push(obj);
                })
            });
        },
        getList() {
            this.getAlladsense();
        },
        retList() {
            this.params2.site = '',
            this.params2.slotName = '',
            this.params2.name = '',
            this.getAlladsense();
        },
        advertChange() {
            if (this.sellingValdata.terminal_type.length == 0) {
                this.$Modal.warning({
                    title: '请选择至少一种终端类型'
                })
            } else if (this.sellingValdata.design_id.length == 0) {
                this.$Modal.warning({
                    title: '请选择至少一种支持方式'
                })
            } else {
                this.bool2 = true;
                this.getAlladsense();
            }
        },
        // 获取广告位信息
        getAlladsense() {
            const terminals = this.sellingValdata.terminal_type.join(',');
            const design_id = this.sellingValdata.design_id.join(',');
            const ajaxData = {
                terminal: terminals,
                design_id: design_id,
                site: this.params2.site || '',
                name: this.params2.name,
            }
            adsenseList(ajaxData).then(res => {
                this.tableData2 = res.data.data || [];
                if (this.tableData2) {
                    this.adsenseId = [];
                    this.sellingValdata.position_id.map(res => {
                        this.tableData2.map(item => {
                            if (item.id == res) {
                                item._checked = true;
                                this.adsenseId.push(item.id)
                            }
                        })
                    })
                }
            })
        },
        // 提交
        handleSubmit (name) {
            if (this.type === 'view') {
                return false;
            }
            this.$refs[name].validate(valid => {
                if (valid) {
                    const ajaxData = Object.assign({}, this.sellingValdata, {
                        terminal_type: this.sellingValdata.terminal_type.join(','),  // 终端类型
                        design_id: this.sellingValdata.design_id.join(','),  // 支持样式
                        position_id: this.sellingValdata.position_id.join(','),  // 广告位
                        status: null
                    })
                    if (this.type === 'add') {
                        insertSellSeat(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('售卖位新增成功');
                        })
                    } else if (this.type === 'edit') {
                        updateSellSeat(ajaxData).then(res => {
                            this.$emit('on-submit', 'on')
                            this.$Message.success('更新成功')
                        })
                    } else {
                        return false;
                    }
                }
            })
        },
        // 终端类型变化
        terminalsChange (paramas) {
            if (paramas === 'terminal') {
                this.sellingValdata.design_id = [];
                if (this.sellingValdata.terminal_type && this.sellingValdata.terminal_type.length) {
                    getDesignList({platform: this.sellingValdata.terminal_type.join(',')}).then(res=> {
                        this.styleNameList = [];
                        res.data.data.map(res => {
                            let obj = {
                                key: String(res.id),
                                value: res.value
                            }
                            this.styleNameList.push(obj)
                        })
                    })
                } else {
                    this.styleNameList = [];
                }
            }
            if (this.sellingValdata.terminal_type.length == 0 || this.sellingValdara.design_id.length == 0) {
                this.bool1 = true;
            } else {
                this.bool1 = false;
            }
            this.sellingValdata.position_id = [];
            this.adsenseId = [];
            this.tableData = [];
        },
        // 关闭页面
        handleReset (name) {
            this.$emit('on-submit');
        },
        // 选中
        selectTd (params) {
            this.adsenseId = [];
            params.forEach(res => {
                this.adsenseId.push(res.id);
            })
        },
        // 确认已选择广告位列表
        submitAdsense() {
            this.sellingValdata.position_id = this.adsenseId;
            this.bool2 = false;
            this.getSelectadsense();
        },
        hideView() {
            this.bool2 = false;
        },
        // 获取已选中广告位列表
        getSelectadsense() {
            const position_id = this.sellingValdata.position_id.join(',');
            this.tableData = []
            if (position_id === '') {
                this.sellingValdata.position_id = [];
                this.adsenseId = [];
            } else {
                getAdsenceDetailList({id: position_id}).then(res => {
                    this.tableData = res.data.data || []
                })
            }
        },
        // 获取站点名称
        getSiteNameList() {
            // 获取站点类型
            getSiteList().then(res => {
                this.siteList = [];
                res.data.data.map(res => {
                    let obj = {
                        key: res.id,
                        value: res.value
                    }
                    this.siteList.push(obj);
                })
            });
        },
    },
    mounted() {
        this.$refs.sellingValdata.resetFields();
        this.getViewData();
        this.getSiteNameList();
        switch (this.type) {
            case 'view':
                    this.viewBool = true;
                    this.bool1 = true;
                    break;
            case 'edit':
                    this.viewBool = false;
                    this.bool1 = false;
                    break;
            case 'add':
                    this.viewBool = false;
                    this.bool1 = true;
                    break;
            default:
                    break;
        }
        if (this.type != 'add') {
            this.sellingValdata.id = this.data.id || '';
            this.sellingValdata.name = this.data.name || '';
            if (this.data.terminal_type) {
                this.sellingValdata.terminal_type = this.data.terminalType.split(',');
                this.terminalsChange('terminal');
            } else {
                this.sellingValdata.terminal_type = [];
            }
            if (this.data.designId) {
                this.sellingValdata.design_id = this.data.designId.split(',');
            } else {
                this.sellingValdata.design_id = [];
            }
            if (this.data.positionId) {
                this.sellingValdata.position_id = this.data.positionId.split(',');
                this.getSelectadsense();
            } else {
                this.sellingValdata.position_id = [];
                this.getSelectadsense();
            }
            this.sellingValdata.bidding_way = this.data.biddingWay;
            this.sellingValdata.cpm = this.data.cpm;
            this.sellingValdata.status = this.data.status || 0;
            this.sellingValdata.remark = this.data.remark;
            if (this.sellingValdata.terminal_type.length == 0 || this.sellingValdata.design_id.length == 0) {
                this.bool1 = true;
            } else {
                this.bool1 = false;
            }
        }
    },
    watch: {
        data (val) {
            this.tableData2 = [];
            this.$refs.sellingValdata.resetFields();
            this.sellingValdata.id = val.id || '';
            this.sellingValdata.name = val.name || '';
            if (val.terminalType) {
                this.sellingValdata.terminal_type = val.terminalType.split(',');
                this.terminalsChange('terminal');
            } else {
                this.sellingValdata.terminal_type = [];
            }
            if (val.designId) {
                this.sellingValdata.design_id = val.designId.split(',');
            } else {
                this.sellingValdata.design_id = [];
            }
            if (val.positionId) {
                this.sellingValdata.position_id = val.positionId.split(',');
                this.getSelectadsense();
            } else {
                this.sellingValdata.position_id = [];
                this.getSelectadsense();
            }
            this.sellingValdata.bidding_way = val.biddingWay;
            this.sellingValdata.cpm = val.cpm;
            this.sellingValdata.status = val.status || 0;
            this.sellingValdata.remark = val.remark;
        },
        type (val) {
            switch (val) {
                case 'view':
                    this.viewBool = true;
                    this.bool1 = true;
                    break;
                case 'edit':
                    this.viewBool = false;
                    this.bool1 = false;
                    break;
                case 'add':
                    this.viewBool = false;
                    this.bool1 = true;
                    break;
                default:
                    break;
            }
            if (val === 'add') {
                this.$refs.sellingValdata.resetFields();
                this.sellingValdata = {
                    id: '',
                    name: '',
                    status: 1,
                    terminal_type: [],
                    design_id: [],
                    bidding_way: null,
                    position_id: [],
                    remark: ''
                };
                this.tableData = [];
                this.styleNameList = [];
                this.adsenseId = [];
            }
        }
    }
}
</script>
<style lang="less" scope>
.adsenseTable {
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    height: 100%;
    z-index: 100;
    padding: 0 20px;
    border-radius: 6px;
    width: 100%;
}
</style>
