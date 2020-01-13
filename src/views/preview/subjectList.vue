<template>
  <section class="subject-list-wrap">
    <analyse-wrap @toggle="toggleQuestion">
      <div class="scroll-tab" slot="tab">
        <div @click="toggleTab(item)" class="scroll-tab__item" :class="{active:item.active}"
             v-for="(item,index) in tabList" :key="index">{{item.num}}
        </div>
      </div>
      <div class="subject-list-wrap__body">
        <div class="subject-list-wrap__body-top">
          <div class="fs16">
            <div class="detail html-img" :class="{'fold':fold}">
              <div :style="{'width': fold?'80%':'100%','word-break': 'break-all'}">
                <div ref="title" v-html="info.title"></div>
                <div v-if="info.groupExamList.length">
                  <div class="fs14" v-for="(item,index) in info.groupExamList" :key="index">
                    <div class="mgt10 html-img" v-html="item.title"></div>
                    <div class="mgt10">正确答案: <span class="blue" v-html="item.answer"></span></div>
                    <div class="mgt10">答案解析:</div>
                    <div v-html="item.examExplain" class="html-img"></div>
                  </div>
                </div>
                <div v-else>
                  <div class="fs14">
                    <div class="mgt10">正确答案: <span class="blue html-img" v-html="info.answer"></span></div>
                    <div class="mgt10">答案解析:</div>
                    <div v-html="info.examExplain" class="html-img"></div>
                  </div>
                </div>
              </div>
              <div @click="fold = !fold" class="blue fold-btn" :class="{active:fold}">{{fold?'展开原题':'收起'}}</div>
            </div>
          </div>
        </div>
        <div class="subject-list-wrap__body-bottom">
          <div class="row">
            <div class="name">名字</div>
            <div class="answer" style="text-align: center;" @click="">答案</div>
            <!--            <div class="score">分数</div>-->
            <div class="error">错误率</div>
          </div>
          <div class="row" v-for="(item,index) in stuArr" :key="index">
            <div class="name">
              <span>{{getStudentName(item.accountNo,$route.query.classId)}}</span>
              <span class="blue">({{rewardScore(item.accountNo)}})</span>
              <span class="red">{{stuScore(item)}}分</span>
            </div>
            <div class="answer">
              <div class="answer-wrap" v-for="(asw,aswIndex) in item.answer" :key="aswIndex">
                <div class="left">
                  <div class="mgb5">{{examNum}}{{info.groupExamList.length?`(${aswIndex+1})`:``}} <i
                    v-if="asw.qualityType==='Q01'" class="iconGFY icon-good-active"></i></div>
                  <div v-if="asw.result && asw.result !== '<p></p>'">
                    <div @click="subjectCorrect(asw,index,aswIndex)" class="ellipsis" v-html="asw.text"></div>
                    <div class="img-wrap" :class="[{img4: asw.imgArr.length==4},{img56:asw.imgArr.length>4}]"
                         v-if="asw.imgArr.length">
                      <div @click="subjectCorrect(asw,index,aswIndex,i)" v-for="(img,i) in asw.imgArr" :key="i"><img
                        :src="img" alt=""></div>
                    </div>
                    <div style="width: 100%;" v-if="asw.audioArr.length && !asw.text">
                      <!--                    <video-player  class="video-player-box"-->
                      <!--                                   v-for="(audio,i) in asw.audioArr" :key="i"-->
                      <!--                                   ref="videoPlayer"-->
                      <!--                                   :options="{ sources: [{type: 'audio/mp4',src: audio}],}"-->
                      <!--                                   :playsinline="true"-->
                      <!--                                   customEventName="customstatechangedeventname"-->
                      <!--                                   @play="onPlayerPlay($event)">-->
                      <!--                    </video-player>-->
                      <i @click="subjectCorrect(asw,index,aswIndex)" style="width: 100%;"
                         class="iconGFY icon-player"></i>
                    </div>
                  </div>
                  <div v-else @click="subjectCorrect(asw,index,aswIndex)" class="undo">学生未作答</div>
                </div>
                <div class="right" :class="{black:asw.error == '--'}">{{asw.error}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </analyse-wrap>

  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import 'video.js/dist/video-js.css'
  import {getExamItemDetail, getExamFinishInfo, statTaskStatV2, statTaskStat} from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  import {videoPlayer} from 'vue-video-player'

  export default {
    name: "subjectList",
    components: {analyseWrap, videoPlayer},
    mounted() {
    },
    computed: {
      getStudentName() {
        return getStudentName
      }
    },
    data() {
      return {
        playerOptions: {
          // videojs options
          muted: false,
          language: 'en',
          // playbackRates: [0.7, 1.0, 1.5, 2.0],
          // src: "http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3"
          sources: [{
            type: "audio/mp4",
            src: "http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3"
          }],
          // poster: "/static/images/author.jpg",
        },
        fold: true,
        tabList: JSON.parse(JSON.stringify(this.$route.query.questionList)),
        // info: {examQuestionInfo: {}, statStudentAnswer: {stuAnswer: []}},
        info: {groupFinishMap: {}, groupExamList: []},
        // studentStatList: JSON.parse(JSON.stringify(this.$route.query.info.studentStatList)),
        studentStatList: [],
        stuArr: [],
        examNum: '', // 大题题号
        examId: this.$route.query.examId,
      }
    },
    async activated() {
      // const {examId} = this.$route.query
      const index = this.tabList.findIndex(v => v.examId === this.examId)
      this.$set(this.tabList[index], 'active', true)
      // this.getExamItemDetail(examId, groupId)

      //因为在主观题批改里面加减分以后返回到主观题批改列表需要statTaskStat这个接口去更新学生的分数,所以只能每次进来都调这个接口 (有点坑)
      await this.statTaskStat()
      this.getExamFinishInfo(this.examId)
    },
    methods: {
      async statTaskStat() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
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
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            if (this.$route.query.taskType === 'T13') {
              res.data[0].studentStatList = res.data[0].examstat
            }
            this.studentStatList = res.data[0].studentStatList
          } else {
            this.$toast(res.msg)
          }
        })
      },
      subjectCorrect(item, stuIndex, aswIndex, imgIndex) {
        console.log(item);
        screen.orientation.lock('landscape')
        // 点击图片
        // const index = this.tabList.findIndex(v => v.active)
        // const name = getStudentName(item.accountNo,this.$route.query.classId)
        // this.$router.push(`/subjectCorrect?accountNo=${item.accountNo}&examId=${this.$route.query.examId}&index=${index}&name=${name}&imgIndex=${i||0}`)
        this.$router.push({
          name: 'subjectCorrect', params: {
            accountNo: item.accountNo,
            examId: this.examId,
            classId: this.$route.query.classId,
            imgIndex: imgIndex || 0,
            aswIndex,
            stuIndex,
            examNum: this.examNum,
            // index,
            stuArr: this.stuArr,
            info: this.info,
            termType: this.$route.query.termType,
            taskId: this.$route.query.taskId
          }
        })

      },
      toggleQuestion(bol) {
        const index = this.tabList.findIndex(v => v.active)
        if (bol) {
          // 下一题
          if (index < this.tabList.length - 1) {
            this.toggleTab(this.tabList[index + 1])
          } else {
            this.$toast('没有下一题了')
          }
        } else {
          //上一题
          if (index > 0) {
            this.toggleTab(this.tabList[index - 1])
          } else {
            this.$toast('没有上一题了')
          }
        }
      },
      stuScore(item) {
        return item.answer.reduce((t, v) => {
          t += v.score
          return t
        }, 0)
      },
      rewardScore(accountNo) {
        const score = this.studentStatList.find(v => v.accountNo == accountNo).studentRewardScore || 0
        return score > 0 ? '+' + score : score
      },
      toggleTab(item) {
        if (item.active) return
        this.tabList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.examId = item.examId
        // this.getExamItemDetail(item.exam_id, item.groupId)
        this.getExamFinishInfo(item.examId)
      },
      getExamFinishInfo(examId) {
        this.$store.commit('setVanLoading', true)
        const {taskId, classId} = this.$route.query
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          taskId,
          classId,
          examId,
          tchCourseId: this.$route.query.tchCourseId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getExamFinishInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.examNum = this.tabList.find(v => v.active).num
            let stuArr = []
            const key = res.data[0].groupExamList.length ? 'groupFinishMap' : 'finishMap'
            Object.keys(res.data[0][key]).sort().forEach(k => {
              let examId = k.split('_')[0],
                accountNo = k.split('_')[1],
                errorArr = [],
                errorPercent = '--',
                examScore = 0,
                index = stuArr.findIndex(s => s.accountNo == accountNo)

              if (res.data[0].groupExamList.length) {
                // 有小题时 查询错误率
                errorArr = res.data[0].groupExamList.find(v => v.examGroupId == examId).examGroupErrorPercentInfo
                examScore = res.data[0].groupExamList.find(v => v.examGroupId == examId).examScore
                if (errorArr.length) {
                  let errorItem = errorArr.find(v => v.accountNo == accountNo)
                  if (errorItem) errorPercent = errorItem.errorPercent * 100 + '%'
                }
              } else {
                if (res.data[0].examErrorPercentInfo.length) {
                  let errorItem = res.data[0].examErrorPercentInfo.find(v => v.accountNo == accountNo)
                  if (errorItem) errorPercent = errorItem.errorPercent * 100 + '%'
                }
                examScore = res.data[0].examScore
              }

              let dom = document.createElement('div')
              res.data[0][key][k].imgArr = []
              res.data[0][key][k].audioArr = []
              dom.innerHTML = res.data[0][key][k].result
              if (res.data[0][key][k].result) {
                const imgArr = dom.querySelectorAll('img')
                const audioArr = dom.querySelectorAll('audio')
                for (let i = 0; i < imgArr.length; i++) {
                  res.data[0][key][k].imgArr.push(imgArr[i].src + '&' + Math.random())
                  let parent = imgArr[i].parentElement
                  parent.removeChild(imgArr[i])
                }
                for (let i = 0; i < audioArr.length; i++) {
                  res.data[0][key][k].audioArr.push(audioArr[i].src)
                  let parent = audioArr[i].parentElement
                  parent.removeChild(audioArr[i])
                }
              }
              res.data[0][key][k].text = dom.outerText
              if (index > -1) {
                // 该学生已存在数组中
                stuArr[index].answer.push({...res.data[0][key][k], error: errorPercent, examScore})
              } else {
                stuArr.push({
                  accountNo,
                  answer: [{...res.data[0][key][k], error: errorPercent, examScore}],
                })
              }
            })
            this.info = res.data[0]
            this.stuArr = stuArr
            this.$nextTick(() => {
              //去掉题目内容的audio下载按钮
              let dom = this.$refs['title'].querySelectorAll('audio')
              if(dom.length) {
                dom[0].controlsList="nodownload"
              }
            })
            console.log(stuArr, 'dllddldlld');
          } else {
            this.$toast(res.msg)
          }
        })
      },
      getExamItemDetail(examId, groupId) {
        this.$store.commit('setVanLoading', true)
        const {taskId, classId} = this.$route.query
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          taskId,
          examId,
          classId,
          groupId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getExamItemDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            res.data[0].statStudentAnswer.stuAnswer.forEach(v => {
              let dom = document.createElement('div')
              v.imgArr = []
              v.audioArr = []
              dom.innerHTML = v.answer
              if (v.answer) {
                const imgArr = dom.querySelectorAll('img')
                const audioArr = dom.querySelectorAll('audio')
                for (let i = 0; i < imgArr.length; i++) {
                  v.imgArr.push(imgArr[i].src)
                  let parent = imgArr[i].parentElement
                  parent.removeChild(imgArr[i])
                }
                for (let i = 0; i < audioArr.length; i++) {
                  v.audioArr.push(audioArr[i].src)
                  let parent = audioArr[i].parentElement
                  parent.removeChild(audioArr[i])
                }
              }
              v.text = dom.outerText
            })
            this.info = res.data[0]
          } else {
            this.$toast(res.msg)
          }
        })
      },
      onPlayerPlay(e) {
        console.log(this.$refs['videoPlayer']);
        console.log(document.getElementsByClassName('vjs-progress-control')[0].style);
        // window.getComputedStyle(document.getElementsByClassName('vjs-progress-control')[0], ":before").content = '666'
        // window.getComputedStyle(document.getElementsByClassName('vjs-progress-control')[0], ":before").color = '#000'
      }
    }
  }
