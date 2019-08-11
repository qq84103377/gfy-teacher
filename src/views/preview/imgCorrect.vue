<template>
  <section class="img-correct-wrap">
    <div class="img-correct-wrap__header" v-show="!isPen&&!isRubber">
      <van-icon name="arrow-left"/>
      <span>飞龙在天在天</span>
      <span>10/46</span>
      <i class="iconGFY icon-rotate-left"></i>
      <i class="iconGFY icon-rotate-right"></i>
      <i @click="isPen=!isPen;isRubber=false" class="iconGFY icon-pen-white" :class="{'icon-pen-active':isPen}"></i>
      <div @click="isGood=!isGood" class="aic" :class="{yellow:isGood}"><i class="iconGFY icon-good-white" :class="{'icon-good-active':isGood}"></i>赞</div>
      <div @click="isTop=!isTop" class="aic" :class="{blue:isTop}"><i class="iconGFY icon-top-white icon__land" :class="{'icon-top-active':isTop}"></i>置顶</div>
      <div @click="essence=!essence" class="aic" :class="{red:essence}"><i class="iconGFY icon-essence-white icon__land" :class="{'icon-essence-active':essence}"></i>精华</div>
      <div class="aic"><i class="iconGFY icon-circle-plus-white"></i>加分</div>
      <div class="aic"><i class="iconGFY icon-circle-sub-white"></i>减分</div>
      <div class="aic" @click="commentShow=true"><i class="iconGFY icon-talk-white"></i>评论</div>
    </div>
    <div class="img-correct-wrap__bottom">
      <i @click="isPen=!isPen;isRubber=false" class="iconGFY icon-pen" :class="{'icon-pen-active':isPen}"></i>
      <i @click="isRubber=!isRubber;isPen=false" class="iconGFY icon-rubber"
         :class="{'icon-rubber-active':isRubber}"></i>
      <i class="iconGFY icon-save"></i>
      <van-icon class="close" name="cross"></van-icon>
    </div>
    <div v-show="!isPen&&!isRubber" class="img-correct-wrap__swipe">
      <div v-for="a in 20" :key="a" class="img-correct-wrap__swipe-item">
        <img src="../../assets/img/banner.png" alt="">
        <div>裘千仞华慕容</div>
      </div>
    </div>
    <draw-board :isPen="isPen" :isRubber="isRubber" :imgUrl="require('../../assets/img/banner.png')"></draw-board>

    <van-dialog
      v-model="commentShow"
      :show-confirm-button="false" >
      <div class="comment-dialog">
        <div class="comment-dialog__header">评论</div>
        <div class="comment-dialog__body">

          <textarea v-model="comment" placeholder="请输入评论" rows="4"></textarea>
        </div>
        <div class="comment-dialog__footer van-hairline--top">
          <van-button class="cancel" @click="commentShow=false">取消</van-button>
          <van-button class="confirm" type="info" @click="commentShow=false;">确定</van-button>
        </div>
      </div>
    </van-dialog>

  </section>
</template>

<script>
  import drawBoard from '../../components/drawBoard'
  export default {
        name: "imgCorrect",
      data() {
          return {
            isPen: true,
            isRubber: false,
            isGood: false,
            isTop: false,
            essence: false,
            commentShow: false,
            comment: '',
          }
      },
    components: {drawBoard},
    }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .img-correct-wrap {
    overflow-y: hidden;
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
      .close {
        font-size: 10px;
      }
    }
    &__swipe{
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
        img{
          border-radius: 3px;
          border: 1px solid #ccc;
          width: 100%;
          height: 20px;
          margin-bottom: 1px;
          &.active {
            border: 1px solid @blue;
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

  }
</style>
