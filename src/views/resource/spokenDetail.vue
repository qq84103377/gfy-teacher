<template>
    <section class="spoken-detail">
      <van-nav-bar
        title="暗示健康的哈萨克积极思考阿萨德是啊十大"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="spoken-detail__body">
        <div class="pd10">一.单词跟读</div>
        <div class="spoken-detail__body__cell van-hairline--bottom" v-for="a in 10" :key="a">
          <video-player  class="video-player-box"
                         ref="videoPlayer"
                         :options="{ sources: [{type: 'audio/mp4',src: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'}],}"
                         :playsinline="true"
                         customEventName="customstatechangedeventname">
          </video-player>
          <div class="mgt15">askjdkalsdjlkajsdkladsjl</div>
          <div class="grey6 fs12 mgt15 aic"><i class="iconGFY icon-difficult"></i>&nbsp;困难</div>
        </div>
      </div>
    </section>
</template>

<script>
  import 'video.js/dist/video-js.css'

  import { videoPlayer } from 'vue-video-player'
  export default {
        name: "spokenDetail",
    components: {videoPlayer},
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .spoken-detail {
    display: flex;
    background: #f5f5f5;
    flex-direction: column;
    &__body {
      flex: 1;
      overflow-y: auto;
      background: #fff;
      &__cell {
        padding: 10px;
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
              display: none;
            }
            .vjs-duration {
              display: none;
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
                  width: 22px;
                  height: 22px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 14px;
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
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
              }
            }
            .vjs-progress-control {
              margin-left: 10px;
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
    }
  }
</style>
