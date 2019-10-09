<template>
  <section class="question-list">
    <van-overlay
      class-name="mask"
      :show="tab.questionType||tab.difficult||tab.type||tab.sort"
      @click="tab.questionType=false;tab.difficult=false;tab.type=false;tab.sort=false;"/>
    <div class="question-list__tab">
      <div>
        <div class="dropdown__title" @click="tab.questionType=!tab.questionType">
          <div class="ellipsis">{{tab.questionTypeList.find(v => v.active)?tab.questionTypeList.find(v => v.active).examTypeName:'题型'}}</div>
          <van-icon :name="tab.questionType?'arrow-up':'arrow-down'"/>
        </div>
        <div v-show="tab.questionType" class="dropdown-menu">
          <div class="dropdown-menu-item" :class="{active:item.active}" @click="selectMenu(item,'questionTypeList')"
               v-for="(item,index) in tab.questionTypeList" :key="index">{{item.examTypeName}}
          </div>
        </div>
      </div>
      <div>
        <div class="dropdown__title" @click="tab.difficult=!tab.difficult">
          <div class="ellipsis">{{tab.difficultList.find(v => v.active)?tab.difficultList.find(v => v.active).name:'难度'}}</div>
          <van-icon :name="tab.difficult?'arrow-up':'arrow-down'"/>
        </div>
        <div v-show="tab.difficult" class="dropdown-menu">
          <div class="dropdown-menu-item" @click="selectMenu(item,'difficultList')" :class="{active:item.active}" v-for="(item,index) in tab.difficultList" :key="index">{{item.name}}</div>
        </div>
      </div>
      <div>
        <div class="dropdown__title" @click="tab.type=!tab.type">
          <div class="ellipsis">{{tab.typeList.find(v => v.active)?tab.typeList.find(v => v.active).dictValue:'类型'}}</div>
          <van-icon :name="tab.type?'arrow-up':'arrow-down'"/>
        </div>
        <div v-show="tab.type" class="dropdown-menu">
          <div class="dropdown-menu-item" @click="selectMenu(item,'typeList')" :class="{active:item.active}" v-for="(item,index) in tab.typeList" :key="index">{{item.dictValue}}</div>

        </div>
      </div>
      <div>
        <div class="dropdown__title" @click="tab.sort=!tab.sort">
          <div class="ellipsis">{{tab.sortList.find(v => v.active)?tab.sortList.find(v => v.active).name:'排序'}}</div>
          <van-icon :name="tab.sort?'arrow-up':'arrow-down'"/>
        </div>
        <div v-show="tab.sort" class="dropdown-menu">
          <div class="dropdown-menu-item" @click="selectMenu(item,'sortList')" :class="{active:item.active}" v-for="(item,index) in tab.sortList" :key="index">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="question-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
<!--          <div class="question-num">1.选择题</div>-->
          <question-item @add="handleAdd($event,item)" @correct="correctInfo=item;correctShow=true" :is-question="true" :is-send="false" v-for="(item,index) in list" :key="index"
                     :item="item" :index="index"></question-item>
        </van-list>
      </van-pull-refresh>

    </div>
    <!--  纠错弹窗-->
    <correct-pop :correctInfo="correctInfo" :show.sync="correctShow"></correct-pop>

    <exam-bar v-model="selectList" @clear="clear"></exam-bar>
  </section>
</template>

