<template>
    <section class="course-detail">
      <van-nav-bar
        :title="currCourse.tchCourseInfo.courseName"
        @click-left="goBack"
        left-arrow>
      </van-nav-bar> 
      <div class="course-detail__body">
        <van-cell class="fs16" @click="gotoPreview" :title="`预习(${currCourse.resourceCount.find(v => v.resourceType === 'R11').resourceCount})`" is-link/>
        <van-collapse v-model="activeNames">
          <van-collapse-item  v-if='!isfEducation' :title="`课中(${currCourse.resourceCount.find(v => v.resourceType === 'R12').resourceCount})`" name="1">
            <van-cell :title="`讲义(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C01')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C01').resourceCount:0})`" @click="goInClass('/lectureList')" is-link/>
            <van-cell :title="`白板(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C02')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C02').resourceCount:0})`" @click="goInClass('/boardClassList')" is-link/>
            <van-cell :title="`堂测统计(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C03')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C03').resourceCount:0})`" @click="goInClass('/classStatSelectList')" is-link/>
          </van-collapse-item>
          <van-collapse-item :title="`资源(${currCourse.resourceCount.find(v => v.resourceType === 'R00').resourceCount})`" name="2">
            <van-cell :title="`微课(${currCourse.resourceCount.find(v => v.resourceType === 'R01_1')?currCourse.resourceCount.find(v => v.resourceType === 'R01_1').resourceCount:0})`" @click="gotoResource('/lessonList')" is-link/>
            <van-cell :title="`素材(${currCourse.resourceCount.find(v => v.resourceType === 'R01_2')?currCourse.resourceCount.find(v => v.resourceType === 'R01_2').resourceCount:0})`" @click="gotoResource('/materialList')" is-link/>
            <van-cell :title="`试卷(${currCourse.resourceCount.find(v => v.resourceType === 'R02').resourceCount})`" @click="gotoResource('/examList')" is-link/>
            <van-cell :title="`试题(${currCourse.resourceCount.find(v => v.resourceType === 'R03').resourceCount})`" @click="gotoResource('/questionList')" is-link/>
            <van-cell :title="`讨论(${currCourse.resourceCount.find(v => v.resourceType === 'R04').resourceCount})`" @click="gotoResource('/discussList')" is-link/>
            <van-cell v-if="currentSubjectType === 'S03' &&!isfEducation" :title="`口语(${currCourse.resourceCount.find(v => v.resourceType === 'R08').resourceCount})`" @click="gotoResource('/spokenList')" is-link/>
          </van-collapse-item>
        </van-collapse>
        <van-cell v-if='!isfEducation' class="fs16" @click="viewLayer"
                  :title="`分层(${currCourse.resourceCount.find(v => v.resourceType === 'R13').resourceCount})`" is-link/>
      </div>
    </section>
</template>

<script>
  import {getClassTeachCourseInfo,getCourseInfoResourceCount} from '@/api/index'
    export default {
        name: "courseDetail",
      data() {
          return {
            activeNames:[],
            currCourse: {resourceCount:[
              {resourceType: 'R00', resourceCount: 0},
                {resourceType: 'R02', resourceCount: 0},
                {resourceType: 'R03', resourceCount: 0},
                {resourceType: 'R04', resourceCount: 0},
                {resourceType: 'R08', resourceCount: 0},
                {resourceType: 'R11', resourceCount: 0},
                {resourceType: 'R12', resourceCount: 0},
                {resourceType: 'R13', resourceCount: 0},
              ],tchCourseInfo:{}},
              isfEducation: this.$route.query.isfEducation
          }
      },
      computed: {
        currentSubjectType() {
          return localStorage.currentSubjectType
        }
      },
      methods: {
          viewLayer() {
            this.$store.commit("setTchCourseInfo", this.currCourse.tchCourseInfo)
            this.$router.push(`/layerTaskList?tchCourseId=${this.$route.query.tchCourseId}&courseName=${this.currCourse.tchCourseInfo.courseName}&classGrade=${this.currCourse.tchCourseInfo.classGrade}&sysCourseId=${this.currCourse.tchCourseInfo.sysCourseId}&relationCourseId=${this.currCourse.tchCourseInfo.relationCourseId}`)
          },
         goBack(){
          this.common.goBack(this)
        },
          gotoPreview() {
            this.$router.push({path:'/preview',query:{
                from:'course',
                ...this.$route.query,
                courseName:this.currCourse.tchCourseInfo.courseName,
                classGrade:this.currCourse.tchCourseInfo.classGrade,
                sysCourseId:this.currCourse.tchCourseInfo.sysCourseId,
                relationCourseId:this.currCourse.tchCourseInfo.relationCourseId,
                termType:this.currCourse.tchCourseInfo.termType,
                currCourse: this.currCourse
              }})
          },
        goInClass(path) {
          const {tchCourseId,sysCourseId,relationCourseId,subjectType,tchClassCourseInfo,classGrade,termType} = this.currCourse.tchCourseInfo
          this.$router.push({path,query: {tchCourseId,sysCourseId,relationCourseId,subjectType,classId:tchClassCourseInfo[0].classId,tchClassCourseInfo,classGrade,termType}})
        },
        gotoResource(path) {
          this.$store.commit("setTchCourseInfo", this.currCourse.tchCourseInfo)
          const {tchCourseId,sysCourseId,relationCourseId,subjectType,tchClassCourseInfo,classGrade,courseName} = this.currCourse.tchCourseInfo
          this.$router.push({path,query: {tchCourseId,sysCourseId,relationCourseId,subjectType,classId:tchClassCourseInfo[0].classId,tchClassCourseInfo,classGrade,courseName}})

        },
        getCourseInfoResourceCount() {
          this.$store.commit('setVanLoading', true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "roleType": "A03",
           tchCourseInfoList: [{tchCourseId: this.currCourse.tchCourseInfo.tchCourseId,sysCourseId: this.currCourse.tchCourseInfo.sysCourseId}]
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          getCourseInfoResourceCount(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if(res.flag) {
                res.data[0].countViewList.forEach(v => {
                  if(v.resourceType === 'R01_1'||v.resourceType === 'R01_2') {
                    this.currCourse.resourceCount.push(v)
                  }
                })
            }
          })
        },
        async getDetail() {
          this.$store.commit('setVanLoading', true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            // "belongSchoolId": this.$store.getters.schoolId,
            "operateRoleType": "A02",
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "subjectType": localStorage.getItem("currentSubjectType"),
            "classGrade": "",
            "termType": "",
            "pageSize": "20",
            "courseType": "C01",
            "classId": "",
            "currentPage": 1,
            tchCourseIdSelect: this.$route.query.tchCourseId
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          await getClassTeachCourseInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if(res.flag) {
              this.currCourse = res.data[0]
            }
          })
        },
      },
      async activated() {
          await this.getDetail()
        this.getCourseInfoResourceCount()
      },
    }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .course-detail {
    display: flex;
    flex-direction: column;
    &__body {
      flex: 1;
      overflow-y: auto;
      @{deep} .van-collapse-item__content {
        padding: 0;
        padding-left: 5px;
      }
      @{deep} .van-collapse-item__title {
        font-size: 16px;
      }
    }
  }
</style>
