<template>
  <div class="correct-wrap">
    <div class="correct-wrap__header" v-show="!isFold">
      <van-icon @click="$router.back()" name="arrow-left"/>
      <span>{{$route.query.name}}</span>
      <span v-if="info.questionList[questionIndex]">题号:{{info.questionList[questionIndex].num}}</span>
      <span>进度：{{questionIndex + 1}}/{{info.questionList.length}}</span>
      <i @click="" class="iconGFY icon-enlarge"></i>
      <i class="iconGFY icon-reduce"></i>
      <i class="iconGFY icon-rotate-left"></i>
      <i class="iconGFY icon-rotate-right"></i>
      <span @click="viewSubject=true">看原题</span>
      <span @click="stuInfo=!stuInfo">阅卷情况</span>
      <span class="action-btn">加分</span>
      <span class="action-btn" style="background: #FABC73;">减分</span>
      <span @click="commentShow=true" class="action-btn" style="background: #FAE573;">点评</span>
    </div>

    <div class="correct-wrap__side" v-show="!isFold">
      <div class="correct-wrap__side-top">
        <div class="score-btn">满分</div>
        <div class="score-btn" style="background: #FA7373;">零分</div>
      </div>
      <div class="correct-wrap__side-center">
        <div v-for="aa in 10" :key="aa" class="dropdown-group"><span>1.(1)</span>
          <van-dropdown-menu :overlay="false">
            <van-dropdown-item :ref="'menuItem' + aa" :title="value1">
              <div class="menu-wrap">
                <div @click="ab(aa,a)" class="menu-item" v-for="a in 1" :key="a">{{a}}分</div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="correct-wrap__side-bottom">
        <div class="auto-submit"></div>
        <div>自动提交</div>
        <div class="submit fs10">提交</div>
      </div>
    </div>
    <div class="correct-wrap__bottom" id="tools-bar">
      <i @click="isPen=!isPen;isRubber=false" class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i @click="isRubber=!isRubber;isPen=false" class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i class="iconGFY icon-del"></i>
      <i @click="isGood=!isGood" class="iconGFY icon-good" :class="{'icon-good-active':isGood}"></i>
      <i @click="isFold=!isFold" class="iconGFY icon-good" ></i>
    </div>
    <div class="correct-wrap__body">
      <div class="correct-wrap__body__text" ref="text" v-if="info.questionList[questionIndex]&&info.questionList[questionIndex].text" >
        <div class="ellipsis" v-html="info.questionList[questionIndex].text"></div>
        <div class="more-btn">查看更多</div>
      </div>
      <div class="correct-wrap__body__draw" v-if="info.questionList[questionIndex]&&info.questionList[questionIndex].imgArr.length">
        <draw-board :text="commentText" :isPen="isPen" :isRubber="isRubber" :imgUrl="info.questionList[questionIndex].imgArr[imgIndex]" @exit="handleExit"></draw-board>
      </div>
    </div>
    <van-dialog
      v-model="viewSubject"
      :show-confirm-button="false" >
      <div class="view-subject">
        <div class="view-subject__header">看原题<van-icon @click="viewSubject=false" name="cross" /></div>
        <div class="view-subject__body">
          <div class="mgb5 pd5" style="background: #fff;">
            <div>看原题</div>
            <div>(伞)逍遥游(19分)</div>
            <div>(伞)逍遥游(19分)</div>
          </div>
          <div class="pd5" style="background: #fff;">
            <div>看答案</div>
            <div>答案:暗示健康大可接受的安会计师的哈会计师打开手机端跨境四大皆空加深的</div>
            <!--            <div>im</div>-->
          </div>
        </div>
      </div>
    </van-dialog>

    <van-popup
      :overlay="false"
      v-model="stuInfo"
      position="right">
      <div class="stu-info-wrap">
        <div class="stu-info-wrap__header">
          <div class="mgb5">阅卷情况 10/46</div>
          <div class="search-input"><input v-model="stuName" placeholder="请输入查找的学生姓名" type="text"/><van-icon name="search"></van-icon></div>
        </div>
        <div class="stu-info-wrap__body">
          <div class="stu-item" v-for="a in 10" :key="a">
            <div>华慕容欧阳修</div>
            <i class="iconGFY icon-good-active"></i>
            <div>8分</div>
          </div>
        </div>
      </div>
    </van-popup>

    <van-dialog
      v-model="commentShow"
      :show-confirm-button="false" >
      <div class="comment-dialog">
        <div class="comment-dialog__header">评论</div>
        <div class="comment-dialog__body">

          <textarea v-model="comment" placeholder="请输入评论" rows="3"></textarea>
          <div class="tag-wrap">
            <span @click="comment = item" v-for="(item,index) in commonWord" :key="index">{{item}}</span>
          </div>
        </div>
        <div class="comment-dialog__footer van-hairline--top">
          <van-button class="cancel" @click="commentShow=false">取消</van-button>
          <van-button class="confirm" type="info" @click="commentShow=false;commentText=comment">确定</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import drawBoard from '../../components/drawBoard'
  // import 'swiper/dist/css/swiper.css'////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  // import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getCourseTaskDetail} from '@/api/index'
  import AlloyFinger from 'alloyfinger'
  import  'alloyfinger/transformjs/transform'
  import AlloyPaper from 'alloyfinger/asset/alloy_paper.js'
  export default {
    name: "subjectCorrect",
    components: {
      drawBoard,
      // swiper,
      // swiperSlide
    },
    data() {
      return {
        commentText: '',
        commonWord: ['你做的很不错,继续加油!','理解的很好,可以毕业','做得很差,明天不用来上课'],
        comment: '',
        stuName: '',
        stuInfo: false,
        commentShow: false,
        viewSubject: false,
        isPen: true,
        isRubber: false,
        isGood: false,
        isFold: false,
        value1: '10分',
        option: [
          {text: '全部商品', value: 0},
          {text: '新款商品', value: 1},
          {text: '活动商品', value: 2}
        ],
        thumbnail: false,
        imgUrl: '',
        imgList: [require('../../assets/img/banner.png')],
        show: true,
        questionIndex: Number(this.$route.query.index),
        imgIndex: Number(this.$route.query.imgIndex) || 0,
        info: {examQuestionInfo:{},testPaperInfo:[],questionList:[]}
      }
    },
    created() {

      screen.orientation.lock('landscape')
      this.getCourseTaskDetail()
    },
    mounted() {
      this.figure()
    },
    methods: {
      figure() {
        // let swordEle = document.getElementsByClassName('canvas')[0]
        let swordEle = document.getElementById('tools-bar')
        let _this = this
        var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap,Loader=AlloyPaper.Loader;

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
            // }
          },
          swipe: function (evt) {
          }
        });
      },
      getDom(item) {
        this.$set(item,'imgArr',[])
        this.$set(item,'audioArr',[])
        let dom = document.createElement('div')
        dom.innerHTML = item.studentAnswer
        if(item.studentAnswer) {
          const imgArr = dom.querySelectorAll('img')
          const audioArr = dom.querySelectorAll('audio')
          for (let i = 0; i < imgArr.length; i++) {
            item.imgArr.push(imgArr[i].src)
            let parent = imgArr[i].parentElement
            parent.removeChild(imgArr[i])
          }
          for (let i = 0; i < audioArr.length; i++) {
            item.audioArr.push(audioArr[i].src)
            let parent = audioArr[i].parentElement
            parent.removeChild(audioArr[i])
          }
          this.$set(item,'text',dom.outerText)
        }else {
          this.$set(item,'text','')
        }
      },
      getCourseTaskDetail() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A03",
          "tchCourseId": JSON.parse(localStorage.stat).tchCourseId,
          "accountNo": this.$route.query.accountNo,
          "taskId": JSON.parse(localStorage.stat).taskId,
          "isNeedHisAnswer": "Y"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getCourseTaskDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            let arr = [],bNum = 0
            res.data[0].testPaperInfo.forEach((v,index) => {
              v.sectionExam.forEach((s,i) => {
                bNum++
                if(s.testPaperExamGroup.length) {
                  let sNum = 0
                  s.testPaperExamGroup.forEach((t,ti) => {
                    sNum++
                    if(i===0&&index===0&&ti===0) this.$set(t.groupExamInfo,'active',true)
                    t.groupExamInfo.title = s.examQuestion.title + t.groupExamInfo.title
                    t.groupExamInfo.num = `${bNum}(${sNum})`
                    arr.push(t.groupExamInfo)
                  })
                }else {
                  if(i===0&&index===0) this.$set(s.examQuestion,'active',true)
                  s.examQuestion.num = bNum
                  arr.push(s.examQuestion)
                }
              })
            })
            res.data[0].questionList = arr
            this.info = res.data[0]
            this.getDom(this.info.questionList[this.questionIndex])
          }else {
            this.$toast(res.msg)
          }
        })
      },
      ab(i, index) {
        this.$refs['menuItem' + i][0].toggle(false)
        this.value1 = `${index}分`
      },
      handleExit(src) {
        console.log(src);
        // this.show = false
        // this.imgList[this.imgIndex] = src
      },
    },
    beforeDestroy() {
      screen.orientation.unlock()
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .correct-wrap {
    overflow: hidden;
    @{deep} .van-popup--right {
      transform: translate3d(0,0,0);
      top: 26px;
      height: calc(100% - 26px);
      &.van-popup-slide-right-enter,&.van-popup-slide-right-leave-active {
        transform: translate3d(100%,0,0);
      }
      .stu-info-wrap {
        background: #000;
        height: 100%;
        padding: 5px;
        width: 120px;
        display: flex;
        flex-direction: column;
        &__header {
          flex: 0 0 20%;
          font-size: 8px;
          color: #fff;
          .search-input {
            font-size: 4px;
            height: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #eee;
            padding: 0 3px;
            border-radius: 2px;
            input{
              color: #999;
            }
            .van-icon-search {
              color: #333;
            }
          }
        }
        &__body {
          flex: 1;
          overflow-y: auto;
          .stu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            >div{
              text-align: center;
              min-width: 28px;
              background: #fff;
              border-radius: 2px;
              color: #333;
              font-size: 6px;
              padding: 0 3px;
              line-height: 15px;
            }
          }
        }
      }
    }
    @{deep} .van-dialog {
      width: auto;
    }
    .view-subject {
      width: 200px;
      display: flex;
      flex-direction: column;
      &__header {
        position: relative;
        flex: 0 0 25px;
        background: #eee;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .van-icon-cross {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &__body {
        font-size: 7px;
        background: #f5f5f5;
        flex: 1;
        overflow-y: auto;
      }
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
          margin-bottom: 5px;
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
        .cancel,.confirm {
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
    .canvas-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    &__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 26px;
      background: #1E404D;
      display: flex;
      color: #fff;
      z-index: 9;
      align-items: center;
      font-size: 6px;
      padding: 0 4px;
      justify-content: space-between;

      .van-icon-arrow-left {
        font-size: 10px;
      }

      .action-btn {
        color: #333;
        flex: 0 0 22px;
        text-align: center;
        line-height: 14px;
        border-radius: 6px;
        background: #94F8CA;
      }
    }

    &__side {
      top: 30px;
      position: absolute;
      z-index: 9;
      width: 85px;
      height: 65%;
      background: #fff;
      right: 5px;
      padding: 5px;
      display: flex;
      flex-direction: column;

      &-top {
        display: flex;
        align-items: center;
        flex: 0 0 18px;

        .score-btn {
          flex: 1;
          margin-right: 5px;
          border-radius: 8px;
          background: #94f8ca;
          color: #000;
          font-size: 8px;
          text-align: center;
          line-height: 18px;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      &-center {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .dropdown-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;

          .menu-wrap {
            max-height: 64px;
            border: 1px solid #ccc;
            overflow-y: auto;
          }

          .menu-item {
            font-size: 6px;
            text-align: center;
            line-height: 13px;
          }

          > span {
            flex: 1;
            font-size: 6px;
            white-space: nowrap;
          }

          @{deep} .van-dropdown-menu {
            border: 1px solid #B5B5B5;
            flex: 0 0 70%;
            height: 13px;

            .van-dropdown-item {
              position: fixed;
              width: 14%;
              right: 10px;
              max-height: 64px;
              left: auto;

              .van-cell {
                padding: 0;
                font-size: 6px;
              }
            }

            .van-dropdown-menu__title {
              font-size: 6px;
              justify-content: space-between;
              color: #333 !important;

              &::after {
                top: .4vw;
                right: -2.2vw;
                border-color: transparent transparent currentcolor currentcolor;
                border-style: solid;
                border-width: .6vw;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                opacity: .8;
                content: "";
              }

              &.van-dropdown-menu__title--down::after {
                top: 1vw;
                right: -2.2vw;
                border-color: transparent transparent currentcolor currentcolor;
                border-style: solid;
                border-width: .6vw;
                -webkit-transform: rotate(-45deg);
                transform: rotate(135deg);
                opacity: .8;
                content: "";
              }
            }

            &::after {
              content: none;
            }
          }
        }
      }

      &-bottom {
        font-size: 6px;
        flex: 0 0 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .auto-submit {
          flex: 0 0 5px;
          height: 5px;
          background: url("../../assets/img/icon-check.png") no-repeat center center;
          background-size: contain;
        }

        .submit {
          text-align: center;
          line-height: 17px;
          border-radius: 2px;
          background: #6edcfc;
          font-size: 8px;
          flex: 0 0 30px;
        }
      }

    }

    &__body {
      background: rgb(205,236,211);
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      &__text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*width: calc(100% - 100px);*/
        margin: 31px 105px 10px 10px;
        font-size: 10px;
        .ellipsis {
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
          -webkit-box-orient: vertical;
          flex: 1;
        }
        .more-btn {
          color: #16AAB7;
          font-size: 10px;
          margin-left: 5px;
        }
      }
      &__draw {
        flex: 1;
      }
    }
    &__bottom {
      position: absolute;
      width: 125px;
      height: 24px;
      z-index: 9;
      right: 5px;
      bottom: 5px;
      background: #E4F1F3;
      box-shadow: 0px 3px 9px 0px rgba(160, 177, 158, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }
  }
</style>
