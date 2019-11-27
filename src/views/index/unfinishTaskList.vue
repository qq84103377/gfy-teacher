<template>
  <section class="unfinish-task-list">
    <div class="unfinish-task-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && taskList.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/task_null.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="taskList.length>0?'没有更多了':'当前没有未结束任务～'" @load="onLoad" :offset='80'>
          <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in taskList" @clickTo="goto(item)" :key="index" :can-slide="true" :itemTitle="item.tastName" :test-paper-id="item.testPaperId" :taskType="item.tastType" :class-info-list="item.tchCourseClassInfo" @del="delTask(item,index)">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="$set(item,'fold',!item.fold)">
                <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
                <span>班级查看</span>
              </div>
              <div @click="editTask(item)">
                <i class="iconGFY icon-edit"></i>
                <span>编辑</span>
              </div>
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
import listItem from '../../components/list-item'
import { getUnFinishCourseTask, getCourseTaskDetail, deleteCourseTask } from '@/api/index'
import { pubApi } from '@/api/parent-GFY'
import eventBus from "@/utils/eventBus";

export default {
  name: "unfinishTaskList",
  components: { listItem },
  data() {
    return {
      refLoading: false,
      listLoading: false,
      finished: false,
      currentPage: 0,
      pageSize: 10,
      taskList: [],
      total: 0,
      scrollTop: 0
    }
  },
  beforeRouteLeave(to, from, next) {
    this.scrollTop = this.$refs["body"].scrollTop;
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.$refs["body"].scrollTo(0, vm.scrollTop);
      });
    });
  },
  mounted() {
    eventBus.$off("unfinishEditTask")
    eventBus.$on("unfinishEditTask", (data) => {
      console.log("unfinishEditTask eventbus");
      this.onRefresh()
    })
  },
  methods: {
    viewStat(item) {
      this.$store.commit('setVanLoading', true)
      //估计后台字段任务名称写错了
      item.taskName = item.tastName
      this.$router.push({
        path: '/statistic',
        query: {
          info: item,
          testPaperId: item.testPaperId,
          termType: item.tchCourseClassInfo[0].termType,
          tchCourseId: item.tchCourseId,
          taskId: item.taskId,
          taskType: item.tastType,
          resourceType: item.resourceType
        }
      })
      localStorage.setItem('stat', JSON.stringify(item))
    },
    delTask(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "taskId": item.taskId,
        "tchCourseId": item.tchCourseId
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      deleteCourseTask(params).then(res => {
        if (res.flag) {
          this.taskList.splice(index, 1)
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      });
    },
    goto(item) {
      if (item.testPaperId > 0) {
        this.$router.push({
          path: `/examDetail`, query: {
            flag: 1,
            // "tchCourseId": this.$route.query.tchCourseId,
            "sysCourseId": item.tchCourseClassInfo[0].sysCourseId,
            // "relationCourseId": this.$route.query.relationCourseId,
            type: 1,
            testPaperId: item.testPaperId,
            subjectType: localStorage.currentSubjectType,
            classGrade: item.tchCourseClassInfo[0].classGrade,
            title: item.tchCourseClassInfo[0].testPaperName,
          }
        })
      } else if (item.tastType === 'T03') {
        if (item.resourceType === 'R03') {
          //单道试题
          this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.tastName}`)
        }
      } else if (['T13'].includes(item.tastType)) {
        //口语
        this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${item.tchCourseClassInfo[0].sysCourseId}`)
      } else if (['T02', 'T04', 'T06'].includes(item.tastType)) {
        // 学资源 微课+心得 讨论  跳任务统计
        this.viewStat(item)
      }
    },
    getCourseTaskDetail(item) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        operateRoleType: 'A02',
        tchCourseId: item.tchCourseId,
        "taskId": item.taskId,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseTaskDetail(params).then(res => {
        if (res.flag) {
          if (['T04'].includes(item.tastType)) {
            this.$router.push({ path: '/materialDetail', query: { data: res.data[0].courseware } })
          } else if (['T06'].includes(item.tastType)) {
            this.$router.push({ path: `/discussDetail`, query: { data: res.data[0].discussInfo } })
          } else if (['T01', 'T02'].includes(item.tastType)) {
            console.log(res.data[0], 'res.data[0]////////////');
            if (res.data[0] && res.data[0].courseware && res.data[0].courseware.srcUrl) {
              this.checkUrlPermission(res.data[0].courseware.srcUrl)
            }
          } else if (['T01', 'T02'].includes(item.taskType)) {
            console.log(res.data[0], 'res.data[0]////////////');
            if (res.data[0] && res.data[0].courseware && res.data[0].courseware.srcUrl) {
              this.checkUrlPermission(res.data[0].courseware.srcUrl, item.tastName)
            }
          }
        }
      })
    },
    async onLoad() {
      this.currentPage++
      if (this.currentPage > this.total && this.currentPage > 1) {
        return
      }
      this.getUnFinishCourseTask()
    },
    async onRefresh() {
      this.finished = false
      this.currentPage = 0
      await this.onLoad()
    },
    async getUnFinishCourseTask() {
      const page = this.currentPage
      let obj = {
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        currentPage: page,
        pageSize: this.pageSize
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getUnFinishCourseTask(params).then(res => {
        this.listLoading = false
        this.refLoading = false
        this.total = res.total
        if (res.flag && res.data && res.data.length) {
          this.taskList = page === 1 ? res.data : this.taskList.concat(res.data)
          if (localStorage.getItem("classMap")) {
            let classMap = JSON.parse(localStorage.getItem("classMap"));
            this.taskList.forEach(item => {
              if (item.tchCourseClassInfo) {
                item.tchCourseClassInfo.forEach((obj, i) => {
                  if (i == 0) {
                    //跳转到任务统计页面时自动将第一个班级设置为选中状态
                    obj.active = true
                  }
                  if (!classMap[obj.classId] || !classMap[obj.classId].className) {
                    obj['className'] = "--"
                  } else {
                    obj['className'] = classMap[obj.classId].className
                  }
                })
              }
              //任务统计需要tchClassTastInfo字段,但getUnFinishCourseTask接口字段为tchCourseClassInfo
              item.tchClassTastInfo = item.tchCourseClassInfo
            });
          }
          if (this.currentPage >= res.total) {
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
    checkUrlPermission(url, title) {
      // 课件鉴权
      let permissionParams = {
        'interUser': 'runLfb',
        'interPwd': '25d55ad283aa400af464c76d713c07ad',
        'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
        'belongSchoolId': this.$store.getters.schoolId,
        'url': url,
        'sysTypeCd': 'S03'
      }
      this.$store.commit('setVanLoading', true)
      pubApi.checkUrlPermission({ requestJson: JSON.stringify(permissionParams) }).then((respone) => {
        this.$store.commit('setVanLoading', false)
        if (respone.flag) {
          if (this.type == 'office' || this.type == 'pdf') {
            if (url.indexOf('pubquanlang') > -1) {
              url = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl

            } else {
              url = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl
            }
          } else {
            url = respone.data[0].accessUrl
          }
        } else {
          url = ''
        }

        if (!url) {
          this.$toast('暂无资源')
          return
        }

        this.$router.push({ name: 'videoPage', query: { src: url, title } })
      }).catch(() => {
        this.$toast('资源错误')
      })

    },
    editTask(item) {
      console.log(item, 'editTask  item');
      // let classList = []
      let classMap = JSON.parse(localStorage.getItem("classMap"));
      for (const key in classMap) {
        for (var i = 0; i < item.courseClassList.length; i++) {
          if (classMap[key].classId == item.courseClassList[i].classId) {
            item.courseClassList[i].className = classMap[key].className
            // classList.push({ classId: item.courseClassList[i].classId, className: classMap[key].className, })
          }
        }
      }
      console.log(item.courseClassList, 'item.courseClassList');
      let tchCourseInfo = {
        tchCourseId: item.tchCourseId,
        tchClassCourseInfo: item.courseClassList,
        subjectType: item.subjectType,
      }
      this.$store.commit('setResourceInfo', item)
      this.$store.commit("setTchCourseInfo", tchCourseInfo)
      console.log(tchCourseInfo, 'tchCourseInfo');
      this.$store.commit("setTaskClassInfo", '')
      this.$router.push({
        path: '/addTask?_t=new',
        query: {
          info: item,
          testPaperId: item.testPaperId,
          // termType: this.termType,
          tchCourseId: item.tchCourseId,
          taskId: item.taskId,
          taskType: item.taskType ? item.taskType : item.tastType,
          resourceType: item.resourceType,
          isEdit: true,
          from: 'unfinish'
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.unfinish-task-list {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  &__body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
