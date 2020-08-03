<template>
    <el-select
        @clear="clear"
        ref="select"
        v-model="userID"
        placeholder="请选择广告主/直客"
        @keydonw.enter.native="enterClick"
        no-match-text="无匹配数据"
        no-data-text="无匹配数据"
        filterable
        clearable
        value-key="adUserId"
        @change="accountChange"
        v-el-select-loadmore="loadmore">
        <el-option
            v-for="item in options"
            :key="item.adUserId"
            :label="item.account"
            :value="item"
            ></el-option>    
    </el-select>
</template>
<script>
import {getUserList } from '@/api/member';
export default {
    props: {
        value: {
            type: null
        }// 接受外部v-model传入的值
    },
    directives: {
        'el-select-loadmore': {
            bind(el, binding) {
                // 获取element-ui定义好的scroll盒子
                const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown_wrap');
                SELECTWRAP_DOM.addEventListener('scroll', function () {
                    /**
                     * scrollHeight 获取元素内容的高度(只读)
                     * scrollTop 获取或者设置元素的偏移值，常用于，计算滚动条的位置，当一个元素的容器没有产生垂直方向的滚动条，那他的scrollTop的默认值为0
                     * clientHeight 读取元素的可见高度(只读)
                     * 如果元素滚动到底部，下面等式返回true，没有则返回false；
                     * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
                    const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                    if (condition) {
                        binding.value();
                    }
                })
            }
        }
    },
    data() {
        return {
            hide: 1,
            userID: this.value,
            options: [],
            formData: {
                content: '',
                pageNum: 1,
                pageSize: 20
            }
        }
    },
    watch: {
        // 判断下拉框的值是否有改变
        value(val) {
            this.userID = val;  // 监听外部对props属性result的变更，并同步到组件内的data属性myResult中
            this.options.map(res => {
                if (res.adUserId == val.adUserId) {
                    this.$emit('onChange', res.companyName || '');
                }
            })
        },
        userId(val, oldVal) {
            if (val != oldVal) {
                this.$emit('input', val);  // 组件内对myResult变更后向外部发送时间通知
            }
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        accountChange(val) {
            this.$emit('onChange', val.companyName || '')
        },
        // 下拉框
        loadmore() {
            this.formData.pageNum++;
            this.hide = 1;
            this.getList();
        },
        //获取下拉数据
        getList() {
            let self = this;
            self.formData.content = self.$refs.select.previousQuery;  // 获取搜索框值
            getUserList(self.formData).then(res => {
                if (self.hide == 1) {
                    if (res.data.data.list && res.data.data.list.length) {
                        let list1 = [];
                        self.options.map(res => {
                            list.push(res.adUserId);
                        })
                        res.data.data.list.map(item => {
                            if (list1.indexOf(item.adUserId) == -1) {
                                self.options.push(item);
                                list1.push(item.adUserId);
                            }
                        })
                    }
                } else if (self.hide == 2) {
                    self.options = res.data.data.list;
                } else if (self.hide == 3) {
                    self.options = res.data.data.list;
                }
            })
        },
        // 回车搜素事件
        enterClick() {
            this.formData.pageNum = 1;
            this.formData.pageSize = 20;
            this.hide = 3;
            this.getList();
        },
        // 清空事件
        clear() {
            this.hide = 2;
            this.formData.pageNum = 1;
            this.$refs.select.previousQuery = '';  // 搜索框值
            this.formData.content = '';  // 搜索框值
            this.getList();
        }
    }
}
</script>
<style>
.el-input_inner {
    height: 32px;
}
.el-input_icon {
    margin: 5px 0 0 0;
}
.el-select .el-input .el-select_caret.is-reverse {
    margin: -4px 0 0 0;
}
.el-input_inner {
    font-size: 12px;
}
.el-select-dropdown_item {
    font-size: 12px;
}
</style>
