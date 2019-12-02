<template>
  <div>
    <!-- <van-nav-bar :title="title" left-arrow @click-left="$router.back()" v-if='!isFullscreen' /> -->
    <div class="video-box">
      <!-- <van-nav-bar :title='title' left-arrow @click-left="full" class="title-full" v-show='isShowControl' v-if='isFullscreen'> -->
      <van-nav-bar :title='title' left-arrow @click-left="$router.back()" class="title-full" v-show='isShowControl' v-if='isFullscreen'>
      </van-nav-bar>

      <video v-if='!isMp3' class="video" ref="video" webkit-playsinline playsinline x5-playsinline="" :src="initVideo.url" @pause="handPlay(2,2)" @play="handPlay(2,1)" @loadedmetadata="getAudioLength(2)" @timeupdate="videoTimeUpdate" @click="clickVideo">
      </video>

      <img v-else src="https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/picture/201910/icon-mp3.png" alt="">

      <div class="video_control" data-way='0' v-show='isShowControl' v-if='!isFullscreen'>
        <div class="progress">
          <van-icon v-if='!initVideo.play' name="play" color='#fff' class="icon-play" @click.native="playVideo" />

          <van-icon v-else name="pause" color='#fff' class="icon-play" @click.native="playVideo" />

          <span class="time-num">{{initVideo.currentTime | videoTime}}</span>
          <!-- //进度条 -->
          <van-slider v-model="initVideo.currentTime" :step='0.01' :max='initVideo.videoLength' class="percentage" @change="changeVideoTime" />
          <!-- //videoLength 总时间，currentTime 当前时间，videoTime 自定义过滤器 -->
          <span class="time-num">{{initVideo.videoLength | videoTime}}</span>

          <!-- <img class="fullscreen" src="../../assets/img/quanpin.png" alt="" @click="full"> -->
          <!-- <van-icon name="coupon-o" color='#fff' class="icon-play fullscreen" @click.native="full" /> -->
        </div>
      </div>

      <div class="video_control-full" data-way='0' v-show='isShowControl' v-if='isFullscreen'>
        <div class="progress">
          <van-icon v-if='!initVideo.play' name="play" color='#fff' class="icon-play" @click.native="playVideo" />

          <van-icon v-else name="pause" color='#fff' class="icon-play" @click.native="playVideo" />

          <span class="time-num">{{initVideo.currentTime | videoTime}}</span>
          <!-- //进度条 -->
          <van-slider v-model="initVideo.currentTime" :step='0.01' @change="changeVideoTime" :max='initVideo.videoLength' class="percentage" />
          <!-- //videoLength 总时间，currentTime 当前时间，videoTime 自定义过滤器 -->
          <span class="time-num">{{initVideo.videoLength | videoTime}}</span>

          <!-- <img class="fullscreen" src="../../assets/img/quanpin.png" alt="" @click="full"> -->
          <!-- <van-icon name="coupon-o" color='#fff' class="icon-play fullscreen" @click.native="full" /> -->
        </div>
      </div>

      <div class="video_control-full true" data-way='0' v-show='isShowControl&&isIphone00' v-if='isFullscreen00'>
        <div class="progress">
          <van-icon v-if='!initVideo.play' name="play" color='#fff' class="icon-play" @click.native="playVideo" />

          <van-icon v-else name="pause" color='#fff' class="icon-play" @click.native="playVideo" />

          <span class="time-num">{{initVideo.currentTime | videoTime}}</span>
          <!-- //进度条 -->
          <van-slider v-model="initVideo.currentTime" :step='0.01' @change="changeVideoTime" :max='initVideo.videoLength' :disabled='true' class="percentage" />
          <!-- //videoLength 总时间，currentTime 当前时间，videoTime 自定义过滤器 -->
          <span class="time-num">{{initVideo.videoLength | videoTime}}</span>

          <img class="fullscreen" src="../../assets/img/quanpin.png" alt="" @click="full">
          <!-- <van-icon name="coupon-o" color='#fff' class="icon-play fullscreen" @click.native="full" /> -->
        </div>
      </div>

      <div class="forword-box" v-show='isFullscreen&&isIphone00' v-if='isMove'>
        <span>{{initVideo.currentTime | videoTime}}/{{initVideo.videoLength|videoTime}}</span>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from "vuex";
