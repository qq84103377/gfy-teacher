<template>
    <section class="forget-pwd">
      <van-nav-bar
        left-arrow
        @click-left="$router.back()"
      />
      <div class="forget-pwd__body">
        <h1 class="fs24">个人信息</h1>

        <van-field class="custom-input" placeholder="请输入账户名"
                   v-model="userName"/>
        <van-field class="custom-input" type="tel" placeholder="请输入手机号码"
                   v-model="tel"/>
        <div class="aic">
          <van-field class="custom-input vailcode-input" type='tel' placeholder="请输入6位验证码"
                     v-model="vailcode"/>
          <div>
            <van-button class="btn-vailcode" v-if="!timer" type="info" :loading="codeBtnLoading"
                        loading-text="获取验证码" @click="getVailCode">获取验证码
            </van-button>
            <van-button class="btn-vailcode" v-else :disabled="disabled" type="info" @click="getVailCode">
              {{second}}秒后重新获取
            </van-button>
          </div>
        </div>
        <van-button @click="$router.push(`/resetPwd`)" type="info" class="next">下一步</van-button>
      </div>
    </section>
</template>

<script>
  import { getVailCode, doMobileLogin, doUserLogin } from '@/api/login'
  export default {
        name: "forgetPwd",
      data() {
          return {
            userName: '',
            tel: '',
            vailcode: '',
            codeBtnLoading: false,
            timer: null,
            disabled: false,
            second: 60,
          }
      },
      methods: {
        // 获取验证码
        getVailCode () {
          if (this.timer) return
          if (!this.tel) {
            this.$toast('请输入手机号!')
            return
          }
          if (!isPoneAvailable(this.tel)) {
            this.$toast('请输入合法手机号!')
            return
          }
          this.codeBtnLoading = true
          let params = {
            phoneNo: this.tel
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
      }
    }
</script>

<style lang="less" scoped>
  .forget-pwd {
    display: flex;
    flex-direction: column;
    &__body {
      flex: 1;
      padding: 10px 23px;
      h1 {
        margin-left: -10px;
        margin-bottom: 40px;
      }
      .custom-input{
        margin-bottom: 20px;
      }
      .vailcode-input {
        margin-bottom: 0;
        margin-right: 10px;
      }
      .btn-vailcode{
        height: 36px;
        line-height: 36px;
        width: 105px;
      }
      .aic {
        align-items: flex-end;
      }
      .next {
        margin-top: 66px;
        width: 100%;
        border-radius: 5px;

      }
    }
  }
</style>
