<template>
  <section class="lecture-list">
    <div class="lecture-list__body">
      <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                 :can-slide="true">
        <div slot="badge"><i class="iconGFY icon-send"></i></div>
        <div slot="cover" class="cover"><i class="iconGFY icon-pdf"></i></div>
        <div slot="desc">
          <div class="desc-top">
            <i class="iconGFY icon-personal" ></i>
            <i class="iconGFY icon-choice"></i>
          </div>
          <div class="desc-bottom">
            <div><i class="iconGFY icon-feather"></i>裘千仞</div>
            <div><i class="iconGFY icon-download"></i>0</div>
            <div><i class="iconGFY icon-points"></i>0</div>
            <div><i class="iconGFY icon-star"></i>0</div>
          </div>
        </div>
      </list-item>

    </div>
    <div class="lecture-list__footer">
      <van-button type="info" class="btn" @click="popShow=true">选择课件</van-button>
    </div>

    <ware-filter :visible.sync="popShow"></ware-filter>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import wareFilter from '../../components/wareFilter'
  export default {
    name: "lectureList",
    components: {listItem,wareFilter},
    data() {
      return {
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},],
        popShow: false,
      }
    }
  }
</script>

<style lang="less" scoped>
  .lecture-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
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
    &__footer {
      background: #fff;
      flex: 0 0 55px;
      padding: 5px 10px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
