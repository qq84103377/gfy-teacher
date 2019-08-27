const state = {
  vanLoading: false,
  teamList: [],
  isAddWare: false
}

const mutations = {
  setVanLoading (state, data) {
    state.vanLoading = data
  },
  setTeamList (state,data) {
    state.teamList = data
  },
  setIsAddWare (state,data) {
    state.isAddWare = data
  },
}

const actions = {

}

const getters = {
  getVanLoading (state) {
    return state.vanLoading
  },
  getTeamList(state) {
    return state.teamList
  },
  getIsAddWare(state) {
    return state.isAddWare
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
