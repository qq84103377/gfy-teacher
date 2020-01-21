<template>
  <section class="res-centre-layout">
    <res-centre :can-back="true" ref="centre"></res-centre>
  </section>
</template>

<script>
import resCentre from './index'
export default {
  name: "resCentreWrap",
  components: { resCentre },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        console.log(vm.$refs, "??????????")
      });
    });
  },
   beforeRouteLeave(to, from, next) {
    if (this.$refs['centre'].subjectFilterShow) {
      this.$refs['centre'].subjectFilterShow=false
      next(false)
    } else if (this.$refs['centre'].versionFilterShow) {
      this.$refs['centre'].versionFilterShow = false
      next(false)
    } else if (this.$refs['centre'].areaFilterShow) {
      this.$refs['centre'].areaFilterShow = false
      next(false)
    } else if (this.$refs['centre'].resCourseFilterShow) {
      this.$refs['centre'].resCourseFilterShow = false
      next(false)
    } else if (this.$refs['centre'].addCourseShow) {
      this.$refs['centre'].addCourseShow = false
      next(false)
    } else {
      next()
    }
  },
}
</script>

<style lang="less" scoped>
</style>
