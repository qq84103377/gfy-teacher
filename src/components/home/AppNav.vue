<template>
  <div class="app-nav" v-show="show">
    <van-divider :style="{margin: '0'}"></van-divider>
    <div class="nav">
      <div
        class="nav-item"
        @click="handleChange(item)"
        v-for="(item,index) in tabData"
        :key="index"
      >
        <img class="icon" :class="{home:item.path==='/index',resCentre:item.path==='/resCentre',teachStat:item.path==='/teachStat/',mine:item.path==='/mine'}" :src="active == item.path ? item.active : item.normal"/>
        <div :class="{actived: active == item.path}">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import eventBus from "@/utils/eventBus";

  export default {
    name: "AppNav",
    computed: {
      active() {
        return this.$route.path;
      }
    },
    created() {
      // console.log(this.$route.meta.isGfy);
      // console.log(this.$route.meta);
    },
    mounted() {
      eventBus.$on('hideNav',bol => {
        this.show = bol
      })
    },
    data() {
      return {
        show: true,
        tabData: [
          {
            title: "课程",
            normal: require("../../assets/img/icon-home.png"),
            active: require("../../assets/img/icon-home-active.png"),
            path: "/index"
          },
          {
            title: "资源中心",
            normal: require("../../assets/img/icon-res1.png"),
            active: require("../../assets/img/icon-res1-active.png"),
            path: "/resCentre"
          },
          {
            title: "教学统计",
            normal: require("../../assets/img/icon-linear.png"),
            active: require("../../assets/img/icon-linear-aactive.png"),
            path: "/teachStat/"
          },
          {
            title: "我的",
            normal: require("../../assets/img/icon-mine.png"),
            active: require("../../assets/img/icon-mine-active.png"),
            path: "/mine"
          }
        ],
      };
    },
    methods: {
      handleChange(item) {
        if (item.path) {
          if(item.path === '/resCentre') {
            try{MobclickAgent.onEvent('clickResCenter')}catch(e){console.log(e)}
          }else if (item.path === '/teachStat/') {
            try{MobclickAgent.onEvent('clickTeachStat')}catch(e){console.log(e)}
          }
          this.$store.commit('setTeachStatFilterTime', '')
          this.$store.commit('setTimeRangeActive', 1)
          this.$router.replace(item.path);
        } else {
          this.$toast.fail('敬请期待')
        }

      }
    }
  };
</script>

<style lang="less" scoped>
  .app-nav {
    .loand {
      height: 30px;
      width: 100%;
      margin-bottom: 45px;
      background-color: transparent;
    }

    .gfy-nav,
    .nav {
      height: 48px;
      display: flex;
      padding: 6px 0 3px;
      &-item {
        flex: 1;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;



        .actived {
          color: @blue;
        }
      }
    }

    .home{
      width: 22px;
      height: 22px;
    }
    .resCentre{
      width: 19px;
      height: 22px;
    }
    .teachStat{
      width: 21px;
      height: 17.5px;
    }
    .mine{
      width: 22px;
      height: 22px;
    }
  }
</style>

