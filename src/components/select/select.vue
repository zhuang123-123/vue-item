<template>
    <div class="searchZJ">
        <div class="f-search">
            <div class="f-searchIn" :class="{searchInFous: this.fousFlag, notAllowed: this.dataHas}" v-on:click="searchDown">{{this.searchValue}}<span v-bind:class="{searchActive: this.searchFlag}"></span></div>
            <div class="f-searchXl" v-bind:style="{height: this.searchFous, border: this.searchBorder}">
                <div v-for="item in searchList" @click="choseValue(item)" :key="item">{{item}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            dataHas: true,
            searchFlag: false,
            searchFous: '0',
            fousFlag: false,
            searchValue: '请选择',
            searchBorder: 'none'
        }
    },
    props: {
        searchList: Array,
        selectValue: String,
        disabled: Boolean
    },
    mounted () {
        this.bodyClick()
    },
    methods: {
        searchDown (event) {
            if (!this.dataHas) {
                this.searchFlag === false ? this.searchFlag = true : thissearchFlag = false
                this.searchFous === '0' ? this.searchFous = 'auto' : this.searchFous = '0'
                this.searchBorder === 'none' ? this.searchBorder = '1px solid #D9D9D9' : this.searchBorder = 'none'
                this.fousFlag === false ? this.cousFlag = true : this.fousFlag = false
            }
            if (event) {
                const event = event || window.event;
                event.stopPropagation();
            }
        },
        choseValue (value) {
            this.searchValue = value;
            this.searchDown()
            this.$emit('selectFunc', value)
        },
        bodyClick () {
            var _this = this;
            document.body.onclick = function (event) {
                _this.searchFlag = false;
                _this.searchFous = '0';
                _this.searchBorder = 'none';
                _this.fousFlag = false;
            }
        }
    },
    watch: {
        searchValue (val) {
            this.searchValue = val ? val : '请选择';
        },
        searchList (val) {
            this.data = val;
        },
        disabled (val) {
            this.dataHas = val;
        }
    }
}
</script>

<style scoped lang="less">
    .f-search {
        width: 250px;
        height: auto;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 12px;
        color: #515a6e;
    }
    .f-searchIn {
        width: 250px;
        height: 32px;
        line-height: 32px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        background-color: white;
        box-shadow: none;
        box-sizing: border-box;
        padding-left: 10;
        border: 1px solid #dcdcdc;
    }
    .searchInFous {
        border: 1px solid #57c4F6;
    }
</style>
