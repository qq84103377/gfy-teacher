<template>
  <div class="correct-wrap" id="correct-wrap">
    <div class="correct-wrap__header" v-show="!isFold">
      <van-icon @click="$router.back()" name="arrow-left"/>
      <span>{{getStudentName(stuArr[stuIndex].accountNo,classId)}}({{stuArr[stuIndex].rewardScore}})</span>
      <span>题号:{{$route.params.examNum}}{{info.groupExamList.length?`(${aswIndex+1})`:``}}</span>
      <span>进度：{{progress}}/{{stuArr.length}}</span>
      <i @click="zoom(1)" class="iconGFY icon-enlarge"></i>
      <i @click="zoom(0)" class="iconGFY icon-reduce"></i>
      <i class="iconGFY icon-rotate-left" @click="rotateLeft"></i>
      <i class="iconGFY icon-rotate-right" @click="rotateRight"></i>
      <span @click="viewOriginExam">看原题</span>
      <span @click="viewStuInfo">阅卷情况</span>
      <span class="action-btn" @click="saveRewardScore('T01')">加分</span>
      <span class="action-btn" style="background: #FABC73;" @click="saveRewardScore('T02')">减分</span>
      <span @click="clickComment" class="action-btn comment-btn"
            :class="{done: info.appraiseList.some(v => v.objectId === stuArr[stuIndex].answer[aswIndex].seqId)}">{{info.appraiseList.some(v => v.objectId === stuArr[stuIndex].answer[aswIndex].seqId)?'已点评':'点评'}}</span>
    </div>
    <i v-if="!(aswIndex==0&&stuIndex==0&&imgIndex==0)&&!isFold" class="iconGFY icon-circle-arrow"
       @click="toggle(0)"></i>
    <i v-if="!isFold" class="iconGFY icon-circle-arrow rotate" @click="next"></i>
    <div class="correct-wrap__side" v-show="!isFold">
      <div class="correct-wrap__side-top">
        <div class="score-btn"
             @click="fullScore">
          满分
        </div>
        <div class="score-btn" style="background: #FA7373;"
             @click="zeroScore">零分
        </div>
      </div>
      <div class="correct-wrap__side-step">
        <div style="flex: 1">步长: </div><i @click="showTip=true" style="vertical-align: baseline" class="iconGFY icon-tip"></i>
        <div @click="setStep(0.5)" class="correct-wrap__side-step__btn" :class="{active:step===0.5}">0.5</div>
        <div @click="setStep(1)" class="correct-wrap__side-step__btn" :class="{active:step===1}">1</div>
      </div>
      <div class="correct-wrap__side-center">
        <div v-for="(asw,ai) in stuArr[stuIndex].answer" :key="ai" class="dropdown-group"><span>{{$route.params.examNum}}{{info.groupExamList.length?`(${ai+1})`:``}}</span>
<!--          <van-dropdown-menu :class="{'is-check':asw.value === 0 || asw.value || asw.isMark==='I01'}" :overlay="false">-->
<!--            <van-dropdown-item :disabled="ai !== aswIndex" :ref="'menuItem' + ai"-->
<!--                               :title="((asw.isMark==='I01'&&asw.value===undefined)?asw.score:((asw.value === 0 || asw.value)? asw.value : asw.score)) + '分'">-->
<!--                <div @click="selectScore(ai,score,asw)" class="menu-item"-->
<!--                     v-for="(score,scoreIndex) in  splitScore(asw.examScore || 5)"-->
<!--                     :key="scoreIndex">{{score}}分-->
<!--                </div>-->
<!--            </van-dropdown-item>-->
<!--          </van-dropdown-menu>-->
          <div @click="scorePopShow(asw,ai)" class="select-score" :class="{'red':asw.value === 0 || asw.value || asw.isMark==='I01','disabled':ai !== aswIndex}">
            {{((asw.isMark==='I01'&&asw.value===undefined)?asw.score:((asw.value === 0 || asw.value)? asw.value : asw.score)) + '分'}}
          </div>
        </div>
      </div>
      <div class="correct-wrap__side-bottom">
        <div class="auto-submit" :class="{'is-active':autoSubmit}" @click="autoSubmit = !autoSubmit"></div>
        <div @click="handleAuto">自动提交</div>
        <div class="submit fs10" @click="clickSubmit">提交</div>
      </div>
    </div>

