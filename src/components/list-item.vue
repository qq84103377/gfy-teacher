<template>
  <van-swipe-cell class="list-item-wrap">
    <div class="pd10 list-item-wrap__ctn">
      <div class="badge">
        <slot name="badge"></slot>
      </div>
      <div class="aic" style="align-items: stretch" @click="$emit('clickTo')">
        <div class="icon-wrap" v-if="$slots.cover">
          <slot name="cover"></slot>
        </div>
        <div style="flex: 1;min-width: 0;display: flex;flex-direction: column;justify-content: space-between">
          <div class="title" @click=""><i class="iconGFY" v-if="taskType=='T01'||taskType=='T02'||taskType=='T03'||taskType=='T05'||(taskType =='T04' && testPaperId!=0)||(taskType =='T04' && testPaperId==0)||taskType =='T06'||taskType =='T13'" :class="{'icon-exam':taskType=='T01','icon-comment':taskType=='T02',
          'icon-test':taskType=='T03'||taskType=='T05','icon-learn-res':taskType =='T04' && testPaperId!=0,
          'icon-learn-res-exp':taskType =='T04' && testPaperId==0,'icon-discuss':taskType =='T06','icon-spoken':taskType =='T13'}"></i>
            {{itemTitle}}
          </div>
          <div v-if="$slots.desc">
            <slot name="desc"></slot>
          </div>
          <div v-else class="mgt15">
            <div class="time" v-for="(item,index) in classInfoList" :key="index" v-if="(index<2&&!fold) || fold">{{item.className}}:{{item.startDate}} -- {{item.endDate}}</div>
          </div>
        </div>
      </div>
      <div class="content">
        <slot name="btn"></slot>
        <slot name="remark"></slot>
      </div>
    </div>
    <template v-if="canSlide" slot="right">
        <van-button @click="del" style="background: #ccc;height: 100%;border: none;color: #fff" square text="删除" />
        <van-button v-if="up" @click="$emit('up')" style="background: #FFCD6B;height: 100%;border: none;color: #fff" square text="上移" />
        <van-button v-if="down" @click="$emit('down')" style="background: #FEC147;height: 100%;border: none;color: #fff" square text="下移" />
        <van-button v-if="top" @click="$emit('top')" style="background: #FEB524;height: 100%;border: none;color: #fff" square text="置顶" />
    </template>
  </van-swipe-cell>
</template>

<script>
export default {
  name: "list-item",
  props: ['canSlide', 'fold', 'itemTitle', 'taskType', 'testPaperId', 'classInfoList', 'up', 'down', 'top'],
  data() {
    return {
      showDialog:false
    }
  },
  methods: {
     close(){
        this.showDialog=false
        this.$dialog.close()
      },
    del() {
      this.showDialog=true
      this.$emit('clickDel')
      this.$dialog.confirm({
        title: '',
        message: '确定删除吗?'
      }).then(() => {
        this.showDialog=false
        this.$emit('del')
      }).catch(() => {
        this.showDialog=false
        // on cancel
      });

    },

  }
}
</script>

<style lang="less" scoped>
.list-item-wrap {
  &__ctn {
    /*height: 136px;*/
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .content {
    margin-top: 15px;
    margin-bottom: -10px;
  }
  .badge {
    position: absolute;
    right: 0;
    top: 0;
  }
  .icon-wrap {
    flex: 0 0 104px;
    height: 68px;
    margin-right: 10px;
  }
  .title {
    i {
      vertical-align: middle;
    }
    font-size: 14px;
    font-weight: bold;
    color: #333;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    flex: 0 0 20px;
  }
  .time {
    font-size: 10px;
    color: #999;
  }
}
</style>
<style lang="less">
.list-item-wrap {
  .btn-group {
    display: flex;
    height: 34px;
    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      i {
        margin-right: 5px;
        &.fold {
          transform: rotateZ(90deg);
        }
      }
    }
  }
}
</style>
