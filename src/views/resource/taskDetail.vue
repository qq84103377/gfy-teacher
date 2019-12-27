<template>
  <section class="task-detail">
    <van-nav-bar class="task-detail__header" title="任务详情" :left-arrow="isApp" @click-left="goBack" />
    <div class="task-detail__body">
      <div class="task-detail__body__top">
        <div class="fs18 mgb10" style="font-weight: bold;">练习发布成功</div>
        <div class="red fs10">您可以把练习分享给家长，督促学生及时完成练习</div>
      </div>
      <div class="task-detail__body__center">
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>名称</div>
            <div class="ellipsis">{{taskDetail.tastName}}</div>
          </div>
        </van-cell>
        <van-cell v-show="showClass">
          <div slot="title" class="task-detail__body__center__cell">
            <div>班级</div>
            <div>
              <van-dropdown-menu style="height: 5vw">
                <van-dropdown-item v-model="currentClassId" :options="optionList" />
              </van-dropdown-menu>
            </div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>开始时间</div>
            <div>{{taskDetail.startDate}}</div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>结束时间</div>
            <div>{{taskDetail.endDate}}</div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title">
            <div>描述:</div>
            <div class="desc" v-if="taskDetail.desc">{{taskDetail.desc}}</div>
            <div class="desc" v-else>无</div>
          </div>
        </van-cell>
      </div>
      <div class="task-detail__body__center">
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>类型</div>
            <div>{{taskDetail.tastType|dealType(taskTypeList)}}</div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>题量</div>
            <div>{{examCount}}道</div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" class="task-detail__body__center__cell">
            <div>时长</div>
            <div>{{taskDetail.duration}}分钟</div>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title">
            <div class="task-detail__body__center__cell">
              <div>备注:</div>
              <div class="fs10 red">{{200 - remark.length}}</div>
            </div>
            <textarea rows="1" maxlength="200" v-model="remark" placeholder="请输入描述，字数在200字内"></textarea>
          </div>

        </van-cell>
      </div>
    </div>
    <div v-if="isApp" class="task-detail__footer">
      <van-button type="info" class="btn" @click="shareBarShow = true">分享给家长</van-button>
      <van-button type="info" class="btn" @click="$router.go(-2)">完成</van-button>
    </div>
    <share-bar :show.sync="shareBarShow" :title="`${$route.query.subjectTypeName}练习--《${taskDetail.tastName}》`" desc="我布置了一份练习,请家长督促学生完成" :link="link"></share-bar>
  </section>
</template>

<script>
import shareBar from '../../components/shareBar'
import { getCourseTaskDetailByShare } from '@/api/index'


export default {
  name: "taskDetail",
  components: { shareBar },
  data() {
    return {
      remark: this.$route.query.remark?decodeURI(this.$route.query.remark): '',
      shareBarShow: false,
      taskList: [],
      taskTypeList: this.$store.state.taskTypeList,
      examCount: 0,
      taskDetail: '',
      currentClassId: '',
      optionList: [],
      showClass: true,
    }
  },
  mounted() {
    console.log("任务类型", this.taskTypeList)
    this.initTaskDetail()
  },
  computed: {
    link() {
      const {tchCourseId,taskId,accountNo,subjectTypeName} = this.$route.query
      return `${process.env.VUE_APP_HOST}/#taskDetail?tchCourseId=${tchCourseId}&taskId=${taskId}&accountNo=${accountNo}&subjectTypeName=${subjectTypeName}&remark=${this.remark}`
    },
    isApp() {
      return 'cordova' in window
    }
  },
  methods: {
       goBack() {
      console.log('路由页面' + this.$route.meta.title + '按了返回')
      console.log('appHeader当前路由记录' + this.$navigation.getRoutes())
      if (this.$navigation.getRoutes()&&this.$navigation.getRoutes().length>1) {
        console.log('存在路由记录')
        // this.$router.back()
        window.history.back(-2)
      } else {
        this.$router.replace('/index')
      }
        // this.$router.back()
    },
    initTaskDetail() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$route.query.accountNo,
        "taskId": this.$route.query.taskId,
        "tchCourseId": this.$route.query.tchCourseId,
        accountNo: this.$route.query.accountNo
      }
      if (this.$route.query.classId) {
        obj.classId = this.$route.query.classId
      }

      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseTaskDetailByShare(params).then(res => {
        console.log(res)
        if (res.flag) {
          this.taskList = res.data[0].taskInfoList
          //判断是分班设置还是统一设置时间，通知设置不显示班级
          let flag = false
          let start = this.taskList[0].startDate
          let end = this.taskList[0].endDate
          this.taskDetail = this.taskList[0]
          console.log(this.taskDetail)

          if (this.taskDetail.tastType == "T04") {
            if (!this.taskDetail.testPaperId) {
              this.$set(this.taskDetail, 'tastType', 'T04_1')//学资源+心得
            } else {
              this.$set(this.taskDetail, 'tastType', 'T04_2')//学资源+试卷
            }
          }
          this.taskList.forEach((item) => {
            this.optionList.push({
              text: item.className,
              value: item.classId
            })
            if (start != item.startDate || end != item.endDate) {
              flag = true
            }
          })
          this.showClass = flag
          this.currentClassId = this.taskDetail.classId
          if (res.data[0].testPaperInfo) {
            this.examCount = res.data[0].testPaperInfo.subjectiveItemNum + res.data[0].testPaperInfo.objectiveItemNum
          }
        } else {
          this.$toast(res.msg)
        }
      })
    }
  },
  watch: {
    currentClassId: function (value) {
      let index = 0
      for (let item of this.taskList) {
        if (item.classId == value) {
          this.taskDetail = this.taskList[index]
          if (this.taskDetail.tastType == "T04") {
            if (!this.taskDetail.testPaperId) {
              this.$set(this.taskDetail, 'tastType', 'T04_1')//学资源+心得
            } else {
              this.$set(this.taskDetail, 'tastType', 'T04_2')//学资源+试卷
            }
          }
        }
        index++
      }
    }
  }
}
</script>

<style lang="less" scoped>
.task-detail {
  display: flex;
  background: #f5f5f5;
  flex-direction: column;
  &__body {
    flex: 1;
    overflow-y: auto;
    &__top {
      background: #fff;
      text-align: center;
      padding: 20px 0;
      margin-bottom: 5px;
    }
    &__center {
      background: #fff;
      margin-bottom: 10px;
      .desc,
      textarea {
        width: 100%;
        background: #f5f6fa;
        border-radius: 5px;
        padding: 10px;
      }
      &__cell {
        display: flex;
        justify-content: space-between;
        .ellipsis {
          /*flex: 0 0 50%;*/
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: right;
        }
      }
    }
    &__bottom {
      background: #fff;
      margin-bottom: 10px;
    }
  }
  &__footer {
    flex: 0 0 55px;
    padding: 5px 15px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      flex: 1;
      font-size: 16px;
      border-radius: 22px;
      margin-right: 23px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
