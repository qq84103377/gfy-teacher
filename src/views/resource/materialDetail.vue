<template>
    <section class="material-detail">
      <van-nav-bar
        title="安顺达会计师大家开始打卡机sad啊是的的"
        @click-left="$router.back()"
        left-arrow>
      </van-nav-bar>
      <div class="material-detail__body">
        <img src="../../assets/img/banner.png" alt="">
        <list-item class="mgt10">
          <div slot="cover" class="cover"><i class="iconGFY icon-video"></i></div>
          <div slot="desc">
            <div class="desc-top">
              发布者:高分云语文1
            </div>
            <div class="desc-bottom">
              <div><van-icon name="clock-o"></van-icon>2019-06-03 14:51:45</div>
              <div><i class="iconGFY icon-points"></i>10</div>
              <div><i class="iconGFY icon-download"></i>10</div>
            </div>
          </div>
        </list-item>

      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  export default {
        name: "materialDetail",
    components: {listItem},
  }
</script>

<style lang="less" scoped>
  .material-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      padding: 10px;
      flex: 1;
      overflow-y: auto;
      >img {
        width: 100%;
        height: 350px;
      }
      .cover{
        background: #F3D233;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .desc-top {
        font-size: 10px;
        color: #666;
      }
      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;
        justify-content: flex-start;
        .iconGFY {
          margin-right: 3px;
        }
        >div {
          margin-right: 6px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
