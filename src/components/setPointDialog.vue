<template>
  <van-dialog
    :showConfirmButton="false"
    class="set-point-dialog"
    v-model="visible">
    <div>
      <van-icon @click="point = '';visible=false" name="clear" class="clear"></van-icon>
      <div class="set-point-dialog__title">请设置分数</div>
      <input @input="handleInput" placeholder="请输入分值" type="number" v-model="point">
      <van-button type="info" class="confirm" @click="confirm">确定</van-button>
    </div>
  </van-dialog>
</template>

<script>
  export default {
    name: "setPointDialog",
    props: ['show',],
    computed: {
      visible: {
        get() {
          return this.show
        },
        set(v) {
          this.$emit('update:show', v)
        }
      },
      // point: {
      //   get() {
      //     return this.score
      //   },
      //   set(v) {
      //     this.$emit('input',v)
      //   }
      // }
    },
    methods: {
      confirm() {
        if(this.point === '' || this.point <= 0) {
          return this.$toast('分数有误,请重新输入')
        }
        this.visible = false;
        this.$emit('confirm', this.point)
        this.point = ''
      },
      handleInput(v) {
        // ^[+]{0,1}(\d+)$
        // this.point = v.target.value.toString().replace(/[^\d]/g,'')
        v.target.value = v.target.value.toString().replace(/[^\d]/g, '')
        this.point = v.target.value
        // console.log( v.target.value.toString().replace(/[^\d]/g,''));
        // console.log(/^[+]{0,1}(\d+)$/.test(v.target.value));
        // console.log(v.target.value);

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

    .clear {
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
      text-align: center;
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
