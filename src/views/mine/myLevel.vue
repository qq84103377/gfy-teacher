<template>
  <section class="level-wrap">
    <van-sticky>
      <van-nav-bar title="我的等级" left-arrow @click-left="$router.replace('/mine')">
        <div slot="right" class="tips" @click="showTips = true">如何获取经验？</div>
      </van-nav-bar>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="level-wrap-progress">
        <span>LV.{{currentLevel}}</span>
        <van-progress
          :pivot-text="progress"
          color="#4EF1DF"
          :percentage="percentage"
        />
        <span>LV.{{currentLevel+1}}</span>

      </div>
      <div class="level-wrap-detail">
        <div class="level-wrap-detail_title">
          <h4>获取明细</h4>
          <div class="line"></div>
        </div>
        <div class="level-wrap-detail_body">
          <div class="item">
            <div>{{loginCount}}</div>
            <span>登录</span>
          </div>
          <div class="item">
            <div>{{createResource}}</div>
            <span>创建资源</span>
          </div>
          <div class="item">
            <div>{{pubInfo}}</div>
            <span>发布信息</span>
          </div>

        </div>
      </div>
      <div class="level-wrap-source">
        <div class="level-wrap-source_title">
          <h4>经验来源</h4>
          <div class="line"></div>
        </div>
        <div class="level-wrap-source_body">
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
    </van-pull-refresh>
    <van-popup v-model="showTips" :round="true">
      <div class="title">
        <h4>如何获取经验?</h4>
        <span @click="showTips = false">×</span>
      </div>
      <div class="content">
        <p>1、通过登录，每天的首次登录可以获得10个经验</p>
        <p>2、通过发布信息，每个信息奖励10个经验</p>
        <p>3、通过创建资源，每个资源可以获得10个经验</p>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import {getUserCounterDetailGroupByDay, getMylevelInfo} from '@/api/mine';

  export default {
    name: "myLevel",
    data() {
      return {
        loading: false,
        finished: false,
        sourceList: {},
        currentPage: 0,
        pageSize: 10,
        total: 1,
        currentLevel: 0,
        progress: "",
        percentage: 0,
        showTips: false,
        loginCount: 0,
        createResource: 0,
        pubInfo: 0,
        isLoading: false,
      }
    },
     beforeRouteLeave(to, from, next) {
      if (this.showTips) {
        this.showTips = false
        next(false)
      } else{  
      next();
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
          counterType: 'U03',
          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserCounterDetailGroupByDay(params).then(res => {
          this.isLoading = false;
          // console.log('getUserCounterDetailGroupByDay', res)
          this.loading = false;
          if (res.flag && res.data) {
            this.total = res.total
            this.sourceList = {...this.sourceList, ...res.data};
            console.log('sourceList', this.sourceList)
          }
        })
      },
      getMylevelInfo() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          roleType: this.$store.getters.getUserInfo.roleType,
          belongSchoolId: this.$store.getters.schoolId,
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          counterTypeList: [{counterType: 'U03'}]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getMylevelInfo(params).then(res => {
          this.isLoading = false;
          // console.log('getMylevelInfo', res);
          if (res.flag && res.data) {
            this.currentLevel = res.data[0].level;
            // this.progress = res.data[0].levelPoint +'/'+res.data[0].nextlevelPoint;
            this.percentage = Math.ceil(res.data[0].levelPoint / res.data[0].nextlevelPoint * 100);
            let userDetailCount = res.data[0].intUserDetailCountResultVo || [];
            var arrLen = userDetailCount.length;
            for (let i = 0; i < arrLen; i++) {
              if (userDetailCount[i].originType == 'O01') {
                this.loginCount = userDetailCount[i].counterValue;
              } else if (userDetailCount[i].originType == 'O11') {
                this.createResource = userDetailCount[i].counterValue;
              } else if (userDetailCount[i].originType == 'O05') {
                this.pubInfo = userDetailCount[i].counterValue;
              }

            }
          }
        })
      },
      onRefresh() {
        console.log('onRefresh')
        this.sourceList = {};
        this.getMylevelInfo();
        this.currentPage = 1;
        this.getUserCounterDetailGroupByDay()
      }
    },
    created() {
      this.getMylevelInfo();
      // this.getUserCounterDetailGroupByDay()
    }

  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .level-wrap {
    background-color: #f5f5f5;

    @{deep} .tips {
      color: #39F0DD;
      font-size: 14px;
    }

    &-progress {
      padding: 0 33px;
      height: 75px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;

      span {
        font-size: 15px;
        color: #39F0DD;
      }

      @{deep} .van-progress {
        width: 214px;
        height: 10px;
        background-color: #E0FFFC;

        .van-progress__pivot {
          height: 10px;
          line-height: 10px;
        }
      }
    }

    &-detail {
      margin-top: 5px;
      height: 146px;
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
        display: flex;
        justify-content: space-around;

        .item {
          text-align: center;

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
      height: 255px;

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
        }
      }
    }
  }

</style>
