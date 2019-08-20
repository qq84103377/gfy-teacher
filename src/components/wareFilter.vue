<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="ware-filter-wrap">
      <div class="ware-filter-wrap__header van-hairline--bottom">
        <div class="ware-filter-wrap__header-tab">
          <span>选择课件</span>
          <van-icon class="icon-close" @click="show=false" name="close"/>
        </div>
      </div>
      <div class="ware-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="all=!all;personal=false;school=false;share=false" :class="{blue:all}">全部
          </div>
        </div>
        <div >
          <div @click="personal=!personal;all=false;school=false;share=false" :class="{blue:personal}">个人
          </div>
        </div>
        <div>
          <div @click="school=!school;personal=false;all=false;share=false" :class="{blue:school}">校内
          </div>
        </div>
        <div>
          <div @click="share=!share;personal=false;school=false;all=false" :class="{blue:share}">共享
          </div>
        </div>
      </div>
      <div class="ware-filter-wrap__body">
        <div class="ware-filter-wrap__body-left">
          <div @click="handleType(item)" v-for="(item,index) in typeList" :key="index" :class="{active:item.active}">{{item.name}}</div>
        </div>
        <div class="ware-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div @click="handleSelect(c)" :class="['cell__item',{active:c.check}]"
                 v-for="(c,ci) in item.child" :key="ci">说和做——记闻一多先生言行片段
              <van-icon v-show="c.check" class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div>
      <div class="ware-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="show=false">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: "wareFilter",
    props: ['visible'],
    data() {
      return {
        all: false,
        personal: false,
        school: false,
        share: false,
        typeList: [{name:'课件'},{name:'视频'},{name:'试卷'}],
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
        this.$set(item,'check',!item.check)
      },
      handleType(item) {
        if (item.active) return
        this.typeList.forEach(v => {
          this.$set(v,'active',false)
        })
        this.$set(item,'active',true)
      },
    }
  }
</script>

<style lang="less" scoped>
  .ware-filter-wrap {
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
        text-align: center;
        position: relative;
        span {
          font-weight: bold;
          font-size: 18px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }
        .icon-close {
          font-size: 22px;
          color: #ccc;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
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
        flex: 0 0 95px;
        overflow-y: auto;
        >div {
          text-align: center;
          line-height: 44px;
          font-size: 15px;
          border-left: 2.5px solid transparent;
          &.active {
            color: @blue;
            border-left: 2.5px solid #16aab7;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;



        .cell__item {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
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
