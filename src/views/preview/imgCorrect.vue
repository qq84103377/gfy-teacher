<template>
  <section class="img-correct-wrap">
    <i v-if="!isHide&&(currentImgIndex>0)" class="iconGFY icon-circle-arrow" @click="toggle(0,'imgCorrectToggle')"></i>
    <i v-if="!isHide&&((currentImgIndex<imgArr.length-1)||!finished)" class="iconGFY icon-circle-arrow rotate"
       @click="toggle(1,'imgCorrectToggle')"></i>
    <div class="img-correct-wrap__header" v-show="!isHide">
      <van-icon @click="$router.back()" name="arrow-left"/>
      <span>{{isfEducation?getParentName(list[stuIndex].appraiseAccountNo,classId):getStudentName(list[stuIndex].appraiseAccountNo,classId)}}({{list[stuIndex].score}})</span>
      <span>{{currentImgIndex + 1}}/{{imgArr.length}}</span>
      <i class="iconGFY icon-rotate-left" @click="rotateLeft"></i>
      <i class="iconGFY icon-rotate-right" @click="rotateRight"></i>
      <i @click="isPen=!isPen;isRubber=false;isHide=true" class="iconGFY icon-pen-white"
         :class="{'icon-pen-active':isPen}"></i>
      <div @click="handlePraise" class="aic" :class="{yellow:list[stuIndex].good}"><i class="iconGFY icon-good-white"
                                                                                      :class="{'icon-good-active':list[stuIndex].good}"></i>赞
      </div>
      <div @click="handleTop" class="aic" :class="{blue:list[stuIndex].topFlag === '1'}"><i
        class="iconGFY icon-top-white icon__land" :class="{'icon-top-active':list[stuIndex].topFlag === '1'}"></i>置顶
      </div>
      <div @click="handleEss" class="aic" :class="{red:list[stuIndex].essFlag === '1'}"><i
        class="iconGFY icon-essence-white icon__land"
        :class="{'icon-essence-active':list[stuIndex].essFlag === '1'}"></i>精华
      </div>
      <div class="aic" @click="handleScore('T01')"><i class="iconGFY icon-circle-plus-white"></i>加分</div>
      <div class="aic" @click="handleScore('T02')"><i class="iconGFY icon-circle-sub-white"></i>减分</div>
      <div class="aic" @click="commentShow=true"><i class="iconGFY icon-talk-white"></i>
        {{list[stuIndex].replyList.some(v => v.replyAccount === $store.getters.getUserInfo.accountNo) ? '已评论' : '点评'}}
      </div>
    </div>
    <div class="img-correct-wrap__bottom" id="tools-bar">
      <i @click="clickPen" class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i @click="clickRubber" class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i class="iconGFY icon-save" @click="save"></i>
      <i class="updo" @click="upDo">
        <img src="../../assets/img/updo.png" alt="">
      </i>
      <van-icon class="close" name="cross" @click="handleFold"></van-icon>
    </div>
    <div ref="swipe" v-show="!isHide" class="img-correct-wrap__swipe" @scroll="handleScroll">
      <div v-for="(item,index) in imgArr" :key="index" class="img-correct-wrap__swipe-item" @click="selectImg(item)">
        <div class="img-wrap">
          <van-image :show-loading="false" :show-error="false" @error="handleError(item)" :class="{active:item.active}" :src="item.src" alt=""></van-image>
          <span :class="{active:item.active}">{{index + 1}}</span>
        </div>
        <div>{{isfEducation?getParentName(item.accountNo,classId):getStudentName(item.accountNo,classId)}}</div>
      </div>
    </div>
    <draw-board ref="drawBoard" @tap="isHide=!isHide" @submitCb="submitCb" :isPen="isPen" :isRubber="isRubber"
                :imgUrl="imgArr[currentImgIndex].src" @changeImg='toggle'></draw-board>

    <van-dialog v-model="commentShow" :show-confirm-button="false">
      <div class="comment-dialog">
        <div class="comment-dialog__header">评论</div>
        <div class="comment-dialog__body">
          <div style="position: relative;">
            <textarea v-model="comment" maxlength="500" placeholder="请输入评论" rows="4"></textarea>
            <span class="limit-tip">{{comment.length}}/500</span>
          </div>
          <div class="comment-dialog__body__new-comment" v-if="!delReplyId && list[stuIndex].replyList.some(v => v.replyAccount === $store.getters.getUserInfo.accountNo)">
            <div class="grey9">您的最新评论:</div>
            <div class="comment-dialog__body__new-comment__scroll">
              <div class="new">{{getNewComment(stuIndex)}}</div>
              <div @click="delComment" class="blue">删除</div>
            </div>
          </div>
        </div>
        <div class="comment-dialog__footer van-hairline--top">
          <van-button class="cancel" @click="commentShow=false;comment='';delReplyId=''">取消</van-button>
          <van-button class="confirm" type="info" @click="handleComment">确定</van-button>
        </div>
      </div>
    </van-dialog>

  </section>
