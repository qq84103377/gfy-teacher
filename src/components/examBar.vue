<template>
  <section class="exam-bar">
    <div class="exam-choice" @click="selectPop=!selectPop"><i class="iconGFY icon-file"></i><span
      class="badge">{{total}}</span></div>
    <div style="flex: 1">已选入<span class="fs10 red">{{total}}</span>道试题</div>
    <div class="select-btn"  @click="viewResCenter" v-if="(canSelect && $route.query.from !== 'examDetail') || isRevert">{{isRevert?'返回':'选择其他'}}</div>
    <div class="add-btn" @click="handleSubmit" :style="{background:(type=='task'&&!length)?'#ccc':'#39F0DD'}">{{type=='task'?'发任务': ($route.query.from === 'examDetail'?'完成添加':'生成试卷')}}</div>
    <van-overlay
      class-name="exam-bar-overlay"
      :show="selectPop"
      @click="selectPop = false"
    />
    <div class="exam-bar-pop" v-if="selectPop">
      <van-cell>
        <div slot="title" class="jcsb">
          <div>已选题目</div>
          <div @click="clearQuestion">清空练习</div>
        </div>
      </van-cell>
      <van-cell v-for="(item,index) in selectList" :key="index">
        <div slot="title" class="jcsb">
          <div>{{item.sectionName}}</div>
          <div>{{item.child.length}}道</div>
        </div>
      </van-cell>
    </div>


    <van-popup
      v-model="addExam"
      position="bottom">
      <div class="add-exam-wrap">
        <div class="add-exam-wrap__title">
          <div>生成试卷</div>
          <van-icon name="close" @click="addExam=false"></van-icon>
        </div>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>名称:</div>
            <input style="flex: 1" v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - form.name.length}}</span>
            <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear"/>
          </div>
        </van-cell>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>试卷难度:</div>
            <van-radio-group style="display: flex;" v-model="form.difficult">
              <van-radio name="D01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                易
              </van-radio>
              <van-radio name="D02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                中
              </van-radio>
              <van-radio name="D03" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                难
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>共享级别:</div>
            <van-radio-group style="display: flex;" v-model="form.share">
              <van-radio name="S01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅自己
              </van-radio>
              <van-radio name="S02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                校内
              </van-radio>
              <van-radio name="S03" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                公开
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell v-if="(canAddCourse && !isRevert)||(qesTypeName)" class="add-exam-wrap__cell">
          <div slot="title">
            <div style="display: flex;">
              <div class="fs15 mgr10"><span class="red">*</span>添加到课程: </div>
              <div class="fs15" style="flex: 1;word-break: break-all">{{courseName}}</div>
              <van-icon @click="showFilter" name="add" class="add"></van-icon>
            </div>
            <div class="red fs12 mgt10">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div>
          </div>
        </van-cell>
        <div class="add-exam-wrap__footer">
          <van-button :loading="form.btnLoading" loading-text="提交" type="info" class="btn" @click="addTestPaper">提交
          </van-button>
        </div>
      </div>
    </van-popup>

    <filter-panel :visible.sync="filterShow" title="添加" :list="tempList" @filter="handleFilter"></filter-panel>
  </section>
</template>

