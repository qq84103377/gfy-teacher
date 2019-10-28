<template>
  <section class="goodsDetail" @scroll="scroll" ref="goodsDetail">

    <div class="goodsDetail-header">
      <van-nav-bar :title="title" left-arrow @click-left="$router.back()"/>
      <!--      <img v-if="goodsInfo" :src="goodsInfo.goodsPhotoUrl" alt="">-->
      <van-swipe v-if="goodsInfo" :autoplay="3000" @change="swiperChange">
        <van-swipe-item v-for="(image, index) in images" :key="index" @click="previewImg">
          <img v-lazy="image"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="goodsDetail-body" v-if="goodsInfo">
      <div class="goodsInfo">
        <div>
          <div class="goodsName">
            {{goodsInfo.goodsName}}
          </div>
          <div class="price">
            <img src="@assets/img/myself-icon-16.png" alt="">
            {{goodsInfo.discountIntegral}}
          </div>
        </div>
        <div class="otherInfo">
          <span>选择颜色款式：</span> 颜色款式随机
        </div>
        <div class="otherInfo">
          <span>库存：</span>{{goodsInfo.mallGoodsStockInfo.convertNumber}}/{{goodsInfo.mallGoodsStockInfo.stockNumber}}
        </div>
      </div>
      <div class="remark" v-if="goodsInfo" v-html="goodsInfo.remark"></div>
    </div>
    <div class="goodsDetail-footer" v-if="goodsInfo">
      <div class="count">
        <p>数量：</p>
        <van-stepper v-model="goodsCount" min="1" max="5" integer :disabled="disabled" />
      </div>
      <div class="btns">
        <van-button type="primary" icon="star-o" color="#FFFCE0" v-show="!isCollect" @click="collect">收藏</van-button>
        <van-button type="primary" icon="star" color="#FFFCE0" v-show="isCollect" @click="cancelCollect">取消</van-button>
        <van-button type="info" @click="convert" :disabled="langCoin<goodsInfo.discountIntegral || disabled">
          {{langCoin < goodsInfo.discountIntegral ? '朗币不足':'立即兑换'}}
        </van-button>
      </div>

    </div>
    <div class="toTop" v-show="showTop" @click="toTop()">
      <van-icon name="arrow-up" color="#39F0DD"/>
      <p>至顶部</p>
    </div>
  </section>
</template>

