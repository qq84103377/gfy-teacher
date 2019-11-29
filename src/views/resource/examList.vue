<template>
  <section class="exam-list">
    <div class="exam-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/resource/exam_empty.png" alt/>
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="list.length>0?'没有更多了':'当前没有试卷，快去创建吧！'"
                  @load="onLoad" :offset='80'>
          <list-item @clickTo="viewDetail(item)" class="mgt10"
                     style="background: #fff;" @del="modifyTeachCourseRes(item,index)" v-for="(item,index) in list"
                     :key="index"
                     :itemTitle="item.testPaperName"
                     :can-slide="true">
            <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.stateName}"></i></div>
            <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY"
                   :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                <i class="iconGFY"
                   :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div><i class="iconGFY icon-difficult"></i>{{item.testPaperDegree==='D01'?'容易':item.testPaperDegree==='D02'?'中等':'困难'}}
                </div>
                <div><i class="iconGFY icon-zhu"></i>{{item.subjectiveItemNum || 0}}</div>
                <div><i class="iconGFY icon-ke"></i>{{item.objectiveItemNum || 0}}</div>
                <div><i class="iconGFY icon-download"></i>{{item.downCount || 0}}</div>
                <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
              </div>
            </div>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="modifyTeachCourseRes(item,index,1)">
                <van-icon :name="item.statusCd=='S02'?'closed-eye':'eye'" class="eye"></van-icon>
                <span>{{item.statusCd=='S02'?'不':''}}可见</span>
              </div>
              <div @click="edit(item,index)">
                <i class="iconGFY icon-edit-orange"></i>
                <span>编辑</span>
              </div>
              <div @click="copy(item)">
                <i class="iconGFY icon-copy-orange"></i>
                <span>复制</span>
              </div>
              <div @click="senTask(item)">
                <i class="iconGFY icon-plane"></i>
                <span>发任务</span>
              </div>
            </div>
          </list-item>

        </van-list>
      </van-pull-refresh>

    </div>
    <div class="exam-list__footer">
      <van-button type="info" class="btn" @click="createTestPaper">新建试卷</van-button>
    </div>

    <van-popup
      v-model="addExam.show"
      position="bottom">
      <div class="exam-pop">
        <div class="exam-pop__title">{{addExam.title}}</div>
        <van-cell class="exam-pop__cell">
          <div slot="title" class=" aic">
            <div><span class="red">*</span>名称:</div>
            <input class="pdlt10" style="flex: 1" v-model="addExam.name" type="text" maxlength="64"
                   placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - addExam.name.length}}</span>
            <van-icon v-show="addExam.name.length" @click="addExam.name = ''" class="clear" name="clear"/>
          </div>
        </van-cell>
        <van-cell v-if="addExam.title != '复制'" class="exam-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>试卷难度:</span>
            <van-radio-group style="display: flex;" v-model="addExam.difficult">
              <van-radio name="D01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                易
              </van-radio>
              <van-radio name="D02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                中
              </van-radio>
              <van-radio name="D03" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                难
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell v-if="addExam.title != '复制'" class="exam-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>共享级别:</span>
            <van-radio-group style="display: flex;" v-model="addExam.share">
              <van-radio name="S01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅自己
              </van-radio>
              <van-radio name="S02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                校内
              </van-radio>
              <van-radio name="S03"><i slot="icon" slot-scope="props"
                                       :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                公开
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <div class="exam-pop__footer">
          <van-button :loading="addExam.btnLoading" loading-text="提交" type="info" class="btn" @click="handleSubmit">提交
          </van-button>
        </div>
      </div>
    </van-popup>

  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {teachApi} from "../../api/parent-GFY";
  import {modifyTeachCourseRes, addTestPaper, addTeachCourseRes, modifyTestPaper, copyTestPaper} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "examList",
    components: {listItem},
    data() {
      return {
        addExam: {
          show: false,
          title: '',
          name: `《${this.$route.query.courseName}》标准测试卷1`,
          difficult: 'D02',
          share: 'S02',
          testPaperId: '',
          btnLoading: false,
          index: 0
        },
        list: [],
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
        scrollTop: 0,
        currentItem: {},
        "tchCourseId": this.$route.query.tchCourseId,
        "sysCourseId": this.$route.query.sysCourseId,
        "relationSeqId": this.$route.query.relationCourseId,
      }
    },
    computed: {
      show() {
        return this.addExam.show
      }
    },
    watch: {
      show(v) {
        if (!v) {
          this.addExam.difficult = 'D02'
          this.addExam.share = 'S02'
          this.addExam.name = `《${this.$route.query.courseName}》标准测试卷1`
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      this.scrollTop = this.$refs["body"].scrollTop;
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          vm.$refs["body"].scrollTo(0, vm.scrollTop);
        });
      });
    },
    mounted() {
      // this.getClassTeachCourseInfo()
      eventBus.$off("examListRefresh")
      eventBus.$on("examListRefresh", (data) => {
        this.onRefresh()
      })
    },
    destroyed() {
      eventBus.$off("examListRefresh")
    },
    methods: {
      createTestPaper() {
        this.$router.push({
          path: `/questionList`, query: {
            "tchCourseId": this.$route.query.tchCourseId,
            "sysCourseId": this.$route.query.sysCourseId,
            "relationSeqId": this.$route.query.relationCourseId,
            "courseName": this.$route.query.courseName,
            from: 'examList'
          }
        })
      },
      viewDetail(item) {
        this.$store.commit('setResourceInfo', item)
        this.$store.commit("setTaskClassInfo", '')
        this.$router.push({
          path: `/examDetail`, query: {
            "tchCourseId": this.$route.query.tchCourseId,
            "sysCourseId": this.$route.query.sysCourseId,
            "relationCourseId": this.$route.query.relationCourseId,
            type: item.stateName ? 1 : 0,
            testPaperId: item.testPaperId,
            subjectType: localStorage.currentSubjectType,
            classGrade: this.$route.query.classGrade,
            title: item.testPaperName,
          }
        })
      },
      copy(item) {
        this.addExam.title = '复制';
        this.addExam.show = true
        this.addExam.testPaperId = item.testPaperId
        this.addExam.name = item.testPaperName + '-副本'
        this.currentItem = item
      },
      copyTestPaper(copyTestPaperId) {
        this.addExam.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          copyTestPaperId,
          "oldTestPaperId": this.addExam.testPaperId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return copyTestPaper(params)
        //   .then(res => {
        //   this.addExam.btnLoading = false
        //   if (res.flag) {
        //
        //   } else {
        //     this.$toast(res.msg)
        //   }
        //
        // })
      },
      edit(item, index) {
        this.addExam.title = '编辑';
        this.addExam.show = true;
        this.addExam.name = item.testPaperName;
        this.addExam.difficult = item.testPaperDegree;
        this.addExam.share = item.shareType;
        this.addExam.testPaperId = item.testPaperId;
        this.addExam.index = index;
      },
      modifyTestPaper() {
        if (!this.addExam.name) {
          return this.$toast('请输入试卷名称')
        }
        this.addExam.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperInfo": {
            "testPaperId": this.addExam.testPaperId,
            "testPaperName": this.addExam.name,
            "shareType": this.addExam.share,
            "testPaperDegree": this.addExam.difficult
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        modifyTestPaper(params).then(res => {
          this.addExam.btnLoading = false
          if (res.flag) {
            this.list[this.addExam.index].testPaperName = this.addExam.name
            this.list[this.addExam.index].shareType = this.addExam.share
            this.list[this.addExam.index].testPaperDegree = this.addExam.difficult
            this.addExam.show = false
            this.$toast('编辑成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addTeachCourseRes(resourceId) {
        this.addExam.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": "R02",
          resourceId,
          "statusCd": "S04"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return addTeachCourseRes(params)
        //  .then(res => {
        //   this.addExam.btnLoading = false
        //   if (res.flag) {
        //     if (this.addExam.title === '新建试卷') {
        //       this.addExam.show = false
        //       this.$toast('添加成功')
        //       this.$refs['body'].scrollTo(0, 0)
        //       this.onRefresh()
        //       this.$router.push(`/questionList`)
        //     }
        //
        //   } else {
        //     this.$toast(res.msg)
        //   }
        // })
      },
      addTestPaper() {
        if (!this.addExam.name) {
          return this.$toast('请输入试卷名称')
        }
        this.addExam.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "testPaperInfo": {
            "testPaperId": "",
            "classGrade": this.$route.query.classGrade,//归属年级
            "subjectType": this.$route.query.subjectType,//学科
            "shareType": this.addExam.title == '复制' ? 'S01' : this.addExam.share,//共享级别
            "belongSchoolId": this.$store.getters.schoolId,//归属学校
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,//归属账号
            "testPaperName": this.addExam.name,//试卷名称
            "testPaperType": "T02",//试卷类型
            "provinceCode": "",//省份编号
            "areaCode": this.$store.getters.getUserInfo.areaCode,//地区编号
            "belongYear": new Date().getFullYear(),//归属年份
            "testPaperMode": "M01",//试卷模式
            "testPaperDegree": this.addExam.difficult,//试卷难度
            "score": this.addExam.title == '复制' ? this.currentItem.score : 0,//试卷分数，默认0分
            "subjectiveItemNum": this.addExam.title == '复制' ? this.currentItem.subjectiveItemNum : 0,//主观题数量
            "objectiveItemNum": this.addExam.title == '复制' ? this.currentItem.objectiveItemNum : 0,//客观题数量
            "duration": 10,//试卷时长
            "statusCd": "S01"//状态
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addTestPaper(params).then(res => {
          this.addExam.btnLoading = false
          if (res.flag) {
            if (this.addExam.title === '复制') {
              Promise.all([this.copyTestPaper(res.testPaperInfo.testPaperId), this.addTeachCourseRes(res.testPaperInfo.testPaperId)]).then(ret => {
                this.addExam.btnLoading = false
                if (ret.every(v => v.flag)) {
                  this.addExam.show = false
                  this.$refs['body'].scrollTo(0, 0)
                  this.onRefresh()
                  this.$toast('复制成功')
                } else {
                  this.$toast(ret[0].msg)
                }
              })
            } else {
              Promise.all([this.addTeachCourseRes(res.testPaperInfo.testPaperId)]).then(ret => {
                this.addExam.btnLoading = false
                if (ret[0].flag) {
                  this.addExam.show = false
                  this.$toast('添加成功')
                  this.$refs['body'].scrollTo(0, 0)
                  this.onRefresh()
                  this.$router.push({
                    path: `/questionList`, query: {
                      "tchCourseId": this.$route.query.tchCourseId,
                      "sysCourseId": this.$route.query.sysCourseId,
                      "relationSeqId": this.$route.query.relationCourseId,
                    }
                  })
                } else {
                  this.$toast(ret[0].msg)
                }
              })
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      modifyTeachCourseRes(item, index, type) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": 'A02',
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R02',
          "resourceId": item.testPaperId,
          "statusCd": type ? (item.statusCd == 'S02' ? 'S01' : 'S02') : 'S03'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        modifyTeachCourseRes(params).then(res => {
          if (res.flag) {
            if (type) {
              item.statusCd = item.statusCd == 'S02' ? 'S01' : 'S02'
            } else {
              this.list.splice(index, 1)
              this.$toast('删除成功')
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleSubmit() {
        if (this.addExam.title == '编辑') {
          this.modifyTestPaper()
        } else {
          this.addTestPaper()
        }
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        this.getList()
      },
      async onRefresh() {

        // this.listLoading = false
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
          "tchCourseId": this.tchCourseId,
          "sysCourseId": this.sysCourseId,
          "relationSeqId": this.relationCourseId,
          "resourceType": 'R02',
          "shareType": '',
          "sourceName": "",
          "pageSize": "10",
          "currentPage": page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].testPaperInfo && res.data[0].testPaperInfo.length) {
            this.list = page === 1 ? res.data[0].testPaperInfo : this.list.concat(res.data[0].testPaperInfo)
            if (page >= res.total) {
              this.finished = true
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
        })
      },
      senTask(obj) {
        if (!obj.objectiveItemNum && !obj.subjectiveItemNum) {
          return this.$toast('该试卷不含试题')
        }
        if (obj.stateName) {
          return this.$toast('该试卷已发任务,不能重复发任务')
        }
        console.log("发任务：", obj.testPaperName)
        this.$store.commit('setResourceInfo', obj)
        this.$store.commit("setTaskClassInfo", '')
        this.$router.push(`/addTask?type=exam&_t=new&from=examList`)
      },
    }
  }
</script>

<style lang="less" scoped>
  .exam-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .exam-pop {
      &__title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 47px;
      }

      .clear {
        color: @blue;
        margin-left: 10px;
      }

      .radio-normal {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
      }

      &__footer {
        padding: 5px 10px;

        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 16px;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .cover {
        background: @blue;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }

      .desc-top {
        display: flex;
        margin-bottom: 10px;

        .iconGFY {
          margin-right: 5px;
        }
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 7px;
          display: flex;
          align-items: center;
        }
      }

      .eye {
        color: #F89451;
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;
      background: #fff;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }

  .null-tips {
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
</style>
