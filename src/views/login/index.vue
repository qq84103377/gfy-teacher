<template>
  <div class="login">
    <div class="login-box" v-if='!isChoose' :style="{background: 'url(' + bg + ') repeat center /100% 100%' }">
      <!--    <span class="visitor-mode" @click="goVisitorMode">随便看看></span>-->
      <h1>
        <img class="logo" src="@/assets/img/logo.png" alt="高分云教师app">
      </h1>
      <div class="form">
        <div class="form-detail" v-if='isMobileLogin===true'>
          <van-field class="custom-input" v-model="mobile" type='tel' @input.native="mobileChange" placeholder="请输入手机号码" />

          <div class="vailcode">
            <div class="code-input">
              <van-field class="custom-input" type='tel' @input.native="mobileChange" placeholder="请输入6位验证码" v-model="vailcode" />
              <span class="btn-pwd-login" @click="isMobileLogin=!isMobileLogin">密码登录</span>
            </div>
            <div>
              <van-button class="btn-vailcode" v-if="!timer" type="info" :loading="codeBtnLoading" loading-text="获取验证码" @click="getVailCode">获取验证码
              </van-button>
              <van-button class="btn-vailcode" v-else :disabled="disabled" type="info" @click="getVailCode">
                {{second}}秒后重新获取
              </van-button>
            </div>
          </div>
          <van-button class="btn-login" type="info" :loading="loginBtnLoading" loading-text="登录" :disabled="loginDisabled" @click="login">登录
          </van-button>
          <span class="service-text">注册表示同意相关《<i @click="$router.push('/serviceSheet')">用户协议</i>》和《<i @click="$router.push('/privateSheet')">隐私政策</i>》</span>
        </div>
        <div class="form-detail" v-else>
          <van-field class="custom-input" @input.native="userChange(1)" v-model.trim="username" clearable placeholder="请输入用户名" />
          <div class="vailcode">
            <div class="code-input">
              <van-field class="custom-input" @input.native="userChange(0)" v-model="password" :type="eye?'text':'password'" placeholder="请输入密码" :right-icon="eye?'eye':'closed-eye'" @click-right-icon="eye=!eye">
                <!--              <div slot="right-icon">123</div>-->
              </van-field>
              <span class="btn-pwd-login" @click="isMobileLogin=!isMobileLogin">手机验证码登录</span>
              <span class="btn-reset-pwd" @click="$router.push(`/forgetPwd`)">忘记密码</span>
            </div>
          </div>
          <van-button class="btn-login" type="info" :loading="loginBtnLoading" loading-text="登录" :disabled="loginDisabled2" @click="userLogin">登录
          </van-button>
          <span class="service-text">注册表示同意相关《<i @click="$router.push('/serviceSheet')">用户协议</i>》和《<i @click="$router.push('/privateSheet')">隐私政策</i>》</span>
        </div>
        <div class="form-footer fs10">
          <span @click="$toast.fail('敬请期待')">注册帮助</span>
          <span class="van-hairline--left" @click="$toast.fail('敬请期待')">随便看看</span>
          <span class="van-hairline--left grey9">版本号V{{version}}</span>
        </div>
        <div class="fs10" v-if="!isApp" style="text-align: center">
          <!-- <p>Copyright<img src="../../assets/img/c.png" alt="">2017 高分云版权所有 </p> -->
          <p>Copyright© 2017 高分云版权所有 </p>
          <p>广州高分云教育科技有限公司 <a href="http://www.beian.miit.gov.cn">粤ICP备17113230号</a></p>
        </div>
      </div>
    </div>

    <div class="choose-box" v-else>
      <van-nav-bar title="登录" left-arrow @click-left="isChoose=!isChoose" />
      <div class="bd">
        <p class="tips">您的手机号码关联以下账号,请选择其中一个账号使用手机登录</p>

        <van-radio-group class="group" v-model="radio">
          <van-cell-group>
            <van-cell v-for="item in accountList" :key="item.accountNo" :title="item.loginName" clickable :icon="item.iconUrl?item.iconUrl:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201909/20190912043018_aZGfS_Default-Avatar-blue.png'" @click="radio = item.accountNo">
              <van-radio slot="right-icon" :name='item.accountNo' />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button class="btn-save custom-btn" type="info" @click.native="complete">确定</van-button>
    </div>

  </div>
