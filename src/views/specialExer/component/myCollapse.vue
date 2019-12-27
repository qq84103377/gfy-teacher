<template>
  <div id="myCollapse">
    <div v-for="(item,index) in data.child" :key="index">
      <van-cell v-if='!item.child.length' :title="item.nodeName" :class="item.cName" is-link @click="go(item,index)" />
      <van-collapse v-model="activeNames">
        <van-collapse-item v-if='item.child.length' :title="item.nodeName" :name="item.nodeName" :class="item.cName">

          <myCollapse v-if='item.child.length' :data.sync='item' @goPage='go'></myCollapse>

        </van-collapse-item>
      </van-collapse>
    </div>
  </div>

</template>

<script>
import myCollapse from './myCollapse'

export default {
  name: "myCollapse",
  props: ['data', 'className'],
  data() {
    return {
      activeNames: ['1'],
      activeNames1: ['1'],
      toggleFirst: false
    }
  },
  created() {
    console.log(this.data, '/????');
  },
  methods: {
    go(item, index) {
      this.$emit('goPage', item)
    }
  },

}
</script>

<style lang="less" scoped>
@deep: ~">>>";

@{deep} .van-collapse-item__content {
  padding: 0;
}
.row1 {
  &.van-cell {
    font-size: 14px;
  }
  @{deep} .van-collapse-item__title {
    font-size: 16px;
  }
}
.row2 {
  &.van-cell {
    background-color: #f0f0f0;
    padding-left: 25px;
    font-size: 14px;
  }
  @{deep} .van-collapse-item__title {
    background-color: #f0f0f0;
    padding-left: 25px;
    font-size: 14px;
  }
}

.row3 {
  &.van-cell {
    background-color: #f0f0f0;
    padding-left: 40px;
    font-size: 12px;
  }
  @{deep} .van-collapse-item__title {
    background-color: #f0f0f0;
    padding-left: 40px;
    font-size: 12px;
  }
}

.row4 {
  &.van-cell {
    background-color: #f0f0f0;
    padding-left: 55px;
    font-size: 10px;
  }
  @{deep} .van-collapse-item__title {
    background-color: #f0f0f0;
    padding-left: 55px;
    font-size: 10px;
  }
}

.row5 {
  &.van-cell {
    background-color: #f0f0f0;
    padding-left: 70px;
    font-size: 10px;
  }
  @{deep} .van-collapse-item__title {
    background-color: #f0f0f0;
    padding-left: 70px;
    font-size: 10px;
  }
}
</style>
