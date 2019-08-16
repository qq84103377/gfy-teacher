<template>
  <section class="question-item-wrap">
    <i class="iconGFY icon-auto"></i>
    <div class="question-item-wrap__ctn">
      <div>asdjkashdkajsd</div>
      <div class="icon-group">
        <span><i class="iconGFY icon-points"></i>0</span>
        <span><i class="iconGFY icon-star"></i>0</span>
        <span><i class="iconGFY icon-difficult"></i>困难</span>
      </div>
    </div>
    <div class="question-item-wrap__btn-group van-hairline--top" :id="'question-item'+index">
      <van-icon @click="tooltip=true" name="ellipsis" class="fs18" v-if="!isSend"></van-icon>
      <div class="aic" style="flex: 1;justify-content: flex-end">
        <div v-if="isSend" class="btn-item" @click="$emit('correct')">纠错</div>
        <div class="btn-item" :class="{active:analyseShow}" @click="analyseShow=!analyseShow">查看解析</div>
        <div v-if="isQuestion" class="btn-item" :class="{active:collect}" @click="collect=!collect">取消收藏</div>
        <div v-if="!isSend&&!isQuestion" class="btn-item" @click="$emit('setPoint')">设置分数</div>
        <div v-if="!isSend" class="btn-item" :class="{active:!isRemove}" @click="isRemove=!isRemove">{{isRemove?'添加':'移除'}}试题</div>
      </div>
    </div>
    <div v-if="analyseShow" class="question-item-wrap__analyse">
      <div>正确答案及相关解析</div>
      <div>正确答案:</div>
      <div>A</div>
    </div>


    <van-popup v-model="tooltip" :get-container="'#question-item'+index" class="tooltip-pop">
      <div class="tooltip-pop-wrap">
        <div class="tooltip-pop-wrap__item" @click="$emit('correct')">纠错</div>
        <div v-if="canMove" class="tooltip-pop-wrap__item">上移</div>
        <div v-if="canMove" class="tooltip-pop-wrap__item">下移</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  export default {
    name: "questionItem",
    props: ['isSend','index','isQuestion','canMove'],//isQuestion 是否试题页面适用
    data() {
      return {
        analyseShow: false,
        isRemove: true,
        tooltip: false,
        collect: false
      }
    }
  }
</script>

<style lang="less" scoped>
  .question-item-wrap {
    position: relative;
    background: #fff;
    margin-bottom: 10px;
    .icon-auto {
      position: absolute;
      right: 0;
      top: 0;
    }
    .tooltip-pop {
      border-radius: 5px;
      bottom: 90%;
      position: absolute;
      max-height: inherit;
      top: inherit;
      transform: none;
      left: 3%;
      overflow-y: inherit;

      &-wrap {
        padding: 10px;

        &__item {
          text-align: center;
          width: 85px;
          line-height: 30px;
          border-radius: 5px;
          margin-bottom: 5px;
          font-size: 15px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &::after {
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #fff;
        content: ' ';
        position: absolute;
        bottom: -9px;
        left: 2%;
        transform: rotateZ(180deg);
      }
    }

    &__ctn {
      padding: 15px 12px;
      .icon-group {
        display: flex;
        align-items: center;
        margin-top: 22px;
        font-size: 12px;
        color: #666;
        span {
          margin-right: 15px;
          i {
            margin-right: 3px;
          }
        }
      }
    }
    &__btn-group {
      position: relative;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      .btn-item {
        flex: 0 0 63px;
        line-height: 22px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid #999;
        margin-right: 11px;
        &.active {
          color: @blue;
          border: 1px solid @blue;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    &__analyse {
      padding: 8px 12px;
    }
  }
</style>
