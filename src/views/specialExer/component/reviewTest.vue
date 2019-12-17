<template>
  <section class="review-test-wrap">
    <van-cell title="试卷" style="background: #f5f5f5;color: #999" />
    <div v-if="!list && list.length==0" style="text-align: center;color: #999999">
      <img class="null-tips" src="../../../assets/img/preview/board_empty.png" alt />
    </div>
    <div v-else>
      <van-cell v-for='item in list' :key='item' @click='go(item)'>
        <template slot="title">
          <div class="fs18">我是邓稼先的题我是邓稼先的微课邓稼微...</div>
          <div class="fs14 grey6 mgt5">
            <span class="mgr10">听力笔试套卷</span>
            <span>模拟</span>
          </div>
        </template>
      </van-cell>
    </div>
    <van-cell style="background: #f5f5f5;color: #999">
      <template slot="title">
        <span class="custom-title">为您推荐</span>
        <span class="red fs10">
          已推荐102套同教材复习套卷
        </span>
      </template>
    </van-cell>
    <div v-if="list.length==0" style="text-align: center;color: #999999">
      <img class="null-tips" src="../../../assets/img/preview/board_empty.png" alt />
    </div>
    <div v-else>
      <van-cell v-for='item in list' :key='item' @click='go(item)'>
        <template slot="title">
          <div class="fs18">我是邓稼先的题我是邓稼先的微课邓稼微...</div>
          <div class="fs14 grey6 mgt5">
            <span class="mgr10">听力笔试套卷</span>
            <span>模拟</span>
          </div>
        </template>
      </van-cell>
    </div>
  </section>
</template>

<script>
import { getTestPaperInfoList } from '@/api/index'

export default {
  name: "reviewTest",
  props: ['start','classGrade','testPaperType','areaCode','provinceCode','belongYear','testPaperModeList','yearNum','termType'],
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7],
      currentPage: 0
    }
  },
  watch: {
    start(nv, ov) {
      console.log("start nv",nv);
      console.log("start ov",ov);
      if (nv) {
        this.getTestPaperInfoList()
        this.$emit('update:start', false)
      }
    }
  },
  methods: {
    go(item) {
      this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${this.classGrade}&title=${item.testPaperName}`)
    },
    async getTestPaperInfoList() {
      console.log(getTestPaperInfoList,'getTestPaperInfoList');
      const page = this.currentPage
      let params = {
        requestJson: JSON.stringify({
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          pageSize: 10,
          currentPage: page,
          classGrade:this.classGrade?this.classGrade:'',
          testPaperType:this.testPaperType?this.testPaperType:'',
          areaCode:this.areaCode?this.areaCode:'',
          provinceCode:this.provinceCode?this.provinceCode:'',
          belongYear:this.belongYear?this.belongYear:'',
          testPaperModeList:this.testPaperModeList?this.testPaperModeList:'',
          yearNum:this.yearNum?this.yearNum:'',
          termType:this.termType?this.termType:'',
          subjectType:localStorage.currentSubjectType,
        })
      }
      let response = await getTestPaperInfoList(params)
      console.log(response,'getTestPaperInfoList response');
      if (!response.flag || !response.data.length) {
        let r = await getTestPaperInfoList({
          requestJson: JSON.stringify({
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            pageSize: 10,
            currentPage: page,
            classGrade,
            testPaperType,
            areaCode,
            provinceCode,
            belongYear,
            testPaperModeList,
            yearNum,
            termType,
            subjectType,
          })
        })

        if (r.flag) {
          this.$toast('编辑成功')
          const index = this.list.findIndex(v => v.spokenId === this.form.spokenId)
          this.list[index].spokenTitle = this.form.name
          this.list[index].spokenDegree = this.form.difficult
          this.list[index].shareType = this.form.share
          this.popShow = false
        } else {
          this.$toast(r.msg)
        }
      } else {

        // this.$toast(response.msg)
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
</style>
