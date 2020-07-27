<template>
    <div class="add-form">
        <Form ref="channelForm" :model="channelForm" :rules="ruleValidate" :label-width="120">
            <FormItem label="渠道code" prop="qid_code">
                <Input v-model="channelForm.qid_code" placeholder="支持字母、数字、下划线和'.', 且字数不能超过20个" :maxLength="20" @on-keypress="disBlank" :disabled="viewBool" />
            </FormItem>
            <FormItem label="渠道号" prop="channel_name">
                <Input v-model="channelForm.channel_name" placeholder="支持字母、数字、下划线和'.', 且字数不能超过20个" :maxlength="20" @on-keypress="disBlank" :disabled="viewBool" />
            </FormItem>
            <!-- 渠道终端 -->
            <FormItem label="渠道终端" prop="platform">
                <RadioGroup v-model="channelForm.platform">
                    <Radio v-for="item in terminalList" :label="item.value" :key="item.value" :disabled="viewBool">{{item.value}} </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="渠道来源" prop="source">
                <Input v-model="channelForm.source" @on-keypress="disBlank" :maxlength="20" placeholder="支持大小写英文、数字、汉字、下划线、字数不饿能超过20个" :disabled="viewBool"  />
            </FormItem>
            <FormItem label="站点名称" prop="site">
                <Select multiple v-model="channelForm.site" placeholder="请选择站点名称" :disabled='viewBool'>
                    <Option v-for="item in siteList" :value="item.key" :key="item.key">{{ item.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="每日流量预估：">
                <Input v-model="channelForm.show_amount" type="number" placeholder="请输入正整数" @on-keypress="disBlank"  :disabled='viewBool'/>
            </FormItem>
            <FormItem label="描述：" >
                <Input v-model="channelForm.description" :disabled='viewBool' placeholder="50个字以内" :maxlength="50"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('channelForm')" :disabled='viewBool'>确定</Button>
                <Button  style="margin-left: 8px" @click="handleReset()">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { insertSspQid, updateQidByid, getChannelTag, getSiteList, getPlatList } from '@/api/media'
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
            bottonBool: true,  // 按钮可点击判断值 true: 可点击   false: 点击无反应
            id: '',
            channelForm: {
                channel_name: null,  // 渠道号
                platform: '',  // 终端
                qid_code: '',  // 渠道code
                site: [],  // 站点
                source: '', // 渠道来源
                show_amount: '',  // 每日流量预估
                description: '',  // 备注信息
            },
            terminalList: [],
            ruleValidate: {
                channel_name: [
                    {required: true, message: '必填'},
                    {type: 'string', message: '请输入数字、字母、下划线或者".", 且字数不能超过20个', pattern: /^[0-9a-zA-z_\.]{1, 20}$/}
                ],
                source: [
                    {
                        required: true,
                        message: '必填'
                    }, {
                        type: 'string',
                        message: '请输入数字、字母、下划线或者汉字，且字数不能超过20个',
                        pattern: /^[0-9a-zA-Z_\u4e00-\u9fa5]{1, 20}$/
                    }
                ],
                qid_code: [
                    {
                        required: true,
                        message: '必填'
                    }, {
                        type: 'string',
                        message: '请输入数字、字母、下划线或者".", 且字数不能超过20个',
                        pattern: /^[0-9a-zA-Z_\.]{1, 20}$/
                    }
                ],
                platform: [
                    {
                        required: true,
                        message: '必填'
                    }
                ],
                show_amount: [
                    {
                        type: 'string',
                        message: '请输入正整数',
                        pattern: /^[0-9]*[1-9][0-9]*$/
                    }
                ],
                site: [
                    {required: true, message: '必选'}
                ],
                source: [{
                    type: 'string',
                    message: '请输入数字、字母、下划线或者汉字',
                    pattern: /^[0-9a-zA-Z_\u4e00-\u9fa5]+$/
                }]
            },
            siteList: [],  // 站点名称列表
            viewBool: false  // 可编辑状态值： 查看模式位true（不可编辑） 非查看模式false（可编辑）
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.channelForm.qid_code && this.channelForm.qid_code.toLowerCase().startsWith('default')) {
                        this.$Message.warning('渠道code不能包含default字样')
                        return false;
                    }
                    if (this.channelForm.channel_name && this.channelForm.channel_name.toLowerCase().startsWith('default')) {
                        this.$Message.warning('渠道号不能包含default字样')
                        return false;
                    }
                    const ajaxData = Object.assign({}, this.channelForm, {
                        site: this.channelForm.site.join(',')
                    });
                    if (this.type === 'add') {
                        insertSspQid(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('渠道新增成功');
                        })
                    } else if (this.type === 'edit') {
                        ajaxData.id = this.id;
                        updateQidByid(ajaxData).then(res => {
                            this.$emit('on-submit', 'on');
                            this.$Message.success('编辑渠道成功')
                        })
                    } else {
                        return false;
                    }
                }
            })
        },
        getSiteList() {
            getSiteList().then(res => {
                const data = res.data.data;
                if (data) {
                    this.siteList = [];
                    const arr = [];
                    data.forEach(item => {
                        if (arr.indexOf(item.id) == -1) {
                            const obj = {
                                key: String(item.id),
                                value: item.value
                            }
                            arr.push(item.id);
                            this.siteList.push(obj);
                        }
                    });
                }
            })
            getPlatList().then(res => {
                this.terminalList = res.data.data;
            })
        },
        handleReset() {
            this.$emit('on-submit');
        },
        disBlank(event) {
            if (event.keyCode == 32) event.returnValue = false;
        }
    },
    mounted() {
        this.getSiteList();
        this.$refs['channelForm'].resetFields();
        switch (this.type) {
            case 'edit':
                this.id = this.data.id;
                this.channelForm.channel_name = this.data.channelName;
                this.channelForm.qid_code = this.data.qidCode;
                this.channelForm.platform = this.data.platform;  // 终端
                this.channelForm.site = this.data.site.split(',');
                this.channelForm.source = this.data.source;
                this.channelForm.show_amount = this.data.showAmount;
                this.channelForm.description = this.data.description;
                break;
            case 'add':
                break;
            case 'view':
                this.viewBool = true;
                this.channelForm.channel_name = this.data.channelName;
                this.channelFOrm.qid_code = this.data.qidCode;
                this.channelForm.platform = this.data.platform;
                this.channelForm.site = this.data.site.split(',');
                this.channelForm.source = this.data.source;
                this.channelForm.show_amount = this.data.showAmount;
                this.channelForm.description = this.data.description;
                break;
            default:
                break;
        }
    }
}
</script>
