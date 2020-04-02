<template>
  <section class="question-type-wrap">
    <van-row class="question-type-wrap__tit">
      <van-col span="8" :class="{ active: active == 0 }" @click="active = 0;changeTab(0)">题型专项</van-col>
      <van-col span="8" :class="{ active: active == 1 }" @click="active = 1;changeTab(1)">知识点专项</van-col>
      <van-col span="8" :class="{ active: active == 2 }" @click="active = 2;changeTab(2)">复习套卷</van-col>
    </van-row>

    <div class="question-type-wrap__body" ref="body">
      <van-cell title="筛选" style="background: #f5f5f5;color: #999" class="fs16" />

      <van-cell @click="areaFilterShow=true" title="地区" class="fs16" is-link>
        <div class="blue">{{areaLabel}}</div>
      </van-cell>

      <van-cell v-if="active!=2" @click="typeSubjectFilterShow=true" title="科目" class="fs16" is-link>
        <div class="blue">
          {{typeSubjectLabel}}
        </div>
      </van-cell>

      <!-- <van-cell v-if="active == 1" @click="pointSubjectFilterShow=true" title="科目" is-link>
        <div class="blue">
          {{pointSubjectLabel}}
        </div>
      </van-cell> -->

      <van-cell v-if="active == 2" @click="gradeSubjectShow=true" title="年级学科" class="fs16" is-link>
        <div class="blue">
          {{gradeSubjectLabel}}
        </div>
      </van-cell>

      <van-cell v-if="active != 2" @click="versionFilterShow=true" title="教材" class="fs16" is-link>
        <div class="blue">
          {{versionLabel}}
        </div>
      </van-cell>

      <van-cell v-else @click="reviewMoreShow=true" title="更多" class="fs16" is-link>
        <div class="blue">{{reviewMoreLable}}</div>
      </van-cell>

      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

        <question-type v-show="active == 0" :list='typesList' :active='active' :areaCode='areaCode' :courseIds='courseIds' :classGrade='gradeTerm'></question-type>

        <knowledge-point v-show="active == 1" :start.sync='startKnowledge' :active='active' :toggleNum='toggleNum2' :onRefresh.sync='onRefresh2' :areaCode='areaCode' :courseIds='courseIds' :classGrade='gradeTerm' :textBookId.sync='textBookId' :gradeTermId.sync='gradeTermId'></knowledge-point>

        <review-test v-show="active == 2" :start.sync='startReviewTest' :active='active' :toggleNum='toggleNum3' :onRefresh.sync='onRefresh3' :subjectType.sync='subjectType' :classGrade.sync='gradeItem' :areaCode.sync='areaCode' :provinceCode.sync='provinceCode' :belongYear.sync='yearItem' :reviewTypeItem.sync='reviewTypeItem' :reviewType.sync='reviewType' :termType.sync='termType' :changeGradeSubject.sync='changeGradeSubject' :changeMore.sync='changeMore'></review-test>
      </van-pull-refresh>
    </div>

    <filter-panel :label.sync="areaLabel" :visible.sync="areaFilterShow" :list.sync="area" :areaCode.sync="areaCode" :provinceCode.sync="provinceCode" :double='double'></filter-panel>

    <year-subject-filter ref='yearSubject' :label.sync="typeSubjectLabel" :visible.sync="typeSubjectFilterShow" :active='active' :toggleNum='toggleNum1' :start.sync='startTypes' :onRefresh.sync='onRefresh1' :types.sync="typesList" :subjectType.sync='subjectType'></year-subject-filter>

    <version-filter :gradeTerm.sync="gradeTerm" :label.sync="versionLabel" :visible.sync="versionFilterShow" :courseIds.sync='courseIds' :subjectLabel.sync='typeSubjectLabel' :textBookId.sync='textBookId' :gradeTermId.sync='gradeTermId'></version-filter>

    <grade-subject-filter ref="gradeSubject" :label.sync="gradeSubjectLabel" :visible.sync="gradeSubjectShow" :active='active' :subjectType.sync='subjectType' :toggleNum='toggleNum2' :termType.sync='termType' :gradeItem.sync='gradeItem' :reviewtypeList.sync='reviewtypeList' :changeGradeSubject.sync='changeGradeSubject'></grade-subject-filter>

    <more-Filter :label.sync="reviewMoreLable" :visible.sync="reviewMoreShow" :yearList.sync='yearList' :reviewtypeList.sync='reviewtypeList' :yearItem.sync='yearItem' :reviewTypeItem.sync='reviewTypeItem' :reviewType.sync='reviewType' :changeMore.sync='changeMore'></more-Filter>

  </section>
