<template>
  <section class="notice">
    <div class="readAll" @click="readAll">
      <van-button type="primary" plain color="#39F0DD">全标已读</van-button>
    </div>
    <van-tabs class="tabs" v-model="active" @click="handleTab">
      <van-tab title="未读">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
        >
          <div v-if="Object.keys(noticeList).length>0">
            <div class="item" v-for="(value, name) in noticeList">
              <div class="item-title">{{name }}{{ value.weekDay}}</div>
              <div class="item-content" v-for="(item,index) in value.detailList"
                   @click="readNotice(item.remindId,name,index,value.weekDay)">
                <span class="item-content-txt">{{item.content}}</span>
                <span class="item-content-icon">
                  <img src="@assets/img/icon-1.png" alt="">
                </span>
              </div>
            </div>
          </div>


          <div v-else class="placeholderImg" v-show="!loading">
            <img src="@assets/img/blank.png"/>
            <p>暂无消息~</p>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="已读">
        <van-list
          v-model="loading1"
          :finished="finished1"
          finished-text=""
          @load="onLoad1"
        >
          <div v-if="Object.keys(noticeList1).length>0">
            <div class="item" v-for="(value, name) in noticeList1">
              <div class="item-title">{{name }}{{ value.weekDay}}</div>
              <div class="item-content" v-for="item in value.detailList">
                <span class="item-content-txt" v-html="item.content"></span>
              </div>
            </div>
          </div>

          <div v-else class="placeholderImg" v-show="!loading1">
            <img src="@assets/img/blank.png"/>
            <p>暂无消息~</p>
          </div>

        </van-list>
      </van-tab>
    </van-tabs>
  </section>
</template>

<script>

  import {getPubRemindInfoGroupByDay, savePubRemindInfo, oneKeyReadRemindInfo} from '@/api/mine';

  export default {
    name: "myNotice",
    data() {
      return {
        active: 0,
        loading: false,
        finished: false,
        currentPage: 0,
        pageSize: 10,
        total: 1,
        noticeList: {},//未读消息列表
        loading1: false,
        finished1: false,
        currentPage1: 0,
        pageSize1: 10,
        total1: 1,
        noticeList1: {},//已读消息列表
      }
    },
    methods: {
      onLoad() {
        // console.log('onload')
        this.loading = true;
        if (this.currentPage < this.total) {
          this.currentPage++;
          this.getUnreadNotice()
        } else {
          this.loading = false;
          this.finished = true;
        }
      },
      onLoad1() {
        // console.log('onload1')
        this.loading1 = true;
        if (this.currentPage1 < this.total1) {
          this.currentPage1++;
          this.getReadedNotice()
        } else {
          this.loading1 = false;
          this.finished1 = true;
        }
      },
      // 获取未读消息
      getUnreadNotice() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          remindStatus: 'S01',
          pageSize: this.pageSize,
          currentPage: this.currentPage
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        getPubRemindInfoGroupByDay(params).then(res => {
          // console.log('getPubRemindInfoGroupByDay', res)
          this.loading = false;
          if (res.flag && res.data) {
            this.total = res.total;
            this.noticeList = {...this.noticeList, ...res.data};
            // console.log('noticeList', this.noticeList)
          }
        })
      },
      // 获取已读消息
      getReadedNotice() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          remindStatus: 'S02',
          pageSize: this.pageSize1,
          currentPage: this.currentPage1
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        getPubRemindInfoGroupByDay(params).then(res => {
          // console.log('getPubRemindInfoGroupByDay', res)
          this.loading1 = false;
          if (res.flag && res.data) {
            this.total1 = res.total;
            this.noticeList1 = {...this.noticeList1, ...res.data};
            // console.log('noticeList1', this.noticeList1)
          }
        })
      },
      // 记录当前读取的消息
      readNotice(id, name, index, weekDay) {
        console.log('当前点击的消息：', id, name, index)
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          remindStatus: 'S02',
          remindId: id
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        savePubRemindInfo(params).then(res => {
          if (res.flag) {
            // var item = []
            console.log('length', this.noticeList[name].detailList.length)
            if (this.noticeList[name].detailList.length == 1) {
              // item = this.noticeList[name].detailList.splice(index, 1);
              this.$delete(this.noticeList, name)
            } else {
              this.noticeList[name].detailList.splice(index, 1);
            }
            // let obj = {
            //   date: name,
            //   detailList: [],
            //   weekDay: weekDay
            // }
            // console.log('item', item)
            // if (this.noticeList1[name]) {
            //   this.noticeList1[name].detailList.push(item[0])
            // } else {
            //   this.noticeList1[name] = {...obj}
            //   this.noticeList1[name].detailList.push(item[0])
            // }

          } else {
            this.$toast.fail(res.msg);
          }
        })
      },
      // 全部标为已读
      readAll() {
        if (JSON.stringify(this.noticeList) == '{}') {
          this.$toast('没有未读消息');
          return;
        }
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        oneKeyReadRemindInfo(params).then(res => {
          if (res.flag) {
            this.$toast.success('操作成功');
            this.noticeList = {};
          } else {
            this.$toast.fail(res.msg);
          }
        })
      },
      handleTab(name, title) {
        // console.log(name, title)
        if (name == '1') {
          this.loading1 = false;
          this.finished1 = false;
          this.currentPage1 = 0;
          this.pageSize1 = 10;
          this.total1 = 1;
          this.noticeList1 = {};
          this.onLoad1();
        }

      }
    },
    mounted() {
      // this.getNotice('S01')

    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .notice {
    background-color: #F5F6FA;
     overflow: hidden;
  display: flex;
  flex-direction: column;

    .readAll {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 999;

      @{deep} .van-button {
        border-radius: 20px;
        height: 25px;
        line-height: 23px;
        background-color: transparent;
        color: #999 !important;

      }
    }

    @{deep} .van-tabs.tabs {
      display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden; 

      .van-tabs__wrap {
        width: 50%;
        margin: 10px 0;
        height: 25px;
         flex: 0 0 25px;

        .van-tabs__nav {
          background-color: transparent;
        }

        .van-tab {
          border: 1px solid #39F0DD;
          border-radius: 25px;
          margin-left: 10px;
          color: #666666;
          font-size: 14px;
          line-height: 23px;
        }

        .van-tab--active {
          background-color: #39F0DD;
          color: #fff;
        }

        .van-tabs__line {
          display: none;
        }
      }
       .van-tabs__content {
      overflow: auto;
      flex: 1;

      .van-tab__pane {
        height: 100%;

        .van-list {
          height: 100%;
        }
      }
    }

      .van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after {
        border: none;
      }
    }

    .item {
      border: 1px solid #eee;
      margin-bottom: 10px;
      background-color: #fff;

      &-title {
        padding: 0 10px;
        height: 33px;
        line-height: 33px;
        color: #333333;
        font-size: 14px;
        border-bottom: 1px solid #F5F6FA;
      }

      &-content {
        font-size: 14px;
        color: #666666;
        padding: 15px 10px;
        display: flex;
        border-bottom: 1px dashed #F5F6FA;

        &-txt {
          flex: 1;
        }

        &-icon {
          display: inline-block;
          width: 40px;
          text-align: right;

          img {
            display: inline-block;
            width: 14px;
          }
        }
      }
    }

    .placeholderImg {
      width: 100%;
      height: 100%;
      text-align: center;
      .column-center;

      img {
        width: 300px;
        margin: 10px auto;
      }

      p {
        font-size: 12px;
        color: #999999;
        text-align: center;
        margin-top: 15px;
      }
    }
  }

</style>