<script>
  import {getGoodsList, addMallCollectInfo, cancelMallCollectInfo, addExchangeApplyGoodsInfo} from "@/api/mine";
  import {ImagePreview} from 'vant';

  export default {
    name: "goodsDetail",
    data() {
      return {
        goodsCount: 1,   //商品数量
        goodsInfo: null, //商品信息
        showTop: false,  //是否显示至顶部按钮
        scrollTop: 0,    //当前滚动距离
        images: [
          'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/picture/201812/20181225110618_RGfrA_初音5.jpg'
        ],  //轮播图所用图片数组
        startPosition: 0,//图片预览起始位置索引
        isCollect: false,
        collectId: 0,
        langCoin: 0,
        title:'商品详情',
        disabled:false
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path == "/converseRecord") {
          vm.title = '兑换详情';
          vm.disabled = true;

        }
      });
    },
    methods: {
      // 轮播图滑动改变索引
      swiperChange(index) {
        // console.log('当前轮播图索引', index);
        this.startPosition = index;
      },
      // 预览图片
      previewImg() {
        ImagePreview({
          images: this.images,
          startPosition: this.startPosition,
          className: 'imagePreview',
          onClose() {
            console.log("close");
          }
        });
      },
      // 监听滚动事件
      scroll(e) {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        console.log('滚动距离', e.target.scrollTop)
        this.scrollTop = e.target.scrollTop;
        // 滚动超过200时显示到顶部按钮
        if (e.target.scrollTop >= 200) {
          this.showTop = true;
        } else {
          this.showTop = false;
        }
      },
      // 滚动回到顶部,减速滚动
      toTop() {
        let timer = setInterval(() => {
          let speed = Math.floor(-this.scrollTop / 5);
          let top = this.scrollTop + speed;
          this.$refs['goodsDetail'].scrollTop = top;
          if (this.scrollTop === 0) {
            clearInterval(timer);
          }
          setTimeout(()=>{
            clearInterval(timer);
          },2000)
        }, 24);
      },
      // 收藏商品
      collect() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          collectAccountNo: this.$store.getters.getUserInfo.accountNo,
          objectTypeCd: "O01",
          objectId: this.$route.params.id,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addMallCollectInfo(params).then(res => {
          if (res.flag) {
            this.$toast.success('收藏成功！');
            this.isCollect = true;
            this.collectId = res.data[0].collectId
          }
        })
      },
      // 取消收藏
      cancelCollect() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          collectAccountNo: this.$store.getters.getUserInfo.accountNo,
          collectId: this.collectId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        cancelMallCollectInfo(params).then(res => {
          // console.log('cancelMallCollectInfo', res)
          if (res.flag) {
            this.isCollect = false;
            this.$toast.success('取消收藏成功！')
          }
        })
      },
      // 立即兑换商品
      convert() {
        console.log('兑换数量', this.goodsCount);
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          convertAccountNo: this.$store.getters.getUserInfo.accountNo,
          roleType: this.$store.getters.getUserInfo.roleType,
          goodsId: this.$route.params.id,
          schoolIdList: this.$store.getters.schoolIdList,
          goodsType: this.goodsInfo.goodsType,
          convertGoodsCount: this.goodsCount,
          ruleId: this.goodsInfo.mallConvertRuleInfo && this.goodsInfo.mallConvertRuleInfo.ruleId,
          stockId: this.goodsInfo.mallGoodsStockInfo && this.goodsInfo.mallGoodsStockInfo.stockId,
          belongSchoolId: this.$store.getters.schoolId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        };
        addExchangeApplyGoodsInfo(params).then(res => {
          if (res.flag) {
            this.$toast.success('兑换成功');
            this.$router.replace('/converseRecord');
          } else {
            this.$toast.fail(res.msg)
          }
        })
      },
      // 获取商品详情
      getGoodsDetail(id) {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          convertAccountNo: this.$store.getters.getUserInfo.accountNo,
          pageSize: 10,
          currentPage: 1,
          goodsId: id,
          schoolIdList: 24
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getGoodsList(params).then(res => {
          if (res.flag && res.data && res.data.length > 0) {
            this.goodsInfo = res.data[0]
            this.images = this.goodsInfo.goodsColorPhotoUrl.split(',');
            if (res.data[0].collectId) {
              this.collectId = res.data[0].collectId;
              this.isCollect = true;
            }
          }
        })
      },
    },
    created() {
      this.getGoodsDetail(this.$route.params.id);
      this.langCoin = window.localStorage.getItem('langCoin');

    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .goodsDetail {
    background: #f5f5f5;
    position: relative;

    &-header {
      height: 348px;
      background-color: #eee;
      position: relative;

      @{deep} .van-nav-bar {
        position: fixed;
        width: 100%;
        height: 44px;
        top: 0;
        /*background-color: rgba(200, 200, 200, 0);*/
        /*border-bottom: 1px solid #eee;*/

        .van-nav-bar__left .van-icon-arrow-left {
          /*font-size: 20px;*/
          /*padding: 5px;*/
          /*background-color: rgba(0, 0, 0, .3);*/
          /*border-radius: 50%;*/
          /*color: #fff;*/
        }

        .van-nav-bar__title {
          /*color: #fff;*/
        }
      }

      @{deep} .van-hairline--bottom:after {
        border: none;
      }

      @{deep} .van-swipe {
        height: 100%;
        margin-top: 44px;
        /*.van-swipe-item{*/
        /*  margin: 0 10px;*/
        /*}*/
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-body {
      .goodsInfo {
        background-color: #fff;

        > div {
          font-size: 14px;
          border-bottom: 1px solid #F5F6FA;
          padding: 10px;

          .goodsName {
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
            margin: 10px auto;
          }

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

          &.otherInfo {
            height: 50px;
            line-height: 30px;
            color: #333;

            span {
              color: #999;
            }
          }

        }
      }

      .remark {
        margin-top: 10px;

        @{deep} img {
          width: 100% !important;
          padding: 0 !important;
        }

        padding-bottom: 60px;
      }

    }

    &-footer {
      height: 50px;
      width: 100%;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      display: flex;

      .count {
        flex: 1;
        display: flex;
        align-self: center;
        justify-content: center;

        p {
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        @{deep} .van-stepper {
          button {
            border-radius: 50%;
            border: 1px solid #39F0DD;
            background-color: #fff;
            width: 20px;
            height: 20px;

            &::before {
              color: #39F0DD;
              width: 7px;
            }

            &::after {
              height: 7px;
              color: #39F0DD;
            }

          }

          input {
            border: 1px solid #39F0DD;
            width: 60px;
            height: 20px;
            border-radius: 20px;
            margin: 0 8px;
            background-color: #fff;
          }
        }
      }

      .btns {
        @{deep} .van-button {
          font-size: 14px;
          height: 100%;
          width: 90px;

          &.van-button--primary {
            color: #333333 !important;

            .van-button__icon {
              font-size: 18px;
              color: #FAD528;
            }
          }
          &.van-button--disabled{
            background-color: rgba(0,0,0,0.5)!important;
            border: none;
          }
        }
      }
    }

    .toTop {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background-color: #E0FFFC;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: fixed;
      right: 10px;
      bottom: 60px;
      box-shadow: 0px 2px 5px 0px rgba(166, 215, 210, 1);

      p {
        font-size: 10px;
        color: #39F0DD;

      }
    }
  }

</style>
