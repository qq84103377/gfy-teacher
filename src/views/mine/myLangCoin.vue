<template>
  <section class="coin-wrap">
    <div class="coin-wrap-total">
      <h3>{{langCoin}}</h3>
      <div @click="showTips = true">如何赚取朗币？</div>
    </div>
    <div class="coin-wrap-detail">
      <div class="coin-wrap-detail_title">
        <h4>郎币明细</h4>
        <div class="line"></div>
      </div>
      <div class="coin-wrap-detail_body">
        <div>
          <div class="item">
            <div>{{coinDetail.O01}}</div>
            <span>登录</span>
          </div>
          <div class="item">
            <div>{{coinDetail.O11}}</div>
            <span>创建资源</span>
          </div>
          <div class="item">
            <div>{{coinDetail.O12}}</div>
            <span>资源被使用</span>
          </div>
        </div>
        <div>
          <div class="item">
            <div>{{coinDetail.O08}}</div>
            <span>共享资源</span>
          </div>
          <div class="item">
            <div>{{coinDetail.O10}}</div>
            <span>资源收藏</span>
          </div>
          <div class="item">
            <div>{{pubInfo}}</div>
            <span>收藏</span>
          </div>
        </div>

      </div>
    </div>
    <div class="coin-wrap-source">
      <div class="coin-wrap-source_title">
        <h4>郎币来源</h4>
        <div class="line"></div>
      </div>
      <div class="coin-wrap-source_body">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="item" v-for="(value, name) in sourceList">
            <div class="item-title">{{name }}{{ value.weekDay}}</div>
            <van-cell-group>
              <van-cell v-for="item in value.detailList" :title="item.originName" :value="'+'+item.counterValue"/>
            </van-cell-group>
          </div>
        </van-list>

      </div>
    </div>
    <van-popup v-model="showTips" :round="true">
      <div class="title">
        <h4>如何获取郎币?</h4>
        <span @click="showTips = false">×</span>
      </div>
      <div class="content">
        <p>1、通过登录，每天的首次登录可以获得3个积分</p>
        <p>2、通过创建课程，每个课件获得3个积分</p>
        <p>3、通过创建任务，每个课程任务获得2个积分</p>
        <p>4、通过他人使用您的资源，可以获得2个积分</p>
        <p>5、获得的积分系统自动转换为朗币，10个积分可以转为一个朗币</p>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import {getUserCounterDetailGroupByDay, getMyCoinInfo} from '@/api/mine';

  export default {
    name: "myLangCoin",
    data() {
      return {
        loading: false,
        finished: false,
        sourceList: {},
        currentPage: 0,
        pageSize: 10,
        total: 1,
        langCoin: 0,
        showTips: false,
        pubInfo: 0,
        coinDetail:{
          O01:0,    //登录
          O08:0,    //资源共享
          O10:0,    //资源收藏
          O11:0,    //资源创建
          O12:0,    //资源被使用
        }
      }
    },
    methods: {
      onLoad() {
        console.log('onload')
        this.loading = true;
        if (this.currentPage < this.total) {
          this.currentPage++;
          this.getUserCounterDetailGroupByDay()
        } else {
          this.loading = false;
          this.finished = true;
        }

      },
      getUserCounterDetailGroupByDay() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          userType: this.$store.getters.getUserInfo.roleType,
          accountNo: this.$store.getters.getUserInfo.accountNo,
          counterType: 'U01',
          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserCounterDetailGroupByDay(params).then(res => {
          console.log('getUserCounterDetailGroupByDay', res)
          this.loading = false;
          if (res.flag && res.data) {
            this.total = res.total
            this.sourceList = {...this.sourceList, ...res.data};
            console.log('sourceList', this.sourceList)
          }
        })
      },
      getMyCoinInfo() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          roleType: this.$store.getters.getUserInfo.roleType,
          belongSchoolId: this.$store.getters.schoolId,
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          counterTypeList: [{counterType: 'U01'}],
          orginTypeList: [
            {orginType: "O01"},
            {orginType: "O11"},
            {orginType: "O12"},
            {orginType: "O08"},
            {orginType: "O10"}
          ]

        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getMyCoinInfo(params).then(res => {
          console.log('getMyCoinInfo', res);
          if (res.flag && res.data) {
            this.langCoin = res.data[0].countValue;
            let userDetailCount = res.data[0].intUserDetailCountResultVo || [];
            var arrLen = userDetailCount.length;
            for (let i = 0; i < arrLen; i++) {
              switch (userDetailCount[i].originType) {
                case 'O01':     //登录
                  this.coinDetail.O01= userDetailCount[i].counterValue;
                  break;
                case 'O08':     //资源共享
                  this.coinDetail.O08= userDetailCount[i].counterValue;
                  break;
                case 'O10':     //资源收藏
                  this.coinDetail.O10= userDetailCount[i].counterValue;
                  break;
                case 'O11':     //资源创建
                  this.coinDetail.O11= userDetailCount[i].counterValue;
                  break;
                case 'O12':     //资源被使用
                  this.coinDetail.O12= userDetailCount[i].counterValue;
                  break;

              }

            }
          }
        })
      }
    },
    created() {
      this.getMyCoinInfo();
      // this.getUserCounterDetailGroupByDay()
    }

  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .coin-wrap {
    background-color: #f5f5f5;

    @{deep} .tips {
      color: #39F0DD;
      font-size: 14px;
    }

    &-total {
      height: 120px;
      background-color: #fff;
      padding: 30px;

      h3 {
        font-size: 30px;
        color: #39F0DD;
        font-weight: 500;
        text-align: center;
      }

      div {
        width: 120px;
        height: 21px;
        text-align: center;
        font-size: 12px;
        color: #666666;
        border: 1px solid #39F0DD;
        border-radius: 10px;
        margin: 10px auto;
        line-height: 21px;
      }
    }

    &-detail {
      margin-top: 5px;
      height: 213px;
      background-color: #fff;
      padding: 15px 10px;

      &_title {
        h4 {
          font-size: 16px;
          font-weight: 500;
        }

        .line {
          width: 22px;
          height: 2px;
          background-color: #39F0DD;
          margin-top: 6px;
        }

        margin-bottom: 15px;
      }

      &_body {
        > div {
          display: flex;

          justify-content: space-around;
          margin-bottom: 16px;

          .item {
            text-align: center;
            width: 70px;

            div {
              width: 44px;
              height: 44px;
              border-radius: 22px;
              text-align: center;
              line-height: 44px;
              background-color: #E0FFFC;
              font-size: 15px;
              color: #fff;
              margin: 0 auto;
            }

            span {
              font-size: 12px;
            }
          }

          &:first-child {
            .item {
              &:first-child {
                div {
                  background: -webkit-linear-gradient(#BEF359, #6BDA21); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#BEF359, #6BDA21); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#BEF359, #6BDA21); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#BEF359, #6BDA21); /* 标准的语法 */
                }
              }

              &:nth-child(2) {
                div {
                  background: -webkit-linear-gradient(#96F6FC, #22DCDA); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#96F6FC, #22DCDA); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#96F6FC, #22DCDA); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#96F6FC, #22DCDA); /* 标准的语法 */
                }
              }

              &:nth-child(3) {
                div {
                  background: -webkit-linear-gradient(#F7DC40, #FFAD1E); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#F7DC40, #FFAD1E); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#F7DC40, #FFAD1E); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#F7DC40, #FFAD1E); /* 标准的语法 */
                }
              }
            }
          }

          &:last-child {
            .item {
              &:first-child {
                div {
                  background: -webkit-linear-gradient(#63FCBD, #26DB9D); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#63FCBD, #26DB9D); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#63FCBD, #26DB9D); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#63FCBD, #26DB9D); /* 标准的语法 */
                }
              }

              &:nth-child(2) {
                div {
                  background: -webkit-linear-gradient(#FCA463, #E87623); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#FCA463, #E87623); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#FCA463, #E87623); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#FCA463, #E87623); /* 标准的语法 */
                }
              }

              &:nth-child(3) {
                div {
                  background: -webkit-linear-gradient(#BEF359, #6BDA21); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(#BEF359, #6BDA21); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(#BEF359, #6BDA21); /* Firefox 3.6 - 15 */
                  background: linear-gradient(#BEF359, #6BDA21); /* 标准的语法 */
                }
              }
            }
          }
        }

      }
    }

    &-source {
      margin-top: 5px;
      background-color: #fff;
      padding: 15px 10px;

      &_title {
        h4 {
          font-size: 16px;
          font-weight: 500;
        }

        .line {
          width: 22px;
          height: 2px;
          background-color: #39F0DD;
          margin-top: 6px;
        }

        margin-bottom: 20px;
      }

      &_body {
        font-size: 12px;
        padding: 3px;

        .item {
          border: 1px solid #eee;
          margin-bottom: 10px;

          &-title {
            background-color: #EEEEEE;
            padding: 0 10px;
            height: 33px;
            line-height: 33px;
          }

          @{deep} .van-cell-group {
            padding: 10px 10px;

            .van-cell {
              font-size: 12px;
              height: 22px;
              padding: 0;

              &:not(:last-child):after {
                border: 0;
              }

              .van-cell__value {
                color: #39F0DD;
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    @{deep} .van-popup {
      width: 308px;
      height: 355px;

      .title {
        height: 58px;
        position: relative;

        h4 {
          font-size: 18px;
          color: #010101;
          font-weight: 700;
          text-align: center;
          line-height: 58px;
        }

        span {
          text-align: center;
          position: absolute;
          display: block;
          right: 20px;
          top: 15px;
          width: 22px;
          height: 22px;
          line-height: 18px;
          font-size: 20px;
          border-radius: 22px;
          border: 1px solid #ccc;
          color: #ccc;
        }
      }

      .content {
        padding: 0 20px;

        p {
          font-size: 15px;
          line-height: 26px;
          color: #000;

          &:last-child {
            color: red;
          }
        }
      }
    }
  }

</style>
