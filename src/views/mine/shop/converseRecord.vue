<template>
  <section class="record" ref="record">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
        <div v-if="recordList.length>0">
          <van-swipe-cell v-for="(item,index) in recordList">
            <div class="item" @click="$router.push(`/convertDetail/${item.recordId}`)">
              <div class="item-title">
                <span>{{item.convertDate | formateDate}}</span>
                <span class="status">{{item.status|getStatus}}</span>
              </div>
              <div class="goodsItem">
                <div class="goodsPic">
                  <img :src="item.goodsPhotoUrl" alt="">
                </div>
                <div class="goodsInfo">
                  <div class="goodsName">
                    {{item.goodsName}}
                  </div>
                  <div class="otherInfo">
                    <div class="price">
                      <img src="@assets/img/myself-icon-16.png" alt="">
                      {{Math.ceil(item.consumeIntegral/10)}}
                    </div>
                    <div class="count">
                      x{{item.convertGoodsCount}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template slot="right">
              <van-button square type="danger" text="删除" @click="delRecord(item.recordId,index,item.status)" />
            </template>
          </van-swipe-cell>
        </div>

        <div v-else v-show="!loading" class="placeholderImg">
          <img src="@assets/img/blank.png" />
          <p>您还没有兑换过商品，快去兑换吧！~</p>
        </div>

      </van-list>
    </van-pull-refresh>
    <!-- <van-dialog v-model="showDialog" message='是否删除该兑换记录？' show-cancel-button confirm-button-color='#39F0DD' @cancel='cancel' @confirm='confirm'></van-dialog> -->
  </section>
</template>

<script>
import { getConvertRecordInfo, delExchangeApplyGoodsInfo } from "@/api/mine";
import eventBus from "@/utils/eventBus";


export default {
  name: "converseRecord",
  data() {
    return {
      loading: false,
      finished: false,
      currentPage: 0,
      pageSize: 10,
      total: 1,
      recordList: [],
      record: 0,  //滚动距离,记录上次浏览位置
      isLoading: false,
    }
  },
  filters: {
    formateDate(date) {
      let d = new Date(date);
      let YY = d.getFullYear();
      let MM = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
      let DD = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
      let week = d.getDay();
      let str = '星期';
      switch (week) {
        case 0:
          str += "日";
          break;
        case 1:
          str += "一";
          break;
        case 2:
          str += "二";
          break;
        case 3:
          str += "三";
          break;
        case 4:
          str += "四";
          break;
        case 5:
          str += "五";
          break;
        case 6:
          str += "六";
          break;
      }
      return YY + '-' + MM + '-' + DD + ' ' + str;
    },
    getStatus(status) {
      switch (status) {
        case 'S01':
          return '申请中';
        case 'S02':
          return '申请中';
        case 'S03':
          return '兑换成功';
        case 'S04':
          return '兑换失败';
        case 'S05':
          return '取消成功';
        case 'S08':
          return '申请取消';
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.showDialog) {
      this.showDialog = false
      this.$dialog.close()
      next(false)
    } else {
      this.record = this.$refs["record"].scrollTop;
      next();
    }

  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.$refs["record"].scrollTop = vm.record;
      });
    });
  },
  methods: {
    async onRefresh() {
      this.currentPage = 1;
      this.recordList = [];
      await this.getConvertRecord();
    },
    onLoad() {
      console.log('onload')
      this.loading = true;
      if (this.currentPage < this.total) {
        this.currentPage++;
        this.getConvertRecord()
      } else {
        this.loading = false;
        this.finished = true;
      }
    },
    // 获取兑换记录
    async getConvertRecord() {
      let obj = {
        interUser: "runLfb",
        interPwd: "25d55ad283aa400af464c76d713c07ad",
        convertAccountNo: this.$store.getters.getUserInfo.accountNo,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        statusList: "S01,S02,S03,S05,S08",
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getConvertRecordInfo(params).then(res => {
        // console.log('getConvertRecordInfo', res)
        this.loading = false;
        this.isLoading = false;
        if (res.flag && res.data) {
          this.total = res.total;
          this.recordList = [...this.recordList, ...res.data];
          // console.log('recordList', this.recordList)

        }
      })
    },
    // 删除兑换记录
    delRecord(id, index, status) {
      this.showDialog = true
      this.$dialog
        .confirm({
          title: "",
          message: "是否删除该兑换记录？",
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonColor: '#39F0DD'
        })
        .then(() => {
          this.showDialog = false
          // on confirm
          if (status == 'S01' || status == 'S02' || status == 'S08') {
            this.$toast.fail('申请中和确认中的记录无法删除');
            return;
          }

          let obj = {
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            convertAccountNo: this.$store.getters.getUserInfo.accountNo,
            recordId: id
          };
          let params = {
            requestJson: JSON.stringify(obj)
          };
          delExchangeApplyGoodsInfo(params).then(res => {
            if (res.flag) {
              this.$toast.success('删除成功！');
              this.recordList.splice(index, 1);
            } else {
              this.$toast.fail(res.msg)
            }
          })
        })
        .catch(() => {
          // on cancel
          this.showDialog = false
        });
    }
  },
  mounted() {
    try{MobclickAgent.onEvent('clickMineShopRecord')}catch(e){console.log(e)}

    eventBus.$off("convertRecordRefresh")
    eventBus.$on("convertRecordRefresh", (data) => {
      this.onRefresh();
    })
  },
  // activated() {
  //   eventBus.$off("convertRecordRefresh")
  //   eventBus.$on("convertRecordRefresh", (data) => {
  //     this.onRefresh();
  //   })
  // }
}
</script>

<style scoped lang="less">
@deep: ~">>>";

.record {
  background-color: #f5f6fa;
  padding: 10px 0;

  @{deep} .van-swipe-cell {
    .van-swipe-cell__right {
      button {
        height: 100%;
        background-color: #ccc;
        color: #fff;
        border: none;
      }
    }
  }

  @{deep} .item {
    background-color: #fff;
    margin-bottom: 10px;
    /*border-radius: 10px;*/
    /*overflow: hidden;*/
    padding: 0 10px;

    &-title {
      height: 33px;
      line-height: 33px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f5f6fa;
      font-size: 14px;
      color: #333333;

      .status {
        color: #feb524;
      }
    }

    .goodsItem {
      width: 100%;
      background-color: #fff;
      height: 100px;
      display: flex;
      align-items: center;

      .goodsPic {
        width: 75px;
        height: 75px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #ccc;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .goodsInfo {
        padding-left: 10px;
        flex: 1;

        .goodsName {
          color: #333;
          width: 100%;
          height: 40px;
          font-size: 14px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .otherInfo {
          padding: 10px 7px;
          display: flex;

          .price {
            font-size: 14px;
            font-weight: 700;
            color: #ff2c40;

            img {
              display: inline-block;
              width: 14px;
              height: 14px;
            }
          }

          .count {
            flex: 1;
            font-size: 12px;
            color: #666;
            text-align: right;
            align-self: center;
          }
        }
      }
    }
  }

  @{deep} .placeholderImg {
    width: 100%;
    height: calc(100vh - 70px);
    text-align: center;
    .column-center;

    img {
      width: 300px;
      margin: 0px auto;
    }

    p {
      font-size: 12px;
      color: #999999;
      text-align: center;
    }
  }
}
</style>
