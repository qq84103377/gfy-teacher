<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="ware-filter-wrap">
      <div class="ware-filter-wrap__header van-hairline--bottom">
        <div class="ware-filter-wrap__header-tab">
          <span>{{title}}</span>
          <van-icon class="icon-close" @click="show=false" name="close"/>
        </div>
      </div>
      <div class="ware-filter-wrap__body">
<!--        <div class="ware-filter-wrap__body-left">-->
<!--          <div @click="selectParent(item,index)" v-for="(item,index) in list" :key="index"-->
<!--               :class="{active:item.active}">{{item.name}}-->
<!--          </div>-->
<!--        </div>-->
        <div class="ware-filter-wrap__body-right">
          <div class="" v-for="(item,index) in list" :key="index">
            <div @click="handleSelect(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.check}]">{{item.tchCourseInfo.courseName}}
                <van-icon v-show="item.check" class="check blue" name="success"/></div>
              <div v-if="!item.tchCourseInfo.sysCourseId" class="fs12 red tip">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ware-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import { Dialog } from 'vant';
  export default {
    name: "filterPanel",
    props: ['visible', 'list','title','label'],
    data() {
      return {
        index: 0,
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
      // childList() {
      //
      //   return this.list[this.index] ? this.list[this.index].child : []
      // },
    },
    watch: {
      // list: {
      //   handler(v) {
      //     this.selectParent(v[this.index],this.index)
      //   },
      //   deep: true
      // },
      visible(v) {
        if (!v) {
          this.index = 0
        }
      }
    },
    methods: {
      confirm() {
        if(this.title === '科目') {
          // 如果选择的科目与首页科目不一致,则弹出dialog

          Dialog.confirm({
            title: '提示',
            message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换',
            confirmButtonColor: '#39F0DD',
            className: 'change-subject'
          }).then(() => {
            this.show = false
            let item = this.childList.find(v => v.check)
            console.log(item);
            this.$emit('filter',item||{})
          }).catch(() => {
            // on cancel
          });
        } else {
          this.show = false
          let item = this.list.find(v => v.check)
          console.log(item);
          this.$emit('filter',item||{})
        }

      },
      handleSelect(item) {
        if (item.check) return
        this.list.forEach(v => {
            this.$set(v,'check',false)
        })
        this.$set(item, 'check', true)
      },
      selectParent(item, index) {
        this.index = index
        if (item.active) return
        this.list.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
          this.$emit('selectParent',index)
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


    &__body {
      display: flex;
      flex: 1;
      overflow: hidden;

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
