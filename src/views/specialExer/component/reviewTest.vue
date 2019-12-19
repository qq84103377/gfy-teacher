<template>
  <section class="review-test-wrap">
    <van-list v-model="listLoading" :finished="finished" @load="onLoad" :finished-text="testList.length>0?'没有更多了':'本地区无相关套卷'" :offset='80'>
      <van-cell title="试卷" style="background: #f5f5f5;color: #999" />
      <div class="null-box" v-if="!testList || testList.length==0">
        <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
        <p class="fs12" style="text-align: center;color: #999999">本地区无相关套卷</p>
      </div>
      <div v-else>
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
      <van-cell v-if="!testList.length" class="mgt10" style="background: #f5f5f5;color: #999">
        <template slot="title">
          <span class="custom-title">为您推荐</span>
          <span class="red fs10" v-if='totalNumber'>
            已推荐<span>{{totalNumber}}</span>套同教材复习套卷
          </span>
        </template>
      </van-cell>
      <div class="null-box" v-if="!testList.length&&!recommendList.length">
        <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
      </div>
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
  props: ['start', 'classGrade', 'areaCode', 'provinceCode', 'belongYear', 'reviewTypeItem', 'reviewType', 'termType', 'changeYearSubject', 'changeMore','active'],
  data() {
    return {
      testList: [],
      recommendList: [],
      currentPage: 0,
      totalPage:5,
      listLoading: false,
      finished: false,
      without: false,
      reviewTestType: this.$store.state.reviewTestType,
      totalNumber: 0
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
        this.onLoad()
        // this.getTestPaperInfoList()
        this.$emit('update:start', false)
      }
    },
    areaCode(nv, ov) {
      console.log("areaCode nv", nv);
      console.log("areaCode ov", ov);
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
    changeYearSubject(nv, ov) {
      console.log("changeYearSubject nv", nv);
      console.log("changeYearSubject ov", ov);
      if (nv) {
        console.log("this.$parent", this.$parent);
        this.$parent.changeYearSubject = false
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
        console.log("this.$parent", this.$parent);
        this.$parent.changeMore = false
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
  // computed: {
  //   subjectType() {
  //     return localStorage.currentSubjectType
  //   }
  // },
  methods: {
    go(item) {
      this.$router.push({
        path: `/examDetail`, query: {
          // "tchCourseId": this.$route.query.tchCourseId,
          // "sysCourseId": this.$route.query.sysCourseId,
          // "relationCourseId": this.$route.query.relationCourseId,
          flag:1,
          type: item.stateName ? 1 : 0,
          testPaperId: item.testPaperId,
          subjectType: localStorage.currentSubjectType,
          classGrade: item.classGrade,
          title: item.testPaperName,
        }
      })

      // this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${this.classGrade}&title=${item.testPaperName}`)
    },
    onLoad() {
      console.log("onLoad");
      // if (!this.start) {
      //   return
      // }
      if (!this.without) {
        console.log("onLoad1");
        this.currentPage++
        if (this.currentPage > this.totalPage && this.currentPage > 1) {
          return
        }
        console.log("onLoad11");
        this.getTestPaperInfoList()
      } else {
        console.log("onLoad2");
        this.currentPage++
        if (this.currentPage > this.totalPage && this.currentPage > 1) {
          return
        }
        console.log("onLoad22");
        this.getTestPaperInfoList2()
      }

    },
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
      if (this.currentPage === 1) {
        this.testList = []
      }
      if (this.currentPage === 1&&(!response.flag || !response.data.length)) {
        this.testList = []
        this.without = true
        this.currentPage = 0
        this.onLoad()
      }
      if (!response.flag || !response.data.length) {
        // this.testList = []
        // this.currentPage = 0
        // this.onLoad()
        return
        let r = await getTestPaperInfoList({
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          pageSize: 10,
          currentPage: page,
          subjectType: localStorage.currentSubjectType,
        })

        if (r.flag) {
          console.log(r, 'getTestPaperInfoList r');
        } else {
          this.$toast(r.msg)
        }
      } else {
        this.totalPage = response.total
        this.testList = this.testList.concat(response.data)
      }
    },
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

        if (this.currentPage >= res.total) {
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
