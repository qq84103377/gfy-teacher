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
        // {
        //   title: "首页",
        //   normal: require("../../assets/img/icon-home-gray.png"),
        //   active: require("../../assets/img/icon-home-blue.png"),
        //   path: "/index"
        // },
        // {
        //   title: "课程 & 活动",
        //   normal: require("../../assets/img/icon-Course-activities-gray.png"),
        //   active: require("../../assets/img/icon-Course-activities-blue.png"),
        //   path: "/activity"
        // },
        // {
        //   title: "我的",
        //   normal: require("../../assets/img/icon-personal-gray.png"),
        //   active: require("../../assets/img/icon-personal-blue.png"),
        //   path: "/mine"
        // }
      ],
    };
  },
  methods: {
    handleChange(item) {
      this.$router.replace(item.path);
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
        color: #57c3fe;
      }
    }
  }

  .icon {
    width: 23.5px;
    height: 22.5px;
  }
}
</style>

