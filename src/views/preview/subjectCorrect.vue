<template>
  <div class="correct-wrap">
    <div class="correct-wrap__header" v-show="!isPen">
      <van-icon name="arrow-left"/>
      <span>飞龙在天在天</span>
      <span>题号:1 (1)</span>
      <span>进度：10/46</span>
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

    <div class="correct-wrap__side" v-show="!isPen">
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
    <div class="correct-wrap__bottom">
      <i @click="isPen=!isPen;isRubber=false" class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i @click="isRubber=!isRubber;isPen=false" class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i class="iconGFY icon-del"></i>
      <i @click="isGood=!isGood" class="iconGFY icon-good" :class="{'icon-good-active':isGood}"></i>
    </div>
<!--    <div class="canvas-mask" v-show="!isPen&&!isRubber"></div>-->
    <draw-board :text="commentText" :isPen="isPen" :isRubber="isRubber" :imgUrl="require('../../assets/img/banner.png')" @exit="handleExit"></draw-board>
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
        value1: '10分',
        option: [
          {text: '全部商品', value: 0},
          {text: '新款商品', value: 1},
          {text: '活动商品', value: 2}
        ],
        thumbnail: false,
        swiperOption: {
          zoom: {
            maxRatio: 5, //最大倍数
            minRatio: 1, //最小倍数
            toggle: false, //不允许双击缩放，只允许手机端触摸缩放。
            // containerClass: 'my-zoom-container', //zoom container 类名
          },

        },
        imgIndex: 0,
        imgUrl: '',
        imgList: [require('../../assets/img/banner.png')],
        show: true,
        index: 0,
      }
    },
    created() {

      screen.orientation.lock('landscape')
    },
    mounted() {
      // window.addEventListener('resize', () => {
      //     alert(window.screen.height)
      //     this.height = window.screen.height - 50
      //     this.width = window.screen.width
      // })

    },
    methods: {
      ab(i, index) {
        this.$refs['menuItem' + i][0].toggle({show: false})
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
    overflow-y: hidden;
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

    &__bottom {
      position: absolute;
      width: 100px;
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
