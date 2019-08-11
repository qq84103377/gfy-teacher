<template>
  <section class="subject-list-wrap">
    <analyse-wrap>
      <div class="scroll-tab" slot="tab">
        <div class="scroll-tab__item" v-for="a in 15" :key="a">{{a}}</div>
      </div>
      <div class="subject-list-wrap__body">
        <div class="subject-list-wrap__body-top">
          <div class="aic fs16">
            <div :class="{'ellipsis':fold}">山lǎng  rùn（ ）起来了，水涨起来了，太阳的脸红起来了阳的脸红起来了阳的脸红起来了。</div>
            <div v-if="fold" @click="fold = !fold" class="blue" style="flex: 0 0 20%;text-align: right">展开原题</div>
          </div>
          <div class="fs14" v-show="!fold">
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>正确答案: <span class="blue">A</span></div>
            <div>答案解析:</div>
            <div>【题型讲解】词语运用的题型为选择题，主要有两种命题形式：一是判断词语运用的对.</div>
          </div>
          <div @click="fold = !fold" v-show="!fold" class="blue fs14" style="text-align: right">收起</div>
        </div>
        <div class="subject-list-wrap__body-bottom">
          <div class="row">
            <div class="name">名字</div>
            <div class="answer" @click="$router.push(`/subjectCorrect`)">答案</div>
            <div class="score">分数</div>
            <div class="error">错误率</div>
          </div>
          <div class="row" v-for="(item,index) in list" :key="index">
            <div class="name">{{item.name}} <span class="red">{{item.add}}</span></div>
            <div class="answer">
              <div class="img-wrap" :class="[{img4: item.answer.length==4},{img56:item.answer.length>4}]" v-if="item.type=='img'">
                <div v-for="(img,i) in item.answer" :key="i"><img :src="img" alt=""></div>
              </div>
              <div style="width: 100%;" v-else-if="item.type=='audio'">
                <video-player  class="video-player-box"
                               ref="videoPlayer"
                               :options="{ sources: [{type: 'audio/mp4',src: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'}],}"
                               :playsinline="true"
                               customEventName="customstatechangedeventname"
                               @play="onPlayerPlay($event)">
                </video-player>
              </div>
              <div class="ellipsis" v-else>{{item.answer}}</div>
            </div>
            <div class="score">{{item.score}}</div>
            <div class="error red">{{item.error}}</div>
          </div>
        </div>
      </div>
    </analyse-wrap>

  </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
  import 'video.js/dist/video-js.css'

  import { videoPlayer } from 'vue-video-player'
  export default {
    name: "subjectList",
    components: {analyseWrap,videoPlayer},
    mounted() {
      console.log(window);
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
        ]
      }
    },
    methods: {
      onPlayerPlay(e) {
        console.log(this.$refs['videoPlayer']);
        console.log(document.getElementsByClassName('vjs-progress-control')[0].style);
        // window.getComputedStyle(document.getElementsByClassName('vjs-progress-control')[0], ":before").content = '666'
        // window.getComputedStyle(document.getElementsByClassName('vjs-progress-control')[0], ":before").color = '#000'
      }
    }
  }
</script>

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
            display: flex;
            overflow: hidden;
            align-items: center;
            justify-content: center;
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
