<template>
  <section class="knowledge-point-wrap">
    <van-cell title="总复习" class="fs16" style="background: #f5f5f5;color: #999" />
    <div class="null-box" v-if="isRecomment&&list.length">
      <!-- <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt /> -->
      <p class="fs12" style="text-align: center;color: #999999">本地区无相关知识点，推荐使用以下知识点</p>
    </div>
    <div class="null-box" v-if="isRecomment&&!list.length">
      <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
      <p class="fs12" style="text-align: center;color: #999999">本地区无相关知识点</p>
    </div>
    <div class="knowledge-point-wrap__tab" v-if='list.length'>
      <div class="knowledge-point-wrap__tab__wrap">
        <div v-for='(item,index) in list' :key='item.nodeName' class='mglt10 mgr10' :class="{knowledgeActive:item.active}" @click="toggleTab(item,index)">{{item.nodeName}}</div>
      </div>
      <div class="knowledge-point-wrapp__tab__content">
        <myCollapse v-if='list[listIndex].child.length' :data.sync='list[listIndex]' @goPage='go'></myCollapse>
        <div class="null-box" v-else>
          <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
          <p class="fs12" style="text-align: center;color: #999999">本知识点，暂无分知识点</p>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import { getTextBookCourseInfo, getKnowledgeCatalogInfo } from '@/api/index'
import myCollapse from './myCollapse'

