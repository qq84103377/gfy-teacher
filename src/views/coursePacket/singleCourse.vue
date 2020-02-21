<template>
  <section class="single">
    <van-nav-bar title="寒假作业检查" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="single__body">
      <div class="single__body__tit">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value" :options="option" @change='changeClass' />
        </van-dropdown-menu>
        <div class="single__body__tit__pre" :class="{active:tabIndex==0}" @click="tabIndex=0">
          <p class="block">10人</p>
          <p class="fs10">已完成</p>
        </div>
        <div class="single__body__tit__pre" :class="{active:tabIndex==1}" @click="tabIndex=1">
          <p class="block">9人</p>
          <p class="fs10">进行中</p>
        </div>
        <div class="single__body__tit__pre" :class="{active:tabIndex==2}" @click="tabIndex=2">
          <p class="block">15人</p>
          <p class="fs10">未开始</p>
        </div>
      </div>
      <div class="single__body__bd">
        <van-cell title="单元格" is-link :value="a+'/'+b" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />
        <van-cell title="单元格" is-link value="内容" />

      </div>
    </div>
    <div class="single__footer">
      <van-button class="btn" type="info" @click="">
        加分/减分
      </van-button>
      <van-button class="btn" type="info" @click="">
        分享报告
      </van-button>
    </div>

  </section>

</template>

<script>
export default {
  name: 'singleCourse',
  data() {
    return {
      value: 0,
      option: [
        { text: '全部商品', value: 0, classId: '01' },
        { text: '新款商品', value: 1, classId: '02' },
        { text: '活动商品', value: 2, classId: '03' }
      ],
      tabIndex: 0,
      a: "01",
      b: "30"
    }
  },
  methods: {
    goBack() {
      this.common.goBack(this)
    },
    changeClass(value) {
      console.log(value)
      console.log("classId",this.option[value].classId)
    }
  },
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.single {
  background-color: #f5f6fa;
  height: 100%;
  display: flex;
  flex-direction: column;

  .van-nav-bar {
    flex: 0 0 50px;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &__tit {
      flex: 0 0 55px;
      display: flex;
      align-items: center;
      background-color: #fff;
      margin-bottom: 10px;

      .van-dropdown-menu {
        height: 55px;
        width: 25%;
        @{deep} .van-ellipsis {
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          white-space: pre-wrap;
          -webkit-box-orient: vertical;
        }
        @{deep}.van-dropdown-menu__title--active {
          color: #39f0dd;
        }
        @{deep}.van-dropdown-item__option--active,
        @{deep}.van-dropdown-item__option--active,
        @{deep}.van-dropdown-item__icon {
          color: #39f0dd;
        }
        @{deep}.van-dropdown-item__content {
          box-shadow: 0px 5px 9px 0px rgba(102, 102, 102, 1);
          border-radius: 0px 0px 10px 10px;
        }
      }

      &__pre {
        width: 25%;
        height: 55px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p {
          line-height: 20px;
        }

        .block {
          font-weight: 700;
        }

        &.active {
          color: #39f0dd;

          &::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 2px;
            width: 25px;
            height: 2px;
            background-color: #39f0dd;
            margin: 0 auto;
          }
        }
      }
    }
    &__bd {
      flex: 1;
      overflow: scroll;

      @{deep} .van-cell__title {
        font-weight: 700;
      }
    }
  }
  &__footer {
    flex: 0 0 55px;
    background: #fff;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      border-radius: 22px;
      color: #fff;
      font-size: 18px;
      flex: 1;

      &:nth-child(2n) {
        margin-left: 23px;
      }
    }
  }
}
</style>