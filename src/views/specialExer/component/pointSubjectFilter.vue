<template>
  <van-popup get-container="#app" v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '93%' }">
    <div class="grade-pop-wrap">
      <van-icon @click="closePop" class="close" name="close" />
      <div class="grade-pop-wrap__title van-hairline--bottom">科目</div>
      <div class="grade-pop-wrap__body">
        <van-cell @click="handleSelect(item)" v-for="(item,index) in subjectList" :key="index">
          <div slot="title" class="aic jcsb" :class="[{active:item.active}]"><span>{{item.name}}</span>
            <van-icon v-if="item.active" class="blue" name="success" />
          </div>
        </van-cell>
      </div>
      <div class="grade-pop-wrap__footer">
        <van-button class="btn" type="info" @click="confirm()">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Dialog } from 'vant';
import { getSubjectType, getExamSectionTypeRelation } from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "pointSubjectFilter",
  props: ['visible', 'label', 'active', 'subjectType'],
  data() {
    return {
      subjectList: [
        { name: '小学', value: 'Y01', active: false, child: [] },
        { name: '初中', value: 'Y02', active: false, child: [] },
        { name: '高中', value: 'Y03', active: false, child: [] },
      ],
      subjectList: [],
      tempList: [],

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
        this.tempList = JSON.parse(JSON.stringify(this.subjectList))
      }
    },
    subjectType(nv, ov) {
      console.log("point subjectType nv", nv);
      console.log("point subjectType ov", ov);

      if (this.active == 1) {
        return
      }

      this.subjectList.forEach(v => {
        if (v.subjectType == nv) {
          this.$set(v, 'active', true)
        } else {
          this.$set(v, 'active', false)
        }
      })

      const subject = this.subjectList.find(v => v.active)

      this.$emit('update:label', subject.name)


      // this.getExamSectionTypeRelation(this.subjectList[this.index].child[subjectIndex].subjectType)
    }
  },
  created() {
    this.getLists()

    // this.$store.commit('setFilterSubjectLabel', null)
    return
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


    // this.$store.commit('setFilterSubjectLabel', this.subjectList[this.index].name + this.subjectList[this.index].child[subjectIndex].subjectName)


    this.tempIndex = this.index
    this.tempList = JSON.parse(JSON.stringify(this.subjectList))

    this.getExamSectionTypeRelation(this.subjectList[this.index].child[subjectIndex].subjectType)

  },
  methods: {
    getLists() {
      const classMap = JSON.parse(localStorage.classMap)
      let classMapArr = Object.values(classMap)

      console.log('classMapArr', classMapArr);

      classMapArr.forEach(ele => {
        ele.teacherInfoList.forEach(v => {
          this.subjectList.push({
            name: v.subjectName,
            subjectType: v.subjectType,
            active: v.subjectType == localStorage.currentSubjectType
          })
        })
      })

      let a = {}
      this.subjectList = this.subjectList.reduce((cur, next) => {
        a[next.subjectType] ? "" : a[next.subjectType] = true && cur.push(next);
        return cur;
      }, [])

      console.log(this.subjectList, 'this.subjectList');
      this.tempSubjectList = JSON.parse(JSON.stringify(this.subjectList))

      const item = this.subjectList.find(v => v.active)

      this.$emit('update:label', item.name)
    },
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
      const item = this.subjectList.find(v => v.active)
      if (item.subjectType == localStorage.currentSubjectType) {
        this.show = false
        return
      }

      this.$emit('update:label', item.name)

      localStorage.setItem("currentSubjectTypeName", item.subjectName);
      localStorage.setItem("currentSubjectType", item.subjectType);

      this.show = false
    },
    closePop() {
      this.subjectList = this.tempList

      this.show = false
    },
    handleSelect(item) {
      if (item.active) return

      if (item.subjectType !== localStorage.currentSubjectType) {
        this.$dialog.confirm({
          title: '提示',
          message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换'
        }).then(() => {
          this.subjectList.forEach(v => {
            this.$set(v, 'active', false)
          })
          this.$set(item, 'active', true)

        }).catch(() => {

        })
      } else {
        this.subjectList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
      }

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
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.grade-pop-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  @{deep} .active {
    color: @blue;
  }
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
</style>
