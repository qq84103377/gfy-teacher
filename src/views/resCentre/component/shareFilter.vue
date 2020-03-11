<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>共享</span>
          <van-icon class="icon-close" @click="closePop" name="close"/>
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-right">
          <div class="" v-for="(item,index) in shareList" :key="index">
            <div @click="handleSelect(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.active}]">{{item.name}}
                <van-icon v-show="item.active" class="check blue" name="success"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="res-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>

  export default {
    name: "shareFilter",
    props: ['visible','label'],
    data() {
      return {
        shareList: [
          {name:'全部',value: '',active:true},
          {name:'共享',value: 'S03',active:false},
          {name:'校内',value: 'S02',active:false},
          {name:'个人',value: 'S01',active:false},
        ],
        tempList: [],
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
          this.tempList = JSON.parse(JSON.stringify(this.shareList))
        }
      }
    },
    mounted() {
    },
   created() {

    },
    methods: {
      confirm() {
        const item = this.shareList.find(v => v.active)
        this.$emit('update:label',item?item.name:'')
        this.$emit('filter',item?item.value:'')
        this.show = false
      },
      closePop() {
        this.shareList = this.tempList
        this.show = false
      },
      handleSelect(item) {
        if (item.active) return
        this.shareList.forEach(v => {
            this.$set(v,'active',false)
        })
        this.$set(item, 'active', true)
      },
    }
  }
</script>

<style lang="less" scoped>
  .res-filter-wrap {
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


    &__body {
      display: flex;
      flex: 1;

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

    &__footer {
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
