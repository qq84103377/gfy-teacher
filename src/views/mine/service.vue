<template>
  <section class="service">
    <div class="service-header">
      <img src="@assets/img/myself-icon-33.png" alt="">
    </div>
    <div class="service-body">
      <p>教研员：李小玲</p>
      <p>联系电话：18566860844</p>
    </div>

    <div class="service-footer">
      <p>全朗高分云为您服务</p>
      <van-button @click="handelClick" type="info">拨打</van-button>
    </div>
    <a href="tel:18566860844" ref="telBox" v-show="false"></a>
  </section>
</template>

<script>
  export default {
    name: "service",
    data() {
      return {}
    },
    methods: {
      handelClick() {
        this.$dialog.confirm({
          message: '18566860844',
          confirmButtonText: '呼叫',
          confirmButtonColor: '#39F0DD'
        }).then(() => {
          // on confirm
          console.log('呼叫电话')
          if ("cordova" in window) {
            console.log('试试aapp呼叫电话')

            this.$refs["telBox"].click();

          } else {
            this.$refs["telBox"].click();
          }
        }).catch(() => {
          // on cancel
        });
      }
    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .service {
    background-color: #F5F6FA;
    &-header {
      width: 138px;
      height: 138px;
      margin: 50px auto;
      border: 1px solid #39F0DD;
      border-radius: 50%;
      .column-center;

      img {
        display: block;
        width: 107px;
        height: 107px;
        border-radius: 50%;
      }
    }

    &-body {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #000000;

      p {
        margin-bottom: 10px;
      }
    }

    &-footer {
      text-align: center;
      margin-top: 160px;

      p {
        margin-bottom: 10px;
        font-weight: 500;
      }

      @{deep} .van-button {
        width: 163px;
        border-radius: 40px;
        font-size: 15px;
      }
    }
  }

</style>
