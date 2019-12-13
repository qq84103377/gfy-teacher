<template>
  <section class="teach-stat-wrap">
    <van-nav-bar
      v-if="$route.path === '/teachStat/'"
      title="教学统计">
    </van-nav-bar>
    <div>
      <van-cell title="筛选" style="background: #f5f5f5;color: #999"/>
      <van-cell @click="openGradePop" title="年级学科" is-link>
        <div class="blue">{{gradeSubjectList[gradeIndex].name}}</div>
      </van-cell>
      <van-cell @click="openClassPop" title="班级" is-link>
        <div class="blue">{{classList[classIndex].schoolYear + classList[classIndex].gradeName + classList[classIndex].className}}</div>
      </van-cell>
      <van-cell @click="openDatePicker" is-link>
        <div slot="title" class="aic jcsb">
          <div>时间</div>
          <div class="blue">{{filterTime.start}}--{{filterTime.end}}</div>
        </div>
      </van-cell>
    </div>
    <div v-show="showTime" class="teach-stat__time-picker-wrap">
      <div class="time-piker-header">
        <div>
          <span v-for="(item,index) in rangeList" :key="index" :class="['mgr15',{blue:item.active}]" @click="dateRange(item.mtd1,item.mtd2,item.num,index)">{{item.name}}</span>
        </div>
        <div class="blue" @click="confirmDate">确认</div>
      </div>
      <div class="date-box">
        <div @click="filterTime.type = true;currentDate = new Date(filterTime.start)" class="date-select" :class="{active:filterTime.type}">{{filterTime.start}}</div>
        <div class="mgr10 mglt10">~</div>
        <div @click="filterTime.type = false;currentDate = new Date(filterTime.end)" class="date-select" :class="{active:!filterTime.type}">{{filterTime.end}}</div>
      </div>
      <van-datetime-picker
        ref="datePicker"
        confirm-button-text=" "
        cancel-button-text=" "
        v-model="currentDate"
        :max-date="maxDate"
        type="date"
        @change="changeDate"
      />
    </div>

    <router-view ref="routerView"></router-view>

    <slot name="reinforce" ref="reinforce"></slot>

    <!--    年级学科-->
    <van-popup
      get-container="#app"
      v-model="gradePop"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">年级学科</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index">
            <div slot="title" class="aic jcsb"><span>{{item.name}}</span>
              <van-icon v-if="item.active" class="blue" name="success"/>
            </div>
          </van-cell>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!--    班级-->
    <van-popup
      get-container="#app"
      v-model="classPop"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(classList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">班级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,classList)" v-for="(value,key) in classList" :key="key">
            <div slot="title" class="aic jcsb"><span>{{value.schoolYear + value.gradeName + value.className}}</span>
              <van-icon v-if="value.active" class="blue" name="success"/>
            </div>
          </van-cell>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm(1)">确定</van-button>
        </div>
      </div>
    </van-popup>
<!--时间-->
    <van-popup
      v-model="showTime"
      get-container="#app"
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '50%' }">
      <div class="teach-stat__time-picker-wrap">
        <div class="time-piker-header">
          <div>
            <span v-for="(item,index) in rangeList" :key="index" :class="['mgr15',{blue:item.active}]" @click="dateRange(item.mtd1,item.mtd2,item.num,index)">{{item.name}}</span>
          </div>
          <div class="blue" @click="confirmDate">确认</div>
        </div>
        <div class="date-box">
          <div @click="filterTime.type = true;currentDate = new Date(filterTime.start)" class="date-select" :class="{active:filterTime.type}">{{filterTime.start}}</div>
          <div class="mgr10 mglt10">~</div>
          <div @click="filterTime.type = false;currentDate = new Date(filterTime.end)" class="date-select" :class="{active:!filterTime.type}">{{filterTime.end}}</div>
        </div>
        <van-datetime-picker
          ref="datePicker"
          confirm-button-text=" "
          cancel-button-text=" "
          v-model="currentDate"
          :max-date="maxDate"
          type="date"
          @change="changeDate"
        />
      </div>
    </van-popup>


  </section>
</template>

