<template>
  <section class="board-list">
    <div class="board-list__tab">
      <div @click="tabIndex=0" class="van-hairline--right" :class="{active:!tabIndex}">教师白板</div>
      <div @click="tabIndex=1" :class="{active:tabIndex}">学生白板</div>
    </div>
    <div class="board-list__body">
      <list-item @clickTo="$router.push(`/boardDetail`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                 :can-slide="true">
<!--        <div slot="badge"><i class="iconGFY icon-send"></i></div>-->
        <div slot="cover" class="cover"><i class="iconGFY icon-img"></i></div>
        <div slot="desc">
          <div class="desc-top">
            <i class="iconGFY icon-personal" ></i>
            <i class="iconGFY icon-choice"></i>
          </div>
          <div class="desc-bottom">
            <div><i class="iconGFY icon-feather"></i>裘千仞</div>
          </div>
        </div>
      </list-item>

    </div>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  export default {
    name: "boardList",
    components: {listItem},
    data() {
      return {
        tabIndex: 0,
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},],
      }
    }
  }
</script>

<style lang="less" scoped>
  .board-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__tab {
      background: #fff;
      flex: 0 0 44px;
      display: flex;
      align-items: center;
      >div {
        flex: 1;
        color: #333;
        font-size: 16px;
        text-align: center;
        line-height: 44px;
        &.active {
          color: @blue;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
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
        display: flex;
        margin: 3px 0;
        .iconGFY {
          margin-right: 5px;
        }
      }
      .desc-bottom {
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
