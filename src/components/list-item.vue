<template>
  <van-swipe-cell class="list-item-wrap">
    <div class="pd10" style="padding-bottom: 0;">
      <div class="title"><i class="iconGFY icon-comment"></i>
        我是邓稼先的微课程标题我是邓稼先的微课程标题我是邓稼先fsdfsdsfsdf微课程标题我是邓稼先微课程标题我是邓稼先微课程标题我是邓稼先
      </div>
      <div class="content">
<!--        <van-icon name="play" class="arrow"/>-->
        <div class="time" v-for="(item,index) in 5" :key="item" v-if="(index<2&&!fold) || fold">龙江智慧一班:2019-07-04 14:42:00 -- 2019-07-31 14:42:00</div>
<!--        <i class="iconGFY icon-location edit"></i>-->
<!--        <div class="fs10 aic jcsb">-->
<!--          <i class="iconGFY icon-location"></i>-->
<!--          <span>5/100</span>-->
<!--        </div>-->
        <slot name="btn"></slot>
      </div>
    </div>
    <template v-if="canSlide" slot="right">
          <van-button style="background: #ccc;height: 100%;border: none;color: #fff" square text="删除" />
          <van-button style="background: #FFCD6B;height: 100%;border: none;color: #fff" square text="上移"/>
          <van-button style="background: #FEC147;height: 100%;border: none;color: #fff" square text="下移"/>
          <van-button style="background: #FEB524;height: 100%;border: none;color: #fff" square text="置顶"/>
    </template>
  </van-swipe-cell>
</template>

<script>
    export default {
        name: "list-item",
      props: ['canSlide','fold'],
      data() {
          return {

          }
      }
    }
</script>

<style lang="less" scoped>
  .list-item-wrap {
    .title {
      i {
        vertical-align: middle;
      }
      font-size: 14px;
      color: #333;
      width: 100%;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
      -webkit-box-orient: vertical;
      line-height: 26px;
      margin-bottom: 18px;
    }
    .content {
      .time {
        font-size: 10px;
        color: #999;
      }
    }
  }
</style>
<style lang="less">
  .list-item-wrap {
    .btn-group {
      margin-top: 15px;
      display: flex;
      height: 34px;
      > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 16px;
        i {
          margin-right: 5px;
          &.fold {
            transform: rotateZ(90deg);
          }
        }
      }
    }
  }
</style>
