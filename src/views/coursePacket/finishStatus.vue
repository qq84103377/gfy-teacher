<template>
  <section class="finish">
    <van-nav-bar title="黎明寒假任务完成情况" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="finish__body">
      <div class="finish__body__list">
        <div class="finish__body__list-pre" v-for="item in 7">

          <div class="finish__body__list-pre__tit" @click="">
            <i class="iconGFY" v-if="taskType=='T01'||taskType=='T02'||taskType=='T03'||(taskType =='T04' && testPaperId!=0)||(taskType =='T04' && testPaperId==0)||taskType =='T06'||taskType =='T13'" :class="{'icon-exam':taskType=='T01','icon-comment':taskType=='T02',
          'icon-test':taskType=='T03','icon-learn-res':taskType =='T04' && testPaperId!=0,
          'icon-learn-res-exp':taskType =='T04' && testPaperId==0,'icon-discuss':taskType =='T06','icon-spoken':taskType =='T13'}"></i>
            我是邓稼先的微课程标题我是邓稼先的微课程...
          </div>
          <div class="finish__body__list-pre__time">
            <p>时长：00:05:32 <span>得分：<i>98分</i></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: 'finishStatus',
  data() {
    return {
      taskType: "T02",
    }
  },
  methods: {
    goBack() {
      this.common.goBack(this)
    },
  },

}
</script>

<style lang="less" scoped>
.finish {
  background-color: #f5f6fa;
  height: 100%;
  display: flex;
  flex-direction: column;

  .van-nav-bar {
    flex: 0 0 50px;
    margin-bottom: 10px;
  }
  &__body {
    flex: 1;
    overflow: hidden;
    &__list {
      height: 100%;
      overflow: scroll;
      &-pre {
        height: 85px;
        // flex: 1;
        // min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
        margin-bottom: 10px;
        &__tit {
          padding: 10px;
          i {
            vertical-align: middle;
          }
          font-size: 14px;
          font-weight: bold;
          color: #333;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 20px;
        }
        &__time {
          padding: 10px;
          text-align: right;
          font-size: 10px;
          span {
            margin-left: 10px;
          }
          i {
            color: red;
          }
        }
      }
    }
  }
}
</style>