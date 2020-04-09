<template>
  <!--    <section class="course-filter-wrap"></section>-->
  <van-popup :close-on-click-overlay="false" v-model="show" position="bottom" :style="{ height: (type==='myCourse' || type==='error'||type==='fEducation')?'65%':'93%' }">
    <div class="course-filter-wrap">
      <van-overlay class-name="mask" :show="gradeDropdown||termDropdown||versionDropdown||classDropdown"
                   @click="gradeDropdown = false;termDropdown=false;versionDropdown=false;classDropdown=false"/>

      <div class="course-filter-wrap__header van-hairline--bottom">
        <div v-if="type==='myCourse' || type==='error'" class="course-filter-wrap__header-tab">
          <span @click="handleSubject(item)" :class="{active:item.active}" v-for="(item, index) in subjectList"
                :key="index">{{item.value}}</span>
        </div>
        <div v-if="type!=='myCourse'&&type!=='fEducation'&&type!=='error'" class="course-filter-wrap__header-tab">
          <span>{{subjectName}}</span>
        </div>
        <div v-if="type==='fEducation'" class="course-filter-wrap__header-tab">
        </div>
        <van-icon v-if="type==='myCourse' || type==='error'|| type==='fEducation'" class="icon-close" @click="show=false" name="close" />
      </div>
      <div v-if="type==='myCourse' || type==='error'||type === 'fEducation'" class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div class="dropdown-title" @click="gradeDropdown=!gradeDropdown">
            {{gradeList[gradeIndex]?gradeList[gradeIndex].gradeName:'全部'}}
            <van-icon class="arrow" :name="gradeDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: gradeIndex === ''}" v-if="type === 'myCourse'||type === 'fEducation'" @click="changeGrade('')">全部
              <van-icon v-show="gradeIndex === '' " class="check blue" name="success" />
            </div>
            <div class="dropdown-menu-item" :class="{active: gradeIndex === index}"
                 v-if="item.teacherInfoList.some(t => t.subjectType === subjectList.find(v => v.active).key)"
                 v-for="(item,index) in gradeList" :key="index" @click="changeGrade(index)">{{item.gradeName}}
              <van-icon v-show="gradeIndex === index " class="check blue" name="success"/>
            </div>
          </div>
        </div>

        <div>
          <div class="dropdown-title" @click="termDropdown=!termDropdown">
            <!--            {{termList[termIndex]?termList[termIndex].name:'学期'}}-->
            {{termList[termIndex]?termList[termIndex].name:'全部'}}
            <van-icon class="arrow" :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType('')" v-if="type==='myCourse'||type==='fEducation'" :class="{active: termIndex === ''}">全部
              <van-icon v-show="termIndex === '' " class="check blue" name="success" />
            </div>
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: termIndex === index}"
                 v-for="(item,index) in termList" :key="index">{{item.name}}
              <van-icon v-show="termIndex === index " class="check blue" name="success"/>
            </div>
          </div>
        </div>

        <div>
          <div class="dropdown-title" @click="classDropdown=!classDropdown">
            <!--            <span>{{classList[classIndex]?classList[classIndex].className:'班级'}}</span>-->
            <span>{{classList[classIndex]?classList[classIndex].className:'全部'}}</span>
            <van-icon class="arrow" :name="classDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="classDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeClass(0)" v-if="type==='myCourse'||type==='fEducation'" :class="{active: classIndex === 0}">全部
              <van-icon v-show="classIndex === 0" class="check blue" name="success" />
            </div>
            <div class="dropdown-menu-item" @click="changeClass(key)" :class="{active: classIndex === key}"
                 v-if="classVisible(value,key)" v-for="(value ,key) in classList" :key="key">{{value.className}}
              <van-icon v-show="classIndex === key" class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="gradeDropdown=!gradeDropdown" v-if="classGradeList.length>0">
            {{classGradeList[gradeIndex].classGrade|getGradeName}}
            <van-icon :name="gradeDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: gradeIndex== index}" v-for="(item,index) in classGradeList"
                 :key="index" @click="changeGrade(index)">{{item.classGrade|getGradeName}}
              <van-icon v-show="gradeIndex == index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
        <div>
          <div @click="termDropdown=!termDropdown">{{termTypeList[termIndex]|getTermName}}
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: termIndex== index}"
                 v-for="(item,index) in termTypeList" :key="index">{{item|getTermName}}
              <van-icon v-show="termIndex== index " class="check blue" name="success"/>
            </div>
          </div>
        </div>
        <div>
          <div @click="versionDropdown=!versionDropdown" v-if="bookInfoList.length>0">
            {{bookInfoList[bookIndex].textBookName}}
            <van-icon :name="versionDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="versionDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeBook(index)" :class="{active: bookIndex== index}"
                 v-for="(item ,index) in bookInfoList" :key="index">{{item.textBookName}}
              <van-icon v-show="bookIndex== index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
      </div>
      <div class="course-filter-wrap__body">
        <div v-if="type!=='myCourse'||type!=='error'" class="course-filter-wrap__body-left">
          <div :class="{'active':unitIndex ==index }" v-for="(item,index) in unitList" :key="index" @click="handleUnit(index)">
            {{item.nodeName}}
          </div>
        </div>
        <div v-if="type!=='myCourse'||type!=='error'" class="course-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div v-if="item.childNodeList && item.childNodeList.length>0">
              <div class="course-first van-hairline--bottom" @click="$set(item,'fold',!item.fold)"><span>{{item.nodeName}}</span>
                <van-icon class="down-arrow" v-show="item.childNodeList && item.childNodeList.length>0"
                          :name="item.fold?'arrow-up':'arrow-down'"/>
              </div>
              <div :class="['course-sec',{active:currentSysCourseId == c.courseId}]" v-show="item.fold"
                   @click="selectSysCourse(c.courseId,c.nodeName)" v-for="(c,ci) in item.childNodeList" :key="ci">
                {{c.nodeName}}
                <van-icon v-show="currentSysCourseId == c.courseId" class="check blue" name="success"/>
              </div>
            </div>
            <div v-else>
              <div :class="['course-sec',{active:currentSysCourseId == item.courseId}]"
                   @click="selectSysCourse(item.courseId,item.nodeName)"><span>{{item.nodeName}}</span>
                <van-icon v-show="currentSysCourseId == item.courseId" class="check blue" name="success"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="handleSubmit">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {getTextBookCourseInfo, getGradeTermInfo, getTextBookVersionByGradeTerm} from '@/api/index'