<script>
  import questionItem from '../../components/questionItem'
  import examBar from '../../components/examBar'
  import {teachApi} from "../../api/parent-GFY";
  import {getExamSectionTypeRelation, getSysDictList} from '@/api/index'
  import correctPop from '../../components/correctPop'

  export default {
    name: "questionList",
    components: {questionItem, examBar, correctPop},
    data() {
      return {
        selectList: [], //添加的试题列表
        addInfo: {},
        correctInfo: {},
        correctShow: false,
        tab: {
          questionType: false,
          difficult: false,
          type: false,
          sort: false,
          sortList: [{name: '全部', value: ''},{name: '综合排序', value: 'T05'}, {name: '时间', value: 'T01'}, {
            name: '使用量',
            value: 'T02'
          }, {name: '收藏量', value: 'T03'}],
          difficultList: [{name: '全部', value: ''}, {name: '容易', value: 'D01'}, {name: '中等', value: 'D02'}, {
            name: '困难',
            value: 'd03'
          }],
          questionTypeList: [{examTypeName: '全部'}],
          typeList: [{dictValue: '全部'}]
        },
        list: [],
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
        filterParam: {
          "titleType": "",//题型
          "titleDegree": "", //难度
          "belongType": "", //类型
          "orderByType": "T05"//排序类型 T05综合排序，T01:时间排序，T02：使用量，T03：收藏量
        }
      }
    },
    created() {
      this.getExamSectionTypeRelation()
      this.getSysDictList()
    },
    methods: {
      clear() {
        //清空所有试题时需要移除试题的添加状态样式
        this.list.forEach(v => {
          this.$set(v,'isRemove',false)
        })
      },
      handleAdd(isRemove,item) {
        if(isRemove) {
          // 移除
          const index = this.selectList.findIndex(v => v.examType === item.titleType)
          if(this.selectList[index].child.length === 1) {
            //整个this.selectList[index]删除
            this.selectList.splice(index,1)
          }else {
            // 只删除this.selectList[index].child[childIndex]
            const childIndex = this.selectList[index].child.findIndex(v => v.examId === item.examId)
            this.selectList[index].child.splice(childIndex,1)
          }
        }else {
          //添加
          const index = this.selectList.findIndex(v => v.examType === item.titleType)
          if(index > -1) {
            // 添加的试题已存在相同题型
            this.selectList[index].child.push(item)
          }else {
            //添加的试题不存在相同题型
            // const typeItem = this.tab.questionTypeList.find(v => v.examType === item.titleType)
            const sectionIndex = this.tab.questionTypeList.findIndex(v => v.examType === item.titleType)
            const typeItem = this.tab.questionTypeList[sectionIndex]
            this.selectList.push({
              sectionName:typeItem.sectionName,
              examType: typeItem.examType,
              sectionType: typeItem.sectionType,
              sectionIndex: sectionIndex - 1, //因为默认添加了一个全部的选项
              child: [item]
            })
          }
        }

        console.log(this.selectList,'=3=');

      },
      selectMenu(item, key) {
        this.tab.questionType = false;
        this.tab.difficult = false;
        this.tab.type = false;
        this.tab.sort = false;
        if (item.active) return
        this.$store.commit('setVanLoading',true)
        this.tab[key].forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)

        if (key === 'questionTypeList') {
          this.filterParam.titleType = item.examType
        }else if (key === 'difficultList') {
          this.filterParam.titleDegree = item.value
        }else if (key === 'typeList') {
          this.filterParam.belongType = item.dictKey
        }else if (key === 'sortList') {
          this.filterParam.orderByType = item.value
        }
        this.$refs['body'].scrollTo(0, 0)
        this.onRefresh()
      },
      getSysDictList() {
        let obj = {
          "interUser": "123",
          "interPwd": "123",
          "dictCode": "Domain_Exam_Belong_Type"//字典编码
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSysDictList(params).then(res => {
          if (res.flag) {
            this.tab.typeList.push(...res.data[0].sysDictInfoList)
          }
        })
      },
      getExamSectionTypeRelation() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "currPage": 1,
          "pageSize": 999,
          "examSectionTypeRlation": {
            "seqId": null,//编号可空
            "subjectType": this.$route.query.subjectType, //学科（课程时由课程信息获取，资源中心时有所选学科获取）
            "examType": null,//题型，可空
            "sectionType": null //章节类型，可空
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getExamSectionTypeRelation(params).then(res => {
          if (res.flag) {
            this.tab.questionTypeList.push(...res.examSectionTypeRlationList)
          }
        })
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        this.getList()
      },
      async onRefresh() {
        this.finished = false
        this.currentPage = 0
        this.onLoad()
      },
      getList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R03',
          "shareType": '',
          "sourceName": "",
          "pageSize": "10",
          "currentPage": page,
          "filterParam": this.filterParam
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.$store.commit('setVanLoading',false)
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].examQuestion && res.data[0].examQuestion.length) {
            this.list = page === 1 ? res.data[0].examQuestion : this.list.concat(res.data[0].examQuestion)
            if (page >= res.total) {
              this.finished = true
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
          // 加载列表时需要对已添加的试题修改状态
          this.selectList.forEach(s => {
            s.child.forEach(c => {
              this.list.forEach(v => {
                if(c.examId === v.examId) {
                  this.$set(v,'isRemove',true)
                }
              })
            })
          })

        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .question-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .mask {
      background: transparent;
    }
    &__tab {
      flex: 0 0 44px;
      display: flex;
      background: #fff;

      .ellipsis {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dropdown__title {
        max-width: 100%;
        position: relative;
        padding: 0 8px;

        i {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      > div {
        flex: 1;
        font-size: 14px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        /*border-right: 1px solid #ccc;*/
        position: relative;
        min-width: 0;
        /*&:last-child {*/
        /*  border-right: none;*/
        /*}*/

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;
          max-height: 220px;
          overflow-y: auto;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .question-num {
        line-height: 45px;
        padding: 0 10px;
      }
    }
  }
</style>
