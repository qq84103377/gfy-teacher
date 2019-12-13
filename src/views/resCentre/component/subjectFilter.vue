<template>
  <van-popup get-container="#app" v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>科目</span>
          <van-icon class="icon-close" @click="closePop" name="close" />
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in subjectList" :key="index" :class="{active:item.active}">{{item.name}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div class="" v-for="(child,ci) in subjectList[index].child" :key="ci">
            <div @click="handleSelect(child)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:child.check}]">{{child.subjectName}}
                <van-icon v-show="child.check" class="check blue" name="success" />
              </div>
              <!--              <div v-if="!item.tchCourseInfo.sysCourseId" class="fs12 red tip">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」-->
              <!--              </div>-->
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
import { getSubjectType, getExamSectionTypeRelation, getVersionGradeList, getTextBookCourseInfo } from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "subjectFilter",
  props: ['visible', 'label', 'types',],
  data() {
    return {
      index: 0,
      subjectList: [
        { name: '小学', value: 'Y01', active: false, child: [] },
        { name: '初中', value: 'Y02', active: false, child: [] },
        { name: '高中', value: 'Y03', active: false, child: [] },
      ],
      tempList: [],
      tempIndex: 0,

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
        this.tempList = JSON.parse(JSON.stringify(this.subjectList))
      }
    }
  },
  created() {
    this.$store.commit('setFilterSubjectLabel', null)
    const classMap = JSON.parse(localStorage.classMap)
    let year = ''
    for(let k in classMap) {
      const index = classMap[k].teacherInfoList.findIndex(t => t.subjectType === localStorage.currentSubjectType)
      if(index > -1) {
        year = classMap[k].classYearSection
        break
      }
    }

    this.subjectList.forEach((v, i) => {
      if (v.value === year) {
        v.active = true
        this.index = i
      }
      this.getSubjectType(i)
    })
  },
  methods: {
    getSubjectType(index = 0) {
      // if(this.filter.subjectList[index].done) return
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        yearSection: this.subjectList[index].value,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getSubjectType(params).then(async res => {
        // this.$set(this.filter.subjectList[index],'done',true) // 是否已加载了数据
        if (res.flag) {
          //由于目前后台还没有做权限控制,所以前台先将年级对应的科目筛选,过滤掉多余的科目
          this.subjectList[index].child = res.resSubjectTypeInfoList.filter(v => {
            if (index == 0) {
              return ['S01', 'S02', 'S03'].includes(v.subjectType)
            } else if (index == 1 || index == 2) {
              return ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09'].includes(v.subjectType)
            }
          })
          if (index === this.index) {
            const subjectIndex = this.subjectList[index].child.findIndex(v => v.subjectType === localStorage.currentSubjectType)
            this.$emit('update:label', this.subjectList[index].name + this.subjectList[index].child[subjectIndex].subjectName)
            this.$set(this.subjectList[index].child[subjectIndex], 'check', true)
            eventBus.$emit('changeSubject', this.subjectList[index].child[subjectIndex].subjectType)

            

            this.$store.commit('setVanLoading', true)
            this.$store.commit('setFilterYear', this.subjectList[this.index].value)
            this.$store.commit('setFilterSubject', this.subjectList[this.index].child[subjectIndex].subjectType)
            this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + this.subjectList[index].child[subjectIndex].subjectName)

            if (this.types) {
              this.getExamSectionTypeRelation(this.subjectList[index].child[subjectIndex].subjectType)


              // await this.getVersionGradeList(this.subjectList[index].value, this.subjectList[index].child[subjectIndex].subjectType)


            }

          }
        }
      })
    },

    confirm() {
      const item = this.subjectList[this.index].child.find(v => v.check)
      if (item) {
        if (this.index !== this.tempIndex) {
          //切换过学年
          eventBus.$emit('changeYear', this.index, item ? item.subjectType : '')
          this.$emit('update:label', this.subjectList[this.index].name + (item ? item.subjectName : ''))

          this.$store.commit('setVanLoading', true)
          this.$store.commit('setFilterYear', this.subjectList[this.index].value)
          this.$store.commit('setFilterSubject', item.subjectType)
          this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + (item ? item.subjectName : ''))

        } else {
          //没有切换学年,只切换学科
          eventBus.$emit('changeSubject', item ? item.subjectType : '')
          this.$emit('update:label', this.subjectList[this.index].name + (item ? item.subjectName : ''))
          
          this.$store.commit('setVanLoading', true)
          this.$store.commit('setFilterSubject', item.subjectType)
          this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + (item ? item.subjectName : ''))
        }
      } else {
        return this.$toast('请选择科目')
      }
      this.show = false
    },
    closePop() {
      // this.subjectList = this.tempList
      // this.index = this.tempIndex
      this.show = false
    },
    handleSelect(item) {
      if (item.check) return

      if (item.subjectType !== localStorage.currentSubjectType) {
        this.$dialog.confirm({
          title: '提示',
          message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换'
        }).then(() => {
          this.subjectList.forEach(v => {
            v.child.forEach(c => {
              this.$set(c, 'check', false)
            })
          })
          this.$set(item, 'check', true)
          localStorage.setItem("currentSubjectTypeName", item.subjectName);
          localStorage.setItem("currentSubjectType", item.subjectType);

          if (this.types) {
            this.getExamSectionTypeRelation(item.subjectType)
          }
        }).catch(() => {

        })
      } else {
        this.subjectList.forEach(v => {
          v.child.forEach(c => {
            this.$set(c, 'check', false)
          })
        })
        this.$set(item, 'check', true)
      }

    },
    selectParent(item, index) {
      this.index = index
      if (item.active) return
      this.subjectList.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      const childIndex = this.subjectList[index].child.findIndex(v => v.subjectType === localStorage.currentSubjectType)
      if (childIndex > -1) {
        //如果切换后的年级刚好有切换前的科目,则选中
        this.subjectList.forEach(v => {
          v.child.forEach(c => {
            this.$set(c, 'check', false)
          })
        })
        this.$set(this.subjectList[index].child[childIndex], 'check', true)
      }
      // this.$set(item.child[0],'check',true)
      // this.$emit('selectParent', index)
    },

    getExamSectionTypeRelation(currentSubjectType) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "currPage": 1,
        "pageSize": 999,
        "examSectionTypeRlation": {
          "seqId": null,//编号可空
          "subjectType": currentSubjectType, //学科（课程时由课程信息获取，资源中心时有所选学科获取）
          "examType": null,//题型，可空
          "sectionType": null //章节类型，可空
        }
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getExamSectionTypeRelation(params).then(res => {
        if (res.flag) {
          // this.questionTypeList = res.examSectionTypeRlationList
          this.$emit('update:types', res.examSectionTypeRlationList)
        }
      })
    },

    getVersionGradeList(yearSection, subjectType) {
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
        // this.$set(this.filter.subjectList[index],'versionDone',true) // 是否已加载了年级数据
        console.log('getVersionGradeList', res);

        let list = { year: '', arr: [], gradeList: [] }

        if (res.flag) {
          for (const key in res.data) {
            list.arr.push(res.data[key])
          }

          list.year = yearSection


          console.log(List.arr, 'List.arr');
          console.log(List, 'List');


          list.arr.forEach((ver, i) => {
            if (!i) {
              this.textItem = ver
              this.$set(ver, 'active', true)
            }

            if (!i) {
              this.$set(List.arr[0].gradeList[0], 'check', true)
              this.$emit('update:versionLabel', list.arr[0].textBookName + list.arr[0].gradeList[0].gradeTermName)
              this.$emit('update:versionGradeTerm', list.arr[0].gradeList[0].grade + '|' + list.arr[0].gradeList[0].term)
              this.$emit('update:versionList', list.arr[0].gradeList[0].grade + '|' + list.arr[0].gradeList[0].term)

              this.gradeTermItem = list.arr[0].gradeList[0]
              this.textItem = list.arr[0]
              // eventBus.$emit('changeVersion',{textBookId:ver.textBookId,gradeTermId:v.gradeList[0].gradeTermId})

              this.getTextBookCourseInfo()
            }
          })
        }
      })
    },

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
            newArr = newArr = Array.from(new Set(newArr))
            // console.log(courseIds, 'courseIds');

            this.$emit('update:courseIds', newArr)

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
            // if (this.courseList.length) {
            //   const item = this.courseList[0]
            //   if (item.childNodeList && item.childNodeList.length > 0) {
            //     this.$set(item, 'fold', true)
            //     this.selectSysCourse(item.childNodeList[0].courseId, item.childNodeList[0].nodeName)
            //   } else {
            //     this.$set(item, 'fold', true)
            //     this.selectSysCourse(item.courseId, item.nodeName)
            //   }
            // }
            // this.$emit('filter', this.currentSysCourseId)
            // // this.$emit('update:label',(this.unitList[this.unitIndex]&&this.unitList[this.unitIndex].courseList)?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
            // this.$emit('update:label', this.currentSysCourseName)

          }
        } else {
          // this.$toast(res.msg)
          this.courseList = []
          this.unitList = []
          this.unitIndex = 0
          // this.selectSysCourse('', '')
          // this.$emit('filter', this.currentSysCourseId)
          // // this.$emit('update:label',this.unitList[this.unitIndex]?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
          // this.$emit('update:label', this.currentSysCourseName)

        }

      })
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
