<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>
<template>
    <div style="text-align: center">
        <Row class="expand-row">
            <Col span="6" v-for="item in colList" :key="item">
                <span class="expand-key">{{item}} </span>
            </Col>
        </Row>
        <Row class="expand-row" v-for="item in array" :key="item.key">
            <Col span="6">
                <span class="expand-value">{{item._name}} </span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{item.weights}} </span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{item.appid}} </span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{item.advid}} </span>
            </Col>
        </Row>
    </div>
</template>
<script>
import { getCloudcConfigRuleInfo, getCloudcAdtype } from '@/api/cloud';
export default {
    props: {
        row: {
            type: 'Object',
            default: {}
        }
    },
    data() {
        return {
            colList: ['广告来源', '所占权重', '应用ID', '广告位ID'],
            array: []
        }
    },
    methods: {
        // 获取广告来源列表
    },
    watch: {
        row(val) {
            val.list.map(item => {
                val.para.map(item => {
                    if (item.adtype == res.key) {
                        item._name = res.value;
                    }
                })
            })
            this.array = val.para;
        }

    }
}
</script>
