<template>
  <div class="dropdown-header van-hairline--bottom">
    <slot name="left"></slot>
    <van-dropdown-menu active-color="none" class="dropdown-btn">
      <van-dropdown-item title="筛选" ref="dropdown">
        <div style="flex: 1;overflow-y: auto" class="pd10">
          <div v-for="(item,index) in list" :key="index" class="list-wrap">
            <list-item :fold="item.fold" class="mgt10" style="background: #fff;">
              <div @click="$set(item,'fold',!item.fold)" slot="btn" class="fs10" style="text-align: right"><i class="iconGFY icon-ellipsis"></i></div>
            </list-item>
          </div>
        </div>
        <div class="folder-btn" @click="$refs['dropdown'].toggle({show:false})"><i class="iconGFY icon-fold"></i></div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <slot name="right"></slot>
  </div>
</template>

<script>
  import listItem from './list-item'
    export default {
        name: "dropdown-header",
      props: ['list'],
      components: {listItem}
    }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .dropdown-header {
    flex: 0 0 55px;
    padding: 8px 9px;
    color: #16AAB7;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .btn-left {
      background: #e0fffc;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 66px;
      height: 27px;
      border-radius: 13px;
    }
    .dropdown-btn {
      background: #e0fffc;
      font-size: 14px;
      border-radius: 20px;
      width: 230px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 39px;
      &::after {
        border: none;
      }
      @{deep} .van-overlay {
        top: 2px;
      }
      @{deep} .van-dropdown-menu__title{
        text-align: center;
        padding-right: 10px;
        width: 170px;
        display: inline-block;
        overflow : hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &::after {
          right: 6px;
          top: 6px;
          content: '';
        }
        &--down::after{
          top: 10px;
          content: '';
        }
      }
      @{deep} .van-dropdown-item__content {
        max-height: 95%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
      }
      .list-wrap{
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .folder-btn {
        width: 100%;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
