<template>
  <section class="convertDetail">
    <van-skeleton
      title
      :row="3"
      :loading="loading"
    >
      <div class="goodsItem" v-if="recordDetail">
        <div class="top">
          <div class="goodsPic">
            <img :src="recordDetail.goodsPhotoUrl" alt="">
          </div>
          <div class="goodsInfo">
            <div class="goodsName">
              {{recordDetail.goodsName}}
            </div>
            <div class="otherInfo">
              <div class="count">
                x {{recordDetail.convertGoodsCount}}
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
        <span class="title">
          实付朗币：
        </span>
          <div class="price">
            <img src="@assets/img/myself-icon-16.png" alt="">
            {{recordDetail.consumeIntegral}}
          </div>
        </div>
      </div>
    </van-skeleton>
    <van-skeleton
      :row="3"
      :loading="loading"
    >
      <div class="convertInfo" v-if="recordDetail">
        <div class="convertInfo-title">
          订单信息
        </div>
        <div class="convertInfo-body">
          <div>
            <span>兑换数量：</span>
            <span>{{recordDetail.convertGoodsCount}}</span>
          </div>
          <div>
            <span>申请日期：</span>
            <span>{{recordDetail.convertDate | formatDate}}</span>
          </div>
          <div v-if="recordDetail.status == 'S08' || recordDetail.status == 'S05'">
            <span>取消日期：</span>
            <span>{{recordDetail.converCancletDate | formatDate}}</span>
          </div>
          <div v-else>
            <span>发放日期：</span>
            <span>{{recordDetail.convertCompleteDate | formatDate}}</span>
          </div>
          <div>
            <span>兑换积分：</span>
            <span>{{recordDetail.consumeIntegral}}</span>
          </div>
          <div>
            <span>原价积分：</span>
            <span>{{recordDetail.orginIntegral}}</span>
          </div>
          <div>
            <span>兑换状态：</span>
            <span>{{recordDetail.status | getStatus}}</span>
            <span v-show="recordDetail.status == 'S01' || recordDetail.status=='S02'" class="btn"
                  @click="cancelConvert">取消兑换</span>
          </div>
        </div>
      </div>
    </van-skeleton>

  </section>
</template>

<script>
  import {getMallConvertRecordInfoById, cancelExchangeApplyGoodsInfo} from "@/api/mine";
  import format from "@/api/date";


  export default {
    name: "convertDetail",
    data() {
      return {
        recordDetail: null, // 记录详情
        loading: true,  // 是否显示骨架图
      }
    },
    filters: {
      formatDate(value) {
        if (value) {
          let date = new Date(value);
          return format.formatDate(date, "yyyy-MM-dd hh:mm:ss");
        } else {
          return '--'
        }

      },
      getStatus(status) {
        switch (status) {
          case 'S01' :
            return '申请中';
          case 'S02' :
            return '申请中';
          case 'S03' :
            return '兑换成功';
          case 'S04' :
            return '兑换失败';
          case 'S05' :
            return '取消兑换';
          case 'S08' :
            return '取消兑换确认中';
        }
      }
    },
    methods: {
      // 获取兑换记录
      getConvertRecord() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          convertAccountNo: this.$store.getters.getUserInfo.accountNo,
          recordId: this.$route.params.id,
          // goodsId: 22
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getMallConvertRecordInfoById(params).then(res => {
          console.log('getMallConvertRecordInfoById', res)
          if (res.flag && res.data) {
            this.recordDetail = res.data[0];
            this.loading = false;
          }
        })
      },
      // 取消兑换
      cancelConvert(status) {
        this.$dialog
          .confirm({
            title: "",
            message: "是否取消兑换？",
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            confirmButtonColor: '#39F0DD'
          })
          .then(() => {
            // on confirm
            let obj = {
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              convertAccountNo: this.$store.getters.getUserInfo.accountNo,
              recordId: this.$route.params.id
            };
            let params = {
              requestJson: JSON.stringify(obj)
            };
            cancelExchangeApplyGoodsInfo(params).then(res => {
              if (res.flag) {
                this.$toast.success('取消成功！');
                this.recordList.splice(index, 1);
              } else {
                this.$toast.fail(res.msg);
              }
            })
          })
          .catch(() => {
            // on cancel

          });
      }
    },
    mounted() {
      this.getConvertRecord()
      console.log(this.$route.params.id)
    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';

  .convertDetail {
    background-color: #f5f5f5;

    @{deep}.van-skeleton__row, .van-skeleton__title {
      background-color: #eee;
    }

    @{deep} .van-skeleton {
      margin-top: 10px;
    }

    .goodsItem {
      width: 100%;
      background-color: #fff;
      height: 153px;
      padding: 13px 20px;
      margin-bottom: 10px;

      .top {
        display: flex;
        align-items: center;
        margin-bottom: 13px;

        .goodsPic {
          width: 113px;
          height: 77px;
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

            .count {
              flex: 1;
              font-size: 14px;
              color: #333;
              text-align: right;
              align-self: center;
            }
          }

        }
      }

      .bottom {
        padding: 15px 0;
        display: flex;
        border-top: 1px dashed #ccc;

        .title {
          flex: 1;
          font-size: 14px;
          color: #666666;
        }

        .price {
          font-size: 14px;
          font-weight: 700;
          color: #FF2C40;
          text-align: right;

          img {
            display: inline-block;
            width: 9px;
            height: 9px;
          }
        }

      }


    }

    .convertInfo {
      background-color: #fff;
      padding: 13px;

      &-title {
        font-size: 16px;
        font-weight: 600;
        padding-left: 5px;
        border-left: 2px solid #39F0DD;
      }

      &-body {
        font-size: 14px;
        color: #666666;
        margin-top: 15px;

        div {
          line-height: 27px;
          padding-left: 10px;

          .btn {
            float: right;
            color: #39F0DD;
          }
        }
      }
    }
  }
</style>
