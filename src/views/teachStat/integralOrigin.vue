<template>
  <div class="integral-origin">
    <van-nav-bar :title="$route.query.accountName||'--'" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <van-cell title="表现积分来源" style="background: #f5f5f5;color: #999" />

    <div class="stat-table" v-if='list.length'>
      <div class="row row-header" style="font-weight: bold;">
        <div style="flex: 0 0 12%">序号</div>
        <div style="flex: 0 0 13%">分值</div>
        <div style="flex: 0 0 50%">原因</div>
        <div style="flex: 0 0 25%">操作时间</div>

      </div>
      <div class="row" v-for="(item,index) in list" :key="index">
        <div style="flex: 0 0 12%">{{index+1}}</div>
        <div style="flex: 0 0 13%">{{item.counterValue>0?'+'+item.counterValue:item.counterValue}}</div>
        <div style="flex: 0 0 50%">{{item.adjustReason}}</div>
        <div style="flex: 0 0 25%">{{item.createDate|formatTime}}</div>

      </div>
    </div>
    <div v-else class="empty-page">
      <img style="width: 70%;" src="@/assets/img/empty-2.png" alt />
      <div class="grey9 fs12">当前没有数据~</div>
    </div>

  </div>
</template>

<script>
import { getUserCounterOriginDetail } from '@/api/index'
import { formatTime } from "../../utils/filter";
export default {
  name: 'integralOrigin',
  data() {
    return {
      list: [],
    }
  },

  methods: {
    goBack() {
      this.common.goBack(this)
    },
    async getUserCounterOriginDetail() {
      this.$store.commit('setVanLoading', true)
      const { operateAccountNo, belongSchoolId, startDate, endDate, originType, accountNo, classGrade, classId, isParent } = this.$route.query
      let obj = {
        interUser: "runLfb",
        interPwd: "25d55ad283aa400af464c76d713c07ad",
        operateAccountNo,
        belongSchoolId,
        accountNo,
        startDate,
        endDate,
        originType,
        classGrade,
        classId,
        roleType: isParent ? 'A04' : 'A03'
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }

      await getUserCounterOriginDetail(params).then(res => {
        this.$store.commit('setVanLoading', false)
        console.log(res, 'getUserCounterOriginDetail res')
        if (res.flag) {
          if (!res.data || !res.data.length) {
            this.list = []
          } else {
            this.list = res.data
          }
        }
      })
    }
  },
  mounted() {
    this.getUserCounterOriginDetail()
  },

}
</script>

<style lang='less' scoped>
.integral-origin {
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;

  .empty-page {
    margin-bottom: 30px;
  }

  .stat-table {
    font-size: 12px;
    border-top: 1.5px solid @blue;
    border-left: 1px solid #eee;
    // width: 100%;
    position: relative;
    margin: 15px 8px 15px;
    overflow-x: hidden;

    .row,
    .col {
      display: flex;
      flex-wrap: nowrap;

      &.row-header {
        height: 44px;
      }

      > div {
        padding: 0 3px;
        color: #333;
        flex: 0 0 50%;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        text-align: center;
        background: #fff;
      }
    }
  }
}
</style>