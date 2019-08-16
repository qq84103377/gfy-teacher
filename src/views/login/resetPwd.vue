<template>
    <section class="reset-pwd">
      <van-nav-bar
        left-arrow
        @click-left="$router.back()"
      />
      <div class="reset-pwd__body">
        <h1 class="fs24">重置密码</h1>
        <van-field class="custom-input" placeholder="请输入密码"
                   v-model="pwd1"/>
        <van-field class="custom-input" placeholder="请确认密码"
                   v-model="pwd2"/>
        <van-button @click="handleConfirm" class="confirm" type="info">确定</van-button>
      </div>
    </section>
</template>

<script>
    export default {
        name: "resetPwd",
      data() {
          return {
            pwd1: '',
            pwd2: '',
          }
      },
      methods: {
        handleConfirm() {
          if(this.pwd1 === this.pwd2) {

          }else {
            this.$toast('两次密码不一致,请重新输入')
          }
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
      }
      .confirm {
        margin-top: 46px;
        width: 100%;
        border-radius: 5px;
      }
    }
  }
</style>
