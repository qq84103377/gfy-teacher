<template>
  <div class="correct-wrap">
    <div class="correct-wrap__header" v-show="!isFold">
      <van-icon @click="$router.back()" name="arrow-left"/>
      <span>{{getStudentName(stuArr[stuIndex].accountNo,classId)}}</span>
      <span>题号:{{$route.params.examNum}}{{info.groupExamList.length?`(${aswIndex+1})`:``}}</span>
      <span>进度：{{progress}}/{{stuArr.length}}</span>
      <i @click="zoom(1)" class="iconGFY icon-enlarge"></i>
      <i @click="zoom(0)" class="iconGFY icon-reduce"></i>
      <i class="iconGFY icon-rotate-left"></i>
      <i class="iconGFY icon-rotate-right"></i>
      <span @click="isShowTitle=true;viewSubject=true">看原题</span>
      <span @click="stuInfo=!stuInfo">阅卷情况</span>
      <span class="action-btn" @click="saveRewardScore('T01')">加分</span>
      <span class="action-btn" style="background: #FABC73;" @click="saveRewardScore('T02')">减分</span>
      <span @click="clickComment" class="action-btn comment-btn"
            :class="{done: info.appraiseList.some(v => v.objectId === stuArr[stuIndex].answer[aswIndex].seqId)}">{{info.appraiseList.some(v => v.objectId === stuArr[stuIndex].answer[aswIndex].seqId)?'已点评':'点评'}}</span>
    </div>
    <i v-if="!(aswIndex==0&&stuIndex==0&&imgIndex==0)&&!isFold" class="iconGFY icon-circle-arrow"
       @click="toggle(0)"></i>
    <i v-if="!isFold" class="iconGFY icon-circle-arrow rotate" @click="submit"></i>
    <div class="correct-wrap__side" v-show="!isFold">
      <div class="correct-wrap__side-top">
        <div class="score-btn"
             @click="selectScore(aswIndex,stuArr[stuIndex].answer[aswIndex].examScore,stuArr[stuIndex].answer[aswIndex])">
          满分
        </div>
        <div class="score-btn" style="background: #FA7373;"
             @click="selectScore(aswIndex,0,stuArr[stuIndex].answer[aswIndex])">零分
        </div>
      </div>
      <div class="correct-wrap__side-center">
        <div v-for="(asw,ai) in stuArr[stuIndex].answer" :key="ai" class="dropdown-group"><span>1{{info.groupExamList.length?`(${ai+1})`:``}}</span>
          <van-dropdown-menu :class="{'is-check':asw.value === 0 || asw.value || asw.isMark==='I01'}" :overlay="false">
            <van-dropdown-item :disabled="ai !== aswIndex" :ref="'menuItem' + ai"
                               :title="((asw.isMark==='I01'&&asw.value===undefined)?asw.score:((asw.value === 0 || asw.value)? asw.value : asw.score)) + '分'">
              <div class="menu-wrap">
                <div @click="selectScore(ai,score,asw)" class="menu-item"
                     v-for="(score,scoreIndex) in  splitScore(asw.examScore)"
                     :key="scoreIndex">{{score}}分
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="correct-wrap__side-bottom">
        <div class="auto-submit" :class="{'is-active':autoSubmit}" @click="autoSubmit = !autoSubmit"></div>
        <div @click="autoSubmit = !autoSubmit">自动提交</div>
        <div class="submit fs10" @click="submit">提交</div>
      </div>
    </div>
    <div class="correct-wrap__bottom" id="tools-bar">
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="isPen=!isPen;isRubber=false"
         class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="isRubber=!isRubber;isPen=false"
         class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length" @click="clearCanvas" class="iconGFY icon-del"></i>
      <i @click="updateExamQuality" class="iconGFY icon-good" :class="{'icon-good-active':stuArr[stuIndex].answer[aswIndex].qualityType === 'Q01'}"></i>
      <i @click="isFold=!isFold" class="iconGFY icon-hide" :class="{'icon-hide-active':isFold}"></i>
    </div>
    <div class="correct-wrap__body">
      <!--      <div class="correct-wrap__body__text" :style="{flex: stuArr[stuIndex].answer[aswIndex].imgArr.length? '0 0 35%':'none'}" ref="text" v-if="stuArr[stuIndex].answer[aswIndex].text" >-->
      <div class="correct-wrap__body__text" ref="text"
           :class="{ellipsis:stuArr[stuIndex].answer[aswIndex].imgArr.length}"
           v-if="stuArr[stuIndex].answer[aswIndex].text">
        <div style="word-break: break-all" class="text-area" v-html="stuArr[stuIndex].answer[aswIndex].text"></div>
        <div class="more-btn" @click="viewSubject = true;isShowTitle=false"
             v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">展开答案
        </div>
      </div>
      <div class="correct-wrap__body__audio" v-if="stuArr[stuIndex].answer[aswIndex].audioArr.length">
        <i class="iconGFY icon-circle-logo"></i>
        <audio autoplay controls controlsList="nodownload" :src="stuArr[stuIndex].answer[aswIndex].audioArr[0]"></audio>
      </div>
      <div class="correct-wrap__body__draw" :style="{flex: stuArr[stuIndex].answer[aswIndex].text? '0 0 80%':'1'}"
           v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">
        <!--      <div class="correct-wrap__body__draw" v-if="stuArr[stuIndex].answer[aswIndex].imgArr.length">-->
        <draw-board ref="drawBoard" :text="commentText" :isPen="isPen" :isRubber="isRubber" @submitCb="toggle(1)"
                    :imgUrl="stuArr[stuIndex].answer[aswIndex].imgArr[imgIndex]"></draw-board>
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
      :overlay="false"
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
          <div class="stu-item" v-for="(stu,si) in filterStuList" :key="si">
            <div class="stu-item__name">{{getStudentName(stu.accountNo,classId)}}</div>
            <div class="stu-item__score">
              <div class="stu-item__score-item" v-for="(asw,ai) in stu.answer" :key="ai">
                <i v-if="asw.qualityType==='Q01'" class="iconGFY icon-good-active"></i>
                <span>{{$route.params.examNum}}.{{info.groupExamList.length?`(${ai+1})`:``}} {{asw.isMark==='I02'?'未批改':asw.score+'分'}}</span>
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
        commonWord: ['你做的很不错,继续加油!', '理解的很好,可以毕业', '做得很差,明天不用来上课'],
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
        autoSubmit: true
      }
    },
    watch: {
      stuName() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.stuName) {
            this.filterStuList = this.stuArr.filter(v => this.getStudentName(v.accountNo, this.classId).indexOf(this.stuName) > -1)
          } else {
            this.filterStuList = this.stuArr
          }
        }, 500)
      }
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
      filterStuList() {
        if (this.stuName) {
          return this.stuArr.filter(v => this.getStudentName(v.accountNo, this.classId).indexOf(this.stuName) > -1)
        } else {
          return this.stuArr
        }
      },
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
          return this.info.groupExamList.find(v => v.examGroupId === this.stuArr[this.stuIndex].answer[this.aswIndex].examGroupId).title
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
      // this.filterStuList = this.stuArr

      screen.orientation.lock('landscape')
      // this.getCourseTaskDetail()
    },
    mounted() {
      this.figure()
    },
    methods: {
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
        updateExamQuality(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            this.stuArr[this.stuIndex].answer[this.aswIndex].qualityType = qualityType
            // this.$set(this.filterStuList[this.stuIndex].answer[this.aswIndex],'qualityType',qualityType)
            // this.filterStuList[this.stuIndex].answer[this.aswIndex].qualityType = qualityType
          }else {
            this.$toast(res.msg)
          }
        })
      },
      clearCanvas() {
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
          examScore: this.stuArr[this.stuIndex].answer[this.aswIndex].examScore,
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
            if(!this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) this.toggle(1)
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
        this.$store.commit('setVanLoading', true)
       await this.examResultScroe()
        if (this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) {
          this.$refs['drawBoard'].save()
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
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(type === 'T01' ? '加分成功' : '减分成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      zoom(type) {
        if(this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) {
          this.scale += type ? 0.1 : -0.1
          this.$refs['drawBoard'].handleZoom(this.scale)
        }
      },
      toggle(type) {
        if (type) {
          // 下一个
          if (this.imgIndex < this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1) {
            //下一个图片
            this.imgIndex++
            this.scale = 1
          } else {
            if (this.aswIndex < this.stuArr[this.stuIndex].answer.length - 1) {
              //下一个小题
              this.aswIndex++
              this.imgIndex = 0
              this.scale = 1
            } else {
              //下一个学生
              if (this.stuIndex < this.stuArr.length - 1) {
                this.stuIndex++
                this.aswIndex = 0
                this.imgIndex = 0
                this.scale = 1
              } else {
                this.$dialog.confirm({
                  title: "",
                  message: "已经全部批改完该大题,是否回到批改列表?",
                  cancelButtonText: "取消",
                  confirmButtonText: "确定"
                }).then(() => {
                  this.$router.back()
                })
              }
            }
          }
        } else {
          //上一个
          if (this.imgIndex > 0) {
            //上一个图片
            this.imgIndex--
            this.scale = 1
          } else {
            if (this.aswIndex > 0) {
              this.aswIndex--
              this.imgIndex = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length ? this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1 : 0
              this.scale = 1
            } else {
              if (this.stuIndex > 0) {
                this.stuIndex--
                this.aswIndex = this.stuArr[this.stuIndex].answer.length ? this.stuArr[this.stuIndex].answer.length - 1 : 0
                this.imgIndex = this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length ? this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length - 1 : 0
                this.scale = 1
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
            // }
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
          this.$set(item, 'text', dom.outerText)
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
        console.log(asw.value);
        this.$refs['menuItem' + i][0].toggle(false)
        // this.value1 = `${index}分`
        this.$set(asw, 'value', score)
        if(this.autoSubmit) {
          this.$store.commit('setVanLoading', true)
         await this.examResultScroe()
          if (this.stuArr[this.stuIndex].answer[this.aswIndex].imgArr.length) {
            this.$refs['drawBoard'].save()
          }
        }
      },
      handleExit(src) {
        console.log(src);
        // this.show = false
        // this.imgList[this.imgIndex] = src
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
            }

            &__score {
              /*.icon-good-active {*/
              /*  width: 10px;*/
              /*  height: 7px;*/
              /*  margin-right: 2px;*/
              /*  vertical-align: sub;*/
              /*}*/

              &-item {
                margin-bottom: 2px;
                position: relative;
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

        .van-icon-cross {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
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
              height: 100%;
              overflow-y: auto;

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

      &-center {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .dropdown-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;

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
        align-items: center;
        justify-content: space-between;
        /*width: calc(100% - 100px);*/
        padding: 33px 105px 10px 10px;
        font-size: 10px;
        min-height: 40px;

        &.ellipsis {
          flex: 0 0 20%;

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
  }
</style>
