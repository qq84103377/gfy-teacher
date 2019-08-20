<template>
  <van-swipe-cell class="list-item-wrap">
    <div class="pd10" style="padding-bottom: 0;">
      <div class="badge"><slot name="badge"></slot></div>
      <div class="aic mgb15" @click="$emit('clickTo')">
        <div class="icon-wrap" v-if="$slots.cover"><slot name="cover"></slot></div>
        <div style="flex: 1">
          <div class="title"><i class="iconGFY icon-comment"></i>
            我是邓稼先的微课程标题我是邓稼先的微课程标题我是邓稼先fsdfsdsfsdf微课程标题我是邓稼先微课程标题我是邓稼先微课程标题我是邓稼先
          </div>
          <div v-if="$slots.desc"><slot name="desc"></slot></div>
          <div v-else class="mgt15">
            <div class="time" v-for="(item,index) in 5" :key="item" v-if="(index<2&&!fold) || fold">龙江智慧一班:2019-07-04 14:42:00 -- 2019-07-31 14:42:00</div>
          </div>
        </div>
      </div>
      <div class="content">
<!--        <van-icon name="play" class="arrow"/>-->
<!--        <i class="iconGFY icon-location edit"></i>-->
<!--        <div class="fs10 aic jcsb">-->
<!--          <i class="iconGFY icon-location"></i>-->
<!--          <span>5/100</span>-->
<!--        </div>-->
        <slot name="btn"></slot>
        <slot name="remark"></slot>
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
    .badge {
      position: absolute;
      right: 0;
      top: 0;
    }
    .icon-wrap {
      flex: 0 0 115px;
      height: 80px;
      margin-right: 10px;
    }
    .title {
      i {
        vertical-align: middle;
      }
      font-size: 14px;
      font-weight: bold;
      color: #333;
      width: 100%;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
      -webkit-box-orient: vertical;
      line-height: 20px;
    }
      .time {
        font-size: 10px;
        color: #999;
      }
  }
</style>
<style lang="less">
  .list-item-wrap {
    .btn-group {
      display: flex;
      height: 34px;
      > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 14px;
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
