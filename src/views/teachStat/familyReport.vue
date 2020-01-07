<template>
  <section class="family-report-wrap">
    <div>
      <van-cell title="查看范围" style="background: #f5f5f5;color: #999"/>
      <van-cell @click="openGradePop" title="年级" is-link>
        <div class="blue">{{gradeSubjectList[gradeIndex].gradeName}}</div>
      </van-cell>
      <van-cell @click="openClassPop" title="班级" is-link>
        <div class="blue">{{classList[classIndex].className}}</div>
      </van-cell>
      <van-cell @click="openDatePicker" is-link>
        <div slot="title" class="aic jcsb">
          <div>时间</div>
          <div class="blue">{{filterTime.start}}--{{filterTime.end}}</div>
        </div>
      </van-cell>
    </div>
    <div>
      <van-cell title="学生列表" style="background: #f5f5f5;color: #999"/>
      <van-cell v-for="(item,index) in classList[classIndex].studentInfo" :key="index"
                @click="viewDetail(item,index)"
                :title="item.accountNo|getStudentName(item.classId)" is-link/>
    </div>

    <!--    年级-->
    <van-popup
      v-model="gradePop"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">年级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList"
                    :key="index">
            <div slot="title" class="aic jcsb"><span>{{item.gradeName}}</span>
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
      v-model="classPop"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(classList)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">班级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,classList)"
                    v-if="gradeSubjectList[gradeIndex].classGrade === value.classGrade" v-for="(value,key) in classList"
                    :key="key">
            <div slot="title" class="aic jcsb"><span>{{value.className}}</span>
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
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '50%' }">
      <div>
        <div class="time-piker-header">
          <div>
            <span v-for="(item,index) in rangeList" :key="index" :class="['mgr15',{blue:item.active}]"
                  @click="dateRange(item.mtd1,item.mtd2,item.num,index)">{{item.name}}</span>
          </div>
          <div class="blue" @click="confirmDate">确认</div>
        </div>
        <div class="date-box">
          <div @click="filterTime.type = true;currentDate = new Date(filterTime.start)" class="date-select"
               :class="{active:filterTime.type}">{{filterTime.start}}
          </div>
          <div class="mgr10 mglt10">~</div>
          <div @click="filterTime.type = false;currentDate = new Date(filterTime.end)" class="date-select"
               :class="{active:!filterTime.type}">{{filterTime.end}}
          </div>
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
    name: "familyReport",
    data() {
      return {
        rangeList: [
          {name: '近一周', mtd1: 'getDate', mtd2: 'setDate', num: 7, active: false},
          {name: '近一个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 1, active: true},
          {name: '近三个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 3, active: false},
        ],
        gradePop: false,
        classPop: false,
        showTime: false,
        currentDate: '',
        maxDate: new Date(),
        gradeSubjectList: [],
        gradeIndex: 0,
        classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
        classList: JSON.parse(localStorage.getItem("classMap")),
        filterTime: {
          start: '',
          end: generateTimeReqestNumber(new Date()),
          type: true,   //true为开始
        }
      }
    },
    methods: {
      viewDetail(item, index) {
        this.$router.push({
          name: `reportDetail`,
          params: {
            stuIndex: index,
            stuList: this.classList[this.classIndex].studentInfo,
            filterParams: {
              classGrade: this.gradeSubjectList[this.gradeIndex].classGrade,
              classId: this.classList[this.classIndex].classId,
              startDate: this.filterTime.start,
              endDate: this.filterTime.end,
            }
          }
        })
      },
      selectItem(item, index, arr) {
        if (item.active) return
        for (let key in arr) {
          this.$set(arr[key], 'active', false)
        }
        item.active = true
      },
      handleClose(arr) {
        this.gradePop = false
        this.classPop = false
        for (let key in arr) {
          this.$set(arr[key], 'active', false)
        }
      },
      confirm(flag) {
        if (flag) {
          for (let key in this.classList) {
            if (this.classList[key].active) {
              this.classIndex = key * 1
              break
            }
          }
          this.classPop = false
        } else {
          const index = this.gradeSubjectList.findIndex(v => v.active)
          this.gradeIndex = index > -1 ? index : 0
          this.gradePop = false
          // 切换年级时班级列表自动变化并默认选中第一个
          let flag = true
          for (let key in this.classList) {
            this.$set(this.classList[key], 'active', false)
            if (this.gradeSubjectList[this.gradeIndex].classGrade === this.classList[key].classGrade && flag) {
              flag = false
              this.classIndex = key
              this.$set(this.classList[key], 'active', true)
            }
          }
        }
      },
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
      openDatePicker() {
        this.showTime = true
      },
      openGradePop() {
        this.gradePop = true
        this.$set(this.gradeSubjectList[this.gradeIndex], 'active', true)
      },
      openClassPop() {
        this.classPop = true
        this.$set(this.classList[this.classIndex], 'active', true)
      },
      confirmDate() {
        //判断结束时间时候小于结束时间
        let time1 = new Date(this.filterTime.start)
        let time2 = new Date(this.filterTime.end)
        if (time1.getTime() > time2.getTime()) {
          return this.$toast('开始时间不能大于结束时间')
        }
        if (time2.getTime() - time1.getTime() > 15552000000) {
          return this.$toast('时间范围不能超过6个月')
        }
        this.$store.commit('setTeachStatFilterTime', {start: this.filterTime.start, end: this.filterTime.end})
        // if(this.$route.path === '/taskStat') {
        // this.$refs['routerView'].init()
        // }
        this.showTime = false
      },
    },
    created() {
      this.gradeSubjectList = JSON.parse(localStorage.gradeList).filter(v => !(v.teacherInfoList.some(t => t.subjectType === 'S20') && v.teacherInfoList.length === 1))

      this.filterTime.start = this.$store.getters.getTeachStatFilterTime.start
      this.filterTime.end = this.$store.getters.getTeachStatFilterTime.end
      this.currentDate = new Date(this.filterTime.start)

      // let time = new Date()
      // time.setMonth(time.getMonth()-1)
      // this.filterTime.start = generateTimeReqestNumber(time)
      // this.currentDate = new Date(this.filterTime.start)
      // console.log(this.classList, '=3=3=3=');
    },
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .family-report-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

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