export default {
  name: "knowledgePoint",
  props: ['start', 'classGrade', 'areaCode', 'courseIds', 'active', 'textBookId', 'gradeTermId', 'toggleNum', 'onRefresh', 'subjectType'],
  data() {
    return {
      list: [],
      listIndex: 0,
      classList: ['row1', 'row2', 'row3', 'row4', 'row5'],
      classIndex: -1,
      toggleFirst: false,
      isRecomment: false,
      isChange: false,
      courseIds2: []
    }
  },
  components: {
    myCollapse
  },
  watch: {
    async start(nv, ov) {
      console.log("start nv", nv);
      console.log("start ov", ov);
      if (nv) {

        if (this.toggleNum == 1) {
          this.toggleFirst = true
          this.isChange = false

          this.toggleFirst = true
          await this.getTextBookCourseInfo()
          await this.getKnowledgeCatalogInfo()

          this.$emit('update:start', false)
        } else {
          if (this.isChange) {
            this.isChange = false
            this.list = []
            this.listIndex = 0
            this.isRecomment = false
            this.classIndex = -1
            await this.getTextBookCourseInfo()
            await this.getKnowledgeCatalogInfo()
          }
          this.$emit('update:start', false)
          this.$parent.startKnowledge = false
        }

      }
    },
    async onRefresh(nv, ov) {
      console.log("onRefresh2 nv", nv);
      console.log("onRefresh2 ov", ov);
      if (nv) {
        this.isChange = false
        await this.getTextBookCourseInfo()
        await this.getKnowledgeCatalogInfo()
        this.$emit('update:onRefresh', false)
        this.$parent.$parent.isLoading = false
      }
    },
    // courseIds(nv, ov) {
    //   console.log("courseIds nv", nv);
    //   console.log("courseIds ov", ov);
    //   if (nv) {
    //     this.isChange = true
    //     if (this.active != 1) return
    //     this.isChange = false
    //     this.list = []
    //     this.listIndex = 0
    //     this.isRecomment = false
    //     this.classIndex = -1
    //     this.getKnowledgeCatalogInfo()
    //   }
    // },
    async subjectType(nv, ov) {
      console.log("subjectType nv", nv);
      console.log("subjectType ov", ov);
      if (nv) {
        this.isChange = true
        if (this.active != 1) return
        this.isChange = false
        this.list = []
        this.listIndex = 0
        this.isRecomment = false
        this.classIndex = -1
        await this.getTextBookCourseInfo()
        this.getKnowledgeCatalogInfo()
      }
    },

  },
  created() {
    // console.log("没出现")
    // this.getTextBookCourseInfo()
  },
  methods: {
    // 获取教材信息courseId
    async getTextBookCourseInfo() {
      this.$store.commit('setVanLoading', true)
      this.unitIndex = 0
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        // "textBookId": this.textItem ? this.textItem.textBookId : '',
        "textBookId": '3002',
        "gradeTermId": '2007',
        "subjectType": localStorage.currentSubjectType,
        'nodeType': 'N00'
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }

      getTextBookCourseInfo(params).then(res => {
        this.$store.commit('setVanLoading', false)
        console.log("课程2：", res)
        if (res.flag) {
          if (res.resTextbookCourseInfoList && res.resTextbookCourseInfoList.length > 0) {
            let textBookList = res.resTextbookCourseInfoList
            let newArr = [];
            textBookList.forEach(function (item) {
              newArr.push(item.courseId)
            })
            newArr = newArr = Array.from(new Set(newArr))
            // console.log(courseIds, 'courseIds');
            this.courseIds2 = newArr
          }

        } else {
          this.courseIds2 = []
        }
        return
      })
    },

    // 获取知识点目录信息
    async getKnowledgeCatalogInfo() {
      this.$store.commit('setVanLoading', true)
      this.unitIndex = 0
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        // "textbookId": this.textBookId,
        "textbookId": '3002',
        // "gradeTermId": this.gradeTermId,
        "gradeTermId": '2007',
        "subjectType": localStorage.currentSubjectType,
      }

      // let obj = {
      //   "interUser": "runLfb",
      //   "interPwd": "25d55ad283aa400af464c76d713c07ad",
      //   "operateAccountNo": '12134',
      //   "belongSchoolId": '24',
      //   "textbookId": '998',
      //   "gradeTermId": '1995',
      //   "subjectType": 'S01',
      // }

      let params = {
        requestJson: JSON.stringify(obj)
      }

      getKnowledgeCatalogInfo(params).then(res => {
        this.$store.commit('setVanLoading', false)
        console.log("知识点目录：", res)
        if (res.flag) {
          // this.$parent.isLoading = false
          console.log(this.$parent, 'this.$parent')
          if (!res.data) {
            this.isRecomment = true
            return
          }

          if (!res.data.length) {
            this.isRecomment = true
            return
          }

          if (!res.data[0].resultList) {
            this.isRecomment = true
            return
          }

          if (!res.data[0].resultList.length) {
            this.isRecomment = true
            return
          }
          this.isRecomment = res.data[0].recommend


          function filterArray(data, parentId) {
            var tree = [];
            var temp;
            for (var i = 0; i < data.length; i++) {
              if (data[i].parentId == parentId) {
                var obj = data[i];
                temp = filterArray(data, data[i].nodeId);
                if (temp.length > 0) {
                  obj.child = temp;
                } else {
                  obj.child = []
                }
                tree.push(obj);
              }
            }
            return tree;
          }

          let result = filterArray(res.data[0].resultList, '-1')
          console.log(result, 'result');

          this.list = result[0].child
          this.list[0].active = true

          const that = this
          function addClass(data, cIndex) {
            if (data.child) {
              cIndex++
              data.child.forEach((element, index) => {
                element.cName = that.classList[cIndex]
                addClass(element, cIndex)
              })
            }
          }

          addClass(this.list[0], this.classIndex)


        } else {
          this.isRecomment = true
        }

      }).catch(err => {
        this.$store.commit('setVanLoading', false)
        // this.$parent.isLoading = false
      })
    },
    toggleTab(item, index) {
      if (item.active) return
      this.list.forEach(v => {
        this.$set(v, 'active', false)
      })
      this.$set(item, 'active', true)
      this.listIndex = index
      this.classIndex = -1
      const that = this
      function addClass(data, cIndex) {
        if (data.child) {
          cIndex++
          data.child.forEach((element, index) => {
            element.cName = that.classList[cIndex]
            addClass(element, cIndex)
          })
        }
      }
      addClass(this.list[this.listIndex], this.classIndex)
    },
    go(item, index) {
      this.$router.push({
        path: `/questionList`,
        query: {
          'keyWord': item.knowledgeName,
          'areaCode': this.areaCode,
          subjectType: localStorage.currentSubjectType,
          isKnowledgePoint: true,
          // 'courseIds': this.courseIds,
          'courseIds': this.courseIds2,
          'classGrade': this.classGrade ? this.classGrade.split('|')[0] : '',
          // gradeTermId: this.gradeTermId,
          gradeTermId: '2007',
          from: 'knowledgePoint'

        }
      })
    }
  },

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.knowledge-point-wrap {
  &__tab {
    width: 100%;
    position: relative;

    &__wrap {
      flex: 0 0 52px;
      background: #f5f5f5;
      display: flex;
      overflow-x: auto;
      width: 100%;
      white-space: nowrap;
      align-items: center;
      margin-bottom: 10px;

      > div {
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        padding: 0 8px;
        line-height: 24px;
        border-radius: 24px;
        background-color: #fff;
      }
    }

    .knowledgeActive {
      background-color: @blue;
      color: #fff;
    }

    &__content {
      @{deep} .van-collapse-item__content {
        padding: 0;
      }
    }
  }

  .null-box {
    padding: 30px 0;
    text-align: center;
    color: #999999;
    background: #fff;
    margin-bottom: 20px;
    .null-tips {
      // margin-top: 350px;
      // margin-left: 50%;
      // transform: translateX(-50%);
      width: 60%;
    }
  }
  .fs16::after {
    border-bottom: none;
  }
}
</style>
