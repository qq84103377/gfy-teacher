<template>
    <section class="course-detail">
      <van-nav-bar
        :title="currCourse.tchCourseInfo.courseName"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="course-detail__body">
        <van-cell class="fs16" @click="gotoPreview" :title="`预习(${currCourse.resourceCount.find(v => v.resourceType === 'R11').resourceCount})`" is-link/>
        <van-collapse v-model="activeNames">
          <van-collapse-item :title="`课中(${currCourse.resourceCount.find(v => v.resourceType === 'R12').resourceCount})`" name="1">
            <van-cell :title="`讲义(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C01')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C01').resourceCount:0})`" @click="goInClass('/lectureList')" is-link/>
            <van-cell :title="`白板(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C02')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C02').resourceCount:0})`" @click="goInClass('/boardClassList')" is-link/>
            <van-cell :title="`堂测统计(${currCourse.resourceCount.find(v => v.resourceType === 'R12_C03')?currCourse.resourceCount.find(v => v.resourceType === 'R12_C03').resourceCount:0})`" @click="goInClass('/classStatSelectList')" is-link/>
          </van-collapse-item>
          <van-collapse-item :title="`资源(${currCourse.resourceCount.find(v => v.resourceType === 'R00').resourceCount})`" name="2">
            <van-cell :title="`微课(${currCourse.resourceCount.find(v => v.resourceType === 'R01').resourceCount})`" @click="gotoResource('/lessonList')" is-link/>
            <van-cell :title="`素材(${currCourse.resourceCount.find(v => v.resourceType === 'R04').resourceCount})`" @click="gotoResource('/materialList')" is-link/>
            <van-cell :title="`试卷(${currCourse.resourceCount.find(v => v.resourceType === 'R02').resourceCount})`" @click="gotoResource('/examList')" is-link/>
            <van-cell :title="`试题(${currCourse.resourceCount.find(v => v.resourceType === 'R03').resourceCount})`" @click="gotoResource('/questionList')" is-link/>
            <van-cell :title="`讨论(${currCourse.resourceCount.find(v => v.resourceType === 'R04').resourceCount})`" @click="gotoResource('/discussList')" is-link/>
            <van-cell v-if="currentSubjectType === 'S03'" :title="`口语(${currCourse.resourceCount.find(v => v.resourceType === 'R08').resourceCount})`" @click="gotoResource('/spokenList')" is-link/>
          </van-collapse-item>
        </van-collapse>
        <van-cell class="fs16" @click="" :title="`分层(${currCourse.resourceCount.find(v => v.resourceType === 'R13').resourceCount})`" is-link/>
      </div>
    </section>
</template>

<script>
  import {getClassTeachCourseInfo} from '@/api/index'
    export default {
        name: "courseDetail",
      data() {
          return {
            activeNames:[],
            currCourse: {resourceCount:[
              {resourceType: 'R00', resourceCount: 0},
                {resourceType: 'R01', resourceCount: 0},
                {resourceType: 'R02', resourceCount: 0},
                {resourceType: 'R03', resourceCount: 0},
                {resourceType: 'R04', resourceCount: 0},
                {resourceType: 'R08', resourceCount: 0},
                {resourceType: 'R11', resourceCount: 0},
                {resourceType: 'R12', resourceCount: 0},
                {resourceType: 'R13', resourceCount: 0},
              ],tchCourseInfo:{}}
          }
      },
      computed: {
        currentSubjectType() {
          return localStorage.currentSubjectType
        }
      },
      methods: {
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
        getDetail() {
          this.$store.commit('setVanLoading', true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
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
          getClassTeachCourseInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if(res.flag) {
              this.currCourse = res.data[0]
            }
          })
        },
      },
      activated() {
          this.getDetail()
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
