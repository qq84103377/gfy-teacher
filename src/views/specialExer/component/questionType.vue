<template>
  <section class="task-stat-wrap">
    <van-cell title="题型" style="background: #f5f5f5;color: #999" />
    <van-cell v-for="(item,index) in list" :key="index" :title="item.name" is-link @click="go(item)" />
    <!-- <van-cell title="单选题" is-link @click="go(item)" />
    <van-cell title="完形填空" is-link @click="go(item)" /> -->
  </section>
</template>

<script>
export default {
  name: "questionType",
  data() {
    return {
      list: [
        { name: '听力理解', value: 'Y01', active: true, child: [] },
        { name: '单选题', value: 'Y02', active: false, child: [] },
        { name: '完形填空', value: 'Y03', active: false, child: [] },
      ],
    }
  },
  methods: {
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
</style>
