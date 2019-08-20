<template>
    <section class="class-stat-list">
      <div class="class-stat-list__body">
        <list-item @clickTo="$router.push(`/examDetail?type=1`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                   :can-slide="true">
          <div slot="desc">
<!--            <div class="desc-top">-->
<!--              <i class="iconGFY icon-personal" ></i>-->
<!--              <i class="iconGFY icon-choice"></i>-->
<!--            </div>-->
            <div class="desc-bottom">
              <div>龙剑智慧一般:2019-07-04 14:42:00 -- 2019-07-31 14:42:00</div>
            </div>
          </div>
          <div slot="btn" class="btn-group van-hairline--top">
            <div @click="$router.push(`/statistic?type=inClass`)">
              <i class="iconGFY icon-statistics"></i>
              <span>5/100</span>
            </div>
          </div>
        </list-item>

      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  export default {
        name: "classStatList",
    components: {listItem},
    data() {
      return {
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},],
        popShow: false,
      }
    }
  }
</script>

<style lang="less" scoped>
  .class-stat-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .desc-top {
        display: flex;
        margin: 3px 0;
        .iconGFY {
          margin-right: 5px;
        }
      }
      .desc-bottom {
        margin-top: 18px;
        display: flex;
        font-size: 12px;
        color: #666;
        .iconGFY {
          margin-right: 3px;
        }
        >div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
