<template>
    <section class="discuss-detail">
      <div class="fs15 mgb20" style="font-weight: bold;">{{$route.query.data.discussName}}</div>
      <div v-html="$route.query.data.discussContent"></div>
    </section>
</template>

<script>
    export default {
        name: "discussDetail"
    }
</script>

<style lang="less" scoped>
  .discuss-detail {
    padding: 10px;
    img{
      width: 100%;
      height: 185px;
      margin-bottom: 10px;
    }
  }
</style>
