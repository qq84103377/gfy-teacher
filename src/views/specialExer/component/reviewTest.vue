<template>
  <section class="review-test-wrap">
    <van-list v-model="listLoading" :finished="finished" @load="onLoad" :finished-text="testList.length>0?'没有更多了':'本地区无相关套卷'" :offset='80'>
      <van-cell title="试卷" class="fs16" style="background: #f5f5f5;color: #999" />
      <div class="null-box" v-if="!testList.length&&!recommendList.length">
        <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
        <p class="fs12" style="text-align: center;color: #999999">本地区无相关套卷</p>
      </div>
      <div class="null-box" v-if="!testList.length&&recommendList.length">
        <!-- <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt /> -->
        <p class="fs12" style="text-align: center;color: #999999">本地区无相关套卷，为您推荐以下：</p>
      </div>
      <div v-if="testList.length">
        <van-cell v-for='item in testList' :key='item.testPaperId' @click='go(item)'>
          <template slot="title">
            <div class="fs18">{{item.testPaperName}}</div>
            <div class="fs14 grey6 mgt5">
              <span class="mgr10" v-if='item.testPaperType'>{{item.testPaperType|dealType(reviewTestType)}}</span>
              <span class="mgr10" v-if='item.testPaperMode'>{{item.testPaperMode|dealType(reviewTestType)}}</span>
              <!-- <span>模拟</span> -->
            </div>
          </template>
        </van-cell>
      </div>
      <van-cell v-if="!testList.length&&recommendList.length" class="mgt10" style="background: #f5f5f5;color: #999">
        <template slot="title">
          <!-- <span class="fs16">为您推荐</span> -->
          <img class="light" v-if='totalNumber' src="../../../assets/img/icon-light.png" alt="">
          <span class="red fs12" v-if='totalNumber'>
            已推荐<span>{{totalNumber}}</span>套同教材复习套卷
          </span>
        </template>
      </van-cell>
      <!-- <div class="null-box" v-if="!testList.length&&!recommendList.length">
        <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
      </div> -->
      <div v-if="!testList.length&&recommendList.length">
        <van-cell v-for='item in recommendList' :key='item.testPaperId' @click='go(item)'>
          <template slot="title">
            <div class="fs18">{{item.testPaperName}}</div>
            <div class="fs14 grey6 mgt5">
              <span class="mgr10" v-if='item.testPaperType'>{{item.testPaperType|dealType(reviewTestType)}}</span>
              <span class="mgr10" v-if='item.testPaperMode'>{{item.testPaperMode|dealType(reviewTestType)}}</span>
              <!-- <span>模拟</span> -->
            </div>
          </template>
        </van-cell>
      </div>
    </van-list>
  </section>
</template>

<script>
import { getTestPaperInfoList } from '@/api/index'

