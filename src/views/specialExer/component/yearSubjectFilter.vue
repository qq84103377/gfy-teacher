<template>
  <van-popup v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>科目</span>
          <van-icon class="icon-close" @click="closePop" name="close" />
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in subjectList" v-if='subjectList[index].child.length' :key="index" :class="{active:item.active}">{{item.name}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div class="" v-if='subjectList[index].child.length' v-for="(child,ci) in subjectList[index].child" :key="ci">
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
import { getSubjectType, getExamSectionTypeRelation } from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "yearSubjectFilter",
  props: ['visible', 'label', 'types', 'subjectType', 'active', 'start', 'toggleNum', 'onRefresh'],
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
      isChange: false
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
    },
    start(nv, ov) {
      console.log("start nv", nv);
      console.log("start ov", ov);
      if (nv) {
        if (this.isChange) {
          this.isChange = false
          this.getExamSectionTypeRelation(this.subjectType)
        }
        this.$emit('update:start', false)
        this.$parent.startTypes = false
      }
    },
    async onRefresh(nv, ov) {
      console.log("onRefresh1 nv", nv);
      console.log("onRefresh1 ov", ov);
      if (nv) {
        this.isChange = false
        await this.getExamSectionTypeRelation(this.subjectType)
        this.$emit('update:onRefresh', false)
        this.$parent.isLoading = false
      }
    },
    subjectType(nv, ov) {
      console.log("year subjectType nv", nv);
      console.log("year subjectType ov", ov);

      // return

      this.subjectList[this.index].child.forEach((v, i) => {
        v.check = false
        if (v.subjectType === nv) {
          v.check = true
        }
      })

      const subjectIndex = this.subjectList[this.index].child.findIndex(v => v.subjectType === localStorage.currentSubjectType)
      this.$emit('update:label', this.subjectList[this.index].name + this.subjectList[this.index].child[subjectIndex].subjectName)

      this.$set(this.subjectList[this.index].child[subjectIndex], 'check', true)

      this.$store.commit('setFilterYear', this.subjectList[this.index].value)
      this.$store.commit('setFilterSubject', this.subjectList[this.index].child[subjectIndex].subjectType)

      this.isChange = true

      if (this.active != 0) return

      this.getExamSectionTypeRelation(this.subjectList[this.index].child[subjectIndex].subjectType)
    }
  },
  created() {
    console.log('year subjectType   create')

    this.getSubjectList()
    const classMap = JSON.parse(localStorage.classMap)
    let year = ''
    for (let k in classMap) {
      const index = classMap[k].teacherInfoList.findIndex(t => t.subjectType === localStorage.currentSubjectType)
      if (index > -1) {
        year = classMap[k].classYearSection
        break
      }
    }

    this.subjectList.forEach((v, i) => {
      if (v.value === year) {
        v.active = true
        this.index = i
      }
    })

    const subjectIndex = this.subjectList[this.index].child.findIndex(v => v.subjectType === localStorage.currentSubjectType)
    this.$emit('update:label', this.subjectList[this.index].name + this.subjectList[this.index].child[subjectIndex].subjectName)

    this.$set(this.subjectList[this.index].child[subjectIndex], 'check', true)

    this.$store.commit('setFilterYear', this.subjectList[this.index].value)
    this.$store.commit('setFilterSubject', this.subjectList[this.index].child[subjectIndex].subjectType)


    this.tempIndex = this.index
    this.tempList = JSON.parse(JSON.stringify(this.subjectList))

    if (this.active != 0) return

    this.getExamSectionTypeRelation(this.subjectList[this.index].child[subjectIndex].subjectType)

  },
  methods: {
    // 获取该老师学科列表
    getSubjectList() {
      const classMap = JSON.parse(localStorage.classMap)
      let list1 = [], list2 = [], list3 = []
      for (let k in classMap) {
        classMap[k].teacherInfoList.forEach(ele => {
          if (classMap[k].classYearSection == "Y01") {
            list1.push(ele)
          } else if (classMap[k].classYearSection == "Y02") {
            list2.push(ele)

          } else if (classMap[k].classYearSection == "Y02") {
            list3.push(ele)
          }
        })
      }

      let newobj1 = {};
      list1 = list1.reduce((preVal, curVal) => {
        newobj1[curVal.subjectType] ? '' : newobj1[curVal.subjectType] = preVal.push(curVal);
        return preVal
      }, [])


      let newobj2 = {};
      list2 = list2.reduce((preVal, curVal) => {
        newobj2[curVal.subjectType] ? '' : newobj2[curVal.subjectType] = preVal.push(curVal);
        return preVal
      }, [])

      let newobj3 = {};
      list3 = list3.reduce((preVal, curVal) => {
        newobj3[curVal.subjectType] ? '' : newobj3[curVal.subjectType] = preVal.push(curVal);
        return preVal
      }, [])


      // console.log('list1//', list1);
      // console.log('list2//', list2);
      // console.log('list3//', list3);


      this.subjectList[0].child = list1
      this.subjectList[1].child = list2
      this.subjectList[2].child = list3

    },

    confirm() {
      const item = this.subjectList[this.index].child.find(v => v.check)
      if (item) {
        if (this.index !== this.tempIndex) {
          //切换过学年

          this.$emit('update:label', this.subjectList[this.index].name + (item ? item.subjectName : ''))
          if (this.types) {
            this.$store.commit('setVanLoading', true)
            this.$store.commit('setFilterYear', this.subjectList[this.index].value)
            this.$store.commit('setFilterSubject', item.subjectType)
            // this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + (item ? item.subjectName : ''))
          }
        } else {
          if (item.subjectType == localStorage.currentSubjectType) {
            this.show = false
            return
          }

          //没有切换学年,只切换学科


          this.$emit('update:label', this.subjectList[this.index].name + (item ? item.subjectName : ''))
          if (this.types) {

            // this.$store.commit('setVanLoading', true)
            this.$store.commit('setFilterSubject', item.subjectType)
            // this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + (item ? item.subjectName : ''))
            this.$emit('update:subjectType', item.subjectType)


            if (this.active == 0) {
              this.getExamSectionTypeRelation(item.subjectType)

            }
          }
        }
        localStorage.setItem("currentSubjectTypeName", item.subjectName);
        localStorage.setItem("currentSubjectType", item.subjectType);
      } else {
        return this.$toast('请选择科目')
      }
      this.show = false
    },
    closePop() {
      this.subjectList = this.tempList
      this.index = this.tempIndex
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

          // localStorage.setItem("currentSubjectTypeName", item.subjectName);
          // localStorage.setItem("currentSubjectType", item.subjectType);

          // if (this.types) {
          //   this.$emit('update:subjectType', item.subjectType)

          //   this.getExamSectionTypeRelation(item.subjectType)
          // }
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

    // 获取题型列表
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