export default {
  name: "courseFilter",
  props: ['visible', 'sysCourseId', 'type'],
  data() {
    return {
      gradeDropdown: false,
      termDropdown: false,
      versionDropdown: false,
      unitList: [],
      unitIndex: 0,
      subjectList: [],
      // subjectList: {'S01':'语文','S02':'数学'},
      courseList: [],
      //sysCourseId:'',
      termTypeList: [],
      termIndex: ((new Date().getMonth() + 1) >= 2 && (new Date().getMonth() + 1) <= 7) ? 1 : 0,
      gradeTermList: this.$store.getters.getGradeTermInfo,
      subjectName: localStorage.getItem("currentSubjectTypeName"),
      classGradeMap: [],
      gradeIndex: (this.type === 'myCourse') || (this.type === 'fEducation')  ? '' : 0,
      textBookList: [],
      bookIndex: 0,
      currentSysCourseId: this.sysCourseId,
      currentSysCourseName: '',
      isDeploy: false,
      classGradeList: [],
      bookInfoList: [],
      isNowTerm: 0,
      gradeTermMap: '',
      gradeList: JSON.parse(localStorage.getItem("gradeList")),
      // gradeList: JSON.parse(localStorage.getItem("gradeList")).filter(v => v.teacherInfoList.some(s => s.subjectype === localStorage.currentSubjectType)),
      termList: [{ name: '上学期', value: 'T01' }, { name: '下学期', value: 'T02' }],
      classList: JSON.parse(localStorage.getItem("classMap")),
      classDropdown: false,
      // classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
      classIndex: '',
      showChangeDialog:false
    }
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    },
  },
  async mounted() {
    if (this.type === 'myCourse' || this.type === 'error' || this.type === 'fEducation') {
      // this.getTextBookCourseInfo()
    } else {
      //获取上下学期
      let now = new Date();
      let month = now.getMonth() + 1;
      if (7 >= month && month >= 2) {
        this.isNowTerm = 1
      } else {
        this.isNowTerm = 0
      }
      //学科信息获取
      if (localStorage.getItem("deployList")) {
        //先查出当前学科有哪些年级
        let gradeArr = []
        for (let k in JSON.parse(localStorage.getItem("classMap"))) {
          if (JSON.parse(localStorage.getItem("classMap"))[k].teacherInfoList.some(s => s.subjectType === localStorage.currentSubjectType)) {
            if (!gradeArr.includes(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)) {
              gradeArr.push(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)
            }
          }
        }
        //筛选对应的年级
        if (gradeArr.includes("G09")) {
          gradeArr.push("G09&1")
        }
        this.classGradeList = JSON.parse(localStorage.getItem("deployList")).filter(v => gradeArr.includes(v.classGrade));
        let tempList = this.classGradeList[this.gradeIndex].bookInfo
        let sub = localStorage.getItem("currentSubjectType")
        // this.bookInfoList = []
        // tempList.forEach((item) => {
        //   if (item.subjectType == sub) {
        //     this.bookInfoList.push(item)
        //   }
        // });
        this.termTypeList = this.classGradeList[this.gradeIndex].termInfo
        if (this.termTypeList && this.termTypeList.length > 1) {
          if (this.isNowTerm === 1) {
            this.termTypeList.forEach((item, index) => {
              if (item == "T02") {
                this.termIndex = index
              }
            })
          } else {
            this.termTypeList.forEach((item, index) => {
              if (item == "T01") {
                this.termIndex = index
              }
            })
          }
        } else {
          this.termIndex = 0
        }
        this.$emit('init', this.classGradeList[this.gradeIndex].classGrade.split("&")[0], this.termTypeList[this.termIndex])
        this.isDeploy = true;
      } else {
        this.$toast("未配置年级学科信息")
      }

        if (localStorage.getItem('gradeTermMap')) {
          this.gradeTermMap = JSON.parse(localStorage.getItem("gradeTermMap"))
          await this.getTextBookVersionByGradeTerm()
        } else {
          this.$toast("年级信息错误")
        }
        if (this.isDeploy) {
          this.getTextBookCourseInfo()
        }
      }

  },
  created() {
    if (this.type === 'fEducation') {
      this.subjectList.push({
        key: 'S20',
        value: '家庭教育',
        active: true
      })
      // for (let key in JSON.parse(localStorage.getItem("classMap"))) {
      //   const value = JSON.parse(localStorage.getItem("classMap"))[key]
      //   if (this.gradeList[this.gradeIndex].classGrade === value.classGrade && value.teacherInfoList.some(v => v.subjectType === "S20")) {
      //     this.classIndex = key
      //     break
      //   }
      // }
      this.initClassIndex()
    } else {
      for (let key in JSON.parse(localStorage.getItem("subjectTypeList"))) {
        this.subjectList.push({
          key,
          value: JSON.parse(localStorage.getItem("subjectTypeList"))[key],
        })
      }
      const index = this.subjectList.findIndex(v => localStorage.getItem("currentSubjectType") === v.key)
      this.$set(this.subjectList[index], 'active', true)
      this.initClassIndex()
    }
  },
  methods: {
    async getTextBookVersionByGradeTerm() {
      this.$store.commit('setVanLoading', true)
      let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
      let gradeId = this.gradeTermMap[key]
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "gradeTermId": gradeId,
        "subjectType": localStorage.getItem("currentSubjectType")
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getTextBookVersionByGradeTerm(params).then(res => {
        this.$store.commit('setVanLoading', false)
        this.bookIndex = 0
        if (res.flag) {
          this.bookInfoList = res.data || []
        } else {
          this.bookInfoList = []
          return this.$toast(res.msg)
        }
      })
    },
    close() {
      this.showChangeDialog = false
      this.$dialog.close()
    },
    initClassIndex() {
      if (this.type === 'myCourse' || this.type === 'fEducation') {
        this.classIndex = 0
      } else {
        for (let key in JSON.parse(localStorage.getItem("classMap"))) {
          const value = JSON.parse(localStorage.getItem("classMap"))[key]
          if (this.gradeList[this.gradeIndex].classGrade.split("&")[0] === value.classGrade && value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType)) {
            this.classIndex = key
            break
          }
        }
      }
    },
    classVisible(value, key) {
      if (this.gradeIndex === '') {
        if (this.type === 'fEducation') {
          return value.teacherInfoList.some(v => v.subjectType === "S20")
        }
        return value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType)
      } else {
        return (this.gradeList[this.gradeIndex].classGrade.split("&")[0] === value.classGrade && value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType))
      }

    },
    handleSelect(item) {
      this.courseList.forEach(v => {
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        })
      })
      this.$set(item, 'check', !item.check)
    },
    handleSubject(item) {
      if (item.active) return
      this.showChangeDialog = true
      this.$dialog.confirm({
        title: '提示',
        message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换',
        closeOnPopstate: true,
        confirmButtonColor: '#39F0DD',
        className: 'change-subject'
      }).then(() => {
        this.showChangeDialog = false
        this.subjectList.forEach(v => {
          v.active = false
        })
        item.active = true
        localStorage.setItem("currentSubjectTypeName", item.value);
        localStorage.setItem("currentSubjectType", item.key);
        this.gradeIndex = this.type === 'myCourse' ? '' : 0
        this.initClassIndex()
        // this.getTextBookCourseInfo()
      }).catch(() => {
        this.showChangeDialog = false
        // on cancel
      });
    },
    handleUnit(index) {
      this.unitIndex = index;
      this.courseList = this.unitList[this.unitIndex].courseList
    },

      async getTextBookCourseInfo() {
        this.$store.commit('setVanLoading', true)
        this.unitIndex = 0
        // this.bookIndex = 0
        // this.unitList = []
        // this.courseList = []
        let obj
        if (this.type === 'myCourse' || this.type === 'error') {
          obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "termType": this.termList[this.termIndex].value, //学期
            "classGrade": this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade.split("&")[0] : '', //年级
            "classId": this.classIndex || '', //班级
            "subjectType": localStorage.getItem("currentSubjectType") //科目
          }
        } else {
          //年级计算
          let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
          let gradeId = this.gradeTermMap[key]
          if (!this.bookInfoList.length || !this.bookInfoList[this.bookIndex].textBookId) {
            this.$store.commit('setVanLoading', false)
            this.$toast("版本配置错误")
            this.courseList = []
            this.unitList = []
            this.unitIndex = 0
            return
          }
          obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "textBookId": this.bookInfoList[this.bookIndex].textBookId,
            "gradeTermId": gradeId,
            "subjectType": localStorage.getItem("currentSubjectType")
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }

        getTextBookCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          console.log("课程：", res)
          if (res.flag) {
            //重构数据
            let textBookList = res.resTextbookCourseInfoList
            if (textBookList) {
              //1.找出第一个节点
              let nodeId = "-1";
              for (let book of textBookList) {
                if (book.parentId == -1) {
                  nodeId = book.nodeId
                  break
                }
              }

              //2.获取左侧列表
              this.unitList = []
              let textBookMap = {}
              let list = []
              textBookList.forEach(item => {
                //按照parentId分组
                if (!textBookMap[item.parentId + '']) {
                  textBookMap[item.parentId + ''] = [item]
                } else {
                  textBookMap[item.parentId + ''].push(item)
                }
                if (item.parentId == nodeId) {
                  this.unitList.push(item)
                }
              })
              //3.组件每单元下的数据
              this.unitList.forEach(item => {
                let tmp = textBookMap[item.nodeId + '']
                if (tmp) {
                  tmp.forEach(obj => {
                    obj.childNodeList = textBookMap[obj.nodeId + '']
                  })
                  item.courseList = tmp
                }
              })
              if(this.unitList.length) {
                this.courseList = this.unitList[this.unitIndex].courseList
              }else {
                this.courseList = []
              }
            }
          } else {
            this.$toast(res.msg)
            this.courseList = []
            this.unitList = []
            this.unitIndex = 0
          }

      })
    },
    selectSysCourse(id, name) {
      this.currentSysCourseId = id
      this.currentSysCourseName = name
    },
    changeClass(key) {
      this.classIndex = key
      this.classDropdown = false
      // this.getTextBookCourseInfo()
    },
    async changeTermType(index) {
      this.termIndex = index
      this.termDropdown = !this.termDropdown
      if (this.type === 'myCourse' || this.type === 'error' || this.type === 'fEducation') {
        // this.getTextBookCourseInfo()
      } else {
        await this.getTextBookVersionByGradeTerm()
        this.getTextBookCourseInfo()
      }
    },
    async changeGrade(index) {
      if (this.type === 'myCourse' || this.type === 'error'|| this.type === 'fEducation') {
        this.gradeIndex = index
        this.initClassIndex()
        this.gradeDropdown = !this.gradeDropdown
        // this.getTextBookCourseInfo()
      } else {
        this.gradeIndex = index

          let tempList = this.classGradeList[index].bookInfo
          let sub = localStorage.getItem("currentSubjectType")
          // this.bookInfoList = []
          // tempList.forEach((item) => {
          //   if (item.subjectType == sub) {
          //     this.bookInfoList.push(item)
          //   }
          // });
          this.termTypeList = this.classGradeList[index].termInfo
          if (this.termTypeList && this.termTypeList.length > 1) {
            if (this.isNowTerm === 1) {
              this.termTypeList.forEach((item, index) => {
                if (item == "T02") {
                  this.termIndex = index
                }
              })
            } else {
              this.termTypeList.forEach((item, index) => {
                if (item == "T01") {
                  this.termIndex = index
                }
              })
            }
          } else {
            this.termIndex = 0
          }

        this.gradeDropdown = !this.gradeDropdown
        await this.getTextBookVersionByGradeTerm()
        this.getTextBookCourseInfo()
      }
    },
    changeBook(index) {
      this.bookIndex = index
      this.versionDropdown = !this.versionDropdown
      this.getTextBookCourseInfo()
    },
    handleSubmit() {
      this.show = false
      this.$emit('update:visible', false)
      this.$emit('update:sysCourseId', this.currentSysCourseId)
      if (this.type === 'myCourse' || this.type === 'error'||this.type === 'fEducation') {
        this.$emit('confirm', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade : '', this.termList[this.termIndex] ? this.termList[this.termIndex].value : '', this.classIndex > 0 ? this.classIndex : '', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].gradeName : '', this.termList[this.termIndex] ? this.termList[this.termIndex].name : '', this.classIndex > 0 ? this.classList[this.classIndex].className : '')
      }
      //  else if (this.type === 'fEducation') {
      //   this.$emit('confirm', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade : '', this.termList[this.termIndex] ? this.termList[this.termIndex].value : '', this.classIndex > 0 ? this.classIndex : '', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].gradeName : '', this.termList[this.termIndex] ? this.termList[this.termIndex].name : '', this.classIndex > 0 ? this.classList[this.classIndex].className : '')
      // }
      else {
        this.$parent.handleSysCourse(this.currentSysCourseName, this.currentSysCourseId, this.classGradeList[this.gradeIndex].classGrade, this.termTypeList[this.termIndex])
      }
    },


    }
  }
