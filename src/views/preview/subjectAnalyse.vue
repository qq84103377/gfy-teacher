<template>
  <section class="subject-analyse">
    <analyse-wrap @toggle="toggleQuestion">
      <div class="scroll-tab" slot="tab">
        <div class="scroll-tab__item" :class="{active:item.active}" @click="toggleTab(item)"
             v-for="(item,index) in list" :key="index">{{item.str}}
        </div>
      </div>
      <div class="subject-analyse__body">
        <div class="subject-analyse__body-top fs14">
          <div v-html="info.examQuestionInfo.title"></div>
          <div>正确答案: <span class="blue inline" v-html="info.examQuestionInfo.answer"></span></div>
          <div>答案解析:</div>
          <div v-html="info.examQuestionInfo.examExplain"></div>
        </div>
        <div class="subject-analyse__body-bottom" v-for="(item,index) in info.statStudentAnswer.stuAnswer" :key="index">
          <div class="mgb20">答案为<span class="inline" v-html="item.answer"></span>的同学:</div>
          <div style="display: flex;flex-wrap: wrap;" class="pdlt10">
            <div v-for="(stu,stuIndex) in item.studentsNew" :key="stuIndex" class="mgr10">
              {{getStudentName(stu.accountNo,$route.query.classId)}}<span style="color: #FF4141">(错误率: {{stu.percent?(stu.percent*100+'%'):'--'}})</span>
            </div>
          </div>
        </div>
      </div>
    </analyse-wrap>
  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import {getExamItemDetail} from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  export default {
    name: "subjectAnalyse",
    components: {analyseWrap},
    data() {
      return {
        list: JSON.parse(JSON.stringify(this.$route.query.questionList)),
        info: {examQuestionInfo: {}, statStudentAnswer: {stuAnswer: []}}
      }
    },
    computed: {
      getStudentName() {
        return getStudentName
      }
    },
    created() {
      const {examId, groupId} = this.$route.query
      const index = this.list.findIndex(v => (v.examId || v.examGroupId) === examId)
      this.$set(this.list[index], 'active', true)
      this.getExamItemDetail(examId, groupId)
    },
    methods: {
      toggleQuestion(bol) {
        const index = this.list.findIndex(v => v.active)
        if (bol) {
          // 下一题
          if (index < this.list.length - 1) {
            this.toggleTab(this.list[index + 1])
          } else {
            this.$toast('没有下一题了')
          }
        } else {
          //上一题
          if (index > 0) {
            this.toggleTab(this.list[index - 1])
          } else {
            this.$toast('没有上一题了')
          }
        }
      },
      toggleTab(item) {
        if (item.active) return
        this.list.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.getExamItemDetail(item.examId||item.examGroupId, item.groupId)
      },
      getExamItemDetail(examId, groupId) {
        this.$store.commit('setVanLoading', true)
        const {taskId, classId} = this.$route.query
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          taskId,
          examId,
          classId,
          groupId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getExamItemDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.info = res.data[0]
          } else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .subject-analyse {
    background: #f5f5f5;

    .scroll-tab {
      &__item {
        text-align: center;
        flex: 0 0 35px;
        line-height: 35px;
        height: 35px;
        background: #eee;
        border-radius: 50%;
        font-size: 12px;
        color: #777;
        margin-right: 10px;

        &.active {
          color: #fff;
          background: @blue;
        }
      }
    }

    &__body {
      height: 100%;
      font-size: 12px;

      &-top {
        padding: 12px 15px;
        background: #fff;
      }

      &-bottom {
        padding: 12px 15px;
        background: #fff;
        margin-top: 10px;
      }
    }
  }
</style>
