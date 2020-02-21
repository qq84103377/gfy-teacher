<template>
    <section class="course-packet-wrap">
      <van-nav-bar title="寒假作业" @click-left="goBack" left-arrow>
        <div slot="right" class="fs12 blue" @click="">定制作业</div>
      </van-nav-bar>
      <div class="course-packet-wrap__tab">
        <div class="blue">发布</div>
        <div class="van-hairline--left">检测</div>
      </div>
      <div class="course-packet-wrap__filter">
        <van-cell title="筛选" style="background: #f5f5f5;color: #999"></van-cell>
      </div>
    </section>
</template>

<script>
    export default {
        name: "index",
      methods:{
        goBack(){
          this.common.goBack(this)
        },
      }
    }
</script>

<style lang="less" scoped>
  .course-packet-wrap{
    background: #f5f5f5;
    flex-direction: column;
    display: flex;
    &__tab{
      display: flex;
      background: #fff;
      >div{
        text-align: center;
        line-height: 44px;
        font-size: 16px;
      }
    }
  }
</style>
