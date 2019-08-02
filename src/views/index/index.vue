<template>
    <section class="index-content-wrap">
      <div class="index-content-wrap__header">
        <div>
          <span>语文</span>
          <van-icon class="fs16 black" name="arrow-down" />
        </div>
        <i class="iconGFY icon-bell"></i>
      </div>
      <div class="index-content-wrap__body">
        <img src="../../assets/img/banner.png" alt="">
        <div class="index-content-wrap__body__main-icon">
          <div @click="$router.push(`/preview`)" class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap blue"><i class="iconGFY icon-book"></i></div>
            <div>预习</div>
          </div>
          <div class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap green"><i class="iconGFY icon-play"></i></div>
            <div>课中</div>
          </div>
          <div class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap yellow"><i class="iconGFY icon-res"></i></div>
            <div>资源</div>
          </div>
          <div class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap orange"><i class="iconGFY icon-plus"></i></div>
            <div>更多</div>
          </div>
        </div>
        <div class="jcsb aic mgb10">
          <span class="fs16 black">未完成任务</span>
          <span class="blue fs12">查看更多></span>
        </div>
        <div class="index-content-wrap__body__unfinish-wrap">
          <list-item :fold="fold">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="fold=!fold">
                <i class="iconGFY icon-arrow" :class="{fold:fold}"></i>
                <span>班级查看</span>
              </div>
              <div>
                <i class="iconGFY icon-edit"></i>
                <span>编辑</span>
              </div>
              <div>
                <i class="iconGFY icon-statistics"></i>
                <span>5/100</span>
              </div>
            </div>
          </list-item>
        </div>

        <div class="divider-title">教学工具</div>
        <div class="icon-group">
          <div>
            <i class="iconGFY icon-user"></i>
            <span>我的班级</span>
          </div>
          <div>
            <i class="iconGFY icon-tv"></i>
            <span>我的课程</span>
          </div>
          <div>
            <i class="iconGFY icon-errors"></i>
            <span>错题集</span>
          </div>
          <div>
            <i class="iconGFY icon-res-plus"></i>
            <span>智能补强</span>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
    export default {
        name: "index",
      components: {listItem},
      data() {
          return {
            fold:false
          }
      }
    }
</script>

<style lang="less" scoped>
  .index-content-wrap {
    display: flex;
    flex-direction: column;
    &__header {
      flex: 0 0 44px;
      padding: 0 15px;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: @black;
    }
    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 10px 16px;
      >img {
        width: 100%;
        height: 150px;
        border-radius: 5px;
      }
      &__main-icon {
        display: flex;
        justify-content: space-around;
        margin: 18px 0 40px 0;
        &-item {
          flex: 0 0 45px;
          text-align: center;
          font-size: 12px;
          .icon-wrap {
            width: 100%;
            height: 45px;
            margin-bottom: 12px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &.blue {
              background: linear-gradient(0deg,rgba(149,249,238,1),rgba(37,219,241,1));
            }
            &.green {
              background: linear-gradient(0deg,rgba(190,243,89,1),rgba(107,218,33,1));
            }
            &.yellow {
              background: linear-gradient(0deg,rgba(247,220,64,1),rgba(255,173,30,1));
            }
            &.orange {
              background: linear-gradient(0deg,rgba(252,164,99,1),rgba(232,118,35,1));
            }
          }
        }
      }
      &__unfinish-wrap {
        border: 1px solid #eee;
        border-radius: 5px;
      }
      .divider-title{
        margin: 30px 0 15px;
        font-size: 16px;
        color: #333;
      }
      .icon-group{
        display: flex;
        padding-left: 10px;
        >div {
          margin-right: 15px;
          font-size: 12px;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          i {
            width: 20px;
            height: 20px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
