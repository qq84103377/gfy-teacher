<template>
  <section class="teach-stat-wrap">
    <van-nav-bar
      v-if="$route.path === '/teachStat/'"
      title="教学统计">
    </van-nav-bar>
    <div>
      <van-cell title="筛选" style="background: #f5f5f5;color: #999"/>
      <van-cell v-if="!isMaster" @click="openGradePop" title="年级学科" is-link>
        <div class="blue">{{gradeSubjectList[gradeIndex].gradeName}}{{gradeSubjectList[gradeIndex].teacherInfoList[subjectIndex].subjectName}}</div>
      </van-cell>
      <van-cell v-else @click="openGradePop" title="年级学科" is-link>
        <div class="blue">{{masterGradeSubjectList[masterGradeIndex].gradeName}}{{masterGradeSubjectList[masterGradeIndex].teacherInfoList[masterSubjectIndex].subjectName}}</div>
      </van-cell>
      <van-cell v-if="!isMaster" @click="openClassPop" title="班级" is-link>
        <div class="blue">{{classList[classIndex].schoolYear + classList[classIndex].gradeName +
          classList[classIndex].className}}
        </div>
      </van-cell>
      <van-cell v-else @click="openClassPop" title="班级" is-link>
        <div class="blue">{{masterClassList[masterClassIndex].schoolYear + masterClassList[masterClassIndex].gradeName +
          masterClassList[masterClassIndex].className}}
        </div>
      </van-cell>
      <van-cell @click="openDatePicker" is-link>
        <div slot="title" class="aic jcsb">
          <div>时间</div>
          <div class="blue">{{filterTime.start}}--{{filterTime.end}}</div>
        </div>
      </van-cell>
    </div>

    <router-view ref="routerView" @changeFilter="changeFilter"></router-view>

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
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">年级学科</div>
        <div class="grade-pop-wrap__body" style="overflow: hidden;display: flex">



<!--          <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList"-->
<!--                    :key="index">-->
<!--            <div slot="title" class="aic jcsb"><span>{{item.name}}</span>-->
<!--              <van-icon v-if="item.active" class="blue" name="success"/>-->
<!--            </div>-->
<!--          </van-cell>-->


          <div class="grade-pop-wrap__body-left">
            <div @click="selectParent(item,index)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{active:item.active}">{{item.gradeName}}
            </div>
          </div>
          <div class="grade-pop-wrap__body-right">
            <div class="" v-for="(child,ci) in gradeSubjectList[gradeIndex].teacherInfoList" :key="ci">
              <div @click="selectChild(child)" class="van-hairline--bottom">
                <div :class="['cell__item',{active:child.check}]">{{child.subjectName}}
                  <van-icon v-show="child.check" class="check blue" name="success" />
                </div>
              </div>
            </div>
          </div>
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
        <van-icon @click="handleClose(classList,1)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">班级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,classList)" v-for="(value,key) in classList"
                    v-if="value.classGrade === gradeSubjectList[gradeIndex].classGrade && value.teacherInfoList.some(s => s.subjectType === gradeSubjectList[gradeIndex].teacherInfoList[subjectIndex].subjectType)"
                    :key="key">
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

    <!--   班主任 年级学科(需要展示全部学科)-->
    <van-popup
      get-container="#app"
      v-model="masterGradePop"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(masterGradeSubjectList)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">年级学科</div>
        <div class="grade-pop-wrap__body" style="overflow: hidden;display: flex">
          <div class="grade-pop-wrap__body-left">
            <div @click="selectParent(item,index)" v-for="(item,index) in masterGradeSubjectList" :key="index" :class="{active:item.active}">{{item.gradeName}}
            </div>
          </div>
          <div class="grade-pop-wrap__body-right">
            <div class="" v-for="(child,ci) in masterGradeSubjectList[masterGradeIndex].teacherInfoList" :key="ci">
              <div @click="selectChild(child)" class="van-hairline--bottom">
                <div :class="['cell__item',{active:child.check}]">{{child.subjectName}}
                  <van-icon v-show="child.check" class="check blue" name="success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!--   班主任 班级-->
    <van-popup
      get-container="#app"
      v-model="masterClassPop"
      round
      position="bottom"
      :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(masterClassList,1)" class="close" name="close"/>
        <div class="grade-pop-wrap__title van-hairline--bottom">班级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,masterClassList)" v-for="(value,key) in masterClassList"
                    v-if="value.classGrade === masterGradeSubjectList[masterGradeIndex].classGrade"
                    :key="key">
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
  </section>
