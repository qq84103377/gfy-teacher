import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueCropper from "vue-cropper"

// import * as fundebug from 'fundebug-javascript'
// import fundebugVue from 'fundebug-vue'
import Navigation from 'vue-navigation'
import * as myFilter from './utils/filter'
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
  Stepper
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
  .use(Notify).use(RadioGroup).use(Radio).use(ImagePreview).use(SwipeCell).use(DatetimePicker ).use(Skeleton).use(Grid).use(GridItem).use(Progress).use(Picker).use(Stepper)

// 配置fundebug
// fundebug.apikey = 'cfa2bb54f98fa9956f7bf365ac408cc085faaab93013d5ffbd1394a508eb380e'
// fundebugVue(fundebug, Vue)
Object.keys(myFilter).forEach(key => {
  Vue.filter(key, myFilter[key])
})
Vue.config.productionTip = false
//
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    if (localStorage.getItem('isLogin')) {
      next('/index')
    }
  }
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
