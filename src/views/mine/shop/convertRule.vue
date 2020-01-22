<template>
  <section class="convertRule">
    <van-nav-bar title="兑换规则" left-arrow @click-left="goBack">
      <div slot="right" class="tips" @click="$router.push('/service')">为您服务</div>
    </van-nav-bar>
    <div class="convertRule-body">
      <div class="item">
        <h3>规则一.</h3>
        <p>
          除假期外，当月兑换的奖品通过审核，会在下个月由该教研员直接联系，进行兑换。
        </p>
      </div>
      <div class="item">
        <h3>规则二.</h3>
        <p>
          奖品质量问题，请收到奖品时及时检查，如有问题，请直接联系该校的教研员进行更换。
        </p>
      </div>
      <div class="item">
        <h3>规则三.</h3>
        <p>
          如果在兑换奖品过程中有任何问题，请联系该校的教研员。
        </p>
      </div>

    </div>
  </section>

</template>

<script>
  export default {
    name: "convertRule",
    methods: {
      goBack(){
          this.common.goBack(this)
        },
    },
  }
</script>

<style scoped lang="less">
  .convertRule {
    .tips {
      color: #39F0DD;
      font-size: 14px;
    }

    &-body {
      padding: 20px;

      .item {
        margin-bottom: 29px;

        h3 {
          font-size: 15px;
          font-weight: 500;
          border-left: 3px solid #39F0DD;
          padding-left: 7px;
          color: #000;
          margin-bottom: 5px;
        }

        p {
          font-size: 14px;
          color: #333333;
          line-height: 22px;
          padding-left: 7px;
        }
      }

    }
  }
</style>