let startx, starty, curLength;

//获得角度
function getAngle(angx, angy) {
  return Math.atan2(angy, angx) * 180 / Math.PI;
};

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }



  return result;
}

export default {
  name: 'videoPage',
  data() {
    return {
      title: this.$route.query.title,
      isFullscreen: false,
      initVideo: {
        play: false,//播放还是暂停 true播放中
        videoLength: 3600,//时长
        url: this.$route.query.src,//视频课件Url
        // url: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201908/20190806041747_W4rnD_4.1使用-http查询MySQL数据.mp4',//视频课件Url
        currentTime: 0,//当前播放时间
        lastTime: null,//标记时间戳
        name: "",
      },
      isShowControl: true,
      timeID: '', // 标题控制条
      // mql: window.matchMedia("(orientation: portrait)"),
      isLandscape: false,
      showMore: false,
      isMove: false,
      isIphone: false,
      isMp3: this.$route.query.isMp3,
      isEnd: 0
    }
  },
  computed: {
    ...(mapState({
      fullscreen: state => state.setting.fullscreen,
    })),
  },
  watch: {
    fullscreen(nv, ov) {
      console.log('fullscreen');
      console.log(nv, 'fullscreen nv');
      console.log(ov, 'fullscreen ov');
      return
      if (nv == false) {
        console.log(this.isFullscreen, "this.isFullscreen");
        // if (this.isFullscreen == false && this.isApp) {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.webkitExitFullScreen) {
          document.webkitExitFullScreen()
        }
        this.isFullscreen = false

        if (this.isIphone) {
          console.log('苹果设备');

          var docHtml = document.documentElement;
          var docBody = document.body;
          var videobox = document.querySelector('.video-box');
          docHtml.style.cssText = "";
          docBody.style.cssText = "";
          videobox.style.cssText = "";
        } else {
          screen.orientation.unlock()
          var videobox = document.querySelector('.video-box');
          videobox.style.cssText = "";
        }

        // }
      }
    },
  },
  created() {
    this.isFullscreen = true
    screen.orientation.lock('landscape')
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.video) {
        this.$refs.video.play()
      }
    }, 0);
    // var mql = window.matchMedia("(orientation: portrait)");
    // function onMatchMeidaChange(mql) {
    //   if (mql.matches) {
    //     // 竖屏
    //     console.log("竖屏");
    //     that.isFullscreen = false
    //   } else {
    //     // 横屏
    //     console.log("横屏");
    //     that.isFullscreen = true
    //   }
    // }
    const that = this

    window.addEventListener('resize', this.handleResize)

    return

    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      console.log('苹果设备');
      this.isIphone = true

      let fullBox = document.querySelector('.video-box')

      //手指接触屏幕
      fullBox.addEventListener("touchstart", function (e) {
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
        curLength = that.initVideo.currentTime

      }, false);
      fullBox.addEventListener("touchmove", function (e) {
        var movex, movey
        movex = e.touches[0].pageX;
        movey = e.touches[0].pageY;
        if (that.isFullscreen) {
          that.isMove = true
          if (that.$refs.video) {
            that.$refs.video.pause()
          }
        }
        var direction = getDirection(startx, starty, movex, movey);
        switch (direction) {
          case 0:
            console.log("未滑动！");
            break;
          case 1:
            if (that.isFullscreen) {
              console.log("向上！")
              let changelength = movey - starty
              console.log(changelength, 'changelength');
              that.initVideo.currentTime = curLength + parseInt(changelength / 2)
              if (that.initVideo.currentTime <= 0) {
                that.initVideo.currentTime = 0
              }
              if (that.initVideo.currentTime > that.initVideo.videoLength) {
                that.initVideo.currentTime = that.initVideo.videoLength - 5
              }

            }

            break;
          case 2:
            if (that.isFullscreen) {
              console.log("向下！")
              let changelength = movey - starty
              console.log(changelength, 'changelength');
              that.initVideo.currentTime = curLength + parseInt(changelength / 2)
              if (that.initVideo.currentTime <= 0) {
                that.initVideo.currentTime = 0
              }
              if (that.initVideo.currentTime > that.initVideo.videoLength) {
                that.initVideo.currentTime = that.initVideo.videoLength - 5
              }

            }
            break;
          case 3:
            console.log("向左！")
            break;
          case 4:
            console.log("向右！")
            break;
          default:
        }

      }, false);
      //手指离开屏幕
      fullBox.addEventListener("touchend", function (e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        if (that.isFullscreen) {
          that.isMove = false
          if (that.$refs.video) {
            that.$refs.video.play()
          }
        }
        switch (direction) {
          case 0:
            console.log("未滑动！");
            break;
          case 1:
            if (that.isFullscreen) {
              console.log("向上！")

              // let changelength = endy - starty
              // console.log(changelength, 'changelength');
              // that.initVideo.currentTime = that.initVideo.currentTime + parseInt(changelength /2)
              // if (that.initVideo.currentTime <= 0) {
              //   that.initVideo.currentTime = 0
              // }
              // if (that.initVideo.currentTime > that.initVideo.videoLength) {
              //   that.initVideo.currentTime = that.initVideo.videoLength - 5
              // }
              if (that.$refs.video) {
                that.$refs.video.currentTime = that.initVideo.currentTime;
              }
            }
            break;
          case 2:
            if (that.isFullscreen) {
              console.log("向下！")

              // let changelength = endy - starty
              // console.log(changelength, 'changelength');
              // that.initVideo.currentTime = that.initVideo.currentTime + parseInt(changelength /2)
              // if (that.initVideo.currentTime <= 0) {
              //   that.initVideo.currentTime = 0
              // }
              // if (that.initVideo.currentTime > that.initVideo.videoLength) {
              //   that.initVideo.currentTime = that.initVideo.videoLength - 5
              // }
              if (that.$refs.video) {
                that.$refs.video.currentTime = that.initVideo.currentTime;
              }
            }

            break;
          case 3:
            console.log("向左！")
            break;
          case 4:
            console.log("向右！")
            break;
          default:
        }
      }, false);

    }
    // this.onMatchMeidaChange(this.mql);
    // this.mql.addListener(this.onMatchMeidaChange);
  },
  deactivated() {

    // this.mql.removeListener(this.onMatchMeidaChange);
  },
  beforeDestroy() {
    screen.orientation.unlock()
    window.removeEventListener('resize', this.handleResize)
  },
  filters: {
    videoTime(value) {
      if (isNaN(value)) {
        return "00:00"
      }
      var timeStr = parseInt(value);
      // console.log(timeStr, 'timeStr');
      var minute = parseInt(timeStr / 60);
      if (minute == 0) {
        if (timeStr < 10) {
          timeStr = "0" + timeStr;
        }
        return minute = "00:" + timeStr;
      } else {
        var timeStr = timeStr % 60;
        if (timeStr < 10) {
          timeStr = "0" + timeStr;
        }
        minute = minute >= 10 ? minute : "0" + minute
        return minute = minute + ":" + timeStr;
      }
    }
  },
  methods: {
    // onMatchMeidaChange(mql) {
    //   if (mql.matches) {
    //     // 竖屏
    //     console.log("竖屏");

    //     this.isLandscape = false
    //   } else {
    //     // 横屏
    //     console.log("横屏");

    //     this.isLandscape = true
    //   }
    // },
    handleResize() {
      var videobox = document.querySelector('.video-box');
      console.log(window.document.body.offsetWidth, window.document.body.offsetHeight, window.document.body.clientWidth, window.document.body.clientHeight);
      videobox.style.width = window.document.body.offsetWidth + "px"
      videobox.style.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0) + "px"

    },
    playVideo() {//播放视频

      if (this.initVideo.play) {
        this.isPlay = false
        this.$refs.video.pause();
        clearTimeout(this.timeID)
        this.isShowControl = true

      } else {
        this.isPlay = true
        if (!this.initVideo.url) return

        this.$nextTick(() => {
          if (this.$refs.video) {
            this.$refs.video.play()
          }

          if (this.isShowControl) {
            this.timeID = setTimeout(() => {
              this.isShowControl = false
            }, 4000)
          }

          this.$refs.video.muted = false
        })

      }
    },
    handPlay(type, status) {//音视频播放暂停 type:1 音频 2视频 status 1播放 2暂停
      if (type == 1) {
        status == 1 ? this.initAudio.play = true : this.initAudio.play = false;
      } else {
        if (status == 1) {
          this.initVideo.play = true
          this.isPlay = true
        } else {
          this.initVideo.play = false;
          this.isPlay = false
        }
      }
    },
    getAudioLength(type) {//获取音视频时长 1音频 2视频
      if (type == 1) {
        if (!isNaN(this.audio.duration)) {
          this.initAudio.audioLength = this.$refs.audio.duration
        }
        console.log('获取音频时长', this.$refs.audio.duration)
      }
      if (type == 2) {
        if (this.$refs.video) {
          if (!isNaN(this.$refs.video.duration)) {
            this.initVideo.videoLength = this.$refs.video.duration
          }
          console.log('获取视频时长', this.$refs.video.duration)
        }
        console.log('获取视频时长')
      }
    },
    videoTimeUpdate() {//更新视频时间。节流，每秒触发一次
      console.log("videoTimeUpdate");
      if (this.$refs.video) {
        if (!isNaN(this.$refs.video.currentTime)) {
          this.initVideo.currentTime = this.$refs.video.currentTime
        }
        if (this.$refs.video.ended) {
          this.isEnd++
          if (this.isEnd == 1) {
            if (this.isFullscreen) {
              this.$router.back()
              // this.full()
            } else {
              this.$router.back()
            }
          }
        }
      }
    },
    changeVideoTime(val) {//改变视频时间
      console.log(val, 'video')
      if (this.$refs.video) {
        this.$refs.video.currentTime = val;
      }
    },
    clickVideo() {
      console.log('clickVideo')
      clearTimeout(this.timeID)
      if (this.isShowControl) {
        this.isShowControl = false
      } else {
        this.isShowControl = true
        if (this.isPlay) {
          this.timeID = setTimeout(() => {
            this.isShowControl = false
          }, 4000)
        }
      }
    },
    full() {
      // if (window.orientation == 180 || window.orientation == 0) {
      //   // alert("竖屏");
      //   console.log("竖屏");
      //   this.isFullscreen = false
      // }
      // if (window.orientation == 90 || window.orientation == -90) {
      //   // alert("横屏");
      //   console.log("横屏");
      //   this.isFullscreen = true
      // }

      if (!this.isFullscreen) {
        if (!this.isPlay) {
          if (this.$refs.video) {
            this.$refs.video.play()
            this.timeID = setTimeout(() => {
              this.isShowControl = false
            }, 4000)
          }
        }



        var ele = document.querySelector('.video-box')
        if (ele.requestFullscreen) {
          console.log('ele.requestFullscreen()');
          ele.requestFullscreen()
        } else if (ele.mozRequestFullScreen) {
          console.log("ele.mozRequestFullScreen()");
          ele.mozRequestFullScreen()
        } else if (ele.webkitRequestFullScreen) {
          //安卓微信
          console.log('ele.webkitRequestFullScreen()');
          ele.webkitRequestFullScreen()
        } else {
          console.log('全屏进入else');
        }

        ele.style.position = 'relative'
        ele.style.top = 0
        ele.style.transform = "translateY(0)"

        function horizontalScreen(className) {
          // document.querySelector(className).style.marginTop = 0
          // document.querySelector(className).style.transform = ""
          // transform 强制横屏
          var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

          document.querySelector(className).style.transform = "rotate(90deg) translate(" + ((conH - conW) / 2) + "px," + ((conH - conW) / 2) + "px)"
          document.querySelector(className).style.width = conH + "px"
          document.querySelector(className).style.height = conW + "px"
          document.querySelector(className).style.transformOrigin = "center center"
          document.querySelector(className).style.webkitTransformOrigin = "center center"
          document.querySelector(className).style.zIndex = '9999999999'
          // if (document.querySelector("video")) {
          //   document.querySelector("video").style.zIndex = '100'
          // }

          console.log(conW, 'conW');
          console.log(conH, 'conH');
          console.log(document.documentElement, 'document.documentElement');

          var max = conW > conH ? conW : conH;
          var min = conW > conH ? conH : conW;
          document.querySelector(className).style.width = max + "px";
          document.querySelector(className).style.height = min + "px";

        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          console.log('苹果设备');
          horizontalScreen('.video-box')
        } else {
          screen.orientation.lock('landscape')
        }
        this.isFullscreen = true
        console.log(this.isFullscreen, "进去全屏的isFullscreen");

        setTimeout(() => {
          if (this.$refs.video) {
            this.$refs.video.play()
          }
        }, 0);

      } else {


        if (document.cancelFullScreen) {
          console.log('document.cancelFullScreen()');
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          console.log('document.mozCancelFullScreen()');
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          console.log('document.webkitCancelFullScreen()');
          //安卓微信
          document.webkitCancelFullScreen();
        } else if (document.webkitExitFullScreen) {
          console.log('document.webkitExitFullScreen()');
          document.webkitExitFullScreen()
        } else {
          console.log('退出全屏进入else');
        }

        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          console.log('苹果设备');

          var docHtml = document.documentElement;
          var docBody = document.body;
          var videobox = document.querySelector('.video-box');
          docHtml.style.cssText = "";
          docBody.style.cssText = "";
          videobox.style.cssText = "";
        } else {
          screen.orientation.unlock()
          var videobox = document.querySelector('.video-box');
          videobox.style.cssText = "";
        }

        this.isFullscreen = false
        console.log(this.isFullscreen, "退出全屏的isFullscreen");
        this.$router.back()
      }

    },
  },
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.video-box {
  width: 100%;
  height: 120px;
  background: #eeeeee;
  // position: relative;
  position: absolute;
  // top: 50%;
  // // margin-top: 50%;
  // transform: translateY(-50%);
  // overflow: hidden;
  .forword-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 100px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #e9e8e8;
    z-index: inherit;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .title-full {
    visibility: 1;
    opacity: 1;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 555 !important;
    height: 20px !important;
    line-height: 20px !important;
    transform: translate3d(0%, 0%, 0);
    .van-nav-bar__title {
      font-size: 10px !important;
    }
    .btn-share {
      width: 15px;
      height: 15px;
    }
  }
  .van-nav-bar {
    background-color: rgba(0, 0, 0, 0.3);
    height: 40px;
    line-height: 40px;
    width: 100%;
    position: absolute;
    z-index: 9999999999999;

    .van-icon {
      color: #fff;
      font-size: 16px;
    }

    .van-nav-bar__title {
      color: #fff;
      font-size: 16px;
    }

    .van-nav-bar__text {
      color: #fff;
      font-size: 14px;
    }

    .van-nav-bar__right {
      .van-icon-cart-o {
        font-size: 20px;
      }

      .van-icon-ellipsis {
        font-size: 20px;
        margin-left: 20px;
        transform: rotateZ(90deg);
      }
    }

    &[class*="van-hairline"]:after {
      border-color: transparent;
    }
  }
}
.video {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
.video_control {
  position: absolute;
  height: 40px;
  // top: 240px;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 555 !important;
  .progress {
    height: 100%;
    padding: 0 5px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .percentage {
    margin-left: 5px;
    margin-right: 5px;
    width: 55%;
    // flex: 1;
  }
  .time-num {
    color: #fff;
  }
  .icon-play {
    width: 25px;
    height: 25px;
    font-size: 25px;
  }
  .fullscreen {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
}
.video_control-full {
  position: absolute;
  height: 20px;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 555 !important;
  transform: translate3d(0%, 0%, 0);

  .progress {
    height: 100%;
    padding: 0 8px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .time-num {
    font-size: 10px;
    color: #fff;
  }
  .percentage {
    margin-left: 2px;
    margin-right: 2px;
    width: 55%;
    // flex: 1;
  }
  .icon-play {
    width: 15px;
    height: 15px;
    font-size: 15px;
  }
  .fullscreen {
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
  @{deep} .van-slider__button {
    width: 10px;
    height: 10px;
  }
  @{deep} .van-slider--disabled {
    opacity: 1 !important;
  }
}
</style>