<template>
  <div class="integral-detail">
    <van-cell style="background: #f5f5f5;color: #999">
      <template slot="title">
        <span class="custom-title">积分明细</span>
        <van-icon v-if='isParent' name="question" color="#FFA800" @click="showTips=true" />
      </template>
    </van-cell>
    <div v-if="!isParent">
      <div v-if='list.length' class="stat-table">
        <div class="row row-header" style="font-weight: bold;">
          <div style="flex: 0 0 15%">姓名</div>
          <div style="flex: 0 0 13%">登录</div>
          <div style="flex: 0 0 11%">完成任务</div>
          <div style="flex: 0 0 11%">课堂表现</div>
          <div style="flex: 0 0 12%">训练营报名</div>
          <div style="flex: 0 0 12%">做题正确率</div>
          <div style="flex: 0 0 11%">刷错题本</div>
          <div style="flex: 0 0 15%">总积分</div>
        </div>
        <div class="row" v-for="(item,index) in list" :key="index">
          <div style="flex: 0 0 15%">{{item.accountName}}</div>
          <div style="flex: 0 0 13%">{{item.intCounterOrginGroup[0].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[1].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[2].counterValue}}</div>
          <div style="flex: 0 0 12%">{{item.intCounterOrginGroup[3].counterValue}}</div>
          <div style="flex: 0 0 12%">{{item.intCounterOrginGroup[4].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[5].counterValue}}</div>
          <div style="flex: 0 0 15%">{{item.intCounterOrginGroup[6].counterValue}}</div>
        </div>
      </div>
      <div v-else class="empty-page">
        <img style="width: 70%;" src="@/assets/img/empty-2.png" alt />
        <div class="grey9 fs12">当前没有数据~</div>
      </div>

    </div>

    <div v-else>
      <div v-if='list.length' class="stat-table">
        <div class="row row-header" style="font-weight: bold;">
          <div style="flex: 0 0 12%">姓名</div>
          <div style="flex: 0 0 10%">登录</div>
          <div style="flex: 0 0 10%">签到</div>
          <div style="flex: 0 0 11%">课程学习</div>
          <div style="flex: 0 0 11%">参加活动</div>
          <div style="flex: 0 0 11%">趣味测试</div>
          <div style="flex: 0 0 11%">资源分享</div>
          <div style="flex: 0 0 11%">表现积分</div>
          <div style="flex: 0 0 13%">总积分</div>
        </div>
        <div class="row" v-for="(item,index) in list" :key="index">
          <div style="flex: 0 0 12%">{{item.accountName}}</div>
          <div style="flex: 0 0 10%">{{item.intCounterOrginGroup[0].counterValue}}</div>
          <div style="flex: 0 0 10%">{{item.intCounterOrginGroup[1].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[2].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[3].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[4].counterValue}}</div>
          <div style="flex: 0 0 11%">{{item.intCounterOrginGroup[5].counterValue}}</div>
          <div style="flex: 0 0 11%;color:#39f0dd" @click="goTo(item)">{{item.intCounterOrginGroup[6].counterValue}}</div>
          <div style="flex: 0 0 13%">{{item.intCounterOrginGroup[7].counterValue}}</div>
        </div>
      </div>
      <div v-else class="empty-page">
        <img style="width: 70%;" src="@/assets/img/empty-2.png" alt />
        <div class="grey9 fs12">当前没有数据~</div>
      </div>
    </div>

    <van-popup class="tips" v-model="showTips" :round="true">
      <div class="title">
      </div>
      <div class="content">
        <p>1. 表现积分为老师根据家长平时参与的班级管理和活动所加的积分。</p>
        <p>2. 点击“表现积分”可查看“表现积分”的具体的积分来源。</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { statClassCounterByOrigin } from '@/api/index'
export default {
  name: 'integralDetail',
  data() {
    return {
      isParent: this.$route.query.isParent,
      list: [],
      gradeSubjectList: this.$route.query.isShare ? '' : JSON.parse(JSON.stringify(this.$parent.gradeSubjectList)),
      showTips: false
    }
  },
  watch: {
    filterParams: {
      handler(nv, ov) {

        if (!this.$route.query.isShare) {
          if (!this.$parent.isAnotherPost) {
            if (!this.isParent && !this.$parent.isMaster) {
              this.$toast('该班级学生积分只有班主任有权查看!')
              this.list = []
              return
            }
          }
        }
        if (JSON.stringify(nv) == JSON.stringify(ov)) return
        console.log("JSON.stringify(nv) ",JSON.stringify(nv) )
        console.log("JSON.stringify(ov) ",JSON.stringify(ov) )

        this.statClassCounterByOrigin()
      },
      deep: true,
      // immediate: true
    },
  },
  computed: {
    filterParams() {
      if (this.$route.query.isShare) {
        return {
          classGrade: this.$route.query.classGrade,
          classId: this.$route.query.classId,
          // startDate: this.$route.query.startDate,
          // endDate: this.$route.query.endDate
        }
      }
      return {
        classGrade: this.gradeSubjectList[this.$parent.gradeIndex].classGrade,
        classId: this.$parent.classIndex || '',
        // startDate: this.$parent.filterTime.start,
        // endDate: this.$parent.filterTime.end
      }
    },
  },
  methods: {
    goTo(item) {
      this.$router.push({
        path: '/integralOrigin',
        query: {
          operateAccountNo: this.$route.query.operateAccountNo,
          belongSchoolId: this.$route.query.belongSchoolId,
          classGrade: this.filterParams.classGrade,
          classId: this.filterParams.classId,
          startDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          originType: 'O50',
          accountName: item.accountName,
          accountNo: item.accountNo,
          isShare: this.$route.query.isShare,
          isParent: this.isParent
        }
      })
    },
    async statClassCounterByOrigin() {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$route.query.operateAccountNo,
        "belongSchoolId": this.$route.query.belongSchoolId,
        "classGrade": this.filterParams.classGrade,
        "classId": this.filterParams.classId,
        "startDate": this.$parent.filterTime.start,
        "endDate": this.$parent.filterTime.end,
        "originTypeList": this.isParent ? 'O01,O45,O46,O47,O48,O49,O50' : 'O01,O02,O03,O16,O17,O18',
        "statType": this.isParent ? 'T02' : 'T01', //统计对象类型   T01学生   T02家长
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }

      await statClassCounterByOrigin(params).then(res => {
        this.$store.commit('setVanLoading', false)
        console.log(res, 'statClassCounterByOrigin res')
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
    this.statClassCounterByOrigin()
  },
}
</script>

<style lang='less' scoped>
@deep: ~">>>";
.integral-detail {
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;

  .empty-page {
    margin-bottom: 30px;
  }

  .custom-title {
    margin-right: 5px;
  }

  @{deep} .van-popup.tips {
    width: 300px;

    .content {
      padding: 20px;

      p {
        font-size: 15px;
        line-height: 26px;
        color: #000;
      }
    }
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