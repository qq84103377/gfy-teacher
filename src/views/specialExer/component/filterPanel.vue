<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '93%' }">
    <div class="ware-filter-wrap">
      <div class="ware-filter-wrap__header van-hairline--bottom">
        <div class="ware-filter-wrap__header-tab">
          <span>地区</span>
          <van-icon class="icon-close" @click="closePop" name="close" />
        </div>
      </div>
      <div class="ware-filter-wrap__body" v-if='list.length'>
        <div v-if='double' class="ware-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in list" :key="index" :class="{active:item.active}">{{item.name}}
          </div>
        </div>
        <div class="ware-filter-wrap__body-right" v-if='double'>
          <div class="" v-for="(item,index) in list[provinceIndex].child" :key="index">
            <div @click="handleSelect(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.check}]">{{item.name}}
                <van-icon v-show="item.check" class="check blue" name="success" />
              </div>
              <!-- <div class="fs12 red tip">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div> -->
            </div>
          </div>
        </div>
        <div class="ware-filter-wrap__body-right" v-else>
          <div class="" v-for="(item,index) in list" :key="index">
            <div @click="handleSelect(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.active}]">{{item.name}}
                <van-icon v-show="item.active" class="check blue" name="success" />
              </div>
              <!-- <div class="fs12 red tip">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div> -->
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
  props: ['visible', 'list', 'areaCode', 'provinceCode', 'title', 'label', 'double'],
  data() {
    return {
      provinceIndex: 0,
      tempList: [],
      tempIndex: ''
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
        console.log(v, 'v////');
        this.provinceIndex = this.list.findIndex(ver => ver.areaCode == this.provinceCode)
        this.tempIndex = this.provinceIndex
        this.tempList = JSON.parse(JSON.stringify(this.list))
      }
    }
  },
  methods: {
    closePop() {
      this.$emit('update:list', this.tempList)
      this.index = this.tempIndex
      this.show = false
    },
    confirm() {
      let item, _item;
      if (this.double) {
        item = this.list.find(v => v.active)
        _item = item.child.find(v => {
          return v.check
        })
        console.log(item, 'item', _item);
        if (!item || !_item) {
          this.$toast('请选择')
          return
        }

        this.$emit('update:label', item.name + _item.name)
        this.$emit('update:areaCode', _item.areaCode)
        this.$emit('update:provinceCode', item.areaCode)


      }
      // console.log(item, _item);
      this.show = false
      // this.$emit('filter', item || {}, _item)


    },
    handleSelect(item) {
      if (this.double) {
        if (item.check) return
        this.list.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v, 'check', false)
          });
        })
        this.$set(item, 'check', true)
      } else {
        if (item.active) return
        this.list.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
      }

    },
    selectParent(item, index) {
      this.provinceIndex = index
      if (item.active) return
      this.list.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      // this.$emit('selectParent', index)

      this.list[index].child.forEach(v => {
        this.$set(v, 'check', false)
      })

      return

      if (this.title == "科目") {

      }
      this.provinceIndex = index
      if (item.active) return
      this.list.forEach(v => {
        this.$set(v, 'active', false)
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        });
      })
      this.$set(item, 'active', true)
      // 默认选中第一个
      // this.$set(item.child[0], 'check', true)
      console.log(item, 'item///////');
      this.$emit('selectParent', index)
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
