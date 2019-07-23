<template>
  <van-nav-bar
    :title="$route.meta.title"
    left-arrow
    @click-left="$router.back()"
  />
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
    }
  },
  methods: {

  }

}
</script>

<style lang="less" scoped>
@deep: ~">>>";

</style>
