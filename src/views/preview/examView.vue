<template>
  <section class="exam-view-wrap">
    <van-nav-bar
      title="安顺达会计师大家开始打卡机sad啊是的的"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="exam-view-wrap__tab">
      <div @click="handleToggle(true)" :class="{active:classView}">班级查看</div>
      <div @click="handleToggle(false)" :class="{active:!classView}">小组查看</div>
    </div>
    <div class="exam-view-wrap__body">
      <score-table :isSpoken="isSpoken" :classView="true" v-show="classView"></score-table>
      <score-table :isSpoken="isSpoken" v-for="a in 3" :key="a" :classView="false" v-show="!classView"></score-table>
    </div>
  </section>
</template>

<script>
  import scoreTable from '../../components/scoreTable'
  export default {
    name: "examView",
    data() {
      return {
        classView: true, //按班级查看
        isSpoken: true
      }
    },
    created() {
    },
    components: {scoreTable},
    methods: {
      handleToggle(bol) {
        //班级未分组时,无法切换小组查看 弹出toast
        // this.$toast('该班级未分组,无法进行小组查看')
        this.classView = bol
      },
    }
  }
</script>

<style lang="less" scoped>
  .exam-view-wrap {
    flex-direction: column;
    display: flex;

    &__tab {
      flex: 0 0 48px;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > div {
        border-radius: 15px;
        font-size: 15px;
        color: #999;
        background: #F5F6FA;
        margin-right: 20px;
        line-height: 30px;
        padding: 0 15px;

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 0 10px 10px;

    }
  }
</style>
