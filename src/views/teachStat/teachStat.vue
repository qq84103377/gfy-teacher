<template>
  <div>
    <van-cell title="资源类型" style="background: #f5f5f5;color: #999"/>
    <van-cell title="任务统计" @click="viewTaskStat" is-link/>
    <van-cell title="学情" @click="$router.push(`/studySituation`)" is-link/>
    <van-cell title="家庭报告" @click="$router.push(`/familyReport`)" is-link/>
    <van-cell v-if='showfEduction' title="积分统计" @click="$router.push(`/integralStat`)" is-link/>
  </div>
</template>

<script>
    export default {
        name: "teachStat",
        data() {
          return {
            showfEduction:localStorage.getItem('showfEduction')
          }
        },
      methods: {
          viewTaskStat() {
            try{MobclickAgent.onEvent('clickTeachStatTask')}catch(e){console.log(e)}
            this.$router.push(`/taskStat`)
          }
      }
    }
</script>

<style scoped>

</style>
