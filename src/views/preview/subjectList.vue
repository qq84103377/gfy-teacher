<template>
  <section class="subject-list-wrap">
    <analyse-wrap @toggle="toggleQuestion">
      <div class="scroll-tab" slot="tab">
        <div @click="toggleTab(item)" class="scroll-tab__item" :class="{active:item.active}" v-for="(item,index) in tabList" :key="index">{{item.exam_index}}</div>
      </div>
      <div class="subject-list-wrap__body">
        <div class="subject-list-wrap__body-top">
          <div class="fs16">
            <div class="detail" :class="{'fold':fold}" >
              <div v-html="info.examQuestionInfo.title"></div>
              <div class="fs14">
                <div class="mgt10">正确答案: <span class="blue" v-html="info.examQuestionInfo.answer"></span></div>
                <div class="mgt10">答案解析:</div>
                <div v-html="info.examQuestionInfo.examExplain"></div>
              </div>
              <div @click="fold = !fold" class="blue fold-btn" :class="{active:fold}">{{fold?'展开原题':'收起'}}</div>
            </div>
          </div>
        </div>
        <div class="subject-list-wrap__body-bottom">
          <div class="row">
            <div class="name">名字</div>
            <div class="answer" style="text-align: center;" @click="$router.push(`/subjectCorrect`)">答案</div>
            <div class="score">分数</div>
            <div class="error">错误率</div>
          </div>
          <div class="row" v-for="(item,index) in info.statStudentAnswer.stuAnswer" :key="index">
            <div class="name">{{getStudentName(item.students[0],$route.query.classId)}} <span class="red">{{rewardScore(item.students[0])}}</span></div>
            <div class="answer">
              <div v-html="item.text"></div>
              <div class="img-wrap" :class="[{img4: item.imgArr.length==4},{img56:item.imgArr.length>4}]" v-if="item.imgArr.length">
                <div v-for="(img,i) in item.imgArr" :key="i"><img :src="img" alt=""></div>
              </div>
              <div style="width: 100%;" v-if="item.audioArr.length">
                <video-player  class="video-player-box"
                               v-for="(audio,index) in item.audioArr" :key="index"
                               ref="videoPlayer"
                               :options="{ sources: [{type: 'audio/mp4',src: audio}],}"
                               :playsinline="true"
                               customEventName="customstatechangedeventname"
                               @play="onPlayerPlay($event)">
                </video-player>
              </div>
            </div>
            <div class="score">{{item.studentsNew[0].score || 0}}</div>
            <div class="error red">{{item.studentsNew[0].percent?(item.studentsNew[0].percent*100+'%'):'--'}}</div>
          </div>
        </div>
      </div>
    </analyse-wrap>

  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import 'video.js/dist/video-js.css'
  import {getExamItemDetail} from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  import { videoPlayer } from 'vue-video-player'
  export default {
    name: "subjectList",
    components: {analyseWrap,videoPlayer},
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
        list: [
          {name:'欧阳吉祥吉祥',answer:'题型讲解词语运用的题型为题运用的题型为题',score:'5分',error:'10%'},
          {name:'欧阳吉祥吉祥',answer:'题型讲解词语运用的题型为题运用的题型为题',score:'5分',error:'10%',add:'+5'},
          {name:'欧阳吉祥吉祥',answer:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3',score:'5分',error:'10%',add:'+5',type:'audio'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
          {name:'欧阳吉祥吉祥',answer:[require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png'),require('../../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
        ],
        tabList: JSON.parse(JSON.stringify(this.$route.query.questionList)),
        info: {examQuestionInfo: {}, statStudentAnswer: {stuAnswer: []}}
      }
    },
    created() {
      const {examId, groupId} = this.$route.query
      const index = this.tabList.findIndex(v => v.exam_id === examId)
      this.$set(this.tabList[index], 'active', true)
      this.getExamItemDetail(examId, groupId)
    },
    methods: {
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
      rewardScore(accountNo) {
        const score = this.$route.query.info.studentStatList.find(v => v.accountNo === accountNo).studentRewardScore
       return  score > 0 ? '+' + score : score
      },
      toggleTab(item) {
        if (item.active) return
        this.tabList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.getExamItemDetail(item.exam_id, item.group_id)
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
          if(res.flag) {
            res.data[0].statStudentAnswer.stuAnswer.forEach(v => {
              let dom = document.createElement('div')
              v.imgArr = []
              v.audioArr = []
              dom.innerHTML = v.answer
              if(v.answer) {
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
                dom.firstChild.className = 'ellipsis'
              }
              v.text = dom.outerHTML
            })
            this.info = res.data[0]
          }else {
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
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
<style lang="less" scoped>
  @deep: ~'>>>';
  .subject-list-wrap {
    background: #f5f5f5;
    .ellipsis {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
        margin-bottom: 10px;
        padding: 12px 15px;
        background: #fff;
        .detail {
          position: relative;
          &.fold{
            height: 45px;
            overflow: hidden;
          }
          .fold-btn {
            font-size: 14px;
            position: relative;
            width: 100%;
            bottom: -5px;
            left: 0;
            text-align: center;
            line-height: 40px;
            background: #fff;
            &.active {
              background: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 40%);
              position: absolute;
            }
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
          .score,.error {
            height: 24px;
            flex: 0 0 16%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .answer {
            flex: 1;
            /*display: flex;*/
            overflow: hidden;
            /*align-items: center;*/
            /*justify-content: center;*/
            text-align: left;
            .img-wrap {
              width: 100%;
              display: flex;
              >div {
                flex: 1;
                height: 56px;
                margin-right: 5px;
                &:last-child{
                  margin-right: 0;
                }
              }
              img {
                width: 100%;
                height: 100%;
              }
              &.img4 {
                flex-wrap: wrap;
                >div {
                  flex: 0 0 48%;
                  height: 25px;
                  margin-bottom: 5px;
                  &:nth-child(2n){
                    margin-right: 0;
                  }
                }
              }
              &.img56 {
                flex-wrap: wrap;
                >div {
                  flex: 0 0 31%;
                  height: 25px;
                  margin-bottom: 5px;
                  &:nth-child(3n){
                    margin-right: 0;
                  }
                }
              }
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
          &::after{
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
        .vjs-play-control{
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
              transform: translate(-50%,-50%);
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
            transform: translate(-50%,-50%);
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
