const state = {
  vanLoading: false,
  teamList: [],
  resourceInfo:{},//资源信息
  tchCourseInfo:{},//课程信息
  taskClassInfo:{},//任务班级
  gradeTermList:[],//年级学期
  isAddWare: false
}

const mutations = {
  setVanLoading (state, data) {
    state.vanLoading = data
  },
  setTeamList (state,data) {
    state.teamList = data
  },
  setResourceInfo(state, data) {
    console.log("resourceInfo", data)
    state.resourceInfo = data
  },
  setTchCourseInfo(state,tch){
    state.tchCourseInfo = tch
  },
  setTaskClassInfo(state,data){
    state.taskClassInfo = data
  },
  setGradeTermList(state,data){
    state.gradeTermList = data
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
  getResourceInfo: state => state.resourceInfo,
  getTchCourseInfo: state => state.tchCourseInfo,
  getTaskClassInfo: state => state.taskClassInfo,
  getGradeTermInfo:state =>state.gradeTermList,
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
