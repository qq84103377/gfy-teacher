<template>
  <!--  更多-->
  <van-popup v-model="show" round position="bottom" :style="{ height: '93%' }">
    <div class="grade-pop-wrap">
      <van-icon @click="closePop" class="close" name="close" />
      <div class="grade-pop-wrap__title van-hairline--bottom">更多</div>
      <div class="grade-pop-wrap__body-more">
        <van-cell>
          类型
        </van-cell>
        <div class="grade-pop-wrap__body__group-wrap">
          <div @click="handleSelectChild(s,0)" v-for="(s, si) in reviewtypeList" :key="si" :class="[
                'grade-pop-wrap__body__group-wrap-item',
                { active: s.active }
              ]">
            {{ s.name }}
          </div>
        </div>
        <van-cell>
          年份
        </van-cell>
        <div class="grade-pop-wrap__body__group-wrap">
          <div @click="handleSelectChild(s,1)" v-for="(s, si) in yearList" :key="si" :class="[
                'grade-pop-wrap__body__group-wrap-item',
                { active: s.active }
              ]">
            {{ s.name }}
          </div>
        </div>
      </div>
      <div class="grade-pop-wrap__footer">
        <van-button class="btn" type="info" @click="confirm()">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'moreFilter',
  props: ['visible', 'label', 'yearList', 'reviewtypeList', 'reviewTypeItem', 'reviewType', 'yearItem', 'changeMore'],
  data() {
    return {
      tempYearList: [],
      tempTypeList: [],
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
    },
  },
  watch: {
    visible(v) {
      if (v) {
        this.tempYearList = JSON.parse(JSON.stringify(this.reviewtypeList))
        this.tempTypeList = JSON.parse(JSON.stringify(this.yearList))
      }
    }
  },
  methods: {
    closePop() {
      this.$emit('update:yearList', this.tempTypeList)
      this.$emit('update:reviewtypeList', this.tempYearList)
      this.show = false
    },
    handleSelectChild(item, flag) {
      if (item.active) return
      if (!flag) {
        this.reviewtypeList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)

      } else {
        this.yearList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
      }

    },
    async confirm() {
      const reviewTypeItem = this.reviewtypeList.find(v => v.active)
      const yearItem = this.yearList.find(v => v.active)

      if (this.reviewTypeItem == reviewTypeItem.value && this.yearItem == yearItem.value) {
        this.show = false
        return
      }
      this.$emit('update:label', reviewTypeItem.name + yearItem.name)
      this.$emit('update:reviewTypeItem', reviewTypeItem.value)
      this.$emit('update:reviewType', reviewTypeItem.type)
      this.$emit('update:yearItem', yearItem.value)

      this.$emit('update:changeMore', true)
      //   this.getTextBookCourseInfo()
      this.show = false
    },
  },

}
</script>

<style lang='less' scoped>
.grade-pop-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &__body__group {
    background: #fff;
    font-size: 14px;
    border-radius: 5px;
    margin-bottom: 10px;

    &-wrap {
      padding-left: 21px;
      display: flex;
      flex-wrap: wrap;

      &-item {
        flex: 0 0 79px;
        line-height: 37px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 8px;
        margin-bottom: 10px;
        background-color: #f5f5f5;
        color: #333;
        text-align: center;
        border: 1px solid transparent;
        border-left-width: 1px !important;

        &:nth-child(4n) {
          margin-right: 0;
        }

        &.active {
          border-color: @blue;
          background-color: #e0fffc !important;
        }
      }
    }
  }

  .close {
    font-size: 22px;
    position: absolute;
    right: 10px;
    top: 13px;
    color: #999;
    z-index: 1;
  }

  &__title {
    font-size: 18px;
    text-align: center;
    line-height: 50px;
    font-weight: 700;
  }

  &__subject {
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    padding: 0 40px 0 20px;
    // display: flex;
    // justify-content: space-around;
    font-weight: 700;
    overflow-x: scroll;
    white-space: nowrap;

    > span {
      margin-left: 5px;
      margin-right: 10px;
    }
  }

  &__body {
    display: flex;
    flex: 1;
    // overflow-y: auto;

    &-left {
      flex: 0 0 95px;
      overflow-y: auto;

      > div {
        height: 44px;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
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

      .tip {
        padding: 0 20px 10px;
      }
      .cell__item {
        justify-content: space-between;
        height: 44px;
        display: flex;
        align-items: center;
        color: #666;
        font-size: 14px;
        word-break: break-all;
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
  &__body-more {
    flex: 1;
    overflow-y: auto;
  }

  &__footer {
    flex: 0 0 44px;
    padding: 5px 10px;

    .btn {
      border-radius: 22px;
      width: 100%;
    }
  }
}
</style>