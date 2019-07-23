import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import setting from './modules/setting'
import user from './modules/user'
import parent from './modules/parent-GFY'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    setting,
    user,
    parent
  },
  getters,
  state: parent.state
})

export default store
