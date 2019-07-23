import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
// import * as fundebug from 'fundebug-javascript'
// import fundebugVue from 'fundebug-vue'
import Navigation from 'vue-navigation'
import * as myFilter from './utils/filter'

// 引入vant组件
import {
  Button,
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
  ImagePreview
} from 'vant'
Vue.use(Navigation, {
  router
})

Vue.use(Button).use(Field).use(Dialog).use(Loading).use(NavBar)
  .use(Tabbar).use(TabbarItem).use(Icon).use(Toast).use(ActionSheet).use(CheckboxGroup).use(Checkbox)
  .use(NumberKeyboard).use(DropdownMenu).use(DropdownItem).use(Tab).use(Uploader).use(RadioGroup).use(Radio)
  .use(Tabs).use(Swipe).use(SwipeItem).use(Cell).use(CellGroup).use(Collapse).use(CollapseItem)
  .use(List).use(PullRefresh).use(Search).use(Tag).use(Popup).use(IndexBar).use(IndexAnchor).use(Row).use(Col).use(Divider)
  .use(Notify).use(RadioGroup).use(Radio).use(ImagePreview)

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
    if (store.getters.getThirdInfo) {
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
