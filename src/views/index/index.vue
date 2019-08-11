<template>
    <section class="index-content-wrap">
      <div class="index-content-wrap__header">
        <div id="gfy_dropdown">
          <div @click="subjectShow = true">
            <span>语文</span>
            <van-icon class="fs16 black" name="arrow-down" />
          </div>

          <van-popup :overlay="false" v-model="subjectShow" get-container="#gfy_dropdown" class="score-pop">
            <div style="position: relative;">
              <div class="score-pop-wrap">
                <div class="score-pop-wrap__item" @click="handleClosePop">数学</div>
                <div class="score-pop-wrap__item" @click="handleClosePop">语文</div>
                <div class="score-pop-wrap__item" @click="handleClosePop">英语</div>
                <div class="score-pop-wrap__item" @click="handleClosePop">体育</div>
                <div class="score-pop-wrap__item" @click="handleClosePop">美术</div>
              </div>
              <div class="parent">
                <div class="child"></div>
              </div>
            </div>
          </van-popup>

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
            fold:false,
            subjectShow:false,
          }
      },
      methods: {
        handleClosePop() {
          this.subjectShow = false
        },
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
      #gfy_dropdown {
        position: relative;
        .score-pop {
          left: -10%;
          position: absolute;
          max-height: inherit;
          top: 140%;
          transform: none;
          overflow-y: inherit;
          box-shadow:0px 5px 9px 0px rgba(83,167,163,1);
          &-wrap {

            &__item {
              background: #fff;
              text-align: center;
              width: 108px;
              line-height: 44px;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          }
          .parent {
              top: -10px;
              left: 50%;
            width: 0px;
            height: 0px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #eee;
            position: absolute;
              transform: translateX(-50%);
          }
          .child {
            width: 0px;
            height: 0px;
            border-width:0 9px 9px;
            border-style:solid;
            border-color:transparent transparent #fff;
            position: absolute;
            top: 1px;
            left: -9px;
          }
          /*&::after {*/
          /*  width: 0;*/
          /*  height: 0;*/
          /*  border-width: 0 10px 10px;*/
          /*  border-style: solid;*/
          /*  border-color: transparent transparent #fff;*/
          /*  content: ' ';*/
          /*  position: absolute;*/
          /*  top: -10px;*/
          /*  left: 50%;*/
          /*  transform: translateX(-50%);*/
          /*}*/
        }
      }
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
