<template>
  <section class="add-course-wrap">
    <van-overlay :show="showMask" @click="showMask = false" z-index="99" class-name="mask" style="background: transparent;" />
    <div class="add-course-wrap__body">
      <div class="name">
        <van-field label-class="gfy-label" label-width="12vw" required clearable label="名称:">
          <div slot="input" class="input-wrap">
            <input maxlength="64" v-model="form.name" @input="getSysCourseList" @focus="showMask = true" style="width: 100%" placeholder="请输入名称,字数在64字内" />
            <span class="num-tip">{{64 - form.name.length}}</span>
            <van-icon @click="form.name = ''" class="close" name="clear" />
          </div>
          <div v-if="!isEdit" slot="right-icon" class="fs14 blue" @click="openSysCourse">
            筛选
          </div>
        </van-field>
        <div class="search-wrap" v-show="showMask" style="z-index: 100">
          <van-cell v-for="(item, index) in sysCourseList" :key="index" @click="selectCourse(index)">
            <div slot="title" class="aic jcsb search-wrap__item">
              <div class="search-wrap__item-title">
                {{item.nodeName}}
              </div>
              <div class="jcsb aic fs10">
                <span class="tag mgr10">{{item.textBookName}}</span>
                <span class="tag">{{item.classGradeName}}</span>
              </div>
            </div>
          </van-cell>
        </div>
        <!--        <van-overlay-->
        <!--          :show="showMask"-->
        <!--          @click="showMask = false"-->
        <!--        />-->
      </div>
      <van-cell v-if="!isEdit" class="class-group">
        <div slot="title">
          <div class="gfy-label class-label jcsb aic">
            <div><span style="color: red">*</span>课程: <span style="paddingLeft:8px;color:#323233;" v-if='shareCourseList.length'>{{shareCourseList[form.course].courseName}}</span></div>
            <div class="blue" @click="getShareCourseDetailV2">其他共享课程</div>
          </div>
          <van-radio-group class="gfy-radio-group" v-model="form.course" @change="changShareCourse" v-show='!isSelect'>
            <van-radio :name="index" class="mgr10 mgb10" v-for="(item ,index) in shareCourseList" :key="index" @click='isSelect=true'><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              {{item.courseName}} <span class="grey9 fs10">(创建人:{{item.belongAccountName}},使用次数:{{item.useAccount}})</span></van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell class="class-group">
        <div slot="title">
          <div class="gfy-label class-label"><span style="color: red">*</span>选择班级:</div>
          <van-checkbox-group class="gfy-checkbox-group" v-model="result">
            <van-checkbox class="gfy-checkbox-group-item" v-for="(item, index) in classMap" :key="index" :name="item.classId">
              <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
              {{item.className}}
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label">
          <div style="display: flex;" class="mgb20">
            <span style="color: red">*</span><span class="mgr15">时间设置:</span>
            <van-radio-group style="display: flex;" v-model="form.radio">
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                统一设置
              </van-radio>
              <van-radio name="1"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i> 分班设置
              </van-radio>
            </van-radio-group>
          </div>
          <div class="time-group" v-if="form.radio ==2">
            <div style="display: flex;align-items: center;flex: 1">
              <div class="time-view" @click="selectTime('begin')">{{form.time1}}</div>
              <span class="divider">~</span>
              <div class="time-view" @click="selectTime('end')">{{form.time2}}</div>
            </div>
          </div>
          <div class="time-group" v-for="(item,index) in classMap" :key="index" v-if="form.radio ==1" v-show="result.indexOf(item.classId)>-1">
            <span class=" fs14 mgr10 class-name" :style="{width:item.className.length>6?'100%':'auto'}">{{item.className}}</span>
            <div style="display: flex;align-items: center;flex: 1">
              <div class="time-view" @click="selectTime('begin',item.classId)">{{item.beginDate}}</div>
              <span class="divider">~</span>
              <div class="time-view" @click="selectTime('end',item.classId)">{{item.endDate}}</div>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label aic">
          <span class="mgr10">共享:</span>
          <van-radio-group style="display: flex;" v-model="form.share">
            <van-radio :disabled="!isEdit" name="S01" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked&&isEdit},{'icon-radio-disable':!isEdit}]"></i>
              个人
            </van-radio>
            <van-radio v-if="isEdit" name="S02" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              校内
            </van-radio>
            <van-radio v-if="isEdit" name="S03"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              共享
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label">
          <div class="jcsb aic">
            <span>描述:</span>
            <span style="color: red">{{200 - form.desc.length}}</span>
          </div>
          <textarea placeholder="请输入描述，字数在200字内" maxlength="200" v-model="form.desc" class="gfy-textarea" rows="3"></textarea>
        </div>
      </van-cell>
      <van-popup v-model="showTime" position="bottom" :style="{ height: '35%' }">
        <van-datetime-picker v-model="currentDate" :min-date="minDate" type="date" @confirm="handleSelectTime" @cancel="showTime=false" :formatter="formatter" />
      </van-popup>
    </div>

    <div class="add-course-wrap__footer" v-if="isEdit">
      <van-button v-if='!isFromCourse' class="edit-btn" type="info" @click="$emit('onFinish',form.name,true)">取消</van-button>
      <van-button class="edit-btn" type="info" :loading="loadingEdit" @click="submitEdit" loading-text="修改中...">提交</van-button>
    </div>
    <div class="add-course-wrap__footer" v-else>
      <van-button class="submit-btn" type="info" @click="createCourse" :loading="loadingSubmit">提交</van-button>
    </div>
    <!--<div class="mask"  v-show="showMask"></div>-->

    <course-filter ref="courseFilter" v-if="!isEdit" @init="initData" :visible.sync="filterShow" :sysCourseId.sync="sysCourseId" :isfEducation='isfEducation'></course-filter>

    <van-dialog @confirm="handleEditClass" v-model="showAlert" show-cancel-button>
      <div slot="title" class="fs14 grey6 pd10">{{message}}</div>
    </van-dialog>
  </section>
