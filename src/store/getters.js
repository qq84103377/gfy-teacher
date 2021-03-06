import { parentGetters } from './modules/parent-GFY'

const getters = {
  schoolId: state => {
    const schoolMap = state.user.schoolMap || (localStorage.getItem("schoolMap") ? JSON.parse(localStorage.getItem("schoolMap")) : '')
    return schoolMap ? Object.keys(schoolMap)[0] : ''
  },
  schoolIdList:()=>{
    const schoolMap = (localStorage.getItem("schoolMap") ? JSON.parse(localStorage.getItem("schoolMap")) : '')
    return schoolMap ? Object.keys(schoolMap).join() : ''
  },
  vanLoading: state => state.setting.vanLoading,
  getUserInfo: state => state.user.userInfo || JSON.parse(localStorage.getItem('userInfo')),
  getThirdInfo: state => state.user.thirdInfo || JSON.parse(localStorage.getItem('thirdInfo')),
  getGrade: state => state.user.grade || localStorage.getItem('grade'),
  getSearchInfo: state => state.user.searchInfo || JSON.parse(localStorage.getItem('searchInfo')),
  getArticleInfo: state => state.user.articleInfo || JSON.parse(localStorage.getItem('articleInfo')),
  getArticleScroll: state => state.user.articleScroll || JSON.parse(localStorage.getItem('articleScroll')),
  getRecommentList: state => state.user.recommentList || JSON.parse(localStorage.getItem('recommentList')),
  getLastArticle: state => state.user.lastArticle || JSON.parse(localStorage.getItem('lastArticle')),
  getTempGradeIndex: state => state.teachStat.tempGradeIndex,
  getTempSubjectIndex: state => state.teachStat.tempSubjectIndex,
  getSubjectIndex: state => state.teachStat.subjectIndex,
  getGradeIndex: state => state.teachStat.gradeIndex,
  getClassIndex: state => state.teachStat.classIndex,
  getInterlGradeList: state => state.teachStat.interlGradeList,
  getInterlClassIndex: state => state.teachStat.interlClassIndex,
  getTimeRangeActive: state => state.teachStat.timeRangeActive,
  ...parentGetters
}
export default getters
