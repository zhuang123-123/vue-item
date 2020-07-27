<template>
    <div>
        <Card>
            <div>
                <header>
                    <h3 style="font-size: 18px; color: black; margin-bottom: 16px;">参数配置</h3>
                    <div class="param_line"></div>
                </header>
                <div style="margin: 50px; margin-right: 0px; position: relative">
                    <span>轮询时长配置</span>
                    <InputNumber v-model="params.configValue" style="width: 200px; margin-left: 10px;"></InputNumber>
                    <span style="position: absolute; left: 240px; top: 6px">分钟</span>
                </div>
                <div style="margin-left: 135px">
                    <Button type="primary" size="large" style="margin-left: 10px;" @click="submit">保存</Button>
                    <Button style="margin-left: 10px;" size="large" @click="resume">恢复默认参数</Button>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
import { selectByConfigKey, updateConfigValueByKey } from '@/api/cloud';
export default {
    name: 'shielding_page',
    components: {},
    data() {
        return {
            params: {
                configValue: null
            },
            key: 'adv_polling_interval',  // 默认Key
        }
    },
    methods: {
        // 获取默认参数
        getDecision() {
            selectByConfigKey({configKey: this.key}).then(res => {
                this.params.configValue = Number(res.data.data.configValue);
            })
        },
        // 恢复默认参数
        resume () {
            this.$Modal.confirm({
                title: '确定要恢复默认并保存么？',
                onOk: () => {
                    this.submit('1');
                }
            })
        },
        // 提交保存参数
        submit (vl) {
            const ajaxData = {
                configKey: this.key
            }
            if (val != '1') {
                if (this.params.configValue <= 0) {
                    this.$Message.warning('轮询时长必须大于0');
                    return
                } else if (String(this.params.configValue).indexOf('.') != -1) {
                    this.$Message.warning('轮询时长不能含有小数')
                    return 
                }
                ajaxData.configValue = this.params.configValue;
            }
            updateConfigValueByKey(ajaxData).then(res => {
                this.$Message.success('保存成功');
                if (val == '1') {
                    this.getDecision();
                }
            })
        }
    },
    mounted() {
        this.getDecision();
    },
    // keep-alive 生命周期-进入页面
    activated() {
        this.getDecision();
    }
}
</script>
<style lang="less">
.ivu-table-wrapper {
    overflow: inherit;
}
.parm_line {
    height: 1px;
    background-color: rgba(0, 0, 0, .1)
}
</style>
