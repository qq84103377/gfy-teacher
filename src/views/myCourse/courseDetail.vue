<template>
  <section class="course-detail">
    <van-nav-bar :title="currCourse.tchCourseInfo.courseName" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="course-detail__body">
      <van-cell class="fs16" @click="gotoPreview" :title="`预习(${handleCount('R11')})`" is-link />
      <van-collapse v-model="activeNames">
        <van-collapse-item v-if='!isfEducation' :title="`课中(${handleCount('R12')})`" name="1">
          <van-cell :title="`讲义(${handleCount('R12_C01')})`" @click="goInClass('/lectureList')" is-link />
          <van-cell :title="`白板(${handleCount('R12_C02')})`" @click="goInClass('/boardClassList')" is-link />
          <van-cell :title="`堂测统计(${handleCount('R12_C03')})`" @click="goInClass('/classStatSelectList')" is-link />
        </van-collapse-item>
        <van-collapse-item :title="`资源(${handleCount('R00')})`" name="2">
          <van-cell :title="`微课(${handleCount('R01_1')})`" @click="gotoResource('/lessonList')" is-link />
          <van-cell :title="`素材(${handleCount('R01_2')})`" @click="gotoResource('/materialList')" is-link />
          <van-cell :title="`试卷(${handleCount('R02')})`" @click="gotoResource('/examList')" is-link />
          <van-cell :title="`试题(${handleCount('R03')})`" @click="gotoResource('/questionList')" is-link />
          <van-cell :title="`讨论(${handleCount('R4')})`" @click="gotoResource('/discussList')" is-link />
          <van-cell v-if="currentSubjectType === 'S03' &&!isfEducation" :title="`口语(${handleCount('R08')})`" @click="gotoResource('/spokenList')" is-link />
        </van-collapse-item>
      </van-collapse>
      <van-cell v-if='!isfEducation' class="fs16" @click="viewLayer" :title="`分层(${handleCount('R13')})`" is-link />
    </div>
  </section>
</template>

<script>
import { getClassTeachCourseInfo, getCourseInfoResourceCount } from '@/api/index'
export default {
  name: "courseDetail",
  data() {
    return {
      activeNames: [],
      currCourse: {        resourceCount: [
          { resourceType: 'R00', resourceCount: 0 },
          { resourceType: 'R02', resourceCount: 0 },
          { resourceType: 'R03', resourceCount: 0 },
          { resourceType: 'R04', resourceCount: 0 },
          { resourceType: 'R08', resourceCount: 0 },
          { resourceType: 'R11', resourceCount: 0 },
          { resourceType: 'R12', resourceCount: 0 },
          { resourceType: 'R13', resourceCount: 0 },
        ], tchCourseInfo: {}      },
      isfEducation: this.$route.query.isfEducation
    }
  },
  computed: {
    currentSubjectType() {
      return localStorage.currentSubjectType
    }
  },
  methods: {
    handleCount(resourceType) {
      return this.currCourse.resourceCount.find(v => v.resourceType === resourceType)?this.currCourse.resourceCount.find(v => v.resourceType === resourceType).resourceCount:0
    },
    viewLayer() {
      this.$store.commit("setTchCourseInfo", this.currCourse.tchCourseInfo)
      this.$router.push(`/layerTaskList?tchCourseId=${this.$route.query.tchCourseId}&courseName=${this.currCourse.tchCourseInfo.courseName}&classGrade=${this.currCourse.tchCourseInfo.classGrade}&sysCourseId=${this.currCourse.tchCourseInfo.sysCourseId}&relationCourseId=${this.currCourse.tchCourseInfo.relationCourseId}`)
    },
    goBack() {
      this.common.goBack(this)
    },
    gotoPreview() {
      this.$router.push({        path: '/preview', query: {
          from: 'course',
          ...this.$route.query,
          courseName: this.currCourse.tchCourseInfo.courseName,
          classGrade: this.currCourse.tchCourseInfo.classGrade,
          sysCourseId: this.currCourse.tchCourseInfo.sysCourseId,
          relationCourseId: this.currCourse.tchCourseInfo.relationCourseId,
          termType: this.currCourse.tchCourseInfo.termType,
          currCourse: this.currCourse,
          isfEducation:this.isfEducation
        }      })
    },
    goInClass(path) {
      const { tchCourseId, sysCourseId, relationCourseId, subjectType, tchClassCourseInfo, classGrade, termType } = this.currCourse.tchCourseInfo
      this.$router.push({ path, query: { tchCourseId, sysCourseId, relationCourseId, subjectType, classId: tchClassCourseInfo[0].classId, tchClassCourseInfo, classGrade, termType } })
    },
    gotoResource(path) {
      this.$store.commit("setTchCourseInfo", this.currCourse.tchCourseInfo)
      const { tchCourseId, sysCourseId, relationCourseId, subjectType, tchClassCourseInfo, classGrade, courseName } = this.currCourse.tchCourseInfo
      this.$router.push({ path, query: { tchCourseId, sysCourseId, relationCourseId, subjectType, classId: tchClassCourseInfo[0].classId, tchClassCourseInfo, classGrade, courseName, isfEducation: this.isfEducation } })

    },
    getCourseInfoResourceCount() {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "roleType": "A03",
        tchCourseInfoList: [{ tchCourseId: this.currCourse.tchCourseInfo.tchCourseId, sysCourseId: this.currCourse.tchCourseInfo.sysCourseId }]
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseInfoResourceCount(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          res.data[0].countViewList.forEach(v => {
            if (v.resourceType === 'R01_1' || v.resourceType === 'R01_2') {
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
      if (this.isfEducation) {
        obj.courseType = 'C02'
        obj.subjectType = ''
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getClassTeachCourseInfo(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
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
@deep: ~">>>";
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
