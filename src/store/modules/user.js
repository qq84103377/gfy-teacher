const user = {
    state: {
        userInfo: "",
        thirdInfo: "",
        grade:"",
        searchInfo:"",
        articleInfo:[],
        articleScroll:[],
        recommentList:[],
        lastArticle:''
       
    },

    mutations: {
        setUserInfo: (state, userInfo) => {
            state.userInfo = userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        },
        seThirdInfo: (state, thirdInfo) => {
            state.thirdInfo = thirdInfo
            localStorage.setItem('thirdInfo', JSON.stringify(thirdInfo))
        },
        setGrade: (state, grade) => {
            state.grade = grade
            localStorage.setItem('grade', grade)
        },
        setSearchInfo: (state, searchInfo) => {
            state.searchInfo = searchInfo
            localStorage.setItem('searchInfo', JSON.stringify(searchInfo))
        },
        setArticleInfo: (state, articleInfo) => {
            state.articleInfo = articleInfo
            localStorage.setItem('articleInfo', JSON.stringify(articleInfo))
        },
        setArticleScroll: (state, articleScroll) => {
            state.articleScroll = articleScroll
            localStorage.setItem('articleScroll', JSON.stringify(articleScroll))
        },
        setRecommentList: (state, recommentList) => {
            state.recommentList = recommentList
            localStorage.setItem('recommentList', JSON.stringify(recommentList))
        },
        setLastArticle: (state, lastArticle) => {
            state.lastArticle = lastArticle
            localStorage.setItem('lastArticle', JSON.stringify(lastArticle))
        },
        // getUserInfo:
       
    },
    actions: {}
}

export default user
