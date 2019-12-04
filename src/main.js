import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueCropper from "vue-cropper"

import * as fundebug from 'fundebug-javascript'
import fundebugVue from 'fundebug-vue'
import Navigation from 'vue-navigation'
import * as myFilter from './utils/filter'
import * as calculate from './utils/calculate'
import VConsole from 'vconsole/dist/vconsole.min.js'
import viewportUnitsBuggyfill from 'viewport-units-buggyfill'

// 引入vant组件
import {
  Button,
  Overlay,
  Field,
  Dialog,
  Loading,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Toast,
  ActionSheet,
  NumberKeyboard,
  DropdownMenu,
  DropdownItem,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  List,
  PullRefresh,
  Search,
  Tag,
  Popup,
  IndexBar,
  IndexAnchor,
  Row,
  Col,
  Divider,
  Collapse,
  CollapseItem,
  Uploader,
  Notify,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  ImagePreview,
  SwipeCell,
  DatetimePicker,
  Skeleton,
  Grid,
  GridItem,
  Progress,
  Picker,
  Stepper,
  slider,
  Lazyload,
  Sticky
} from 'vant'
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
//
// Vue.use(AlloyFingerPlugin,{
//   AlloyFinger
// })
viewportUnitsBuggyfill.init({
  hacks: viewportUnitsBuggyfill.hacks
})
Vue.use(Navigation, {
  router
})
Vue.use(VueCropper)
let vConsole = new VConsole()
Vue.use(Button).use(Field).use(Dialog).use(Loading).use(NavBar).use(Overlay)
  .use(Tabbar).use(TabbarItem).use(Icon).use(Toast).use(ActionSheet).use(CheckboxGroup).use(Checkbox)
  .use(NumberKeyboard).use(DropdownMenu).use(DropdownItem).use(Tab).use(Uploader).use(RadioGroup).use(Radio)
  .use(Tabs).use(Swipe).use(SwipeItem).use(Cell).use(CellGroup).use(Collapse).use(CollapseItem)
  .use(List).use(PullRefresh).use(Search).use(Tag).use(Popup).use(IndexBar).use(IndexAnchor).use(Row).use(Col).use(Divider)
  .use(Notify).use(RadioGroup).use(Radio).use(ImagePreview).use(SwipeCell).use(DatetimePicker ).use(Skeleton).use(Grid).use(GridItem).use(Progress).use(Picker).use(Stepper).use(Lazyload).use(slider).use(Sticky)

// 配置fundebug
fundebug.apikey =
    "2091a697df9cede7b8df8f5b6d37126230448548399ed1e5227851515fa006eb"
fundebugVue(fundebug, Vue)

//集成环境或者正式环境才收集错误信息
if (process.env.NODE_ENV == "sit" || process.env.NODE_ENV == "production") {
  fundebug.silentDev = false
  // fundebug.silentConsole = false
} else {
  fundebug.silentDev = true
  // fundebug.silentConsole = true
}
Object.keys(myFilter).forEach(key => {
  Vue.filter(key, myFilter[key])
})
Object.keys(calculate).forEach(key => {
  Vue.filter(key, calculate[key])
})
Vue.config.productionTip = false
//
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    if (localStorage.getItem('isLogin')) {
      next('/index')
    }
  }
  if (from.path == "/login" && (to.path == "/mine" || to.path == "/setting")) {
    console.log("退出登录不能返回我的页面")
    if (!localStorage.getItem('isLogin')) {
      next("/login")
    }
  }
  next()
})


// ios微信浏览器适配导航栏
pushHistory()

function pushHistory() {
  var state1 = {}
  window.history.pushState(state1, "", window.location.href)
}

document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
  WeixinJSBridge.call("hideToolbar")
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
