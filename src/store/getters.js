import { parentGetters } from './modules/parent-GFY'

const getters = {
  vanLoading: state => state.setting.vanLoading,
  getUserInfo: state => state.user.userInfo || JSON.parse(localStorage.getItem('userInfo')),
  getThirdInfo: state => state.user.thirdInfo || JSON.parse(localStorage.getItem('thirdInfo')),
  getGrade: state => state.user.grade || localStorage.getItem('grade'),
  getSearchInfo: state => state.user.searchInfo || JSON.parse(localStorage.getItem('searchInfo')),
  getArticleInfo: state => state.user.articleInfo || JSON.parse(localStorage.getItem('articleInfo')),
  getArticleScroll: state => state.user.articleScroll || JSON.parse(localStorage.getItem('articleScroll')),
  getRecommentList: state => state.user.recommentList || JSON.parse(localStorage.getItem('recommentList')),
  getLastArticle: state => state.user.lastArticle || JSON.parse(localStorage.getItem('lastArticle')),
  ...parentGetters
}
export default getters
