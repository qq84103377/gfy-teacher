<template>
  <van-popup
    v-model="visible"
    position="bottom">
    <div class="correct-pop">
      <div class="correct-pop__title">纠错</div>
      <van-cell class="correct-pop__cell">
        <div slot="title" class="aic">
            <div class="align"><span class="red">*</span>纠错类型:</div>
            <div class="pdlt10" style="flex:1">大难错误</div>
            <van-icon @click="typeSelect = true" class="add" name="add"/>
        </div>
      </van-cell>
      <van-cell class="correct-pop__cell">
        <div slot="title">
            <div>纠错信息:</div>
          <textarea rows="4" v-model="remark"></textarea>
        </div>
      </van-cell>
      <div class="correct-pop__footer">
        <van-button type="info" class="btn" @click="visible = false">提交</van-button>
      </div>

      <van-popup
        v-model="typeSelect"
        :style="{height: '90%'}"
        position="bottom">
        <div class="type-pop">
          <div class="type-pop__title">纠错类型</div>
          <van-cell v-for="(item,index) in typeList" :key="index" class="type-pop__cell">
            <div slot="title" @click="handleSelect(item)" class="aic jcsb" :class="{active:item.active}">
              <div>纠错信息:</div>
              <van-icon v-if="item.active" name="success" />
            </div>
          </van-cell>
        </div>
      </van-popup>



    </div>
  </van-popup>
</template>

<script>
    export default {
        name: "correctPop",
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
      methods: {
        handleSelect(item) {
          this.typeList.forEach(v => {
            this.$set(v,'active',false)
          })
          this.$set(item,'active',true)
        }
      },
      data() {
          return {
            remark: '',
            typeSelect: false,
            typeList: [{name:'答案错误'},{name:'答案错误'},{name:'答案错误'},{name:'答案错误'},{name:'答案错误'},]
          }
      }
    }
</script>

<style lang="less" scoped>
  .correct-pop {
    .type-pop {
      &__title{
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 47px;
      }
      &__cell {
        .active {
          color: @blue;
        }
      }
    }
    &__title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      line-height: 47px;
    }
    .align {
      margin-left: -8px;
    }
    &__cell{
      .add {
        font-size: 22px;
        color: @blue;
      }
      textarea {
        margin-top: 15px;
        width: 100%;
        background: #f5f6fa;
        padding: 10px;
        border-radius: 5px;
      }
    }
    &__footer {
      height: 55px;
      padding: 5px 15px;
      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
