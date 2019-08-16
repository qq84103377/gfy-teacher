<template>
    <section class="question-list">
      <van-overlay
        :show="tab.questionType||tab.difficult||tab.type||tab.sort"
        @click="tab.questionType=false;tab.difficult=false;tab.type=false;tab.sort=false;"/>
      <div class="question-list__tab">
          <div>
            <div class="dropdown__title" @click="tab.questionType=!tab.questionType">
              <div class="ellipsis">题型</div>
              <van-icon :name="tab.questionType?'arrow-up':'arrow-down'"/>
            </div>
            <div v-show="tab.questionType" class="dropdown-menu">
              <div class="dropdown-menu-item">上学期</div>
              <div class="dropdown-menu-item">下学期</div>
            </div>
          </div>
          <div >
            <div class="dropdown__title" @click="tab.difficult=!tab.difficult">
              <div class="ellipsis">难度</div>
              <van-icon :name="tab.difficult?'arrow-up':'arrow-down'"/>
            </div>
            <div v-show="tab.difficult" class="dropdown-menu">
              <div class="dropdown-menu-item">简单</div>
              <div class="dropdown-menu-item">中等</div>
              <div class="dropdown-menu-item">困难</div>
            </div>
          </div>
          <div>
            <div class="dropdown__title" @click="tab.type=!tab.type">
              <div class="ellipsis">类型</div>
              <van-icon :name="tab.type?'arrow-up':'arrow-down'"/>
            </div>
            <div v-show="tab.type" class="dropdown-menu">
              <div class="dropdown-menu-item">上学期</div>
              <div class="dropdown-menu-item">下学期</div>
            </div>
          </div>
          <div>
            <div class="dropdown__title" @click="tab.sort=!tab.sort">
              <div class="ellipsis">排序</div>
              <van-icon :name="tab.sort?'arrow-up':'arrow-down'"/>
            </div>
            <div v-show="tab.sort" class="dropdown-menu">
              <div class="dropdown-menu-item">时间</div>
              <div class="dropdown-menu-item">使用率</div>
              <div class="dropdown-menu-item">收藏量</div>
            </div>
          </div>
      </div>
      <div class="question-list__body">
        <div class="question-num">1.选择题</div>
        <question-item :can-move="a>1&&a<20" :is-question="true" :is-send="false" v-for="a in 20" :key="a" :index="a"></question-item>

      </div>
      <exam-bar></exam-bar>
    </section>
</template>

<script>
  import questionItem from '../../components/questionItem'
  import examBar from '../../components/examBar'

  export default {
        name: "questionList",
    components: {questionItem,examBar},
    data() {
          return {
            tab: {
              questionType: false,
              difficult: false,
              type: false,
              sort: false,
            }
          }
      }
    }
</script>

<style lang="less" scoped>
  .question-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__tab {
      flex: 0 0 44px;
      display: flex;
      background: #fff;
      .ellipsis {
        text-align: center;
        overflow : hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dropdown__title {
        max-width: 100%;
        position: relative;
        padding: 0 8px;
        i {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      > div {
        flex: 1;
        font-size: 14px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        /*border-right: 1px solid #ccc;*/
        position: relative;
        min-width: 0;
        /*&:last-child {*/
        /*  border-right: none;*/
        /*}*/

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }
    }
    &__body {
      flex: 1;
      overflow-y: auto;
      .question-num {
        line-height: 45px;
        padding: 0 10px;
      }
    }
  }
</style>