</script>

<style lang="less" scoped>
  .course-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    .mask {
      background: transparent;
    }

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 35px;
          font-size: 16px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }
      }

      .icon-close {
        font-size: 22px;
        color: #ccc;
      }
    }

    &__dropdown {
      display: flex;
      flex: 0 0 44px;

      > div {
        flex: 1;
        font-size: 16px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
        position: relative;
        min-width: 0;

        &:last-child {
          border-right: none;
        }

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;
          max-height: 180px;
          overflow-y: auto;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }

      .dropdown-title {
        min-width: 0;
        padding: 0 5px;
        display: flex;
        align-items: center;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }

        .arrow {
          margin-left: 3px;
        }
      }
    }

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden !important;

      &-left {
        flex: 0 0 125px;
        overflow-y: auto;

        > div {
          line-height: 44px;
          color: #000;
          font-size: 15px;
          text-align: center;
          border-left: 3px solid transparent;

          &.active {
            border-left: 3px solid #16aab7;
            color: @blue;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;

        .course-first {
          height: 44px;
          display: flex;
          align-items: center;
          color: #000;
          font-size: 14px;
          padding-right: 10px;
          word-break: break-all;
          justify-content: space-between;

          .down-arrow {
            flex: 0 0 20px;
            text-align: right;
          }
        }

        .course-sec {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 12px;
          padding: 0 5px;
          word-break: break-all;

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }

          &:last-child {
            border-bottom: 1px solid #ebedf0;
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 6px 10px;

      .confirm-btn {
        width: 100%;
        color: #fff;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
