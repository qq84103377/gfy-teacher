<template>
    <section class="my-class-wrap">
      <div class="my-class-wrap__body">
        <van-cell v-for="(value,key) in classList" :key="key" v-if="value.teacherInfoList.some(v => v.subjectType !== 'S20')" :title="value.className" @click="$router.push(`/classDetail?classId=${key}&className=${value.className}`)" is-link/>
        <div v-if="!Object.keys(classList).length" class="empty-page">
          <img src="../../assets/img/empty-2.png" alt />
          <div class="grey9 fs12">当前没有班级！</div>
        </div>
      </div>
    </section>
</template>

<script>
    export default {
        name: "index",
      data() {
          return {
            classList: JSON.parse(localStorage.classMap)
          }
      },
      methods: {

      }
    }
</script>

<style lang="less" scoped>
  .my-class-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
