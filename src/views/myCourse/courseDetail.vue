<template>
    <section class="course-detail">
      <van-nav-bar
        :title="$route.query.courseName"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="course-detail__body">
        <van-cell @click="gotoPreview" :title="`预习(${currCourse.resourceCount.find(v => v.resourceType === 'R11').resourceCount})`" is-link/>
        <van-collapse v-model="activeNames">
          <van-collapse-item :title="`课中(${currCourse.resourceCount.find(v => v.resourceType === 'R12').resourceCount})`" name="1">
            <van-cell title="讲义" @click="goInClass('/lectureList')" is-link/>
            <van-cell title="白板" @click="goInClass('/boardList')" is-link/>
            <van-cell title="堂测统计" @click="goInClass('/classStatList')" is-link/>
          </van-collapse-item>
          <van-collapse-item :title="`资源(${currCourse.resourceCount.find(v => v.resourceType === 'R00').resourceCount})`" name="2">
            <van-cell title="微课" @click="gotoResource('/lessonList')" is-link/>
            <van-cell title="素材" @click="gotoResource('/materialList')" is-link/>
            <van-cell title="试卷" @click="gotoResource('/examList')" is-link/>
            <van-cell title="试题" @click="gotoResource('/questionList')" is-link/>
            <van-cell :title="`讨论(${currCourse.resourceCount.find(v => v.resourceType === 'R04').resourceCount})`" @click="gotoResource('/discussList')" is-link/>
            <van-cell v-if="currentSubjectType === 'S03'" :title="`口语(${currCourse.resourceCount.find(v => v.resourceType === 'R08').resourceCount})`" @click="gotoResource('/spokenList')" is-link/>
          </van-collapse-item>
        </van-collapse>
      </div>
    </section>
</template>

<script>
    export default {
        name: "courseDetail",
      data() {
          return {
            activeNames:[],
            currCourse: JSON.parse(JSON.stringify(this.$route.query.currCourse))
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
      }
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
      }
    }
  }
</style>
