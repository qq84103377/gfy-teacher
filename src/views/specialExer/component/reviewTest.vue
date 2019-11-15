<template>
  <section class="review-test-wrap">
    <van-cell title="试卷" style="background: #f5f5f5;color: #999" />
    <div v-if="!list && list.length==0" style="text-align: center;color: #999999">
      <img class="null-tips" src="../../../assets/img/preview/board_empty.png" alt />
    </div>
    <div v-else>
      <van-cell v-for='item in list' :key='item' @click='go(item)'>
        <template slot="title">
          <div class="fs18">我是邓稼先的题我是邓稼先的微课邓稼微...</div>
          <div class="fs14 grey6 mgt5">
            <span class="mgr10">听力笔试套卷</span>
            <span>模拟</span>
          </div>
        </template>
      </van-cell>
    </div>
    <van-cell style="background: #f5f5f5;color: #999">
      <template slot="title">
        <span class="custom-title">为您推荐</span>
        <span class="red fs10">
          已推荐102套同教材复习套卷
        </span>
      </template>
    </van-cell>
    <div v-if="list.length==0" style="text-align: center;color: #999999">
      <img class="null-tips" src="../../../assets/img/preview/board_empty.png" alt />
    </div>
    <div v-else>
      <van-cell v-for='item in list' :key='item' @click='go(item)'>
        <template slot="title">
          <div class="fs18">我是邓稼先的题我是邓稼先的微课邓稼微...</div>
          <div class="fs14 grey6 mgt5">
            <span class="mgr10">听力笔试套卷</span>
            <span>模拟</span>
          </div>
        </template>
      </van-cell>
    </div>
  </section>
</template>

<script>
export default {
  name: "reviewTest",
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7]
    }
  },
  methods: {
    go(item) {
      this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${this.classGrade}&title=${item.testPaperName}`)
    }
  },

}
</script>

<style lang="less" scoped>
.fs18 {
  height: 44px;
  line-height: 44px;
}
.fs14 {
  height: 30px;
  line-height: 30px;
}
</style>