</template>

<script>
import { generateTimeReqestNumber } from "@/utils/filter";
import reviewTest from "./component/reviewTest";
import questionType from "./component/questionType";
import knowledgePoint from "./component/knowledgePoint";
import filterPanel from './component/filterPanel'

import {  getResCourseWareInfo,
  delCollectInfo,
  createCollectInfo,
  getClassTeachCourseInfo,
  getSysCourseTestPaperList,
  getCollectInfoDetailV2,
  delTestPaper, getMySchoolInfo, getSysDictList} from '@/api/index'
import { sysAreaApi, teachApi, pubApi } from '@/api/parent-GFY'
import { getGradeName, getSubjectName, toHump } from "../../utils/filter";

import versionFilter from './component/versionFilter'
import gradeSubjectFilter from './component/gradeSubjectFilter'
import moreFilter from './component/moreFilter'
import yearSubjectFilter from './component/yearSubjectFilter'

export default {
  name: "index",
  components: {
    reviewTest,
    questionType,
    knowledgePoint,
    filterPanel,
    yearSubjectFilter,
    versionFilter,
    gradeSubjectFilter,
    moreFilter
  },
  data() {
    return {
      active: 0,
      title: '',
      double: true,

      subject: [],

      label: 'subjectName',

      subjectList: [],
      schoolList: [],

      schoolName: '',


      area: [],
      areaLabel: '广东省佛山市',
      areaFilterShow: false,
      areaCode: '0757',
      provinceCode: '44',

      toggleNum1: 1,
      startTypes: false,
      typeSubjectFilterShow: false,
      typeSubjectLabel: '',
      subjectType: localStorage.currentSubjectType,

      pointSubjectFilterShow: false,
      pointSubjectLabel: '',

      versionFilterShow: false,
      versionLabel: '',

      textBookId: '',//教材id
      gradeTerm: '', //年级学期
      gradeTermId: '',//学期id
      courseIds: [], //课程ids
      typesList: [], //题型列表

      gradeSubjectLabel: '',
      gradeSubjectShow: false,
      termType: '',  // 上下学期type
      gradeItem: '', // 年级type

      toggleNum3: 0, // tab切换到复习套卷的次数
      startReviewTest: false, //是否开始查询复习套卷

      reviewMoreShow: false,
      reviewtypeList: [
        { name: '不限', value: '', active: true },
        { name: '真题', value: 'T01', active: false },
        { name: '模拟题', value: 'T02', active: false },
        { name: '预测', value: 'T31', active: false },
        { name: '期中', value: '["M03"]', type: true, active: false },
        { name: '期末', value: '["M04"]', type: true, active: false },
        { name: '练习卷', value: '["M01","M02"]', type: true, active: false },
      ],
      yearList: [], //复习套卷-年段list
      reviewMoreLable: '', // 复习套卷-类型list

      reviewTypeItem: '', // 复习套卷-类型type
      reviewType: '', // 复习套卷-类型查询是试卷模式/试卷类型
      yearItem: '', // 复习套卷-年份type

      changeGradeSubject: false,//更改了年级学科筛选
      changeMore: false, //更改了更多筛选

      toggleNum2: 0, // tab切换到知识点的次数
      startKnowledge: false, //是否开始查询知识点

      scrollTop: '',
      isLoading: false,
      onRefresh1: false,
      onRefresh2: false,
      onRefresh3: false,
    };
  },
  watch: {
    subjectType(nv, ov) {
      console.log("index subjectType nv", nv);
      console.log("index subjectType ov", ov);
      if (nv) {
        this.subjectList.forEach(ele => {
          ele.active = false
          if (ele.subjectType == nv) {
            ele.active = true
          }
        })
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs['gradeSubject'] && this.$refs['gradeSubject'].showChangeDialog) {
      this.$refs['gradeSubject'].showChangeDialog = false
      this.$refs['gradeSubject'].close()
      next(false)
    } else if (this.$refs['yearSubject'] && this.$refs['yearSubject'].showChangeDialog) {
      this.$refs['yearSubject'].showChangeDialog = false
      this.$refs['yearSubject'].close()
      next(false)
    } else if (this.areaFilterShow) {
      this.areaFilterShow = false
      next(false)
    } else if (this.typeSubjectFilterShow) {
      this.typeSubjectFilterShow = false
      next(false)
    } else if (this.versionFilterShow) {
      this.versionFilterShow = false
      next(false)
    } else if (this.gradeSubjectShow) {
      this.gradeSubjectShow = false
      next(false)
    } else if (this.reviewMoreShow) {
      this.reviewMoreShow = false
      next(false)
    } else {
      this.scrollTop = this.$refs['body'].scrollTop
      next();
    }

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.$refs["body"].scrollTop = vm.scrollTop
      });
    });
  },
  methods: {
    onRefresh() {
      if (this.active == 0) {
        this.onRefresh1 = true
      } else if (this.active == 1) {
        this.onRefresh2 = true
      } else if (this.active == 2) {
        this.onRefresh3 = true
      }
    },
    changeTab(active) {
      this.$refs["body"].scrollTop = 0
      this.isLoading = false

      if (active == 2) {
        this.getYearList()
        this.startReviewTest = true
        this.toggleNum3++

      } else if (active == 1) {
        this.startKnowledge = true
        this.toggleNum2++
      } else {
        this.startTypes = true
        this.toggleNum1++
      }
    },

    // 获取地区列表
    async getSysAreaList() {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "pageSize": 1000,
        currentPage: 1
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await sysAreaApi.getSysAreaList(params).then(respone => {
        this.$store.commit('setVanLoading', false)
        // console.log(respone, "getSysAreaList respone");
        if (respone == null) {
        } else {
          if (respone.data[0].sysAreaInfoList) {
            //重构数据
            let map = {};
            let list = [];
            let areaList = respone.data[0].sysAreaInfoList;
            if (areaList && areaList.length > 0) {
              //获取省
              let provinceMap = {};
              for (let i = 0; i < areaList.length; i++) {
                areaList[i].name = areaList[i].areaName
                if (areaList[i].parentCode == 0) {
                  provinceMap[areaList[i].areaCode + ""] =
                    areaList[i].areaName;
                }
              }
              // console.log(provinceMap);
              for (let i = 0; i < areaList.length; i++) {
                let ai = areaList[i];
                if (ai.parentCode == 0) {
                  continue;
                }
                if (!map[ai.parentCode]) {
                  if (ai.areaCode == "0757") {
                    ai.check = true
                  } else {
                    ai.check = false
                  }

                  let p = {
                    areaCode: ai.parentCode,
                    areaName: provinceMap[ai.parentCode + ""]
                      ? provinceMap[ai.parentCode + ""]
                      : "其他",
                    name: provinceMap[ai.parentCode + ""]
                      ? provinceMap[ai.parentCode + ""]
                      : "其他",
                    child: [ai]
                  }
                  if (ai.parentCode == "44") {
                    p.active = true
                  } else {
                    p.active = false
                  }

                  list.push(p);
                  map[ai.parentCode] = ai;
                } else {
                  for (let j = 0; j < list.length; j++) {
                    let dj = list[j];
                    if (ai.parentCode == "44") {
                      if (ai.areaCode == "0757") {
                        ai.check = true
                      } else {
                        ai.check = false
                      }
                    }
                    if (dj.areaCode == ai.parentCode) {
                      dj.child.push(ai);
                      break;
                    }
                  }
                }
              }
            }

            // console.log(list);
            // console.log(respone.data[0].sysAreaInfoList);
            this.area = list

          } else {
          }
        }
      },
        errMsg => { }

      )
    },

    //获取学校信息
    async getMySchoolInfo() {
      let obj = {
        interUser: "runLfb",
        interPwd: "25d55ad283aa400af464c76d713c07ad",
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        userType: this.$store.getters.getUserInfo.roleType,
        accountNo: this.$store.getters.getUserInfo.accountNo
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getMySchoolInfo(params).then(res => {
        console.log('getMySchoolInfo', res)
        if (res.flag && res.data.length > 0) {

          let schoolList = res.data[0].schoolList;
          let length = schoolList.length;
          this.schoolList = schoolList.map(item => {
            return { name: item.schoolName }
          })
          this.schoolName = this.schoolList[0] ? this.schoolList[0].name : '';

          // 获取老师科目列表，去重后
          for (let i = 0; i < length; i++) {
            let gradeList = schoolList[i].classGradeList;
            let gradeLen = gradeList.length;

            for (let j = 0; j < gradeLen; j++) {
              let subjectList = gradeList[j].subjectList;
              let arr = subjectList.map(item => {
                let obj = {
                  name: item.subjectName,
                  subjectType: item.subjectType
                }
                if (item.subjectType == localStorage.currentSubjectType) {
                  obj.active = true
                } else {
                  obj.active = false
                }
                return obj;
              })
              this.subjectList = Array.from(new Set([...this.subjectList, ...arr]));
            }
          }

          // 去重
          let a = {}
          this.subjectList = this.subjectList.reduce((cur, next) => {
            a[next.subjectType] ? "" : a[next.subjectType] = true && cur.push(next);
            return cur;
          }, [])

        }
      }).catch(err => {
        this.toggleNum2 = 0
      })
    },

    // 获取更多年份列表
    getYearList() {
      if (this.yearList.length) return
      let d = new Date()
      let nowYear = +d.getFullYear() + 2;
      for (var i = 0; i < 7; i++) {
        if (i == 0) {
          this.yearList.push({
            name: '不限',
            value: '',
            active: true
          })
        } else if (i == 6) {
          this.yearList.push({
            name: '更早',
            value: 'earlier',
            active: false
          })
        } else {
          this.yearList.push({
            name: nowYear - i,
            value: nowYear - i,
            active: false
          })
        }
      }
      this.reviewMoreLable = this.reviewtypeList[0].name + this.yearList[0].name
    },

  },
  async mounted() {
    this.getSysAreaList()
  }
}


