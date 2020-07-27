<template>
    <div>
      <i-table editable border :content="self" :columns="columns7" :data="data6" :span-method="handleSpan" @cell-click="cellMouseLeave"></i-table>

    <i-select clearable :model.sync="model9" style="width:200px"  @on-change="changeSelect">
        <i-option v-for="item in plList" :key="item.value" :value="item.value" :label="item.key">
            <span>{{item.key}}</span>
            <span style="float:right;color:#ccc">{{item.value}} </span>
        </i-option>
    </i-select>


    <Radio-group v-model="list">
        <Radio v-for="item in plList" :label="item.key" :key="item.key"> </Radio>
        
				
    </Radio-group>

    <input type="text" v-model="lests"> {{lests}}



     <!-- 登陆表单区域 -->
        <el-form :model="loginForm" :rules="loginFormRules">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item >
                <el-button type="primary">登陆</el-button>
                <el-button type="info">重置</el-button>
            </el-form-item>
        </el-form>





        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>


			<strong style="display:block;margin-bottom: 20px;">联系方式</strong>
				<el-input v-model="contactName" placeholder="请输入联系人姓名：" class="all"></el-input>
				<el-input v-model="address" placeholder="请输入公司地址：" class="all"></el-input>
				<el-input v-model="url" placeholder="请输入公司网址：" class="all"></el-input>
				<el-input v-model="email" placeholder="请输入联系人Email：" class="all"></el-input>
				<el-input v-model="officePhone" placeholder="请输入办公电话：" class="all"></el-input>
				<el-input v-model="contactPhone" placeholder="请输入联系人手机：" class="all">123</el-input>
				
				
				<el-button type="warning" class="btn" @click.native="sendInfo">确认提交</el-button>

        <ul>
          <li v-for="(item, index) in $route.meta" :key="index">
            {{item}}  
          </li>
        </ul>

        <div>
          <i-button @click="start">Start</i-button>
          <i-button @click="finish">Finish</i-button>
          <i-button @click="error">Error</i-button>
        </div>


        <!-- 步骤条 -->
        <div>
          <Steps :current="current" status="finish" direction="vertical">
            <Step title="已完成" content="这里是该步骤的描述信息"></Step>
            <Step title="进行中" content="这里是该步骤的描述信息"></Step>
            <Step title="待进行" content="这里是该步骤的描述信息"></Step>
            <Step title="待进行" content="这里是该步骤的描述信息"></Step>
        </Steps>
         <i-button type="primary" @click="next" :disabled="disables">下一步</i-button>
        </div>

        <!-- <button @click="sendToVuex">传到vuex</button> -->

        <div>
          <p @click="addd(obj)"> {{obj.d}}</p>
          <p @click="adde(obj)"> {{obj.e}}</p>
        </div>

        <!-- filter -->
        <div>
          {{message | capitalize('valTring') }}
        </div>

        <div>
          <el-input v-model="demo"></el-input>
          {{value}}
        </div>

        <div>
          <el-input v-model="demo2.name"></el-input>
          {{value2}}
        </div>

        <div>
            <input type="text" v-model="user_info.name">
        </div>

        <div>
          <h2>vue-clipboards</h2>
          <button class="tag-read" data-clipboard-text="复制我的内容" @click="copy">复制内容</button>
        </div>
		

    </div>
  </template>
<script>
	import axios from 'axios'
  import qs from 'qs'
  import Clipboard from 'clipboard'

