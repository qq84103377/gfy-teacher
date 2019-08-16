<template>
    <section class="exam-detail">
      <van-nav-bar
        title="暗示健康的哈萨克积极思考阿萨德是啊十大"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="exam-detail__body">
        <div class="exam-detail__body__score">
          <span v-if="!isSend" style="font-weight: bold;flex: 1">已选入150道试题</span>
          <span class="red">总分: 100</span>
        </div>
        <div class="exam-detail__body__question-num">
          <div style="font-weight: bold;">1.选择题</div>
          <div v-if="!isSend" class="set-point" @click="setPointShow=true">设置分数</div>
        </div>
        <question-item :can-move="a>1&&a<20" :is-send="isSend" v-for="a in 20" :key="a" @setPoint="setPointShow=true" @correct="correctShow=true" :index="a"></question-item>
      </div>
      <exam-bar type="task" v-if="!isSend"></exam-bar>
      <correct-pop :show.sync="correctShow"></correct-pop>
      <set-point-dialog :show.sync="setPointShow"></set-point-dialog>
    </section>
</template>

<script>
  import questionItem from '../../components/questionItem'
  import examBar from '../../components/examBar'
  import correctPop from '../../components/correctPop'
  import setPointDialog from '../../components/setPointDialog'
    export default {
        name: "examDetail",
      components: {questionItem,examBar,correctPop,setPointDialog},
      computed: {
          isSend() {
            return this.$route.query.type == 1
          }
      },
      data() {
          return {
            correctShow: false,
            setPointShow: false,
          }
      }
    }
</script>

<style lang="less" scoped>
  .exam-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      &__score, &__question-num {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px;
        background: #fff;
      }
      &__question-num {
        background: #f5f5f5;
        justify-content: space-between;
        .set-point {
          border-radius: 10px;
          border: 1px solid #999;
          font-size: 12px;
          padding: 0 7px;
          line-height: 22px;
        }
      }
    }
  }
</style>
