<template>
  <section class="in-class-wrap">
    <dropdown-header :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId"
                     :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading"
                     :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh"
                     @selectCourse="selectCourse">
      <div slot="left" class="fs14" @click="changeCourse(0)">上一课</div>
      <div slot="right" class="fs14" @click="changeCourse(1)">下一课</div>
    </dropdown-header>
    <div class="in-class-wrap__body">
      <van-cell class="fs16" title="讲义" is-link @click="goto('/lectureList')"/>
      <van-cell class="fs16" title="白板" is-link @click="goto('/boardList')"/>
      <van-cell class="fs16" title="堂测统计" is-link @click="goto('/classStatList')"/>
    </div>
  </section>
</template>

<script>
  import dropdownHeader from '../../components/dropdown-header'
  import {getClassTeachCourseInfo} from '@/api/index'

  export default {
    name: "index",
    components: {dropdownHeader},
    data() {
      return {
        dropdownPage: 0,
        dropdownListLoading: false,
        dropdownFinish: false,
        dropdownRefLoading: false,
        courseList: [],
        courseName: '',
        tchCourseId: '',
        sysCourseId: '',
        relationCourseId: '',
        subjectType: '',
        classId: '',
        tchClassCourseInfo: [],
        index: 0, //选中的课程index
      }
    },
    created() {
      this.$store.commit('setVanLoading',true)
      this.dropdownOnLoad()

    },
    methods: {
      goto(path) {
        const {tchCourseId,sysCourseId,relationCourseId,subjectType,classId,tchClassCourseInfo} = this
        this.$router.push({path,query: {tchCourseId,sysCourseId,relationCourseId,subjectType,classId,tchClassCourseInfo}})
      },
      async changeCourse(type) {
        if (type) {
          //下一题
          if (this.index >= this.courseList.length - 1) {
            // 当前课程已是列表的最后一个
            if (!this.dropdownFinish) {
              //还能加载下一页
              await this.dropdownOnLoad()
              this.index++
              this.courseName = this.courseList[this.index].tchCourseInfo.courseName
              this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
            } else {
              //最后一页
              this.$toast('没有下一课了')
            }
          } else {
            this.index++
            this.courseName = this.courseList[this.index].tchCourseInfo.courseName
            this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
          }

        } else {
          //上一题
          if (this.index <= 0) {
            // 当前课程已是列表的第一个
            this.$toast('没有上一课了')
          } else {
            this.index--
            this.courseName = this.courseList[this.index].tchCourseInfo.courseName
            this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
          }
        }
      },
      selectCourse(tchCourseInfo, index) {
        this.index = index
        this.courseName = tchCourseInfo.courseName
        this.tchCourseId = tchCourseInfo.tchCourseId
        this.sysCourseId = tchCourseInfo.sysCourseId
        this.relationCourseId = tchCourseInfo.relationCourseId
        this.subjectType = tchCourseInfo.subjectType
        this.classId = tchCourseInfo.tchClassCourseInfo[0].classId
        this.tchClassCourseInfo = tchCourseInfo.tchClassCourseInfo
      },
      async dropdownOnLoad() {
        this.dropdownPage++

        await this.getClassTeachCourseInfo()
      },
      async dropdownRefresh() {
        this.dropdownListLoading = false
        this.dropdownFinish = false
        this.dropdownPage = 1
        await this.getClassTeachCourseInfo()
        this.$toast('刷新成功')
      },
      async getClassTeachCourseInfo() {

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
          "currentPage": this.dropdownPage
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading',false)
          this.dropdownListLoading = false
          this.dropdownRefLoading = false
          this.total = res.total
          if (res.flag) {
            this.courseList = this.dropdownPage === 1 ? res.data : this.courseList.concat(res.data)
            if (!this.courseName) {
              //首次取第一条课程的信息
              this.courseName = this.courseList[0].tchCourseInfo.courseName
              this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
              this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
              this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId
              this.subjectType = this.courseList[0].tchCourseInfo.subjectType
              this.classId = this.courseList[0].tchCourseInfo.tchClassCourseInfo[0].classId
              this.tchClassCourseInfo = this.courseList[0].tchCourseInfo.tchClassCourseInfo
            }
            if (this.dropdownPage >= res.total) {
              this.dropdownFinish = true
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  .in-class-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    &__body {
      margin-top: 10px;
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
