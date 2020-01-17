<template>
  <section class="exam-detail">
    <van-nav-bar
      :title="title"
      @click-left="goBack"
      left-arrow>
    </van-nav-bar>
    <div class="exam-detail__body">
      <div class="exam-detail__body__score">
        <span style="font-weight: bold;flex: 1">已选入{{total}}道试题</span>
        <span class="red">总分: {{score}}</span>
      </div>
      <div v-for="(section,si) in list" :key="si">
        <div class="exam-detail__body__question-num">
          <div style="font-weight: bold;">{{numToWord(si + 1)}}.{{section.testPaperSectionInfo.sectionName}}<span>(共{{section.testPaperSectionInfo.sectionScore}}分)</span>
<!--          <div style="font-weight: bold;">{{numToWord(si + 1)}}.{{section.testPaperSectionInfo.sectionName}}<span>(共{{calSectionScore(section)}}分)</span>-->
          </div>
          <div v-if="!$route.query.fromTask" class="aic">
            <div v-if="si>0" class="set-point" @click="updateTestPaperSectonIndex(0,si)">上移</div>
            <div v-if="si<list.length-1" class="set-point" @click="updateTestPaperSectonIndex(1,si)">下移</div>
            <div v-if="!$route.query.fromLec" class="set-point" @click="setSectionPoint(section,si)">设置分数</div>
          </div>
        </div>
        <question-item :up="ei>0" :down="ei<section.sectionExamList.length-1" :is-send="$route.query.fromTask" :is-lec="$route.query.fromLec"
                       @add="handleAdd(si,ei,exam)" v-for="(exam,ei) in section.sectionExamList" :key="ei"
                       @setPoint="setPoint($event,exam,si,ei)"
                       @move="handleMove($event,section.sectionExamList,ei,si)" :item="exam.examQuestion"
                       @correct="correctInfo=exam.examQuestion;correctShow=true"
                       :index="si+'-'+ei">
          <div slot="num">{{ei+1}}.本题{{exam.sectionExamInfo.examScore}}分</div>
        </question-item>
      </div>
    </div>
    <!--      type需要动态变化 设置分数/纠错/上下移/添加试题/设置分数 这些操作都需要改变type    -->
    <exam-bar v-if="!$route.query.fromTask && !$route.query.fromLec" @addDone="addDone" v-model="selectList" @clear="clear" :length="list.length" :type="!isModify?'task':''"
            :canAddCourse="$route.query.flag==1" :can-select="true"></exam-bar>
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
  import * as calculate from '@/utils/calculate'
  import {
    updateTestPaperSectonIndex,
    getTestPaperExamInfo,
    updateTestPaperSubExamScore,
    updateTestPaperExamScore,
    delTestPaperExamInfo
  } from '@/api/index'
  import {numToWord} from '@/utils/filter'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "examDetail",
    components: {questionItem, examBar, correctPop, setPointDialog},
    computed: {
      numToWord() {
        return numToWord
      },
      // isSend() {
      //   return this.$route.query.type == 1   // 0 未发 1 已发
      // },
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
    watch: {
      '$route'(to,from) {
        console.log(to,from,'ffffff');

      }
    },
    /**
     * $route.query.flag 是否能选择添加到课程(只有资源中心的试题详情和错题本试题详情和未结束任务的试卷详情才能显示)
     */
    data() {
      return {
        title: this.$route.query.title,
        isSend: this.$route.query.type == 1, // 0 未发 1 已发
        // isOther: this.$route.query.isOther == 1, // 1 别人 0 自己
        selectList: [],
        correctShow: false,
        setPointShow: false,
        list: [],
        setPointInfo: {},
        childIndex: '',
        correctInfo: {},
        secArr: [],  // 设置章节分数时用到
        sectionIndex: 0,  //章节
        examIndex: 0,  //大题
        isModify: false, //是否有修改过
      }
    },
    methods: {
       goBack(){
          this.common.goBack(this)
        },
      addDone(title) {
        this.title = title
        this.isModify = false
        eventBus.$emit('examListRefresh', true)
      },
      calSectionScore(section) {
        let score = 0
        section.sectionExamList.forEach(s => {
          if(s.examQuestion.groupExamList.length) {
            s.examQuestion.groupExamList.forEach(g => {
              score = calculate.add(score,g.examScore)
            })
          }else {
            score = calculate.add(score,s.sectionExamInfo.examScore)
          }
        })
        return score
      },
      //数组元素之间互换
      swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      },
      updateTestPaperSectonIndex(type, index) {
        // if (this.isOther) {
        if(this.$route.query.fromLec) {
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
        }else {
          this.isModify = true
          this.list = this.swapArray(this.list, index, index + (type ? 1 : -1))
          this.selectList = this.swapArray(this.selectList, index, index + (type ? 1 : -1))
        }

          return
        // }
        /**
         * //由于需求变更,所有的改分/上下移/添加移除试题都不再修改原试卷,所以以下内容作废
         */
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
      handleMove(type, arr, index,sectionIndex) {
         if(this.$route.query.fromLec) {
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
         }else {
           this.isModify = true
           this.sectionIndex = sectionIndex
           this.list[this.sectionIndex].sectionExamList = this.swapArray(this.list[this.sectionIndex].sectionExamList, index, index + (type ? 1 : -1))
           this.selectList[this.sectionIndex].child = this.swapArray(this.selectList[this.sectionIndex].child, index, index + (type ? 1 : -1))
         }

        return
        /**
         * //由于需求变更,所有的改分/上下移/添加移除试题都不再修改原试卷,所以以下内容作废
         */

      },
      handleAdd(sectionIndex,examIndex,exam) {
        this.isModify = true
        this.list[sectionIndex].sectionExamList.splice(examIndex,1)
        if(!this.list[sectionIndex].sectionExamList.length) {
          //如果移除的大题是这个题型的最后一题,则把整个题型删除
          this.list.splice(sectionIndex,1)
          this.selectList.splice(sectionIndex,1)
        }else {
          //修改章节分数
          this.list[sectionIndex].testPaperSectionInfo.sectionScore = calculate.sub(this.list[sectionIndex].testPaperSectionInfo.sectionScore,exam.sectionExamInfo.examScore)
          this.selectList[sectionIndex].child.splice(examIndex,1)
        }
        return
        /**
         * //由于需求变更,所有的改分/上下移/添加移除试题都不再修改原试卷,所以以下内容作废
         */
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
      setSectionPoint(section, si) {
        this.setPointShow = true
        this.childIndex = undefined
        this.secArr = section.sectionExamList
        this.sectionIndex = si
      },
      //设置分数(没有保存后台)
      setScoreForView(scoreValue) {
        if (this.secArr.length) {
          const avergePoint = Math.floor(scoreValue / this.secArr.length) // 每大题分配的分数
          // 章节设置分数
          this.list[this.sectionIndex].testPaperSectionInfo.sectionScore = scoreValue * 1
          this.list[this.sectionIndex].sectionExamList.forEach((e, i) => {
            //章节内大题的总分
            e.sectionExamInfo.examScore = ((i === this.secArr.length - 1) ? (scoreValue % this.secArr.length + avergePoint) : avergePoint)
            this.selectList[this.sectionIndex].child[i].score = e.sectionExamInfo.examScore
            if (e.examQuestion.groupExamList.length) {
              //有小题
              e.examQuestion.groupExamList.forEach((t, ti) => {
                const p = Math.floor(e.sectionExamInfo.examScore / e.examQuestion.groupExamList.length) //每小题分配的分数
                t.examScore = ((ti === e.examQuestion.groupExamList.length - 1) ? (e.sectionExamInfo.examScore % e.examQuestion.groupExamList.length + p) : p)
                this.selectList[this.sectionIndex].child[i].groupExamList[ti].examScore = t.examScore
              })
            }else {
              //无小题

            }
          })
        } else {
          // 非章节
          if(this.childIndex === undefined) {
            //点击了大题设置分数
            const length = this.list[this.sectionIndex].sectionExamList[this.examIndex].examQuestion.groupExamList.length
            // this.list[this.sectionIndex].sectionExamList[this.examIndex].examQuestion.score = scoreValue
            //修改大题分数
            this.list[this.sectionIndex].sectionExamList[this.examIndex].sectionExamInfo.examScore = scoreValue

            if (length) {
              //大题内有小题
              this.list[this.sectionIndex].sectionExamList[this.examIndex].examQuestion.groupExamList.forEach((g,gi) => {
                const p = Math.floor(scoreValue / length) //每小题分配的分数
                g.examScore = ((gi === length - 1) ? (scoreValue % length + p) : p)
                this.selectList[this.sectionIndex].child[this.examIndex].groupExamList[gi].examScore = g.examScore
              })
            } else {
              //大题内无小题
            }
          }else {
            //点击了小题设置分数
            this.list[this.sectionIndex].sectionExamList[this.examIndex].examQuestion.groupExamList[this.childIndex].examScore = scoreValue
            this.selectList[this.sectionIndex].child[this.examIndex].groupExamList[this.childIndex].examScore = scoreValue
            //修改大题分数
            this.list[this.sectionIndex].sectionExamList[this.examIndex].sectionExamInfo.examScore = this.list[this.sectionIndex].sectionExamList[this.examIndex].examQuestion.groupExamList.reduce((t,v) => {
              t = calculate.add(t,v.examScore)
              return t
            },0)
          }
          //修改章节总分
          this.list[this.sectionIndex].testPaperSectionInfo.sectionScore = this.calSectionScore(this.list[this.sectionIndex])
        }
      },
      submitScore(scoreValue) {
        this.isModify = true
        this.setScoreForView(scoreValue)
          return
        /**
         * //由于需求变更,所有的改分/上下移/添加移除试题都不再修改原试卷,所以以下内容作废
         */
        if (this.secArr.length) {
          // 章节设置分数
          let subQuestion = [] //有小题的题目数组
          let question = []  //无小题的题目数组
          const avergePoint = Math.floor(scoreValue / this.secArr.length) // 每大题分配的分数
          let subPoint = 0 //有小题的题目的总分
          let point = 0   // 无小题的题目的总分

          this.secArr.forEach((e, i) => {
            if (e.testPaperExamGroupList.length) {
              // 有小题
              subPoint += ((i === this.secArr.length - 1) ? (scoreValue % this.secArr.length + avergePoint) : avergePoint)
              subQuestion.push(e)
            } else {
              //无小题
              point += ((i === this.secArr.length - 1) ? (scoreValue % this.secArr.length + avergePoint) : avergePoint)
              question.push(e)
            }
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
      setPoint(childIndex, parent,sectionIndex,examIndex) {
        //sectionIndex 章节Index  examIndex 大题Index
        this.setPointInfo = parent
        this.sectionIndex = sectionIndex
        this.examIndex = examIndex
        this.childIndex = childIndex   // childIndex 有的话就是点击了小题的设置分数,否则就是点击了大题的设置分数
        this.setPointShow = true
        this.secArr = []
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
            res.testPaperSectionList.forEach((sec, secIndex) => {
              this.selectList.push({
                sectionName: sec.testPaperSectionInfo.sectionName,
                // child: {length:sec.sectionExamList.length}
                child: []
              })
              sec.sectionExamList.forEach(exam => {
                exam.sectionName = sec.testPaperSectionInfo.sectionName
                exam.sectionIndex = sec.testPaperSectionInfo.sectionIndex
                exam.examQuestion.score = exam.sectionExamInfo.examScore
                exam.examQuestion.isRemove = true
                exam.examQuestion.groupExamList = exam.testPaperExamGroupList.map(v => {
                  return {
                    ...v.groupExamInfo,
                    examScore: v.testPaperExamGroupInfo.examScore,
                    groupIndex: v.testPaperExamGroupInfo.groupIndex
                  }
                })
                this.selectList[secIndex].child.push(exam.examQuestion)
              })
            })
            this.list = res.testPaperSectionList || []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      clear() {
        this.isModify = true
        this.list = []
        return
        /**
         * //由于需求变更,所有的改分/上下移/添加移除试题都不再修改原试卷,所以以下内容作废
         */
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
    },
    mounted() {
      eventBus.$off("examDetailRefresh")
      eventBus.$on("examDetailRefresh", (data) => {
        this.isSend = true
        eventBus.$emit("examListRefresh", true); // 试卷列表或试卷详情发完任务以后要刷新列表或详情,要将已发状态更新,不然会导致已发的试卷还能重复发任务
      })
    },
    beforeRouteEnter(to, from, next) {
      if(from.path === '/questionList') {
        next(vm => {
          //将移除的试题在页面上清理掉
          vm.$store.getters.getRemoveQuestionList.forEach(id => {
            for(let k in vm.list) {
               const index = vm.list[k].sectionExamList.findIndex(q => q.examQuestion.examId === id)
                if(index > -1) {
                  //找到该试题
                  // vm.list[k].sectionExamList.splice(index,1)
                  vm.handleAdd(k,index,vm.list[k].sectionExamList[index])
                  break
                }
            }
          })

          vm.selectList = vm.$store.getters.getResQuestionSelect
          //找出在资源中心添加的试题
          vm.selectList.forEach(v => {
            v.child.forEach(c => {

              //找出对应的题型
             const index = vm.list.findIndex(item => item.testPaperSectionInfo.sectionName === v.sectionName)
              if(index > -1) {
                //有该题型

                //没有对应的试题
                if(!vm.list[index].sectionExamList.some(item => item.examQuestion.examId === c.examId)) {
                  vm.isModify = true
                  vm.list[index].sectionExamList.push({
                    examQuestion : c,
                    sectionExamInfo: {
                      examId: c.examId,
                      examScore: 5
                    },
                    sectionIndex: vm.list[index].sectionExamList.length + 1,
                    sectionName: v.sectionName,
                    testPaperExamGroupList: c.groupExamList || []
                  })
                  vm.list[index].testPaperSectionInfo.sectionScore = vm.list[index].testPaperSectionInfo.sectionScore * 1 + 5
                  vm.list[index].testPaperSectionInfo.sectionExamNum++
                }
              }else {
                //没有题型
                vm.isModify = true
                vm.list.push({
                  sectionExamList: [{
                    examQuestion : c,
                    sectionExamInfo: {
                      examId: c.examId,
                      examScore: 5
                    },
                    sectionIndex: vm.list.length + 1,
                    sectionName: v.sectionName,
                    testPaperExamGroupList: c.groupExamList || []
                  }],
                  testPaperSectionInfo: {
                    sectionExamNum: 1,
                    sectionIndex: vm.list.length + 1,
                    sectionName: v.sectionName,
                    sectionScore: 5,
                    sectionType: v.sectionType
                  }
                })
              }
            })
          })
        })
      }else {
        next();
      }
    },
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
