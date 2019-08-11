<template>
  <section class="briefing-wrap">
    <div class="briefing-wrap__body">
      <div class="briefing-wrap__body-ctn-wrap black">
        <div class="fs18" style="color: #000">数学练习《同底数幂的乘法》测试卷07-18完成情况简报</div>
        <div class="info-wrap">
          <div>本次联系班级平均分为<span class="orange">80分</span></div>
          <div>最高分为<span class="orange">99分</span></div>
          <div>最低分为<span class="orange">19分</span></div>
        </div>
        <div class="fs10 red">请家长及时关注孩子的完成情况，未提交练习的提醒补做</div>
      </div>
      <div class="briefing-wrap__body-ctn-wrap">
        <div class="fs16">满分(100分) 共计10人</div>
        <div class="pdlt10 fs14">李华,李华</div>
      </div>
    </div>
    <div class="briefing-wrap__footer">
      <van-button type="info" class="share-btn" @click="shareBarShow=true">分享</van-button>
    </div>
    <share-bar :show.sync="shareBarShow"></share-bar>
  </section>
</template>
<script>
  import shareBar from '../../components/shareBar'
  export default {
    name: "briefing",
    components: {shareBar},
    data() {
      return {
        shareBarShow: false
      }
    },
    methods: {
    },
  }
</script>

<style lang="less" scoped>
  .briefing-wrap {
    background: #f5f5f5;
    flex-direction: column;
    display: flex;
    &__body {
      flex: 1;
      overflow-y: auto;
      &-ctn-wrap {
        padding: 10px;
        margin-bottom: 5px;
        background: #fff;
        .info-wrap{
          line-height: 30px;
          font-size: 15px;
        }
      }
    }
    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;
      .share-btn {
        width: 100%;
        color: #fff;
        border-radius: 20px;
        font-size: 18px;
      }
    }
  }
</style>
