<template>
  <section class="task-stat-wrap">
    <van-cell title="题型" style="background: #f5f5f5;color: #999" />
    <van-cell title="听力理解" is-link @click="$router.push('/')" />
    <van-cell title="单选题" is-link @click="$router.push('/')" />
    <van-cell title="完形填空" is-link @click="$router.push('/')" />
  </section>
</template>

<script>
export default {
  name: "questionType"

}
</script>

<style lang="less" scoped>
</style>
