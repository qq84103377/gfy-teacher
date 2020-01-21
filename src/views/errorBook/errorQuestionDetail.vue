<template>
  <section class="error-question-detail">
    <van-nav-bar
      :title="$route.query.courseName"
      @click-left="goBack"
      left-arrow>
    </van-nav-bar>
    <div class="error-question-detail__body">
      <question-item @add="handleAdd($event,item)" @correct="correctInfo=item;correctShow=true" @changeItem="changeItem" :is-question="true" 
                     :is-send="false" v-for="(item,index) in questionList" :key="index"
                     :item="item" :index="index" :showTooltip.sync='item.showTooltip'  :showDel.sync="item.showDel"></question-item>
    </div>
    <!--  纠错弹窗-->
    <correct-pop :correctInfo="correctInfo" :show.sync="correctShow"></correct-pop>
    <exam-bar ref="examBar" type="error" v-model="selectList"  @clear="clear" :can-add-course="true"></exam-bar>
  </section>
</template>

<script>
  import correctPop from '../../components/correctPop'
  import questionItem from '../../components/questionItem'
  import examBar from '../../components/examBar'
  import {getTeacherErrorExamDetail, getExamSectionTypeRelation} from '@/api/index'

  export default {
    name: "errorQuestionDetail",
    components: {examBar, questionItem, correctPop},
    data() {
      return {
        selectList: this.$store.getters.getErrorBookSelected,
        questionList: [],
        correctInfo: {},
        correctShow: false,
        questionTypeList: [],
      clickItem:'',
      }
    },
    watch: {
      selectList: {
        handler() {
          this.$store.commit('setErrorBookSelected',this.selectList)
        },
        deep: true
      }
    },
    beforeRouteLeave(to, from, next) {
    if (to.path !== '/errorBook') {
      this.showDel = false
      this.correctShow = false
      this.filterShow2 = false
      this.addExam = false
      this.selectPop = false
      next()
      return
    }
    console.log(this.clickItem.showDel,'this.showDel')

    // if (this.clickItem&&this.clickItem.showDel) {
    //   this.questionList.some(ele=>{
    //     if (ele.showDel) {
    //       ele.showDel=false
    //       return true
    //     }
    //   })
    //   next(false)
    // } else 
    if (this.correctShow) {
      this.correctShow = false
      next(false)
    }  else if (this.clickItem&&this.clickItem.showDel) {
      this.questionList.some(ele=>{
        if (ele.showDel) {
          ele.showDel=false
          return true
        }
      })
      next(false)
    } else if (this.clickItem&&this.clickItem.showTooltip) {
      this.questionList.some(ele=>{
        if (ele.showTooltip) {
          ele.showTooltip=false
          return true
        }
      })
      next(false)
    } else if (this.$refs['examBar']&&this.$refs['examBar'].filterShow) {
      this.$refs['examBar'].filterShow = false
      next(false)
    } else if (this.$refs['examBar']&&this.$refs['examBar'].addExam) {
      this.$refs['examBar'].addExam = false
      next(false)
    } else if (this.$refs['examBar']&&this.$refs['examBar'].selectPop) {
      this.$refs['examBar'].selectPop = false
      next(false)
    } else {
      next()
    }
  },
    methods: {
      changeItem(item){
        this.clickItem=item
      },
   goBack(){
          this.common.goBack(this)
        },
      clear() {
        //清空所有试题时需要移除试题的添加状态样式
        this.questionList.forEach(v => {
          this.$set(v,'isRemove',false)
        })
        this.$store.commit('setErrorBookCourse',[])
      },
      handleAdd(isRemove, item) {
        if (isRemove) {
          // 移除
          const index = this.selectList.findIndex(v => v.examType === item.titleType)
          if (this.selectList[index].child.length === 1) {
            //整个this.selectList[index]删除
            this.selectList.splice(index, 1)
          } else {
            // 只删除this.selectList[index].child[childIndex]
            const childIndex = this.selectList[index].child.findIndex(v => v.examId === item.examId)
            this.selectList[index].child.splice(childIndex, 1)
          }
        } else {
          //添加
          const index = this.selectList.findIndex(v => v.examType === item.titleType)
          if (index > -1) {
            // 添加的试题已存在相同题型
            this.selectList[index].child.push(item)
          } else {
            //添加的试题不存在相同题型
            const sectionIndex = this.questionTypeList.findIndex(v => v.examType === item.titleType)
            const typeItem = this.questionTypeList[sectionIndex]
            this.selectList.push({
              sectionName: typeItem.sectionName,
              examType: typeItem.examType,
              sectionType: typeItem.sectionType,
              sectionIndex: sectionIndex,
              child: [item]
            })
          }
          //添加课程ID,用于生成试卷后跳转资源中心试题列表
          this.$store.commit('setErrorBookQuestionCourse',this.$route.query.courseId)
        }
        //添加试题时判断该课程内的试题是否全部已添加,如果是,则把该课程的添加状态激活,否则取消激活状态
        const arr = this.$store.getters.getErrorBookCourse
        if(this.questionList.every(v => v.isRemove)) {
          arr.push(this.$route.query.courseId)
          this.$store.commit('setErrorBookCourse',arr)
        }else {
         const index = arr.indexOf(this.$route.query.courseId)
          if(index > -1) {
            arr.splice(index,1)
            this.$store.commit('setErrorBookCourse',arr)
          }
        }
      },
      getExamSectionTypeRelation() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "currPage": 1,
          "pageSize": 999,
          "examSectionTypeRlation": {
            "seqId": null,//编号可空
            "subjectType": localStorage.currentSubjectType, //学科（课程时由课程信息获取，资源中心时有所选学科获取）
            "examType": null,//题型，可空
            "sectionType": null //章节类型，可空
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getExamSectionTypeRelation(params).then(res => {
          if (res.flag) {
            this.questionTypeList = res.examSectionTypeRlationList
          }
        })
      },
      getTeacherErrorExamDetail() {
        const {errorPersent, classId, classGrade, termType, courseId} = this.$route.query
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: localStorage.currentSubjectType,
          errorPersent,
          classId,
          classGrade,
          termType,
          sysCourseIdList: [courseId],
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTeacherErrorExamDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            //每道题目加上序号
            res.data[0].examQuestionInfo.forEach((v,i) => {
              v.title = `<p>${i+1}、</p>${v.title}`
            })
            this.questionList = res.data[0].examQuestionInfo
           // const selectIds = this.$store.getters.getErrorBookSelected.reduce((t,v) => {
           //     const arr = v.child.map(c => c.examId)
           //    t.push(...arr)
           //    return t
           //  },[])

            // 加载试题列表时要对已选中的试题添加样式状态
            this.$store.getters.getErrorBookSelected.forEach(s => {
              s.child.forEach(c => {
                this.questionList.forEach(v => {
                  if(c.examId === v.examId) {
                    this.$set(v,'isRemove',true)
                  }
                })
              })
            })

          } else {
            this.$toast(res.msg)
          }

        })
      }
    },
    created() {
      this.getExamSectionTypeRelation()
      this.getTeacherErrorExamDetail()
    }
  }
</script>

<style lang="less" scoped>
  .error-question-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
