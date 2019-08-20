<template>
  <section class="resource-wrap">
    <dropdown-header :list="list">
      <div slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>
      <div slot="right" class="resource-wrap-header-right">
        <van-dropdown-menu active-color="none" class="edit-btn">
          <van-dropdown-item title="编辑" ref="dropdown">
<!--            <edit-course :is-edit="true"></edit-course>-->
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

    </dropdown-header>
    <div class="resource-wrap__body">
      <van-cell class="fs16" title="微课" is-link to="lessonList" />
      <van-cell class="fs16" title="素材" is-link to="materialList" />
      <van-cell class="fs16" title="试卷" is-link to="examList" />
      <van-cell class="fs16" title="试题" is-link to="questionList" />
      <van-cell class="fs16" title="讨论" is-link to="discussList" />
      <van-cell class="fs16" title="口语" is-link to="spokenList" />
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
  @deep: ~'>>>';
  .resource-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    &__header {
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
    .resource-wrap-header-right {
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
    &__body {
      margin-top: 5px;
    }
  }
</style>
