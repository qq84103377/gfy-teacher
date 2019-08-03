<template>
    <section class="subject-analyse">
      <analyse-wrap>
        <div class="scroll-tab" slot="tab">
          <div class="scroll-tab__item" v-for="a in 15" :key="a">{{a}}</div>
        </div>
        <div class="subject-analyse__body">
          <div class="subject-analyse__body-top">
            <div>山lǎng  rùn（     ）起来了，水涨起来了，太阳的脸红起来了。</div>
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>A 朗润</div>
            <div>正确答案: <span class="blue">A</span></div>
            <div>答案解析:</div>
            <div>【题型讲解】词语运用的题型为选择题，主要有两种命题形式：一是判断词语运用的对.</div>
          </div>
          <div class="subject-analyse__body-bottom">
            <div class="mgb20">答案为A的同学:</div>
            <div style="display: flex;flex-wrap: wrap;" class="pdlt10">
              <div v-for="a in 50" :key="a" class="mgr10">李老味<span style="color: #FF4141">(错误率: 100%)</span></div>
            </div>
          </div>
        </div>
      </analyse-wrap>
    </section>
</template>

<script>
  import analyseWrap from '../../components/analyseWrap'
    export default {
        name: "subjectAnalyse",
      components:{analyseWrap}
    }
</script>

<style lang="less" scoped>
  .subject-analyse {
    background: #f5f5f5;
    .scroll-tab {
      &__item {
        text-align: center;
        flex: 0 0 35px;
        line-height: 35px;
        height: 35px;
        background: #eee;
        border-radius: 50%;
        font-size: 12px;
        color: #777;
        margin-right: 10px;

        &.active {
          color: #fff;
          background: @blue;
        }
      }
    }
    &__body {
      height: 100%;
      font-size: 12px;
      &-top {
        margin-bottom: 10px;
        padding: 12px 15px;
        background: #fff;
      }
      &-bottom {
        padding: 12px 15px;
        background: #fff;

      }
    }
  }
</style>
