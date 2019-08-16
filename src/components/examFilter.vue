<template>
  <!--    <section class="exam-filter-wrap"></section>-->
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="exam-filter-wrap">
<!--      <van-overlay-->
<!--        :show="all||personal||school||share"-->
<!--        @click="all = false;personal=false;school=false;share=false"/>-->

      <div class="exam-filter-wrap__header van-hairline--bottom">
        <div class="exam-filter-wrap__header-tab">
          <span>选择试卷</span>
        </div>
        <van-icon class="icon-close" @click="show=false" name="close"/>
      </div>
      <div class="exam-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="all=!all;personal=false;school=false;share=false" :class="{blue:all}">全部
<!--            <van-icon :name="all?'arrow-up':'arrow-down'"/>-->
          </div>
<!--          <div v-show="all" class="dropdown-menu">-->
<!--            <div class="dropdown-menu-item">上学期</div>-->
<!--            <div class="dropdown-menu-item">下学期</div>-->
<!--          </div>-->
        </div>
        <div >
          <div @click="personal=!personal;all=false;school=false;share=false" :class="{blue:personal}">个人
<!--            <van-icon :name="personal?'arrow-up':'arrow-down'"/>-->
          </div>
<!--          <div v-show="personal" class="dropdown-menu">-->
<!--            <div class="dropdown-menu-item">上学期</div>-->
<!--            <div class="dropdown-menu-item">下学期</div>-->
<!--          </div>-->
        </div>
        <div>
          <div @click="school=!school;personal=false;all=false;share=false" :class="{blue:school}">校内
<!--            <van-icon :name="school?'arrow-up':'arrow-down'"/>-->
          </div>
<!--          <div v-show="school" class="dropdown-menu">-->
<!--            <div class="dropdown-menu-item">上学期</div>-->
<!--            <div class="dropdown-menu-item">下学期</div>-->
<!--          </div>-->
        </div>
        <div>
          <div @click="share=!share;personal=false;school=false;all=false" :class="{blue:share}">共享
<!--            <van-icon :name="share?'arrow-up':'arrow-down'"/>-->
          </div>
<!--          <div v-show="share" class="dropdown-menu">-->
<!--            <div class="dropdown-menu-item">上学期</div>-->
<!--            <div class="dropdown-menu-item">下学期</div>-->
<!--          </div>-->
        </div>
      </div>
      <div class="exam-filter-wrap__body">
        <div class="exam-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
<!--            <div class="course-first van-hairline&#45;&#45;bottom"><span>说和做——记闻一多先生言行片段asdasdasdsads</span>-->
<!--              <van-icon @click="$set(item,'fold',!item.fold)" class="down-arrow"-->
<!--                        :name="item.fold?'arrow-up':'arrow-down'"/>-->
<!--            </div>-->
            <div @click="handleSelect(c)" :class="['course-sec',{active:c.check}]"
                 v-for="(c,ci) in item.child" :key="ci">说和做——记闻一多先生言行片段
              <van-icon v-show="c.check" class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div>
      <div class="exam-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="show=false">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: "examFilter",
    props: ['visible'],
    data() {
      return {
        all: false,
        personal: false,
        school: false,
        share: false,
        courseList: [{child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]},]
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
        }
      }
    },
    methods: {
      handleSelect(item) {
        this.courseList.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v,'check',false)
          })
        })
        this.$set(item,'check',!item.check)
      },
      handleUnit(item) {
        if (item.active) return
        this.unit.forEach(v => {
          v.active = false
        })
        item.active = true
      },
    }
  }
</script>

<style lang="less" scoped>
  .exam-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 35px;
          font-size: 16px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }
      }

      .icon-close {
        font-size: 22px;
        color: #ccc;
      }
    }

    &__dropdown {
      display: flex;
      flex: 0 0 44px;

      > div {
        flex: 1;
        font-size: 16px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
        position: relative;

        &:last-child {
          border-right: none;
        }

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
      display: flex;
      flex: 1;


      &-right {
        flex: 1;
        overflow-y: auto;

        .course-first {
          height: 44px;
          display: flex;
          align-items: center;
          color: #000;
          font-size: 14px;
          padding-right: 10px;
          word-break: break-all;
          justify-content: space-between;

          .down-arrow {
            flex: 0 0 20px;
            text-align: right;
          }
        }

        .course-sec {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 12px;
          padding: 0 5px;
          word-break: break-all;
          border-bottom: 1px solid #ebedf0;
          padding: 0 20px;
          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }
        }
      }
    }
    &__footer{
      flex: 0 0 55px;
      padding: 6px 10px;
      .confirm-btn {
        width: 100%;
        color: #fff;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
