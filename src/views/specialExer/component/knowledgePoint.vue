<template>
  <section class="knowledge-point-wrap">
    <van-cell title="总复习" style="background: #f5f5f5;color: #999" />
    <div class="knowledge-point-wrap__tab">
      <div class="knowledge-point-wrap__tab__wrap">
        <span v-for='item in list' :key='item' class='mglt10 mgr10' style="background: #fff;borderRadio:20%" :class="{knowledgeActive:item.active}" @click="toggleTab(item)">数与式22</span>
      </div>
    </div>
    <div class="knowledge-point-wrap__content">
      <div v-for="item in list2" :key="item">
        <van-cell v-if='item<6666' :title="item" is-link @click="" />
        <van-collapse v-model="activeNames">
          <van-collapse-item v-if='item>=6666' :title="item" :name="item">
            <van-cell v-for="(i,index) in list2" :key='index' :title="item" is-link @click="" style="background: #f5f5f5" />
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: "knowledgePoint",
  data() {
    return {
      list: [1, 2, 3, 6, 4, 5, 8, 9],
      list2: [111, 2222, 3333, 6444, 4555, 5666, 87777, 9888],
      activeNames: ['1']
    }
  },
  methods: {
    toggleTab(item) {
      item.active = true
    }
  },

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.knowledge-point-wrap {
  &__tab {
    width: 100%;
    position: relative;
    overflow-x: scroll;
    height: 40px;
    line-height: 40px;

    &__wrap {
      height: 100%;
      overflow-x: scroll;
      white-space: nowrap;
      display: flex;

      > span {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 24px;
      }
    }

    .knowledgeActive {
      background-color: #39f0dd;
      color: #fff;
    }
  }

  &__content {
    @{deep} .van-collapse-item__content {
      padding: 0;
    }
  }
}
</style>
