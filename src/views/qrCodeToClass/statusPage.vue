<template>
  <div>
    <van-sticky>
      <van-nav-bar title="" left-arrow @click-left="$router.back()">
      </van-nav-bar>
    </van-sticky>
    <div class="failed">
      <div class="failed-img">
        <img v-if="type=='F01'" src="@/assets/img/class-icon-1.png" alt="">
        <img v-if="type=='F02'" src="@/assets/img/class-icon-2.png" alt="">
        <img v-if="type=='F03'" src="@/assets/img/class-icon-3.png" alt="">
      </div>
      <div class="failed-tips" v-if="type=='F01' || type=='F03'">
        <h5>{{msg}}</h5>
      </div>
      <div class="failed-tips" v-else>
        <h5>加入班级失败</h5>
        <p>{{msg}}</p>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "failedPage",
    data() {
      return {
        type:'',
        msg:''
      }
    },
    methods: {},
    mounted() {
      let statusType = JSON.parse(window.localStorage.getItem('statusType'));
      this.type = statusType.type;
      this.msg = statusType.msg;
    }
  }
</script>

<style scoped lang="less">
  .failed {
    &-img {
      width: 88px;
      height: 88px;
      margin: 0 auto;
      margin-top: 140px;

      img {
        width: 100%;
      }
    }

    &-tips {
      text-align: center;

      h5 {
        font-size: 24px;
        color: #000;
        margin-top: 25px;
        margin-bottom: 18px;
      }

      p {
        font-size: 14px;
        color: #999;
      }
    }
  }
</style>
