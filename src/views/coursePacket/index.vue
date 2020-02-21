<template>
  <section class="packet-wrap">
    <div class="packet-wrap__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && courseTaskList.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/task_null.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="courseList.length?(courseTaskList.length>0?'没有更多了':'当前没有已发任务，快去新建任务吧！'):'当前没有课程,快去新建课程吧！'" @load="onLoad" :offset='80'>
          <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in courseTaskList" @clickTo="goto(item)" :key="index" :can-slide="true" :top="courseTaskList.length>1 && index!=0" :up="courseTaskList.length>1 &&index!=0" :down="courseTaskList.length>1 &&index!=courseTaskList.length-1" :itemTitle="item.taskName" :test-paper-id="item.testPaperId" :taskType="item.taskType" :class-info-list="item.tchClassTastInfo" @up="moveTask(item,index,0)" @top="topTask(item,index)" @down="moveTask(item,index,1)" @del="delTask(item,index)">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="item.tchClassTastInfo.length>2?$set(item,'fold',!item.fold):''">
                <i class="iconGFY" :class="{fold:item.fold,'icon-arrow':item.tchClassTastInfo.length>2,'icon-arrow-grey':item.tchClassTastInfo.length<=2}"></i>
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
export default {
  name: '',
  data() {
    return {
      refLoading: false,
      finished: false

    }
  },
  methods: {
    async onRefresh() {

      // this.listLoading = false
      this.finished = false
      this.currentPage = 1
      await this.getCourseTaskList(this.courseName, this.tchCourseId)
      this.$toast('刷新成功')
    },
    async onLoad() {
      this.currentPage++
      if (this.currentPage > this.total && this.currentPage > 1) {
        return
      }

      // if (!this.courseList.length) {
      if (this.firstFlag) {
        //首次加载
        await this.getClassTeachCourseInfo()
        if (this.$route.query.from === 'course') {
          this.courseName = this.$route.query.courseName
          this.classGrade = this.$route.query.classGrade
          this.sysCourseId = this.$route.query.sysCourseId
          this.tchCourseId = this.$route.query.tchCourseId
          this.relationCourseId = this.$route.query.relationCourseId
          this.termType = this.$route.query.termType
        } else {
          if (this.courseList.length) {
            this.courseName = this.courseList[0].tchCourseInfo.courseName
            this.classGrade = this.courseList[0].tchCourseInfo.classGrade
            this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
            this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
            this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId
            this.termType = this.courseList[0].tchCourseInfo.termType
          }
        }

      }
      this.getCourseTaskList(this.courseName, this.tchCourseId)
    },
  },

}
</script>

<style lang="less" scoped>
.packet-wrap {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  &__body {
    flex: 1;
    overflow-y: auto;
    /*padding-top: 55px;*/
    .add-course {
      width: 190px;
      height: 44px;
      border-radius: 22px;
      font-size: 16px;
    }
  }
}
</style>