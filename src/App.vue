<template>
  <div id="app">
    <navigation>
      <router-view></router-view>
    </navigation>
    <upgrade></upgrade>
  </div>
</template>

<script>
  import upgrade from './components/Upgrade'
export default {
    components: {upgrade},
  data() {
    return {
      mql: window.matchMedia("(orientation: portrait)"),
    }
  },
  mounted() {
    console.log('app页面 mounted')

    this.onMatchMeidaChange(this.mql);
    this.mql.addListener(this.onMatchMeidaChange);
  },
  methods: {
    onMatchMeidaChange(mql) {
      if (mql.matches) {
        // 竖屏
        console.log("竖屏");
        this.$store.commit('setFullscreen', false)

      } else {
        // 横屏
        console.log("横屏");

        // this.isLandscape = true
      }
    },
  },
}
</script>

<style lang="less">
@import "./assets/style/reset.less";
@import "./assets/style/common.less";
@import "./assets/style/icon.less";
@import "assets/style/resetVant.less";

body {
  font-size: 16px;
  font-family: Adobe Heiti Std R;
  background-color: #ffffff;
  color: #333333;
  // padding-top: constant(safe-area-inset-top);
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
}
</style>
