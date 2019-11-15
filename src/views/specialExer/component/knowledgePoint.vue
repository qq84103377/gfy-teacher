<template>
  <section class="knowledge-point-wrap">
    <van-cell title="总复习" style="background: #f5f5f5;color: #999" />
    <div class="knowledge-point-wrap__tab">
      <div class="knowledge-point-wrap__tab__wrap">
        <span v-for='item in list' :key='item.name' class='mglt10 mgr10' :class="{knowledgeActive:item.active}" @click="toggleTab(item)">{{item.name}}</span>
      </div>
    </div>
    <div class="knowledge-point-wrap__content">
      <div v-for="item in list2" :key="item">
        <van-cell v-if='item<6666' :title="item" is-link @click="go(item)" />
        <van-collapse v-model="activeNames">
          <van-collapse-item v-if='item>=6666' :title="item" :name="item">
            <van-cell v-for="(i,index) in list2" :key='index' :title="item" is-link style="background: #f5f5f5" @click="go(item)" />
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
      list: [
        { name: '数学方程', value: 'Y01', active: true, child: [] },
        { name: '几何', value: 'Y02', active: false, child: [] },
        { name: '图像化', value: 'Y03', active: false, child: [] },
      ],
      list2: [111, 2222, 3333, 6444, 4555, 5666, 87777, 9888],
      activeNames: ['1']
    }
  },
  methods: {
    toggleTab(item) {
      if (item.active) return
      this.list.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
    },
    go(item) {
      this.$router.push({        path: `/questionList`, query: {
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "courseName": this.$route.query.courseName,
          from: 'examList'
        }      })
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
        background-color: #fff;
      }
    }

    .knowledgeActive {
      background-color: @blue;
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
