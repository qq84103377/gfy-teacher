<template>
  <section class="question-type-wrap">
    <van-row class="question-type-wrap__tit">
      <van-col span="8" :class="{ active: active == 0 }" @click="active = 0">题型专项</van-col>
      <van-col span="8" :class="{ active: active == 1 }" @click="active = 1">知识点专项</van-col>
      <van-col span="8" :class="{ active: active == 2 }" @click="active = 2;changeTab(2)">复习套卷</van-col>
    </van-row>

    <div class="question-type-wrap__body">
      <van-cell title="筛选" style="background: #f5f5f5;color: #999" />

      <van-cell @click="changeList(area,'地区');filterShow=true" title="地区" is-link>
        <div class="blue">{{areaLabel}}</div>
      </van-cell>

      <!-- <van-cell v-if="active != 2" @click="changeList(subject,'科目');filterShow=true" title="科目" is-link>
        <div class="blue">
          {{filter.subject}}
        </div>
      </van-cell>  -->

      <van-cell v-if="active != 2" @click="subjectFilterShow=true" title="科目" is-link>
        <div class="blue">
          {{subjectLabel}}
        </div>
      </van-cell>

      <van-cell v-else @click="yearSubjectShow=true" title="年级学科" is-link>
        <div class="blue">
          {{yearSubjectLabel}}
        </div>
      </van-cell>

      <!-- <van-cell v-if="active != 2" @click="changeList(testbook,'教材');filterShow=true" title="教材" is-link>
        <div class="blue">
          {{filter.testbook}}
        </div>
      </van-cell> -->

      <van-cell v-if="active != 2" @click="versionFilterShow=true" title="教材" is-link>
        <div class="blue">
          {{versionLabel}}
        </div>
      </van-cell>

      <van-cell v-else @click="reviewMoreShow=true" title="更多" is-link>
        <div class="blue">{{reviewMoreLable}}</div>
      </van-cell>

      <question-type v-show="active == 0" :list='typesList' :areaCode='areaCode' :courseIds='courseIds' :classGrade='gradeTerm'></question-type>
      <knowledge-point v-show="active == 1"></knowledge-point>
      <review-test v-show="active == 2" :start.sync='startReviewTest' :active='active' :subjectType.sync='subjectType' :classGrade.sync='gradeItem' :areaCode.sync='areaCode' :provinceCode.sync='provinceCode' :belongYear.sync='yearItem' :reviewTypeItem.sync='reviewTypeItem' :reviewType.sync='reviewType' :termType.sync='termType' :changeYearSubject.sync='changeYearSubject' :changeMore.sync='changeMore'></review-test>

    </div>
    <filter-panel :label.sync="areaLabel" :visible.sync="filterShow" :list.sync="area" :areaCode.sync="areaCode" :provinceCode.sync="provinceCode" :double='double'></filter-panel>

    <subject-filter :label.sync="subjectLabel" :visible.sync="subjectFilterShow" :types.sync="typesList" :subjectType.sync='subjectType'></subject-filter>

    <version-filter :gradeTerm.sync="gradeTerm" :label.sync="versionLabel" :visible.sync="versionFilterShow" :courseIds.sync='courseIds'></version-filter>

    <year-subject :label.sync="yearSubjectLabel" :visible.sync="yearSubjectShow" :subjectType.sync='subjectType' :toggleNum2='toggleNum2' :termType.sync='termType' :gradeItem.sync='gradeItem' :subjectList.sync='subjectList' :reviewtypeList.sync='reviewtypeList' :changeYearSubject.sync='changeYearSubject'></year-subject>

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

import subjectFilter from '../resCentre/component/subjectFilter'
import versionFilter from './component/versionFilter'
import yearSubject from './component/yearSubject'
import moreFilter from './component/moreFilter'

