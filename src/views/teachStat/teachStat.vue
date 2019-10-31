<template>
  <div>
    <van-cell title="资源类型" style="background: #f5f5f5;color: #999"/>
    <van-cell title="任务统计" @click="$router.push(`/taskStat`)" is-link/>
    <van-cell title="学情" @click="$router.push(`/studySituation`)" is-link/>
    <van-cell title="家庭报告" @click="$router.push(`/familyReport`)" is-link/>
  </div>
</template>

<script>
    export default {
        name: "teachStat"
    }
</script>

<style scoped>

</style>
