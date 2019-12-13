<template>
  <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" />
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
    }
  },
  methods: {
    goBack() {
      this.common.goBack(this)
    },
  }

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
</style>
