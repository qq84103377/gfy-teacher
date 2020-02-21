<template>
  <section class="stu-exp-wrap">
    <div class="stu-exp-wrap__item" v-for="(item,index) in list" v-if="list.length" :key="index">
      <div class="stu-exp-wrap__item__content-wrap">
        <div class="stu-name"><span>{{getStudentName(item.appraiseAccountNo,classId)}}</span><span class="red">{{item.score || 0}}</span>
        </div>

        <div class="stu-answer">
          <div>
            <div v-html="item.text"></div>
            <div style="width: 100%;" v-if="item.audioArr&&item.audioArr.length">
              <!--            <video-player class="video-player-box"-->
              <!--                          v-for="(audio,index) in item.audioArr" :key="index"-->
              <!--                          ref="videoPlayer"-->
              <!--                          :options="{ sources: [{type: 'audio/mp4',src: audio}],}"-->
              <!--                          :playsinline="true"-->
              <!--                          customEventName="customstatechangedeventname">-->
              <!--            </video-player>-->
              <audio controls controlsList="nodownload" v-for="(audio,index) in item.audioArr" :key="index" :src="audio"></audio>
            </div>
            <div style="width: 100%;" v-if="item.videoArr&&item.videoArr.length">

              <video class="video-wrap" v-for="(s,index) in item.videoArr" webkit-playsinline playsinline x5-playsinline=""  poster="../assets/img/video-poster.png" @click='goVideoPage(s)' :src="s">
              </video>
            </div>
            <div class="img-wrap" :class="[{img4: item.imgArr.length==4},{img56:item.imgArr.length>4}]" v-if="item.imgArr&&item.imgArr.length">
              <div @click="imgCorrect(img,i,index)" v-for="(img,i) in item.imgArr" :key="i"><img :src="img" alt=""></div>
            </div>
          </div>

<!--          追加内容-->
          <div class="mgt10" v-for="append in item.pubAppendContentInfoList" :key="append.appendId">
            <div>{{append.appendTime}}追加</div>
            <div v-html="append.text"></div>
            <div style="width: 100%;" v-if="append.audioArr&&append.audioArr.length">
              <!--            <video-player class="video-player-box"-->
              <!--                          v-for="(audio,index) in item.audioArr" :key="index"-->
              <!--                          ref="videoPlayer"-->
              <!--                          :options="{ sources: [{type: 'audio/mp4',src: audio}],}"-->
              <!--                          :playsinline="true"-->
              <!--                          customEventName="customstatechangedeventname">-->
              <!--            </video-player>-->
              <audio controls controlsList="nodownload" v-for="(audio,index) in append.audioArr" :key="index" :src="audio"></audio>
            </div>
            <div style="width: 100%;" v-if="append.videoArr&&append.videoArr.length">

              <video class="video-wrap" v-for="(s,index) in append.videoArr" webkit-playsinline playsinline x5-playsinline=""  poster="../assets/img/video-poster.png" @click='goVideoPage(s)' :src="s">
              </video>
            </div>
            <div class="img-wrap" :class="[{img4: append.imgArr.length==4},{img56:append.imgArr.length>4}]" v-if="append.imgArr&&append.imgArr.length">
