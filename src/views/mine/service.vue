<template>
  <section class="service">
    <div class="service-header">
      <img src="@assets/img/myself-icon-33.png" alt="">
    </div>
    <div class="service-body">
      <p>教研员：{{instructorInfo.name}}</p>
      <p>联系电话：{{instructorInfo.contactNumber}}</p>
    </div>

    <div class="service-footer">
      <p>全朗高分云为您服务</p>
      <van-button @click="showDialog=true" type="info">拨打</van-button>
    </div>
    <a :href="`tel:${instructorInfo.contactNumber}`" ref="telBox" v-show="false"></a>
    <van-dialog v-model="showDialog" :message='`${instructorInfo.contactNumber}`' show-cancel-button confirm-button-text='呼叫' confirm-button-color='#39F0DD' @cancel='cancel' @confirm='confirm'>
    </van-dialog>
  </section>
</template>

<script>
  import {getMySchoolInfo} from '@/api/mine';

  export default {
    name: "service",
    data() {
      return {
        instructorInfo: {
          name: '--',
          contactNumber: '--'
        },
        showDialog:false,
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.showDialog) {
        this.showDialog = false
        next(false)
      } else{
      next();
      }
    },
    methods: {
      cancel(){
        this.showDialog=false
      },
      confirm(){
        this.showDialog=true
        try{MobclickAgent.onEvent('mineSettingCall')}catch(e){console.log(e)}
        this.$refs["telBox"].click();
      },
      handelClick() {
        // this.$dialog.confirm({
        //   message: this.instructorInfo.contactNumber,
        //   confirmButtonText: '呼叫',
        //   confirmButtonColor: '#39F0DD'
        // }).then(() => {
        //   // on confirm
        //   console.log('呼叫电话');
        //   this.$refs["telBox"].click();
        //   // if ("cordova" in window) {
        //   //   console.log('试试aapp呼叫电话')
        //   //
        //   //   this.$refs["telBox"].click();
        //   //   /* window.plugins.CallNumber.callNumber(
        //   //      function onSuccess(result) {
        //   //        console.log("Success:call number" + result);
        //   //      },
        //   //      function onError(result) {
        //   //        console.log("Error:call number" + result);
        //   //      },
        //   //      "18589082142", true);*/
        //   //
        //   // } else {
        //   //   this.$refs["telBox"].click();
        //   // }
        // }).catch(() => {
        //   // on cancel
        // });
      },
      //获取学校信息
      getMySchoolInfo() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          userType: this.$store.getters.getUserInfo.roleType,
          accountNo: this.$store.getters.getUserInfo.accountNo
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getMySchoolInfo(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if (res.flag && res.data.length > 0) {
            let mySchoolInfo = res.data[0].mySchoolInfo;
            if (mySchoolInfo && mySchoolInfo.length > 0) {
              this.instructorInfo = {
                name: mySchoolInfo[0].instructorInfo.name,
                contactNumber: mySchoolInfo[0].instructorInfo.userContactInfo[0].contactNumber
              }
            }
          }
        })
      },
    },
    mounted() {
      try{MobclickAgent.onEvent('clickMineService')}catch(e){console.log(e)}
      this.getMySchoolInfo();
    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .service {
    background-color: #F5F6FA;

    @{deep} .van-dialog__message {
    font-size: 16px;
  }

    &-header {
      width: 138px;
      height: 138px;
      margin: 50px auto;
      border: 1px solid #39F0DD;
      border-radius: 50%;
      .column-center;

      img {
        display: block;
        width: 107px;
        height: 107px;
        border-radius: 50%;
      }
    }

    &-body {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #000000;

      p {
        margin-bottom: 10px;
      }
    }

    &-footer {
      text-align: center;
      margin-top: 160px;

      p {
        margin-bottom: 10px;
        font-weight: 500;
      }

      @{deep} .van-button {
        width: 163px;
        border-radius: 40px;
        font-size: 15px;
      }
    }
  }

</style>
