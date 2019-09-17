<template>
  <section class="mine-wrap">
    <div class="mine-wrap__header">
      <div class="mine-wrap__header-info">我的</div>
      <div class="mine-wrap__header-grid">
        <div class="mine-wrap__header-grid-in">
          <div class="avatar">
            <div>
              <img src="http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/icon/201812/20181227120023_Er4ad_IMG_0645.JPG" alt="">
            </div>
          </div>
          <div class="userinfo">
            <div class="userinfo-top">
              <span>李老师</span>
              <van-tag color="#F7DB3F">语文</van-tag>
              <van-tag color="#F7DB3F">数学</van-tag>
              <van-tag color="#F7DB3F">英语</van-tag>
            </div>
            <div class="userinfo-bottom">
              <span>大良校区</span>
              <span>容桂校区</span>
              <span>大良校区</span>
              <span>大良校区</span>
              <span>大良校区</span>
              <span>容桂校区</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mine-wrap__body">
      <div class="mine-wrap__body-grid">
        <div class="mine-wrap__body-grid-top">
          <div>
            <span>1111</span>
            <div>任务数</div>
          </div>
          <div>
            <span>1111</span>
            <div>课程数</div>
          </div>
          <div>
            <span>1111</span>
            <div>郎币数</div>
          </div>
          <div>
            <span>1111</span>
            <div>等级</div>
          </div>
        </div>
      </div>
      <div class="mine-wrap__body-menu">
        <van-grid :column-num="3">
          <van-grid-item
            v-for="item in gridData"
            :key="item.text"
            :icon="item.icon"
            :text="item.text"
            @click="jumpTo(item.url)"
          />
        </van-grid>
      </div>
    </div>
  </section>
</template>

<script>

  export default {
    data() {
      return {
        checked: true,
        cookies: 3.75,
        type: "",
        showLogin: false,
        gridData: [
          {
            text: "个人信息",
            icon: require("../../assets/img/myself-icon-2.png"),
            url: ""
          },
          {
            text: "积分商城",
            icon: require("../../assets/img/myself-icon-3.png"),
            url: ""
          },
          {
            text: "使用帮助",
            icon: require("../../assets/img/myself-icon-4.png"),
            url: ""

          },
          {
            text: "我的等级",
            icon: require("../../assets/img/myself-icon-5.png"),
            url: ""

          },
          {
            text: "我的提醒",
            icon: require("../../assets/img/myself-icon-6.png"),
            url: ""

          },
          {
            text: "个人设置",
            icon: require("../../assets/img/myself-icon-7.png"),
            url: ""

          },
          {
            text: "为您服务",
            icon: require("../../assets/img/myself-icon-8.png"),
            url: ""

          },
          {
            text: "意见反馈",
            icon: require("../../assets/img/myself-icon-9.png"),
            url: ""
          },
          {
            text: "退出登录",
            icon: require("../../assets/img/myself-icon-10.png"),
            url: "loginOut"
          },
        ]

      };
    },
    components: {},
    computed: {
      isApp() {
        return "cordova" in window;
      }
    },
    methods: {
      jumpTo(url) {
        if (url == 'loginOut') {
          this.loginOut();
        }
      },
      loginOut() {
        this.$dialog
          .confirm({
            title: "",
            message: "确定退出账户吗？",
            cancelButtonText: "确定退出",
            confirmButtonText: "我点错了"
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            // this.$toast.success("已退出账号!");
            // this.$store.commit("setUserInfo", {});
            // this.$store.commit("seThirdInfo", {});
            // this.$store.commit("SET_clear");
            // this.$store.commit("setUserClear");
            // let searchList = localStorage.getItem("searchInfo");
            localStorage.clear();
            // localStorage.setItem("searchInfo", searchList);
            this.$forceUpdate();
            this.$router.replace("/login");
            // this.$router.go(0);
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .mine-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    &__header {
      height: 177px;
      background-size: 100%;
      position: relative;
      background: -webkit-linear-gradient(#95F9EE, #25DBF1); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#95F9EE, #25DBF1); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#95F9EE, #25DBF1); /* Firefox 3.6 - 15 */
      background: linear-gradient(#95F9EE, #25DBF1); /* 标准的语法 */
      &-info {
        padding-top: 13px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: 500;
      }
      &-grid {
        padding: 0 10px;
        height: 135px;
        width: 100%;
        position: absolute;
        border-radius: 5px;
        /*bottom: -17px;*/
        top: 55px;
        left: 0;
        &-in {
          display: flex;
          background: #fff;
          height: 100%;
          /*box-shadow: 0px 2px 11px 2px rgba(0, 0, 0, 0.06);*/

          .avatar {
            width: 86px;
            padding: 32px 17px;

            div {
              width: 69px;
              height: 69px;
              border-radius: 69px;
              background-color: #ff6302;
              overflow: hidden;
              img{
                width: 100%;
                height: 100%;
              }
            }
          }

          .userinfo {
            flex: 1;
            padding: 32px 35px 32px 17px;

            &-top {
              span {
                font-size: 16px;
                font-weight: 500;
              }

              @{deep} .van-tag {
                font-size: 12px;
                margin-left: 8px;
                border-radius: 10px;
              }
            }

            &-bottom {
              span {
                margin-right: 15px;
                font-size: 14px;
                font-weight: 500;
                color: #999999;
                line-height: 25px;
              }
            }
          }
        }
      }
    }

    &__body {
      /*margin-top: 26px;*/
      margin-bottom: 13px;
      position: absolute;
      top: 203px;

      &-grid {
        padding: 0 10px;
        height: 55px;
        width: 100%;
        border-radius: 5px;
        &-top {
          display: flex;
          justify-content: space-around;
          background: #fff;
          height: 100%;
          /*box-shadow: 0px 2px 11px 2px rgba(0, 0, 0, 0.06);*/

          > div {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
          }
        }
      }

      &-menu {
        padding: 0 10px;
        width: 100%;
        border-radius: 5px;
        margin-top: 10px;
        @{deep} .van-icon__image{
          width: 26px;
          height: 26px;
        }
        @{deep} .van-grid-item__text{
          font-size: 14px;
        }
      }
    }
  }
</style>