<script>
  import {generateTimeReqestNumber} from '@/utils/filter'
  export default {
    name: "index",
    data() {
      return {
        rangeList: [
          {name: '近一周', mtd1:'getDate',mtd2:'setDate',num:7,active:true},
          {name: '近一个月',mtd1:'getMonth',mtd2:'setMonth',num:1,active:false},
          {name: '近三个月',mtd1:'getMonth',mtd2:'setMonth',num:3,active:false},
        ],
        gradePop: false,
        classPop: false,
        showTime: false,
        currentDate: '',
        maxDate:new Date(),
        gradeSubjectList: [],
        gradeIndex: 0,
        classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
        // classList: {0:{gradeName:'全部',schoolYear:'',className:'',classId:'',active:true},...JSON.parse(localStorage.getItem("classMap"))},
        classList: JSON.parse(localStorage.getItem("classMap")),
        filterTime: {
          start: '',
          end: generateTimeReqestNumber(new Date()),
          type: true,   //true为开始
        }
      }
    },
    methods: {
      dateRange(methodName1,methodName2,num,index) {
        let time1 = new Date()
        time1[methodName2](time1[methodName1]()-num)
        this.filterTime.start = generateTimeReqestNumber(time1)
        this.filterTime.end = generateTimeReqestNumber(new Date())
        this.rangeList.forEach(v => {
          v.active = false
        })
        this.rangeList[index].active = true
        if(this.filterTime.type) {
          this.currentDate = new Date(this.filterTime.start)
        }else {
          this.currentDate = new Date(this.filterTime.end)
        }
      },
      changeDate(picker) {
        console.log(picker.getValues(),'=======');
        if(this.filterTime.type) {
          //开始时间
         this.filterTime.start = picker.getValues().join('-')
        }else {
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
          if(this.$route.path === '/taskStat') {
            this.$refs['routerView'].init()
          }else if (this.$route.path === '/studySituation') {
            this.$refs['routerView'].handleLoad()
          }else if (this.$route.path === '/reinforce') {
            this.$slots.reinforce[0].componentInstance.handleLoad()
          }
        this.showTime = false
      },
      formatter(type,value){
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
        this.gradePop = false
        this.classPop = false
        for (let key in arr) {
          this.$set(arr[key], 'active', false)
        }
      },
      openDatePicker() {
        this.showTime = true
      },
      openGradePop() {
        this.gradePop = true
          this.$set(this.gradeSubjectList[this.gradeIndex],'active',true)
      },
      openClassPop() {
        this.classPop = true
          this.$set(this.classList[this.classIndex],'active',true)
      },
      selectItem(item, index,arr) {
        if (item.active) return
        for (let key in arr) {
          this.$set(arr[key], 'active', false)
        }
        item.active = true
      },
      confirm(flag) {
        if(flag) {
          for(let key in this.classList) {
            if(this.classList[key].active) {
              this.classIndex = key * 1
              break
            }
          }
          this.classPop = false
        }else {
          const index = this.gradeSubjectList.findIndex(v => v.active)
          // this.filterText.grade = index > -1 ? this.gradeSubjectList[index].name : ''
          this.gradeIndex = index > -1 ? index : 0
          this.gradePop = false
        }
      }
    },
    created() {

      let arr = []
      let flag = true
      JSON.parse(localStorage.gradeList).forEach(v => {
        v.teacherInfoList.forEach(t => {
          if (t.subjectType !== 'S20') {
            arr.push({name: v.gradeName + t.subjectName, classGrade: v.classGrade, subjectType: t.subjectType, active: localStorage.currentSubjectType === t.subjectType && flag})
            if(localStorage.currentSubjectType === t.subjectType && flag) {
              flag = false
            }
          }
        })
      })
      this.gradeSubjectList.push(...arr)
      let time = new Date()
      time.setDate(time.getDate()-7)
      this.filterTime.start = generateTimeReqestNumber(time)
      this.currentDate = new Date(this.filterTime.start)

    },
  }
</script>

<style lang="less" scoped>
   @deep: ~'>>>';
  .teach-stat-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;


    &__body {
      flex: 1;
      overflow-y: auto;
    }

  }
   .grade-pop-wrap {
     display: flex;
     flex-direction: column;
     height: 100%;
     position: relative;
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
     }

     &__body {
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
   .teach-stat__time-picker-wrap {
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
   }

</style>
