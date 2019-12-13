export default {
  goBack(that) {
    console.log('路由页面' + that.$route.meta.title + '按了返回')
    console.log('appHeader当前路由记录' + that.$navigation.getRoutes())
    if (that.$navigation.getRoutes() && that.$navigation.getRoutes().length > 1) {
      console.log('存在路由记录')
      window.history.back()
    } else {
      that.$router.replace('/index')
    }
  },

}