<!--              <div @click="imgCorrect(img,calImgIndex(index,item.imgArr.length,i),index)" v-for="(img,i) in append.imgArr" :key="i"><img :src="img" alt=""></div>-->
              <div @click="imgCorrect(img,item.imgArr.length + i,index)" v-for="(img,i) in append.imgArr" :key="i"><img :src="img" alt=""></div>
            </div>
          </div>
          <!--            <div class="ellipsis" v-else>{{item.answer}}</div>-->
        </div>

      </div>
      <div class="stu-exp-wrap__item__btn-group" :class="{disable:disable}">
        <div @click="handlePraise(item)" :class="{blue:item.good}"><i class="iconGFY icon-good"
                                                                      :class="{'icon-good-active':item.good}"></i>赞
        </div>
        <div @click="handleTop(item)" :class="{blue:item.topFlag === '1'}"><i class="iconGFY icon-top"
                                                                             :class="{'icon-top-active':item.topFlag === '1'}"></i>置顶
        </div>
        <div @click="handleEss(item)" :class="{red:item.essFlag === '1'}"><i class="iconGFY icon-essence"
                                                                                        :class="{'icon-essence-active':item.essFlag === '1'}"></i>精华
        </div>
        <div @click="handleScore(item,'T01')"><i class="iconGFY icon-circle-plus"></i>加分</div>
        <div @click="handleScore(item,'T02')"><i class="iconGFY icon-circle-sub"></i>减分</div>
        <div @click="handleComment(item)"><i class="iconGFY icon-talk"></i>评论</div>
      </div>
      <div class="stu-exp-wrap__item__good-group" v-if="item.praiseList.length"><i class="iconGFY icon-good-active mgr10"></i><span
        class="blue fs12" v-for="(p,pi) in item.praiseList" :key="pi">{{getStudentName(p.accountNo,classId)}}<span
        v-if="pi<item.praiseList.length-1" class="black">,</span></span></div>
      <div class="comment-wrap" v-if="item.showComment" >
        <van-field @focus="$emit('focus')" @blur="$emit('blur')" style="flex: 1" :border="false" clearable v-model.trim="item.comment" placeholder="请输入评论" />
        <van-button @click="$emit('comment',item.comment,item)" class="submit-btn" type="info">发表</van-button>
      </div>
      <div class="pd10 fs12 van-hairline--top" v-for="(rep,repIndex) in item.replyList" :key="repIndex">{{getStudentName(rep.replyAccount,classId)}}:
        {{rep.replyContent}}
      </div>
    </div>
    <div v-if="!list.length" class="empty-page">
      <img style="width: 70%;" src="../assets/img/empty-1.png" alt />
      <div>当前还没有{{isfEducation?'家长':'学生'}}完成任务,快去提醒{{isfEducation?'家长':'学生'}}完成任务吧!</div>
    </div>
  </section>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import {videoPlayer} from 'vue-video-player'
  import {getStudentName} from '@/utils/filter'

  export default {
    name: "stuExp",
    components: {videoPlayer},
    props: ['list', 'classId','isfEducation','disable'],
    computed: {
      getStudentName() {
        return getStudentName
      },
    },
    data() {
      return {
        comment: '',
      }
    },
    methods: {
      goVideoPage(url) {
        if (!url) return
        this.$router.push({ name: 'videoPage', query: { src: url} })
      },
      imgCorrect(item,imgIndex,stuIndex) {
        if(this.disable) return
        this.$router.push({name:'imgCorrect',params: {
            list:this.list,
            imgIndex,
            stuIndex,
            classId:this.classId,
            taskId: this.$route.query.taskId,
            termType: this.$route.query.termType
          }})
      },
      handlePraise(item) {
        if(this.disable) return
        this.$emit('praise',item)
      },
      handleTop(item) {
        if(this.disable) return
        this.$emit('top',item)
      },
      handleEss(item) {
        if(this.disable) return
        this.$emit('ess',item)
      },
      handleScore(item,type) {
        if(this.disable) return
        this.$emit('score',item,type)
      },
      handleComment(item) {
        if(this.disable) return
        this.$set(item,'showComment',!item.showComment)
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .stu-exp-wrap {
    overflow-x: hidden;
    &__item {
      border: 1px solid #eee;
      border-radius: 5px;
      margin-bottom: 10px;
      .comment-wrap {
        display: flex;
        align-items: center;
        .submit-btn {
          flex: 0 0 70px;
          border-radius: 5px;
          margin: 0 8px;
          line-height: 35px;
          height: 35px;
        }
      }

      &__content-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        font-size: 10px;

        .stu-name {
          flex: 0 0 76px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .stu-answer {

          flex: 1;
          margin-left: 10px;
          /*display: flex;*/
          overflow: hidden;
          /*align-items: center;*/
          /*justify-content: center;*/

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
          .video-wrap {
            height: 150px;
          }
        }


      }

      &__btn-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eee;

        > div {
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

          .icon-good, .icon-good-active {
            width: 15px;
            height: 15px;
          }
        }
        &.disable {
          >div{
            color: #999;
          }
        }
      }

      &__good-group {
        padding: 4px 10px;
        background: #E0FFFC;
        border-top: 1px solid #eee;
        word-break: break-all;
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
