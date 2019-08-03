<template>
  <section class="stu-analyse">
    <van-nav-bar
      title="李华的做题情况"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <analyse-wrap>
      <div class="scroll-tab" slot="tab">
        <div class="scroll-tab__item" v-for="(item,index) in list" :key="index">
          <div class="scroll-tab__item-icon" :class="handleStyle(item)"><i v-if="item!=4" class="iconGFY" :class="'icon-'+handleStyle(item)"></i></div>
          <div class="black fs10">第{{index}}题</div>
        </div>
      </div>
      <div class="stu-analyse__body">
        <div class="stu-analyse__body-top">
          <div style="color: #e90707;text-align: right;" class="fs18">5分</div>
          <div>山lǎng  rùn（ ）起来了，水涨起来了，太阳的脸红起来了。</div>
          <div>A 朗润</div>
          <div>A 朗润</div>
          <div>A 朗润</div>
          <div>A 朗润</div>
          <div>正确答案: <span class="blue">A</span></div>
          <div>答案解析:</div>
          <div>【题型讲解】词语运用的题型为选择题，主要有两种命题形式：一是判断词语运用的对.</div>
        </div>
        <div class="stu-analyse__body-bottom">
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
    name: "stuAnalyse",
    components: {analyseWrap},
    data() {
      return {
        list: [
          1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,
        ]
      }
    },
    methods: {
      handleStyle(status) {
          if(status==1) {
            return 'somewhat'
          } else if (status==2) {
            return 'error'
          } else if (status==3) {
            return 'correct'
          } else {
            return 'undo'
          }
      }
    }
  }
</script>

<style lang="less" scoped>
  .stu-analyse {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    .scroll-tab {
      flex: 0 0 71px;

      &__item {
        text-align: center;
        flex: 0 0 35px;
        border-radius: 50%;
        font-size: 12px;
        color: #777;
        margin-right: 15px;

        &-icon {
          width: 35px;
          height: 35px;
          line-height: 35px;
          margin-bottom: 5px;
          border-radius: 50%;
          &.somewhat {
            background: #ffcb3c;
          }
          &.error {
            background: #FF7484;
          }
          &.correct {
            background: #57E49D;
          }
          &.undo {
            background: #ddd;
            &::after {
              content: '未做';
              font-size: 12px;
              color: #333;
            }
          }
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
