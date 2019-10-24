<template>
  <section class="myCollect">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text=""
      @load="onLoad"
    >
      <div v-if="collectList.length>0">
        <van-swipe-cell v-for="(item,index) in collectList">
          <div class="goodsItem" @click="$router.push(`/goodsDetail/${item.goodsId}`)">
            <div class="goodsPic">
              <img
                :src="item.goodsPhotoUrl"
                alt="">
            </div>
            <div class="goodsInfo">
              <div class="goodsName">
                {{item.goodsName}}
              </div>
              <div class="otherInfo">
                <div class="price">
                  <img src="@assets/img/myself-icon-16.png" alt="">
                  {{item.discountIntegral}}
                </div>
                <div class="store">
                  库存：{{item.mallGoodsStockInfo.convertNumber}}/{{item.mallGoodsStockInfo.stockNumber}}
                </div>
              </div>
            </div>
          </div>
          <template slot="right">
            <van-button square type="danger" text="删除" @click="delCollect(item.collectId,index)"/>
          </template>
        </van-swipe-cell>
      </div>
      <div v-else v-show="!loading" class="placeholderImg">
        <img src="@assets/img/blank.png"/>
        <p>您还没有收藏的商品，快去商城逛逛吧！</p>
      </div>

    </van-list>
  </section>
</template>

<script>
  import {cancelMallCollectInfo, getCollectInfo} from "@/api/mine";

  export default {
    name: "myCollect",
    data() {
      return {
        loading: false,
        finished: false,
        currentPage: 0,
        pageSize: 10,
        total: 1,
        collectList: []
      }
    },
    methods: {
      onLoad() {
        console.log('onload')
        this.loading = true;
        if (this.currentPage < this.total) {
          this.currentPage++;
          this.getCollectInfo()
        } else {
          this.loading = false;
          this.finished = true;
        }
      },
      // 取消收藏
      delCollect(collectId, index) {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          collectAccountNo: this.$store.getters.getUserInfo.accountNo,
          collectId: collectId
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        cancelMallCollectInfo(params).then(res => {
          if (res.flag) {
            this.$toast.success('删除成功！');
            this.collectList.splice(index, 1);
          } else {
            this.$toast.fail(res.msg)
          }
        })
      },
      // 获取兑换记录
      getCollectInfo() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          collectAccountNo: this.$store.getters.getUserInfo.accountNo,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        getCollectInfo(params).then(res => {
          console.log('getCollectInfo', res);
          this.loading = false;
          if (res.flag && res.data) {
            this.total = res.total;
            this.collectList = [...this.collectList, ...res.data];
            // console.log('collectList', this.collectList)

          }
        })
      }
    },

  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .myCollect {
    background-color: #F5F6FA;

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

    @{deep} .goodsItem {
      width: 100%;
      background-color: #fff;
      height: 100px;
      border-bottom: 1px solid #F5F6FA;
      display: flex;
      padding: 10px;

      .goodsPic {
        width: 75px;
        height: 75px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #ff0;

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
            color: #FF2C40;

            img {
              display: inline-block;
              width: 14px;
              height: 14px;
            }
          }

          .store {
            flex: 1;
            font-size: 12px;
            color: #666;
            text-align: right;
            align-self: center;
          }
        }

      }
    }

    @{deep} .placeholderImg {
      width: 100%;
      height: calc(100vh - 50px);
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
