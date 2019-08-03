<template>
    <section class="analyse-wrap">
<!--      <div class="analyse-wrap__tab">-->
        <slot name="tab"></slot>
<!--      </div>-->
      <div class="analyse-wrap__body">
        <slot></slot>
      </div>
      <div class="analyse-wrap__footer">
        <van-button class="btn mgr10" type="info">上一题</van-button>
        <van-button class="btn" type="info">下一题</van-button>
      </div>
    </section>
</template>

<script>
    export default {
        name: "analyseWrap"
    }
</script>

<style lang="less" scoped>
  .analyse-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    &__tab {
      flex: 0 0 55px;
      background: #f5f5f5;
    }
    &__body {
      flex: 1;
      overflow-y: auto;
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
<style lang="less">
  .analyse-wrap {
    .scroll-tab {
      padding: 0 10px;
      display: flex;
      white-space: nowrap;
      width: 100%;
      overflow-x: auto;
      flex: 0 0 55px;
      background: #f5f5f5;
      align-items: center;
    }
  }
</style>
