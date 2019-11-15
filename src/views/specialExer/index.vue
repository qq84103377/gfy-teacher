<template>
  <section class="question-type-wrap">
    <van-row class="question-type-wrap__tit">
      <van-col span="8" :class="{ active: active == 0 }" @click="active = 0">题型专项</van-col>
      <van-col span="8" :class="{ active: active == 1 }" @click="active = 1">知识点专项</van-col>
      <van-col span="8" :class="{ active: active == 2 }" @click="active = 2">复习套卷</van-col>
    </van-row>

    <div class="question-type-wrap__body">
      <van-cell title="筛选" style="background: #f5f5f5;color: #999" />

      <van-cell @click="changeList(area,'地区');filterShow=true" title="地区" is-link>
        <div class="blue">{{filter.area}}</div>
      </van-cell>

      <van-cell v-if="active != 2" @click="changeList(subject,'科目');filterShow=true" title="科目" is-link>
        <div class="blue">
          {{filter.subject}}
        </div>
      </van-cell>

      <van-cell v-else @click="openGradePop" title="年级学科" is-link>
        <div class="blue">
          {{filter.grade}}
        </div>
      </van-cell>

      <van-cell v-if="active != 2" @click="changeList(testbook,'教材');filterShow=true" title="教材" is-link>
        <div class="blue">
          {{filter.testbook}}
        </div>
      </van-cell>

      <van-cell v-else @click="openMorePop" title="更多" is-link>
        <div class="blue">{{filter.more}}</div>
      </van-cell>

      <!-- <router-view ref="routerView"></router-view> -->
      <question-type v-if="active == 0"></question-type>
      <knowledge-point v-if="active == 1"></knowledge-point>
      <review-test v-if="active == 2"></review-test>

    </div>
    <filter-panel @selectParent="selectParent" :label="label" :visible.sync="filterShow" :title="title" :list="list" @filter="handleFilter" :double='double'></filter-panel>


    <!--    复习套卷-年级学科-->
    <van-popup v-model="gradePop" :close-on-click-overlay="false" round position="bottom" :style="{ height: '93%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(0,gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__subject van-hairline--bottom">
          <span v-for="(item, index) in subject" :key="index" :class="[{ blue: item.active }]" @click="handleSelectSubject(item)">{{ item.name }}</span>
        </div>
        <div class="grade-pop-wrap__body">

          <div class="grade-pop-wrap__body-left">
            <div @click="selectGradeParent(item,index)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{active:item.active}">{{item.name}}
            </div>
          </div>

          <div class="grade-pop-wrap__body-right">
            <div class="" v-for="(item,index) in gradeSubjectList[gradeIndex].child" :key="index">
              <div @click="handleSelectGrade(item)" class="van-hairline--bottom">
                <div :class="['cell__item',{active:item.check}]">{{item.name}}
                  <van-icon v-show="item.check" class="check blue" name="success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm(1)">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!--  更多-->
    <van-popup v-model="morePop" round position="bottom" :style="{ height: '93%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(1,moreList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">更多</div>
        <div class="grade-pop-wrap__body-more">
          <van-cell>
            类型
          </van-cell>
          <div class="grade-pop-wrap__body__group-wrap">
            <div @click="handleSelectChild(s, moreList[0])" v-for="(s, si) in moreList[0]" :key="si" :class="[
                'grade-pop-wrap__body__group-wrap-item',
                { active: s.active }
              ]">
              {{ s.name }}
            </div>
          </div>
          <van-cell>
            年份
          </van-cell>
          <div class="grade-pop-wrap__body__group-wrap">
            <div @click="handleSelectChild(s, moreList[1])" v-for="(s, si) in moreList[1]" :key="si" :class="[
                'grade-pop-wrap__body__group-wrap-item',
                { active: s.active }
              ]">
              {{ s.name }}
            </div>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script>
import { generateTimeReqestNumber } from "@/utils/filter";
import reviewTest from "./component/reviewTest";
import questionType from "./component/questionType";
import knowledgePoint from "./component/knowledgePoint";
import filterPanel from './component/filterPanel'
import { gettestbookVersionInfo, getSubjectType } from '@/api/index'

export default {
  name: "index",
  components: {
    reviewTest,
    questionType,
    knowledgePoint,
    filterPanel
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

      area: [
        { name: '广东', active: true, child: [{ name: '广州市' }, { name: '清远市' }, { name: '韶关市' }] },
        { name: '广西', child: [{ name: '玉林市' }, { name: '贵港市' }, { name: '南陵市' }] },
      ],
      subject: [
        { name: '语文', value: 'Y01', active: true, child: [] },
        { name: '数学', value: 'Y02', active: false, child: [] },
        { name: '英语', value: 'Y03', active: false, child: [] },
        { name: '物理', value: 'Y03', active: false, child: [] },
        { name: '化学', value: 'Y03', active: false, child: [] },
        { name: '高中', value: 'Y03', active: false, child: [] },
      ],
      subjectIndex:0,
      testbook: [
        { name: '粤教沪科版(沪粤版)', active: true, child: [{ name: '亲年级上册' }, { name: '八年级下册' }, { name: '老头教学' }] },
        { name: '外研版', child: [{ name: 'asdasd' }, { name: '八年级fdfgd下册' }, { name: '老头sdfs教学' }] },
      ],
      course: [
        { name: '一单元', child: [{ name: '说和做砂进口的' }, { name: '的境况是假的' }, { name: '健康的时刻纯净水' }] },
        { name: '五座', child: [{ name: '四渡赤水都吃' }, { name: 'as' }, { name: '的深V是' }] },
      ],
      list: [
        { name: '小学', value: 'Y01', active: true, child: [] },
        { name: '初中', value: 'Y02', active: false, child: [] },
        { name: '高中', value: 'Y03', active: false, child: [] },
      ],
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
    };
  },
  methods: {
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
      if (this.title === '地区') {
        let area = item.child.find(v => v.check)
        this.filter.area = item.name + "-" + area.name
        this.checkItem(this.area, item)
      } else if (this.title === '教材') {
        let testbook = item.child.find(v => v.check)
        this.filter.testbook = item.name + "-" + testbook.name
        this.checkItem(this.testbook, item)
      } else if (this.title === '科目') {
        this.filter.subject = item.name
        this.checkItem(this.subject, item)
      } else if (this.title === '课程') {
        // this.filter.course = item.name
        // this.checkItem(this.course, item)
      }
    },
    checkItem(arr, item) {
      if (this.double) {
        arr.forEach(v => {
          this.$set(v, 'active', v.name === item.name)
          if (v.name === item.name) {
            v.child.forEach((_v, index) => {
              this.$set(_v, 'check', item.child[index].check)
            })
          }
        })
      } else {
        arr.forEach(v => {
          this.$set(v, 'active', v.name === item.name)
        })
      }

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
    selectGradeParent(item, index) {
      this.gradeIndex = index
      if (item.active) return
      this.gradeSubjectList.forEach(v => {
        this.$set(v, 'active', false)
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        });
      })
      this.$set(item, 'active', true)
      // 默认选中第一个
      // this.$set(item.child[0], 'check', true)
    },
    handleSelectGrade(item) {
      if (item.check) return
      this.gradeSubjectList.forEach(v => {
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        });
      })
      this.$set(item, 'check', true)

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
    }
  },
  // created() {
  //   this.gettestbookVersionInfo()
  //   this.getSubjectType()
  // }
};
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
