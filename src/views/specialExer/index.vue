<template>
  <section class="question-type-wrap">
    <van-row class="question-type-wrap__tit">
      <van-col span="8" :class="{active:active==0}" @click="active=0">题型专项</van-col>
      <van-col span="8" :class="{active:active==1}" @click="active=1">知识点专项</van-col>
      <van-col span="8" :class="{active:active==2}" @click="active=2">复习套卷</van-col>
    </van-row>

    <!-- <div @click="toggleTab(item,index)" :class="['report-detail__tab-item',{'blue':item.active}]" v-for="(item,index) in tabList" :key="index">{{item.name}}
      </div> -->

    <div class='question-type-wrap__body'>
      <van-cell title="筛选" style="background: #f5f5f5;color: #999" />

      <van-cell @click="openAreaPop" title="地区" is-link>
        <div class="blue">{{gradeSubjectList[gradeIndex].name}}</div>
      </van-cell>

      <van-cell v-if="active!=2" @click="openSubjectPop" title="科目" is-link>
        <div class="blue">{{classList[classIndex].schoolYear + classList[classIndex].gradeName + classList[classIndex].className}}</div>
      </van-cell>

      <van-cell v-else @click="openGradePop" title="年级学科" is-link>
        <div class="blue">{{classList[classIndex].schoolYear + classList[classIndex].gradeName + classList[classIndex].className}}</div>
      </van-cell>

      <van-cell v-if="active!=2" @click="openTextbookPop" title="教材" is-link>
        <div class="blue">{{classList[classIndex].schoolYear + classList[classIndex].gradeName + classList[classIndex].className}}</div>
      </van-cell>

      <van-cell v-else @click="openMorePop" title="更多" is-link>
        <div class="blue">什么更多</div>
      </van-cell>

      <!-- <router-view ref="routerView"></router-view> -->
      <question-type v-if='active==0'></question-type>
      <knowledge-point v-if='active==1'></knowledge-point>
      <review-test v-if='active==2'></review-test>

    </div>
    <!-- 地区-->
    <van-popup v-model="areaPop" :close-on-click-overlay="false" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">地区</div>
        <div class="grade-pop-wrap__body">
          <div class="province">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" class="province_border" :class="{active:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
              </div>
            </van-cell>
          </div>
          <div class="city">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{cityActive:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
                <van-icon v-if="item.active" class="blue" name="success" />
              </div>
            </van-cell>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!--   科目-->
    <van-popup v-model="subjectPop" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(classList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">科目</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,classList)" v-for="(value,key) in classList" :key="key">
            <div slot="title" class="aic jcsb"><span>{{value.schoolYear + value.gradeName + value.className}}</span>
              <van-icon v-if="value.active" class="blue" name="success" />
            </div>
          </van-cell>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm(1)">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!--    复习套卷-年级学科-->
    <van-popup v-model="gradePop" :close-on-click-overlay="false" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__subject van-hairline--bottom">
          <span v-for="(item,index) in rangeList" :key="index" :class="[{blue:item.active}]" @click="">{{item.name}}</span>
        </div>
        <div class="grade-pop-wrap__body">
          <div class="province">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" class="province_border" :class="{active:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
              </div>
            </van-cell>
          </div>
          <div class="city">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{cityActive:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
                <van-icon v-if="item.active" class="blue" name="success" />
              </div>
            </van-cell>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!--    教材-->
    <van-popup v-model="textbookPop" :close-on-click-overlay="false" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">教材</div>
        <div class="grade-pop-wrap__body">
          <div class="province">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" class="province_border" :class="{active:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
              </div>
            </van-cell>
          </div>
          <div class="city">
            <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{cityActive:item.active}">
              <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
                <van-icon v-if="item.active" class="blue" name="success" />
              </div>
            </van-cell>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!--  更多-->
    <van-popup v-model="morePop" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(classList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">更多</div>
        <div class="grade-pop-wrap__body">
          <van-cell>
            类型
          </van-cell>
          <div class="grade-pop-wrap__body__group-wrap">
            <div @click="handleSelectChild(s,c)" v-for="(s,si) in list" :key="si" :class="['grade-pop-wrap__body__group-wrap-item',{active:s.active}]">{{s}}
            </div>
          </div>
          <van-cell>
            年份
          </van-cell>
          <div class="grade-pop-wrap__body__group-wrap">
            <div @click="handleSelectChild(s,c)" v-for="(s,si) in list" :key="si" :class="['grade-pop-wrap__body__group-wrap-item',{active:s.active}]">{{s}}
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
import { generateTimeReqestNumber } from '@/utils/filter'
import reviewTest from './component/reviewTest'
import questionType from './component/questionType'
import knowledgePoint from './component/knowledgePoint'

export default {
  name: "index",
  components: {
    reviewTest,
    questionType,
    knowledgePoint
  },
  data() {
    return {
      rangeList: [
        { name: '近一周', mtd1: 'getDate', mtd2: 'setDate', num: 7, active: true },
        { name: '近一个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 1, active: false },
        { name: '近三个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 3, active: false },
      ],
      areaPop: false,
      subjectPop: false,
      textbookPop: false,
      morePop: false,
      gradePop: false,
      showTime: false,
      currentDate: '',
      maxDate: new Date(),
      gradeSubjectList: [],
      gradeIndex: 0,
      classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
      // classList: {0:{gradeName:'全部',schoolYear:'',className:'',classId:'',active:true},...JSON.parse(localStorage.getItem("classMap"))},
      classList: JSON.parse(localStorage.getItem("classMap")),
      filterTime: {
        start: '',
        end: generateTimeReqestNumber(new Date()),
        type: true,   //true为开始
      },
      activeKey: 0,
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      active: 0
    }
  },
  methods: {
    dateRange(methodName1, methodName2, num, index) {
      let time1 = new Date()
      time1[methodName2](time1[methodName1]() - num)
      this.filterTime.start = generateTimeReqestNumber(time1)
      this.filterTime.end = generateTimeReqestNumber(new Date())
      this.rangeList.forEach(v => {
        v.active = false
      })
      this.rangeList[index].active = true
      if (this.filterTime.type) {
        this.currentDate = new Date(this.filterTime.start)
      } else {
        this.currentDate = new Date(this.filterTime.end)
      }
    },
    changeDate(picker) {
      console.log(picker.getValues(), '=======');
      if (this.filterTime.type) {
        //开始时间
        this.filterTime.start = picker.getValues().join('-')
      } else {
        this.filterTime.end = picker.getValues().join('-')
      }
    },
    confirmDate() {
      //判断结束时间时候小于结束时间
      let time1 = new Date(this.filterTime.start)
      let time2 = new Date(this.filterTime.end)
      if (time1.getTime() > time2.getTime()) {
        return this.$toast('开始时间不能大于结束时间')
      }
      if (this.$route.path === '/taskStat') {
        this.$refs['routerView'].init()
      } else if (this.$route.path === '/studySituation') {
        this.$refs['routerView'].handleLoad()
      }
      this.showTime = false
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === "day") {
        return `${value}日`
      } else if (type === "hour") {
        return `${value}时`
      } else if (type === "minute") {
        return `${value}分`
      }
      return value;
    },
    handleClose(arr) {
      this.areaPop = false
      this.subjectPop = false
      this.textbookPop = false
      this.gradePop = false
      this.morePop = false
      for (let key in arr) {
        this.$set(arr[key], 'active', false)
      }
    },
    openDatePicker() {
      this.showTime = true
    },
    openAreaPop() {
      this.areaPop = true
      this.$set(this.gradeSubjectList[this.gradeIndex], 'active', true)
    },
    openGradePop() {
      this.gradePop = true
      this.$set(this.gradeSubjectList[this.gradeIndex], 'active', true)
    },
    openTextbookPop() {
      this.textbookPop = true
      this.$set(this.classList[this.classIndex], 'active', true)
    },
    openSubjectPop() {
      this.subjectPop = true
      this.$set(this.classList[this.classIndex], 'active', true)
    },
    openMorePop() {
      this.morePop = true
      this.$set(this.classList[this.classIndex], 'active', true)
    },
    selectItem(item, index, arr) {
      if (item.active) return
      for (let key in arr) {
        this.$set(arr[key], 'active', false)
      }
      item.active = true
    },
    confirm(flag) {
      if (flag) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "是否进行科目的切换？科目切换后，首页的科目也将进行切换",
            confirmButtonColor: '#39F0DD',
            className: 'change-subject'
          })
          .then(() => {
            // on confirm
            for (let key in this.classList) {
              if (this.classList[key].active) {
                this.classIndex = key * 1
                break
              }
            }
            this.subjectPop = false

            // let obj = {
            //   interUser: "runLfb",
            //   interPwd: "25d55ad283aa400af464c76d713c07ad",
            //   convertAccountNo: this.$store.getters.getUserInfo.accountNo,
            //   recordId: id
            // };
            // let params = {
            //   requestJson: JSON.stringify(obj)
            // };
            // delExchangeApplyGoodsInfo(params).then(res => {
            //   if (res.flag) {
            //     this.$toast.success('删除成功！');
            //     this.recordList.splice(index, 1);
            //   } else {
            //     this.$toast.fail(res.msg)
            //   }
            // })
          })
          .catch(() => {
            // on cancel

          });
        return
      } else {
        const index = this.gradeSubjectList.findIndex(v => v.active)
        // this.filterText.grade = index > -1 ? this.gradeSubjectList[index].name : ''
        this.gradeIndex = index > -1 ? index : 0
        this.areaPop = false
      }
    }
  },
  created() {
    let arr = []
    let flag = true
    JSON.parse(localStorage.gradeList).forEach(v => {
      v.teacherInfoList.forEach(t => {
        if (t.subjectType !== 'S20') {
          arr.push({ name: v.gradeName + t.subjectName, classGrade: v.classGrade, subjectType: t.subjectType, active: localStorage.currentSubjectType === t.subjectType && flag })
          if (localStorage.currentSubjectType === t.subjectType && flag) {
            flag = false
          }
        }
      })
    })
    this.gradeSubjectList.push(...arr)
    let time = new Date()
    time.setDate(time.getDate() - 7)
    this.filterTime.start = generateTimeReqestNumber(time)
    this.currentDate = new Date(this.filterTime.start)

  },
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

  &__body {
    flex: 1;
    overflow-y: auto;
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
      flex: 1;
      overflow-y: auto;

      .province {
        // position: absolute;
        height: auto;
        padding-bottom: 50px;
        top: 50px;
        left: 0;
        bottom: 50px;
        width: 30%;
        font-size: 12px;

        &_border {
          border-left: 3px solid transparent;
        }
      }

      .active {
        background: #fff;
        color: @blue;
        border-left: 3px solid @blue;
      }

      .cityActive {
        color: @blue;
      }

      .city {
        position: absolute;
        height: auto;
        top: 50px;
        left: 30%;
        bottom: 50px;
        width: 70%;
        font-size: 12px;
        overflow-y: scroll;
      }
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
