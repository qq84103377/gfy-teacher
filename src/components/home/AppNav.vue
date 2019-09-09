<template>
  <div class="app-nav">
    <van-divider :style="{margin: '0'}"></van-divider>
    <div class="nav">
      <div
        class="nav-item"
        @click="handleChange(item)"
        v-for="(item,index) in tabData"
        :key="index"
      >
        <img class="icon" :src="active == item.path ? item.active : item.normal" />
        <div :class="{actived: active == item.path}">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>

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
  data() {
    return {
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
          // path: "/resCentre"
        },
        {
          title: "教学统计",
          normal: require("../../assets/img/icon-linear.png"),
          active: require("../../assets/img/icon-linear-aactive.png"),
          // path: "/mine"
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
        this.$router.replace(item.path);
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
    &-item {
      flex: 1;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 24px;
        height: 22px;
      }
      .actived {
        color: @blue;
      }
    }
  }

  .icon {
    width: 23.5px;
    height: 22.5px;
  }
}
</style>

