<template>
  <section class="exam-detail">
    <van-nav-bar
      :title="$route.query.title"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="exam-detail__body">
      <div class="exam-detail__body__score">
        <span v-if="!isSend" style="font-weight: bold;flex: 1">已选入{{total}}道试题</span>
        <span class="red">总分: {{score}}</span>
      </div>
      <div v-for="(section,si) in list" :key="si">
        <div class="exam-detail__body__question-num">
          <div style="font-weight: bold;">{{numToWord(si + 1)}}.{{section.testPaperSectionInfo.sectionName}}<span>(共{{section.testPaperSectionInfo.sectionScore}}分)</span>
          </div>
          <div class="aic">
            <div v-if="!isSend&&si>0" class="set-point" @click="updateTestPaperSectonIndex(0,si)">上移</div>
            <div v-if="!isSend&&si<list.length-1" class="set-point" @click="updateTestPaperSectonIndex(1,si)">下移</div>
            <div v-if="!isSend" class="set-point" @click="setSectionPoint(section)">设置分数</div>
          </div>
        </div>
        <question-item :up="ei>0" :down="ei<section.sectionExamList.length-1" :is-send="isSend"
                       @add="handleAdd(exam)" v-for="(exam,ei) in section.sectionExamList" :key="ei"
                       @setPoint="setPoint($event,exam)"
                       @move="handleMove($event,section.sectionExamList,ei)" :item="exam.examQuestion"
                       @correct="correctInfo=exam.examQuestion;correctShow=true"
                       :index="si+'-'+ei">
          <div slot="num">{{ei+1}}.本题{{exam.sectionExamInfo.examScore}}分</div>
        </question-item>
      </div>
    </div>
    <!--      type需要动态变化 设置分数/纠错/上下移/添加试题/设置分数 这些操作都需要改变type    -->
        <exam-bar v-model="selectList" @clear="clear" :length="list.length" type="task" v-if="!isSend" :can-select="true"></exam-bar>
    <!--  纠错弹窗-->
    <correct-pop :correctInfo="correctInfo" :show.sync="correctShow"></correct-pop>
    <!--      设置分数-->
    <set-point-dialog :show.sync="setPointShow"
                      @confirm="submitScore"></set-point-dialog>
  </section>
</template>

