const state = {
  vanLoading: false,
  teamList: [],
  resourceInfo:{},//资源信息
  tchCourseInfo:{},//课程信息
  taskClassInfo:{},//任务班级
  gradeTermList:[],//年级学期
  isAddWare: false,
  sendTaskClassStudent:{},//发任务班级学生信息
  sendTaskClassSubGroup:{},//发任务班级分组信息
  sendTaskInfo:{},//发布的任务信息
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
  setSendTaskClassStudent(state, data){
    state.sendTaskClassStudent = data
  },
  setSendTaskClassSubGroup(state, data){
    state.sendTaskClassSubGroup = data
  },
  setSendTaskInfo(state, data){
    state.sendTaskInfo = data
  }
}

const actions = {

}

const getters = {
  getVanLoading(state) {
    return state.vanLoading
  },
  getTeamList(state) {
    return state.teamList
  },
  getResourceInfo: state => state.resourceInfo,
  getTchCourseInfo: state => state.tchCourseInfo,
  getTaskClassInfo: state => state.taskClassInfo,
  getGradeTermInfo: state => state.gradeTermList,
  getSendTaskClassStudent: state => state.sendTaskClassStudent,
  getSendTaskClassSubGroup: state => state.sendTaskClassSubGroup,
  getSendTaskInfo: state => state.sendTaskInfo,
  getIsAddWare(state) {
    return state.isAddWare
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
