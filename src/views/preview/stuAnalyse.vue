<template>
  <section class="stu-analyse">
    <van-nav-bar
      :title="getStudentName($route.query.accountNo,$route.query.classId) + '的做题情况'"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <analyse-wrap @toggle="toggleQuestion">
      <div class="scroll-tab" slot="tab">
        <div class="scroll-tab__item" @click="toggleTab(item,index)" v-for="(item,index) in info.questionList" :key="index">
          <div class="scroll-tab__item-icon" :class="handleStyle(item)"><i v-if="handleStyle(item) != 'undo' || handleStyle(item) != 'uncrt'" class="iconGFY"
                                                                           :class="'icon-'+handleStyle(item)"></i></div>
          <div class="black fs10" :class="{blue:item.active}">第{{index + 1}}题</div>
        </div>
      </div>
      <div class="stu-analyse__body" v-if="info.questionList[curIndex]">
        <div class="stu-analyse__body-top">
          <div style="color: #e90707;text-align: right;" class="fs18">{{info.questionList[curIndex].score}}分</div>
          <div v-html="info.questionList[curIndex].title"></div>
          <div>正确答案: <span class="blue" v-html="info.questionList[curIndex].answer"></span></div>
          <div>学生答案: <span class="blue" v-html="info.questionList[curIndex].studentAnswer"></span></div>
          <div>答案解析:</div>
          <div v-html="info.questionList[curIndex].examExplain"></div>
        </div>
      </div>
    </analyse-wrap>
  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import {getCourseTaskDetail} from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  export default {
    name: "stuAnalyse",
    components: {analyseWrap},
    data() {
      return {
        list: [
          1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4,
        ],
        info: {examQuestionInfo:{},testPaperInfo:[],questionList:[]},
        curIndex: 0,
      }
    },
    created() {
      this.getCourseTaskDetail()
    },
    computed: {
      getStudentName() {
        return getStudentName
      }
    },
    methods: {
      toggleTab(item,index) {
        if(item.active) return
        this.curIndex = index;
        this.info.questionList.forEach(v => {
          this.$set(v,'active',false)
        })
        this.$set(item,'active',true)
      },
      toggleQuestion(bol) {
        const index = this.info.questionList.findIndex(v => v.active)
        if (bol) {
          // 下一题
          if (index < this.info.questionList.length - 1) {
            this.toggleTab(this.info.questionList[index + 1],index + 1)
          } else {
            this.$toast('没有下一题了')
          }
        } else {
          //上一题
          if (index > 0) {
            this.toggleTab(this.info.questionList[index - 1],index -1)
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
        getCourseTaskDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            let arr = []
            res.data[0].testPaperInfo.forEach((v,index) => {
              v.sectionExam.forEach((s,i) => {
                if(s.testPaperExamGroup.length) {
                  s.testPaperExamGroup.forEach((t,ti) => {
                    if(i===0&&index===0&&ti===0) this.$set(t.groupExamInfo,'active',true)
                    t.groupExamInfo.title = s.examQuestion.title + t.groupExamInfo.title
                    arr.push(t.groupExamInfo)
                  })
                }else {
                  if(i===0&&index===0) this.$set(s.examQuestion,'active',true)
                  arr.push(s.examQuestion)
                }
              })
            })
            res.data[0].questionList = arr
            this.info = res.data[0]
          }else {
            this.$toast(res.msg)
          }
        })
      },
      handleStyle(item) {
       const status = item.isRight
        if (status == 'I02') {
          return 'somewhat'
        } else if (status == 'I03') {
          return 'error'
        } else if (status == 'I01') {
          return 'correct'
        } else if(item.studentAnswer === ''){
          return 'undo'
        }else {
          return 'uncrt'
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .stu-analyse {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

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
