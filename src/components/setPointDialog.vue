<template>
  <van-dialog
    :showConfirmButton="false"
    class="set-point-dialog"
    v-model="visible">
    <div>
      <van-icon @click="visible=false" name="clear" class="clear"></van-icon>
      <div class="set-point-dialog__title">请设置分数</div>
      <input placeholder="请输入分值" type="number" v-model="point">
      <van-button type="info" class="confirm" @click="visible=false">确定</van-button>
    </div>
  </van-dialog>
</template>

<script>
    export default {
        name: "setPointDialog",
      props: ['show'],
      computed: {
        visible: {
          get() {
            return this.show
          },
          set(v) {
            this.$emit('update:show',v)
          }
        }
      },
      data() {
          return {
            point: ''
          }
      }
    }
</script>

<style lang="less" scoped>
  .set-point-dialog {
    text-align: center;
    .clear{
      position: absolute;
      right: 10px;
      top: 10px;
      color: @blue;
      font-size: 22px;
    }
    &__title {
      line-height: 70px;
      font-size: 18px;
      text-align: center;
      font-weight: bold;
    }
    input {
      font-size: 15px;
      background: #F5F6FA;
      color: #999;
      width: 110px;
      height: 44px;
      border-radius: 22px;
      padding: 0 15px;
      margin-bottom: 20px;
    }
    .confirm {
      width: 260px;
      height: 44px;
      line-height: 44px;
      border-radius: 22px;
      font-size: 18px;
      margin: 20px 0;
    }
  }
</style>
