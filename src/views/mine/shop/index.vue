<template>
  <section class="shop" ref="listScroll">
    <van-sticky>
      <van-nav-bar title="积分商城" left-arrow @click-left="$router.replace('/mine')">
        <div slot="right" class="tips" @click="$router.push('/convertRule')">兑换说明</div>
      </van-nav-bar>
    </van-sticky>

    <div class="shop-header">
      <div class="item" @click="$router.push('/converseRecord')">
        <div>
          <img src="@assets/img/myself-icon-12.png" alt="">
        </div>
        <span>兑换记录</span>
      </div>
      <div class="item" @click="$router.push('/myCollect')">
        <div>
          <img src="@assets/img/myself-icon-13.png" alt="">
        </div>
        <span>我的收藏</span>
      </div>
      <div class="item" @click="$router.push('/myLangCoin')">
        <div>{{langCoin}}</div>
        <span>我的朗币</span>
        <div class="integration">我的积分:{{integer}}</div>
      </div>
    </div>
    <div class="shop-body">
      <van-sticky>
        <div class="shop-body_title">
          <div class="txt">
            <h4>礼品兑换区</h4>
            <div class="line"></div>
          </div>
          <div class="checkbox">
            <van-checkbox v-model="checked" shape="square" @change="handleCheck" checked-color="#39F0DD">
              我能兑换的礼品
            </van-checkbox>
          </div>
          <div class="menu">
            <van-dropdown-menu>
              <van-dropdown-item @change="handleDropdown" v-model="goodsType" :options="typeList"/>
            </van-dropdown-menu>

          </div>
        </div>
      </van-sticky>
      <div class="shop-body_production">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
        >
          <ul v-if="goodsLists.length>0" class="goodsList">
            <li class="goodsItem" v-for="item in goodsLists" @click="goDetail(item)">
              <div class="goodsPic">
                <img :src="item.goodsPhotoUrl" alt="">
              </div>
              <div class="goodsName">
                {{item.goodsName}}
              </div>
              <div class="goodsInfo">
                <div class="price">
                  <img src="@assets/img/myself-icon-16.png" alt="">
                  <!-- {{item.discountIntegral}} -->
                  {{item.mallConvertRuleInfo.langcoinNumber}}
                </div>
                <div class="store">
                  库存：{{item.mallGoodsStockInfo.convertNumber}}/{{item.mallGoodsStockInfo.stockNumber}}
                </div>
              </div>
            </li>

          </ul>
          <div v-else v-show="!$store.getters.getVanLoading&&!loading" class="placeholderImg">
            <img src="@assets/img/blank.png"/>
            <p>暂无商品~</p>
          </div>
        </van-list>
      </div>
    </div>

  </section>
</template>