export default {
  name: "index",
  components: {
    reviewTest,
    questionType,
    knowledgePoint,
    filterPanel,
    subjectFilter,
    versionFilter,
    yearSubject,
    moreFilter
  },
  data() {
    return {
      active: 0,

      morePop: false,
      gradePop: false,

      filterShow: false,
      title: '',
      filter: {
        area: '',
        subject: '',
        testbook: '',
        grade: '',
        more: ''
      },
      double: true,

      // area: [
      //   { name: '广东', active: true, child: [{ name: '广州市' }, { name: '清远市' }, { name: '韶关市' }] },
      //   { name: '广西', child: [{ name: '玉林市' }, { name: '贵港市' }, { name: '南陵市' }] },
      // ],
      // subject: [
      //   { name: '语文', value: 'Y01', active: true, child: [] },
      //   { name: '数学', value: 'Y02', active: false, child: [] },
      //   { name: '英语', value: 'Y03', active: false, child: [] },
      //   { name: '物理', value: 'Y03', active: false, child: [] },
      //   { name: '化学', value: 'Y03', active: false, child: [] },
      //   { name: '高中', value: 'Y03', active: false, child: [] },
      // ],

      subject: [],

      testbook: [
        { name: '粤教沪科版(沪粤版)', active: true, child: [{ name: '亲年级上册' }, { name: '八年级下册' }, { name: '老头教学' }] },
        { name: '外研版', child: [{ name: 'asdasd' }, { name: '八年级fdfgd下册' }, { name: '老头sdfs教学' }] },
      ],

      course: [
        { name: '一单元', child: [{ name: '说和做砂进口的' }, { name: '的境况是假的' }, { name: '健康的时刻纯净水' }] },
        { name: '五座', child: [{ name: '四渡赤水都吃' }, { name: 'as' }, { name: '的深V是' }] },
      ],
      // list: [
      //   { name: '小学', value: 'Y01', active: true, child: [] },
      //   { name: '初中', value: 'Y02', active: false, child: [] },
      //   { name: '高中', value: 'Y03', active: false, child: [] },
      // ],
      moreList: [
        [
          { name: '小学', value: 'Y01', active: true, child: [] },
          { name: '初中', value: 'Y02', active: false, child: [] },
          { name: '高中', value: 'Y03', active: false, child: [] },
        ],
        [
          { name: '小学', value: 'Y01', active: true, child: [] },
          { name: '初中', value: 'Y02', active: false, child: [] },
          { name: '高中', value: 'Y03', active: false, child: [] },
        ]
      ],
      moreIndex: '',

      label: 'subjectName',

      // areaPop: false,
      // subjectPop: false,
      // testbookPop: false,

      gradeSubjectList: [
        { name: '粤教沪科版(沪粤版)', active: true, child: [{ name: '亲年级上册' }, { name: '八年级下册' }, { name: '老头教学' }] },
        { name: '外研版', child: [{ name: 'asdasd' }, { name: '八年级fdfgd下册' }, { name: '老头sdfs教学' }] }
      ],
      gradeIndex: 0,
      gradeOldIndex: 0,
      gradeIndex2: -1,

      classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],

      classList: JSON.parse(localStorage.getItem("classMap")),

      subjectList: [],
      schoolList: [],
      classList: [],
      postList: [],
      schoolName: '',
      subjectName: '',

      className: {
        name: "",
        stuNum: 0
      },

      area: [],
      areaLabel: '广东省佛山市',
      areaFilterShow: false,
      areaCode: '0757',
      provinceCode: '44',

      subjectFilterShow: false,
      subjectLabel: '',
      subjectType: localStorage.currentSubjectType,

      resCourseFilterShow: false,
      addCourseShow: false,
      versionFilterShow: false,
      versionLabel: '',

      gradeTerm: '', //年级学期
      typesList: [],
      courseIds: [],

      yearSubjectLabel: '',
      yearSubjectShow: false,
      termType: '',
      gradeItem: '',

      toggleNum2: 0,
      startReviewTest: false, //是否开始查询

      reviewMoreShow: false,
      reviewtypeList: [
        { name: '不限', value: '', active: true },
        { name: '真题', value: 'T01', active: false },
        { name: '模拟题', value: 'T02', active: false },
        { name: '期中', value: '[M03]', type: true, active: false },
        { name: '期末', value: '[M04]', type: true, active: false },
        { name: '练习卷', value: '[M01,M02]', type: true, active: false },
      ],
      yearList: [],
      reviewMoreLable: '',


      reviewTypeItem: '',
      reviewType: '',
      yearItem: '',
      changeYearSubject: false,
      changeMore: false,



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

        // this.onLoad()
        // // this.getTestPaperInfoList()
        // this.$emit('update:start', false)
      }
    },
  },
  methods: {
    changeTab(active) {
      console.log(this.toggleNum2, 'toggleNum2////');
      if (active == 2 && this.toggleNum2 == 0) {
        this.$store.commit('setVanLoading', true)
        this.getYearList()
        Promise.all([this.getMySchoolInfo()]).then(res => {
          console.log("???????");
          this.startReviewTest = true
          this.toggleNum2++

          this.$store.commit('setVanLoading', false)
        }).catch(err => {
          //  throw Error(err)
          this.$store.commit('setVanLoading', false)
        })
      }else if(active == 0){
   
      }
    },
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
        console.log(respone, "getSysAreaList respone");
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
              console.log(provinceMap);
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

            console.log(list);
            console.log(respone.data[0].sysAreaInfoList);
            this.area = list
            this.filter.area = "广东省佛山市"
            //let province = respone.data[0].sysAreaInfoList.pop();

            // this.sysAreaInfoList = list;//////

            // if (that.sysAreaInfoList && that.sysAreaInfoList.length > 0) {
            //   that.selectCity = that.sysAreaInfoList[0].areaCode;
            // }

            // this.currentProvince = this.sysAreaInfoList[0];//////
            // this.selectProvince = this.currentProvince.areaCode;//////
            // this.selectCity = this.currentProvince.childList[0].areaCode;//////

            //that.selectProvinceName = province.areaName;
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
          console.log("?");
          let schoolList = res.data[0].schoolList;
          let length = schoolList.length;
          this.schoolList = schoolList.map(item => {
            return { name: item.schoolName }
          })
          this.schoolName = this.schoolList[0] ? this.schoolList[0].name : '';
          console.log("??");
          // 获取老师科目列表，去重后
          for (let i = 0; i < length; i++) {
            let gradeList = schoolList[i].classGradeList;
            let gradeLen = gradeList.length;
            console.log("???");
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
          console.log("????");

          console.log(this.subjectList, 'this.subject ');

          // 去重
          let a = {}
          this.subjectList = this.subjectList.reduce((cur, next) => {
            a[next.subjectType] ? "" : a[next.subjectType] = true && cur.push(next);
            return cur;
          }, [])

          console.log(this.subjectList, 'this.subjectList ');

          // this.filter.subject = localStorage.getItem("currentSubjectTypeName")

        }
      }).catch(err => {
        this.toggleNum2 = 0
      })
    },
    async getSysDictList() {
      const json = {
        requestJson: JSON.stringify({
          interUser: "123",
          interPwd: "123",
          dictCode: "Domain_Exam_Belong_Type"
        })
      }
      await getSysDictList(json).then(res => {
        console.log(res, 'getSysDictList res');
        if (res.flag) {
          this.reviewtypeList = res.data[0].sysDictInfoList.map(function (item) {
            return {
              name: item.dictValue,
              value: item.dictKey,
              active: false
            };
          });
          var temp = {
            name: "不限",
            value: "",
            active: true
          };
          this.reviewtypeList.unshift(temp);
          this.reviewMoreLable = this.reviewtypeList[0].value;
        }
      }).catch(err => {
        this.toggleNum2 = 0
      })
    },
    getYearList() {
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

    selectParent(index) {
      // return
      if (this.title === '科目') {
        this.getSubjectType(index)
      } else if (this.title === '地区' || this.title === '教材') {
        // this.list.forEach(v => {
        //   this.$set(v, 'active', false)
        //   v.child.forEach(_v => {
        //     this.$set(_v, 'check', false)
        //   });
        // })
        // this.$set(this.list[index], 'active', true)
        // this.$set(this.list[index].child[0], 'check', true)
        // this.list = JSON.parse(JSON.stringify(this.area))
      }
    },
    getSubjectType(index = 0) {
      if (this.subject[index].done) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        yearSection: this.subject[index].value,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getSubjectType(params).then(res => {
        this.$set(this.subject[index], 'done', true) // 是否已加载了数据
        if (res.flag) {
          this.subject[index].child = res.resSubjectTypeInfoList
          this.list[index].child = res.resSubjectTypeInfoList
        }
      })
    },
    gettestbookVersionInfo() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "yearSection": "Y02",
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      gettestbookVersionInfo(params).then(res => {
        if (res.flag) {
          res.testbookVersionList
        }
      })
    },
    changeList(arr, title) {
      this.title = title
      this.double = true
      // this.$set(arr[0], 'active', true)

      if (title === '科目') {
        this.label = 'subjectName'
        this.double = false
        // this.$set(arr[0], 'check', true)
      } else {
        // this.$set(arr[0], 'active', true)
        // this.$set(arr[0].child[0], 'check', true)
      }
      this.list = JSON.parse(JSON.stringify(arr))
    },
    handleFilter(item) {
      console.log(item, 'handleFilter item');
      if (this.title === '地区') {
        let area = item.child.find(v => v.check)
        this.areaCode = area.areaCode
        this.provinceCode = item.areaCode
        this.checkItem(this.area, item)
      }
    },
    checkItem(arr, item) {
      arr.forEach(v => {
        this.$set(v, 'active', v.name === item.name)
        if (v.name === item.name) {
          v.child.forEach((_v, index) => {
            this.$set(_v, 'check', item.child[index].check)
            this.areaCode = item.child[index].areaCode
          })
        }
      })
    },

    handleClose(index, arr) {
      this.gradePop = false;
      this.morePop = false;
      console.log(arr);
      if (index) {
        arr.forEach(element => {
          for (let key in element) {
            this.$set(element[key], "active", false);
          }
          // if (element.child.length) {
          //   element.child.forEach(ele => {
          //     this.$set(ele, "check", false);
          //   });
          // }
        });
      } else {
        arr.forEach(element => {
          this.$set(element, "active", false)
          if (element.child.length) {
            element.child.forEach(ele => {
              this.$set(ele, "check", false);
            });
          }
        })
      }
    },
    handleSelectChild(s, arr) {
      let check = !s.active
      arr.forEach(item => {
        this.$set(item, 'active', false)
        if (item.name == s.name) {
          this.$set(item, 'active', check)
        }
      });
    },
    handleSelectSubject(item) {
      // if (item.active) return
      // this.subject.forEach(v => {
      //   this.$set(v, 'active', false)
      // })
      // this.$set(item, 'active', true)
    },

    openGradePop() {
      this.gradePop = true;
      this.gradeIndex = this.gradeOldIndex
      this.$set(this.gradeSubjectList[this.gradeIndex], "active", true);
      if (this.gradeIndex2 >= 0) {
        this.$set(this.gradeSubjectList[this.gradeIndex].child[this.gradeIndex2], "active", true);
      }
    },

    openMorePop() {
      this.morePop = true;
      this.moreList.forEach(element => {
        element.forEach(ele => {
          this.$set(ele, "active", false)
        });
      });
      if (this.moreIndex) {

        this.moreList[0][this.moreIndex[0]] && this.$set(this.moreList[0][this.moreIndex[0]], "active", true)
        this.moreList[1][this.moreIndex[1]] && this.$set(this.moreList[1][this.moreIndex[1]], "active", true)
      }

    },

    selectItem(item, index, arr) {
      if (item.active) return;
      for (let key in arr) {
        this.$set(arr[key], "active", false);
      }
      item.active = true;
    },
    confirm(flag) {
      if (flag) {

        // this.$dialog
        //   .confirm({
        //     title: "提示",
        //     message: "是否进行科目的切换？科目切换后，首页的科目也将进行切换",
        //     confirmButtonColor: "#39F0DD",
        //     className: "change-subject"
        //   })
        //   .then(() => {
        //     // on confirm
        //     for (let key in this.classList) {
        //       if (this.classList[key].active) {
        //         this.classIndex = key * 1;
        //         break;
        //       }
        //     }
        //     this.subjectPop = false;

        //   })
        //   .catch(() => {
        //     // on cancel
        //   });

        let gradeIndex2 = this.gradeSubjectList[this.gradeIndex].child.findIndex(ele => ele.check)

        if (gradeIndex2 < 0) {
          this.$toast('请选择')
          return
        }

        this.gradePop = false
        this.gradeIndex2 = gradeIndex2
        this.gradeOldIndex = this.gradeIndex

        this.filter.grade = this.gradeSubjectList[this.gradeIndex].name + "-" + this.gradeSubjectList[this.gradeIndex].child[this.gradeIndex2].name

      } else {
        let arr = []
        let index = ''
        this.moreList.forEach(ele => {
          index = ele.findIndex(v => v.active)
          arr.push(index)
          // if (index >= 0) {
          //   arr.push(index)
          // }
        })
        console.log(arr, 'arr');
        if (arr.length) {
          this.moreIndex = arr
          if (this.moreList[0][this.moreIndex[0]]) {
            this.filter.more = this.moreList[0][this.moreIndex[0]].name
          }
          if (this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = this.moreList[1][this.moreIndex[1]].name
          }
          if (this.moreList[0][this.moreIndex[0]] && this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = this.moreList[0][this.moreIndex[0]].name + '，' + this.moreList[1][this.moreIndex[1]].name
          }
          if (!this.moreList[0][this.moreIndex[0]] && !this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = ''
          }

        } else {
          this.moreIndex = ''
        }

        this.morePop = false;

      }
    },


    handleYearSecion() {
      const year = this.subjectLabel.substr(0, 2)
      if (year === '小学') {
        return 'Y01'
      } else if (year === '初中') {
        return 'Y02'
      } else {
        return 'Y03'
      }
    }
  },
  async mounted() {
    // this.gettestbookVersionInfo()
    // this.getSubjectType()

    // this.$store.commit('setVanLoading', true)
    // Promise.all([this.getSysAreaList(), this.getGradeTermInfo(), this.getPublishByRole(), this.getClassTeacherCourseDeploy()]).then(res => {
    //   this.$store.commit('setVanLoading', false)
    // }).catch(err => {
    //   this.$store.commit('setVanLoading', false)
    // })


    this.getSysAreaList()
    // await this.getMySchoolInfo()
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
