<template>
  <section class="briefing-wrap">
    <div class="briefing-wrap__body">
      <div class="briefing-wrap__body-ctn-wrap black">
        <div class="fs18" style="color: #000">{{$route.query.title}}完成情况简报</div>
        <div class="info-wrap">
          <div>本次联系班级平均分为<span class="orange">{{info.finshCount>0?(info.totalScore / info.finshCount).toFixed(2):0}}分</span></div>
          <div>最高分为<span class="orange">{{info.maxScore}}分</span></div>
          <div>最低分为<span class="orange">{{info.minScore}}分</span></div>
        </div>
        <div class="fs10 red">请家长及时关注孩子的完成情况，未提交练习的提醒补做</div>
      </div>
      <div class="briefing-wrap__body-ctn-wrap" v-for="(item,index) in scoreSpan" :key="index">
        <div class="fs16">{{item.name}} 共计{{item.stu.length}}人</div>
        <div class="pdlt10 fs14"><span v-for="(s,si) in item.stu" :key="si">{{s.name}}{{si < item.stu.length -1 ? '、':''}}</span></div>
      </div>
    </div>
    <div class="briefing-wrap__footer">
      <van-button type="info" class="share-btn" @click="shareBarShow=true">分享</van-button>
    </div>
    <share-bar :show.sync="shareBarShow" :title="$route.query.title + '完成情况简报'" :link="link"></share-bar>
  </section>
</template>
<script>
  import shareBar from '../../components/shareBar'
  import {getStudentName} from '@/utils/filter'
  import {statTaskStat} from '@/api/index'
  export default {
    name: "briefing",
    components: {shareBar},
    data() {
      return {
        shareBarShow: false,
        scoreSpan: [
          {name: '满分(100分)', min: 100, max: 101, stu: []},
          {name: '80及80分以上', min: 80, max: 101, stu: []},
          {name: '未提交', stu: []},
          {name: '补做', stu: []},
        ],
        info: this.$route.query.info
      }
    },
    computed: {
      link() {
        return `${process.env.VUE_APP_HOST}/#${this.$route.fullPath}`
      }
    },
    async created() {
      this.$store.commit('setVanLoading',true)
      if(!('cordova' in window)) {
        //分享出去以后浏览器打开需要调接口获取数据,无法通过url传递对象参数,因为数据太多
       await this.statTaskStat()
      }
      this.handleList()
      this.$store.commit('setVanLoading',false)
    },
    methods: {
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
        await statTaskStat(params).then(res => {
          if(res.flag) {
            this.info = res.data[0]
          }else {
            this.$toast(res.msg)
          }
        })
      },
      handleList() {
        this.info.studentStatList.forEach(v => {
          let percent = 0
          if (this.info.testPaperScore > 0) {
            percent = Number((v.score / this.info.testPaperScore * 100).toFixed(2))
          }
          if (v.endDate) {
            if(percent >= 100) {
              this.scoreSpan[0].stu.push({
                name: getStudentName(v.accountNo, this.info.classId),
                accountNo: v.accountNo
              })
            }
            if(percent >= 80) {
              this.scoreSpan[1].stu.push({
                name: getStudentName(v.accountNo, this.info.classId),
                accountNo: v.accountNo
              })
            }
          } else {
            this.scoreSpan[2].stu.push({
              name: getStudentName(v.accountNo, this.info.classId),
              accountNo: v.accountNo
            })
          }
          if(v.redoTimes > 0) {
            this.scoreSpan[3].stu.push({
              name: getStudentName(v.accountNo, this.info.classId),
              accountNo: v.accountNo
            })
          }
        })
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
        .info-wrap{
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
