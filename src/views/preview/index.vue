<template>
  <section class="preview-wrap">
    <dropdown-header :list="list">
      <div slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>
<!--      <div slot="right" ><i class="iconGFY icon-edit-blue"></i> 编辑</div>-->

      <div slot="right" class="preview-wrap-header-right">
        <van-dropdown-menu active-color="none" class="edit-btn">
          <van-dropdown-item title="编辑" ref="dropdown">
            <edit-course :is-edit="true"></edit-course>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

    </dropdown-header>
    <div class="preview-wrap__body">
      <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index" :can-slide="true">
        <div slot="btn" class="btn-group van-hairline--top">
          <div @click="$set(item,'fold',!item.fold)">
            <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
            <span>班级查看</span>
          </div>
          <div>
            <i class="iconGFY icon-edit"></i>
            <span>编辑</span>
          </div>
          <div @click="$router.push(`/statistic`)">
            <i class="iconGFY icon-statistics"></i>
            <span>5/100</span>
          </div>
        </div>
      </list-item>
    </div>
    <div class="preview-wrap__footer van-hairline--top">
      <van-button class="add-mission" type="info">新建任务</van-button>
    </div>

<!--    <edit-course></edit-course>-->
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import dropdownHeader from '../../components/dropdown-header'
  import editCourse from './addCourse'
  export default {
    name: "index",
    components: {listItem,dropdownHeader,editCourse},
    data () {
      return {
        show:false,
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},]
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .preview-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    &__header {
      /*width: 100%;*/
      /*position: absolute;*/
      /*height: 55px;*/
      flex: 0 0 55px;
      padding: 8px 9px;
      color: #16AAB7;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      .add-class {
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
          height: 95%;
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
    &__body {
      flex: 1;
      overflow-y: auto;
      /*padding-top: 55px;*/
    }
    &__footer {
      flex: 0 0 44px;
      padding: 4px 12px;
      .add-mission {
        width: 100%;
        border-radius: 22px;
      }
    }
    .preview-wrap-header-right {
      flex: 0 0 40px;
      .edit-btn {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        /*height: 39px;*/
        &::after {
          border: none;
        }
        @{deep} .van-overlay {
          top: 2px;
        }
        @{deep} .van-dropdown-menu__title{
          font-size: 10px;
          text-align: center;
          display: inline-block;
          &::after {
            right: 6px;
            top: 6px;
            content: none;
          }
          &--down::after{
            top: 10px;
            content: none;
          }
          &::before {
            content: ' ';
            background: url('../../assets/img/icon-edit-blue.png') no-repeat;
            background-size: contain;
            width: 11px;
            height: 10px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
        @{deep} .van-dropdown-item__content {
          max-height: 95%;
          display: flex;
          flex-direction: column;
          overflow-y: hidden;
        }
      }
    }
  }
</style>
