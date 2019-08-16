<template>
  <!--    <section class="course-filter-wrap"></section>-->
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="course-filter-wrap">
      <van-overlay
        :show="gradeDropdown||termDropdown||versionDropdown"
        @click="gradeDropdown = false;termDropdown=false;versionDropdown=false"/>

      <div class="course-filter-wrap__header van-hairline--bottom">
        <div class="course-filter-wrap__header-tab">
          <span :class="{'active':item.active}" v-for="(item,index) in subjectList" :key="index"
                @click="handleSubject(item)">{{item.name}}</span>
        </div>
        <van-icon class="icon-close" @click="show=false" name="close"/>
      </div>
      <div class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="gradeDropdown=!gradeDropdown">年级
            <van-icon :name="gradeDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item">上学期</div>
            <div class="dropdown-menu-item">下学期</div>
          </div>
        </div>
        <div >
          <div @click="termDropdown=!termDropdown">学期
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item">上学期</div>
            <div class="dropdown-menu-item">下学期</div>
          </div>
        </div>
        <div>
          <div @click="versionDropdown=!versionDropdown">版本
            <van-icon :name="versionDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="versionDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item">上学期</div>
            <div class="dropdown-menu-item">下学期</div>
          </div>
        </div>
      </div>
      <div class="course-filter-wrap__body">
        <div class="course-filter-wrap__body-left">
          <div :class="{'active':item.active}" v-for="(item,index) in unit" :key="index" @click="handleUnit(item)">
            {{item.name}}
          </div>
        </div>
        <div class="course-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div class="course-first van-hairline--bottom"><span>说和做——记闻一多先生言行片段asdasdasdsads</span>
              <van-icon @click="$set(item,'fold',!item.fold)" class="down-arrow"
                        :name="item.fold?'arrow-up':'arrow-down'"/>
            </div>
            <div @click="handleSelect(c)" :class="['course-sec',{active:c.check}]" v-show="item.fold"
                 v-for="(c,ci) in item.child" :key="ci">说和做——记闻一多先生言行片段
              <van-icon v-show="c.check" class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div>
      <div class="course-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="show=false">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: "courseFilter",
    props: ['visible'],
    data() {
      return {
        gradeDropdown: false,
        termDropdown: false,
        versionDropdown: false,
        unit: [{name: '语文', active: false}, {name: '语文', active: false}, {name: '语文', active: false}, {
          name: '语文',
          active: false
        },],
        subjectList: [{name: '语文', active: false}, {name: '数学', active: false}, {name: '音乐', active: false},],
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
      handleSubject(item) {
        if (item.active) return
        this.subjectList.forEach(v => {
          v.active = false
        })
        item.active = true
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
  .course-filter-wrap {
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

      &-left {
        flex: 0 0 125px;
        overflow-y: auto;

        > div {
          line-height: 44px;
          color: #000;
          font-size: 15px;
          text-align: center;
          border-left: 3px solid transparent;

          &.active {
            border-left: 3px solid #16aab7;
            color: @blue;
          }
        }
      }

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

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }

          &:last-child {
            border-bottom: 1px solid #ebedf0;
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
