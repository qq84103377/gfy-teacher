<template>
  <section class="integral-stat-wrap">
    <van-nav-bar :title="title" @click-left="goBack" :left-arrow='!isShare'>
      <img v-if="!isShare&&title!=='积分统计'" src="../../assets/img/icon-fenxiang.png" alt="" slot="right" @click="shareBarShow=true">
    </van-nav-bar>
    <div class="integral-stat-wrap-body" ref='body' @scroll="scroll">
      <div v-if='!isShare'>
        <van-cell title="查看范围" style="background: #f5f5f5;color: #999" />
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

      <div v-else>
        <van-cell title="查看范围" style="background: #f5f5f5;color: #999" />
        <van-cell title="年级">
          <div class="blue">{{$route.query.gradeName}}</div>
        </van-cell>
        <van-cell title="班级">
          <div class="blue">{{$route.query.className}}</div>
        </van-cell>
        <van-cell>
          <div slot="title" class="aic jcsb">
            <div>时间</div>
            <div class="blue">{{$route.query.startDate}}--{{$route.query.endDate}}</div>
          </div>
        </van-cell>
      </div>

      <router-view ref="routerView"></router-view>
      <div class="toTop" v-show="showTop" @click="toTop()">
        <van-icon name="arrow-up" color="#39F0DD" />
        <p>至顶部</p>
      </div>
    </div>

    <!--    年级-->
    <van-popup v-if='!isShare' v-model="gradePop" :close-on-click-overlay="false" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(gradeSubjectList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">年级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(item,index,gradeSubjectList)" v-for="(item,index) in gradeSubjectList" :key="index">
            <div slot="title" class="aic jcsb"><span>{{item.gradeName}}</span>
              <van-icon v-if="item.active" class="blue" name="success" />
            </div>
          </van-cell>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm()">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!--    班级-->
    <van-popup v-if='!isShare' v-model="classPop" round position="bottom" :style="{ height: '90%' }">
      <div class="grade-pop-wrap">
        <van-icon @click="handleClose(classList)" class="close" name="close" />
        <div class="grade-pop-wrap__title van-hairline--bottom">班级</div>
        <div class="grade-pop-wrap__body">
          <van-cell @click="selectItem(value,key,classList)" v-if="gradeSubjectList[gradeIndex].classGrade === value.classGrade" v-for="(value,key) in classList" :key="key">
            <div slot="title" class="aic jcsb"><span>{{value.className}}</span>
              <van-icon v-if="value.active" class="blue" name="success" />
            </div>
          </van-cell>
        </div>
        <div class="grade-pop-wrap__footer">
          <van-button class="btn" type="info" @click="confirm(1)">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!--时间-->
    <van-popup v-if='!isShare' v-model="showTime" position="bottom" :close-on-click-overlay="false" :style="{ height: '50%' }">
      <div>
        <div class="time-piker-header">
          <div>
            <span v-for="(item,index) in rangeList" :key="index" :class="['mgr15',{blue:item.active}]" @click="dateRange(item.mtd1,item.mtd2,item.num,index)">{{item.name}}</span>
          </div>
          <div class="blue" @click="confirmDate">确认</div>
        </div>
        <div class="date-box">
          <div @click="filterTime.type = true;currentDate = new Date(filterTime.start)" class="date-select" :class="{active:filterTime.type}">{{filterTime.start}}
          </div>
          <div class="mgr10 mglt10">~</div>
          <div @click="filterTime.type = false;currentDate = new Date(filterTime.end)" class="date-select" :class="{active:!filterTime.type}">{{filterTime.end}}
          </div>
        </div>
        <van-datetime-picker ref="datePicker" confirm-button-text=" " cancel-button-text=" " v-model="currentDate" :max-date="maxDate" type="date" @change="changeDate" />
      </div>
    </van-popup>

    <share-bar :show.sync="shareBarShow" :title="filterTime.start+'--'+filterTime.end+title+'统计'" :link="link" :desc="'这是'+filterTime.start+'--'+filterTime.end+title+'统计详情，请家长及时查看'"></share-bar>
  </section>
</template>

<script>
import { generateTimeReqestNumber } from '@/utils/filter'
import { getMySchoolInfo } from '@/api/index'
import shareBar from '../../components/shareBar'

export default {
  name: "integralStat",
  components: { shareBar },
  data() {
    return {
      title: '积分统计',
      rangeList: [
        { name: '近一周', mtd1: 'getDate', mtd2: 'setDate', num: 7, active: false },
        { name: '近一个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 1, active: true },
        { name: '近三个月', mtd1: 'getMonth', mtd2: 'setMonth', num: 3, active: false },
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
      },
      showTop: false,
      isMaster: false,
      isAnotherPost: false,
      postList: JSON.parse(localStorage.getItem("postList")),
      isShare: this.$route.query.isShare,
      shareBarShow: false,
      openfEduction: false
    }
  },
  computed: {
    decodeURI() {
      return decodeURI
    },
    link() {
      if (this.$route.query.isShare) {
        return
      }
      return `${process.env.VUE_APP_HOST}/#/integralDetail?isShare=true${this.$route.query.isParent ? '&isParent=true' : ''}&gradeName=${this.gradeSubjectList[this.gradeIndex].gradeName}&className=${this.classList[this.classIndex].className}&classGrade=${this.gradeSubjectList[this.gradeIndex].classGrade}&classId=${this.classList[this.classIndex].classId}&startDate=${this.filterTime.start}&endDate=${this.filterTime.end}&operateAccountNo=${this.$store.getters.getUserInfo.accountNo}&belongSchoolId=${this.$store.getters.schoolId}`
    },
    isApp() {
      return 'cordova' in window
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.gradePop) {
      this.gradePop = false
      next(false)
    } else if (this.classPop) {
      this.classPop = false
      next(false)
    } else if (this.showTime) {
      this.showTime = false
      next(false)
    } else if (this.shareBarShow) {
      this.shareBarShow = false
      next(false)
    } else {
      next()
    }
  },
  activated() {
    if (this.$route.path == '/integralDetail') {
      if (this.$route.query.isParent) {
        this.title = '家长积分'
      } else {
        this.title = '学生积分'
      }
    } else {
      this.title = '积分统计'
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
      this.$store.commit('setTeachStatFilterTime', { start: this.filterTime.start, end: this.filterTime.end })
    }
    this.rangeList.forEach((v, i) => {
      v.active = this.$store.getters.getTimeRangeActive === i
    })
    if (this.$store.getters.getInterlGradeList) {
      this.gradeSubjectList = JSON.parse(this.$store.getters.getInterlGradeList)
      const index = this.gradeSubjectList.findIndex(v => v.active)
      this.gradeIndex = index > -1 ? index : 0
    }

    if (this.$store.getters.getInterlClassIndex) {
      this.classIndex = this.$store.getters.getInterlClassIndex
    }

  },
  methods: {
    goBack() {
      this.common.goBack(this)
    },
    async getPost() {
      if (!this.postList) {
        await this.getMySchoolInfo()
      }
      this.postList = JSON.parse(localStorage.getItem("postList"))
      if (this.postList) {
        let list1 = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P12']
        this.isAnotherPost = false
        list1.forEach(element => {
          if (this.postList.includes(element)) {
            this.isAnotherPost = true
          }
        })
      }
    },
    async getMySchoolInfo() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "userType": "A02"
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }

      await getMySchoolInfo(params).then(res => {
        if (res.flag) {
          //重构数据
          this.isAnotherPost2 = true
          if (!res.data) {
            this.$toast("该老师未配置学校信息")
            return
          }

          //获取班级分组信息
          let schoolList = res.data[0].schoolList;
          let postList = []
          let length = schoolList.length;

          // 获取老师科目列表，去重后
          for (let i = 0; i < length; i++) {
            // 职务
            postList = Array.from(new Set([...postList, schoolList[i].postType]));
          }
          localStorage.setItem('postList', JSON.stringify(postList))

        }
      })
    },
    init() {
      //先判断选中的班级是否班主任
      this.isMaster = this.classList[this.classIndex].teacherInfoList.some(v => v.teacherType === 'T01' && v.subjectType !== 'S20')
    },
    scroll(e) {
      this.scrollTop = e.target.scrollTop;
      // 滚动超过200时显示到顶部按钮
      if (e.target.scrollTop >= 200) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
    },
    toTop() {
      let timer = setInterval(() => {
        let speed = Math.floor(-this.scrollTop / 5);
        let top = this.scrollTop + speed;
        this.$refs['body'].scrollTop = top;
        if (this.scrollTop === 0) {
          clearInterval(timer);
        }
        setTimeout(() => {
          console.log('清除定时器')
          clearInterval(timer);
        }, 2000)
      }, 24);
    },
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
            this.$store.commit('setInterlClassIndex', this.classIndex)
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
            this.$store.commit('setInterlClassIndex', this.classIndex)
          }
        }
        this.$store.commit('setInterlGradeList', JSON.stringify(this.gradeSubjectList))
      }
      this.init()
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
      this.$store.commit('setTimeRangeActive', index)
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
      // if (time2.getTime() - time1.getTime() > 15552000000) {
      //   return this.$toast('时间范围不能超过6个月')
      // }
      this.$store.commit('setTeachStatFilterTime', { start: this.filterTime.start, end: this.filterTime.end })
      if (this.$route.path === '/integralDetail') {
        this.$refs['routerView'].statClassCounterByOrigin()
      }
      this.showTime = false
    },
  },
  created() {
    if (this.isShare) {
      this.filterTime.start = this.$route.query.startDate
      this.filterTime.end = this.$route.query.endDate
      return
    }

    this.getPost()

    if (this.$store.getters.getInterlGradeList) {
      this.gradeSubjectList = JSON.parse(this.$store.getters.getInterlGradeList)
      const index = this.gradeSubjectList.findIndex(v => v.active)
      this.gradeIndex = index > -1 ? index : 0
    } else {
      this.gradeSubjectList = JSON.parse(localStorage.gradeList).filter(v => !(v.teacherInfoList.some(t => t.subjectType === 'S20') && v.teacherInfoList.length === 1))
    }

    if (this.$store.getters.getInterlClassIndex) {
      this.classIndex = this.$store.getters.getInterlClassIndex
    }

    this.filterTime.start = this.$store.getters.getTeachStatFilterTime.start
    this.filterTime.end = this.$store.getters.getTeachStatFilterTime.end
    this.currentDate = new Date(this.filterTime.start)


    let res
    for (const key in this.classList) {
      res = this.classList[key].teacherInfoList.findIndex(i => i.subjectType == 'S20')
      if (res > -1) {
        break
      }
    }

    if (res > -1) {
      this.openfEduction = true
    }

    this.init()

  },

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.integral-stat-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  @{deep} .van-nav-bar__right {
    height: 100%;
    line-height: 52px;

    img {
      width: 20px;
    }
  }

  &-body {
    flex: 1;
    overflow-y: auto;
  }

  .toTop {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #e0fffc;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    right: 10px;
    bottom: 60px;
    box-shadow: 0px 2px 5px 0px rgba(166, 215, 210, 1);

    p {
      font-size: 10px;
      color: #39f0dd;
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
