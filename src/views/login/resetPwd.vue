<template>
    <section class="reset-pwd">
      <van-nav-bar
        left-arrow
        @click-left="$router.back()"
      />
      <div class="reset-pwd__body">
        <h1 class="fs24">重置密码</h1>
        <van-field class="custom-input" :border="false" placeholder="请输入密码" :type="showPwd1?'text':'password'" :right-icon="showPwd1?'eye-o':'closed-eye'"
                   @click-right-icon="showPwd1=!showPwd1" v-model="pwd1"/>
        <van-field class="custom-input" :border="false" placeholder="请确认密码" :type="showPwd2?'text':'password'" :right-icon="showPwd2?'eye-o':'closed-eye'"
                  @click-right-icon="showPwd2=!showPwd2" v-model="pwd2"/>
        <van-button @click="handleConfirm" class="confirm" type="info">确定</van-button>
      </div>
    </section>
</template>

<script>
  import { findUserPassWd } from '@/api/login'
  import { hex_md5 } from '@/utils/md5'


  export default {
        name: "resetPwd",
      data() {
          return {
            pwd1: '',
            pwd2: '',
            showPwd1: false,
            showPwd2: false,
          }
      },
      methods: {
        handleConfirm() {
          if(this.pwd1 === this.pwd2) {

          }else {
           return this.$toast('两次密码不一致,请重新输入')
          }

          let params ={
            operate: 'modifyPassword',
            interUser: 'runLfb',
            interPwd: '25d55ad283aa400af464c76d713c07ad',
            loginName: this.$route.query.loginName,
            phoneNo: this.$route.query.phoneNo,
            validateCode: this.$route.query.validateCode,
            newPasswordNo: hex_md5(this.pwd2)
          }
          findUserPassWd(params).then(res=>{
            if (res.flag){
              const toast =  this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '设置成功，3 秒后去登录'
              });
              let second = 3;
              const timer = setInterval(() => {
                second--;
                if (second) {
                  toast.message = `设置成功，${second} 秒后去登录`;
                } else {
                  this.$toast.clear();
                  clearInterval(timer);
                  this.$router.replace(`login`);                }
              }, 1000);
            } else {
              this.$toast(res.msg);
            }
          })
        }

      }
    }
</script>

<style lang="less" scoped>
  .reset-pwd {
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
        &:after {
          left: 0;
        }
      }
      .confirm {
        margin-top: 46px;
        width: 100%;
        border-radius: 5px;
      }
    }
  }
</style>