</template>



<script>
import bg from '@/assets/img/login_background.png'
import { hex_md5 } from '@/utils/md5'
// import { checkUpgrade } from "@/utils/upgrade"
import { getVailCode, doMobileLogin, doUserLogin } from '@/api/login'

import axios from 'axios'

// 正则手机号
function isPoneAvailable(phoneNum) {
  var reg = /^[1][3-9][0-9]{9}$/
  if (!reg.test(phoneNum)) {
    return false
  } else {
    return true
  }
}

// 正则密码
function isPassword(pwd) {
  var reg = /^[a-zA-Z0-9_]{6,12}$/
  var result = reg.test(pwd)
  if (result == false) {
    return false
  }
  return true
}

export default {
  name: 'LoginIndex',
  data() {
    return {
      eye: false,
      inHeight: 0,
      loginBtnLoading: false,
      codeBtnLoading: false,
      bg: bg,
      mobile: '',
      vailcode: '',
      timer: null,
      second: 180,
      disabled: false,
      loginDisabled: true,
      isLanding: false,// 是否登录ing
      isMobileLogin: false,
      username: '',
      password: '',
      loginDisabled2: true,
      version: '',
      isChoose: false,
      accountList: [],
      radio: '',
    }
  },
  computed: {
    isApp() {
      return "cordova" in window;
    },
  },
  created() {
    if (localStorage.loginInfo) {
      const loginInfo = JSON.parse(localStorage.loginInfo)
      this.username = loginInfo.userName
      this.password = loginInfo.pwd
      this.loginDisabled2 = false
    }
  },
  mounted() {
    // chcp.getVersionInfo((err, data) => {
    //   this.version = data
    //   alert(JSON.stringify(data))
    //
    //   console.log('当前应用时间版本： ' + data.currentWebVersion);
    //
    //   console.log('当前应用version name: ' + data.appVersion);
    //
    // });
    var _this = this
    document.addEventListener('deviceready', function () {
      cordova.getAppVersion.getVersionNumber().then(function (version) {
        console.log(version)
        // 版本号获取
        _this.version = version
      })
      var platform = device.platform
      // checkUpgrade(platform, '',_this);
    }, false)
  },
  methods: {
    update() {
      chcp.fetchUpdate(function (error, data) {
        if (!error) {
          alert('需要更新')
          chcp.installUpdate(function (error) {
            alert('更新完成')
          })
        } else {
          alert('你当前是最新版本')
        }
      })
    },
    // 游客方式跳转首页
    goVisitorMode() {
      this.$router.push('/index')
    },

    // 获取验证码
    getVailCode() {
      if (this.timer) return
      if (!this.mobile) {
        this.$toast('请输入手机号!')
        return
      }
      if (!isPoneAvailable(this.mobile)) {
        this.$toast('请输入合法手机号!')
        return
      }
      this.codeBtnLoading = true
      let params = {
        phoneNo: this.mobile
      }
      getVailCode(params).then(res => {
        this.codeBtnLoading = false
        console.log(res)
        if (res.flag === true) {
          this.$toast('请查收验证码！')
          this.disabled = true
          if (!this.timer) {
            this.timer = setInterval(() => {
              if (this.second > 0 && this.second <= 180) {
                this.second--
              } else {
                clearInterval(this.timer)
                this.second = 180
                this.timer = null
                this.disabled = false
              }
            }, 1000)
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },

    // 手机登录模式输入框change
    mobileChange() {
      if (this.mobile && this.vailcode) {
        this.loginDisabled = false
      } else {
        this.loginDisabled = true
      }
    },

    // 手机登录
    login() {
      if (!this.mobile) {
        this.$toast('请输入手机号!')
        return
      }
      if (!isPoneAvailable(this.mobile)) {
        this.$toast('请输入合法手机号!')
        return
      }
      if (!this.vailcode) {
        this.$toast('请输入验证码!')
        return
      }

      let json = {
        'interUser': 'runLfb',
        'interPwd': '25d55ad283aa400af464c76d713c07ad',
        'phoneNo': this.mobile,
        'sysType': 'S03',
        'validateCode': this.vailcode,
        'roleType': 'A02'
      }

      let params = {
        requestJson: JSON.stringify(json),
      }
      this.loginBtnLoading = true
      doMobileLogin(params).then(res => {
        this.loginBtnLoading = false
        console.log(res)
        if (res.flag) {
          if (res.code == '10112') {
            this.isChoose = true
            this.accountList = res.data
            return
          }


          this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo)
          localStorage.setItem("isLogin", true);
          localStorage.setItem("loginInfo", JSON.stringify({ userName: this.username, pwd: this.password }));
          this.$router.replace('/index')

        } else {
          console.log(res.msg)
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.loginBtnLoading = false
      })
    },

    // 手机/用户名登录模式输入框change
    userChange(type) {
      if (type && localStorage.loginInfo) {
        //修改用户名输入框
        this.password = ''
        localStorage.removeItem('loginInfo')
      }
      if (this.username && this.password) {
        this.loginDisabled2 = false
      } else {
        this.loginDisabled2 = true
      }
    },

    // 手机/用户名登录
    userLogin() {
      if (this.password.length < 6 || this.password.length > 16) {
        this.$toast('密码长度在6~16位！')
        return
      }

      let json = {
        'interUser': 'runLfb',
        'interPwd': '25d55ad283aa400af464c76d713c07ad',
        'phoneNoOrName': this.username,
        'sysType': 'S03',
        'passwordNo': hex_md5(this.password),
        'roleType': 'A02'
      }

      let params = {
        requestJson: JSON.stringify(json)
      }
      this.loginBtnLoading = true
      try{MobclickAgent.onEvent('login')}catch(e){}
      doUserLogin(params).then(res => {
        this.loginBtnLoading = false
        console.log(res)
        if (res.flag) {
          console.log(res.data[0].loginInfoVo.usrInfo.roleType);
          if (res.data[0].loginInfoVo.usrInfo.roleType != 'A02') {
            this.$toast("请输入老师账号");
            return;
          }
          this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo)
          localStorage.setItem("isLogin", true);
          localStorage.setItem("loginInfo", JSON.stringify({ userName: this.username, pwd: this.password }));
          this.$router.replace('/index')

        } else {
          console.log(res.msg)
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.loginBtnLoading = false
      })
    },

    //选择账户 确定
    complete() {
      if (!this.radio) {
        this.$toast.fail("请选择其中一个账号使用手机登录")
        return
      }
      this.choose(this.radio, false)
    },

    //选择账户
    choose(oldAccountNo, isNeedCreate) {
      this.$store.commit('setVanLoading', true)
      let json = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        phoneNo: this.mobile,
        sysType: 'S03',
        validateCode: this.vailcode,
        roleType: 'A02',
        oldAccountNo,
        isNeedCreate
      }

      let params = {
        requestJson: JSON.stringify(json),
      }

      this.loginBtnLoading = true
      doMobileLogin(params).then(res => {
        this.loginBtnLoading = false
        console.log(res)
        if (res.flag) {

          this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo)
          localStorage.setItem("isLogin", true);
          localStorage.setItem("loginInfo", JSON.stringify({ userName: this.username, pwd: this.password }));
          this.$router.replace('/index')

          // if (res.data[0].loginInfoVo.usrThirdPartyInfo.alreadyUpdateLoginName === 'A02') {
          //   localStorage.setItem("isLogin", true);
          //   this.$router.replace('/index')
          // }
        } else {
          console.log(res.msg)
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.loginBtnLoading = false
      })

    },
  },
}
</script>
<style lang="less" scoped>
@deep: ~">>>";
.login {
  height: 100vh;
  // position: relative;
  .login-box {
    height: 100vh;
    position: relative;
    .column;
  }
  .choose-box {
    height: 100vh;
    position: relative;
    background-color: #f5f5f5;
    .add-account {
      padding-top: 0;
      padding-bottom: 0;
      height: 60px;
      @{deep} .van-cell__left-icon {
        height: 100%;
        &::before {
          width: 0px;
          height: 0px;
          margin: auto;
          position: absolute;
          top: 50%;
          margin-top: -12px;
          transform: translateY(50%);
          content: "\F000";
        }
      }
      @{deep} .van-cell__right-icon {
        height: 100%;
        &::before {
          width: 0px;
          height: 0px;
          margin: auto;
          position: absolute;
          top: 50%;
          margin-top: -12px;
          transform: translateY(50%);
          content: "\F00A";
        }
      }
    }
    .bd {
      padding-top: 15px;
      // background-color: #f5f5f5;
      padding-bottom: 60px;
      .tips {
        margin: 0 10px 15px;
        font-weight: bold;
      }
      .group {
        @{deep} .van-cell__left-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
      }
      @{deep} .van-icon__image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      @{deep} .van-cell__title {
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
      }
    }
    .btn-save {
      margin-left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 94%;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      background-color: #39f0dd;
      position: fixed;
      bottom: 15px;
      left: 0;
    }
  }

  .loading-box {
    height: calc(100% - 50px);
    position: fixed;
    flex: 1;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    // background: rgba(255, 255, 255, .9);
    .inline-loading {
      margin-top: -100px;
      width: 25%;
      background: #333;
      padding: 20px 0;
    }
  }

  .visitor-mode {
    position: absolute;
    right: 13px;
    top: 11px;
    color: #c7ebff;
    font-size: 12px;
  }

  h1 {
    // height: 163px;
    height: 22.44vh;
    .center;

    .logo {
      width: 120px;
      // margin-top: 40px;
      // margin-top: 6vh;
    }
  }

  .form {
    flex: 1;
    width: 352px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    margin-left: 50%;
    transform: translateX(-50%);
    padding: 25px;
    display: flex;
    flex-direction: column;
    &-footer {
      color: #666;
      flex: 0 0 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      > span {
        padding: 0 10px;
      }
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      line-height: 25px;

      p {
        font-size: 12px;
        font-weight: normal;
        color: #999;
      }
    }

    .form-detail {
      flex: 1;
      // margin-top: 30px;
      margin-top: 4.5vh;
      @{deep} .van-cell:not(:last-child)::after {
        left: 0;
      }
      .vailcode {
        display: flex;
      }

      .code-input {
        flex: 1;
        margin-top: 32px;
        // margin-top: 4.79vh;

        span {
          color: @blue;
          font-size: 14px;
        }

        .btn-pwd-login {
          font-weight: normal;
        }

        .btn-reset-pwd {
          float: right;
          // margin-top: 3px;
          /*margin-top: 0.44vh;*/
        }
      }

      .btn-vailcode {
        float: right;
        margin-top: 26px;
        // margin-top: 3.9vh;
        margin-left: 10px;
        width: 125px;
        height: 36px;
        font-size: 14px;
        padding: 0;
        line-height: 36px;
      }

      .btn-login {
        width: 304px;
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        // margin-top: 45px;
        margin-top: 6.75vh;

      }


      .service-text {
        color: #999;
        font-size: 12px;

        i {
          color: #39f0dd;
        }
      }
    }
  }

  .footer {
    // padding-top: 45px;
    padding-top: 5vh;
    flex: 1;
    .column-center;

    @{deep}.van-divider {
      width: 100%;
    }

    @{deep} .van-divider--content-center:before,
    @{deep}.van-divider--content-left:before,
    @{deep}.van-divider--content-right:before {
      content: "";
    }

    .third-party {
      // margin-top: 40px;
      margin-top: 20px;
      /*height: 100%;*/
      .center;

      img {
        width: 56px;
        margin-left: 32px;
        margin-right: 32px;
      }
    }
  }
}
</style>
