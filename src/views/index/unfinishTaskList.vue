<template>
    <section class="unfinish-task-list">
      <div class="unfinish-task-list__body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
          <div v-if="!listLoading && taskList.length==0" style="text-align: center;color: #999999">
            <img class="null-tips" src="../../assets/img/preview/task_null.png" alt/>
          </div>
          <van-list v-model="listLoading" :finished="finished"
                    :finished-text="taskList.length>0?'没有更多了':'当前没有未结束任务～'" @load="onLoad" :offset='80'>
            <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in taskList"
                       @clickTo="goto(item)"
                       :key="index" :can-slide="true" :itemTitle="item.tastName"
                       :test-paper-id="item.testPaperId"
                       :taskType="item.tastType" :class-info-list="item.tchCourseClassInfo"
                        @del="delTask(item,index)">
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'fold',!item.fold)">
                  <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
                  <span>班级查看</span>
                </div>
                <div>
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
  import {getUnFinishCourseTask, getCourseTaskDetail, deleteCourseTask} from '@/api/index'
    export default {
        name: "unfinishTaskList",
      components: {listItem},
      data() {
          return {
            refLoading: false,
            listLoading: false,
            finished: false,
            currentPage: 0,
            pageSize: 10,
            taskList: [],
            total: 0,
          }
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
          if(item.tastType === 'T03') {
            if(item.resourceType === 'R03') {
              //单道试题
              this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`)
            }else {
              //试卷
              this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${item.tchCourseClassInfo[0].classGrade}&title=${item.tchCourseClassInfo[0].testPaperName}`)
            }
          }else if(['T04'].includes(item.tastType)) {
            // 学资源
            this.getCourseTaskDetail(item)
          }else if (['T01','T02'].includes(item.tastType)) {
            //微课   由于需要自动横屏全屏播放 暂时不弄
          }else if (['T06'].includes(item.tastType)) {
            //讨论
            this.getCourseTaskDetail(item)
          }else if (['T13'].includes(item.tastType)) {
            //口语
            this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${item.tchCourseClassInfo[0].sysCourseId}`)
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
              if(['T04'].includes(item.tastType)) {
                this.$router.push({path:'/materialDetail',query:{data:res.data[0].courseware}})
              }else if(['T06'].includes(item.tastType)) {
                this.$router.push({path:`/discussDetail`,query:{data:res.data[0].discussInfo}})
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
        async getUnFinishCourseTask(){
          const page = this.currentPage
          let obj = {
            operateAccountNo:this.$store.getters.getUserInfo.accountNo,
            currentPage:page,
            pageSize:this.pageSize,
            courseType: 'C01'
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          await getUnFinishCourseTask(params).then(res=>{
            this.listLoading = false
            this.refLoading = false
            this.total = res.total
            if (res.flag && res.data && res.data.length){
              this.taskList = page === 1 ? res.data : this.taskList.concat(res.data)
              if (localStorage.getItem("classMap")) {
                let classMap = JSON.parse(localStorage.getItem("classMap"));
                this.taskList.forEach(item => {
                  if (item.tchCourseClassInfo) {
                    item.tchCourseClassInfo.forEach((obj,i) => {
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
            } else{
              this.taskList = page === 1 ? [] : this.taskList.concat([])
              this.finished = true
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