</script>
<style lang="less">
  .subject-list-wrap {
    .ellipsis {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }
</style>
<style lang="less" scoped>
  @deep: ~'>>>';
  .subject-list-wrap {
    background: #f5f5f5;

    .scroll-tab {
      &__item {
        text-align: center;
        flex: 0 0 35px;
        line-height: 35px;
        height: 35px;
        background: #eee;
        border-radius: 50%;
        font-size: 12px;
        color: #777;
        margin-right: 10px;

        &.active {
          color: #fff;
          background: @blue;
        }
      }
    }

    &__body {
      height: 100%;
      font-size: 12px;

      &-top {
        overflow-x: hidden;
        margin-bottom: 10px;
        padding: 12px 15px;
        background: #fff;

        .detail {
          position: relative;
          display: flex;
          flex-direction: column;
          &.fold {
            height: 48px;
            overflow: hidden;
            flex-direction: row;
          }

          .fold-btn {
            font-size: 14px;
            flex: 0 0 20%;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background: #fff;

          }
        }

      }

      &-bottom {
        padding: 0 10px;
        background: #fff;
        border-top: 1.5px solid @blue;

        .row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
          text-align: center;
          font-size: 11px;
          color: #333;
          padding: 10px 0;

          .name {
            height: 24px;
            flex: 0 0 22%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }

          .score, .error {
            height: 24px;
            flex: 0 0 16%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }

          .answer {
            flex: 1;
            /*display: flex;*/
            overflow: hidden;
            /*align-items: center;*/
            /*justify-content: center;*/
            text-align: left;

            &-wrap {
              margin-bottom: 5px;
              padding-bottom: 5px;
              border-bottom: 1px solid #f5f6fa;
              display: flex;
              width: 100%;
              align-items: center;

              &:last-child {
                border-bottom: none;
              }

              .left {
                flex: 1;
              }

              .right {
                flex: 0 0 18%;
                color: red;
                text-align: center;
                &.black {
                  color: #333;
                }
              }
            }

            .icon-good-active {
              width: 8.5px;
              height: 11px;
              margin-left: 10px;
            }

            .img-wrap {
              width: 100%;
              display: flex;

              > div {
                flex: 1;
                height: 56px;
                margin-right: 5px;

                &:last-child {
                  margin-right: 0;
                }
              }

              img {
                width: 100%;
                height: 100%;
              }

              &.img4 {
                flex-wrap: wrap;

                > div {
                  flex: 0 0 48%;
                  height: 25px;
                  margin-bottom: 5px;

                  &:nth-child(2n) {
                    margin-right: 0;
                  }
                }
              }

              &.img56 {
                flex-wrap: wrap;

                > div {
                  flex: 0 0 31%;
                  height: 25px;
                  margin-bottom: 5px;

                  &:nth-child(3n) {
                    margin-right: 0;
                  }
                }
              }
            }

            .undo {
              border: 1px solid #ccc;
              line-height: 60px;
              text-align: center;
              font-size: 15px;
              color: red;
            }
          }
        }
      }
    }

    @{deep} .video-js {
      height: 30px !important;
      width: 100% !important;
      background: #fff;

      .vjs-error-display {
        display: none !important;
      }

      .vjs-loading-spinner {
        display: none !important;
      }

      .vjs-control-bar {
        display: flex !important;
        height: 30px !important;
        background: #fff;
        transition: none !important;
        opacity: 1 !important;

        .vjs-current-time {
          display: block !important;
          color: #000;
          line-height: 30px;
          padding-right: 0;

          &::after {
            content: '/';
          }
        }

        .vjs-duration {
          display: block !important;
          padding-left: 0;
          color: #000;
          line-height: 30px;
        }

        .vjs-volume-panel {
          display: none;
        }

        .vjs-fullscreen-control {
          display: none;
        }

        .vjs-play-control {
          width: 15px;

          &.vjs-playing {
            .vjs-icon-placeholder:before {
              content: '\F103';
              color: #fff;
              background: @blue;
              border-radius: 50%;
              width: 15px;
              height: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .vjs-icon-placeholder:before {
            content: '\F101';
            color: #fff;
            background: @blue;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .vjs-play-progress {
          background: @blue;

          &::before {
            content: '\F111';
            color: @blue;
          }
        }

        .vjs-load-progress {
          background: #D2F0E9;
        }
      }

      .vjs-big-play-button {
        display: none;
      }
    }
  }
</style>
