<template>
  <div class="container gfy-scroll-container">
    <app-header v-show="$route.meta.isShowHeader"></app-header>
    <section class="gfy-scroll-view">
      <div class="loading-wrap" style="z-index: 9999" v-show="vanLoading">
        <van-loading class="inline-loading" type="spinner" color="#1989fa" />
      </div>
      <router-view class="gfy-router-view"></router-view>
    </section>
    <app-nav class="app-nav" v-show="$route.meta.isShowNav"></app-nav>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import AppHeader from '../components/home/AppHeader'
import AppNav from '../components/home/AppNav'

export default {
  name: 'home',
  components: {
    AppHeader,
    AppNav
  },
  computed: {
    ...mapState({
      vanLoading: state => state.setting.vanLoading
    })
  }
}
</script>

<style lang="less" scoped>
.gfy-scroll-view {
  overflow: hidden;
}

.gfy-router-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.loading-wrap {
  height: calc(100% - 50px);
  position: fixed;
  flex: 1;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: rgba(255, 255, 255, .9);
  .inline-loading {
    margin-top: -100px;
  }
}
.app-nav{
  z-index: 999;
}
</style>
