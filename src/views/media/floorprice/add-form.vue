<template>
  <div class="add-form">
    <Form ref="floorForm" :model="floorForm" :rules="ruleValidate" :label-width="120" style="min-height:500px">
      <FormItem label="广告位名称：">
        <Input v-model="floorForm.slotName" disabled/>
      </FormItem>
      <FormItem label="渠道CODE" prop="qid" v-show="type != 'edit_other'">
        <Select v-model="floorForm.qid" filterable placeholder="请选择渠道CODE" >
          <Option v-for="item in qidList" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem label="渠道CODE" v-show="type === 'edit_other'">
        <Input value="all" disabled/>
      </FormItem>
      <FormItem label="页数：" prop="pgnum">
        <Input v-model="floorForm.pgnum" :disabled="type === 'edit_other' || view_bool" style="width:100%"/>
      </FormItem>
      <FormItem label="位置：" prop="idx">
        <Input v-model="floorForm.idx" :disabled="type === 'edit_other' || view_bool" style="width:100%"/>
      </FormItem>
      <FormItem label="minCpmDay：" prop="minCpmDay">
        <Input v-model="floorForm.minCpmDay" style="width:100%"/>
      </FormItem>
      <FormItem label="k值：" prop="krate">
        <Input v-model="floorForm.krate" style="width:100%"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('floorForm')">确定</Button>
        <Button  style="margin-left: 8px" @click="handleReset('floorForm')">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { addSspFloorPriceRemark, updateSspFloorPriceRemark } from '@/api/media';
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: null
        },
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            qidList: [],
            view_bool: true,
            floorForm: {
                id: '',
                slotId: '',
                slotName: '',
                qid: '',
                pgnum: '',
                id: '',
                minCpmDay: '',
                krate: ''
            },
            ruleValidate: {
                qid: {
                    required: true,
                    message: '必填'
                },
                pgnum: [
                    {required: false, message: '必填'},
                    {type: 'string', message: '请输入0或正整数', pattern: /^[0-9]+$/}
                ],
                idx: [
                    {required: false, message: '必填'},
                    {type: 'string', message: '请输入0或正整数', pattern: /^[0-9]+$/}
                ],
                minCpmDay: [
                    {required: true, message: '必填'},
                    {message: '请大于0且最多保留2位小数', pattern: /^([1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2})$/}
                ],
                krate: [
                    {required: true, message: '必填'},
                    {message: '请大于0且最多保留2位小数', pattern: /^([1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2})$/}
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            if (this.floorForm.minCpmDay > 1000) {
                this.$Message.warning('minCpmDay 不能大于1000');
                return
            }
            if (this.floorForm.krate > 100) {
                this.$Message.warning('K值不能大于100');
                return;
            }
            if (this.data.modalType == 'edit_other') {
                this.floorForm.qid = this.data.qid;
            }
            this.$refs[name].validate(valid => {
                if (valid) {
                    const ajaxData = Object.assign({}, this.floorForm, {
                        pgnum: this.floorForm.pgnum || '0',
                        idx: this.floorForm.idx || '0'
                    });
                    if (this.type == 'add') {
                        ajaxData.id = '';
                        addSspFloorPriceRemark(ajaxData).then(res => {
                            this.$emit('close-page', 'on');
                            this.$Message.success('创建广告位成功')
                        })
                    } else if (this.type === 'edit' || this.type === 'edit_other') {
                        updateSspFloorPriceRemark(ajaxData).then(res => {
                            this.$emit('close-page', 'on');
                            this.$Message.success('编辑广告位成功')
                        })
                    } else {
                        return false;
                    }
                }
            })
        },
        handleReset(name) {
            this.$emit('close-page');
        }
    },
    watch: {
        list(val) {
            this.qidList = val;
        },
        data(val) {
            this.$refs['floorForm'].resetFields();
            this.floorForm.id = val.id || '';
            this.floorForm.slotId = val.slotId || '';
            this.floorForm.slotName = val.slotName || '';
            // 
            if (val.isFeeds == '1' || val.modalType == 'edit_other') {
                this.floorForm.qid = val.qid;
                this.view_bool = false;
                this.floorForm.pgnum = val.pgnum || '';
                this.floorForm.idx = val.idx || '';
            } else {
                this.floorForm.qid = val.qid || '';
                this.view_bool = true;
                this.floorForm.pgnum = '0';
                this.floorForm.idx = '0';
            }
            this.floorForm.minCpmDay = val.minCpmDay || '';
            this.floorForm.krate = val.krate || '';
        }
    }
}
</script>
