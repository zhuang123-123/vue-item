<template>
    <div class="log-container">
        <div class="log-content-one">
            <div class="content-one-container">
                <div class="content-one-right">
                    <div class="one-right-container">
                        <div class="one-right-title"></div>
                        <div class="one-right-input">
                            <input id="phone" type="text" v-model="para.userName" placeholder="请输入账号" name="phone" @keydown="deleteBlank">
                        </div>
                        <div class="one-right-input">
                            <input id="passWord" type="password" v-model="para.passWord" placeholder="请输入用户密码" @keydown="deleteBlank" @keyup.enter="loginIn" name="password" maxlength="18">
                        </div>
                        <div class="test-container">
                            <div class="btn-bg test-btn">
                                <span id="login" @click="handleSubmit">登录</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
import { mapActions } from 'vuex'
import { setToken, getToken } from '@/libs/util'
export default {
    components: {},
    data() {
        return {
            remember_me: 0,
            para: {
                userName: '',
                passWord: '',
            }
        }
    },
    methods: {
        ...mapActions([
            'handleLogin',
            'getUserInfo'
        ]),
        handleSubmit () {
            this.handleLogin({ userName: this.para.userName, passWord: this.para.passWord }).then(res => {
                this.router.push({ name: this.$config.homeName })
            })
        },
        loginIn(e) {
            if (e.keyCode == 13) {
                this.handleSubmit();
            }
        },
        deleteBlank(e) {
            if (e.keyCode == 32) {
                e.returnValue = false;
            }
        }
    },
    mounted() {}
}
</script>