<script>
  import {getSysDictList} from "@/api/index";
  import {getGoodsList, getUserCounterSummary} from "@/api/mine";


  export default {
    name: "index",
    data() {
      return {
        langCoin: 0,
        integer: 0,
        checked: false,
        typeList: [],
        loading: false,
        finished: false,
        currentPage: 0,
        pageSize: 10,
        total: 1,
        goodsLists: [],
        goodsType: '',//商品类型
        listScroll: 0,//滚动位置，记录上一次浏览位置
        redeemType: 'T02',//T01表示我能兑换的商品，T02表示不过滤
      }
    },
    methods: {
      // 选择我能兑换的商品
      handleCheck(val) {
        console.log('check', val);
        if (val) {
          this.redeemType = 'T01';
        } else {
          this.redeemType = 'T02';
        }
        this.finished = false;
        this.$store.commit('setVanLoading', true);
        this.currentPage = 0;
        this.pageSize = 10;
        this.total = 1;
        this.goodsLists = [];
        this.onLoad();
      },
      // 下拉选择商品类型
      handleDropdown(val) {
        console.log('下拉列表选择了内容', val, this.goodsType);
        this.finished = false;
        this.$store.commit('setVanLoading', true);
        this.currentPage = 0;
        this.pageSize = 10;
        this.total = 1;
        this.goodsLists = [];
        this.onLoad();
      },
      // 获取商品类型字典值
      getSysDictList() {
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            dictCode: "Domain_Goods_Type"
          })
        };
        getSysDictList(json).then(res => {
          if (res.flag) {
            this.typeList = res.data[0].sysDictInfoList.map(function (item) {
              return {
                text: item.dictValue,
                value: item.dictKey
              };
            });
            var temp = {
              text: "全部商品",
              value: ""
            };
            this.typeList.unshift(temp);
          }
        });
      },
      onLoad() {
        console.log('onload');
        // this.loading = true;
        if (this.currentPage < this.total) {
          this.currentPage++;
          this.getGoodsList();
        } else {
          this.loading = false;
          this.finished = true;
        }
      },
      // 商品列表
      getGoodsList() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          convertAccountNo: this.$store.getters.getUserInfo.accountNo,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          goodsType: this.goodsType,
          schoolIdList: this.$store.getters.schoolIdList,
          redeemType: this.redeemType,
          limitNumber: this.langCoin
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }

        getGoodsList(params).then(res => {
          // console.log('getGoodsList', res)
          this.$store.commit('setVanLoading', false);

          this.loading = false;
          if (res.flag && res.data && res.data.length > 0) {
            this.total = res.total;
            this.goodsLists = [...this.goodsLists, ...res.data];
          }
        })
      },
      // 获取郎币和积分数量
      getUserCounterSummary() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          roleType: this.$store.getters.getUserInfo.roleType,
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          sysType: 'S01'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserCounterSummary(params).then(res => {
          if (res.flag && res.data.length > 0) {
            let counterDataArray = res.data[0].UserCounterSummary.userCounter;
            for (var i = 0; i < counterDataArray.length; i++) {
              if (counterDataArray[i].counterType == "U01") {
                // 积分
                this.integer =
                  counterDataArray[i].counterValue == null
                    ? 0
                    : counterDataArray[i].counterValue;
              } else if (counterDataArray[i].counterType == "U10") {
                //郎币
                this.langCoin =
                  counterDataArray[i].counterValue == null
                    ? 0
                    : counterDataArray[i].counterValue;
              }
            }
          } else {
            this.integer = 0;
            this.langCoin = 0;
          }
          let obj = {
            langCoin: this.langCoin,
            integer: this.integer
          }
          window.localStorage.setItem('counterSummary', JSON.stringify(obj));
        })
      },
      goDetail(item) {
        console.log(item);
        this.$router.push(`/goodsDetail/${item.goodsId}`)
      }

    },
    beforeRouteLeave(to, from, next) {
      this.listScroll = this.$refs["listScroll"].scrollTop;
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          // vm.$refs["listScroll"].scrollTo(0, vm.listScroll);
          vm.$refs["listScroll"].scrollTop = vm.listScroll;
        });
      });
    },
    mounted() {
      this.getSysDictList();
      // 没有存积分和朗币信息时重新调接口获取
      if (window.localStorage.getItem('counterSummary')) {
        let counterSummary = JSON.parse(window.localStorage.getItem('counterSummary'));
        this.integer = counterSummary.integer;
        this.langCoin = counterSummary.langCoin;
      } else {
        this.getUserCounterSummary();
      }

    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .shop {
    background-color: #F5F6FA;

    @{deep} .tips {
      color: #39F0DD;
      font-size: 14px;
    }

    &-header {
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      padding: 10px 0;

      .item {
        text-align: center;
        width: 33.3%;
        border-left: 1px solid #F5F6FA;

        div {
          /*width: 70px;*/
          height: 44px;
          line-height: 44px;
          color: #39F0DD;
          font-size: 24px;
          font-weight: 500;
          border-radius: 22px;
          text-align: center;
          margin: 0 auto;

          &.integration {
            font-size: 10px;
            color: #D9A402;
            height: 17px;
            line-height: 15px;
            background-color: #FFFDC7;
            border-radius: 8px;
            /*width: unset;*/
            padding: 0 10px;
            margin: 5px;
            border: 1px solid #FFCA28;
            box-sizing: border-box;
          }

          img {
            display: block;
            width: 35px;
            height: 35px;
            margin: 0 auto;
          }
        }

        span {
          font-size: 14px;
          color: #666666;
          margin-top: 8px;
        }
      }
    }

    &-body {
      padding: 10px;

      @{deep} .van-sticky--fixed {
        background-color: #fff;
        border-bottom: 1px solid #f5f6f5;
        padding: 0 10px;
        top: 44px;
      }

      &_title {
        display: flex;
        justify-content: space-between;

        .txt {
          display: flex;
          align-items: center;

          h4 {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: -8px;
              width: 22px;
              height: 2px;
              background-color: #39F0DD;
            }
          }
        }

        .checkbox {
          display: flex;
          align-items: center;

          @{deep} .van-checkbox {
            .van-checkbox__label {
              font-size: 14px;
              color: #333;
            }
          }
        }

        .menu {
          @{deep} .van-dropdown-menu {
            background-color: transparent;

            .van-dropdown-menu__title {
              .van-checkbox__icon {
                font-size: 14px;
              }

              .van-ellipsis {
                color: #39F0DD;
                font-size: 14px;
              }

            }

            .van-popup--top {
              width: 103px;
              border-radius: 5px;
              right: 0;
              left: unset;

              .van-cell__title {
                font-size: 14px;
              }

              .van-cell__value {
                display: none;
              }
            }
          }

          .van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after {
            border: none;
          }
        }

      }

      &_production {
        @{deep} .van-list {
          .goodsList {
            overflow: hidden;

            .goodsItem {
              overflow: hidden;
              width: 172px;
              height: 248px;
              border-radius: 5px;
              background-color: #fff;
              float: left;
              margin-top: 10px;

              &:nth-child(2n-1) {
                margin-right: 10px;
              }

              .goodsPic {
                width: 100%;
                height: 164px;
                background-color: #f5f6f5;

                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }

              .goodsName {
                width: 100%;
                height: 30px;
                font-size: 14px;
                line-height: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                padding: 0 7px;
                margin: 10px auto;
              }

              .goodsInfo {
                padding: 0 7px;
                display: flex;

                .price {
                  font-size: 18px;
                  font-weight: 700;
                  color: #FF2C40;

                  img {
                    display: inline-block;
                    width: 17px;
                    height: 17px;
                  }
                }

                .store {
                  flex: 1;
                  font-size: 12px;
                  text-align: right;
                  align-self: center;
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

      }
    }

  }

</style>
