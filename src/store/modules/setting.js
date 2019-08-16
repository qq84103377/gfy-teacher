const state = {
  vanLoading: false,
  teamList: []
}

const mutations = {
  setVanLoading (state, data) {
    state.vanLoading = data
  },
  setTeamList (state,data) {
    state.teamList = data
  }
}

const actions = {

}

const getters = {
  getVanLoading (state) {
    return state.vanLoading
  },
  getTeamList(state) {
    return state.teamList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
