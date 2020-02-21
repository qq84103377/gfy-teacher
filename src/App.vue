<template>
  <div id="app">
<!--    由于用了vue-navigation插件,所以如果有页面使用了子路由嵌套,当进入子路由时,父路由会重新触发created,相当于新渲染了一个父页面
    暂时先根据有子路由嵌套的路径判断不使用页面缓存(有时间再改),vue-navigation也没有指定页面不缓存的功能 (已修改)-->
<!--    <router-view v-if="includes()"></router-view>-->
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
      includes() {
       return [''].includes(this.$route.path)
      },
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
@import 'vant/lib/index.css';
@import "vant/lib/icon/local.css";
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
