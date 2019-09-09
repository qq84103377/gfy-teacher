<template>
    <section class="index-content-wrap">
        <van-button type="default" size="large" @click="loginOut">退出账号</van-button>
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
      };
    },
    components: {

    },
    computed: {
      isApp() {
        return "cordova" in window;
      }
    },
    methods: {
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
    .account {
        position: relative;
        background-color: #eee;
        &-safety {
            margin: 5px 0;
        }
        &-body {
            @{deep} .van-switch {
                font-size: 20px !important;
            }
            @{deep} .van-cell__title {
                align-self: center;
            }
            @{deep} .van-cell__value {
                display: flex;
                justify-content: flex-end;
                align-self: center;
            }
        }

        &-clear {
            text-align: center;
            color: #ff0000;
        }
        .loginOut {
            width: 100%;
            position: absolute;
            bottom: 0px;
            padding: 10px;
        }
        .van-action-sheet {
            max-height: 100%;
            // color: #323233;
            @{deep} .showLogin-title {
                background-color: transparent;
                padding-left: 10px;
                padding-top: 5px;
                height: 50px;
                line-height: 50px;
                width: 100%;
                position: absolute;
                z-index: 9999999999999;
                .van-icon {
                    font-size: 25px;
                }
            }
        }
    }
</style>