<script>
  import filterPanel from './filterPanel'
  import {generateTimeReqestNumber} from '@/utils/filter'
  import {Dialog} from 'vant';
  import {addTestPaper, addTeachCourseRes, addTestPaperExamInfo, getClassTeachCourseInfo} from '@/api/index'
  import eventBus from "@/utils/eventBus";
  import { mapMutations, mapGetters, mapState } from 'vuex'

  export default {
    props: ['type', 'selectList', 'canSelect', 'canAddCourse', 'length','qesTypeName'], //length是type为task时需要判断试卷内是否有试题,若无则不能发任务. qesTypeName题型专项进来的题型名字
    name: "examBar",
    components: {filterPanel},
    model: {
      prop: 'selectList',
      event: 'change'
    },
    computed: {
      ...mapState({
        isRevert: state => state.setting.isRevert
      }),
      total() {
        return this.selectList.reduce((t, v) => {
          t += v.child.length
          return t
        }, 0)
      },
      courseName() {
        return this.courseList.find(v => v.check).tchCourseInfo.courseName
      }
    },
    data() {
      return {
        selectPop: false,
        addExam: false,
        filterShow: false,
        form: {
          name: '',
          difficult: 'D02',
          // share: this.type === 'error' ? 'S01' : 'S02',
          share: 'S01', //全部共享级别默认都改为个人
          btnLoading: false
        },
        tempList: [],
        selectCourse: '',
        courseList: [{tchCourseInfo:{courseName:'无',sysCourseId:''},check:true}],
        // isRevert: false, //是否显示返回按钮
      }
    },
    watch: {
      addExam(v) {
        if (!v) {
          this.form = {
            name: '',
            difficult: 'D02',
            // share: this.type === 'error' ? 'S01' : 'S02',
            share: 'S01', //全部共享级别默认都改为个人
            btnLoading: false
          }
        }else {
          //每次点开生成试卷弹窗请求课程列表
          if(this.type === 'error') {
            this.form.name = `错题集试卷${generateTimeReqestNumber()}`
            if(this.canAddCourse) this.getClassTeachCourseInfo()
          }else if(this.$route.path === '/questionList') {
            if(this.$route.query.isRes) {
              if(this.canAddCourse) this.getClassTeachCourseInfo()
            }
            if(!this.$route.query.isPri) {
              let  testPaperIndex = 1
              const courseId = (this.canAddCourse && !this.isRevert) ? this.courseList.find(v => v.check).tchCourseInfo.tchCourseId : this.$route.query.tchCourseId
              if(localStorage.courseIdMap) {
                testPaperIndex = JSON.parse(localStorage.courseIdMap)[courseId]?JSON.parse(localStorage.courseIdMap)[courseId]+1:1
              }
              this.form.name = `《${this.$route.query.courseName}》标准测试卷${testPaperIndex}`
            }

            if(this.qesTypeName) {
              this.getClassTeachCourseInfo()
              this.form.name = `《${this.qesTypeName}》复习卷`
            }

          }else if (this.$route.path === '/examDetail') {
            this.form.name = `${this.$route.query.title}-副本`
            if(this.canAddCourse) this.getClassTeachCourseInfo()
          }
        }
      }
    },
    created() {

    },
    methods: {
      viewResCenter() {
        // if(this.isRevert) {
        //   this.$emit('viewRes',0)
        //   this.isRevert = false
        // }else {
        //   if(this.$route.path === '/examDetail') {
        //     this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=examDetail&isRes=1&areaCode=&courseId=${this.$route.query.sysCourseId}&courseName=${this.courseLabel}&classGrade=${this.$route.query.classGrade}&termType=`)
        //     this.$store.commit('setResQuestionSelect',this.selectList)
        //   }else if (this.$route.path === '/questionList') {
        //     this.$emit('viewRes',1)
        //     this.isRevert = true
        //   }
        // }
        if(this.isRevert) {
          this.$router.go(-2)
          this.$store.commit('setIsRevert',false)
          this.$store.commit('setResQuestionSelect',this.selectList)
        }else {
          if(this.$route.path === '/examDetail') {
            this.$router.push(`/resCentreWrap?from=examDetail`)
            this.$store.commit('setResQuestionSelect',this.selectList)
          }else if (this.$route.path === '/questionList') {
            this.$router.push(`/resCentreWrap?from=questionList&tchCourseId=${this.$route.query.tchCourseId}&sysCourseId=${this.$route.query.sysCourseId}&relationCourseId=${this.$route.query.relationCourseId}`)
            this.$store.commit('setResQuestionSelect',this.selectList)
          }
        }
      },
      async getClassTeachCourseInfo() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "subjectType": localStorage.getItem("currentSubjectType"),
          ...this.$store.getters.getErrorFilterParams,
          "pageSize": "999",
          "courseType": "C01",
          "currentPage": 1,
        }
        if(this.$route.query.isRes) {
          obj.termType = this.$route.query.termType
          obj.classGrade = this.$route.query.classGrade
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if(res.flag) {
            this.courseList = res.data || []
            this.courseList.push({tchCourseInfo:{courseName:'无',sysCourseId:''},check:true})
          }
        })
      },
      addTestPaper() {
        if (!this.form.name) {
          return this.$toast('请输入试卷名称')
        }
        // if(this.$route.path === '/errorBook' || this.$route.path === '/errorQuestionDetail') {
        if(!this.selectList.length) {
          return this.$toast('请添加试题')
        }
        // }
        this.form.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperInfo": {
            "testPaperId": "",
            "classGrade": this.$route.query.classGrade || this.$store.getters.getErrorFilterParams.classGrade,//归属年级
            "subjectType": localStorage.currentSubjectType,//学科
            "shareType": this.form.share,//共享级别
            "belongSchoolId": this.$store.getters.schoolId,//归属学校
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,//归属账号
            "testPaperName": this.form.name,//试卷名称
            "testPaperType": "T02",//试卷类型
            "provinceCode": "",//省份编号
            "areaCode": this.$store.getters.getUserInfo.areaCode,//地区编号
            "belongYear": new Date().getFullYear(),//归属年份
            "testPaperMode": "M01",//试卷模式
            "testPaperDegree": this.form.difficult,//试卷难度
            "score": 0,//试卷分数，默认0分
            "subjectiveItemNum": 0,//主观题数量
            "objectiveItemNum": 0,//客观题数量
            "duration": 10,//试卷时长
            "statusCd": "S01"//状态
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addTestPaper(params).then(res => {
          this.form.btnLoading = false
          console.log(this.canAddCourse);
          if (res.flag) {
            //先判断canAddCourse能否选择加入课
            if((this.canAddCourse && !this.isRevert)||this.qesTypeName){
              if(this.courseList.find(v => v.check).tchCourseInfo.sysCourseId) {
                // 有选择加入的课程
                this.addTeachCourseRes(res.testPaperInfo.testPaperId, res.testPaperInfo.testPaperName,res.testPaperInfo)
              }else {
                //没有选择加入的课程
                this.addTestPaperExamInfo(res.testPaperInfo.testPaperId, res.testPaperInfo.testPaperName,res.testPaperInfo)
              }
            }else {
              //不能选择课程,即有默认课程
              this.addTeachCourseRes(res.testPaperInfo.testPaperId, res.testPaperInfo.testPaperName,res.testPaperInfo)
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addTeachCourseRes(resourceId, name, paperInfo) {
        this.form.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "tchCourseId": ((this.canAddCourse && !this.isRevert)||this.qesTypeName) ? this.courseList.find(v => v.check).tchCourseInfo.tchCourseId : this.$route.query.tchCourseId,
          "sysCourseId": ((this.canAddCourse && !this.isRevert)||this.qesTypeName) ? this.courseList.find(v => v.check).tchCourseInfo.sysCourseId : this.$route.query.sysCourseId,
          "relationSeqId": ((this.canAddCourse && !this.isRevert)||this.qesTypeName) ? this.courseList.find(v => v.check).tchCourseInfo.relationCourseId : this.$route.query.relationCourseId,
          "resourceType": "R02",
          resourceId,
          "statusCd": "S04"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addTeachCourseRes(params).then(res => {
          this.form.btnLoading = false
          if (res.flag) {
            this.addTestPaperExamInfo(resourceId, name,paperInfo)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addTestPaperExamInfo(testPaperId, name, paperInfo) {
        this.form.btnLoading = true
        let testPaperExamInfoList = []
        let examIndex = -1

        if (this.$route.path === '/examDetail') {
          this.$parent.list.forEach(v => {
            v.sectionExamList.forEach(c => {
              examIndex++
              testPaperExamInfoList.push({
                "examId": c.examQuestion.examId,
                "sectionType": v.testPaperSectionInfo.sectionType,
                "subjectType": c.examQuestion.subjectType,
                "sectionName": v.testPaperSectionInfo.sectionName,
                "sectionIndex": v.testPaperSectionInfo.sectionIndex,
                examIndex,
                "examScore": c.sectionExamInfo.examScore,
                "groupId": c.examQuestion.groupId,
                "groupExamReList": c.examQuestion.groupExamList.map((g, gi) => {
                  return {
                    "examGroupId": g.examGroupId,
                    "groupId": g.groupId,
                    "autoScoring": g.autoScoring,
                    "groupIndex": gi + 1,
                    "examScore": g.examScore
                  }
                })
              })
            })
          })
        }else {
          this.selectList.forEach(v => {
            v.child.forEach(c => {
              examIndex++
              testPaperExamInfoList.push({
                "examId": c.examId,
                "sectionType": v.sectionType,
                "subjectType": c.subjectType,
                "sectionName": v.sectionName,
                "sectionIndex": v.sectionIndex,
                examIndex,
                "examScore": 5,
                "groupId": c.groupId,
                "groupExamReList": c.groupExamList.map((g, gi) => {
                  return {
                    "examGroupId": g.examGroupId,
                    "groupId": g.groupId,
                    "autoScoring": g.autoScoring,
                    "groupIndex": gi + 1,
                    "examScore": 5
                  }
                })
              })
            })

          })
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          testPaperId,
          testPaperExamInfoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addTestPaperExamInfo(params).then(res => {
          this.form.btnLoading = false
          if (res.flag) {
              eventBus.$emit('examListRefresh', true);
            this.addExam = false
            this.$store.commit('setResQuestionSelect', [])
            this.$store.commit('setResourceInfo', paperInfo)
            this.$store.commit("setTaskClassInfo", '')
            if(this.$route.path === '/errorBook' || this.$route.path === '/errorQuestionDetail') {
              let courseId = this.$store.getters.getErrorBookQuestionCourse.join('|')
              this.$router.push({
                path: `/examDetail`, query: {
                  flag: 1,
                  "sysCourseId": courseId,
                  type: 1,
                  testPaperId,
                  subjectType: localStorage.currentSubjectType,
                  classGrade: this.$store.getters.getErrorFilterParams.classGrade,
                  title: name,
                }
              })
            }else {
              if((this.canAddCourse && !this.isRevert)||this.qesTypeName) {
                if(this.$route.path === '/examDetail') {
                  this.$emit('addDone',name)
                }else {
                  this.setTestPaperNameIndex()
                  this.$emit('setQuestionSelect')
                  this.$router.push({
                    path: `/examDetail`, query: {
                      flag: 1,
                      "sysCourseId": this.$route.query.sysCourseId,
                      type: 1,
                      testPaperId,
                      subjectType: localStorage.currentSubjectType,
                      classGrade: this.$route.query.classGrade,
                      title: name,
                    }
                  })
                }
              }else {
                if(this.$route.path === '/examDetail') {
                  this.$emit('addDone',name)
                }else {
                  this.setTestPaperNameIndex()
                  this.$emit('setQuestionSelect')
                  this.$router.push({
                    path: `/examDetail`, query: {
                      "tchCourseId": this.$route.query.tchCourseId,
                      "sysCourseId": this.$route.query.sysCourseId,
                      "relationCourseId": this.$route.query.relationCourseId,
                      type: 1,
                      testPaperId,
                      subjectType: localStorage.currentSubjectType,
                      classGrade: this.$route.query.classGrade,
                      title: name,
                    },
                  })
                }
              }
            }
            /**
             * 某些场景下courseId为空,需要处理(待处理)
             */

          } else {
            this.$toast(res.msg)
          }
        })
      },
      setTestPaperNameIndex() {
        let courseIdMap
        const courseId = (this.canAddCourse && !this.isRevert) ? this.courseList.find(v => v.check).tchCourseInfo.tchCourseId : this.$route.query.tchCourseId
        if(localStorage.courseIdMap) {
          courseIdMap = JSON.parse(localStorage.courseIdMap)
          if(courseIdMap[courseId]) {
            courseIdMap[courseId]++
          }else {
            courseIdMap[courseId] = 1
          }
        }else {
          courseIdMap = {}
          courseIdMap[courseId] = 1
        }
        localStorage.setItem('courseIdMap',JSON.stringify(courseIdMap))
      },
      clearQuestion() {
        if (this.selectList.length) {
          Dialog.confirm({
            title: '确定清空已选试题吗?',
            // message: '弹窗内容'
          }).then(() => {
            this.$emit('change', [])
            this.$emit('clear')
          }).catch(() => {
            // on cancel
          });
        }
      },
      handleFilter(item) {
        if(this.type === 'task') {
          this.$store.commit('setTchCourseInfo',item.tchCourseInfo)
          this.$router.push(`/addTask?type=exam&_t=new&from=${this.$route.name}`)
        }else {
          if(item.tchCourseInfo.sysCourseId) {
            this.$store.commit('setTchCourseInfo',item.tchCourseInfo)
          }
          this.courseList = JSON.parse(JSON.stringify(this.tempList))
        }
      },
      showFilter() {
        this.filterShow = true
        // this.$set(this.list[0], 'active', true)
        this.tempList = JSON.parse(JSON.stringify(this.courseList))
      },
      async handleSubmit() {
        if (this.type === 'task') {
          if (this.length) {
            // this.$router.push(`/addTask?type=exam`)
            if(JSON.stringify(this.$store.getters.getTchCourseInfo) === '{}') {
              //没有课程信息的时候
              await this.getClassTeachCourseInfo()
              this.showFilter()
            }else {
              this.$router.push(`/addTask?type=exam&_t=new&from=${this.$route.name}`)
            }
          }
        } else if(this.$route.query.from === 'examDetail') {
          //从试卷详情点击选择其他,进入到资源中心试题列表
          this.$store.commit('setResQuestionSelect',this.selectList)
          this.$store.commit('setRemoveQuestionList',this.$parent.removeQuestionList)
          this.$router.go(-2)
        } else {
          this.addExam = true
          //examDetail
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .exam-bar {
    background: #fff;
    flex: 0 0 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    position: relative;

    .add-exam-wrap {
      &__title {
        position: relative;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;

        i {
          position: absolute;
          font-size: 22px;
          color: #999;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &__cell {
        .clear {
          margin-left: 10px;
          font-size: 15px;
          color: @blue;
        }

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }

        .iconGFY {
          vertical-align: middle !important;
        }

        .add {
          font-size: 22px;
          color: @blue;
          margin-left: 10px;
        }
      }

      &__footer {
        height: 50px;
        padding: 5px 10px;

        .btn {
          font-size: 18px;
          border-radius: 22px;
          width: 100%;
        }
      }
    }

    .exam-bar-overlay {
      top: -50px;
    }

    &-pop {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 50px;
      background: #fff;
      z-index: 2;
      border-radius: 10px 10px 0px 0px;
      max-height: 440px;
      overflow-y: auto;
    }

    .select-btn, .add-btn {
      flex: 0 0 85px;
      color: #fff;
      background: @blue;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }

    .select-btn {
      background: #4DFEEC;
    }

    .exam-choice {
      position: relative;
      margin: 0 10px;

      .badge {
        position: absolute;
        border-radius: 50%;
        background: red;
        color: #fff;
        font-size: 10px;
        width: 20px;
        height: 20px;
        top: -6px;
        right: -10px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
</style>
