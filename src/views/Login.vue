<template>
    <div class="login">
        <h3>Login</h3>

        <!-- 登陆表单区域 -->
        <el-form :model="formInline" :rules="loginFormRules">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="formInline.user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="formInline.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item >
                <el-button type="primary" @click="handleSubmit">登陆</el-button>
                <el-button type="info">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                userCook: '',
                // 这是表单的验证规则
                loginFormRules: {
                    username: [
                        // trigger: 'blur' -> 失去焦点触发
                        { required: true, message: '请输入登陆名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入登陆密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                let userCook1 = this.formInline.user
                console.log(userCook1)
                this.getUserCook()
                console.log(this.userCook[userCook1])

                 if (this.userCook[userCook1] === this.formInline.password) {
                    alert('登录成功')
                    this.$router.push('/home')
                    return;
                } else {
                    alert('已新增，请重新登录')
                    Cookie.set(this.formInline.user, this.formInline.password)
                    this.formInline.user = '';  // 清空
                    this.formInline.password = ''; // 清空
                    return;
                }
            },
            getUserCook() {
               this.userCook = Cookie.get()
               console.log(this.userCook[this.formInline])
            }
        }
    }
</script>