<!--    打分面板-->
    <van-dialog
      class="score-dialog"
      v-model="scorePanel"
      :show-confirm-button="false">
      <div class="score-panel">
        <div style="position: relative">选择分数<van-icon @click="scorePanel=false" name="cross"/>
        </div>
        <div class="score-panel__body">
          <div @click="selectScore(0,item.value,aswItem)" :class="{active:item.active}" v-for="(item,index) in scoreList" :key="index">{{item.value}}</div>
        </div>
        <div class="score-panel__tip">*点击选择分数</div>
      </div>
    </van-dialog>


    <div class="correct-wrap__bottom" id="tools-bar">
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="clickPen"
         class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="clickRubber"
         class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="clearCanvas" class="iconGFY icon-del"></i>
      <i @click="updateExamQuality" class="iconGFY icon-good" :class="{'icon-good-active':stuArr[stuIndex].answer[aswIndex].qualityType === 'Q01'}"></i>
      <i @click="handleFold" class="iconGFY icon-hide" :class="{'icon-hide-active':isFold}"></i>
    </div>
    <div class="correct-wrap__body">
      <!--      <div class="correct-wrap__body__text" :style="{flex: stuArr[stuIndex].answer[aswIndex].imgArr.length? '0 0 35%':'none'}" ref="text" v-if="stuArr[stuIndex].answer[aswIndex].text" >-->
      <div class="correct-wrap__body__text" ref="text"
           :class="{ellipsis:stuArr[stuIndex].answer[aswIndex].imgArr.length}"
           v-if="stuArr[stuIndex].answer[aswIndex].text">
          <div style="word-break: break-all" class="text-area" v-html="stuArr[stuIndex].answer[aswIndex].text"></div>
          <div class="more-btn" @click="handleShowAnswer"
               v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">展开答案
          </div>
      </div>
      <div class="correct-wrap__body__audio" v-if="stuArr[stuIndex].answer[aswIndex].audioArr.length && !stuArr[stuIndex].answer[aswIndex].text">
        <i class="iconGFY icon-circle-logo"></i>
        <audio autoplay controls controlsList="nodownload" :src="stuArr[stuIndex].answer[aswIndex].audioArr[0]"></audio>
      </div>
      <div class="correct-wrap__body__draw" :style="{flex: stuArr[stuIndex].answer[aswIndex].text? '0 0 80%':'1'}"
           v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">
        <!--      <div class="correct-wrap__body__draw" v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">-->
        <draw-board ref="drawBoard" :text="commentText" :isPen="isPen" :isRubber="isRubber" @submitCb="handleSubmit" @tap="isFold=!isFold"
                   :stuIndex="stuIndex" :imgUrl="stuArr[stuIndex].answer[aswIndex].imgArr[imgIndex]"></draw-board>
      </div>
      <div class="correct-wrap__body__undo"
           v-if="!stuArr[stuIndex].answer[aswIndex].result || stuArr[stuIndex].answer[aswIndex].result == '<p></p>'">
        学生未作答
      </div>
    </div>

    <!--    看原题-->
    <van-dialog
      v-model="viewSubject"
      :show-confirm-button="false">
      <div class="view-subject">
        <div class="view-subject__header">{{isShowTitle?'看原题':'看答案'}}
          <van-icon @click="viewSubject=false" name="cross"/>
        </div>
        <div class="view-subject__body html-img">
          <div v-if="isShowTitle" class="mgb5 pd5" style="background: #fff;">
            <div>看原题</div>
            <div v-html="examTitle"></div>
          </div>
          <div class="pd5" style="background: #fff;">
            <div>看答案</div>
            <div style="word-break: break-all"
                 v-html="isShowTitle?examAnswer:stuArr[stuIndex].answer[aswIndex].text"></div>
          </div>
        </div>
      </div>
    </van-dialog>

    <!--    阅卷情况-->
    <van-popup
      :overlay="true"
      v-model="stuInfo"
      position="right">
      <div class="stu-info-wrap">
        <div class="stu-info-wrap__header">
          <div class="mgb5">阅卷情况 {{progress}}/{{stuArr.length}}</div>
          <div class="search-input"><input v-model.trim="stuName" placeholder="请输入查找的学生姓名" type="text"/>
            <van-icon name="search"></van-icon>
          </div>
        </div>
        <div class="stu-info-wrap__body">
          <div class="stu-item" v-if="getStudentName(stu.accountNo, classId).indexOf(stuName) > -1" v-for="(stu,si) in stuArr" :key="si">
            <div class="stu-item__name" @click="selectAnswer(si)">{{getStudentName(stu.accountNo,classId)}}</div>
            <div class="stu-item__score">
              <div class="stu-item__score-item" @click="selectAnswer(si,ai)" v-for="(asw,ai) in stu.answer" :key="ai">
                <i v-if="asw.qualityType==='Q01'" class="iconGFY icon-good-active"></i>
                <span style="margin-right: 20px;">第{{$route.params.examNum}}{{info.groupExamList.length?`(${ai+1})`:``}}题</span>
                <span >{{asw.isMark==='I02'?'未批改':asw.score+'分'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!--    点评-->
    <van-dialog
      v-model="commentShow"
      :show-confirm-button="false">
      <div class="comment-dialog">
        <div class="comment-dialog__header">评论</div>
        <div class="comment-dialog__body">
          <van-dropdown-menu :overlay="false" :duration="0">
            <van-dropdown-item ref="commentMenu" :title="commentWord">
              <div class="menu-wrap">
                <div v-for="(item,index) in commentWordList"
                     :key="index">
                  <div class="menu-item" style="background: #f5f6fa;">{{item.range}}</div>
                  <div @click="selectComment(w)" class="menu-item intend" v-for="(w,wi) in item.list"
                       :key="wi">{{w}}
                  </div>
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
          <div class="textarea-wrap">
            <textarea v-model.trim="comment" maxlength="100" placeholder="请输入评论" rows="5"></textarea>
            <span>{{comment.length}}/100</span>
          </div>
        </div>
        <div class="comment-dialog__footer van-hairline--top">
          <div class="cancel van-hairline--right" @click="commentShow=false;comment=''">取消</div>
          <div class="confirm" @click="addAppraise">确定</div>
        </div>
      </div>
    </van-dialog>

    <van-popup class="step-tip" v-model="showTip">
      <div class="step-tip__wrap">
        <div class="step-tip__wrap__title">步长说明</div>
        <div>步长:分数之间的间隔,如选择了0.5,则每两个分数之间的间隔差为0.5</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {getStudentName} from '@/utils/filter'
  import drawBoard from '../../components/drawBoard'
  import {mapMutations, mapGetters, mapState} from 'vuex'
  // import 'swiper/dist/css/swiper.css'////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  // import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getCourseTaskDetail, saveRewardScore, addAppraise, examResultScroe, updateExamQuality} from '@/api/index'
  import AlloyFinger from 'alloyfinger'
  import 'alloyfinger/transformjs/transform'
  import AlloyPaper from 'alloyfinger/asset/alloy_paper.js'

  export default {
    name: "subjectCorrect",
    components: {
      drawBoard,
      // swiper,
      // swiperSlide
    },
    data() {
      return {
        showTip: false,
        commentWordList: [
          {
            range: '优秀',
            list: ['你是老师最值得骄傲的学生', '题题正确,非常出色', '你做题很细心,从不出错', '你的作业很秀气,老师很欣赏', '一丝不苟,值得学习', '你的作业设计得很美观']
          },
          {
            range: '激励',
            list: ['思考好,再做对,会更好', '你若是把字再写工整,会更加优秀', '再细心一些,相信你会做得更好!', '你的作业质量有明显的提高', '有点小错不要紧,你已经进步了', '再努力一把,相信你会更好']
          },
          {
            range: '批评',
            list: ['为什么总有错别字?我等待你的回答', '字要写正,不出格', '学习退步了,我会注意你', '放松要求了吧']
          }
        ],
        commentWord: '你是老师最值得骄傲的学生',
        isShowTitle: true, //是否查看原题弹窗
        commentText: '',
        comment: '',
        stuName: '',
        stuInfo: false,
        commentShow: false,
        viewSubject: false,
        isPen: true,
        isRubber: false,
        isFold: false,
        value1: '10分',
        option: [
          {text: '全部商品', value: 0},
          {text: '新款商品', value: 1},
          {text: '活动商品', value: 2}
        ],
        thumbnail: false,
        show: true,
        imgIndex: Number(this.$route.params.imgIndex) || 0,
        aswIndex: Number(this.$route.params.aswIndex),
        stuIndex: Number(this.$route.params.stuIndex),
        stuArr: JSON.parse(JSON.stringify(this.$route.params.stuArr)),
        classId: this.$route.params.classId,
        info: JSON.parse(JSON.stringify(this.$route.params.info)),
        scale: 1,
        timer: null,
        // filterStuList: [],
        autoSubmit: true,
        selectScoreFlag: false, //是否选择过分数
        scorePanel: false, //打分面板
        scoreList: [],
        step: 1, //步长
        aswItem: {}, //答案item
      }
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
      progress() {
        return this.stuArr.reduce((t, v) => {
          if (v.answer.every(a => a.isMark === 'I01')) {
            t++
          }
          return t
        }, 0)
      },
      getStudentName() {
        return getStudentName
      },
      examTitle() {
        if (this.info.groupExamList.length) {
          return this.info.title + this.info.groupExamList.find(v => v.examGroupId === this.stuArr[this.stuIndex].answer[this.aswIndex].examGroupId).title
        } else {
          return this.info.title
        }
      },
      examAnswer() {
        if (this.info.groupExamList.length) {
          return this.info.groupExamList.find(v => v.examGroupId === this.stuArr[this.stuIndex].answer[this.aswIndex].examGroupId).answer
        } else {
          return this.info.answer
        }
      }
    },
    created() {
      screen.orientation.lock('landscape')
    },
    mounted() {
      this.figure()
    },
    methods: {
      handleShowAnswer(){
        try{MobclickAgent.onEvent('subjectShowAnswer')}catch(e){console.log(e)}
        this.viewSubject = true
        this.isShowTitle = false
      },
      clickSubmit(){
        try{MobclickAgent.onEvent('clickSubjectSubmit')}catch(e){console.log(e)}
        this.submit()
      },
      handleAuto(){
        try{MobclickAgent.onEvent('subjectAutoSubmit')}catch(e){console.log(e)}
        this.autoSubmit = !this.autoSubmit
      },
      viewStuInfo(){
        try{MobclickAgent.onEvent('subjectStuInfo')}catch(e){console.log(e)}
        this.stuInfo = !this.stuInfo
      },
      viewOriginExam(){
        try{MobclickAgent.onEvent('subjectViewExam')}catch(e){console.log(e)}
        this.isShowTitle = true
        this.viewSubject = true
      },
      setStep(value){
        try{MobclickAgent.onEvent('clickSubjectStep')}catch(e){console.log(e)}
        this.step = value
      },
      zeroScore() {
        try{MobclickAgent.onEvent('subjectZeroScore')}catch(e){console.log(e)}
        this.selectScore(this.aswIndex,0,this.stuArr[this.stuIndex].answer[this.aswIndex])
      },
      fullScore(){
        try{MobclickAgent.onEvent('subjectFullScore')}catch(e){console.log(e)}
        this.selectScore(this.aswIndex,this.stuArr[this.stuIndex].answer[this.aswIndex].examScore,this.stuArr[this.stuIndex].answer[this.aswIndex])
      },
      handleFold(){
        try{MobclickAgent.onEvent('clickSubjectFold')}catch(e){console.log(e)}
        this.isFold = !this.isFold
      },
      clickRubber(){
        try{MobclickAgent.onEvent('clickSubjectRubber')}catch(e){console.log(e)}
        this.isRubber = !this.isRubber
        this.isPen = false
      },
      clickPen(){
        try{MobclickAgent.onEvent('clickSubjectPen')}catch(e){console.log(e)}
        this.isPen = !this.isPen
        this.isRubber = false
      },
      next(){
        try{MobclickAgent.onEvent('subjectToggleExam')}catch(e){console.log(e)}
        this.submit()
      },
      scorePopShow(asw,ai) {
        if(ai !== this.aswIndex) return
        this.aswItem = asw
        let arr = []
        // const total = (asw.examScore || 5) / this.step
        for (let i = this.step; i <= (asw.examScore || 5); i+=this.step) {
          let active = false
          if(asw.value === 0 || asw.value || asw.isMark==='I01') {
            //已打分
           let value = ((asw.isMark==='I01'&&asw.value===undefined)?asw.score:((asw.value === 0 || asw.value)? asw.value : asw.score))
            if(value == i) {
              active = true
            }
          }
          arr.push({value:i,active})
        }
        if(arr.length>10 && (arr.length % 10 > 0)) {
          const count = 10 - (arr.length % 10)
          for (let i = 0; i < count; i++) {
            arr.push({value:'--',active:false})
          }
        }
        this.scoreList = arr
        this.scorePanel = true
      },
      handleSubmit() {
        //更新涂鸦后的图片
        if (this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr[this.imgIndex].indexOf('?')>-1) {
          this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr[this.imgIndex] = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr[this.imgIndex] + '&' + Math.random()
        }else{
          this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr[this.imgIndex] = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr[this.imgIndex] + '?&' + Math.random()
        }

        this.toggle(1)
      },
      rotateLeft() {
        try{MobclickAgent.onEvent('subjectRotate')}catch(e){console.log(e)}
        this.$refs['drawBoard'].rotateLeft()
      },
      rotateRight() {
        try{MobclickAgent.onEvent('subjectRotate')}catch(e){console.log(e)}
        this.$refs['drawBoard'].rotateRight()
      },
      updateExamQuality() {
        this.$store.commit('setVanLoading', true)
        const qualityType = this.stuArr[this.stuIndex].answer[this.aswIndex].qualityType==='Q01'?'Q02':'Q01'
        let obj = {
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          type: this.info.groupExamList.length?'T02':'T01',
          seqId: this.stuArr[this.stuIndex].answer[this.aswIndex].seqId,
          qualityType,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        try{MobclickAgent.onEvent('clickSubjectGood')}catch(e){console.log(e)}
        updateExamQuality(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            this.stuArr[this.stuIndex].answer[this.aswIndex].qualityType = qualityType
          }else {
            this.$toast(res.msg)
          }
        })
      },
      clearCanvas() {
        try{MobclickAgent.onEvent('clickSubjectClear')}catch(e){console.log(e)}
        this.$refs['drawBoard'].clear()
      },
      async examResultScroe() {
        const studentScore = (this.stuArr[this.stuIndex].answer[this.aswIndex].isMark==='I01'&&this.stuArr[this.stuIndex].answer[this.aswIndex].value===undefined)?this.stuArr[this.stuIndex].answer[this.aswIndex].score:this.stuArr[this.stuIndex].answer[this.aswIndex].value
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.stuArr[this.stuIndex].accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.$route.params.taskId,
          examId: this.stuArr[this.stuIndex].answer[this.aswIndex].examId || this.stuArr[this.stuIndex].answer[this.aswIndex].examGroupId,
          examScore: this.stuArr[this.stuIndex].answer[this.aswIndex].examScore || 5,
          studentScore,
          groupId: this.stuArr[this.stuIndex].answer[this.aswIndex].groupId,
          titleType: this.stuArr[this.stuIndex].answer[this.aswIndex].titleType
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       await examResultScroe(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.stuArr[this.stuIndex].answer[this.aswIndex].isMark = 'I01'
            this.stuArr[this.stuIndex].answer[this.aswIndex].score = studentScore
            // if(!this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) this.toggle(1)

            if (this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length && this.$refs['drawBoard'].drawFlag) {
              //有图片并且涂鸦过才提交
              this.$refs['drawBoard'].save()
            }else {
              this.toggle(1)
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      splitScore(score) {
        const length = Math.floor(score * 2)
        let arr = [score]
        for (let i = 0; i < length; i++) {
          score -= 0.5
          arr.push(score)
        }
        return arr.reverse()
      },
      async submit() {
        if (!this.stuArr[this.stuIndex].answer[this.aswIndex].value && this.stuArr[this.stuIndex].answer[this.aswIndex].value !== 0 && this.stuArr[this.stuIndex].answer[this.aswIndex].isMark === 'I02') return this.$toast('还没选择分数')

        if(this.selectScoreFlag) {
          this.$store.commit('setVanLoading', true)
          await this.examResultScroe()
        }else if (this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length && this.$refs['drawBoard'].drawFlag) {
          this.$refs['drawBoard'].save()
        }
        else {
          this.toggle(1)
        }

      },
      clickComment() {
        const item = this.info.appraiseList.find(v => v.objectId === this.stuArr[this.stuIndex].answer[this.aswIndex].seqId)
        this.comment = item ? item.appraiseContent : ''
        this.commentShow = true
      },
      addAppraise() {
        if (!this.comment) return this.$toast('请输入点评')

        if(this.info.appraiseList.some(v => v.objectId === this.stuArr[this.stuIndex].answer[this.aswIndex].seqId)) {
          //已有评论
          this.$dialog.confirm({
            title: '',
            message: '是否更换已有的点评内容?'
          }).then(() => {
            this.addAppraiseAjax()
          }).catch(() => {
            // on cancel
          });
        }else {
          this.addAppraiseAjax()
        }
      },
      addAppraiseAjax() {
        this.$store.commit('setVanLoading', true)
        let params = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          objectTypeCd: 'A05',
          appraiseContent: this.comment,
          appraisedAccountNo: this.stuArr[this.stuIndex].accountNo,
          objectId: this.stuArr[this.stuIndex].answer[this.aswIndex].seqId
        }
        try{MobclickAgent.onEvent('subjectCommentSubmit')}catch(e){console.log(e)}
        addAppraise(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast('点评成功')
            this.commentShow = false
            this.commentText = this.comment
            this.info.appraiseList.unshift({
              objectId: this.stuArr[this.stuIndex].answer[this.aswIndex].seqId,
              appraiseContent: this.comment
            })
          } else {
            this.$toast(res.msg)
          }
        })
      },
      selectComment(item) {
        this.commentWord = item
        this.comment = item
        this.$refs['commentMenu'].toggle(false)
      },
      saveRewardScore(type) {
        if (this.vanLoading) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.$route.params.taskId,
          type,
          score: 1,
          "subjectType": localStorage.currentSubjectType,
          "teacherName": localStorage.userInfo.userName,
          "taskName": JSON.parse(localStorage.getItem('stat')).taskName,
          "termType": this.$route.params.termType,
          "classId": this.$route.params.classId,
          "groupIdList": "",
          "accountNoList": this.stuArr[this.stuIndex].accountNo
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        try{MobclickAgent.onEvent('subjectAddSubScore')}catch(e){console.log(e)}
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(type === 'T01' ? '加分成功' : '减分成功')
            this.stuArr[this.stuIndex].rewardScore = this.stuArr[this.stuIndex].rewardScore * 1 + (type === 'T01'?1:-1)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      zoom(type) {
        if(this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) {
          try{MobclickAgent.onEvent(type?'subjectEnlarge':'subjectNarrow')}catch(e){console.log(e)}
          this.scale = this.$refs['drawBoard'].scale
          this.scale += type ? 0.1 : -0.1
          this.$refs['drawBoard'].handleZoom(this.scale)
        }
      },
      selectAnswer(stuIndex,aswIndex) {
        this.stuIndex = stuIndex
        this.aswIndex = aswIndex || 0
        this.imgIndex = 0
        this.scale = 1
      },
      toggle(type) {
        if (type) {
          // 下一个
          if (this.imgIndex < this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1) {
            //下一个图片
            this.imgIndex++
            this.scale = 1
            this.selectScoreFlag = false
          } else {
            if (this.aswIndex < this.stuArr[this.stuIndex].answer.length - 1) {
              //下一个小题
              this.aswIndex++
              this.imgIndex = 0
              this.scale = 1
              this.selectScoreFlag = false
            } else {
              //下一个学生
              if (this.stuIndex < this.stuArr.length - 1) {
                this.stuIndex++
                this.aswIndex = 0
                this.imgIndex = 0
                this.scale = 1
                this.selectScoreFlag = false
              } else {
                this.$dialog.confirm({
                  title: "",
                  message: "已经全部批改完该大题,是否回到批改列表?",
                  cancelButtonText: "取消",
                  confirmButtonText: "确定",
                  className: 'finish-dialog',
                  getContainer: '#correct-wrap'
                }).then(() => {
                  this.$router.back()
                })
              }
            }
          }
        } else {
          try{MobclickAgent.onEvent('subjectToggleExam')}catch(e){console.log(e)}
          //上一个
          if (this.imgIndex > 0) {
            //上一个图片
            this.imgIndex--
            this.scale = 1
            this.selectScoreFlag = false
          } else {
            if (this.aswIndex > 0) {
              this.aswIndex--
              this.imgIndex = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length ? this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1 : 0
              this.scale = 1
              this.selectScoreFlag = false
            } else {
              if (this.stuIndex > 0) {
                this.stuIndex--
                this.aswIndex = this.stuArr[this.stuIndex].answer.length ? this.stuArr[this.stuIndex].answer.length - 1 : 0
                this.imgIndex = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length ? this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1 : 0
                this.scale = 1
                this.selectScoreFlag = false
              } else {
                this.$toast('最前啦')
              }
            }
          }
        }
      },
      figure() {
        // let swordEle = document.getElementsByClassName('canvas')[0]
        let swordEle = document.getElementById('tools-bar')
        let _this = this
        var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap, Loader = AlloyPaper.Loader;

        Transform(swordEle)
        let bwidth, bheight, swidth, sheight;
        var initScale = 1;
        var af = new AlloyFinger(swordEle, {
          touchStart: function (event) {
            // if(!_this.isPen&&!_this.isRubber) return
            // _this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            // _this.lastCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
            // _this.lastTimestamp = new Date().getTime();
            // console.log('touchStart')
          },
          touchMove: function (event) {
          },
          touchEnd: function () {
            // let strArr = swordEle.style.transform.split(',')
            // _this.rotateX = strArr[0].split('matrix3d(')[1]
            // _this.rotateY = strArr[5]
            // console.log(_this.rotateX,_this.rotateY)
          },
          touchCancel: function () {
          },
          multipointStart: function () {

          },
          multipointEnd: function () {
          },
          tap: function () {
          },
          doubleTap: function () {
          },
          longTap: function () {
          },
          singleTap: function () {
          },
          rotate: function (evt) {

          },
          pinch(evt) {
          },
          pressMove: function (evt) {
            let widthDiff = bwidth - swidth;
            let heightDiff = bheight - sheight;
            // if (((evt.deltaX>0)&&(swordEle.translateX >= widthDiff))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
            // } else {
            swordEle.translateX += evt.deltaX;
            swordEle.translateY += evt.deltaY;
            if(swordEle.translateX>0) {
              swordEle.translateX = 0
            }
            if(swordEle.translateY>0) {
              swordEle.translateY = 0
            }
            if(swordEle.translateX<-(window.document.body.offsetWidth - swordEle.offsetWidth)) {
              swordEle.translateX = -(window.document.body.offsetWidth - swordEle.offsetWidth)
            }
            if(swordEle.translateY<-(window.document.body.offsetHeight - swordEle.offsetHeight)) {
              swordEle.translateY = -(window.document.body.offsetHeight - swordEle.offsetHeight)
            }
          },
          swipe: function (evt) {
          }
        });
      },
      getDom(item) {
        this.$set(item, 'imgArr', [])
        this.$set(item, 'audioArr', [])
        let dom = document.createElement('div')
        dom.innerHTML = item.studentAnswer
        if (item.studentAnswer) {
          const imgArr = dom.querySelectorAll('img')
          const audioArr = dom.querySelectorAll('audio')
          for (let i = 0; i < imgArr.length; i++) {
            item.imgArr.push(imgArr[i].src)
            let parent = imgArr[i].parentElement
            parent.removeChild(imgArr[i])
          }
          for (let i = 0; i < audioArr.length; i++) {
            item.audioArr.push(audioArr[i].src)
            let parent = audioArr[i].parentElement
            parent.removeChild(audioArr[i])
          }
          this.$set(item, 'text', dom.outerText==='|||'?'':dom.outerText)
        } else {
          this.$set(item, 'text', '')
        }
      },
      getCourseTaskDetail() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A03",
          "tchCourseId": JSON.parse(localStorage.stat).tchCourseId,
          "accountNo": this.$route.query.accountNo,
          "taskId": JSON.parse(localStorage.stat).taskId,
          "isNeedHisAnswer": "Y"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getCourseTaskDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            let arr = [], bNum = 0
            res.data[0].testPaperInfo.forEach((v, index) => {
              v.sectionExam.forEach((s, i) => {
                bNum++
                if (s.testPaperExamGroup.length) {
                  let sNum = 0
                  s.testPaperExamGroup.forEach((t, ti) => {
                    sNum++
                    if (i === 0 && index === 0 && ti === 0) this.$set(t.groupExamInfo, 'active', true)
                    t.groupExamInfo.title = s.examQuestion.title + t.groupExamInfo.title
                    t.groupExamInfo.num = `${bNum}(${sNum})`
                    arr.push(t.groupExamInfo)
                  })
                } else {
                  if (i === 0 && index === 0) this.$set(s.examQuestion, 'active', true)
                  s.examQuestion.num = bNum
                  arr.push(s.examQuestion)
                }
              })
            })
            res.data[0].questionList = arr
            this.info = res.data[0]
            this.getDom(this.info.questionList[this.questionIndex])
          } else {
            this.$toast(res.msg)
          }
        })
      },
     async selectScore(i, score, asw) {
       if (this.vanLoading || score === '--') return
       console.log(asw.value);
        this.selectScoreFlag = true
        // this.$refs['menuItem' + i][0].toggle(false)
       this.scorePanel = false
        this.$set(asw, 'value', score)
        if(this.autoSubmit) {
          this.$store.commit('setVanLoading', true)
         await this.examResultScroe()

        }
      },
    },
    beforeDestroy() {
      screen.orientation.unlock()
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .correct-wrap {
    overflow: hidden;
    @{deep} .finish-dialog.van-dialog {
       .van-dialog__message {
        font-size: 10px;
        padding: 10px;
      }
       .van-button {
        height: 20px;
        line-height: 20px;
        font-size: 10px;
      }
      width: 130px;
    }

    @{deep} .van-popup--right {
      transform: translate3d(0, 0, 0);
      top: 26px;
      height: calc(100% - 26px);

      &.van-popup-slide-right-enter, &.van-popup-slide-right-leave-active {
        transform: translate3d(100%, 0, 0);
      }

      .stu-info-wrap {
        background: #000;
        height: 100%;
        padding: 5px;
        width: 120px;
        display: flex;
        flex-direction: column;

        &__header {
          flex: 0 0 20%;
          font-size: 8px;
          color: #fff;

          .search-input {
            font-size: 4px;
            height: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #eee;
            padding: 0 3px;
            border-radius: 2px;

            input {
              color: #999;
            }

            .van-icon-search {
              color: #333;
            }
          }
        }

        &__body {
          flex: 1;
          overflow-y: auto;

          .stu-item {
            padding: 5px 3px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            color: #fff;
            font-size: 6px;
            background: rgb(24, 24, 24);
            border-bottom: 1px solid #000;

            &__name {
              /*line-height: 15px;*/
              flex: 0 0 45%;
            }

            &__score {
              flex: 1;

              &-item {
                margin-bottom: 2px;
                position: relative;
                display: flex;
                justify-content: space-between;
                .icon-good-active {
                  position: absolute;
                  width: 10px;
                  height: 7px;
                  left: -9px;
                }
              }
            }
          }
        }
      }
    }

    @{deep} .van-dialog {
      width: auto;
    }

    .icon-circle-arrow {
      position: absolute;
      z-index: 10;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);

      &.rotate {
        left: auto;
        right: 5px;
        transform: translateY(-50%) rotateZ(180deg);
      }
    }

    .view-subject {
      width: 200px;
      display: flex;
      flex-direction: column;
      max-height: 150px;

      &__header {
        position: relative;
        flex: 0 0 25px;
        background: #eee;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;


      }

      &__body {
        font-size: 7px;
        background: #f5f5f5;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }

    .comment-dialog {
      width: 260px;
      display: flex;
      flex-direction: column;

      &__header {
        flex: 0 0 25px;
        background: #eee;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__body {
        font-size: 7px;
        background: #fff;
        flex: 1;
        overflow-y: auto;
        padding: 6px;

        @{deep} .van-dropdown-menu {
          height: auto;
          border: 1px solid #ccc;
          border-radius: 3px;
          margin-bottom: 5px;
          background: #F5F6FA;

          .van-dropdown-menu__title {
            font-size: 8px;
            color: #000;
            flex: 1;

            &:after {
              position: absolute;
              top: 50%;
              right: 5%;
              margin-top: -1.333vw;
              border-color: transparent transparent #999 #999;
              border-style: solid;
              border-width: .8vw;
              transform: rotate(-45deg);
              opacity: .8;
              content: "";
            }

            &--down:after {
              transform: rotate(135deg);
              position: absolute;
              top: 67%;
              right: 5%;
              margin-top: -1.333vw;
              border-color: transparent transparent #999 #999;
              border-style: solid;
              border-width: .8vw;
              opacity: .8;
              content: "";
            }
          }

          .van-dropdown-item {
            position: absolute;
            top: 100% !important;
            height: 70px;
            border: 1px solid #ccc;

            &__content {
              /*评论区域下拉*/
              height: 100%;
              overflow-y: auto;
              max-height: 100%;

              .menu-wrap {
                background: #fff;

                .menu-item {
                  padding: 0 5px;
                  line-height: 18px;
                  border-bottom: 1px solid #ccc;

                  &.intend {
                    padding-left: 15px;
                  }
                }
              }
            }
          }
        }

        .textarea-wrap{
          position: relative;
          textarea {
            width: 100%;
            background: #f5f6fa;
            border-radius: 3px;
            padding: 5px;
            margin-bottom: 5px;
          }
          span{
            position: absolute;
            right: 5px;
            bottom: 10px;
            color: #666;
          }
        }


        .tag-wrap {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          span {
            background: #f5f6fa;
            border-radius: 3px;
            line-height: 12px;
            text-align: center;
            padding: 0 5px;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }

      &__footer {
        flex: 0 0 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*padding: 0 30px;*/

        .cancel, .confirm {
          font-size: 8px;
          flex: 1;
          line-height: 26px;
          text-align: center;
        }

        .cancel {
          /*border: 1px solid #ccc;*/
        }

        .confirm {
          margin-right: 0;
          color: @blue;
        }
      }
    }

    .canvas-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    &__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 26px;
      background: #1E404D;
      display: flex;
      color: #fff;
      z-index: 9;
      align-items: center;
      font-size: 6px;
      padding: 0 4px;
      justify-content: space-between;

      .van-icon-arrow-left {
        font-size: 10px;
      }

      .action-btn {
        color: #333;
        flex: 0 0 22px;
        text-align: center;
        line-height: 14px;
        border-radius: 6px;
        background: #94F8CA;

        &.comment-btn {
          background: #FAE573;

          &.done {
            background: #fff;
            color: #000;
          }
        }
      }
    }

    &__side {
      top: 30px;
      position: absolute;
      z-index: 9;
      width: 85px;
      height: 65%;
      background: #fff;
      right: 5px;
      padding: 5px;
      display: flex;
      flex-direction: column;
      border-radius: 3px;

      &-top {
        display: flex;
        align-items: center;
        flex: 0 0 18px;

        .score-btn {
          flex: 1;
          margin-right: 5px;
          border-radius: 8px;
          background: #94f8ca;
          color: #000;
          font-size: 8px;
          text-align: center;
          line-height: 18px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
      &-step{
        flex:0 0 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 7px;
        margin-top: 5px;
        .icon-tip{
          flex:0 0 10px;
          height: 10px;
          margin-left: 3px;
        }
        &__btn{
          flex:0 0 18px;
          text-align: center;
          line-height: 13px;
          border-radius: 2px;
          border: 1px solid #ccc;
          background: #eee;
          margin-left: 3px;
          &.active{
            background: #94f8ca;
          }
        }
      }
      &-center {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        /*padding-bottom: 52px;*/

        .dropdown-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;

          .select-score {
            height: 13px;
            line-height: 13px;
            border: 1px solid #ccc;
            text-align: center;
            background: #fff;
            flex:0 0 65%;
            font-size: 6px;
            &.disabled{
              background: #eee;
            }
          }
          @{deep} .van-dropdown-item__content {
            border: 1px solid #ccc;
          }
          .menu-wrap {
            max-height: 64px;
            border: 1px solid #ccc;
            overflow-y: auto;
          }

          .menu-item {
            font-size: 6px;
            text-align: center;
            line-height: 13px;

          }

          > span {
            flex: 1;
            font-size: 6px;
            white-space: nowrap;
          }

          @{deep} .van-dropdown-menu {
            border: 1px solid #B5B5B5;
            flex: 0 0 70%;
            height: 13px;

            &.is-check {
              .van-dropdown-menu__item {
                .van-dropdown-menu__title {
                  .van-ellipsis {
                    color: red !important;
                  }
                }
              }
            }

            .van-dropdown-menu__item--disabled {
              background: #eee;
            }

            .van-dropdown-item {
              position: fixed;
              width: 14%;
              right: 10px;
              max-height: 64px;
              left: auto;

              .van-cell {
                padding: 0;
                font-size: 6px;
              }
            }

            .van-dropdown-menu__title {
              font-size: 6px;
              justify-content: space-between;
              color: #333 !important;

              &::after {
                top: 3vw;
                right: -2.1vw;
                border-color: transparent transparent currentcolor currentcolor;
                border-style: solid;
                border-width: .5vw;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                opacity: .8;
                content: "";
              }

              &.van-dropdown-menu__title--down::after {
                top: 2.2vw;
                right: -2.1vw;
                border-color: transparent transparent currentcolor currentcolor;
                border-style: solid;
                border-width: .5vw;
                -webkit-transform: rotate(-45deg);
                transform: rotate(135deg);
                opacity: .8;
                content: "";
              }
            }

            &::after {
              content: none;
            }
          }
        }
      }

      &-bottom {
        font-size: 6px;
        flex: 0 0 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .auto-submit {
          flex: 0 0 5px;
          height: 5px;
          border: 1px solid #44B5DF;

          &.is-active {
            background: url("../../assets/img/icon-check.png") no-repeat center center;
            background-size: contain;
          }
        }

        .submit {
          text-align: center;
          line-height: 17px;
          border-radius: 2px;
          background: #6edcfc;
          font-size: 8px;
          flex: 0 0 30px;
        }
      }

    }

    &__body {
      background: rgb(205, 236, 211);
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      &__text {
        display: flex;
        align-items: end;
        justify-content: space-between;
        /*width: calc(100% - 100px);*/
        padding: 33px 105px 10px 10px;
        font-size: 10px;
        min-height: 40px;
        overflow-y: auto;
        z-index: 1;
        &.ellipsis {
          flex: 0 0 20%;
          overflow-y: initial;

          .text-area {
            overflow: hidden;
            text-overflow: ellipsis;
            /*display: -webkit-box;*/
            /*-webkit-line-clamp: 2;      !* 可以显示的行数，超出部分用...表示*!*/
            /*-webkit-box-orient: vertical;*/
            flex: 1;
            word-break: break-all;
            white-space: nowrap;
          }
        }

        .more-btn {
          color: red;
          font-size: 10px;
          margin-left: 5px;
        }
      }

      &__audio {
        background: #fff;
        border-radius: 3px;
        margin: 50px 120px 0 50px;
        text-align: center;
        padding: 10px;

        audio {
          display: block;
          margin: 10px auto 0;
          width: 100%;
        }
      }

      &__draw {
        position: relative;
        flex: 1;
      }

      &__undo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgb(218, 249, 238);
        color: red;
        border-radius: 3px;
        text-align: center;
        line-height: 30px;
        padding: 0 10px;
      }
    }

    &__bottom {
      position: absolute;
      /*width: 125px;*/
      height: 24px;
      z-index: 9;
      right: 5px;
      bottom: 5px;
      background: #E4F1F3;
      box-shadow: 0px 3px 9px 0px rgba(160, 177, 158, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      i {
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    .score-dialog{
      border-radius: 5px;
      width: 800px;
      max-width: 295px;
      .score-panel{
        text-align: center;
        font-size: 10px;
        padding: 5px 10px;
        &__body{
          margin-top: 5px;
          display: flex;
          flex-wrap: wrap;
          overflow-y: auto;
          max-height: 70px;
          justify-content: center;
          >div{
            flex: 0 0 27px;
            line-height: 13px;
            border: 1px solid #ccc;
            font-size: 8px;
            text-align: center;
            &.active{
              background: @blue;
            }
          }
        }
        &__tip{
          color: red;
          font-size: 9px;
          text-align: left;
          margin-top: 5px;
        }
      }
    }
    .van-icon-cross {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
    .step-tip{
      border-radius: 5px;
      &__wrap {
        font-size: 8px;
        padding: 5px 10px;
        &__title{
          text-align: center;
          margin-bottom: 5px;
        }
      }
    }

  }
</style>
