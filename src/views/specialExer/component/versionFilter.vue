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
          <div @click="selectParent(item,index)" v-for="(item,index) in versionList.arr" :key="index" :class="{active:item.active}">{{item.textBookName}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div v-if="versionList.arr[index]">
            <div class="" v-for="(grade,ci) in versionList.arr[index].gradeList" :key="ci">
              <div @click="handleSelect(grade,versionList.arr[index])" class="van-hairline--bottom">
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
import { getTextBookCourseInfo, getVersionGradeList } from '@/api/index'
import eventBus from "@/utils/eventBus";
import { mapState, mapGetters } from "vuex";

export default {
  name: "versionFilter",
  props: ['visible', 'label', 'gradeTerm', 'courseIds','subjectLabel','textBookId','gradeTermId'],
  data() {
    return {
      index: 0,
      yearIndex: 0,
      // versionList: [
      //   { year: 'Y01', arr: [], gradeList: [] },
      //   { year: 'Y02', arr: [], gradeList: [] },
      //   { year: 'Y03', arr: [], gradeList: [] },
      // ], 
      versionList: { year: '', arr: [] },
      tempList: [],
      tempIndex: 0,

      // gradeTermId: '',
      subjectType: '',

      textItem: '',
      gradeTermItem: '',

    }
  },

  computed: {
    ...(mapState({
      filterYear: state => state.setting.filterYear,
      filterSubject: state => state.setting.filterSubject,
      // filterSubjectLabel: state => state.setting.filterSubjectLabel,
    })),
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
    },
    async subjectLabel(nv, ov) {
      console.log('subjectLabel nv', nv);
      console.log('subjectLabel ov', ov);
      if (!nv) return
      this.index = 0
      this.versionList = { year: '', arr: [], gradeList: [] }
      await this.getVersionGradeList(this.filterYear, this.filterSubject)
      this.$store.commit('setVanLoading', false)
    },
  },
  created() {
    console.log('versonfilter created');
  },
  mounted() {
    console.log('subjectfilter mounted');
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
        // "textBookId": this.textItem ? this.textItem.textBookId : '',
        "textBookId": this.textBookId,
        "gradeTermId": this.gradeTermItem ? this.gradeTermItem.gradeTermId : '',
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
            newArr = newArr = Array.from(new Set(newArr))
            // console.log(courseIds, 'courseIds');
            this.$emit('update:courseIds', newArr)
          }

        }else{
          this.$emit('update:courseIds', [])
        }
        return
      })
    },

    getVersionGradeList(yearSection, subjectType) {
      this.$store.commit('setVanLoading', true)
      // if(this.filter.subjectList[index].versionDone) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        subjectType,
        yearSection,
        pageSize: 9999,
        currentPage: 1
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getVersionGradeList(params).then(res => {
        this.$store.commit('setVanLoading', false)
        // console.log('getVersionGradeList', res);
        if (res.flag) {
          for (const key in res.data) {
            this.versionList.arr.push(res.data[key])
          }

          this.versionList.year = yearSection

          if (this.versionList.arr.length > 0) {
            
            const classMap = JSON.parse(localStorage.classMap)
            let arr = []
            let arrItem, textBookId, classGrade, termType
            Object.keys(classMap).forEach(element => {
              if (classMap[element].classYearSection == yearSection) {
                if (classMap[element].classYearSection == yearSection) {
                  classMap[element].teacherInfoList.forEach((ele, i) => {
                    if (ele.subjectType == subjectType) {
                      arr.push(classMap[element])
                    }
                  })
                }
              }
            })

            if (!arr.length) {
              this.textItem = this.versionList.arr[0]
              this.$set(this.versionList.arr[0], 'active', true)

              this.gradeTermItem = this.versionList.arr[0].gradeList[0]
              this.$set(this.versionList.arr[0].gradeList[0], 'check', true)

              this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
              this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)

              this.$emit('update:textBookId', this.textItem.textBookId)
              this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

              this.getTextBookCourseInfo()
              return
            }

            arrItem = arr[0].teacherInfoList.find(ele => {
              return ele.subjectType == subjectType
            })

            if (!arrItem) {
              this.textItem = this.versionList.arr[0]
              this.$set(this.versionList.arr[0], 'active', true)

              this.gradeTermItem = this.versionList.arr[0].gradeList[0]
              this.$set(this.versionList.arr[0].gradeList[0], 'check', true)

              this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
              this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)

              this.$emit('update:textBookId', this.textItem.textBookId)
              this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

              this.getTextBookCourseInfo()

              return
            }


            textBookId = arrItem.textBookId
            classGrade = arr[0].classGrade
            termType = arr[0].termInfo[0] ? arr[0].termInfo[0].termType : ''

            if (!(textBookId && termType)) {
              this.textItem = this.versionList.arr[0]
              this.$set(this.versionList.arr[0], 'active', true)

              this.gradeTermItem = this.versionList.arr[0].gradeList[0]
              this.$set(this.versionList.arr[0].gradeList[0], 'check', true)

              this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
              this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)
              this.$emit('update:textBookId', textItem.textBookId)
              this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

              this.getTextBookCourseInfo()

              return
            }

            // console.log(textBookId, 'textBookId');
            // console.log(classGrade, 'classGrade');
            // console.log(termType, 'termType');

            let a = this.versionList.arr.findIndex(ver => ver.textBookId == textBookId)
            if (a > -1) {
              this.index = a
              this.textItem = this.versionList.arr[a]
              this.$set(this.versionList.arr[a], 'active', true)

              let b = this.versionList.arr[a].gradeList.findIndex(e => {
                return (e.termType == termType) && (e.classGrade == classGrade)
              })
              if (b > -1) {
                this.gradeTermItem = this.versionList.arr[a].gradeList[b]
                this.$set(this.versionList.arr[a].gradeList[b], 'check', true)

                this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
                this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)
                this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

                this.getTextBookCourseInfo()
              } else {
                this.gradeTermItem = this.versionList.arr[a].gradeList[0]
                this.$set(this.versionList.arr[a].gradeList[0], 'check', true)

                this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
                this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)
                this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

                this.getTextBookCourseInfo()
              }

              this.$emit('update:textBookId', this.textItem.textBookId)
            } else {
              this.textItem = this.versionList.arr[0]
              this.$set(this.versionList.arr[0], 'active', true)

              this.gradeTermItem = this.versionList.arr[0].gradeList[0]
              this.$set(this.versionList.arr[0].gradeList[0], 'check', true)

              this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
              this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)

              this.$emit('update:textBookId', this.textItem.textBookId)
              this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

              this.getTextBookCourseInfo()

            }

            return


            this.versionList.arr.forEach((ver, i) => {
              if (!i) {
                this.textItem = ver
                this.$set(ver, 'active', true)



                this.$set(this.versionList.arr[0].gradeList[0], 'check', true)
                this.$emit('update:label', this.versionList.arr[0].textBookName + this.versionList.arr[0].gradeList[0].gradeTermName)
                this.$emit('update:gradeTerm', this.versionList.arr[0].gradeList[0].grade + '|' + this.versionList.arr[0].gradeList[0].term)

                this.gradeTermItem = this.versionList.arr[0].gradeList[0]
                
                this.$emit('update:textBookId', this.textItem.textBookId)
                this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)

                this.getTextBookCourseInfo()
              }

            })
          } else {
            this.textItem = ''

            this.$emit('update:label', "")
            this.$emit('update:gradeTerm', '')

            this.$emit('update:textBookId', '')
            this.$emit('update:gradeTermId', '')

            this.gradeTermItem = ''
            this.getTextBookCourseInfo()
          }


        }
      }).catch(err => {
        this.$store.commit('setVanLoading', false)
      })
    },
    async confirm() {
      const item = this.versionList.arr[this.index].gradeList.find(v => v.check)
      if (item) {
        this.textItem = this.versionList.arr.find(v => v.active)
        this.gradeTermItem = this.versionList.arr[this.index].gradeList.find(v => v.check)

        // eventBus.$emit('changeVersion',{
        //   textBookId: textItem.textBookId,
        //   gradeTermId: gradeTermItem.gradeTermId})

        if ((this.label == (this.textItem.textBookName + this.gradeTermItem.gradeTermName)) && (this.gradeTerm == (this.gradeTermItem.grade + '|' + this.gradeTermItem.term))) {
          this.show = false
          return
        }

        this.$emit('update:label', this.textItem.textBookName + this.gradeTermItem.gradeTermName)
        this.$emit('update:gradeTerm', this.gradeTermItem.grade + '|' + this.gradeTermItem.term)
        this.getTextBookCourseInfo()
        this.$emit('update:textBookId', this.textItem.textBookId)
        this.$emit('update:gradeTermId', this.gradeTermItem.gradeTermId)
        this.show = false
      } else {
        return this.$toast('请选择年级')
      }


    },
    closePop() {
      this.versionList = this.tempList
      this.index = this.tempIndex
      this.show = false
    },
    handleSelect(item, arr) {
      if (item.check) return

      this.versionList.arr.forEach(ele => {
        ele.gradeList.forEach(v => {
          this.$set(v, 'check', false)
        })
      })

      this.$set(item, 'check', true)
    },
    selectParent(item, index) {
      this.index = index
      if (item.active) return
      this.versionList.arr.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      // this.$emit('selectParent', index)

      this.versionList.arr[index].gradeList.forEach(v => {
        this.$set(v, 'check', false)
      })

      const childIndex = this.versionList.arr[index].gradeList.findIndex(v => v.gradeTermId === this.gradeTermItem.gradeTermId)
      if (childIndex > -1) {
        //如果切换后的年级刚好有切换前的科目,则选中
        this.$set(this.versionList.arr[index].gradeList[childIndex], 'check', true)
      }
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
    overflow: hidden;

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
