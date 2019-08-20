<template>
  <section class="in-class-wrap">
    <dropdown-header :list="list">
      <div slot="left" class="fs14" @click="">上一课</div>
      <div slot="right" class="fs14">下一课</div>
    </dropdown-header>
    <div class="in-class-wrap__body">
      <van-cell class="fs16" title="讲义" is-link to="lectureList" />
      <van-cell class="fs16" title="白板" is-link to="boardList" />
      <van-cell class="fs16" title="堂测统计" is-link to="classStatList" />
    </div>
  </section>
</template>

<script>
  import dropdownHeader from '../../components/dropdown-header'

  export default {
    name: "index",
    components: {dropdownHeader},
    data() {
      return {
        show: false,
        list: [{name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1},]
      }
    }
  }
</script>

<style lang="less" scoped>
  .in-class-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    &__body {
      margin-top: 10px;
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
