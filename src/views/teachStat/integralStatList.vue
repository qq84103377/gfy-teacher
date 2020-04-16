<template>
  <div>
    <van-cell title="统计类型" style="background: #f5f5f5;color: #999" />
    <van-cell title="学生积分" is-link @click="goTo(0)" />
    <van-cell title="家长积分" is-link @click="goTo(1)" />
  </div>
</template>

<script>
export default {
  name: 'integralStatList',
  methods: {
    goTo(isParent, path) {
      if (!this.$parent.isAnotherPost) {
        if (isParent) {
          if (!this.$parent.openfEduction) {
            this.$toast('您尚未开通家庭教育权限！')
            return
          }
        } else {
          if (!this.$parent.isMaster) {
            this.$toast('只有班主任有权查看')
            return
          }
        }
        this.$router.push({
          path: '/integralDetail',
          query: {
            isParent,
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
          }
        })
      } else {
        this.$router.push({
          path: '/integralDetail',
          query: {
            isParent,
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
          }
        })
      }
    },

  }
}
</script>

<style>
</style>