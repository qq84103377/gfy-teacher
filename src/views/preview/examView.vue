<template>
  <section class="exam-view-wrap">
    <van-nav-bar
      :title="title"
      @click-left="goBack"
      left-arrow>
    </van-nav-bar>
    <div class="exam-view-wrap__tab">
      <div @click="handleToggle(true)" :class="{active:classView}">班级查看</div>
      <div @click="handleToggle(false)" :class="{active:!classView}">小组查看</div>
    </div>
    <div class="exam-view-wrap__body">
      <score-table :examScore="info.testPaperScore" @jump="jump" :list="classList" :classView="true"
                   v-show="classView"></score-table>
      <score-table :examScore="info.testPaperScore" @jump="jump" :list="groupList" :classView="false"
                   v-show="!classView"></score-table>
      <div v-if="!classList.length" class="empty-page">
        <img src="../../assets/img/empty-1.png" alt/>
        <div>当前还没有学生完成任务,快去提醒学生完成任务吧!</div>
      </div>
    </div>
    <div class="exam-view-wrap__footer">
      <van-button type="info" class="btn" @click="addSubScore">加分/减分</van-button>
    </div>
  </section>
</template>

<script>
  import scoreTable from '../../components/scoreTable'
  import {getStudentName} from '@/utils/filter'
  import {statTaskStatV2, statTaskStat} from '@/api/index'

  export default {
    name: "examView",
    data() {
      return {
        classView: true, //按班级查看
        info: JSON.parse(JSON.stringify(this.$route.params.info)),
        title: this.$route.params.title,
        isSpoken: this.$route.params.isSpoken,
        taskType: this.$route.params.taskType,
        termType: this.$route.params.termType,
      }
    },
    computed: {
      classList() {
        let arr = this.info.studentStatList.reduce((t, v) => {
          if (v.endDate) {
            t.push({
              ...v,
              name: getStudentName(v.accountNo, this.info.classId),
              duration: Math.floor(v.duration / 60) > 0 ? `${Math.floor(v.duration / 60)}分${v.duration % 60}秒` : `${v.duration % 60}秒`
            })
          }
          return t
        }, [])
       return this.bubbleSort(arr)
      },
      groupList() {
        let arr = this.info.studentStatList.reduce((t, v) => {
          if (v.endDate) {
            const index = t.findIndex(g => g.groupId === v.groupId)
            const item = {
              ...v,
              name: getStudentName(v.accountNo, this.info.classId),
              duration: Math.floor(v.duration / 60) > 0 ? `${Math.floor(v.duration / 60)}分${v.duration % 60}秒` : `${v.duration % 60}秒`
            }
            if (index > -1) {
              // 已存在相同组
              t[index].stu.push(item)
              const total = t[index].stu.reduce((total, s) => {
                total += s.score
                return total
              }, 0)
              t[index].average = (total / t[index].stu.length).toFixed(2)
            } else {
              t.push({
                groupId: v.groupId,
                groupName: v.groupName,
                groupScore: v.groupScore,
                average: item.score,
                stu: [item]
              })
            }

          }
          return t
        }, [])
        return this.bubbleSort(arr)
      }
    },
    created() {
    },
    beforeRouteEnter(to, from, next) {
      if (from.path === '/addSubScore' || from.path === '/addSubGroupScore') {
        next( vm => {
           vm.statTaskStat()
        })
      }
      else {
        next()
      }
    },
    components: {scoreTable},
    methods: {
       goBack(){
          this.common.goBack(this)
        },
      statTaskStat() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.info.taskId,
          classId: this.info.classId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        let api
        if (['T10'].includes(this.$route.query.taskType)) {
          //从堂测统计进入
          api = statTaskStatV2
        } else {
          api = statTaskStat
        }
        api(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if (res.flag && res.data[0]) {
            if (this.$route.query.taskType === 'T13') {
              res.data[0].studentStatList = res.data[0].examstat
              //因为口语没有testPaperScore这个字段,但是总分是按100分来算的
              res.data[0].testPaperScore = 100
            }
            this.info = res.data[0]
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addSubScore() {
        if(this.classView) {
        this.$router.push({name:`addSubScore`,params:{info:this.info,termType:this.termType}})
        }else {
          this.$router.push({name:`addSubGroupScore`,params:{info:this.info,termType:this.termType}})
        }
      },
      //冒泡排序
      bubbleSort(arr) {

        for (let i = 0; i < arr.length - 1; i++) {

          for (let j = 0; j < arr.length - 1 - i; j++) {

            if (arr[j].score < arr[j + 1].score) {

              let tem = arr[j];

              arr[j] = arr[j + 1];

              arr[j + 1] = tem;

            }

          }

        }
        return arr

      },
      jump(item) {
        if (this.isSpoken) {
          let info = this.info.finishResultBySplit.reduce((t, v) => {
            let answer = v.splitInfoStudentAnswers.find(value => value.accountNo === item.accountNo)
            if (answer) t.push({...answer, sentenceContent: v.splitSentence.sentenceContent}) // 词汇存进数组
            return t
          }, [])
          this.$router.push({
            name: 'spokenAnalyse',
            params: {type: 'personal', info, classId: this.info.classId, index: 0}
          })
        } else {
          this.$router.push({
            path: '/stuAnalyse',
            query: {accountNo: item.accountNo, classId: this.info.classId, taskType: this.taskType}
          })
        }
      },
      handleToggle(bol) {
        //班级未分组时,无法切换小组查看 弹出toast
        if (JSON.parse(localStorage[`subGroup_${localStorage.currentSubjectType}_${this.info.classId}`]).length === 0) {
          return this.$toast('该班级未分组,无法进行小组查看')
        }
        this.classView = bol
      },
    }
  }
</script>

<style lang="less" scoped>
  .exam-view-wrap {
    flex-direction: column;
    display: flex;

    &__tab {
      flex: 0 0 48px;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > div {
        border-radius: 15px;
        font-size: 15px;
        color: #999;
        background: #F5F6FA;
        margin-right: 20px;
        line-height: 30px;
        padding: 0 15px;

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 0 10px 10px;

    }
    &__footer {
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .btn {
        height: 44px;
        line-height: 44px;
        flex: 1;
        border-radius: 20px;
        font-size: 18px;
      }
    }
  }
</style>
