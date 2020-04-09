<template>
  <div class="statusPage">
    <van-sticky class="header">
      <van-nav-bar title="" left-arrow @click-left="$router.back()">
      </van-nav-bar>
    </van-sticky>
    <div class="content">
      <div class="status">
        <div class="status-img">
          <img v-if="type=='F01'" src="@/assets/img/class-icon-1.png" alt="">
          <img v-if="type=='F02'" src="@/assets/img/class-icon-2.png" alt="">
          <img v-if="type=='F03' || type=='F04'" src="@/assets/img/class-icon-3.png" alt="">
        </div>
        <div class="status-tips" v-if="type=='F01' || type=='F03' || type=='F04'">
          <h5>{{msg}}</h5>
        </div>
        <div class="status-tips" v-else>
          <h5>加入班级失败</h5>
          <p>{{msg}}</p>
        </div>
        <div class="adTips" v-if="type=='F03'">
          <p>P.S.</p>
          <p>1.请使用谷歌浏览器登录www.gaofenyun.com完成老师布置任务。</p>
          <p>2.家长如需了解更多孩子的使用情况和成绩，请扫码关注“全朗e家”公众号。</p>
          <div class="qrCode">
            <img src="@assets/img/iv_Parent circle.jpg" alt="">
          </div>
        </div>
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
      this.type = statusType.type;  //F01:二维码失效，F02:加入班级失败，F03:学生加入班级成功，F04：老师加入班级成功
      this.msg = statusType.msg;
    }
  }
</script>

<style scoped lang="less">
  .statusPage{
    display: flex;
    flex-direction: column;
    .content{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      /*overflow-y: scroll;*/
      .status {
        padding: 10px 0;
        &-img {
          width: 88px;
          height: 88px;
          margin: 0 auto;
          /*margin-top: 125px;*/

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

        .adTips{
          font-weight: bold;
          padding: 10px;
          .qrCode{
            width: 200px;
            height: 200px;
            border: 1px solid #666;
            margin: 5px auto;
            img{
              width: 100%;
            }
          }
        }
      }
    }

  }

</style>
