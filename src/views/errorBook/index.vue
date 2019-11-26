<template>
  <section class="error-book">
    <van-nav-bar
      title="错题集"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs12 blue" @click="filterShow=true">筛选</div>
    </van-nav-bar>
    <div class="error-book__tab van-hairline--bottom">
      <span class="fs15 grey6" style="white-space: nowrap">错误率</span>
      <div @click="selectError(item)" :class="{active:item.active}" v-for="(item,index) in errorPercent"
           :key="index">{{item.value}}
      </div>
    </div>
    <div class="error-book__body">
      <div class="error-book__body-title van-hairline--bottom">课程列表 <span class="blue">| {{filterName}}</span></div>
      <div class="error-book__body-list">
        <div v-if="!courseList.length && !vanLoading" class="empty-page">
          <img src="../../assets/img/preview/task_null.png" alt />
          <div class="grey9 fs12">当前没有课程错题~</div>
        </div>
        <div v-for="(item,index) in courseList" :key="index" class="list-item van-hairline--bottom">
          <div style="flex:1" @click="viewDetail(item)">
            <div class="fs15 black" style="word-break: break-all">《{{item.sysCourseName}}》</div>
            <div class="fs12 grey6 mgt5">(错题数:{{item.sysCourseErrorCount}})</div>
          </div>
          <div class="list-item__btn" :class="{active:item.active}" @click="selectCourse(item)">{{item.active?'取消':'添加'}}</div>
        </div>
      </div>
    </div>

    <course-filter ref="courseFilter" @confirm="confirmCb" :visible.sync="filterShow" :sysCourseId.sync="sysCourseId"
                   type="myCourse"></course-filter>
    <exam-bar type="error" v-model="selectList" @clear="clear" :can-add-course="true"></exam-bar>
  </section>
</template>

