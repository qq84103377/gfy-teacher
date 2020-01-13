<template>
  <section class="img-correct-wrap bigbox">
    <i v-if="!isPen&&!isRubber&&(currentImgIndex>0)" class="iconGFY icon-circle-arrow" @click="toggle(0)"></i>
    <i v-if="!isPen&&!isRubber&&(currentImgIndex<imgArr.length-1)" class="iconGFY icon-circle-arrow rotate" @click="toggle(1)"></i>
    <div class="img-correct-wrap__header" v-show="!isPen&&!isRubber">
      <van-icon @click="$router.back()" name="arrow-left" />
      <span>{{getStudentName(list[stuIndex].appraiseAccountNo,classId)}}</span>
      <span>{{currentImgIndex + 1}}/{{imgArr.length}}</span>
      <i class="iconGFY icon-rotate-left" @click="rotateLeft"></i>
      <i class="iconGFY icon-rotate-right" @click="rotateRight"></i>
      <i @click="isPen=!isPen;isRubber=false" class="iconGFY icon-pen-white" :class="{'icon-pen-active':isPen}"></i>
      <div @click="handlePraise" class="aic" :class="{yellow:list[stuIndex].good}"><i class="iconGFY icon-good-white" :class="{'icon-good-active':list[stuIndex].good}"></i>赞
      </div>
      <div @click="handleTop" class="aic" :class="{blue:list[stuIndex].topFlag === '1'}"><i class="iconGFY icon-top-white icon__land" :class="{'icon-top-active':list[stuIndex].topFlag === '1'}"></i>置顶
      </div>
      <div @click="handleEss" class="aic" :class="{red:list[stuIndex].essFlag === '1'}"><i class="iconGFY icon-essence-white icon__land" :class="{'icon-essence-active':list[stuIndex].essFlag === '1'}"></i>精华
      </div>
      <div class="aic" @click="handleScore('T01')"><i class="iconGFY icon-circle-plus-white"></i>加分</div>
      <div class="aic" @click="handleScore('T02')"><i class="iconGFY icon-circle-sub-white"></i>减分</div>
      <div class="aic" @click="commentShow=true"><i class="iconGFY icon-talk-white"></i>评论</div>
    </div>
    <div class="img-correct-wrap__bottom">
      <i @click="isPen=true;isRubber=false" class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i @click="isRubber=true;isPen=false" class="iconGFY icon-rubber" :class="{'icon-rubber-active':isRubber}"></i>
      <i class="iconGFY icon-save" @click="save"></i>
      <i class="updo" @click="upDo">
        <img src="../../assets/img/updo.png" alt="">
      </i>
      <van-icon class="close" name="cross" @click="isPen=false;isRubber=false"></van-icon>
    </div>
    <div v-show="!isPen&&!isRubber" class="img-correct-wrap__swipe">
      <div v-for="(item,index) in imgArr" :key="index" class="img-correct-wrap__swipe-item" @click="selectImg(item)">
        <div class="img-wrap">
          <img :class="{active:item.active}" :src="item.src" alt="">
          <span :class="{active:item.active}">{{index + 1}}</span>
        </div>
        <div>{{getStudentName(item.accountNo,classId)}}</div>
      </div>
    </div>
    <draw-board ref="drawBoard" @submitCb="submitCb" :isPen="isPen" :isRubber="isRubber" :imgUrl="imgArr[currentImgIndex].src" @changeImg='toggle'></draw-board>

    <van-dialog v-model="commentShow" :show-confirm-button="false">
      <div class="comment-dialog">
        <div class="comment-dialog__header">评论</div>
        <div class="comment-dialog__body">

          <textarea v-model="comment" placeholder="请输入评论" rows="4"></textarea>
        </div>
        <div class="comment-dialog__footer van-hairline--top">
          <van-button class="cancel" @click="commentShow=false;comment=''">取消</van-button>
          <van-button class="confirm" type="info" @click="handleComment">确定</van-button>
        </div>
      </div>
    </van-dialog>

  </section>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import drawBoard from '../../components/drawBoard'
import { getStudentName } from '@/utils/filter'
import {
  delPraise,
  addPraise,
  untopAppraise,
  topAppraise,
  unessAppraise,
  essAppraise,
  saveRewardScore,
  addReply
} from '@/api/index'