import { setTimeout } from 'timers';
    export default {
        filters: {
            capitalize: function (value) {
              console.log(value)
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        data () {
            return {
              demo: '',
              user_info: {
                name: 'blue',
                age: 18
              },
              demo2: {
                name: ''
              },
              value2: '',
              value: '',
               a: 1,
               b: 2,
               c: 3,
               d: 4,
               e: {
                 f: {
                   g: 5
                 }
               },
                message: '',
                obj: {},
                current: 0,
                disables: false,

                contactName: "",
                address: "",
                url: "",
                email: "",
                officePhone: "",
                contactPhone: "",
				

                ruleForm: {
                  name: '',
                  region: '',
                  date1: '',
                  date2: '',
                  delivery: false,
                  type: [],
                  resource: '',
                  desc: ''
                },
                rules: {
                  name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                  ],
                  region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                  ],
                  date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                  ],
                  date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                  ],
                  type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                  ],
                  resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                  ],
                  desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                  ]
                },
                list: '北京',
                plList: [
                  {key: '上海', value: 'shanghai'},
                  {key: '北京', value: 'beijing'},
                  {key: '深圳', value: 'shenzhen'}
                ],
                model9: '',
                lests: 'wode',
                self: this,
                columns7: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                          // console.log(params)
                          return h('div', [
                            h(
                              'span',
                              {
                                style: {
                                  cursor: 'pointer',
                                  marginRight: '10px'
                                },
                                on: {
                                  click: () => {
                                    this.show(params.index)
                                  }
                                }
                              },
                              '编辑'
                            ),
                            h(
                              'span',
                              {
                                style: {
                                  cursor: 'pointer',
                                  color: '#2d8cf0'
                                },
                                on: {
                                  click: () => {
                                    console.log(params)
                                  }
                                }
                              },
                              '查看'
                            )
                          ])
                        }
                    }
                ],
                data6: [
                    {
                        name: '王小明',
                        age: 18,
                        merge: 2,
                        ms: 1,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '王小明',
                        age: 25,
                        merge: 2,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        merge: 3,
                        ms: 1,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '李小红',
                        age: 26,
                        merge: 3,
                        address: '深圳市南山区深南大道'
                    },
                    {
                        name: '王小明',
                        age: 18,
                        merge: 3,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '王小明',
                        age: 25,
                        merge: 2,
                        ms: 1,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        merge: 2,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '李小红',
                        age: 26,
                        merge: 1,
                        ms: 1,
                        address: '深圳市南山区深南大道'
                    }
                ],

                 // 这是登陆表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: ''
                },
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
          copy() {
            let clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
              console.log('复制成功')

              // 释放内存
              clipboard.destroy()
            })
            clipboard.on('error', e => {
              // 不支持复制
              console.log('该浏览器不支持自动复制')
              // 释放内存
              clipboard.destroy()
            })
          },
            // send() {
            //   let that = this;
            //   this.axios({
            //     method: 'get',  // 请求方式
            //     url: 'URL',  // 请求地址
            //     params: {
            //       id: this.$route.query.id  // 发送的参数
            //     }
            //   }).then(function (response) {
            //     //请求成功后获取到的内容进行哪些操作
            //     that.title = response.data.result[0].title
            //   })
            //   // 配置axios区分线上和测试环境
            //   if (location.hostname === 'localhost') {
            //     axios.defaults.baseURL = process.env.API_PATH_TEST;
            //     // 配置本地webSocketIO地址
            //     Vue.use(new VueSocketID({
            //       debug: false,
            //       connection: 'localhost',
            //     }))
            //   } else if (location.hostname === 'www.dangyunlong.com') {
            //     // 配置线上webSocketIO地址
            //     Vue.use(new VueSocketID({
            //       debug: false,
            //       connection: 'www.dangyunlong.com',
            //     }))
            //     axios.defaults.baseURL = process.env.API_PATH_PROD
            //   }
            // },

            sendInfo : function () {
              axios.post("http://124.70.201.131:8080/aboutus/addCompanyInformation", qs.stringify({
                contactName : this.contactName,
                address : this.address,
                url : this.url,
                email : this.email,
                officePhone : this.officePhone,
                contactPhone : this.contactPhone,
              })
              // , 
              // {
              // 	headers: {
              // 		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
              // 	}
              // }
              ).then(res => {
                console.log(res)
              })
              
            },
        //   preStyle(row) {
        //     console.log(row)
        //   },
            show (index) {
              console.log(index)
                this.$Modal.info({
                    title: '用户信息',
                    content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            handleSpan ({ row, columnIndex}) {
                console.log
                if ((columnIndex === 0) && row.merge && row.ms) {
                  return {
                    rowspan: row.merge,
                    colspan: 1
                  }
                } else if (columnIndex === 0 && row.merge) {
                  return {
                    rowspan: 0,
                    colspan: 0
                  }
                }
            },
            changeSelect(val) {
              console.log(val)
              this.list = (val === 'beijing') ? '北京' : (val === 'shanghai') ? '上海' : '深圳'
              // if (val === 'beijing') {
              //   this.checks = '0'
              // } else if (val === 'shanghai') {
              //   this.checks = '1'
              // } else {
              //   this.checks = '2'
              // }
              
            },
            submitForm(formName) {
              // console.log(formName)
              console.log(this.$refs[formName].validate())
              this.$refs[formName].validate((valid) => {
                console.log(valid)
                if (valid) {
                  alert('submit!');
                } else {
                  console.log('error submit!!');
                  return true;
                }
              });
            },
            resetForm(formName) {
              this.$refs[formName].resetFields();
			},
			cellMouseLeave (row, column, cell, event) {
				console.log(row, column, cell, event)
			},
			preStyle() {
        console.log(this.$route)
				console.log(this.$('.ivu-table-tbody tr'))
				this.$('.ivu-table-tbody tr td').css('backgroundColor', '#fff')
      },
      start (val) {
        console.log(val)
        this.$Loading.start();
      },
      finish (val) {
        console.log(val)
        this.$Loading.finish();
      },
      error (val) {
        console.log(val)
        this.$Loading.error();
      },

      next(val) {
        console.log(val)
        console.log(this.current)
        if (this.current === 2) {
          this.current = 3
          console.log(this.current)
          this.disables = true
          console.log('已完成')
        } else {
          this.current += 1
        }
      },
      // sendToVuex () {
      //   this.$store.dispatch(sendToMutation, {name: 'guoshi'})
      // }
      addd(item) {
        item.d = item.d + 1;
        console.log('item--', item)
      },
      adde(item) {
        item.e = item.e + 1;
        console.log('item--', item)
      }
		},
		mounted() {
      this.preStyle()
      console.log(this.$route.params)
      this.obj = {d: 0};
      this.obj.e = 0;
      this.$set(this.obj, 'f', 0)
      console.log('after--', this.obj)
    },
    watch: {  // 检测Vue实例上的数据变动
      a: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // 方法名
      b: 'someMethod',
      // 该回调会在任何被侦听的对象的property改变的时候被调用，不论其被嵌套多深
      c: {
        handler: function (val, oldVal) { /* ... */},
        deep: true
      },
      // 该回调将会在侦听开始之后被立即调用
      d: {
        handler: 'someMethod',
        immediate: true
      },
      // 你可以传入回调数组， 他们会被逐一调用
      e: [
        'handle1',
        function handle2 (val, oldVal) { /* ... */},
        {
          handler: function handle3 (val, oldVal) { /* ... */},
          /* ... */
        }
      ],
      // watch vm.e.f`s value: {g: 5 }
      'e.f': function (val, oldVal) {/* ... */},
      demo() {
        this.value = this.demo
      },
      newName(val) {
        this.value2 = val;
      },
      // a(newVal, oldVal) {
      //   setTimeout(() => {
      //     if (newVal.length < 3) {
      //       this.msg = '密码太短'
      //       return;
      //     }
      //     if (newVal.length > 5) {
      //       this.msg = '密码太长';
      //       return ;
      //     }
      //     this.msg = ''
      //   }, 1000)
      // }
      'user_info.name': function (val) {
        console.log(val)
        console.log('name变了')
      }
    },
    computed: {
      newName() {
        return this.demo2.name
      }
    },
    beforeCreate(){
      // 在实例初始化之后，数据观测(data.observe)和event/watcher 事件配置之前被调用
    },
    created(){
      //在实例创建完成后被立即调用
    },
    beforeMount() {
      // 在挂载开始之前被调用
    },
    mounted(){
      // 实例被挂在之后开始调用
      this.$nextTick(function () {
        // Code that will run only after the entire view has been rendered
      })
    },
    beforeUpdate() {
      // 数据更新时候调用，发生在虚拟DOM打补丁之前
    },
    updated (){
      // 由于数据更改导致的虚拟DOM重新渲染和补丁，在这之后会调用该钩子函数
      this.$nextTick(function () {
        // Code that will run only after the entire view has been re-rendered
      })
    },
    activated() {
      // 被keep-alive缓存的组件激活时调用
    },
    deactivated() {
      // 被keep-alive缓存的组件停用时候调用
    },
    beforeDestroy() {
      // 实例销毁之前调用， 这一步实例仍然可以完全调用
    },
    errorCaptured() {
      // 三个参数: 错误对象、发生错误的组件实例、以及一个包含错误来源信息的字符串
    }
  }
</script>

