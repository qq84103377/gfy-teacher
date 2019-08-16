<template>
    <section class="exam-bar">
        <div class="exam-choice" @click="selectPop=!selectPop"><i class="iconGFY icon-file"></i><span class="badge">99</span></div>
        <div style="flex: 1">已选入<span class="fs10 red">150</span>道试题</div>
        <div class="select-btn">选择其他</div>
        <div class="add-btn" @click="handleSubmit">{{type=='task'?'发任务':'生成试卷'}}</div>
              <van-overlay
                class-name="exam-bar-overlay"
                :show="selectPop"
                @click="selectPop = false"
              />
          <div class="exam-bar-pop" v-if="selectPop">
            <van-cell>
              <div slot="title" class="jcsb">
                <div>已选题目</div>
                <div>清空练习</div>
              </div>
            </van-cell>
            <van-cell v-for="a in 9" :key="a">
              <div slot="title" class="jcsb">
                <div>选择题</div>
                <div>1道</div>
              </div>
            </van-cell>
          </div>
    </section>
</template>

<script>
    export default {
      props: ['type'],
        name: "examBar",
      data() {
          return {
            selectPop: false
          }
      },
      methods: {
        handleSubmit() {
            this.$router.push(`/${this.type==='task'?'addTask?type=exam':'examDetail'}`)
        }
      }
    }
</script>

<style lang="less" scoped>
  .exam-bar {
    background: #fff;
    flex: 0 0 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    position: relative;
    .exam-bar-overlay {
      top: -50px;
    }
    &-pop {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 50px;
      background: #fff;
      z-index: 2;
      border-radius:10px 10px 0px 0px;
      max-height: 440px;
      overflow-y: auto;
    }
    .select-btn,.add-btn {
      flex: 0 0 85px;
      color: #fff;
      background: @blue;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }
    .select-btn {
      background: #4DFEEC;
    }
    .exam-choice {
      position: relative;
      margin: 0 10px;
      .badge {
        position: absolute;
        border-radius: 50%;
        background: red;
        color: #fff;
        font-size: 10px;
        width: 20px;
        height: 20px;
        top: -6px;
        right: -10px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
</style>