<script>
  import questionItem from '../../components/questionItem'
  import examBar from '../../components/examBar'
  import correctPop from '../../components/correctPop'
  import setPointDialog from '../../components/setPointDialog'
  import {
    updateTestPaperSectonIndex,
    getTestPaperExamInfo,
    updateTestPaperSubExamScore,
    updateTestPaperExamScore,
    delTestPaperExamInfo
  } from '@/api/index'
  import {numToWord} from '@/utils/filter'

  export default {
    name: "examDetail",
    components: {questionItem, examBar, correctPop, setPointDialog},
    computed: {
      numToWord() {
        return numToWord
      },
      isSend() {
        return this.$route.query.type == 1   // 0 未发 1 已发
      },
      total() {
        return this.list.reduce((t, v) => {
          t += v.sectionExamList.length
          return t
        }, 0)
      },
      score() {
        return this.list.reduce((t, v) => {
          t += v.testPaperSectionInfo.sectionScore
          return t
        }, 0)
      }
    },
    data() {
      return {
        selectList: [],
        correctShow: false,
        setPointShow: false,
        list: [],
        setPointInfo: {},
        childIndex: '',
        correctInfo: {},
        secArr: []  // 设置章节分数时用到
      }
    },
    methods: {
      updateTestPaperSectonIndex(type,index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId,
          "testPaperExamInfoList": [{
            "sectionType": this.list[index].testPaperSectionInfo.sectionType,
            "sectionName": this.list[index].testPaperSectionInfo.sectionName,
            "sectionIndex": this.list[index + (type ? 1 : -1)].testPaperSectionInfo.sectionIndex,
          }, {
            "sectionType": this.list[index + (type ? 1 : -1)].testPaperSectionInfo.sectionType,
            "sectionName": this.list[index + (type ? 1 : -1)].testPaperSectionInfo.sectionName,
            "sectionIndex": this.list[index].testPaperSectionInfo.sectionIndex,
          }]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateTestPaperSectonIndex(params).then(res => {
          if (res.flag) {
            this.$toast('修改成功')
            this.getDetail()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleMove(type, arr, index) {
        // type :  1-下移   0-上移
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId,
          testPaperExamInfoList: [
            {
              examId: arr[index].sectionExamInfo.examId,
              examIndex: arr[index + (type ? 1 : -1)].sectionExamInfo.examIndex,
              examScore: arr[index].sectionExamInfo.examScore
            },
            {
              examId: arr[index + (type ? 1 : -1)].sectionExamInfo.examId,
              examIndex: arr[index].sectionExamInfo.examIndex,
              examScore: arr[index + (type ? 1 : -1)].sectionExamInfo.examScore
            },
          ]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateTestPaperExamScore(params).then(res => {
          if (res.flag) {
            this.$toast('修改成功')
            this.getDetail()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleAdd(exam) {
        let testPaperExamInfoList = []
        testPaperExamInfoList.push({
          "examId": exam.examQuestion.examId,
          "examIndex": exam.sectionExamInfo.examIndex,
          "sectionType": exam.sectionExamInfo.sectionType,
          "subjectType": exam.examQuestion.subjectType,
          "sectionName": exam.sectionName,
          "sectionIndex": exam.sectionIndex,
          examScore: exam.sectionExamInfo.examScore,
          "groupId": exam.examQuestion.groupId,
          groupExamReList: []
        })
        this.delTestPaperExamInfo(testPaperExamInfoList)
      },
      delTestPaperExamInfo(testPaperExamInfoList) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId,
          testPaperExamInfoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        delTestPaperExamInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast('移除成功')
            this.getDetail()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      setSectionPoint(section) {
        this.setPointShow = true
        this.childIndex = undefined
        this.secArr = section.sectionExamList
      },
      submitScore(scoreValue) {
        if (this.secArr.length) {
          // 章节设置分数
          let subQuestion = [] //有小题的题目数组
          let question = []  //无小题的题目数组
          const avergePoint = Math.floor(scoreValue / this.secArr.length) // 每大题分配的分数
          let subPoint = 0 //有小题的题目的总分
          let point = 0   // 无小题的题目的总分
          this.secArr.forEach((e, i) => {
            debugger
            // v.sectionExamList.forEach((e,i) => {
            if (e.testPaperExamGroupList.length) {
              // 有小题
              subPoint += ((i === this.secArr.length - 1) ? (scoreValue % this.secArr.length + avergePoint) : avergePoint)
              subQuestion.push(e)
            } else {
              //无小题
              point += ((i === this.secArr.length - 1) ? (scoreValue % this.secArr.length + avergePoint) : avergePoint)
              question.push(e)
            }
            // })
          })

          if (subQuestion.length) {
            //有小题
            this.updateTestPaperSubExamScore(subPoint, subQuestion)
          }
          if (question.length) {
            //无小题
            this.updateTestPaperExamScore(point, question)
          }
        } else {
          // 非章节
          if (this.setPointInfo.examQuestion.groupExamList.length) {
            //有小题
            this.updateTestPaperSubExamScore(scoreValue)
          } else {
            //无小题
            this.updateTestPaperExamScore(scoreValue)
          }
        }
      },
      setPoint(childIndex, parent) {
        this.setPointInfo = parent
        this.childIndex = childIndex
        this.setPointShow = true
      },
      //设置参数
      handleParams(v, scoreValue) {
        let bScore = 0,  // 大题总分
          mScore = 0,  // 小题分数
          point = 0   //设置有小题的大题分数时 每个小题的平均分
        if (this.childIndex === undefined && v.examQuestion.groupExamList.length) {
          point = Math.floor(scoreValue / v.examQuestion.groupExamList.length)
        }
        let groupExamReList = v.examQuestion.groupExamList.map((e, i) => {
          if (this.childIndex === undefined) {
            // 设置有小题的大题分数
            if (i === v.examQuestion.groupExamList.length - 1) {
              bScore += point + scoreValue % v.examQuestion.groupExamList.length
              mScore = point + scoreValue % v.examQuestion.groupExamList.length
            } else {
              bScore += point
              mScore = point
            }
          } else {
            // 设置小题分数
            bScore += (i === this.childIndex ? scoreValue * 1 : e.examScore)
            mScore = (i === this.childIndex ? scoreValue * 1 : e.examScore)
          }
          return {
            "examGroupId": e.examGroupId,
            "groupId": e.groupId,
            "autoScoring": e.autoScoring,
            "groupIndex": e.groupIndex,
            "examScore": mScore,
          }
        })
        return {
          "examId": v.examQuestion.examId,
          "examIndex": v.sectionExamInfo.examIndex,
          "sectionType": v.sectionExamInfo.sectionType,
          "subjectType": v.examQuestion.subjectType,
          "sectionName": v.sectionName,
          "sectionIndex": v.sectionIndex,
          examScore: v.examQuestion.groupExamList.length ? bScore : scoreValue,
          "groupId": v.examQuestion.groupId,
          groupExamReList,
        }
      },
      // 无小题时调用
      updateTestPaperExamScore(scoreValue, arr) {
        let testPaperExamInfoList = []
        if (arr) {
          // 设置章节分数
          const point = Math.floor(scoreValue / arr.length)
          arr.forEach((v, i) => {
            const item = this.handleParams(v, (i === arr.length - 1) ? (scoreValue % arr.length + point) : point)
            testPaperExamInfoList.push(item)
          })
        } else {
          //非章节
          const item = this.handleParams(this.setPointInfo, scoreValue)
          testPaperExamInfoList.push(item)
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId,
          testPaperExamInfoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateTestPaperExamScore(params).then(res => {
          if (res.flag) {
            this.$toast('修改成功')
            this.getDetail()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      // 有小题时调用
      updateTestPaperSubExamScore(scoreValue, arr) {
        let testPaperExamInfoList = []
        if (arr) {
          // 设置章节分数
          arr.forEach((v, i) => {
            const point = Math.floor(scoreValue / arr.length)
            const item = this.handleParams(v, (i === arr.length - 1) ? (scoreValue % arr.length + point) : point)
            testPaperExamInfoList.push(item)
          })
        } else {
          // 非章节
          const item = this.handleParams(this.setPointInfo, scoreValue)
          testPaperExamInfoList.push(item)
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId,
          testPaperExamInfoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateTestPaperSubExamScore(params).then(res => {
          if (res.flag) {
            this.$toast('修改成功')
            this.getDetail()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      getDetail() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperId": this.$route.query.testPaperId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTestPaperExamInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.selectList = []
            // 整理返回的试题列表 跟试题列表返回格式一致
            res.testPaperSectionList.forEach(sec => {
             this.selectList.push({
               sectionName: sec.testPaperSectionInfo.sectionName,
               child: {length:sec.sectionExamList.length}
             })
              sec.sectionExamList.forEach(exam => {
                exam.sectionName = sec.testPaperSectionInfo.sectionName
                exam.sectionIndex = sec.testPaperSectionInfo.sectionIndex
                exam.examQuestion.isRemove = true
                exam.examQuestion.groupExamList = exam.testPaperExamGroupList.map(v => {
                  return {
                    ...v.groupExamInfo,
                    examScore: v.testPaperExamGroupInfo.examScore,
                    groupIndex: v.testPaperExamGroupInfo.groupIndex
                  }
                })
              })
            })
            this.list = res.testPaperSectionList || []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      clear() {
        //清空所有试题时需要移除试题的添加状态样式
        // this.list.forEach(v => {
        //   this.$set(v,'isRemove',false)
        // })
        let arr = []
        this.list.forEach(v => {
          v.sectionExamList.forEach(s => {
            arr.push({
              "examId": s.examQuestion.examId,
              "examIndex": s.sectionExamInfo.examIndex,
              "sectionType": s.sectionExamInfo.sectionType,
              "subjectType": s.examQuestion.subjectType,
              "sectionName": s.sectionName,
              "sectionIndex": s.sectionIndex,
              examScore: s.sectionExamInfo.examScore,
              "groupId": s.examQuestion.groupId,
              groupExamReList: []
            })
          })
        })
        this.delTestPaperExamInfo(arr)
      },
    },
    created() {
      this.getDetail()
    }
  }
</script>

<style lang="less" scoped>
  .exam-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;

      &__score, &__question-num {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px;
        background: #fff;
      }

      &__question-num {
        background: #f5f5f5;
        justify-content: space-between;

        .set-point {
          margin-left: 10px;
          border-radius: 10px;
          border: 1px solid #999;
          font-size: 12px;
          padding: 0 7px;
          line-height: 22px;
        }
      }
    }

    .question-item-wrap:last-child {
      margin-bottom: 0;
    }
  }
</style>
