const state = {
  vanLoading: false
}

const mutations = {
  setVanLoading (state, data) {
    state.vanLoading = data
  }
}

const actions = {

}

const getters = {
  getVanLoading (state) {
    return state.vanLoading
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
