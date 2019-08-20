<template>
  <div class="login" :style="{background: 'url(' + bg + ') repeat center /100% 100%' }">
<!--    <span class="visitor-mode" @click="goVisitorMode">随便看看></span>-->
    <h1>
      <img class="logo" src="@/assets/img/logo.png" alt="家长圈">
    </h1>
    <div class="form">
      <div class="form-detail" v-if='isMobileLogin===true'>
        <van-field class="custom-input" v-model="mobile" type='tel' @input.native="mobileChange" placeholder="请输入手机号码"/>

        <div class="vailcode">
          <div class="code-input">
            <van-field class="custom-input" type='tel' @input.native="mobileChange" placeholder="请输入6位验证码"
                       v-model="vailcode"/>
            <span class="btn-pwd-login" @click="isMobileLogin=!isMobileLogin">密码登录</span>
          </div>
          <div>
            <van-button class="btn-vailcode" v-if="!timer" type="info" :loading="codeBtnLoading"
                        loading-text="获取验证码" @click="getVailCode">获取验证码
            </van-button>
            <van-button class="btn-vailcode" v-else :disabled="disabled" type="info" @click="getVailCode">
              {{second}}秒后重新获取
            </van-button>
          </div>
        </div>
        <van-button class="btn-login" type="info" :loading="loginBtnLoading" loading-text="登录"
                    :disabled="loginDisabled" @click="login">登录
        </van-button>
      </div>
      <div class="form-detail" v-else>
        <van-field class="custom-input" @input.native="userChange" v-model.trim="username" clearable
                   placeholder="请输入手机号/用户名"/>
        <div class="vailcode">
          <div class="code-input">
            <van-field class="custom-input" @input.native="userChange" v-model="password" :type="eye?'text':'password'"
                       placeholder="请输入密码" :right-icon="eye?'eye':'closed-eye'" @click-right-icon="eye=!eye">
<!--              <div slot="right-icon">123</div>-->
            </van-field>
            <span class="btn-pwd-login" @click="isMobileLogin=!isMobileLogin">手机验证码登录</span>
            <span class="btn-reset-pwd" @click="$router.push(`/forgetPwd`)">忘记密码</span>
          </div>
        </div>
        <van-button class="btn-login" type="info" :loading="loginBtnLoading" loading-text="登录"
                    :disabled="loginDisabled2" @click="userLogin">登录
        </van-button>
      </div>
      <div class="form-footer fs10">
        <span>注册帮助</span>
        <span class="van-hairline--left" @click="$router.push(`/index`)">随便看看</span>
      </div>
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
  function isPoneAvailable (phoneNum) {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!reg.test(phoneNum)) {
      return false
    } else {
      return true
    }
  }

  // 正则密码
  function isPassword (pwd) {
    var reg = /^[a-zA-Z0-9_]{6,12}$/
    var result = reg.test(pwd)
    if (result == false) {
      return false
    }
    return true
  }

  export default {
    name: 'LoginIndex',
    data () {
      return {
        eye: false,
        inHeight: 0,
        loginBtnLoading: false,
        codeBtnLoading: false,
        bg: bg,
        mobile: '',
        vailcode: '',
        timer: null,
        second: 60,
        disabled: false,
        loginDisabled: true,
        isLanding: false,// 是否登录ing
        isMobileLogin: false,
        username: '',
        password: '',
        loginDisabled2: true,
        version: '',
      }
    },
    mounted () {
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
      update () {
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
      goVisitorMode () {
        this.$router.push('/index')
      },

      // 获取验证码
      getVailCode () {
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
            this.$toast('请稍后获取！')
          }
        })
      },

      // 手机登录模式输入框change
      mobileChange () {
        if (this.mobile && this.vailcode) {
          this.loginDisabled = false
        } else {
          this.loginDisabled = true
        }
      },

      // 手机登录
      login () {
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
            this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo)
            this.$store.commit('seThirdInfo', res.data[0].loginInfoVo.usrThirdPartyInfo)

             this.$store.commit('SET_LOGININFO',res.data[0].loginInfoVo.usrInfo);

            if (res.data[0].loginInfoVo.usrThirdPartyInfo.alreadyUpdateLoginName === 'A02') {
              this.$router.replace('/index')
            } else {
              this.$router.push({ name: 'settings', params: { accountNo: res.data[0].loginInfoVo.usrInfo.accountNo } })
            }
          } else {
            console.log(res.msg)
            this.$toast(res.msg)
          }
        })
      },

      // 手机/用户名登录模式输入框change
      userChange () {
        if (this.username && this.password) {
          this.loginDisabled2 = false
        } else {
          this.loginDisabled2 = true
        }
      },

      // 手机/用户名登录
      userLogin () {
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
          'roleType':'A02'
        }

        let params = {
          requestJson: JSON.stringify(json)
        }
        this.loginBtnLoading = true
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

            this.$router.replace('/index')

          } else {
            console.log(res.msg)
            this.$toast(res.msg)
          }
        })
      }
    },
  }
</script>
<style lang="less" scoped>
  @deep: ~'>>>';
  .login {
    height: 100vh;
    position: relative;
    .column;

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
      &-footer{
        color: #666;
        flex: 0 0 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        >span {
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
            margin-top: 0.44vh;
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
            color: @blue;
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

      @{deep} .van-divider--content-center:before, @{deep}.van-divider--content-left:before, @{deep}.van-divider--content-right:before {
        content: '';
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
