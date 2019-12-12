<template>
  <van-popup v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>教材</span>
          <van-icon class="icon-close" @click="closePop" name="close" />
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in versionList[yearIndex].arr" :key="index" :class="{active:item.active}">{{item.textBookName}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div v-if="versionList[yearIndex].arr[index]">
            <div class="" v-for="(grade,ci) in versionList[yearIndex].gradeList" :key="ci">
              <div @click="handleSelect(grade)" class="van-hairline--bottom">
                <div :class="['cell__item',{active:grade.check}]">{{grade.gradeTermName}}
                  <van-icon v-show="grade.check" class="check blue" name="success" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="res-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Dialog } from 'vant';
import { getTextBookVersionInfo, getGradeTermInfo, getTextBookCourseInfo, getVersionGradeList } from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "versionFilter",
  props: ['visible', 'label', 'gradeTerm', 'courseIds'],
  data() {
    return {
      index: 0,
      yearIndex: 0,
      versionList: [
        { year: 'Y01', arr: [], gradeList: [] },
        { year: 'Y02', arr: [], gradeList: [] },
        { year: 'Y03', arr: [], gradeList: [] },
      ],
      tempList: [],
      tempIndex: 0,

      textBookId: '',
      gradeTermId: '',
      subjectType: '',

      textItem: '',
      gradeTermItem: '',

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
  watch: {
    visible(v) {
      if (v) {
        this.tempIndex = this.index
        this.tempList = JSON.parse(JSON.stringify(this.versionList))
      }
    }
  },
  created() {
    console.log('subjectfilter created');
    this.versionList.forEach(async (v, i) => {
      await this.getGradeTermInfo(v)
      // this.getTextBookVersionInfo(v, i)
      this.getVersionGradeList(v, i)

    })
  },
  mounted() {
    console.log('subjectfilter mounted');
    eventBus.$off("changeYear")
    eventBus.$on("changeYear", (yearIndex, subjectType) => {
      console.log("eventBus changeYear");
      this.yearIndex = yearIndex
      this.$set(this.versionList[this.yearIndex].gradeList[0], 'check', true)
      this.gradeItem = this.versionList[this.yearIndex].gradeList.find(v => v.check)
      this.textItem = this.versionList[this.yearIndex].arr.find(v => v.active)
      this.$emit('update:label', this.textItem.textBookName + this.gradeItem.gradeTermName)
      this.$emit('update:gradeTerm', this.gradeItem.grade + '|' + this.gradeItem.term)
      // eventBus.$emit('changeVersion',{
      //   textBookId: textItem.textBookId,
      //   gradeTermId: gradeItem.gradeTermId},{subjectType})

      this.getTextBookCourseInfo()


    })
  },
  methods: {
    async getTextBookCourseInfo() {
      this.$store.commit('setVanLoading', true)
      this.unitIndex = 0
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "textBookId": this.textItem.textBookId,
        "gradeTermId": this.gradeTermItem.gradeTermId,
        "subjectType": localStorage.currentSubjectType,
        'nodeType': 'N00'
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }

      getTextBookCourseInfo(params).then(res => {
        this.$store.commit('setVanLoading', false)
        console.log("课程：", res)
        if (res.flag) {
          if (res.resTextbookCourseInfoList && res.resTextbookCourseInfoList.length > 0) {
            let textBookList = res.resTextbookCourseInfoList
            let newArr = [];
            textBookList.forEach(function (item) {
              newArr.push(item.courseId)
            })
            this.courseIds = newArr = Array.from(new Set(newArr))
            console.log(courseIds, 'courseIds');

            this.$emit('update:courseIds', this.courseIds)

          }

        }

        return
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
            this.courseList = (this.unitList[this.unitIndex] && this.unitList[this.unitIndex].courseList) ? this.unitList[this.unitIndex].courseList : []
            //选默认值
            if (this.courseList.length) {
              const item = this.courseList[0]
              if (item.childNodeList && item.childNodeList.length > 0) {
                this.$set(item, 'fold', true)
                this.selectSysCourse(item.childNodeList[0].courseId, item.childNodeList[0].nodeName)
              } else {
                this.$set(item, 'fold', true)
                this.selectSysCourse(item.courseId, item.nodeName)
              }
            }
            this.$emit('filter', this.currentSysCourseId)
            // this.$emit('update:label',(this.unitList[this.unitIndex]&&this.unitList[this.unitIndex].courseList)?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
            this.$emit('update:label', this.currentSysCourseName)

          }
        } else {
          // this.$toast(res.msg)
          this.courseList = []
          this.unitList = []
          this.unitIndex = 0
          this.selectSysCourse('', '')
          this.$emit('filter', this.currentSysCourseId)
          // this.$emit('update:label',this.unitList[this.unitIndex]?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
          this.$emit('update:label', this.currentSysCourseName)

        }

      })
    },

    async getGradeTermInfo(v) {
      // if(this.filter.subjectList[index].gradeDone) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        yearSection: v.year,
        pageSize: 999,
        currentPage: 1
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getGradeTermInfo(params).then(res => {
        // this.$set(this.filter.subjectList[index],'gradeDone',true) // 是否已加载了数据
        if (res.flag) {
          v.gradeList = res.resGradeTermList
        }
      })
    },
    getTextBookVersionInfo(v, index) {
      // if(this.filter.subjectList[index].versionDone) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        yearSection: v.year,
        pageSize: 9999,
        currentPage: 1
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getTextBookVersionInfo(params).then(res => {
        // this.$set(this.filter.subjectList[index],'versionDone',true) // 是否已加载了年级数据
        console.log('getTextBookVersionInfo', res);
        if (res.flag) {
          v.arr = res.textbookVersionList
          v.arr.forEach((ver, i) => {
            if (!i) {
              this.textItem = ver
              this.$set(ver, 'active', true)
            }

            // this.$set(ver,'child',JSON.parse(JSON.stringify(v.gradeList)))
            if (!index && !i) {
              this.$set(v.gradeList[0], 'check', true)
              this.$emit('update:label', ver.textBookName + v.gradeList[0].gradeTermName)
              this.$emit('update:gradeTerm', v.gradeList[0].grade + '|' + v.gradeList[0].term)

              this.gradeTermItem = v.gradeList[0]
              // eventBus.$emit('changeVersion',{textBookId:ver.textBookId,gradeTermId:v.gradeList[0].gradeTermId})

              this.getTextBookCourseInfo()
            }
          })
        }
      })
    },

    getVersionGradeList(v, index) {
      // if(this.filter.subjectList[index].versionDone) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "subjectType": localStorage.currentSubjectType,
        yearSection: v.year,
        pageSize: 9999,
        currentPage: 1
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getVersionGradeList(params).then(res => {
        // this.$set(this.filter.subjectList[index],'versionDone',true) // 是否已加载了年级数据
        console.log('getVersionGradeList', res);
        if (res.flag) {
          for (const key in res.data) {
            v.arr.push(res.data[key])
          }

          console.log(v.arr,'v.arr');

          return
          
      
          v.arr = res.textbookVersionList
          v.arr.forEach((ver, i) => {
            if (!i) {
              this.textItem = ver
              this.$set(ver, 'active', true)
            }

            // this.$set(ver,'child',JSON.parse(JSON.stringify(v.gradeList)))
            if (!index && !i) {
              this.$set(v.gradeList[0], 'check', true)
              this.$emit('update:label', ver.textBookName + v.gradeList[0].gradeTermName)
              this.$emit('update:gradeTerm', v.gradeList[0].grade + '|' + v.gradeList[0].term)

              this.gradeTermItem = v.gradeList[0]
              // eventBus.$emit('changeVersion',{textBookId:ver.textBookId,gradeTermId:v.gradeList[0].gradeTermId})

              this.getTextBookCourseInfo()
            }
          })
        }
      })
    },
    async confirm() {
      this.textItem = this.versionList[this.yearIndex].arr.find(v => v.active)
      this.gradeTermItem = this.versionList[this.yearIndex].gradeList.find(v => v.check)
      console.log(this.textItem, this.gradeTermItem, '....');
      // eventBus.$emit('changeVersion',{
      //   textBookId: textItem.textBookId,
      //   gradeTermId: gradeTermItem.gradeTermId})

      this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
      this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)
      this.getTextBookCourseInfo()
      this.show = false
    },
    closePop() {
      this.versionList = this.tempList
      this.index = this.tempIndex
      this.show = false
    },
    handleSelect(item) {
      if (item.check) return
      this.versionList[this.yearIndex].gradeList.forEach(v => {
        this.$set(v, 'check', false)
      })
      this.$set(item, 'check', true)
    },
    selectParent(item, index) {
      this.index = index
      if (item.active) return
      this.versionList[this.yearIndex].arr.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      // this.$emit('selectParent', index)
    },


  }
}
</script>

<style lang="less" scoped>
.res-filter-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    flex: 0 0 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    &-tab {
      flex: 1;
      text-align: center;
      position: relative;

      span {
        font-weight: bold;
        font-size: 18px;
        color: #666;

        &:last-child {
          margin-right: 0;
        }

        &.active {
          color: @blue;
          font-size: 18px;
        }
      }

      .icon-close {
        font-size: 22px;
        color: #ccc;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  &__body {
    display: flex;
    flex: 1;

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
