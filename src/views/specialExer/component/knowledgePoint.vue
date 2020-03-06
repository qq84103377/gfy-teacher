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
        <span v-for='(item,index) in list' :key='item.nodeName' class='mglt10 mgr10' :class="{knowledgeActive:item.active}" @click="toggleTab(item,index)">{{item.nodeName}}</span>
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
import { getKnowledgeCatalogInfo } from '@/api/index'
import myCollapse from './myCollapse'

export default {
  name: "knowledgePoint",
  props: ['start', 'classGrade', 'areaCode', 'courseIds', 'active', 'textBookId', 'gradeTermId', 'toggleNum', 'onRefresh'],
  data() {
    return {
      list: [],
      listIndex: 0,
      classList: ['row1', 'row2', 'row3', 'row4', 'row5'],
      classIndex: -1,
      toggleFirst: false,
      isRecomment: false,
      isChange: false
    }
  },
  components: {
    myCollapse
  },
  watch: {
    start(nv, ov) {
      console.log("start nv", nv);
      console.log("start ov", ov);
      if (nv) {

        if (this.toggleNum == 1) {
          this.toggleFirst = true
          this.isChange = false

          this.toggleFirst = true
          this.getKnowledgeCatalogInfo()

          this.$emit('update:start', false)
        } else {
          if (this.isChange) {
            this.isChange = false
            this.list = []
            this.listIndex = 0
            this.isRecomment = false
            this.classIndex = -1
            this.getKnowledgeCatalogInfo()
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
        await this.getKnowledgeCatalogInfo()
        this.$emit('update:onRefresh', false)
        this.$parent.$parent.isLoading = false
      }
    },
    courseIds(nv, ov) {
      console.log("courseIds nv", nv);
      console.log("courseIds ov", ov);
      if (nv) {
        this.isChange = true
        if (this.active != 1) return
        this.isChange = false
        this.list = []
        this.listIndex = 0
        this.isRecomment = false
        this.classIndex = -1
        this.getKnowledgeCatalogInfo()
      }
    },

  },
  methods: {
    // 获取知识点目录信息
    async getKnowledgeCatalogInfo() {
      this.$store.commit('setVanLoading', true)
      this.unitIndex = 0
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "textbookId": this.textBookId,
        "gradeTermId": this.gradeTermId,
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
    },
    go(item, index) {
      this.$router.push({
        path: `/questionList`,
        query: {
          'item': item,
          'areaCode': this.areaCode,
          subjectType: localStorage.currentSubjectType,
          isKnowledgePoint: true,
          'courseIds': this.courseIds,
          'classGrade': this.classGrade ? this.classGrade.split('|')[0] : '',
          gradeTermId: this.gradeTermId,
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
    overflow-x: scroll;

    &__wrap {
      height: 100%;
      overflow-x: scroll;
      white-space: nowrap;
      display: flex;
      height: 35px;
      line-height: 35px;
      margin-top: 5px;

      > span {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        padding-left: 10px;
        padding-right: 10px;
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
}
</style>
