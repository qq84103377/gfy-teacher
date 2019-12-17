<template>
  <section class="in-class-wrap">
    <dropdown-header v-show="courseList.length || firstFlag" :list="courseList" :course-name="courseName"
                     :tch-course-id="tchCourseId"
                     :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading"
                     :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh"
                     @selectCourse="selectCourse">
      <div slot="left" class="fs14" @click="changeCourse(0)">上一课</div>
      <div slot="right" class="fs14" @click="changeCourse(1)">下一课</div>
    </dropdown-header>
    <div class="in-class-wrap__body">
      <div v-if="!courseList.length && !firstFlag" class="empty-page">
        <img src="../../assets/img/preview/task_null.png" alt/>
        <div class="grey9 fs12">当前没有课程,快去新建课程吧！</div>
      </div>
      <div v-if="courseList.length || firstFlag">
        <van-cell class="fs16"
                  :title="`讲义(${resourceCount.find(v => v.resourceType === 'R12_C01')?resourceCount.find(v => v.resourceType === 'R12_C01').resourceCount:0})`"
                  is-link @click="goto('/lectureList')"/>
        <van-cell class="fs16"
                  :title="`白板(${resourceCount.find(v => v.resourceType === 'R12_C02')?resourceCount.find(v => v.resourceType === 'R12_C02').resourceCount:0})`"
                  is-link @click="goto('/boardClassList')"/>
        <van-cell class="fs16"
                  :title="`堂测统计(${resourceCount.find(v => v.resourceType === 'R12_C03')?resourceCount.find(v => v.resourceType === 'R12_C03').resourceCount:0})`"
                  is-link @click="goto('/classStatList')"/>
      </div>
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
        dropdownTotal: 0,
        courseList: [],
        courseName: '',
        tchCourseId: '',
        sysCourseId: '',
        relationCourseId: '',
        subjectType: '',
        classId: '',
        tchClassCourseInfo: [],
        index: 0, //选中的课程index
        classGrade: '',
        termType: '',
        firstFlag: true,
        resourceCount: [
          {resourceType: 'R12_C01', resourceCount: 0},
          {resourceType: 'R12_C02', resourceCount: 0},
          {resourceType: 'R12_C03', resourceCount: 0},
        ],
      }
    },
    created() {
      this.$store.commit('setVanLoading', true)
      this.dropdownOnLoad()

    },
    activated() {
      if (this.tchCourseId) {
        this.getCount(this.tchCourseId)
      }
    },
    methods: {
      getCount(tchCourseIdSelect) {
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
          tchCourseIdSelect
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
           this.resourceCount = res.data[0].resourceCount
            this.courseList[this.index].resourceCount = this.resourceCount
          }
        })
      },
      goto(path) {
        if(path === '/classStatList') {
          localStorage.setItem('taskTchCourseInfo', JSON.stringify(this.courseList[this.index].tchCourseInfo))
        }
        const {tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, termType, courseName} = this
        this.$router.push({path,
          query: {
            tchCourseId,
            sysCourseId,
            relationCourseId,
            subjectType,
            classId,
            tchClassCourseInfo,
            classGrade,
            termType,
            courseName
          }
        })
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
              this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
              this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
              this.resourceCount = this.courseList[this.index].resourceCount
            } else {
              //最后一页
              this.$toast('没有下一课了')
            }
          } else {
            this.index++
            this.courseName = this.courseList[this.index].tchCourseInfo.courseName
            this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
            this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
            this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
            this.resourceCount = this.courseList[this.index].resourceCount
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
            this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
            this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
            this.resourceCount = this.courseList[this.index].resourceCount
          }
        }
      },
      selectCourse(tchCourseInfo, index, resourceCount) {
        this.index = index
        this.resourceCount = resourceCount
        this.courseName = tchCourseInfo.courseName
        this.tchCourseId = tchCourseInfo.tchCourseId
        this.sysCourseId = tchCourseInfo.sysCourseId
        this.relationCourseId = tchCourseInfo.relationCourseId
        this.subjectType = tchCourseInfo.subjectType
        this.classGrade = tchCourseInfo.classGrade
        this.termType = tchCourseInfo.termType
        this.classId = tchCourseInfo.tchClassCourseInfo[0].classId
        this.tchClassCourseInfo = tchCourseInfo.tchClassCourseInfo
      },
      async dropdownOnLoad() {
        this.dropdownPage++
        if (this.dropdownPage > this.dropdownTotal && this.dropdownPage > 1) {
          return
        }
        await this.getClassTeachCourseInfo()
      },
      async dropdownRefresh() {
        this.dropdownListLoading = false
        this.dropdownFinish = false
        this.dropdownPage = 1
        await this.getClassTeachCourseInfo()
        this.$toast('刷新成功')
      },
      async getClassTeachCourseInfo(tchCourseIdSelect) {
        const page = this.dropdownPage

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
          "currentPage": page,
          tchCourseIdSelect
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeachCourseInfo(params).then(res => {
          console.log(res, '课程类表');
          this.$store.commit('setVanLoading', false)
          this.dropdownListLoading = false
          this.dropdownRefLoading = false
          this.dropdownTotal = res.total
          if (res.flag && res.data && res.data[0]) {
            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data)
            if (!this.courseName) {
              //首次取第一条课程的信息
              this.resourceCount = this.courseList[0].resourceCount
              this.courseName = this.courseList[0].tchCourseInfo.courseName
              this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
              this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
              this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId
              this.subjectType = this.courseList[0].tchCourseInfo.subjectType
              this.classGrade = this.courseList[0].tchCourseInfo.classGrade
              this.termType = this.courseList[0].tchCourseInfo.termType
              this.classId = this.courseList[0].tchCourseInfo.tchClassCourseInfo[0].classId
              this.tchClassCourseInfo = this.courseList[0].tchCourseInfo.tchClassCourseInfo
            }
            if (page >= res.total) {
              this.dropdownFinish = true
            }
          } else {
            this.courseList = page === 1 ? [] : this.courseList.concat([])
            this.dropdownFinish = true
          }
          this.firstFlag = false
        }).catch(err => {
          this.firstFlag = false
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

      .null-tips {
        margin-top: 50px;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 100%;
      }
    }
  }
</style>
