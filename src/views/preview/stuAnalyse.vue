<template>
  <section class="stu-analyse">
    <van-nav-bar
      :title="isfEducation?getParentName($route.query.accountNo,$route.query.classId) + '的做题情况':getStudentName($route.query.accountNo,$route.query.classId) + '的做题情况'"
      @click-left="goBack"
      left-arrow>
    </van-nav-bar>
    <analyse-wrap  class="analyse-wrap" @toggle="toggleQuestion">
      <div class="scroll-tab" slot="tab">
        <div class="scroll-tab__item" @click="toggleTab(item,index)" v-for="(item,index) in info.questionList"
             :key="index">
          <div class="scroll-tab__item-icon" :class="handleStyle(index)"><i
            v-if="handleStyle(index) != 'undo' || handleStyle(index) != 'uncrt'" class="iconGFY"
            :class="'icon-'+handleStyle(index)"></i></div>
          <div class="black fs10" :class="{blue:item.active}">第{{index + 1}}题</div>
        </div>
      </div>
      <div class="stu-analyse__body" v-if="info.questionList[curIndex]">
        <div class="stu-analyse__body-top html-img">
          <div v-if="bigExamList.bigExamAnswerList[curIndex].score" style="color: #e90707;text-align: right;" class="fs18">{{bigExamList.bigExamAnswerList[curIndex].score}}分</div>
          <div v-else style="color: #e90707;text-align: right;" class="fs18">等待老师批改</div>
          <div v-html="info.questionList[curIndex].examQuestion.title"></div>
          <div>正确答案: <span class="blue" v-html="info.questionList[curIndex].examQuestion.answer"></span></div>
          <div v-if="!info.questionList[curIndex].testPaperExamGroup.length">{{isfEducation?'家长':'学生'}}答案: <span class="blue" v-html="info.questionList[curIndex].examQuestion.studentAnswer"></span></div>
          <div>答案解析:</div>
          <div v-html="info.questionList[curIndex].examQuestion.examExplain"></div>
          <div v-for="(item,index) in info.questionList[curIndex].testPaperExamGroup" :key="index">
            <div v-html="item.groupExamInfo.title"></div>
            <div>正确答案: <span class="blue" v-html="item.groupExamInfo.answer"></span></div>
            <div>{{isfEducation?'家长':'学生'}}答案: <span class="blue" v-html="item.groupExamInfo.studentAnswer"></span></div>
            <div>答案解析:</div>
            <div v-html="item.groupExamInfo.examExplain"></div>
          </div>



        </div>
      </div>
    </analyse-wrap>
  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import {getCourseTaskDetail, getCourseTaskDetailV2} from '@/api/index'
  import {getStudentName,getParentName} from '@/utils/filter'

  export default {
    name: "stuAnalyse",
    components: {analyseWrap},
    data() {
      return {
        info: {examQuestionInfo: {}, testPaperInfo: [], questionList: []},
        curIndex: 0,
        resourceType: '',
        bigExamList: JSON.parse(JSON.stringify(this.$route.query.bigExam)),
        isfEducation:this.$route.query.isfEducation
      }
    },
    created() {
      this.getCourseTaskDetail()
    },
    computed: {
      getStudentName() {
        return getStudentName
      },
      getParentName() {
        return getParentName
      },

    },
    methods: {
       goBack(){
          this.common.goBack(this)
        },
      toggleTab(item, index) {
        if (item.active) return
        this.curIndex = index;
        this.info.questionList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
      },
      toggleQuestion(bol) {
        const index = this.info.questionList.findIndex(v => v.active)
        if (bol) {
          // 下一题
          if (index < this.info.questionList.length - 1) {
            this.toggleTab(this.info.questionList[index + 1], index + 1)
          } else {
            this.$toast('没有下一题了')
          }
        } else {
          //上一题
          if (index > 0) {
            this.toggleTab(this.info.questionList[index - 1], index - 1)
          } else {
            this.$toast('没有上一题了')
          }
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
        let api = this.$route.query.taskType === 'T10' ? getCourseTaskDetailV2 : getCourseTaskDetail
        api(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            let arr = []
            this.resourceType = res.data[0].resourceType
            if (res.data[0].resourceType === 'R03') {
              if (res.data[0].examQuestionInfo.groupExamList.length) {
                //单题有小题
                // res.data[0].examQuestionInfo.groupExamList.forEach((v, i) => {
                //   if (i === 0) v.active = true
                //   v.title = res.data[0].examQuestionInfo.title + v.title
                //   arr.push(v)
                // })
                arr.push({examQuestion:res.data[0].examQuestionInfo,testPaperExamGroup: res.data[0].examQuestionInfo.groupExamList.map(v => {
                    return {groupExamInfo:v}
                  }),active:true})
              } else {
                //单题无小题
                arr.push({examQuestion:res.data[0].examQuestionInfo,testPaperExamGroup:[],active:true})
              }
            } else {
              res.data[0].testPaperInfo.forEach((v, index) => {
                v.sectionExam.forEach((s, i) => {
                  // if (s.testPaperExamGroup.length) {
                  //   s.testPaperExamGroup.forEach((t, ti) => {
                  //     if (i === 0 && index === 0 && ti === 0) this.$set(t.groupExamInfo, 'active', true)
                  //     t.groupExamInfo.title = s.examQuestion.title + t.groupExamInfo.title
                  //     arr.push(t.groupExamInfo)
                  //   })
                  // } else {
                  //   if (i === 0 && index === 0) this.$set(s.examQuestion, 'active', true)
                  //   arr.push(s.examQuestion)
                  // }
                  if (i === 0 && index === 0) s.active = true
                  arr.push(s)
                })
              })
            }

            res.data[0].questionList = arr
            this.info = res.data[0]
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleStyle(index) {
        const item = this.bigExamList.bigExamAnswerList[index]
        const status = item.is_rigth
        if (status == 'I02') {
          return 'somewhat'
        } else if (status == 'I03') {
          return 'error'
        } else if (status == 'I01') {
          return 'correct'
        }
        // else if (item.studentAnswer === '') {
        //   return 'undo'
        // }
        else {
          return 'uncrt'
        }
        //
        // let status = item.examQuestion.isRight
        // if(item.testPaperExamGroup.length) {
        //   //单道试题有小题
        //   if((item.testPaperExamGroup.some(v => v.groupExamInfo.isRight === 'I03') && item.testPaperExamGroup.some(v => v.groupExamInfo.isRight === 'I01')) || item.testPaperExamGroup.some(v => v.groupExamInfo.isRight === 'I02')){
        //     item.examQuestion.isRight = 'I02'
        //     status = 'I02'
        //   }else if (item.testPaperExamGroup.every(v => v.groupExamInfo.isRight === 'I03')) {
        //     item.examQuestion.isRight = 'I03'
        //     status = 'I03'
        //   }else if (item.testPaperExamGroup.every(v => v.groupExamInfo.isRight === 'I01')) {
        //     item.examQuestion.isRight = 'I01'
        //     status = 'I01'
        //   }
        //  }
        // if (status == 'I02') {
        //   return 'somewhat'
        // } else if (status == 'I03') {
        //   return 'error'
        // } else if (status == 'I01') {
        //   return 'correct'
        // } else if ((!item.testPaperExamGroup.length && item.examQuestion.studentAnswer === '') || (item.testPaperExamGroup.length && item.testPaperExamGroup.some(v => v.groupExamInfo.studentAnswer === ''))) {
        //   return 'undo'
        // } else {
        //   return 'uncrt'
        // }
      },
    }
  }
</script>

<style lang="less" scoped>
  .stu-analyse {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

     .van-nav-bar {
    flex: 0 0 45px;
  }

  .analyse-wrap {
    flex: 1 !important;
    overflow: hidden;
  }

    .scroll-tab {
      flex: 0 0 71px;

      &__item {
        text-align: center;
        flex: 0 0 35px;
        border-radius: 50%;
        font-size: 12px;
        color: #777;
        margin-right: 15px;

        &-icon {
          width: 40px;
          height: 40px;
          line-height: 40px;
          margin-bottom: 5px;
          border-radius: 50%;

          &.somewhat {
            background: #ffcb3c;
          }

          &.error {
            background: #FF7484;
          }

          &.correct {
            background: #57E49D;
          }

          &.undo {
            background: #ddd;

            &::after {
              content: '未做';
              font-size: 12px;
              color: #333;
            }
          }

          &.uncrt {
            background: #ddd;

            &::after {
              content: '未批改';
              font-size: 12px;
              color: #333;
            }
          }
        }
      }
    }

    &__body {
    height: 100%;
    font-size: 12px;
    overflow-y: scroll;

      &-top {
        margin-bottom: 10px;
        padding: 12px 15px;
        background: #fff;
        overflow-x: hidden;
      }

      &-bottom {
        padding: 12px 15px;
        background: #fff;

      }
    }
  }
</style>
