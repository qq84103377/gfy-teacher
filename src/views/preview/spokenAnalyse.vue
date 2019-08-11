<template>
    <section class="spoken-analyse">
      <van-nav-bar
        title="题目分析"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="spoken-analyse__topic" v-if="$route.query.type == 'analyse'">app</div>
     <div class="play-all-wrap"> <div class="play-all" v-if="$route.query.type == 'personal'">播放全部</div></div>
      <div class="spoken-analyse__body">
        <spoken-table :type="$route.query.type"></spoken-table>
      </div>
      <div class="spoken-analyse__footer"  v-if="$route.query.type == 'analyse'">
        <van-button class="btn mgr10" type="info">上一题</van-button>
        <van-button class="btn" type="info">下一题</van-button>
      </div>
    </section>
</template>

<script>
  import spokenTable from '../../components/spokenTable'
    export default {
        name: "spokenAnalyse",
      components: {spokenTable},
      computed: {
      }
    }
</script>

<style lang="less" scoped>
  .spoken-analyse {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__topic {
      flex: 0 0 50px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .play-all-wrap {
      margin-top: 24px;
      padding: 10px 10px 0;
      background: #fff;
      .play-all {
        background: #E0FFFC;
        width: 85px;
        line-height: 25px;
        border-radius: 12px;
        font-size: 12px;
        color: @blue;
        position: relative;
        padding-left: 25px;
        &::before {
          content: '';
          width: 0px;
          height: 0px;
          border-width:0 6px 9px;
          border-style:solid;
          border-color:transparent transparent @blue;
          transform: translateY(-50%) rotateZ(90deg);
          position: absolute;
          left: 8px;
          top: 50%;
        }
      }

    }

    &__body {
      flex: 1;
      overflow-y: auto;
      background: #fff;
      padding: 10px;
    }
    &__footer {
      flex: 0 0 55px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 18px;
      .btn {
        flex: 1;
        border-radius: 20px;
        font-size: 18px;
        color: #fff;
      }
    }
  }
</style>
