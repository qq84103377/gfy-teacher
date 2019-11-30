<template>
    <section class="res-centre-layout">
      <res-centre :can-back="true"></res-centre>
    </section>
</template>

<script>
  import resCentre from './index'
    export default {
        name: "resCentreWrap",
      components: {resCentre},
      data() {
          return {
          }
      },
    }
</script>

<style lang="less" scoped>

</style>