<script>
  import courseFilter from '../../components/courseFilter'
  import examBar from '../../components/examBar'
  import {getTeacherErrorExamList, getTeacherErrorExamDetail, getExamSectionTypeRelation} from '@/api/index'
  import { mapMutations, mapGetters, mapState } from 'vuex'
  export default {
    components: {courseFilter, examBar},
    name: "index",
    data() {
      return {
        filterShow: false,
        sysCourseId: '',
        errorPercent: [
          {value: 0,active:true},
          {value: 0.1},
          {value: 0.2},
          {value: 0.3},
          {value: 0.4},
          {value: 0.5},
          {value: 0.6},
          {value: 0.7},
          {value: 0.8},
          {value: 0.9},
        ],
        courseList: [],
        filterName: '',
        filterParams: {
          classGrade:'',
          termType:'',
          classId:''
        },
        selectList: this.$store.getters.getErrorBookSelected,
        selectCourseList: [],
        questionTypeList: []
      }
    },
    watch: {
      selectList: {
        handler() {
          this.$store.commit('setErrorBookSelected',this.selectList)
        },
        deep: true
      },
      selectCourseList: {
        handler() {
          this.$store.commit('setErrorBookCourse',this.selectCourseList)
        },
        deep: true
      },
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
      errorValue() {
        return this.errorPercent.find(v => v.active).value
      },
    },
    beforeRouteLeave(to, from ,next) {
      if(to.path === '/index') {
        //去首页 需要清空储存的值
        this.$store.commit('setErrorBookCourse',[])
        this.$store.commit('setErrorBookSelected',[])
        this.$store.commit('setErrorFilterParams',{})
      }
      next()
    },
    mounted() {
      this.$refs['courseFilter'].handleSubmit()
    },
    created() {
      this.$store.commit('setErrorBookQuestionCourse',[])
      this.getExamSectionTypeRelation()
    },
    activated() {
      //试题详情返回的时候要对选中的试题重新赋值
      this.selectList = this.$store.getters.getErrorBookSelected
      //课程添加按钮状态更新
      this.selectCourseList = this.$store.getters.getErrorBookCourse
      this.courseList.forEach(v => {
        this.$set(v,'active',this.selectCourseList.some(id => id === v.sysCourseId))
      })
    },
    methods: {
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
      getTeacherErrorExamDetail(courseId,type) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: localStorage.currentSubjectType,
          errorPersent:this.errorValue,
          ...this.filterParams,
          sysCourseIdList: [courseId],
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTeacherErrorExamDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            if(type) {
              //添加
              res.data[0].examQuestionInfo.forEach(item => {
                //点击添加时判断已选入的试题是否有包含该课程里的试题
                if(this.selectList.some(s => s.child.some(c => c.examId === item.examId))) return

                const index = this.selectList.findIndex(v => v.examType === item.titleType)
                if (index > -1) {
                  // 添加的试题已存在相同题型
                  this.selectList[index].child.push(item)
                } else {
                  //添加的试题不存在相同题型
                  const sectionIndex = this.questionTypeList.findIndex(v => v.examType === item.titleType)
                  console.log(sectionIndex);
                  const typeItem = this.questionTypeList[sectionIndex]
                  this.selectList.push({
                    sectionName: typeItem.sectionName,
                    examType: typeItem.examType,
                    sectionType: typeItem.sectionType,
                    sectionIndex: sectionIndex,
                    child: [item]
                  })
                }
              })
            }else {
              // 移除
              res.data[0].examQuestionInfo.forEach(item => {
                const index = this.selectList.findIndex(v => v.examType === item.titleType)
                if (this.selectList[index].child.length === 1) {
                  //整个this.selectList[index]删除
                  this.selectList.splice(index, 1)
                } else {
                  // 只删除this.selectList[index].child[childIndex]
                  const childIndex = this.selectList[index].child.findIndex(v => v.examId === item.examId)
                  this.selectList[index].child.splice(childIndex, 1)
                }
              })
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      clear() {
        //清空所有试题时需要移除课程试题的添加状态样式
        this.courseList.forEach(v => {
          this.$set(v,'active',false)
        })
        this.selectCourseList = []
      },
      viewDetail(item) {
        this.$router.push({path:`/errorQuestionDetail`,query:{
            errorPersent: this.errorValue,
            ...this.filterParams,
            courseId: item.sysCourseId,
            courseName: item.sysCourseName
          }})
      },
      selectError(item) {
        if(item.active) return
        this.errorPercent.forEach(v => {
          this.$set(v,'active',false)
        })
        this.$set(item,'active',true)
        this.getList()
      },
      selectCourse(item) {

        this.$set(item,'active',!item.active)
        if(item.active) {
          this.selectCourseList.push(item.sysCourseId)
          //添加课程ID,用于生成试卷后跳转资源中心试题列表
          this.$store.commit('setErrorBookQuestionCourse',item.sysCourseId)
        }else {
          this.selectCourseList.splice(this.selectCourseList.indexOf(item.sysCourseId),1)
        }
        this.getTeacherErrorExamDetail(item.sysCourseId,item.active)
      },
      confirmCb(classGrade='',termType='',classId='',gradeName='',termName='',className='') {
        this.filterName = localStorage.currentSubjectTypeName + gradeName + className + termName
        this.filterParams.classGrade = classGrade
        this.filterParams.termType = termType
        this.filterParams.classId = classId
        this.$store.commit('setErrorFilterParams',this.filterParams)
        this.getList()
      },
      getList() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: localStorage.currentSubjectType,
          errorPersent: this.errorValue,
            ...this.filterParams,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTeacherErrorExamList(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            this.courseList = res.data || []
            // 加载列表时需要对已添加的课程修改状态
            this.selectCourseList.forEach(id => {
              const index = this.courseList.findIndex(v => v.sysCourseId === id)
              if(index > -1) {
                this.$set(this.courseList[index],'active',true)
              }
            })
          }else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .error-book {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__tab {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0 10px;
      background: #fff;
      overflow-x: auto;
      height: 33px;

      div {
        text-align: center;
        line-height: 19px;
        font-size: 13px;
        color: #333;
        flex: 0 0 33px;
        background: #fff;
        margin-left: 5px;

        &.active {
          background: #E0FFFC;
          color: @blue;
          border-radius: 2px;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      background: #fff;

      &-title {
        line-height: 50px;
        padding: 0 10px;
        font-size: 16px;
        font-weight: bold;
      }

      &-list {
        .list-item {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &__btn {
            margin-left: 10px;
            flex: 0 0 55px;
            line-height: 25px;
            border-radius: 5px;
            font-size: 14px;
            border: 1px solid @blue;
            color: @blue;
            text-align: center;
            &.active {
              color: #fff;
              background: @blue;
            }
          }
        }
      }
    }
  ;
  }
</style>
