const teachStat = {
  state: {
    tempGradeIndex: 0,
    tempSubjectIndex: 0,
    gradeIndex: 0,
    subjectIndex: 0,
    classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
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

  },
  actions: {}
}

export default teachStat