</template>

<script>
  import {generateTimeReqestNumber} from '@/utils/filter'

  export default {
    name: "index",
    data() {
      return {
        isMaster: false, //是否切换到班主任的模块
        masterGradePop: false,
        masterGradeSubjectList: [], //班主任的年级学科筛选条件
        masterGradeIndex: 0,
        tempMasterGradeIndex: 0,
        masterSubjectIndex: 0,
        tempMasterSubjectIndex: 0,
        masterClassPop: false,
        masterClassList: {},
        masterClassIndex: 0,
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
        tempGradeIndex: 0,
        subjectIndex: 0,
        tempSubjectIndex: 0,
        classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
        // classList: {0:{gradeName:'全部',schoolYear:'',className:'',classId:'',active:true},...JSON.parse(localStorage.getItem("classMap"))},
        classList: JSON.parse(localStorage.getItem("classMap")),
        filterTime: {
          start: '',
          end: generateTimeReqestNumber(new Date()),
          type: true,   //true为开始
        },
      }
    },
     beforeRouteLeave(to, from, next) {
    if (this.showTime) {
      this.showTime=false
      next(false)
    } else if (this.masterGradePop) {
      this.masterGradePop=false
      next(false)
    } else if (this.masterClassPop) {
      this.masterClassPop = false
      next(false)
    } else if (this.gradePop) {
      this.gradePop = false
      next(false)
    } else if (this.classPop) {
      this.classPop = false
      next(false)
    } else {
      next()
    }
  },
    methods: {
      changeFilter(isMaster) {
        this.isMaster = isMaster
      },
      selectChild(child) {
        if(child.check) return
        if(this.isMaster) {
          this.masterGradeSubjectList[this.masterGradeIndex].teacherInfoList.forEach(v => {
            this.$set(v,'check',false)
          })
        }else {
          this.gradeSubjectList[this.gradeIndex].teacherInfoList.forEach(v => {
            this.$set(v,'check',false)
          })
        }

        this.$set(child,'check',true)
      },
      selectParent(item,index) {
        if(item.active) return
        if(this.isMaster) {
          this.masterGradeIndex = index
          this.masterGradeSubjectList.forEach(g => {
            this.$set(g,'active',false)
            g.teacherInfoList.forEach(s => {
              this.$set(s,'check',false)
            })
          })
          this.$set(item,'active',true)
          this.$set(item.teacherInfoList[0],'check',true)
          this.masterSubjectIndex = 0
        }else {
          this.gradeIndex = index
          this.gradeSubjectList.forEach(g => {
            this.$set(g,'active',false)
            g.teacherInfoList.forEach(s => {
              this.$set(s,'check',false)
            })
          })
          this.$set(item,'active',true)
          this.$set(item.teacherInfoList[0],'check',true)
          this.subjectIndex = 0
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
      confirmDate() {
        //判断结束时间时候小于结束时间
        let time1 = new Date(this.filterTime.start)
        let time2 = new Date(this.filterTime.end)
        if (time1.getTime() > time2.getTime()) {
          return this.$toast('开始时间不能大于结束时间')
        }
        this.$store.commit('setTeachStatFilterTime', {start: this.filterTime.start, end: this.filterTime.end})
        if (this.$route.path === '/taskStat') {
          this.$refs['routerView'].init()
        } else if (this.$route.path === '/studySituation') {
          this.$refs['routerView'].handleLoad()
        } else if (this.$route.path === '/reinforce') {
          this.$slots.reinforce[0].componentInstance.handleLoad()
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
      handleClose(arr,type) {
        if(type) {
          if(this.isMaster) {
            this.masterClassPop = false
          }else {
            this.classPop = false
          }
          for (let key in arr) {
            this.$set(arr[key], 'active', false)
          }
        }else {
          if(this.isMaster) {
            this.masterGradeIndex = this.tempMasterGradeIndex
            this.masterSubjectIndex = this.tempMasterSubjectIndex
            this.masterGradePop = false
          }else {
            this.gradeIndex = this.tempGradeIndex
            this.subjectIndex = this.tempSubjectIndex
            this.gradePop = false
          }
          for (let key in arr) {
            this.$set(arr[key], 'active', false)
            arr[key].teacherInfoList.forEach(v => {
              this.$set(v,'check',false)
            })
          }
        }
      },
      openDatePicker() {
        this.showTime = true
      },
      openGradePop() {
        if(this.isMaster) {
          this.masterGradePop = true
          this.tempMasterGradeIndex = this.masterGradeIndex
          this.tempMasterSubjectIndex = this.masterSubjectIndex
          this.$set(this.masterGradeSubjectList[this.masterGradeIndex], 'active', true)
          this.$set(this.masterGradeSubjectList[this.masterGradeIndex].teacherInfoList[this.masterSubjectIndex], 'check', true)
        }else {
          this.gradePop = true
          this.tempGradeIndex = this.gradeIndex
          this.tempSubjectIndex = this.subjectIndex
          this.$set(this.gradeSubjectList[this.gradeIndex], 'active', true)
          this.$set(this.gradeSubjectList[this.gradeIndex].teacherInfoList[this.subjectIndex], 'check', true)
        }
      },
      openClassPop() {
        if(this.isMaster) {
          this.masterClassPop = true
          this.$set(this.masterClassList[this.masterClassIndex], 'active', true)
        }else {
          this.classPop = true
          this.$set(this.classList[this.classIndex], 'active', true)
        }
      },
      selectItem(item, index, arr) {
        if (item.active) return
        for (let key in arr) {
          this.$set(arr[key], 'active', false)
        }
        this.$set(item,'active',true)
        // item.active = true
      },
      confirm(flag) {
        if (flag) {
          if(this.isMaster) {
            for (let key in this.masterClassList) {
              if (this.masterClassList[key].active) {
                this.masterClassIndex = key * 1
                break
              }
            }
            this.masterClassPop = false
          }else {
            for (let key in this.classList) {
              if (this.classList[key].active) {
                this.classIndex = key * 1
                break
              }
            }
            this.classPop = false
          }
        } else {
          if(this.isMaster) {
            const index = this.masterGradeSubjectList.findIndex(v => v.active)
            // this.filterText.grade = index > -1 ? this.gradeSubjectList[index].name : ''
            this.masterGradeIndex = index > -1 ? index : 0
            this.masterSubjectIndex = this.masterGradeSubjectList[this.masterGradeIndex].teacherInfoList.findIndex(v => v.check)
            this.masterGradePop = false
            //班级需要联动
            let flag = false
            for (let key in this.masterClassList) {
              if(this.masterClassList[key].classGrade === this.masterGradeSubjectList[this.masterGradeIndex].classGrade) {
                this.$set(this.masterClassList[key],'active',!flag)
                if(!flag) this.masterClassIndex = key
                flag = true
              }
            }
            this.tempMasterGradeIndex = this.masterGradeIndex
            this.tempMasterSubjectIndex = this.masterSubjectIndex
          }else {
            const index = this.gradeSubjectList.findIndex(v => v.active)
            // this.filterText.grade = index > -1 ? this.gradeSubjectList[index].name : ''
            this.gradeIndex = index > -1 ? index : 0
            this.subjectIndex = this.gradeSubjectList[this.gradeIndex].teacherInfoList.findIndex(v => v.check)
            this.gradePop = false
            //班级需要联动
            let flag = false
            for (let key in this.classList) {
              if(this.classList[key].classGrade === this.gradeSubjectList[this.gradeIndex].classGrade && this.classList[key].teacherInfoList.some(s => s.subjectType === this.gradeSubjectList[this.gradeIndex].teacherInfoList[this.subjectIndex].subjectType)) {
                this.$set(this.classList[key],'active',!flag)
                if(!flag) this.classIndex = key
                flag = true
              }
            }
            this.tempGradeIndex = this.gradeIndex
            this.tempSubjectIndex = this.subjectIndex
          }
        }
      },
      handleGradeSubject(classGrade) {
        let arr = []
        if(['G01','G02','G03','G04','G05','G06'].includes(classGrade)) {
          arr = [
            {subjectType: '',subjectName: '全部', check: true},
            {subjectType: 'S01',subjectName: '语文', check: false},
            {subjectType: 'S02',subjectName: '数学', check: false},
            {subjectType: 'S03',subjectName: '英语', check: false},
          ]
        }else if (['G07'].includes(classGrade)) {
          arr = [
            {subjectType: '',subjectName: '全部', check: true},
            {subjectType: 'S01',subjectName: '语文', check: false},
            {subjectType: 'S02',subjectName: '数学', check: false},
            {subjectType: 'S03',subjectName: '英语', check: false},
            {subjectType: 'S06',subjectName: '政治', check: false},
            {subjectType: 'S07',subjectName: '历史', check: false},
            {subjectType: 'S08',subjectName: '生物', check: false},
            {subjectType: 'S09',subjectName: '地理', check: false},
          ]
        } else if (['G08'].includes(classGrade)) {
          arr = [
            {subjectType: '',subjectName: '全部', check: true},
            {subjectType: 'S01',subjectName: '语文', check: false},
            {subjectType: 'S02',subjectName: '数学', check: false},
            {subjectType: 'S03',subjectName: '英语', check: false},
            {subjectType: 'S04',subjectName: '物理', check: false},
            {subjectType: 'S06',subjectName: '政治', check: false},
            {subjectType: 'S07',subjectName: '历史', check: false},
            {subjectType: 'S08',subjectName: '生物', check: false},
            {subjectType: 'S09',subjectName: '地理', check: false},
          ]
        } else if (['G09'].includes(classGrade)) {
          arr = [
            {subjectType: '',subjectName: '全部', check: true},
            {subjectType: 'S01',subjectName: '语文', check: false},
            {subjectType: 'S02',subjectName: '数学', check: false},
            {subjectType: 'S03',subjectName: '英语', check: false},
            {subjectType: 'S04',subjectName: '物理', check: false},
            {subjectType: 'S05',subjectName: '化学', check: false},
            {subjectType: 'S06',subjectName: '政治', check: false},
            {subjectType: 'S07',subjectName: '历史', check: false},
          ]
        } else if (['G10','G11','G12'].includes(classGrade)) {
          arr = [
            {subjectType: '',subjectName: '全部', check: true},
            {subjectType: 'S01',subjectName: '语文', check: false},
            {subjectType: 'S02',subjectName: '数学', check: false},
            {subjectType: 'S03',subjectName: '英语', check: false},
            {subjectType: 'S04',subjectName: '物理', check: false},
            {subjectType: 'S05',subjectName: '化学', check: false},
            {subjectType: 'S06',subjectName: '政治', check: false},
            {subjectType: 'S07',subjectName: '历史', check: false},
            {subjectType: 'S08',subjectName: '生物', check: false},
            {subjectType: 'S09',subjectName: '地理', check: false},
          ]
        }
        return arr
      }
    },
    created() {
      let arr = []
      let flag = true
      JSON.parse(localStorage.gradeList).forEach(v => {
        //如果该年级只有一科家庭教育,则不显示该年级
        if(v.teacherInfoList.length === 1 && v.teacherInfoList.some(s => s.subjectType === 'S20')) return
        v.active = flag && v.teacherInfoList.some(s => s.subjectType === localStorage.currentSubjectType)
        if(v.active) {
          v.teacherInfoList = v.teacherInfoList.filter((t,i) => {
              t.check = t.subjectType === localStorage.currentSubjectType
            if(t.check) {
              this.subjectIndex = i
            }
            return t.subjectType !== 'S20'
          })
        }
        arr.push(v)

        if(flag && v.teacherInfoList.some(s => s.subjectType === localStorage.currentSubjectType)){
          flag = false
        }

      })
      this.gradeSubjectList = arr

      //先找出哪个年级有班主任
      this.gradeSubjectList.forEach(g => {
        if(g.teacherInfoList.some(s => s.teacherType === 'T01')) {
          this.masterGradeSubjectList.push({active: !this.masterGradeSubjectList.length, classGrade:g.classGrade,gradeName:g.gradeName,teacherInfoList:this.handleGradeSubject(g.classGrade)})
        }
      })

      //再找出哪个班级有班主任
      for(let key in JSON.parse(localStorage.getItem("classMap"))) {
        if(JSON.parse(localStorage.getItem("classMap"))[key].teacherInfoList.some(s => s.subjectType !== 'S20' && s.teacherType === 'T01')) {
          this.$set(this.masterClassList,key,JSON.parse(localStorage.getItem("classMap"))[key])
          // this.masterClassList[key] = JSON.parse(localStorage.getItem("classMap"))[key]
          if(Object.keys(this.masterClassList).length === 1) {
            this.masterClassIndex = key
          }
        }
      }

      if (this.$store.getters.getTeachStatFilterTime) {
        //有设置过时间
        this.filterTime.start = this.$store.getters.getTeachStatFilterTime.start
        this.filterTime.end = this.$store.getters.getTeachStatFilterTime.end
        this.currentDate = new Date(this.filterTime.start)
      } else {
        let time = new Date()
        time.setMonth(time.getMonth() - 1)
        this.filterTime.start = generateTimeReqestNumber(time)
        this.currentDate = new Date(this.filterTime.start)
        this.$store.commit('setTeachStatFilterTime', {start: this.filterTime.start, end: this.filterTime.end})
      }

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
