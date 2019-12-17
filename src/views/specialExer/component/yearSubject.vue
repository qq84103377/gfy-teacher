<template>
  <!--    复习套卷-年级学科-->
  <van-popup v-model="show" :close-on-click-overlay="false" round position="bottom" :style="{ height: '93%' }">
    <div class="grade-pop-wrap">
      <van-icon @click="closePop" class="close" name="close" />
      <div class="grade-pop-wrap__subject van-hairline--bottom">
        <span v-for="(item, index) in subjectList" :key="index" :class="[{ blue: item.active }]" @click="handleSelectSubject(item)">{{ item.name }}</span>
      </div>
      <div class="grade-pop-wrap__body">

        <div class="grade-pop-wrap__body-left">
          <div @click="handleSelectGrade(item,index)" v-for="(item,index) in yearSubjectList" :key="index" :class="{active:item.active}">{{item.name}}
          </div>
        </div>

        <div class="grade-pop-wrap__body-right">
          <div class="" v-for="(item,index) in termList" :key="index">
            <div @click="handleSelectTerm(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.active}]">{{item.name}}
                <van-icon v-show="item.active" class="check blue" name="success" />
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
</template>

<script>
import { getMySchoolInfo } from '@/api/index'

export default {
  name: 'yearSubject',
  props: ['visible', 'label', 'grade', 'term', 'subjectList'],
  data() {
    return {
      termList: [
        { name: '上学期', value: 'S01', active: true },
        { name: '下学期', value: 'S02', active: false },
      ],
      yearSubjectList: [],
      // subject: []
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
      // if (v) {
      //   this.tempIndex = this.index
      //   // this.tempList = JSON.parse(JSON.stringify(this.versionList))
      // }
    },
  },
  async created() {
    console.log('yearSubjectfilter created');
    // this.getMySchoolInfo()
    const classMap = JSON.parse(localStorage.classMap)
    let classMapArr = Object.values(classMap)
    console.log(classMapArr, 'classMapArr');
    let res1 = classMapArr.some(ele => ele.classYearSection == "Y01")
    if (res1) {
      let garde1 = ['G01', 'G02', 'G03', 'G04', 'G05', 'G06']
      for (var i = 0; i < 6; i++) {
        this.yearSubjectList.push({ name: this.$store.state.GradeLevel[garde1[i]], value: garde1[i], active: '' })
      }
    }
    let res2 = classMapArr.some(ele => ele.classYearSection == "Y02")
    if (res2) {
      let garde2 = ['G07', 'G08', 'G09']
      for (var i = 0; i < 3; i++) {
        this.yearSubjectList.push({ name: this.$store.state.GradeLevel[garde2[i]], value: garde2[i], active: '' })
      }
    }
    let res3 = classMapArr.some(ele => ele.classYearSection == "Y03")
    if (res3) {
      let garde3 = ['G10', 'G11', 'G12']
      for (var i = 0; i < 3; i++) {
        this.yearSubjectList.push({ name: this.$store.state.GradeLevel[garde3[i]], value: garde3[i], active: '' })
      }
    }
    let first = this.yearSubjectList.some((ele, index) => {
      if (ele.value == classMapArr[0].classGrade) {
        this.yearSubjectList[index].active = true
        const termItem = this.termList.find(v => v.active)
        this.$emit('update:label', localStorage.currentSubjectTypeName + this.yearSubjectList[index].name + termItem.name)
        this.$emit('update:gradeItem', this.yearSubjectList[index].value)
        this.$emit('update:termType', termItem.value)
        return true
      }
    })
    if (!first) {
      this.yearSubjectList[0].active = true
      const termItem = this.termList.find(v => v.active)

      this.$emit('update:label', localStorage.currentSubjectTypeName + this.yearSubjectList[0].name + termItem.name)
      this.$emit('update:gradeItem', this.yearSubjectList[0].value)
      this.$emit('update:termType', termItem.value)
    }

  },
  methods: {
    closePop() {

      this.show = false
    },

    handleSelectSubject(item) {
      if (item.subjectType == localStorage.currentSubjectType) return
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否进行科目的切换？科目切换后，首页的科目也将进行切换",
          confirmButtonColor: "#39F0DD",
          className: "change-subject"
        })
        .then(() => {
          // on confirm
          this.subjectList.forEach(v => {
            this.$set(v, 'active', false)
          })
          this.$set(item, 'active', true)
          localStorage.setItem("currentSubjectTypeName", item.name);
          localStorage.setItem("currentSubjectType", item.subjectType);

          this.$emit('update:subjectList', this.subjectList)
        })
        .catch(() => {
          // on cancel
        })
    },

    handleSelectGrade(item, index) {
      this.gradeIndex = index
      if (item.active) return
      this.yearSubjectList.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      // 默认选中第一个
      // this.$set(item.child[0], 'check', true)
    },
    handleSelectTerm(item) {
      if (item.check) return
      this.termList.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
    },
    confirm() {
      const gradeItem = this.yearSubjectList.find(v => v.active)
      const termItem = this.termList.find(v => v.active)
      this.$emit('update:label', localStorage.currentSubjectTypeName + gradeItem.name + termItem.name)
      this.$emit('update:gradeItem', gradeItem.value)
      this.$emit('update:termType', termItem.value)
      this.show = false

      return
    },
    //获取学校信息
    async getMySchoolInfo() {
      let obj = {
        interUser: "runLfb",
        interPwd: "25d55ad283aa400af464c76d713c07ad",
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        userType: this.$store.getters.getUserInfo.roleType,
        accountNo: this.$store.getters.getUserInfo.accountNo
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getMySchoolInfo(params).then(res => {
        console.log('getMySchoolInfo', res)
        if (res.flag && res.data.length > 0) {
          console.log("?");
          let schoolList = res.data[0].schoolList;
          let length = schoolList.length;
          this.schoolList = schoolList.map(item => {
            return { name: item.schoolName }
          })
          this.schoolName = this.schoolList[0] ? this.schoolList[0].name : '';
          console.log("??");
          // 获取老师科目列表，去重后
          for (let i = 0; i < length; i++) {
            let gradeList = schoolList[i].classGradeList;
            let gradeLen = gradeList.length;
            console.log("???");
            for (let j = 0; j < gradeLen; j++) {
              let subjectList = gradeList[j].subjectList;
              let arr = subjectList.map(item => {
                let obj = {
                  name: item.subjectName,
                  subjectType: item.subjectType
                }
                if (item.subjectName == localStorage.getItem("currentSubjectTypeName")) {
                  obj.active = true
                } else {
                  obj.active = false
                }
                return obj;
              })
              this.subject = Array.from(new Set([...this.subject, ...arr]));
            }
          }
          console.log("????");

          console.log(this.subject, 'this.subject ');

          // 去重
          let a = {}
          this.subject = this.subject.reduce((cur, next) => {
            a[next.subjectType] ? "" : a[next.subjectType] = true && cur.push(next);
            return cur;
          }, [])

          console.log(this.subject, 'this.subject 11111');

          // this.filter.subject = localStorage.getItem("currentSubjectTypeName")

        }
      })
    },

  },

}
</script>

<style lang='less' scoped>
.grade-pop-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &__body__group {
    background: #fff;
    font-size: 14px;
    border-radius: 5px;
    margin-bottom: 10px;

    &-wrap {
      padding-left: 21px;
      display: flex;
      flex-wrap: wrap;

      &-item {
        flex: 0 0 79px;
        line-height: 37px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 8px;
        margin-bottom: 10px;
        background-color: #f5f5f5;
        color: #333;
        text-align: center;
        border: 1px solid transparent;
        border-left-width: 1px !important;

        &:nth-child(4n) {
          margin-right: 0;
        }

        &.active {
          border-color: @blue;
          background-color: #e0fffc !important;
        }
      }
    }
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
    font-weight: 700;
  }

  &__subject {
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    padding: 0 40px 0 20px;
    // display: flex;
    // justify-content: space-around;
    font-weight: 700;
    overflow-x: scroll;
    white-space: nowrap;

    > span {
      margin-left: 5px;
      margin-right: 10px;
    }
  }

  &__body {
    display: flex;
    flex: 1;
    // overflow-y: auto;

    &-left {
      flex: 1 1 20%;
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
      flex: 1 1 80%;
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
  &__body-more {
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