<template>
  <section class="spoken-detail">
    <van-nav-bar
      :title="info.spokenTitle"
      @click-left="goBack"
      left-arrow>
    </van-nav-bar>
    <div class="spoken-detail__body">
      <div class="pd10">{{spokenType}}</div>
      <div class="spoken-detail__body__cell van-hairline--bottom" v-for="(item,index) in info.spokenSplitSentenceList" :key="index">
<!--        <video-player class="video-player-box"-->
<!--                      ref="videoPlayer"-->
<!--                      :options="{ sources: [{type: 'audio/mp4',src: item.referenceAnswer}],}"-->
<!--                      :playsinline="true"-->
<!--                      customEventName="customstatechangedeventname">-->
<!--        </video-player>-->
        <audio controls controlsList="nodownload" :src="item.referenceAnswer"></audio>
        <div class="mgt15">{{index + 1}}、{{item.sentenceContent}}</div>
        <div class="mgt15">{{item.referenceExplain}}</div>
        <div class="grey6 fs12 mgt15 aic jcsb">
          <div class="aic"><i class="iconGFY icon-difficult"></i>&nbsp;{{info.spokenDegree==='D01'?'容易':info.spokenDegree==='D02'?'中等':'困难'}}</div>
<!--          <div class="del-btn">移除</div>-->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import {
    getSpokenResourceSingle,
    getSysDictList,
  } from '@/api/index'
  import {videoPlayer} from 'vue-video-player'

  export default {
    name: "spokenDetail",
    components: {videoPlayer},
    data() {
      return {
        info: {spokenSplitSentenceList:[],spokenDegree:''},
        spokenType: ''
      }
    },
    methods: {
       goBack(){
          this.common.goBack(this)
        },
     async getDetail() {
        let obj = {
          "spokenId": this.$route.query.spokenId,
          "belongSchoolId": this.$store.getters.schoolId,
          "courseId": this.$route.query.sysCourseId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       await getSpokenResourceSingle(params).then(res => {
            if(res.flag) {
              this.info = res.data[0]
            }else {
              this.$toast(res.msg)
            }
        })
      },
      getDict() {
        let obj = {"interUser":"123","interPwd":"123","dictCode":"Domain_Spoken_Type"}
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSysDictList(params).then(res => {
          if(res.flag && res.data.length) {
           this.spokenType = res.data[0].sysDictInfoList.find(v => v.dictKey === this.info.spokenType).dictValue
          }
        })
      }
    },
    async created() {
     await this.getDetail()
      this.getDict()
    }
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

        .del-btn {
          width: 63px;
          line-height: 22px;
          border-radius: 10px;
          border: 1px solid @blue;
          color: @blue;
          font-size: 12px;
          text-align: center;
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

            .vjs-play-control {
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
                  transform: translate(-50%, -50%);
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
                transform: translate(-50%, -50%);
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