</script>

<style lang="less" scoped>
@deep: ~">>>";
.question-type-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  &__tit {
    background-color: #fff;
    .van-col {
      line-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        color: @blue;
      }
    }
  }
  &__body {
    flex: 1;
    overflow-y: auto;
  }

  @{deep} .van-picker__toolbar {
    display: none;
  }
  @{deep} .van-cell__value {
    flex: 2;
  }
  .time-piker-header {
    height: 42px;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .date-box {
    height: 40px;
    padding: 0 15px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    .date-select {
      flex: 1;
      border-radius: 3px;
      border: 1px solid #999;
      line-height: 22px;
      background: #fff;
      text-align: center;
      &.active {
        border: 1px solid @blue;
      }
    }
  }

  .grade-pop-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    &__body__group {
      background: #fff;
      font-size: 14px;
      border-radius: 5px;
      margin-bottom: 10px;

      &-wrap {
        padding-left: 21px;
        display: flex;
        flex-wrap: wrap;

        &-item {
          flex: 0 0 79px;
          line-height: 37px;
          border-radius: 5px;
          font-size: 12px;
          margin-right: 8px;
          margin-bottom: 10px;
          background-color: #f5f5f5;
          color: #333;
          text-align: center;
          border: 1px solid transparent;
          border-left-width: 1px !important;

          &:nth-child(4n) {
            margin-right: 0;
          }

          &.active {
            border-color: @blue;
            background-color: #e0fffc !important;
          }
        }
      }
    }

    .close {
      font-size: 22px;
      position: absolute;
      right: 10px;
      top: 13px;
      color: #999;
      z-index: 1;
    }

    &__title {
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      font-weight: 700;
    }

    &__subject {
      font-size: 16px;
      text-align: center;
      line-height: 50px;
      padding: 0 40px 0 20px;
      // display: flex;
      // justify-content: space-around;
      font-weight: 700;
      overflow-x: scroll;
      white-space: nowrap;

      > span {
        margin-left: 5px;
        margin-right: 10px;
      }
    }

    &__body {
      display: flex;
      flex: 1;
      // overflow-y: auto;

      &-left {
        flex: 0 0 95px;
        overflow-y: auto;

        > div {
          height: 44px;
          display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          font-size: 15px;
          border-left: 2.5px solid transparent;

          &.active {
            color: @blue;
            border-left: 2.5px solid #16aab7;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;

        .tip {
          padding: 0 20px 10px;
        }
        .cell__item {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
          word-break: break-all;
          padding: 0 20px;

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }
        }
      }
    }
    &__body-more {
      flex: 1;
      overflow-y: auto;
    }

    &__footer {
      flex: 0 0 44px;
      padding: 5px 10px;

      .btn {
        border-radius: 22px;
        width: 100%;
      }
    }
  }
}
</style>
