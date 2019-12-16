<template>
  <!--    复习套卷-年级学科-->
  <van-popup v-model="show" :close-on-click-overlay="false" round position="bottom" :style="{ height: '93%' }">
    <div class="grade-pop-wrap">
      <van-icon @click="closePop" class="close" name="close" />
      <div class="grade-pop-wrap__subject van-hairline--bottom">
        <span v-for="(item, index) in subject" :key="index" :class="[{ blue: item.active }]" @click="handleSelectSubject(item)">{{ item.name }}</span>
      </div>
      <div class="grade-pop-wrap__body">

        <div class="grade-pop-wrap__body-left">
          <div @click="selectGradeParent(item,index)" v-for="(item,index) in gradeSubjectList" :key="index" :class="{active:item.active}">{{item.name}}
          </div>
        </div>

        <div class="grade-pop-wrap__body-right">
          <div class="" v-for="(item,index) in gradeSubjectList[gradeIndex].child" :key="index">
            <div @click="handleSelectGrade(item)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:item.check}]">{{item.name}}
                <van-icon v-show="item.check" class="check blue" name="success" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grade-pop-wrap__footer">
        <van-button class="btn" type="info" @click="confirm(1)">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'yearSubject',
  props: ['visible', 'label', 'gradeTerm', 'courseIds'],
  data() {
    return {
      index: 0,
      yearIndex: 0,
      // versionList: [
      //   { year: 'Y01', arr: [], gradeList: [] },
      //   { year: 'Y02', arr: [], gradeList: [] },
      //   { year: 'Y03', arr: [], gradeList: [] },
      // ], 
      yearSubjectList: { year: '', arr: [] },
      tempList: [],
      tempIndex: 0,

      textBookId: '',
      gradeTermId: '',
      subjectType: '',

      textItem: '',
      gradeTermItem: '',
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.tempIndex = this.index
        // this.tempList = JSON.parse(JSON.stringify(this.versionList))
      }
    },
  },
  created() {
    console.log('yearSubjectfilter created');
  },
  methods: {
    closePop() {
      this.yearSubjectList = this.tempList
      this.index = this.tempIndex
      this.show = false
    },
    openGradePop() {
      this.gradePop = true;
      this.gradeIndex = this.gradeOldIndex
      this.$set(this.gradeSubjectList[this.gradeIndex], "active", true);
      if (this.gradeIndex2 >= 0) {
        this.$set(this.gradeSubjectList[this.gradeIndex].child[this.gradeIndex2], "active", true);
      }
    },

    selectGradeParent(item, index) {
      this.gradeIndex = index
      if (item.active) return
      this.gradeSubjectList.forEach(v => {
        this.$set(v, 'active', false)
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        });
      })
      this.$set(item, 'active', true)
      // 默认选中第一个
      // this.$set(item.child[0], 'check', true)
    },
    handleSelectGrade(item) {
      if (item.check) return
      this.gradeSubjectList.forEach(v => {
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        });
      })
      this.$set(item, 'check', true)

    },
    confirm(flag) {
      if (flag) {

        // this.$dialog
        //   .confirm({
        //     title: "提示",
        //     message: "是否进行科目的切换？科目切换后，首页的科目也将进行切换",
        //     confirmButtonColor: "#39F0DD",
        //     className: "change-subject"
        //   })
        //   .then(() => {
        //     // on confirm
        //     for (let key in this.classList) {
        //       if (this.classList[key].active) {
        //         this.classIndex = key * 1;
        //         break;
        //       }
        //     }
        //     this.subjectPop = false;

        //   })
        //   .catch(() => {
        //     // on cancel
        //   });

        let gradeIndex2 = this.gradeSubjectList[this.gradeIndex].child.findIndex(ele => ele.check)

        if (gradeIndex2 < 0) {
          this.$toast('请选择')
          return
        }

        this.gradePop = false
        this.gradeIndex2 = gradeIndex2
        this.gradeOldIndex = this.gradeIndex

        this.filter.grade = this.gradeSubjectList[this.gradeIndex].name + "-" + this.gradeSubjectList[this.gradeIndex].child[this.gradeIndex2].name

      } else {
        let arr = []
        let index = ''
        this.moreList.forEach(ele => {
          index = ele.findIndex(v => v.active)
          arr.push(index)
          // if (index >= 0) {
          //   arr.push(index)
          // }
        })
        console.log(arr, 'arr');
        if (arr.length) {
          this.moreIndex = arr
          if (this.moreList[0][this.moreIndex[0]]) {
            this.filter.more = this.moreList[0][this.moreIndex[0]].name
          }
          if (this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = this.moreList[1][this.moreIndex[1]].name
          }
          if (this.moreList[0][this.moreIndex[0]] && this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = this.moreList[0][this.moreIndex[0]].name + '，' + this.moreList[1][this.moreIndex[1]].name
          }
          if (!this.moreList[0][this.moreIndex[0]] && !this.moreList[1][this.moreIndex[1]]) {
            this.filter.more = ''
          }

        } else {
          this.moreIndex = ''
        }

        this.morePop = false;

      }
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