</template>

<script>
  import {mapMutations, mapGetters, mapState} from 'vuex'
  import drawBoard from '../../components/drawBoard'
  import {getStudentName,getParentName} from '@/utils/filter'
  import {
    delPraise,
    addPraise,
    untopAppraise,
    topAppraise,
    unessAppraise,
    essAppraise,
    saveRewardScore,
    addReply,
    getAppraiseV2,
    delReplyV2,
  } from '@/api/index'
  import AlloyFinger from 'alloyfinger'
  import 'alloyfinger/transformjs/transform'
  import AlloyPaper from 'alloyfinger/asset/alloy_paper.js'

  export default {
    name: "imgCorrect",
    data() {
      return {
        delReplyId: '',
        isHide: false,
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
          v.pubAppendContentInfoList.forEach((append, ai) => {
            append.imgArr.forEach((img, i) => {
              t.push({
                src: img,
                accountNo: v.appraiseAccountNo,
                active: si == this.$route.params.stuIndex && (i + this.calImgIndex(v, ai)) == this.$route.params.imgIndex
              })
            })
          })
          return t
        }, []),
        stuIndex: this.$route.params.stuIndex,
        imgIndex: this.$route.params.imgIndex,
        classId: this.$route.params.classId,
        currentPage: this.$route.params.currentPage,
        total: this.$route.params.total,
        finished: this.$route.params.finished,
        studentStatList: this.$route.params.studentStatList,
        listLoading: false,
        isfEducation: this.$route.params.isfEducation,
      }
    },
    created() {
      screen.orientation.lock('landscape')

    },
    mounted() {
      this.figure()
      const index = this.imgArr.findIndex(v => v.active)
      setTimeout(() => {
        this.$refs['swipe'].scrollLeft = this.$refs.swipe.firstElementChild.offsetWidth * index
      }, 1000);
    },
    beforeDestroy() {
      screen.orientation.lock('portrait')
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
      getStudentName() {
        return getStudentName
      },
      getParentName() {
        return getParentName
      },
      currentImgIndex() {
        return this.imgArr.findIndex(v => v.active)
      }
    },
    methods: {
      handleFold(){
        try{MobclickAgent.onEvent('imgCorrectFold')}catch(e){console.log(e)}
        this.isHide = false
        this.isPen = false
        this.isRubber = false;
      },
      clickRubber(){
        try{MobclickAgent.onEvent('imgCorrectRubber')}catch(e){console.log(e)}
        this.isRubber = true
        this.isPen = false
        this.isHide = true
      },
      clickPen(){
        try{MobclickAgent.onEvent('imgCorrectPen')}catch(e){console.log(e)}
        this.isPen = true
        this.isRubber = false
        this.isHide = true
      },
      handleError(item) {
        this.$set(item,'fail',true)
      },
      delReply() {
        this.$store.commit('setVanLoading', true)
        delReplyV2({replyId:this.delReplyId}).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            const index = this.list[this.stuIndex].replyList.findIndex(v => this.delReplyId === v.replyId)
            if(index > -1) {
              this.list[this.stuIndex].replyList.splice(index,1)
            }
            this.commentShow = false
            this.delReplyId = ''
          }else {
            this.$toast(res.msg)
          }
        })
      },
      delComment() {
        const item = this.list[this.stuIndex].replyList.find(v => v.replyAccount === this.$store.getters.getUserInfo.accountNo)
        this.delReplyId = item ? item.replyId : ''
      },
      getNewComment(stuIndex) {
        const item = this.list[stuIndex].replyList.find(v => v.replyAccount === this.$store.getters.getUserInfo.accountNo)
          return item ? item.replyContent : ''
      },
      figure() {
        // let swordEle = document.getElementsByClassName('canvas')[0]
        let swordEle = document.getElementById('tools-bar')
        let _this = this
        var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap, Loader = AlloyPaper.Loader;

        Transform(swordEle)
        let bwidth, bheight, swidth, sheight;
        var initScale = 1;
        var af = new AlloyFinger(swordEle, {
          touchStart: function (event) {
            // if(!_this.isPen&&!_this.isRubber) return
            // _this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            // _this.lastCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
            // _this.lastTimestamp = new Date().getTime();
            // console.log('touchStart')
          },
          touchMove: function (event) {
          },
          touchEnd: function () {
            // let strArr = swordEle.style.transform.split(',')
            // _this.rotateX = strArr[0].split('matrix3d(')[1]
            // _this.rotateY = strArr[5]
            // console.log(_this.rotateX,_this.rotateY)
          },
          touchCancel: function () {
          },
          multipointStart: function () {

          },
          multipointEnd: function () {
          },
          tap: function () {
          },
          doubleTap: function () {
          },
          longTap: function () {
          },
          singleTap: function () {
          },
          rotate: function (evt) {

          },
          pinch(evt) {
          },
          pressMove: function (evt) {
            let widthDiff = bwidth - swidth;
            let heightDiff = bheight - sheight;
            // if (((evt.deltaX>0)&&(swordEle.translateX >= widthDiff))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
            // } else {
            swordEle.translateX += evt.deltaX;
            swordEle.translateY += evt.deltaY;
            if (swordEle.translateX > 0) {
              swordEle.translateX = 0
            }
            if (swordEle.translateY > 0) {
              swordEle.translateY = 0
            }
            if (swordEle.translateX < -(window.document.body.offsetWidth - swordEle.offsetWidth)) {
              swordEle.translateX = -(window.document.body.offsetWidth - swordEle.offsetWidth)
            }
            if (swordEle.translateY < -(window.document.body.offsetHeight - swordEle.offsetHeight)) {
              swordEle.translateY = -(window.document.body.offsetHeight - swordEle.offsetHeight)
            }
          },
          swipe: function (evt) {
          }
        });
      },
      rewardScore(accountNo) {
        try {
          return this.studentStatList.find(v => v.accountNo === accountNo).studentRewardScore || 0
        } catch {
          console.log(accountNo, '有错啊');
        }
      },
      async getAppraise() {
        const page = this.currentPage
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          classId: this.classId,
          // currPage: 1,
          "currPage": page,
          isAppendMode: true,
          objectId: this.$route.params.taskId,
          objectTypeCd: 'A01',
          pageSize: 10,
          praiseType: 1,
          replyType: 1,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getAppraiseV2(params).then(res => {
          this.total = res.total
          this.listLoading = false
          this.$store.commit('setVanLoading', false)

          if (res.flag && res.data[0]) {
            res.data[0].appraiseListInfo.forEach(async v => {
              // 本账号是否有点过赞
              v.good = v.praiseList.some(p => p.accountNo === JSON.parse(localStorage.userInfo).accountNo)
              v.score = this.rewardScore(v.appraiseAccountNo)
              let dom = document.createElement('div')
              v.imgArr = []
              v.audioArr = []
              v.videoArr = []
              dom.innerHTML = v.appraiseContent
              if (v.appraiseContent) {
                this.handleAppraiseCtn(dom, v)
              }
              v.text = dom.outerHTML

              //追加内容
              v.pubAppendContentInfoList.forEach(append => {
                let appendDom = document.createElement('div')
                append.imgArr = []
                append.audioArr = []
                append.videoArr = []
                appendDom.innerHTML = append.appendContent
                this.handleAppraiseCtn(appendDom, append)
                append.text = appendDom.outerHTML
              })

            })
            this.list = page === 1 ? res.data[0].appraiseListInfo : this.list.concat(res.data[0].appraiseListInfo)

            let imgArr = res.data[0].appraiseListInfo.reduce((t, v, si) => {
              v.imgArr.forEach((img, i) => {
                t.push({
                  src: img,
                  accountNo: v.appraiseAccountNo,
                  active: false
                })
              })
              v.pubAppendContentInfoList.forEach((append, ai) => {
                append.imgArr.forEach((img, i) => {
                  t.push({
                    src: img,
                    accountNo: v.appraiseAccountNo,
                    active: false
                  })
                })
              })
              return t
            }, [])
            this.imgArr = this.imgArr.concat(imgArr)

            if (page >= res.total) {
              this.finished = true
            } else {
              this.finished = false
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
        })
      },
      handleAppraiseCtn(dom, v) {
        const imgArr = dom.querySelectorAll('img')
        const audioArr = dom.querySelectorAll('audio')
        const videoArr = dom.querySelectorAll('video')
        for (let i = 0; i < imgArr.length; i++) {
          if (imgArr[i].src.indexOf('?')>-1) {
            v.imgArr.push(imgArr[i].src + '&' + Math.random())
          }else{
            v.imgArr.push(imgArr[i].src + '?&' + Math.random())
          }
          let parent = imgArr[i].parentElement
          parent.removeChild(imgArr[i])
        }
        for (let i = 0; i < audioArr.length; i++) {
          v.audioArr.push(audioArr[i].src)
          let parent = audioArr[i].parentElement
          parent.removeChild(audioArr[i])
        }
        for (let i = 0; i < videoArr.length; i++) {
          v.videoArr.push(videoArr[i].src)
          let parent = videoArr[i].parentElement
          parent.removeChild(videoArr[i])
        }
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        await this.getAppraise()
      },
      handleScroll(e) {
        if (this.listLoading) return
        if (((e.target.scrollLeft + window.document.body.offsetWidth) > (e.target.scrollWidth - 30)) && !this.finished) {
          //触发加载
          this.listLoading = true
          this.onLoad()
        }
      },
      calImgIndex(item, appendIndex) {
        let count = item.imgArr.length
        for (let j = 0; j < item.pubAppendContentInfoList.length; j++) {
          const itemElement = item.pubAppendContentInfoList[j];
          if (j < appendIndex) {
            count += itemElement.imgArr.length
          } else {
            break
          }
        }
        return count
      },
      async toggle(type,eve) {
        if(eve){
          try{MobclickAgent.onEvent(eve)}catch(e){console.log(e)}
        }
        if (type) {
          // 下一个
          if (this.currentImgIndex < this.imgArr.length - 1) {
            //下一个图片
            this.selectImg(this.imgArr[this.currentImgIndex + 1])
          } else if (!this.finished) {
            //加载下一页
            await this.onLoad()
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
         if (this.imgArr[this.currentImgIndex].src.indexOf('?')>-1) {
            this.imgArr[this.currentImgIndex].src = this.imgArr[this.currentImgIndex].src.split('&')[0] + '&' + Math.random()
         }else{
            this.imgArr[this.currentImgIndex].src = this.imgArr[this.currentImgIndex].src.split('&')[0] + '?&' + Math.random()
         }

      },
      save() {
        try{MobclickAgent.onEvent('imgCorrectSave')}catch(e){console.log(e)}
        this.$refs['drawBoard'].save()
      },
      upDo() {
        try{MobclickAgent.onEvent('imgCorrectWithdraw')}catch(e){console.log(e)}
        this.$refs['drawBoard'].upDo()
      },
      rotateLeft() {
        try{MobclickAgent.onEvent('imgCorrectRotate')}catch(e){console.log(e)}
        this.$refs['drawBoard'].rotateLeft()
      },
      rotateRight() {
        try{MobclickAgent.onEvent('imgCorrectRotate')}catch(e){console.log(e)}
        this.$refs['drawBoard'].rotateRight()
      },
      handleComment() {
        try{MobclickAgent.onEvent('imgCorrectCommentSubmit')}catch(e){console.log(e)}
        if(this.delReplyId) {
          //有删除评论的操作
          this.delReply()
          if(this.comment) {
            this.addReply()
          }
        }else {
          this.addReply()
        }
      },
      addReply() {
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
            this.delReplyId = ''
            this.list[this.stuIndex].replyList.unshift(res.data[0].pubReplyInfo)
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
        try{MobclickAgent.onEvent('imgCorrectAddSubScore')}catch(e){console.log(e)}
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(`${type === 'T01' ? '加' : '减'}分成功`)
            this.list[this.stuIndex].score = this.list[this.stuIndex].score * 1 + (type === 'T01' ? 1 : -1)
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
        try{MobclickAgent.onEvent('imgCorrectEss')}catch(e){console.log(e)}
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
        try{MobclickAgent.onEvent('imgCorrectTop')}catch(e){console.log(e)}
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
        try{MobclickAgent.onEvent('imgCorrectGood')}catch(e){console.log(e)}
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
        if(item.fail) {
          item.fail = false
          item.src = item.src + '1'
        }
        this.stuIndex = this.list.findIndex(v => v.appraiseAccountNo === item.accountNo)
      }
    },
    components: {drawBoard},
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
          @{deep} .van-image {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            border: 1.5px solid #ccc;
            img {
              width: 100%;
              height: 100%;
              margin-bottom: 1px;
            }
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
        .limit-tip {
          position: absolute;
          right: 10px;
          bottom: 10px;
          color: #666;
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
        &__new-comment{
          display: flex;
          margin-top: 3px;
          &__scroll{
            flex: 1;
            margin-left: 3px;
            .new{
              word-break: break-all;
              max-height: 30px;
              overflow-y: auto;
              margin-bottom: 3px;
            }
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
