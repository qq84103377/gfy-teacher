<template>
  <section class="task-stat-wrap">
    <van-cell title="题型" class="fs16" style="background: #f5f5f5;color: #999" />
    <van-cell class="fs16" v-for="(item,index) in list" :key="index" :title="item.examTypeName" is-link @click="go(item)" />
    <!-- <van-cell title="单选题" is-link @click="go(item)" />
    <van-cell title="完形填空" is-link @click="go(item)" /> -->
  </section>
</template>

<script>

export default {
  name: "questionType",
  props: ['list','areaCode','courseIds','classGrade'],
  data() {
    return {
      // list: [
      //   { name: '听力理解', value: 'Y01', active: true, child: [] },
      //   { name: '单选题', value: 'Y02', active: false, child: [] },
      //   { name: '完形填空', value: 'Y03', active: false, child: [] },
      // ],

    }
  },
  mounted() {
    console.log("题型 mounted");
    // eventBus.$off("changeVersion")
    // eventBus.$on("changeVersion", ({ textBookId, gradeTermId }, obj) => {
    //   this.textBookId = textBookId
    //   this.gradeTermId = gradeTermId
    //   if (obj) {
    //     //切换学年导致教材切换的时候
    //     this.subjectType = obj.subjectType
    //     this.getTextBookCourseInfo()
    //   } else {
    //     if (this.subjectType) {
    //       //科目已经加载完毕
    //       this.getTextBookCourseInfo()
    //     }
    //   }
    // })
  },
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
