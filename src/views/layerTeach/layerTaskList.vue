<template>
  <section class="layer-task-list">
    <dropdown-header v-if="!$route.query.tchCourseId" v-show="courseList.length || firstFlag" :list="courseList" :course-name="courseName"
                     :tch-course-id="tchCourseId"
                     :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading"
                     :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh"
                     @selectCourse="selectCourse">
      <div slot="left" class="fs14" @click="changeCourse(0)">上一课</div>
      <div slot="right" class="fs14" @click="changeCourse(1)">下一课</div>
    </dropdown-header>
    <div class="layer-task-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && !taskList.length" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/task_null.png" alt/>
        </div>
        <van-list v-model="listLoading" :finished="finished"
                  :finished-text="(courseList.length||$route.query.tchCourseId)?(taskList.length>0?'没有更多了':'当前没有分层任务'):'当前没有课程,快去新建课程吧！'"
                  @load="onLoad" :offset='80'>
          <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in taskList"
                     @clickTo="goto(item)" :key="index" :test-paper-id="item.testPaperId" :taskType="item.taskType"
                     :itemTitle="item.taskName" :class-info-list="item.tchClassTastInfo">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="viewStat(item)">
                <i class="iconGFY icon-statistics"></i>
                <span>{{item.finishCount}}/{{item.allCount}}</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
    </div>
  </section>
</template>

<script>
  import dropdownHeader from '../../components/dropdown-header'
  import {getClassTeachCourseInfo, getCourseTaskList} from '@/api/index'
  import listItem from '../../components/list-item'

  export default {
    components: {dropdownHeader, listItem},
    data() {
      return {
        dropdownPage: 1,
        dropdownListLoading: false,
        dropdownFinish: false,
        dropdownRefLoading: false,
        dropdownTotal: 0,
        courseList: [],
        firstFlag: true,
        index: 0, //选中的课程index
        taskList: [],
        tchCourseId: this.$route.query.tchCourseId || '',
        courseName: this.$route.query.courseName || '',
        refLoading: false,
        listLoading: false,
        finished: false,
        pageSize: 10,
        currentPage: 0,
        total: 0,
        sysCourseId: this.$route.query.sysCourseId || '',
        relationCourseId: this.$route.query.relationCourseId || '',
        classGrade: this.$route.query.classGrade || '',
        scrollTop: 0,
      }
    },
    beforeRouteLeave(to, from, next) {
      this.scrollTop = this.$refs["body"].scrollTop;
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          vm.$refs["body"].scrollTop = vm.scrollTop
        });
      });
    },
    methods: {
      viewStat(item) {
        this.$store.commit('setVanLoading', true)
        this.$router.push({
          path: '/layerTeach',
          query: {
            tchClassTastInfo: item.tchClassTastInfo,
            taskName:item.taskName,
            taskId: item.taskId,
            tchCourseId: item.tchCourseId
          }
        })
      },
      goto(item) {
        if (item.testPaperId > 0) {
          this.$router.push({
            path: `/examDetail`, query: {
              "tchCourseId": this.tchCourseId,
              "sysCourseId": this.sysCourseId,
              "relationCourseId": this.relationCourseId,
              type: 1,
              testPaperId: item.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.classGrade,
              title: item.testPaperName, //需要接口返回这个字段
            }
          })
        } else if (item.taskType === 'T03') {
          if (item.resourceType === 'R03') {
            //单道试题
            this.$router.push(`/questionDetail?tchCourseId=${this.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`)
          }
        } else if (['T13'].includes(item.taskType)) {
          //口语
          this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${this.sysCourseId}`)
        } else if (['T02', 'T04', 'T06'].includes(item.taskType)) {
          // 学资源 微课+心得 讨论  跳任务统计
          this.viewStat(item)
        }
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }

        // if (!this.courseList.length) {
        if (this.firstFlag && !this.$route.query.tchCourseId) {
          //首次加载
          await this.getClassTeachCourseInfo()
          if (this.courseList.length) {
            this.courseName = this.courseList[0].tchCourseInfo.courseName
            this.classGrade = this.courseList[0].tchCourseInfo.classGrade
            this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
            this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
            this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId
          }

        }
        this.getCourseTaskList()
      },
      async onRefresh() {

        // this.listLoading = false
        this.finished = false
        this.currentPage = 1
        await this.getCourseTaskList()
        this.$toast('刷新成功')
      },
      async getCourseTaskList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          tchCourseId: this.tchCourseId,
          "pageSize": this.pageSize,
          "currentPage": page,
          layerStatus: 'L02'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getCourseTaskList(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0]) {
            this.taskList = page === 1 ? res.data[0].tchCourseTaskInfo : this.taskList.concat(res.data[0].tchCourseTaskInfo)
            //设置班级名称
            if (localStorage.getItem("classMap")) {
              let classMap = JSON.parse(localStorage.getItem("classMap"))
              this.taskList.forEach(item => {
                let finishCount = 0
                let allCount = 0
                if (item.tchClassTastInfo) {
                  item.tchClassTastInfo.forEach((obj, i) => {
                    if (i == 0) {
                      //跳转到任务统计页面时自动将第一个班级设置为选中状态
                      obj.active = true
                    }
                    finishCount += obj.finshCount
                    allCount += obj.allCount
                    if (!classMap[obj.classId] || !classMap[obj.classId].className) {
                      obj['className'] = "--"
                    } else {
                      obj['className'] = classMap[obj.classId].className
                    }
                  })
                }
                item.finishCount = finishCount
                item.allCount = allCount
              })
            }
            if (page >= res.total) {
              this.finished = true
            } else {
              this.finished = false
            }
          } else {
            this.taskList = page === 1 ? [] : this.taskList.concat([])
            this.finished = true
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
              this.selectCourse(this.courseList[this.index].tchCourseInfo, this.index)
            } else {
              //最后一页
              this.$toast('没有下一课了')
            }
          } else {
            this.index++
            this.selectCourse(this.courseList[this.index].tchCourseInfo, this.index)
          }

        } else {
          //上一题
          if (this.index <= 0) {
            // 当前课程已是列表的第一个
            this.$toast('没有上一课了')
          } else {
            this.index--
            if (this.index > this.courseList.length - 1) {
              //如果跳转过来选中的课程的index超过首次加载第一页的数量,
            }
            this.selectCourse(this.courseList[this.index].tchCourseInfo, this.index)
          }
        }
      },
      async selectCourse(tchCourseInfo, index, resourceCount) {
        this.$store.commit('setVanLoading', true)
        this.index = index
        this.tchCourseId = tchCourseInfo.tchCourseId
        this.courseName = tchCourseInfo.courseName
        this.sysCourseId = tchCourseInfo.sysCourseId
        this.relationCourseId = tchCourseInfo.relationCourseId
        this.classGrade = tchCourseInfo.classGrade
        this.currentPage = 1
        await this.getCourseTaskList()
        this.$store.commit('setVanLoading', false)
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
      async getClassTeachCourseInfo() {
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
  .layer-task-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
    }
    .null-tips {
      margin-top: 50px;
      width: 100%;
    }
  }
</style>
