const getClassIndexFn = () => {
  let flag = false
  let index = ''
  for(let key in JSON.parse(localStorage.getItem("classMap"))) {
    if(JSON.parse(localStorage.getItem("classMap"))[key].teacherInfoList.some(s => s.subjectType !== 'S20' && s.teacherType === 'T01')) {
      if(!flag) {
        flag = true
        index = key
      }
    }
  }
  return index
}
const teachStat = {
  state: {
    tempGradeIndex: 0,
    tempSubjectIndex: 0,
    gradeIndex: 0,
    subjectIndex: 0,
    classIndex: localStorage.getItem("classMap") ? Object.keys(JSON.parse(localStorage.getItem("classMap")))[0] : '',
    interlGradeList:"",
    interlClassIndex:0,
    timeRangeActive: 1, //时间筛选默认选中
  },

  mutations: {
    setTempGradeIndex: (state, index) => {
      state.tempGradeIndex = index
    },
    setGradeIndex: (state, index) => {
      state.gradeIndex = index
    },
    setSubjectIndex: (state, index) => {
      state.subjectIndex = index
    },
    setTempSubjectIndex: (state, index) => {
      state.tempSubjectIndex = index
    },
    setClassIndex: (state, index) => {
      state.classIndex = index
    },
    setInterlGradeList: (state, data) => {
      state.interlGradeList = data
    },
    setInterlClassIndex: (state, index) => {
      state.interlClassIndex = index
    },
    setTimeRangeActive: (state, index) => {
      state.timeRangeActive = index
    },

  },
  actions: {}
}

export default teachStat
