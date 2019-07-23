<template>
  <div id="app">
    <navigation>
      <router-view></router-view>
    </navigation>
  </div>
</template>

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
