<template>
  <section class="briefing-wrap">
    <van-nav-bar
      title="简报"
      @click-left="goBack"
      :left-arrow="isApp">
    </van-nav-bar>
    <div class="briefing-wrap__body">
      <div class="briefing-wrap__body-ctn-wrap black">
        <div class="fs18" style="color: #000">{{decodeURI($route.query.subjectTypeName)}}练习《{{decodeURI($route.query.title)}}》{{new
          Date()|generateTimeReqestNumber('MMdd')}}完成情况简报
        </div>
        <div class="info-wrap" v-if="$route.query.testPaperId>0 || $route.query.taskType === 'T13'">
          <div>本次练习班级平均分为<span class="orange">{{info.finshCount>0?parseFloat((info.totalScore / info.finshCount).toFixed(2)):0}}分</span>
          </div>
          <div>最高分为<span class="orange">{{info.maxScore}}分</span></div>
          <div>最低分为<span class="orange">{{info.minScore}}分</span></div>
        </div>
        <div class="fs10 red">请家长及时关注孩子的完成情况，未提交练习的提醒补做</div>
      </div>
      <div class="briefing-wrap__body-ctn-wrap" v-for="(item,index) in scoreSpan" :key="index">
        <div class="fs16">{{item.name}} 共计{{item.stu.length}}人</div>
        <div class="pdlt10 fs14"><span v-for="(s,si) in item.stu" :key="si">{{handleStudentName(s)}}{{si < item.stu.length -1 ? '、':''}}</span>
        </div>
      </div>
    </div>
    <div v-if="isApp" class="briefing-wrap__footer">
      <van-button type="info" class="share-btn" @click="shareBarShow=true">分享</van-button>
    </div>
    <share-bar :show.sync="shareBarShow" :title="`${decodeURI($route.query.subjectTypeName)}练习--《${$route.query.title}》完成情况简报--请家长及时查看`" desc="请家长配合督促学生认真完成练习,表现好的同学给予表扬!" :link="link"></share-bar>
  </section>
</template>
<script>
  import shareBar from '../../components/shareBar'
  import {getStudentName} from '@/utils/filter'
  import {statTaskStat, getAppraiseV2, getClassStudent, statTaskStatV2} from '@/api/index'
  import * as calculator from '@/utils/calculate'

  export default {
    name: "briefing",
    components: {shareBar},
    data() {
      return {
        shareBarShow: false,
        scoreSpan: [],
        info: {},
        appraiseList: [],
        classStudentList: []
      }
    },
    computed: {
      decodeURI() {
       return decodeURI
      },
      link() {
        const {taskType,resourceType,testPaperId,subjectTypeName,title,taskId,classId,operateAccountNo,belongSchoolId} = this.$route.query
        return `${process.env.VUE_APP_HOST}/#/briefing?taskType=${taskType}&resourceType=${resourceType}&testPaperId=${testPaperId}&subjectTypeName=${encodeURI(subjectTypeName)}&title=${title}&taskId=${taskId}&classId=${classId}&operateAccountNo=${operateAccountNo}&belongSchoolId=${belongSchoolId}`
      },
      isApp() {
        return 'cordova' in window
      }
    },
    async created() {
      this.$store.commit('setVanLoading', true)
      // if (!('cordova' in window)) {
       await this.getClassStudent()
        //分享出去以后浏览器打开需要调接口获取数据,无法通过url传递对象参数,因为数据太多
        await this.statTaskStat()
        if (this.$route.query.testPaperId <= 0 && this.$route.query.taskType !== 'T13' && this.$route.query.resourceType !== 'R03') {
          await this.getAppraise()
        }
      // }

      this.init()
      this.$store.commit('setVanLoading', false)
    },
    methods: {
       goBack(){
          this.common.goBack(this)
        },
      handleStudentName(accountNo) {
       const item = this.classStudentList.find(v => v.accountNo == accountNo)
        if(item) {
          return item.studentName
        }else {
          return '--'
        }
      },
     async getClassStudent() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$route.query.operateAccountNo,
          classId: this.$route.query.classId,
          "statusCd": "S99"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       await getClassStudent(params).then(res => {
           this.classStudentList = res.data[0].classStudent
        })
      },
      async getAppraise() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          classId: this.$route.query.classId,
          currPage: 1,
          isAppendMode: true,
          objectId: this.$route.query.taskId,
          objectTypeCd: 'A01',
          pageSize: 9999,
          praiseType: 1,
          replyType: 1,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getAppraiseV2(params).then(res => {
          if (res.flag && res.data[0]) {
            this.appraiseList = res.data[0].appraiseListInfo
          } else {
            this.appraiseList = []
          }
        })
      },
      async statTaskStat() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$route.query.operateAccountNo,
          "belongSchoolId": this.$route.query.belongSchoolId,
          "taskId": this.$route.query.taskId,
          classId: this.$route.query.classId
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
        await api(params).then(res => {
          if (res.flag) {
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
      init() {
        if (this.$route.query.testPaperId > 0 || this.$route.query.taskType === 'T13' || this.$route.query.resourceType === 'R03') {
          //是试卷
          this.scoreSpan = [
            //如果是口语类型,满分字段需要调整
            {name: `满分(${this.info.testPaperScore}分)`, stu: []},
            {
              name: `${calculator.mul(this.info.testPaperScore, 0.8, 0)}及${calculator.mul(this.info.testPaperScore, 0.8, 0)}分以上`,
              stu: []
            },
            {name: '未提交', stu: []},
            {name: '补做', stu: []},
          ]
          this.info.studentStatList.forEach(v => {
            let percent = 0
            if (this.info.testPaperScore > 0) {
              // percent = Number((v.score / this.info.testPaperScore).toFixed(2))
              percent = calculator.div(v.score, this.info.testPaperScore, 2)
            }
            if (v.endDate) {
              if (percent >= 1) {
                this.scoreSpan[0].stu.push(v.accountNo)
              }
              if (percent >= 0.8) {
                this.scoreSpan[1].stu.push(v.accountNo)
              }
            } else {
              this.scoreSpan[2].stu.push(v.accountNo)
            }
            if (v.redoTimes > 0) {
              this.scoreSpan[3].stu.push(v.accountNo)
            }
          })
        } else {
          //心得或讨论
          this.scoreSpan = [
            {name: `精华笔记`, stu: []},
            {name: `点赞笔记`, stu: []},
            {name: '未提交', stu: []},
            {name: '补做', stu: []},
          ]
          this.appraiseList.forEach(v => {
            if (v.essFlag === '1') {
              //有加精华
              this.scoreSpan[0].stu.push(v.appraiseAccountNo)
            }
            if (v.praiseList.length) {
              //有人点赞
              this.scoreSpan[1].stu.push(v.appraiseAccountNo)
            }
            this.scoreSpan[2].stu = this.info.studentUnfinishList.reduce((t, v) => {
              t.push(...v.accountNoList)
              return t
            }, [])
            this.info.studentStatList.forEach(v => {
              if (v.redoTimes > 0) {
                this.scoreSpan[3].stu.push(v.accountNo)
              }
            })
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .briefing-wrap {
    background: #f5f5f5;
    flex-direction: column;
    display: flex;

    &__body {
      flex: 1;
      overflow-y: auto;

      &-ctn-wrap {
        padding: 10px;
        margin-bottom: 5px;
        background: #fff;

        .info-wrap {
          line-height: 30px;
          font-size: 15px;
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;

      .share-btn {
        width: 100%;
        color: #fff;
        border-radius: 20px;
        font-size: 18px;
      }
    }
  }
</style>