</template>

<script>
  import { generateTimeReqestNumber } from '@/utils/filter'
  import courseFilter from '../../components/courseFilter'
  import { getTextBookCourseByParam, getShareCourseDetailV2, createTeachCourse, getClassTeacherCourseDeploy, modifyTeachCourse } from '@/api/index'
  import eventBus from "../../utils/eventBus";

  export default {
    name: "addCourse",
    props: ['isEdit', 'editCourseInfo', 'isFromCourse'],
    data() {
      return {
        loadingEdit: false,
        loadingSubmit: false,
        filterShow: false,
        showTime: false,
        showMask: false,
        form: {
          share: 'S01',
          desc: '',
          name: '',
          course: '',
          radio: '2',
          time1: '',
          time2: '',
        },
        sysCourseId: '',
        sysCourseList: [],
        shareCourseList: [],
        currentShareCourse: {},
        list: ['a', 'b', 'c'],
        result: [],
        currentDate: new Date(),
        minDate: new Date(),
        className: '电话的的的123',
        classMap: {},
        beginDate: [],
        endDate: [],
        timeType: {},
        currentClassId: '',
        selectCourseName: '',
        isSelect: true,
        term: '',
        shareFlag: false,
        showAlert: false,
        message: '',
        isfEducation: this.$route.query.isfEducation,
      }
    },
    computed: {
      // showMask: {
      //   get() {
      //     return this.form.name ? true : false
      //   },
      //   set(v) {
      //     if (!v) {
      //       this.form.name = ''
      //     }
      //   }
      // }
    },
    watch: {
      editCourseInfo: {
        deep: true,
        handler(newV, oldV) {
          console.log(newV, "------change");
          this.courseChange()

        },
      },
      'form.name'(v) {
        if (!v.length) {
          this.shareCourseList = []
          this.form.course = 0;
          if(!this.isEdit) this.result = []
          this.shareFlag = false
          this.showMask = false
          this.isSelect = true
          this.currentShareCourse.courseId = ''
          this.sysCourseList = []
        }
      }
    },
    components: { courseFilter },

    beforeRouteLeave(to, from, next) {
      if (this.$refs['courseFilter'] && this.$refs['courseFilter'].showChangeDialog) {
        this.$refs['courseFilter'].close()
        next(false)
      } else if (this.filterShow) {
        this.filterShow = false
        next(false)
      } else if (this.showTime) {
        this.showTime = false
        next(false)
      } else {
        next();
      }

    },
    mounted() {
      if (this.isfEducation) {
        //班级信息
        let cl = localStorage.getItem("classMap")
        if (cl) {
          for (let k in JSON.parse(cl)) {
            if (JSON.parse(cl)[k].teacherInfoList.some(v => v.subjectType === 'S20')) {
              this.classMap[k] = JSON.parse(cl)[k]
            }
          }
        }
      } else {
        //班级信息
        let cl = localStorage.getItem("classMap")
        if (cl) {
          for (let k in JSON.parse(cl)) {
            if (JSON.parse(cl)[k].teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType)) {
              this.classMap[k] = JSON.parse(cl)[k]
            }
          }
        }
      }

      if (this.isEdit) {
        console.log("编辑课程信息", this.editCourseInfo);
        this.form.name = this.editCourseInfo.courseName
        this.form.desc = this.editCourseInfo.desc
        this.form.share = this.editCourseInfo.shareType

        let tchClassCourseInfo = this.editCourseInfo.tchClassCourseInfo
        let classStart = {}
        let classEnd = {}

        //判断是分班设置还是统一设置
        let flag = false
        let start = tchClassCourseInfo[0].startDate
        let end = tchClassCourseInfo[0].endDate
        tchClassCourseInfo.forEach(item => {
          classStart[item.classId] = item.startDate
          classEnd[item.classId] = item.endDate
          this.result.push(item.classId)
          if (start != item.startDate || end != item.endDate) {
            flag = true
          }

        });
        if (flag) {
          this.form.radio = "1"
          //分班
          for (let m in this.classMap) {
            if (classStart[this.classMap[m].classId]) {
              this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date(classStart[this.classMap[m].classId]))
            } else {
              this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date())
            }
            if (classEnd[this.classMap[m].classId]) {
              this.classMap[m]['endDate'] = generateTimeReqestNumber(new Date(classEnd[this.classMap[m].classId]))
            } else {
              let now = new Date()
              now.setDate(now.getDate() + 3)
              this.classMap[m]['endDate'] = generateTimeReqestNumber(now)
            }
          }

          let date = new Date()
          this.form.time1 = generateTimeReqestNumber(date);
          date.setDate(date.getDate() + 3)
          this.form.time2 = generateTimeReqestNumber(date)
        } else {
          //统一
          this.form.radio = "2"
          for (let m in this.classMap) {
            this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date())
            let now = new Date()
            now.setDate(now.getDate() + 3)
            this.classMap[m]['endDate'] = generateTimeReqestNumber(now)
          }
          this.form.time1 = generateTimeReqestNumber(new Date(tchClassCourseInfo[0].startDate))
          this.form.time2 = generateTimeReqestNumber(new Date(tchClassCourseInfo[0].endDate))
        }
      } else {
        this.form.radio = "2"
        let defaultGrade = ''
        for (let m in this.classMap) {
          if (!defaultGrade) {
            defaultGrade = this.classMap[m].classGrade
          }

          this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date())
          let now = new Date()
          now.setDate(now.getDate() + 3)
          this.classMap[m]['endDate'] = generateTimeReqestNumber(now)
          if (defaultGrade === this.classMap[m].classGrade) {
            this.result.push(m * 1)
          }
        }
        let date = new Date()
        this.form.time1 = generateTimeReqestNumber(date);
        date.setDate(date.getDate() + 3)
        this.form.time2 = generateTimeReqestNumber(date)
      }

      //this.getClassTeacherCourseDeploy()
    },
    methods: {
      courseChange() {
        this.resetData()
        if (this.isEdit) {
          console.log("编辑课程信息", this.editCourseInfo);
          this.form.name = this.editCourseInfo.courseName
          this.form.desc = this.editCourseInfo.desc
          this.form.share = this.editCourseInfo.shareType

          let tchClassCourseInfo = this.editCourseInfo.tchClassCourseInfo
          let classStart = {}
          let classEnd = {}

          //判断是分班设置还是统一设置
          let flag = false
          let start = tchClassCourseInfo[0].startDate
          let end = tchClassCourseInfo[0].endDate
          tchClassCourseInfo.forEach(item => {
            classStart[item.classId] = item.startDate
            classEnd[item.classId] = item.endDate
            this.result.push(item.classId)
            if (start != item.startDate || end != item.endDate) {
              flag = true
            }

          });

          if (flag) {
            this.form.radio = "1"
            //分班
            for (let m in this.classMap) {
              if (classStart[this.classMap[m].classId]) {
                this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date(classStart[this.classMap[m].classId]))
              } else {
                this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date())
              }
              if (classEnd[this.classMap[m].classId]) {
                this.classMap[m]['endDate'] = generateTimeReqestNumber(new Date(classEnd[this.classMap[m].classId]))
              } else {
                let now = new Date()
                now.setDate(now.getDate() + 3)
                this.classMap[m]['endDate'] = generateTimeReqestNumber(now)
              }
            }

            let date = new Date()
            this.form.time1 = generateTimeReqestNumber(date);
            date.setDate(date.getDate() + 3)
            this.form.time2 = generateTimeReqestNumber(date)
          } else {
            //统一
            this.form.radio = "2"
            for (let m in this.classMap) {
              this.classMap[m]['beginDate'] = generateTimeReqestNumber(new Date())
              let now = new Date()
              now.setDate(now.getDate() + 3)
              this.classMap[m]['endDate'] = generateTimeReqestNumber(now)
            }
            this.form.time1 = generateTimeReqestNumber(new Date(tchClassCourseInfo[0].startDate))
            this.form.time2 = generateTimeReqestNumber(new Date(tchClassCourseInfo[0].endDate))
          }
        } else {
        }
      },
      initData(classGrade, term) {
        this.currentShareCourse.classGrade = classGrade
        this.term = term
      },
      resetData() {
        this.loadingEdit = false
        this.loadingSubmit = false
        this.filterShow = false
        this.showTime = false
        this.showMask = false
        this.form = {
          share: 'S01',
          desc: '',
          name: '',
          course: '',
          radio: '2',
          time1: '',
          time2: '',
        }
        // this.sysCourseId = ''
        // this.sysCourseList = []
        // this.shareCourseList = []
        // this.currentShareCourse = {}
        // this.list = ['a', 'b', 'c']
        this.result = []
        // this.currentDate = new Date()
        // this.minDate = new Date()
        // this.className = '电话的的的123'
        // // this.classMap = {}
        // this.beginDate = []
        // this.endDate = []
        // this.timeType = {}
        // this.currentClassId = ''
        // this.selectCourseName = ''
        // this.isSelect = true
      },
      formatter(type, value) {
        console.log(type)
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
      handleSelectTime(v) {
        if (this.form.radio == '2') {
          if (this.timeType == 'begin') {
            this.form.time1 = generateTimeReqestNumber(v)
            //判断结束时间时候小于结束时间
            let time1 = new Date(this.form.time1)
            let time2 = new Date(this.form.time2)
            if (time1.getTime() >= time2.getTime()) {
              time1.setDate(time1.getDate() + 3)
              this.form.time2 = generateTimeReqestNumber(time1)
            }
          } else if (this.timeType == 'end') {
            this.form.time2 = generateTimeReqestNumber(v)
          }
        } else {
          if (this.timeType == 'begin') {
            this.classMap[this.currentClassId]['beginDate'] = generateTimeReqestNumber(v)
            let begin = new Date(this.classMap[this.currentClassId]['beginDate'])
            let end = new Date(this.classMap[this.currentClassId]['endDate'])
            if (begin.getTime() >= end.getTime()) {
              begin.setDate(begin.getDate() + 3)
              this.classMap[this.currentClassId]['endDate'] = generateTimeReqestNumber(begin)
            }
          } else if (this.timeType == 'end') {
            this.classMap[this.currentClassId]['endDate'] = generateTimeReqestNumber(v)
          }
        }
        this.showTime = false
      },
      getSysCourseList() {
        if(this.isEdit) return;
        this.showMask = true
        if (this.form.name == "") {
          return
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "subjectList": [localStorage.getItem("currentSubjectType")],
          "keyWord": this.form.name
        }
        if (this.isfEducation) {
          obj.subjectList = ["S20"]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        let that = this
        getTextBookCourseByParam(params).then(res => {
          if (res.flag) {

            that.sysCourseList = res.data

          } else {
            this.$toast(res.msg)
            return
          }
        })
      },
      selectCourse(index) {
        console.log(index);
        this.currentShareCourse = this.sysCourseList[index]

        this.form.name = this.sysCourseList[index].nodeName
        this.shareFlag = false
        this.isSelect = true

        this.getShareCourseDetailV2()
        this.showMask = false
        console.log(this.currentShareCourse)
      },
      getShareCourseDetailV2() {
        this.isSelect = !this.isSelect
        if (this.shareFlag) {
          return
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "schoolTypeCd": "S01",
          "sysCourseId": this.currentShareCourse.courseId,
          "classGrade": this.currentShareCourse.classGrade.split("&")[0],
          "subjectType": localStorage.getItem("currentSubjectType"),
          "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
          "pageSize": "100",
          "termType": this.term,
          "currentPage": "1"
        }
        if (this.isfEducation) {
          obj.subjectType = "S20"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getShareCourseDetailV2(params).then(res => {
          this.shareFlag = true
          if (res.flag) {
            this.shareCourseList = res.shareCourseDetailList
            this.form.course = 0;
            this.result = []
            if (this.shareCourseList.length) {
              this.sysCourseId = this.shareCourseList[0].sysCourseId
              let classGrade = this.shareCourseList[0].classGrade
              if (classGrade) {
                for (let m in this.classMap) {
                  console.log(this.classMap[m])
                  if (classGrade == this.classMap[m].classGrade) {
                    this.result.push(this.classMap[m].classId)
                  }
                }
              }

            } else {
              this.$toast('没有共享课程')
            }
          } else {
            this.$toast(res.msg);
          }
        })
      },
      selectTime(type, classId) {
        this.timeType = type
        this.showTime = true
        this.currentClassId = classId;
        if (this.form.radio == '2') {
          //统一设置
          if (type == "begin") {
            this.minDate = new Date()
            this.currentDate = new Date(this.form.time1)
          } else if (type == 'end') {
            let date = new Date(this.form.time1)
            date.setDate(date.getDate() + 1)
            this.minDate = date
            this.currentDate = new Date(this.form.time2)
          }
        } else {
          //分班设置
          if (type == 'begin') {//开始时间
            this.minDate = new Date()
            this.currentDate = new Date(this.classMap[classId].beginDate)
          } else if (type == 'end') {//结束时间
            let date = new Date(this.classMap[classId].beginDate)
            date.setDate(date.getDate() + 1)
            this.minDate = date
            this.currentDate = new Date(this.classMap[classId].endDate)
          }
        }
      },
      createCourse() {
        let that = this
        console.log(this.classMap)
        if (!this.form.name) {
          this.$toast("请输入课程名称")
          return
        }
        if (!this.result || this.result.length == 0) {
          this.$toast("请选择班级")
          return
        }

        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "relationSeqId": this.shareCourseList.length ? this.shareCourseList[this.form.course].sysCourseId : 0,
          "sysCourseId": this.shareCourseList.length ? this.shareCourseList[this.form.course].sysCourseId : 0,
          "shareTchCourseId": this.shareCourseList.length ? this.shareCourseList[this.form.course].tchCourseId : 0,
          "courseName": this.form.name,
          "subjectType": localStorage.currentSubjectType,
          "courseType": "C01",
          "termType": this.$refs['courseFilter'].termTypeList[this.$refs['courseFilter'].termIndex],
          "shareType": "S01",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "classCount": this.result.length,
          "desc": this.form.desc,
        }
        if (this.isfEducation) {
          obj.subjectType = "S20"
          obj.courseType = "C02"
        }
        if (this.form.radio == '2') {
          //统一设置
          this.result.forEach((item, index) => {
            obj["classInfo" + (index + 1)] = item + "|" + this.form.time1 + "|" + this.form.time2
          })
        } else {
          //分班设计

          this.result.forEach((item, index) => {
            obj["classInfo" + (index + 1)] = item + "|" + that.classMap[item].beginDate + "|" + that.classMap[item].endDate
          })
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        console.log("新建课参数：", params)
        this.loadingSubmit = true
        if(this.$route.query.from === 'myCourse'){
          try{MobclickAgent.onEvent('myCourseAddCourseSubmit')}catch(e){console.log(e)}
        }else if (this.isfEducation) {
          try{MobclickAgent.onEvent('familyEduAddCourseSubmit')}catch(e){console.log(e)}
        }
        else {
          try{MobclickAgent.onEvent('addCourse')}catch(e){console.log(e)}
        }
        createTeachCourse(params).then(res => {
          if (res.flag) {
            this.$toast("创建成功")
            setTimeout(() => {
              this.loadingSubmit = false
              eventBus.$emit('courseListRefresh')
              this.$router.back()
            }, 200);

          } else {
            this.loadingSubmit = false
            this.$toast(res.msg)
          }

        })
      },
      changShareCourse() {

      },
      async getClassTeacherCourseDeploy() {
        let obj = {
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassTeacherCourseDeploy(params).then(res => {
          if (res.flag) {
            if (!res.data || res.data.length == 0) {
              this.$toast("未配置建课信息，无法筛选系统课程，请联系管理人员")
              return
            }
            let deployMap = {}
            let key = ""
            let gradeMap = {}
            let dataList = res.data
            dataList.forEach(item => {
              gradeMap[item.gradeTermInfo.grade] = item.gradeTermInfo.grade
            })
            let deployList = []
            for (let k in gradeMap) {

              //配置的学期列表、版本列表
              let termMap = {}
              let bookMap = {}
              let bookList = [];
              let termList = [];
              let gradeTermMap = {}
              dataList.forEach(item => {
                gradeTermMap[item.gradeTermInfo.grade + '_' + item.gradeTermInfo.term] = item.gradeTermInfo.gradeTermId
                if (k === item.gradeTermInfo.grade) {
                  if (!bookMap[item.textBookId]) {
                    bookMap[item.textBookId] = item.textBookName
                    bookList.push({
                      textBookId: item.textBookId,
                      textBookName: item.textBookName,
                      subjectType: item.subjectType
                    })
                  }
                  if (!termMap[item.gradeTermInfo.term]) {
                    termMap[item.gradeTermInfo.term] = item.gradeTermInfo.term
                    termList.push(termMap[item.gradeTermInfo.term])
                  }
                }
              })
              let obj = {
                classGrade: k,
                bookInfo: bookList,
                termInfo: termList
              }
              deployList.push(obj)
            }

            console.log("配置列表", deployList)
            localStorage.setItem("deployList", JSON.stringify(deployList))
            localStorage.setItem("gradeTermMap", JSON.stringify(gradeTermMap))
            res.data.forEach(item => {
              key = item.gradeTermInfo.grade + "_" + item.gradeTermInfo.term + "_" + item.subjectType + "_" + item.gradeTermId
              if (deployMap[key]) {
                let tmp = deployMap[key]
                let flag = false
                for (let t of tmp) {
                  if (t.textBookId == item.textBookId && t.gradeTermId == item.gradeTermId) {
                    flag = true
                    break
                  }
                }
                if (!flag) {
                  deployMap[key].push({
                    textBookId: item.textBookId,
                    textBookName: item.textBookName,
                    gradeTermId: item.gradeTermId
                  })
                }
              } else {
                deployMap[key] = [{
                  textBookId: item.textBookId,
                  textBookName: item.textBookName,
                  gradeTermId: item.gradeTermId
                }]
              }
            })
            console.log("课程配置信息：", deployMap)
            let list = []
            for (let m in deployMap) {
              let k = m.split("_")
              list.push({
                classGrade: k[0],
                term: k[1],
                subjectType: k[2],
                gradeTermId: k[3],
                textBookList: deployMap[m]
              })
            }
            console.log("list", list);
            localStorage.setItem("deployMap", JSON.stringify(list))

          } else {
            this.$toast("获取老师课程配置：" + res.msg)
          }
        });
      },
      handleSysCourse(name, id, grade, term) {
        console.log(name, id, grade)
        this.form.name = name
        this.currentShareCourse['courseId'] = id
        this.currentShareCourse['classGrade'] = grade
        this.term = term
        this.shareFlag = false
        this.isSelect = true

        this.getShareCourseDetailV2()
      },
      openSysCourse() {

        if (!localStorage.getItem("deployList")) {
          this.filterShow = false
          this.$toast('未配置创建课程信息')
          return
        }
        this.filterShow = true
      },
      submitEdit() {
        console.log("编辑课程")

        if (!this.form.name) {
          this.$toast("请输入课程名称")
          return
        }
        if (!this.result || this.result.length == 0) {
          this.$toast("请选择班级")
          return
        }
        let removeClass = ''
        this.editCourseInfo.tchClassCourseInfo.forEach(v => {
          if(!this.result.includes(v.classId)) {
            //如果原本课程选择的班级被手动移除
            removeClass += (removeClass.length?'、':'') + v.className
          }
        })
        if(removeClass.length) {
          this.showAlert = true
          this.message = `${removeClass}下的所有任务都会被删除,确认移除班级?`
        }else {
          this.handleEditClass()
        }
      },
      handleEditClass() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "tchCourseId": this.editCourseInfo.tchCourseId,
          "courseName": this.form.name,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "shareType": this.form.share,
          "classCount": this.result.length,
          "desc": this.form.desc,

        }
        let that = this
        if (this.form.radio == '2') {
          //统一设置
          if (!this.form.time1) {
            this.$toast("开始时间不能为空")
            return
          }
          if (!this.form.time2) {
            this.$toast("结束时间不能为空")
            return
          }
          if (new Date(this.form.time1) > new Date(this.form.time2)) {
            this.$toast("开始时间不能大于结束时间")
            return
          }

          this.result.forEach((item, index) => {
            obj["classInfo" + (index + 1)] = item + "|" + this.form.time1 + "|" + this.form.time2
          })
        } else {
          //分班设计
          this.result.forEach((item, index) => {
            if (!that.classMap[item].beginDate) {
              this.$toast(that.classMap[item].className + "开始时间不能为空")
              return
            }
            if (!that.classMap[item].endDate) {
              this.$toast(that.classMap[item].className + "结束时间不能为空")
              return
            }
            if (new Date(that.classMap[item].beginDate) > new Date(that.classMap[item].endDate)) {
              this.$toast(that.classMap[item].className + "开始时间不能大于结束时间")
              return
            }
            obj["classInfo" + (index + 1)] = item + "|" + that.classMap[item].beginDate + "|" + that.classMap[item].endDate
          })
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        console.log("修改课程", params)
        this.loadingEdit = true
        try{MobclickAgent.onEvent(this.isfEducation?'familyEditCourseSubmit':'editMyCourseSubmit')}catch(e){console.log(e)}
        modifyTeachCourse(params).then(res => {
          this.loadingEdit = false
          if (res) {
            if (res.flag) {
              this.$toast('修改成功')
              this.$emit('onFinish', this.form.name)
              res.data[0].tchSubjectCourse.shareType = this.form.share
              this.$emit('update:editCourseInfo', res.data[0].tchSubjectCourse)
            } else {
              this.$toast(res.msg)
            }
          } else {
            this.$toast("修改失败")
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .add-course-wrap {
    display: flex;
    flex-direction: column;

    &__body {
      flex: 1;
      overflow-y: auto;
    }

    @{deep} .gfy-label {
      font-size: 15px;
      color: #000;
    }

    .name {
      padding-left: 8px;
      position: relative;

      .search-wrap {
        background: #fff;
        position: absolute;
        width: 100%;
        top: 44px;
        left: 0;
        z-index: 100;
        box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
        border-radius: 0px 0px 10px 10px;
        max-height: 176px;
        overflow-y: auto;

        @{deep} .van-cell__title {
          width: 100%;
        }

        &__item {
          &-title {
            /*flex: 0 0 70%;*/
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .tag {
            color: #16aab7;
            font-size: 10px;
            background: #e0fffc;
            line-height: 20px;
            padding: 0 5px;
            border-radius: 8px;
          }
        }
      }
    }

    .input-wrap {
      position: relative;
      padding-right: 40px;

      .num-tip {
        position: absolute;
        color: red;
        font-size: 10px;
        right: 22px;
        top: 50%;
        transform: translateY(-50%);
      }

      .close {
        margin-left: 10px;
        position: absolute;
        font-size: 15px;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: @blue;
      }
    }

    .class-group {
      .class-label {
        margin-bottom: 14px;
      }

      .gfy-radio-group {
        padding-left: 8px;
      }

      .gfy-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        padding-left: 8px;

        .normal {
          background: none;
          border: 1px solid #999;
          border-radius: 1.5px;
        }

        &-item {
          margin-right: 13px;
          margin-bottom: 18px;
        }
      }
    }

    .time-group {
      align-items: center;
      background: #f5f6fa;
      border-radius: 10px;
      display: flex;
      padding: 10px;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 5px;
      .class-name {
      }
      .divider {
        margin: 0 5px;
      }

      .time-view {
        flex: 1;
        /*width: 120px;*/
        height: 18px;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
      }
    }

    .radio-normal {
      border: 1px solid #999;
      border-radius: 50%;
      background: none;
    }

    .gfy-textarea {
      width: 100%;
      margin-top: 15px;
      background: #f5f6fa;
      padding: 15px 12px;
      border-radius: 5px;
      color: #1e1e1e;
      font-size: 14px;
    }

    @{deep} .van-radio__label {
      margin-left: 5px;
    }

    @{deep} .van-popup--bottom {
      overflow-y: hidden;
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .submit-btn {
        flex: 1;
        border-radius: 21px;
        font-size: 16px;
      }

      .edit-btn {
        flex: 1;
        // flex: 0 0 125px;
        border-radius: 21px;
        font-size: 16px;
        margin-right: 20px;
        line-height: 30px;
        height: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    .mask {
      width: 100%;
      height: calc(100% - 44px);
      position: absolute;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
      left: 0;
      top: 44px;
    }
  }
</style>
