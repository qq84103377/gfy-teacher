const state = {
  vanLoading: false,
  teamList: [],
  resourceInfo: {}, //资源信息
  tchCourseInfo: {}, //课程信息
  taskClassInfo: {}, //任务班级
  gradeTermList: [], //年级学期
  isAddWare: false,
  sendTaskClassStudent: {}, //发任务班级学生信息
  sendTaskClassSubGroup: {}, //发任务班级分组信息
  sendTaskInfo: {}, //发布的任务信息
  fullscreen: false,
  errorBookSelected: [],  //错题本选择的试题
  errorBookCourse: [], //错题本选择的课程
  errorBookQuestionCourse: [], //错题本选择试题时对应的课程ID
  errorFilterParams: {}, //错题本筛选条件
  resQuestionSelect: [], //资源中心选择的试题
  removeQuestionList: [], //资源中心试题列表移除的试题ID
  isRevert: false, //试题列表选择其他按钮是否显示为返回按钮
  isStuBoard: false, //课中白板是否选择学生白板

  filterYear: '', //筛选年段
  filterSubject: '', //筛选科目
  filterSubjectLabel:'',
  teachStatFilterTime: '', //教学统计时间筛选
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
  },
  setFullscreen(state, fullscreen) {
    state.fullscreen = fullscreen
    localStorage.setItem("fullscreen", JSON.stringify(fullscreen))
  },
  setErrorBookSelected(state,data) {
    state.errorBookSelected = data
  },
  setErrorBookCourse(state,data) {
    state.errorBookCourse = data
  },
  setErrorBookQuestionCourse(state,data) {
    if(Array.isArray(data)) {
      state.errorBookQuestionCourse = data
    }else {
      if(state.errorBookQuestionCourse.indexOf(data) === -1) {
        state.errorBookQuestionCourse.push(data)
      }
    }
  },
  setErrorFilterParams(state,data) {
    state.errorFilterParams = data
  },
  setResQuestionSelect(state,data) {
    state.resQuestionSelect = data
  },
  setRemoveQuestionList(state,data) {
    state.removeQuestionList = data
  },
  setIsRevert(state,data) {
    state.isRevert = data
  },
  setIsStuBoard(state,data) {
    state.isStuBoard = data
  },
  setFilterYear(state,data) {
    state.filterYear = data
    localStorage.setItem('filterYear', JSON.stringify(data))
  },
  setFilterSubject(state,data) {
    state.filterSubject = data
    localStorage.setItem('filterSubject', JSON.stringify(data))
  },
  setFilterSubjectLabel(state,data) {
    state.filterSubjectLabel = data
    localStorage.setItem('filterSubjectLabel', JSON.stringify(data))
  },
  setTeachStatFilterTime(state,data) {
    state.teachStatFilterTime = data
  },
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
  },
  getErrorBookSelected: state => state.errorBookSelected,
  getErrorBookCourse: state => state.errorBookCourse,
  getErrorBookQuestionCourse: state => state.errorBookQuestionCourse,
  getErrorFilterParams: state => state.errorFilterParams,
  getResQuestionSelect: state => state.resQuestionSelect,
  getRemoveQuestionList: state => state.removeQuestionList,
  getIsRevert: state => state.isRevert,
  getIsStuBoard: state => state.isStuBoard,
  getTeachStatFilterTime: state => state.teachStatFilterTime,

  getFilterYear: state => state.filterYear || localStorage.getItem('filterYear') ? JSON.parse(localStorage.getItem('filterYear')) : '',
  getFilterSubject: state => state.filterSubject ||  localStorage.getItem('filterSubject') ?JSON.parse(localStorage.getItem('filterSubject')):'',
  getFilterSubjectLabel: state => state.filterSubjectLabel ||  localStorage.getItem('filterSubjectLabel') ?JSON.parse(localStorage.getItem('filterSubjectLabel')):'',
};

export default {
  state,
  mutations,
  actions,
  getters
}
