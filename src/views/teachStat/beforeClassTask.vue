<template>
  <section class="before-class-task-list">
    <van-nav-bar :title="$route.query.teacherName + '课前任务'" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="before-class-task-list__filter">
      <van-cell title="筛选" style="background: #f5f5f5;color: #999"/>
      <van-cell @click="showTime = true" is-link>
        <div slot="title" class="aic jcsb">
          <div>时间</div>
          <div class="blue">{{filterTime.start}}--{{filterTime.end}}</div>
        </div>
      </van-cell>
    </div>

    <!--时间-->
    <van-popup
      v-model="showTime"
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '50%' }">
      <div class="teach-stat__time-picker-wrap">
        <div class="time-piker-header">
          <div>
            <span v-for="(item,index) in rangeList" :key="index" :class="['mgr15',{blue:item.active}]"
                  @click="dateRange(item.mtd1,item.mtd2,item.num,index)">{{item.name}}</span>
          </div>
          <div class="blue" @click="confirmDate">确认</div>
        </div>
        <div class="date-box">
          <div @click="filterTime.type = true;currentDate = new Date(filterTime.start)" class="date-select"
               :class="{active:filterTime.type}">{{filterTime.start}}
          </div>
          <div class="mgr10 mglt10">~</div>
          <div @click="filterTime.type = false;currentDate = new Date(filterTime.end)" class="date-select"
               :class="{active:!filterTime.type}">{{filterTime.end}}
          </div>
        </div>
        <van-datetime-picker
          ref="datePicker"
          confirm-button-text=" "
          cancel-button-text=" "
          v-model="currentDate"
          :max-date="maxDate"
          type="date"
          @change="changeDate"
        />
      </div>
    </van-popup>

    <div class="before-class-task-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && taskList.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/task_null.png" alt/>
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="taskList.length>0?'没有更多了':'当前没有课前任务～'"
                  @load="onLoad" :offset='80'>
          <list-item ref='listItem' :fold="item.fold" class="mgt10" style="background: #fff;"
                     v-for="(item,index) in taskList" @clickTo="goto(item)" :key="index" :itemTitle="item.taskName"
                     :test-paper-id="item.testPaperId" :taskType="item.taskType"
                     :class-info-list="item.tchClassTastInfo">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="item.tchClassTastInfo.length>2?$set(item,'fold',!item.fold):''">
                <i class="iconGFY"
                   :class="{fold:item.fold,'icon-arrow':item.tchClassTastInfo.length>2,'icon-arrow-grey':item.tchClassTastInfo.length<=2}"></i>
                <span>班级查看</span>
              </div>
              <div @click="">
                <i class="iconGFY icon-edit-disable"></i>
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
  import {getTaskInfoList} from '@/api/index'
  import {pubApi} from '@/api/parent-GFY'
  import {generateTimeReqestNumber} from '@/utils/filter'

  export default {
    name: "beforeClassTask",
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
        scrollTop: 0,
        clickIndex: 0,
        showTime: false,
        rangeList: [
          {name: '近一周', mtd1: 'getDate', mtd2: 'setDate', num: 7, active: false},
          {name: '近一个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 1, active: true},
          {name: '近三个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 3, active: false},
        ],
        currentDate: '',
        maxDate: new Date(),
        filterTime: {
          start: '',
          end: generateTimeReqestNumber(new Date()),
          type: true,   //true为开始
        },
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.$refs['listItem'] && this.$refs['listItem'][this.clickIndex] && this.$refs['listItem'][this.clickIndex].showDialog) {
        this.$refs['listItem'][this.clickIndex].close()
        next(false)
      } else {
        this.scrollTop = this.$refs["body"].scrollTop
        next()
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          // vm.$refs["body"].scrollTo(0, vm.scrollTop);
          vm.$refs["body"].scrollTop = vm.scrollTop
        });
      });
    },
    created() {
      this.filterTime.start = this.$store.getters.getTeachStatFilterTime.start
      this.filterTime.end = this.$store.getters.getTeachStatFilterTime.end
      this.currentDate = new Date(this.filterTime.start)
    },
    mounted() {
    },
    methods: {
      changeDate(picker) {
        console.log(picker.getValues(), '=======');
        if (this.filterTime.type) {
          //开始时间
          this.filterTime.start = picker.getValues().join('-')
        } else {
          this.filterTime.end = picker.getValues().join('-')
        }
      },
      async confirmDate() {
        //判断结束时间时候小于结束时间
        let time1 = new Date(this.filterTime.start)
        let time2 = new Date(this.filterTime.end)
        if (time1.getTime() > time2.getTime()) {
          return this.$toast('开始时间不能大于结束时间')
        }
        this.$store.commit('setTeachStatFilterTime', {start: this.filterTime.start, end: this.filterTime.end})

        //需要更新列表数据
        this.showTime = false
        this.$store.commit('setVanLoading', true)
        await this.onRefresh()
        this.$store.commit('setVanLoading', false)
      },
      dateRange(methodName1, methodName2, num, index) {
        let time1 = new Date()
        time1[methodName2](time1[methodName1]() - num)
        this.filterTime.start = generateTimeReqestNumber(time1)
        this.filterTime.end = generateTimeReqestNumber(new Date())
        this.rangeList.forEach(v => {
          v.active = false
        })
        this.rangeList[index].active = true
        if (this.filterTime.type) {
          this.currentDate = new Date(this.filterTime.start)
        } else {
          this.currentDate = new Date(this.filterTime.end)
        }
      },
      goBack() {
        this.common.goBack(this)
      },
      viewStat(item) {
        this.$store.commit('setVanLoading', true)
        this.$router.push({
          path: '/statistic',
          query: {
            info: item,
            testPaperId: item.testPaperId,
            termType: item.termType,
            tchCourseId: item.tchCourseId,
            taskId: item.taskId,
            taskType: item.taskType,
            resourceType: item.resourceType,
            disabled: 1, //任务统计不允许任务操作(加减分,主观题批改,心得批改,一键提醒,任务重发),只能查看
          }
        })
        localStorage.setItem('stat', JSON.stringify(item))
      },
      goto(item) {
        if (item.testPaperId > 0) {
          this.$router.push({
            path: `/examDetail`, query: {
              flag: 1,
              // "tchCourseId": this.$route.query.tchCourseId,
              "sysCourseId": item.sysCourseId,
              // "relationCourseId": this.$route.query.relationCourseId,
              type: 1,
              testPaperId: item.testPaperId,
              subjectType: item.subjectType,
              classGrade: this.$route.query.classGrade,
              title: item.testPaperName,
              fromTask: 1
            }
          })
        } else if (item.taskType === 'T03') {
          if (item.resourceType === 'R03') {
            //单道试题
            this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`)
          }
        } else if (['T13'].includes(item.taskType)) {
          //口语
          this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${item.sysCourseId}`)
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
        await this.getTaskInfoList()
      },
      async onRefresh() {
        this.finished = false
        this.currentPage = 0
        await this.onLoad()
      },
      async getTaskInfoList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "classGrade": this.$route.query.classGrade,
          "startDate": this.filterTime.start,
          "endDate": this.filterTime.end,
          "pageSize": this.pageSize,
          "currentPage": page,
          "classId": this.$route.query.classId,
          "schoolIds": this.$store.getters.schoolIdList,
          "teacherNo": this.$route.query.teacherNo
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getTaskInfoList(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].tchCourseTaskInfo.length) {
            this.taskList = page === 1 ? res.data[0].tchCourseTaskInfo : this.taskList.concat(res.data[0].tchCourseTaskInfo)
            if (localStorage.getItem("classMap")) {
              let classMap = JSON.parse(localStorage.getItem("classMap"));
              let hisClassMap = localStorage.getItem("hisClassMap") ? JSON.parse(localStorage.getItem("hisClassMap")) : {}
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
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .before-class-task-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      .null-tips {
        margin-top: 50px;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 100%;
      }
    }

    .teach-stat__time-picker-wrap {
      @{deep} .van-picker__toolbar {
        display: none;
      }

      .time-piker-header {
        height: 42px;
        padding: 0 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .date-box {
        height: 40px;
        padding: 0 15px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;

        .date-select {
          flex: 1;
          border-radius: 3px;
          border: 1px solid #999;
          line-height: 22px;
          background: #fff;
          text-align: center;

          &.active {
            border: 1px solid @blue;
          }
        }
      }
    }

  }
</style>