export default {
  name: "imgCorrect",
  data() {
    return {
      isPen: false,
      isRubber: false,
      isGood: false,
      isTop: false,
      essence: false,
      commentShow: false,
      comment: '',
      list: JSON.parse(JSON.stringify(this.$route.params.list)),
      imgArr: this.$route.params.list.reduce((t, v, si) => {
        v.imgArr.forEach((img, i) => {
          t.push({
            src: img,
            accountNo: v.appraiseAccountNo,
            active: si == this.$route.params.stuIndex && i == this.$route.params.imgIndex
          })
        })
        return t
      }, []),
      stuIndex: this.$route.params.stuIndex,
      imgIndex: this.$route.params.imgIndex,
      classId: this.$route.params.classId,
    }
  },
  created() {
    screen.orientation.lock('landscape')

  },
  mounted() {
    console.log(this.imgArr, 'imgArrimgArr');
    console.log("11111")
    // horizontalScreen(".bigbox")
    function horizontalScreen(className) {
      // transform 强制横屏
      var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // transform: rotate(90deg); width: 667px; height: 375px;transform-origin:28% 50%;
      //var iosTopHe = 0;//若有其他样式判断，写于此

      document.querySelector(className).style.transform = "rotate(90deg) translate(" + ((conH - conW) / 2) + "px," + ((conH - conW) / 2) + "px)"
      document.querySelector(className).style.width = conH + "px"
      document.querySelector(className).style.height = conW + "px"
      document.querySelector(className).style.transformOrigin = "center center"
      document.querySelector(className).style.webkitTransformOrigin = "center center"
      // document.querySelector(className).style.zIndex = '999999999999'
      // document.querySelector(className).style.position = 'absolute'
      document.querySelector(className).style.position = 'static'

      // console.log(document.querySelector(".video"), 'document.querySelector(".video")');
      // if (document.querySelector(".video")) {
      //   document.querySelector(".video").style.zIndex = ''
      //   document.querySelector(".video").style.position = 'relatived !important'
      // }

      console.log(conW, 'conW');
      console.log(conH, 'conH');
      console.log(document.documentElement, 'document.documentElement');
      var max = conW > conH ? conW : conH;
      var min = conW > conH ? conH : conW;
      document.querySelector(className).style.width = max + "px";
      document.querySelector(className).style.height = min + "px";

    }
  },
  beforeDestroy() {
    screen.orientation.unlock()
  },
  computed: {
    ...mapState({
      vanLoading: state => state.setting.vanLoading
    }),
    getStudentName() {
      return getStudentName
    },
    currentImgIndex() {
      return this.imgArr.findIndex(v => v.active)
    }
  },
  methods: {
    // changeImg(){

    // },
    toggle(type) {
      if (type) {
        // 下一个
        if (this.currentImgIndex < this.imgArr.length - 1) {
          //下一个图片
          this.selectImg(this.imgArr[this.currentImgIndex + 1])
        }
      } else {
        //上一个
        if (this.currentImgIndex > 0) {
          //上一个图片
          this.selectImg(this.imgArr[this.currentImgIndex - 1])
        }
      }
    },
    submitCb() {
      this.isPen = false
      this.isRubber = false
      this.imgArr[this.currentImgIndex].src = this.imgArr[this.currentImgIndex].src.split('&')[0] + '&' + Math.random()
    },
    save() {
      this.$refs['drawBoard'].save()
    },
    upDo() {
      this.$refs['drawBoard'].upDo()
    },
    rotateLeft() {
      this.$refs['drawBoard'].rotateLeft()
    },
    rotateRight() {
      this.$refs['drawBoard'].rotateRight()
    },
    handleComment() {
      if (!this.comment) return this.$toast('请输入评论')
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        classId: this.classId,
        appraiseId: this.list[this.stuIndex].appraiseId,
        replyContent: this.comment,
        parentReplyId: 0,
      }
      addReply(obj).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.$toast('评论成功')
          this.commentShow = false
          this.comment = ''
          // item.comment = ''
          // item.replyList.unshift(res.data[0].pubReplyInfo)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleScore(type) {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "taskId": this.$route.params.taskId,
        type,
        score: 1,
        "subjectType": localStorage.currentSubjectType,
        "teacherName": localStorage.userInfo.userName,
        "taskName": JSON.parse(localStorage.getItem('stat')).taskName,
        "termType": this.$route.params.termType,
        classId: this.classId,
        "groupIdList": "",
        "accountNoList": this.list[this.stuIndex].appraiseAccountNo
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      saveRewardScore(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.$toast(`${type === 'T01' ? '加' : '减'}分成功`)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleEss() {
      if (this.vanLoading) return
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        classId: this.classId,
        appraiseId: this.list[this.stuIndex].appraiseId,
      }
        , api
      if (this.list[this.stuIndex].essFlag === '1') {
        api = unessAppraise
      } else {
        api = essAppraise
      }
      api(obj).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.$toast(this.list[this.stuIndex].essFlag === '1' ? '取消精华' : '加精华成功')
          this.list[this.stuIndex].essFlag = this.list[this.stuIndex].essFlag === '1' ? '0' : '1'
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleTop() {
      if (this.vanLoading) return
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        classId: this.classId,
        appraiseId: this.list[this.stuIndex].appraiseId,
      }
        , api
      if (this.list[this.stuIndex].topFlag === '1') {
        api = untopAppraise
      } else {
        api = topAppraise
      }
      api(obj).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.$toast(this.list[this.stuIndex].topFlag === '1' ? '取消置顶' : '置顶成功')
          this.list[this.stuIndex].topFlag = this.list[this.stuIndex].topFlag === '1' ? '0' : '1'
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handlePraise() {
      if (this.vanLoading) return
      this.$store.commit('setVanLoading', true)
      let obj, api
      if (this.list[this.stuIndex].good) {
        api = delPraise
        obj = {
          praiseId: this.list[this.stuIndex].praiseList.find(p => p.accountNo === JSON.parse(localStorage.userInfo).accountNo).praiseId
        }
      } else {
        api = addPraise
        obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.classId,
          objectId: this.list[this.stuIndex].appraiseId,
          objectTypeCd: 'P01',
        }
      }
      api(obj).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          if (!this.list[this.stuIndex].good) {
            //点赞后
            this.list[this.stuIndex].praiseList.push(res.data[0].praiceInfo)
          } else {
            //取消点赞后
            const praiseIndex = this.list[this.stuIndex].praiseList.findIndex(p => p.accountNo === JSON.parse(localStorage.userInfo).accountNo)
            this.list[this.stuIndex].praiseList.splice(praiseIndex, 1)
          }
          this.$toast(this.list[this.stuIndex].good ? '取消点赞' : '点赞成功')
          this.list[this.stuIndex].good = !this.list[this.stuIndex].good
        } else {
          this.$toast(res.msg)
        }
      })
    },
    selectImg(item) {
      if (item.active) return
      this.imgArr.forEach(v => {
        v.active = false
      })
      item.active = true
      this.stuIndex = this.list.findIndex(v => v.appraiseAccountNo === item.accountNo)
    }
  },
  components: { drawBoard },
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.img-correct-wrap {
  background: rgb(205, 236, 211);
  overflow-y: hidden;
  .icon-circle-arrow {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);

    &.rotate {
      left: auto;
      right: 5px;
      transform: translateY(-50%) rotateZ(180deg);
    }
  }

  .icon__land {
    width: 10px;
    height: 10px;
  }

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 26px;
    background: #1e404d;
    display: flex;
    color: #fff;
    z-index: 9;
    align-items: center;
    font-size: 6px;
    padding: 0 4px;
    justify-content: space-between;

    > div {
      .icon-good-white,
      .icon-top-white,
      .icon-essence-white,
      .icon-circle-plus-white,
      .icon-circle-sub-white,
      .icon-talk-white {
        margin-right: 2px;
      }
    }

    .van-icon-arrow-left {
      font-size: 10px;
    }

    .action-btn {
      color: #333;
      flex: 0 0 22px;
      text-align: center;
      line-height: 14px;
      border-radius: 6px;
      background: #94f8ca;
    }
  }

  &__bottom {
    position: absolute;
    width: 100px;
    height: 24px;
    z-index: 9;
    right: 5px;
    bottom: 5px;
    background: #e4f1f3;
    box-shadow: 0px 3px 9px 0px rgba(160, 177, 158, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    .updo {
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;

      img {
        width: 10px;
        height: 10px;
      }
    }

    .close {
      font-size: 10px;
    }
  }

  &__swipe {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: #e0fffc;
    z-index: 10;
    display: flex;
    white-space: nowrap;
    align-items: center;
    padding: 0 10px;
    overflow-x: auto;

    &-item {
      flex: 0 0 40px;
      font-size: 6px;
      padding-right: 6px;
      text-align: center;

      .img-wrap {
        position: relative;
        height: 20px;
        margin-bottom: 2px;

        img {
          border-radius: 3px;
          border: 1.5px solid #ccc;
          width: 100%;
          height: 20px;
          margin-bottom: 1px;

          &.active {
            border: 1.5px solid @blue;
          }
        }

        span {
          position: absolute;
          bottom: 0;
          right: 0;
          display: block;
          width: 10px;
          line-height: 10px;
          background: #ccc;

          &.active {
            background: @blue;
          }
        }
      }
    }
  }

  @{deep} .van-dialog {
    width: auto;
  }

  .comment-dialog {
    width: 260px;
    display: flex;
    flex-direction: column;

    &__header {
      flex: 0 0 25px;
      background: #eee;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__body {
      font-size: 7px;
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 6px;

      textarea {
        width: 100%;
        background: #f5f6fa;
        border-radius: 3px;
        padding: 5px;
      }

      .tag-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
          background: #f5f6fa;
          border-radius: 3px;
          line-height: 12px;
          text-align: center;
          padding: 0 5px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }

    &__footer {
      flex: 0 0 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;

      .cancel,
      .confirm {
        font-size: 8px;
        flex: 1;
        border-radius: 8px;
        margin-right: 30px;
        height: 100%;
        line-height: 16px;
      }

      .cancel {
        border: 1px solid #ccc;
      }

      .confirm {
        margin-right: 0;
        color: #fff;
      }
    }
  }
}
</style>