export default {
  name: "reviewTest",
  props: ['start', 'classGrade', 'areaCode', 'provinceCode', 'belongYear', 'reviewTypeItem', 'reviewType', 'termType', 'changeGradeSubject', 'changeMore', 'active', 'toggleNum','onRefresh'],
  data() {
    return {
      testList: [],
      recommendList: [],
      currentPage: 0,
      totalPage: 5,
      listLoading: false,
      finished: false,
      without: false,
      reviewTestType: this.$store.state.reviewTestType,
      totalNumber: 0,
      toggleFirst: false,
      isChange: false
    }
  },
  filters: {
    dealType(val1, val2) {
      return val2[val1];
    },
  },
  watch: {
    start(nv, ov) {
      console.log("start nv", nv);
      console.log("start ov", ov);
      if (nv) {

        if (this.toggleNum == 1) {
          this.toggleFirst = true
          this.isChange = false

          this.onLoad()
          this.$parent.startReviewTest = false
          this.$emit('update:start', false)
        } else {

          if (this.isChange) {
            this.isChange = false
            this.currentPage = 0
            this.totalPage = 5
            this.listLoading = false
            this.finished = false
            this.without = false
            this.totalNumber = 0
            this.onLoad()
          }
          this.$emit('update:start', false)
          this.$parent.startReviewTest = false
        }

      }
    },
    async onRefresh(nv, ov) {
      console.log("onRefresh3 nv", nv);
      console.log("onRefresh3 ov", ov);
      if (nv) {
        this.isChange = false
        this.currentPage = 0
        this.totalPage = 5
        this.listLoading = false
        this.finished = false
        this.without = false
        this.totalNumber = 0
        this.onLoad()
        this.$emit('update:onRefresh', false)
        this.$parent.$parent.isLoading = false
      }
    },
    areaCode(nv, ov) {
      console.log("areaCode nv", nv);
      console.log("areaCode ov", ov);
      this.isChange = true
      if (this.active != 2) return
      // if (!this.toggleFirst) return

      // this.testList= []
      // this.recommendList= []
      this.currentPage = 0
      this.totalPage = 5
      this.listLoading = false
      this.finished = false
      this.without = false
      this.totalNumber = 0
      this.onLoad()

    },
    changeGradeSubject(nv, ov) {
      console.log("changeGradeSubject nv", nv);
      console.log("changeGradeSubject ov", ov);
      if (nv) {
        this.isChange = true
        if (this.active != 2) return
        this.$parent.$parent.changeGradeSubject = false
        this.currentPage = 0
        this.totalPage = 5
        this.listLoading = false
        this.finished = false
        this.without = false
        this.totalNumber = 0
        this.onLoad()
      }
    },
    changeMore(nv, ov) {
      console.log("changeMore nv", nv);
      console.log("changeMore ov", ov);
      if (nv) {
        this.isChange = true
        if (this.active != 2) return
        this.$parent.$parent.changeMore = false
        this.currentPage = 0
        this.totalPage = 5
        this.listLoading = false
        this.finished = false
        this.without = false
        this.totalNumber = 0
        this.onLoad()
      }
    },
  },
  activated() {
    if (this.$route.path === '/specialExer') {
      this.$store.commit('setTchCourseInfo', {})
    }
  },
  methods: {
    go(item) {
      this.$store.commit('setResourceInfo', item)
      this.$store.commit("setTaskClassInfo", '')
      this.$router.push({
        path: `/examDetail`, query: {
          flag: 1,
          type: item.stateName ? 1 : 0,
          testPaperId: item.testPaperId,
          subjectType: localStorage.currentSubjectType,
          classGrade: item.classGrade,
          title: item.testPaperName,
        }
      })
    },
    onLoad() {
      console.log("onLoad");
      this.isChange=false

      if (!this.without) {
        console.log("onLoad1");
        this.currentPage++
        if (this.currentPage > this.totalPage && this.currentPage > 1) {
          this.listLoading = false
          this.finished = true
          return false

        }
        console.log("onLoad11");
        this.getTestPaperInfoList()
      } else {
        console.log("onLoad2");
        this.currentPage++
        if (this.currentPage > this.totalPage && this.currentPage > 1) {
          this.listLoading = false
          this.finished = true
          return false

        }
        console.log("onLoad22");
        this.getTestPaperInfoList2()
      }

    },

    // 获取试卷列表信息
    async getTestPaperInfoList() {
      console.log('getTestPaperInfoList');
      let params = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        pageSize: 10,
        currentPage: this.currentPage,
        classGrade: this.classGrade ? this.classGrade : '',

        areaCode: this.areaCode ? this.areaCode : '',
        // provinceCode: this.provinceCode ? this.provinceCode : '',
        termType: this.termType ? this.termType : '',
        subjectType: localStorage.currentSubjectType,
      }
      if (this.reviewType) {
        params.testPaperModeList = this.reviewTypeItem
      } else {
        params.testPaperType = this.reviewTypeItem
      }
      if (this.belongYear) {
        params.belongYear = this.belongYear
      }
      if (this.belongYear == 'earlier') {
        params.yearNum = 5
      }

      let obj = { requestJson: JSON.stringify(params) }

      let response = await getTestPaperInfoList(obj)
      console.log(response, 'getTestPaperInfoList response');
      this.listLoading = false
      this.recommendList = []
      if (this.currentPage === 1) {
        this.testList = []
      }
      if (this.currentPage === 1 && (!response.flag || !response.data.length)) {
        this.testList = []
        this.without = true
        this.currentPage = 0
        this.onLoad()
      }
      if (!response.flag || !response.data.length) {

        return
      } else {
        this.totalPage = response.total
        this.testList = this.testList.concat(response.data)
      }

    },

    // 获取试卷推荐列表信息
    async getTestPaperInfoList2() {
      console.log('getTestPaperInfoList2');
      let params = {
        requestJson: JSON.stringify({
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          pageSize: 10,
          currentPage: this.currentPage,
          subjectType: localStorage.currentSubjectType,
        })
      }
      let r = await getTestPaperInfoList(params)
      this.listLoading = false
      if (this.currentPage === 1) {
        this.recommendList = []
      }
      if (r.flag) {
        this.totalPage = r.total
        this.totalNumber = r.totalNumber
        this.recommendList = this.recommendList.concat(r.data)
        console.log(r, 'getTestPaperInfoList r');

        if (this.currentPage >= r.total) {
          this.finished = true
        }

      } else {
        this.$toast(r.msg)
        this.finished = true
      }

    }
  },

}
</script>

<style lang="less" scoped>
.fs18 {
  height: 44px;
  line-height: 44px;
}
.fs14 {
  height: 30px;
  line-height: 30px;
}
.light {
  width: 12px;
  height: 15px;
  margin-left: 5px;
}
.null-box {
  padding: 30px 0;
  text-align: center;
  color: #999999;
  background: #fff;
  .null-tips {
    // margin-top: 350px;
    // margin-left: 50%;
    // transform: translateX(-50%);
    width: 60%;
  }
}
</style>
