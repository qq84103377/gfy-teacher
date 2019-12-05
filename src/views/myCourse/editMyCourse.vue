<template>
  <edit-course :is-edit="true" :is-from-course='true' :editCourseInfo.sync="currentTchCourseInfo" class="editClass" @onFinish='toggle'></edit-course>
</template>

<script>
import eventBus from "@/utils/eventBus";
import editCourse from '../preview/addCourse'

export default {
  name: 'editMyCourse',
  components: { editCourse },
  data() {
    return {
      currentTchCourseInfo: {},
    }
  },
  created() {
    this.currentTchCourseInfo = this.$route.query.currentTchCourseInfo
  },
  methods: {
    toggle() {
      eventBus.$emit('editMyCourse')
      this.$router.back()
    }
  },
}
</script>

<style>
</style>