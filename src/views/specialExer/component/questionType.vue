<template>
  <section class="task-stat-wrap">
    <van-cell title="题型" class="fs16" style="background: #f5f5f5;color: #999" />
    <van-cell class="fs16" v-for="(item,index) in list" :key="index" :title="item.examTypeName" is-link @click="go(item)" />
  </section>
</template>

<script>

export default {
  name: "questionType",
  props: ['list','areaCode','courseIds','classGrade'],

  methods: {

    go(item) {
      this.$router.push({path: `/questionList`, query: {
          'item': item,
          'areaCode':this.areaCode,
          'isQuestionType':true,
          'courseIds':this.courseIds,
          'classGrade':this.classGrade?this.classGrade.split('|')[0]:'',
          from: 'questionType'
        }      })
    }
  },

}
</script>

<style lang="less" scoped>
</style>
