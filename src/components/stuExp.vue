<template>
    <section class="stu-exp-wrap">
      <div class="stu-exp-wrap__item" v-for="(item,index) in list" :key="index">
        <div class="stu-exp-wrap__item__content-wrap">
          <div class="stu-name">{{item.name}}<span class="red">{{item.score}}</span></div>
<!--          <div class="stu-answer">题型讲解词语运用的题型为题...题型讲解词语运用的题型为题.题型讲解词语运用 的题型为题题型讲解词语型为题.为题题型讲解词语型为为题题型讲解词语型为为题题型讲解词语型为</div>-->

          <div class="stu-answer">
            <div class="img-wrap" @click="$router.push(`/imgCorrect`)" :class="[{img4: item.answer.length==4},{img56:item.answer.length>4}]" v-if="item.type=='img'">
              <div v-for="(img,i) in item.answer" :key="i"><img :src="img" alt=""></div>
            </div>
            <div style="width: 100%;" v-else-if="item.type=='audio'">
              <video-player  class="video-player-box"
                             ref="videoPlayer"
                             :options="{ sources: [{type: 'audio/mp4',src: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'}],}"
                             :playsinline="true"
                             customEventName="customstatechangedeventname">
              </video-player>
            </div>
            <div style="width: 100%;" v-else-if="item.type=='video'">
              <video style="width: 100%;" controls :src="item.answer"></video>
            </div>
            <div class="ellipsis" v-else>{{item.answer}}</div>
          </div>

        </div>
        <div class="stu-exp-wrap__item__btn-group">
          <div @click="$set(item,'good',!item.good)" :class="{blue:item.good}"><i class="iconGFY icon-good" :class="{'icon-good-active':item.good}"></i>赞</div>
          <div @click="$set(item,'top',!item.top)" :class="{blue:item.top}"><i class="iconGFY icon-top" :class="{'icon-top-active':item.top}"></i>置顶</div>
          <div @click="$set(item,'essence',!item.essence)" :class="{red:item.essence}"><i class="iconGFY icon-essence" :class="{'icon-essence-active':item.essence}"></i>精华</div>
          <div><i class="iconGFY icon-circle-plus"></i>加分</div>
          <div><i class="iconGFY icon-circle-sub"></i>减分</div>
          <div><i class="iconGFY icon-talk"></i>评论</div>
        </div>
        <div class="stu-exp-wrap__item__good-group"><i class="iconGFY icon-good-active"></i><span class="blue fs12" v-for="a in 10" :key="a">李露露<span v-if="a<10" class="black">,</span></span></div>
        <div class="pd10 fs12 van-hairline--top">评论: 阿斯加德看哈加快速度很骄傲山东黄金阿克苏的哈会计师</div>
      </div>
    </section>
</template>

<script>
  import 'video.js/dist/video-js.css'

  import { videoPlayer } from 'vue-video-player'
    export default {
        name: "stuExp",
      components: {videoPlayer},
      data() {
          return {
            list: [
              {name:'欧阳吉祥吉祥',answer:'题型讲解词语运用的题型为题运用的题型为题',score:'5分',error:'10%'},
              {name:'欧阳吉祥吉祥',answer:'题型讲解词语运用的题型为题运用的题型为题',score:'5分',error:'10%',add:'+5'},
              {name:'欧阳吉祥吉祥',answer:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3',score:'5分',error:'10%',add:'+5',type:'audio'},
              {name:'欧阳吉祥吉祥',answer:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718090841_X3NZH_测试.MP4',score:'5分',error:'10%',add:'+5',type:'video'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
              {name:'欧阳吉祥吉祥',answer:[require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png'),require('../assets/img/banner.png')],score:'5分',error:'10%',add:'+5',type:'img'},
            ]
          }
      }
    }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .stu-exp-wrap {
    &__item {
      border: 1px solid #eee;
      border-radius: 5px;
      &__content-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        font-size: 10px;
        .stu-name {
          flex: 0 0 76px;
          text-align: center;
        }
        .stu-answer {
          flex: 1;
          margin-left: 10px;
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
      &__btn-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eee;
        >div {
          flex: 1;
          color: #666;
          font-size: 14px;
          line-height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          .iconGFY {
            margin-right: 3px;
          }
          .icon-good,.icon-good-active {
            width: 15px;
            height: 15px;
          }
        }
      }
      &__good-group {
        padding: 4px 10px;
        background: #E0FFFC;
        border-top: 1px solid #eee;
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
