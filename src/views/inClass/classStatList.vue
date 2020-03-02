<template>
  <section class="class-stat-list">
    <div class="class-stat-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/class_stat_empty.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="list.length>0?'没有更多了':'当前没有内容～'" @load="onLoad" :offset='80'>
          <!--            this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${this.classGrade}&title=${item.testPaperName}`)-->
          <list-item ref='listItem' @clickTo="goto(item)" class="mgt10" style="background: #fff;"
                     @del="handleDelete(item,index)" @clickDel='clickDel(index)' v-for="(item,index) in list" :key="index"
                     :itemTitle="item.taskName"
                     :can-slide="true">
            <div slot="desc">
              <div v-if="item.sendRangeName" class="desc-bottom">{{item.sendRangeName}}</div>
              <div v-else class="desc-bottom">
                <div v-for="(c,ci) in item.tchClassTastInfo" :key="ci">
<!--                  {{handleClassName(c.classId)}}-->{{c.className}}
                  :{{c.startDate}} --
                  {{c.endDate}}
                </div>
              </div>
            </div>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="viewStat(item)">
                <i class="iconGFY icon-statistics"></i>
                <span>{{item.tchClassTastInfo[0].finshCount}}/{{item.tchClassTastInfo[0].allCount}}</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>


    </div>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {getClassTeachCourseInfo, getCourseTaskList, deleteCourseTask} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "classStatList",
    components: {listItem},
    data() {
      return {
        list: [],
        popShow: false,
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
        tchClassCourseInfo: JSON.parse(JSON.stringify(this.$route.query.tchClassCourseInfo)),
        scrollTop: 0,
        clickIndex:0
      }
    },
    mounted() {
      // this.getClassTeachCourseInfo()
      eventBus.$off("classStatListEditTask")
      eventBus.$on("classStatListEditTask", (data) => {
        console.log("classStatListEditTask eventbus");
        this.onRefresh()
      })
    },
    beforeRouteLeave(to, from, next) {
      if (this.$refs['listItem']&&this.$refs['listItem'][this.clickIndex]&&this.$refs['listItem'][this.clickIndex].showDialog) {
       this.$refs['listItem'][this.clickIndex].close()
       next(false)
      }else{
        this.scrollTop = this.$refs["body"].scrollTop;
       next();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          // vm.$refs["body"].scrollTo(0, vm.scrollTop);
          vm.$refs['body'].scrollTop = vm.scrollTop
        });
      });
    },
    methods: {
      clickDel(index){
        this.clickIndex=index
      },
      viewStat(item) {
        if(item.tchClassTastInfo.some(v => v.classId === 0)) {
          return this.$toast('任务班级已不在当前课程的班级中，无法查看任务统计！')
        }
        this.$store.commit('setVanLoading', true)
        this.$router.push({
          path: '/statistic',
          query: {
            info: item,
            testPaperId: item.testPaperId,
            termType: this.$route.query.termType,
            tchCourseId: item.tchCourseId,
            taskId: item.taskId,
            taskType: item.taskType,
            resourceType: item.resourceType,
            courseName: this.$route.query.courseName,    // 重发任务需要用到
            from: 'classStatList'
          }
        })
        localStorage.setItem('stat', JSON.stringify(item))
      },
      goto(item) {
        if (item.resourceType === 'R03') {
          //单道试题
          this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`)
        } else {
          //试卷
          this.$router.push({
            path: `/examDetail`, query: {
              "tchCourseId": this.$route.query.tchCourseId,
              "sysCourseId": this.$route.query.sysCourseId,
              "relationCourseId": this.$route.query.relationCourseId,
              type: 1,
              testPaperId: item.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.$route.query.classGrade,
              title: item.testPaperName,
              fromTask: 1
            }
          })
        }
      },
      handleDelete(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": item.taskId,
          "tchCourseId": item.tchCourseId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        deleteCourseTask(params).then(res => {
          if (res.flag) {
            this.list.splice(index, 1)
            this.$toast('删除成功')
          }
        })
      },
      handleClassName(id) {
        try{

        return this.tchClassCourseInfo.find(v => v.classId === id).className
        }catch{}
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        this.getList()
      },
      async onRefresh() {

        // this.listLoading = false
        this.finished = false
        this.currentPage = 0
        this.onLoad()
      },
      async getList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.$route.query.tchCourseId,
          "taskType": 'T10',
          "pageSize": 10,
          "currentPage": this.currentPage,
          classId: this.$route.query.classId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getCourseTaskList(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0]) {
            this.list = page === 1 ? res.data[0].tchCourseTaskInfo : this.list.concat(res.data[0].tchCourseTaskInfo)

            //设置班级名称
            if (localStorage.getItem("classMap")) {
              let classMap = JSON.parse(localStorage.getItem("classMap"))
              let hisClassMap = localStorage.getItem("hisClassMap") ? JSON.parse(localStorage.getItem("hisClassMap")) : {}
              this.list.forEach(item => {
                let finishCount = 0
                let allCount = 0
                if (item.tchClassTastInfo) {
                  item.tchClassTastInfo.forEach((obj,i) => {
                    if (i == 0) {
                      //跳转到任务统计页面时自动将第一个班级设置为选中状态
                      obj.active = true
                    }
                    finishCount += obj.finshCount
                    allCount += obj.allCount
                    if(classMap[obj.classId] && classMap[obj.classId].className) {
                      obj['className'] = classMap[obj.classId].className
                    }else if (hisClassMap[obj.classId] && hisClassMap[obj.classId].className) {
                      obj['className'] = hisClassMap[obj.classId].className
                    }else {
                      obj['className'] = "--"
                    }
                  })
                }
                item.finishCount = finishCount
                item.allCount = allCount
              })
            }
            if (this.currentPage >= res.total) {
              this.finished = true
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  .class-stat-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      .desc-top {
        display: flex;
        margin-bottom: 10px;

        .iconGFY {
          margin-right: 5px;
        }
      }

      .desc-bottom {
        margin-top: 18px;
        display: flex;
        font-size: 12px;
        color: #666;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .null-tips {
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
</style>
