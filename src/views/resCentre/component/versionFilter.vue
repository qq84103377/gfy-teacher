<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>教材</span>
          <van-icon class="icon-close" @click="closePop" name="close"/>
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in versionList" :key="index"
               :class="{active:item.active}">{{item.textBookName}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div v-if="versionList[index]">
            <div class=""  v-for="(grade,ci) in versionList[index].gradeList" :key="ci">
              <div @click="handleSelect(grade)" class="van-hairline--bottom">
                <div :class="['cell__item',{active:grade.check}]">{{grade.gradeTermName}}
                  <van-icon v-show="grade.check" class="check blue" name="success"/>
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
  import {Dialog} from 'vant';
  import {getTextBookVersionInfo, getGradeTermInfo, getVersionGradeList} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "versionFilter",
    props: ['visible','label','gradeTerm'],
    data() {
      return {
        index: 0, //选中版本的index
        yearIndex: 0,
        // versionList: [
        //   {year:'Y01',arr:[],gradeList:[]},
        //   {year:'Y02',arr:[],gradeList:[]},
        //   {year:'Y03',arr:[],gradeList:[]},
        // ],
        versionList: [],
        tempList: [],
        tempIndex: 0,
        subjectType: ''
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
          eventBus.$emit('hideNav',true)
        }
      },
    },
    watch: {
      visible(v) {
        if (v) {
          eventBus.$emit('hideNav',false)
          this.tempIndex = this.index
          this.tempList = JSON.parse(JSON.stringify(this.versionList))
        }
      }
    },
   created() {
     // const classMap = JSON.parse(localStorage.classMap)
     // this.versionList.forEach(async (v,i) => {
     //   if(v.year === classMap[Object.keys(classMap)[0]].classYearSection) {
     //     this.yearIndex = i
     //   }
     //   await this.getGradeTermInfo(v)
     //    this.getTextBookVersionInfo(v,i)
     //  })
    },
    mounted() {
      eventBus.$off("changeYear")
      eventBus.$on("changeYear", (yearIndex,subjectType) => {
        this.yearIndex = yearIndex
        this.subjectType = subjectType
        this.getVersionGradeList()
        // this.$set(this.versionList[this.yearIndex].gradeList[0],'check',true)
        // const gradeItem = this.versionList[this.yearIndex].gradeList.find(v => v.check)
        // const textItem = this.versionList[this.yearIndex].arr.find(v => v.active)
        // this.$emit('update:label',textItem.textBookName + gradeItem.gradeTermName)
        // this.$emit('update:gradeTerm',gradeItem.grade + '|' + gradeItem.term)
        // eventBus.$emit('changeVersion',{
        //   textBookId: textItem.textBookId,
        //   gradeTermId: gradeItem.gradeTermId},{subjectType})
      })
    },
    methods: {
      getVersionGradeList() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          yearSection: this.yearIndex==2?'Y03':(this.yearIndex==1?'Y02':'Y01'),
          subjectType: this.subjectType
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getVersionGradeList(params).then(res => {
          if(res.flag) {
            this.versionList = Object.keys(res.data).map(v => {
              return {...res.data[v]}
            })
            this.$set(this.versionList[0],'active',true)
            this.$set(this.versionList[0].gradeList[0],'check',true)
            this.$emit('update:label',this.versionList[0].textBookName + this.versionList[0].gradeList[0].gradeTermName)
            this.$emit('update:gradeTerm',this.versionList[0].gradeList[0].grade + '|' + this.versionList[0].gradeList[0].term)
            eventBus.$emit('changeVersion',{
              textBookId: this.versionList[0].textBookId,
              gradeTermId: this.versionList[0].gradeList[0].gradeTermId},{subjectType:this.subjectType})
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
          if(res.flag) {
            v.gradeList = res.resGradeTermList
          }
        })
      },
      getTextBookVersionInfo(v,index) {
        // if(this.filter.subjectList[index].versionDone) return
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          yearSection:v.year,
          pageSize: 9999,
          currentPage: 1
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTextBookVersionInfo(params).then(res => {
          // this.$set(this.filter.subjectList[index],'versionDone',true) // 是否已加载了年级数据
          if(res.flag) {
            v.arr = res.textbookVersionList
            v.arr.forEach((ver,i) => {
              if(!i) this.$set(ver,'active',true)
              // this.$set(ver,'child',JSON.parse(JSON.stringify(v.gradeList)))
              if((index == this.yearIndex) && !i) {
                this.$set(v.gradeList[0],'check',true)
                this.$emit('update:label',ver.textBookName + v.gradeList[0].gradeTermName)
                this.$emit('update:gradeTerm',v.gradeList[0].grade + '|' + v.gradeList[0].term)
                eventBus.$emit('changeVersion',{textBookId:ver.textBookId,gradeTermId:v.gradeList[0].gradeTermId})
              }
            })
          }
        })
      },
      confirm() {
        const textItem = this.versionList.find(v => v.active)
        const gradeTermItem = textItem.gradeList.find(v => v.check)
        eventBus.$emit('changeVersion',{
          textBookId: textItem.textBookId,
          gradeTermId: gradeTermItem.gradeTermId},{subjectType:this.subjectType})
        this.$emit('update:label',textItem.textBookName + gradeTermItem.gradeTermName)
        this.$emit('update:gradeTerm',gradeTermItem.grade + '|' + gradeTermItem.term)
        this.show = false
      },
      closePop() {
        this.versionList = this.tempList
        this.index = this.tempIndex
        this.show = false
      },
      handleSelect(item) {
        if (item.check) return
        this.versionList[this.index].gradeList.forEach(v => {
            this.$set(v,'check',false)
        })
        this.$set(item, 'check', true)
      },
      selectParent(item, index) {
        this.index = index
        if (item.active) return
        this.versionList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        item.gradeList.forEach((v,i) => {
          this.$set(v,'check',i===0)
        })
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
