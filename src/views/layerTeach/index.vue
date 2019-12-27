<template>
  <section class="layer-teach">
    <van-nav-bar :title="$route.query.taskName" @click-left="goBack" left-arrow/>
    <div class="layer-teach__tab-scroll">
      <div v-for="(item,index) in tchClassTastInfo" :key="index" @click="handleSelectTab(item)"
           class="layer-teach__tab-scroll-item" :class="{'active':item.active}">{{item.className}}
      </div>
    </div>
    <div v-if="!vanLoading && isNull" style="text-align: center;color: #999999">
      <img class="null-tips" src="../../assets/img/preview/task_null.png" alt/>
      <div>该任务没有分层信息!</div>
    </div>
    <div v-if="!isNull" class="layer-teach__body">
      <div class="layer-teach__body__pie-chart">
        <div class="layer-teach__body__pie-chart-label divider">任务完成情况:</div>
        <div id="myChart1" ref="myChart1" class="pie-chart"></div>
      </div>
      <div class="layer-teach__body__achievement">
        <div class="layer-teach__body__achievement-label divider">全班成绩概况:</div>
        <div class="layer-teach__body__achievement-score">
          <div>
            <span>班级平均分</span>
            <span class="mgt10">{{calculate.div(taskInfo.totalScore||0,taskInfo.finshCount||0,0)}}分</span>
          </div>
          <div>
            <span>班级最高分</span>
            <span class="mgt10">{{taskInfo.maxScore || 0}}分</span>
          </div>
          <div>
            <span>班级最低分</span>
            <span class="red mgt10">{{taskInfo.minScore || 0}}分</span>
          </div>
        </div>
      </div>
      <div class="layer-teach__body__layer-group">
        <div class="layer-teach__body__layer-group-label divider">
          <div class="aic jcsb">
            <span>分层情况:</span>
            <div class="layer-btn-group">
              <div :class="['layer-btn',{active:isEdit}]" @click="editLayer">修改分层情况</div>
              <div :class="['layer-btn',{active:taskInfo.layerTestPaperNum>0}]" @click="createLayerTestPaper"
                   v-if="taskInfo.tchCourseUsedLayerId === taskInfo.layerInfo.layerId">生成层级试卷
              </div>
              <div class="layer-btn" v-else @click="useLayer">使用该分层</div>
            </div>
          </div>
        </div>
        <div class="layer-wrapper">
          <div :class="['layer-wrapper__detail',{active:isEdit}]"
               v-for="(item,index) in taskInfo.layerInfo.layerGroupInfoList" :key="index">
            <div class="layer-wrapper__detail__label">{{item.layerGroupInfo.subgroupName}}(<span :class="{blue:isEdit}"
                                                                                                 @click="selectScore">{{item.layerGroupInfo.subgroupScoreEnd}}-{{item.layerGroupInfo.subgroupScoreStart}}分</span>){{item.layerGroupStudentList?item.layerGroupStudentList.length:0}}人:
            </div>
            <div class="layer-wrapper__detail__stu-group">
              <div :class="['layer-wrapper__detail__stu-group__item',{active:stu.active}]" @click="selectStu(stu)"
                   v-for="(stu,si) in item.layerGroupStudentList" :key="si">
                {{stu.stuName}}
              </div>
            </div>
          </div>
        </div>
        <div class="grey6 fs10" v-show="isEdit"><span class="red">*</span>点击每层的分数可以修改分数范围,选中学生名字可以批量进行层级的移动</div>
      </div>
    </div>
    <div class="layer-teach__footer" v-show="showMoveBtn">
      <van-button type="info" class="btn" @click="showMoveDialog">移动</van-button>
    </div>

    <!--    任务完成情况-->
    <van-dialog v-model="stuStatInfo.statDialog" :show-confirm-button="false">
      <div class="stat-dialog-wrap">
        <div class="stat-dialog-wrap__header"><span
          class="stat-dialog-wrap__header-title">{{stuStatInfo.title}}学生</span>
          <van-icon class="icon-close" name="clear" @click="stuStatInfo.statDialog=false"/>
        </div>
        <div class="stat-dialog-wrap__body">
          <div v-for="(item,index) in stuStatInfo.stu" :key="index" @click="">{{item}}</div>
        </div>
      </div>
    </van-dialog>
    <!--修改分数段-->
    <van-dialog v-model="scoreEditVisible"
                :show-confirm-button="false">
      <div class="score-edit-dialog">
        <div class="score-edit-dialog__title">分数段调整</div>
        <div style="display: flex;flex-direction: column;align-items: center;">
          <div v-for="(item,index) in tempLayerList" :key="index" class="score-edit-dialog__layer">
            <div class="score-edit-dialog__layer__label">{{item.layerGroupInfo.subgroupName}}:</div>
            <input v-model="item.layerGroupInfo.subgroupScoreEnd" @input="handleInput($event,item,'subgroupScoreEnd')"
                   type="tel"/>
            <div>—</div>
            <input :disabled="!index" v-model="item.layerGroupInfo.subgroupScoreStart"
                   @input="handleInput($event,item,'subgroupScoreStart')" type="tel"/>
            <van-icon @click="delLayer(index)" :class="['del',{blue:tempLayerList.length>2&&index}]" name="clear"/>
          </div>
        </div>
        <div class="fs12 grey9" style="text-align: center;"><span class="red">*</span>点击每层的分数可以修改分数范围</div>
        <div @click="addLayer" class="score-edit-dialog__add">
          <van-icon :class="['add',{blue:tempLayerList.length<6}]" name="add"/>
          添加分数段
        </div>
        <div class="btn-group van-hairline--top">
          <div @click="scoreEditVisible = false">取消</div>
          <div class="van-hairline--left blue" @click="scoreConfirm">确定</div>
        </div>
      </div>
    </van-dialog>
    <!--    人员移动-->
    <van-dialog v-model="stuMoveVisible"
                :show-confirm-button="false">
      <div class="score-edit-dialog">
        <div class="score-edit-dialog__title">人员移动</div>
        <div class="score-edit-dialog__content">
          <div>是否移动到:</div>
          <div class="dropdown-group__wrapper">
            <div class="dropdown-group" @click="dropdownShow = !dropdownShow">
              <div>{{stuMoveLabel}}</div>
              <div :class="['triangle',{down:dropdownShow}]"></div>
            </div>
            <div v-show="dropdownShow" class="dropdown__menu">
              <div class="dropdown__menu__item" @click="selectStuMoveList(item)"
                   :class="{blue:item.layerGroupInfo.check}" v-for="(item,index) in tempLayerList" :key="index">
                {{item.layerGroupInfo.subgroupName}}
              </div>
            </div>
          </div>
        </div>
        <div class="btn-group van-hairline--top">
          <div @click="stuMoveVisible = false;dropdownShow=false">取消</div>
          <div class="van-hairline--left blue" @click="moveStu">确定</div>
        </div>
      </div>
    </van-dialog>

  </section>
</template>

<script>
  import {mapMutations, mapGetters, mapState} from 'vuex'
  import {getStudentName} from '@/utils/filter'
  import * as calculate from '@/utils/calculate'
  import {
    getLayerTaskInfoDetail,
    updateTchTeachLayerInfo,
    bindLayeringGroupByTchCourse,
    createLayerTestPaper
  } from '@/api/index'
  import echarts from "echarts";

  export default {
    name: "index",
    data() {
      return {
        dropdownShow: false,
        taskIndex: 0,
        taskInfo: {layerInfo: {}},
        stuStatInfo: {
          title: '',
          stu: [],
          statDialog: false
        },
        isNull: false,
        tchClassTastInfo: JSON.parse(JSON.stringify(this.$route.query.tchClassTastInfo)),
        isEdit: false,
        scoreEditVisible: false,
        stuMoveVisible: false,
        tempLayerList: []
      }
    },
    computed: {
      stuMoveLabel() {
        const item = this.tempLayerList.find(v => v.layerGroupInfo.check)
        return item ? item.layerGroupInfo.subgroupName : ''
      },
      classId() {
        const item = this.tchClassTastInfo.find(v => v.active)
        return item ? item.classId : ''
      },
      calculate() {
        return calculate
      },
      showMoveBtn() {
        let flag = false
        for (let k in this.taskInfo.layerInfo.layerGroupInfoList) {
          if ((this.taskInfo.layerInfo.layerGroupInfoList[k].layerGroupStudentList || []).some(v => v.active)) {
            flag = true
            break
          }
        }
        return flag
      },
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
    },
    methods: {
      editLayer() {
        this.isEdit = !this.isEdit
        if(!this.isEdit) {
          this.taskInfo.layerInfo.layerGroupInfoList.forEach(layer => {
            (layer.layerGroupStudentList||[]).forEach(s => {
              this.$set(s,'active',false)
            })
          })
        }
      },
      createLayerTestPaper() {
        if (this.taskInfo.layerTestPaperNum > 0) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          layerId: this.taskInfo.layerInfo.layerId,
          tchCourseId: this.$route.query.tchCourseId,
          classId: this.classId,
          taskId: this.$route.query.taskId,
          testPaperId: this.taskInfo.testPaperId,
          classGrade: this.taskInfo.tchCourseInfo.classGrade,
          subjectType: this.taskInfo.tchCourseInfo.subjectType,
          className: this.tchClassTastInfo.find(v => v.active).className
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        createLayerTestPaper(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.taskInfo.layerTestPaperNum = 1
            const {tchCourseId, sysCourseId, relationCourseId, subjectType, classId, classGrade, courseName} = this.taskInfo.tchCourseInfo
            this.$router.push({
              path: '/examList',
              query: {tchCourseId, sysCourseId, relationCourseId, subjectType, classId, classGrade, courseName}
            })
          } else {
            this.$toast(res.msg)
          }
        })
      },
      useLayer() {
        let name = ''
        this.taskInfo.layerInfo.layerGroupInfoList.every(v => {
          if ((v.layerGroupStudentList || []).length === 0) {
            name = v.layerGroupInfo.subgroupName
          }
          return (v.layerGroupStudentList || []).length > 0
        })
        if (name) {
          this.$toast(`${name}没有存在学生名单,请手动删除该分层`)
        } else {
          this.bindLayeringGroupByTchCourse()
        }
      },
      bindLayeringGroupByTchCourse() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          layerId: this.taskInfo.layerInfo.layerId,
          tchCourseId: this.$route.query.tchCourseId,
          classId: this.classId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        bindLayeringGroupByTchCourse(params).then(async res => {
          if (res.flag) {
            await this.getLayerTaskInfoDetail()
            this.$store.commit('setVanLoading', false)
          } else {
            this.$toast(res.msg)
            this.$store.commit('setVanLoading', false)
          }
        })
      },
      moveStu() {
        const layerIndex = this.tempLayerList.findIndex(v => v.layerGroupInfo.subgroupName === this.stuMoveLabel)
        this.tempLayerList.forEach((v, i) => {
          if (v.layerGroupStudentList) {
            for (let si = 0; si < v.layerGroupStudentList.length; si++) {
              //学生选中并且该学生属于非选中的层,先将该学生加入至选中的层,再把这个学生从原本的层删除
              if (v.layerGroupStudentList[si].active && (i !== layerIndex)) {
                //layerGroupStudentList有可能为Null
                if (this.tempLayerList[layerIndex].layerGroupStudentList) {
                  this.tempLayerList[layerIndex].layerGroupStudentList.push({
                    ...v.layerGroupStudentList[si],
                    allotType: 'T02'
                  })
                } else {
                  this.tempLayerList[layerIndex].layerGroupStudentList = [{
                    ...v.layerGroupStudentList[si],
                    allotType: 'T02'
                  }]
                }
                v.layerGroupStudentList.splice(si--, 1)
              }
            }
          }
        })
        this.updateTchTeachLayerInfo()
      },
      selectStuMoveList(item) {
        this.dropdownShow = false
        this.tempLayerList.forEach(v => {
          this.$set(v.layerGroupInfo, 'check', false)
        })
        item.layerGroupInfo.check = true
      },
      showMoveDialog() {
        this.tempLayerList = JSON.parse(JSON.stringify(this.taskInfo.layerInfo.layerGroupInfoList))
        this.$set(this.tempLayerList[0].layerGroupInfo, 'check', true)
        this.stuMoveVisible = true
      },
      updateTchTeachLayerInfo() {
        this.$store.commit('setVanLoading', true)
        let layerGroupInfoList = this.tempLayerList.map(v => {
          return {
            "subgroupName": v.layerGroupInfo.subgroupName,
            "subgroupScoreStart": v.layerGroupInfo.subgroupScoreStart,
            "subgroupScoreEnd": v.layerGroupInfo.subgroupScoreEnd,
            "layerGroupStudentInfoList": (v.layerGroupStudentList || []).map(s => {
              return {
                "accountNo": s.accountNo,
                "allotType": s.allotType,
                "subgroupId": s.subgroupId
              }
            })
          }
        })

        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          layerId: this.taskInfo.layerInfo.layerId,
          layerGroupInfoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateTchTeachLayerInfo(params).then(async res => {
          if (res.flag) {
            this.scoreEditVisible = false
            this.isEdit = true
            this.dropdownShow = false
            this.stuMoveVisible = false
            await this.getLayerTaskInfoDetail()
            this.$store.commit('setVanLoading', false)
          } else {
            this.$toast(res.msg)
            this.$store.commit('setVanLoading', false)
          }
        })
      },
      scoreConfirm() {
        let flag = false
        for (let index in this.tempLayerList) {
          if (this.tempLayerList[index].layerGroupInfo.subgroupScoreStart === '' || this.tempLayerList[index].layerGroupInfo.subgroupScoreEnd === '') {
            this.$toast('目前分层存在分段为空的情况，请检查分层。')
            flag = true
            break
          }
          if (this.tempLayerList[index].layerGroupInfo.subgroupScoreStart <= this.tempLayerList[index].layerGroupInfo.subgroupScoreEnd) {
            this.$toast(`${this.tempLayerList[index].layerGroupInfo.subgroupName}分数段设置错误，请检查分层。`)
            flag = true
            break
          }
          if (index * 1 > 0) {
            if (Number(this.tempLayerList[index].layerGroupInfo.subgroupScoreStart + 1) < Number(this.tempLayerList[index - 1].layerGroupInfo.subgroupScoreEnd)) {
              console.log(123);
              this.$toast('目前的分层存在分数遗漏的情况，请检查分层的分数。')
              flag = true
              break
            }
            if (Number(this.tempLayerList[index].layerGroupInfo.subgroupScoreStart) >= Number(this.tempLayerList[index - 1].layerGroupInfo.subgroupScoreEnd)) {
              this.$toast(`${this.tempLayerList[index - 1].layerGroupInfo.subgroupName}和${this.tempLayerList[index].layerGroupInfo.subgroupName}的分数重复了，请检查分数。`)
              flag = true
              break
            }
            if ((index * 1 === this.tempLayerList.length - 1) && this.tempLayerList[index].layerGroupInfo.subgroupScoreEnd * 1 > 0) {
              console.log(321);
              this.$toast('目前的分层存在分数遗漏的情况，请检查分层的分数。')
              flag = true
              break
            }
          }
        }
        if (!flag) {
          this.updateTchTeachLayerInfo()
        }
      },
      delLayer(index) {
        if (this.tempLayerList.length <= 2 || !index) return
        if (this.tempLayerList[index].layerGroupStudentList && this.tempLayerList[index].layerGroupStudentList.length) return this.$toast('该分层存在着学生名单，无法删除')
        this.tempLayerList.splice(index, 1)
        this.tempLayerList.forEach((v, i) => {
          v.layerGroupInfo.subgroupName = this.handleSubgroupName(i)
        })
      },
      addLayer() {
        if (this.tempLayerList.length >= 6) return
        this.tempLayerList.push({
          layerGroupStudentList: [],
          layerGroupInfo: {
            subgroupName: this.handleSubgroupName(this.tempLayerList.length),
            subgroupScoreEnd: '',
            subgroupScoreStart: ''
          }
        })
      },
      handleSubgroupName(num) {
        let subgroupName = ''
        switch (num) {
          case 0 :
            subgroupName = 'A层'
            break;
          case 1 :
            subgroupName = 'B层'
            break;
          case 2 :
            subgroupName = 'C层'
            break;
          case 3 :
            subgroupName = 'D层'
            break;
          case 4 :
            subgroupName = 'E层'
            break;
          case 5 :
            subgroupName = 'F层'
            break;
        }
        return subgroupName
      },
      selectScore() {
        this.tempLayerList = JSON.parse(JSON.stringify(this.taskInfo.layerInfo.layerGroupInfoList))
        this.scoreEditVisible = true
      },
      selectStu(item) {
        if (this.isEdit) {
          this.$set(item, 'active', !item.active)
        }
      },
      handleInput(e, item, key) {
        const reg = /^[0-9]\d*$/
        if (!reg.test(e.target.value)) {
          e.target.value = e.target.value.substr(0, e.target.value.length - 1)
          this.$set(item.layerGroupInfo, key, e.target.value)
        }
      },
      goBack() {
        this.common.goBack(this)
      },
      drawPie() {
        this.$nextTick(() => {
          if (this.isNull) return
          let myChart = echarts.init(this.$refs.myChart1);
          // 绘制图表
          var _option = {
            calculable: true,
            color: ['#FB5522', '#2BFF93'],
            series: [
              {
                name: '文言文全章复习与巩固',
                type: 'pie',
                radius: [0, 53],
                label: {
                  emphasis: {
                    show: true
                  },
                  position: 'outside',
                  formatter: `{b}{d}%>\n({c}人)`,
                  align: 'left'
                },
                labelLine: {
                  normal: {
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#ccc',
                  }
                },
                data: [
                  {
                    value: this.taskInfo.studentUnfinishList.reduce((t, v) => {
                      t += (v.accountNoList ? v.accountNoList.length : 0)
                      return t
                    }, 0), name: '未完成'
                  },
                  {value: this.taskInfo.finshCount, name: '已完成'}
                ]
              }
            ],
          };
          myChart.setOption(_option, true)
          myChart.on('click', params => {
            this.stuStatInfo.stu = []
            this.stuStatInfo.title = params.name
            if (params.name === '未完成') {
              this.taskInfo.studentUnfinishList.forEach(v => {
                (v.accountNoList || []).forEach(s => {
                  const name = getStudentName(s, this.classId)
                  this.stuStatInfo.stu.push(name)
                })
              })
            } else {
              this.taskInfo.finishStudent.reduce((t, v) => {
                const name = getStudentName(v, this.classId)
                t.push(name)
                return t
              }, this.stuStatInfo.stu)
            }

            this.stuStatInfo.statDialog = true
          })
        });
      },
      async handleSelectTab(item) {
        if (item.active) return
        this.$store.commit('setVanLoading', true)
        this.tchClassTastInfo.forEach(v => {
          this.$set(v, 'active', false)
        })
        item.active = true
        await this.getLayerTaskInfoDetail()
        this.drawPie()
        this.$store.commit('setVanLoading', false)
      },
      async getLayerTaskInfoDetail() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          tchCourseId: this.$route.query.tchCourseId,
          taskId: this.$route.query.taskId,
          classId: this.classId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getLayerTaskInfoDetail(params).then(res => {
          if (res.flag) {
            this.isNull = false
            this.taskInfo = res.data || {layerInfo: {}}
            this.taskInfo.layerInfo.layerGroupInfoList.forEach(v => {
              (v.layerGroupStudentList || []).forEach(s => {
                this.$set(s, 'stuName', getStudentName(s.accountNo, this.classId))
              })
            })
          } else {
            this.taskInfo = {layerInfo: {}}
            this.isNull = true
            this.$toast(res.msg)
          }
        })
      }
    },
    async created() {
      this.$store.commit('setVanLoading', true)
      await this.getLayerTaskInfoDetail()
      this.drawPie()
      this.$store.commit('setVanLoading', false)
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .layer-teach {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .divider {
      &::after {
        content: " ";
        display: block;
        width: 30px;
        height: 2px;
        background: @blue;
      }
    }

    &__tab-scroll {
      flex: 0 0 42px;
      background: #f5f5f5;
      display: flex;
      overflow-x: auto;
      width: 100%;
      white-space: nowrap;
      align-items: center;

      &-item {
        display: inline-block;
        background: #ddd;
        border-radius: 11px;
        font-size: 12px;
        color: #999;
        padding: 0 8px;
        line-height: 22px;
        margin-left: 10px;
        /*&:last-child{*/
        /*  margin-right: 0;*/
        /*}*/

        &.active {
          background: linear-gradient(0deg,
          rgba(57, 240, 221, 1),
          rgba(140, 247, 238, 1));
          color: #fff;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__pie-chart {
        background: #fff;
        padding: 15px 10px;

        &-label {
          font-size: 15px;
          color: #333;

        }
      }

      &__achievement {
        background: #fff;
        padding: 15px 10px;
        margin-top: 5px;

        &-label {
          font-size: 15px;
          color: #333;
          line-height: 26px;
        }

        &-score {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 12px;

          > div {
            font-size: 12px;
            margin-right: 24px;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      &__layer-group {
        background: #fff;
        padding: 15px 10px;
        margin-top: 5px;

        &-label {
          font-size: 15px;
          color: #333;
          line-height: 26px;
          margin-bottom: 10px;

          .layer-btn-group {
            display: flex;

            .layer-btn {
              border-radius: 5px;
              font-size: 11px;
              line-height: 25px;
              padding: 0 8px;
              margin-left: 10px;
              background: #F5F6FA;
              color: #666;

              &.active {
                background: @blue;
                color: #fff;
              }
            }
          }
        }

        .layer-wrapper {
          &__detail {
            background: #fff;
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;
            margin-bottom: 10px;

            &.active {
              background: #f5f6fa;
            }

            &__label {
              font-weight: bold;
              margin-bottom: 15px;
            }

            &__stu-group {
              display: flex;
              flex-wrap: wrap;

              &__item {
                flex: 0 0 75px;
                background: #eee;
                border-radius: 11px;
                color: #333;
                line-height: 22px;
                text-align: center;
                margin-right: 10px;
                margin-bottom: 10px;

                &:nth-child(4n) {
                  margin-right: 0;
                }

                &.active {
                  color: #fff;
                  background: @blue;
                }
              }
            }
          }
        }
      }
    }

    &__footer {
      flex: 0 0 50px;
      padding: 0 10px;
      background: #fff;
      display: flex;
      align-items: center;

      .btn {
        width: 100%;
        line-height: 44px;
        border-radius: 22px;
      }
    }

    .stat-dialog-wrap {
      display: flex;
      flex-direction: column;

      &__header {
        font-size: 18px;
        color: #010101;
        flex: 0 0 40px;
        display: flex;
        align-items: center;
        position: relative;

        &-title {
          flex: 1;
          text-align: center;
        }

        .icon-close {
          position: absolute;
          font-size: 22px;
          color: @blue;
          right: 10px;
        }
      }

      &__body {
        max-height: 240px;
        overflow-y: auto;
        font-size: 14px;
        color: #666;
        padding: 10px 20px;
        display: flex;
        flex-wrap: wrap;

        div {
          flex: 0 0 66px;
          padding: 4px;
          text-align: center;
        }
      }

      &__footer {
        flex: 0 0 55px;
        padding: 0 20px;
        display: flex;
        align-items: center;

        .dialog-btn {
          border-radius: 22px;
          color: #fff;
          font-size: 18px;
          flex: 1;
        }
      }
    }

    .pie-chart {
      width: 100%;
      height: 200px;
      margin: 0 auto;
      margin-top: 20px;
    }

    .null-tips {
      margin-top: 50px;
      width: 100%;
    }

    @{deep} .van-dialog {
      overflow: initial;
    }

    .score-edit-dialog {
      &__title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 70px;
      }

      &__content {
        margin-bottom: 55px;
        display: flex;
        align-items: center;
        justify-content: center;

        .triangle {
          border-width: 0 6px 6px;

          &.down {
            transform: rotateZ(180deg);
          }
        }
      }

      &__layer {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        &:last-child {
          margin-bottom: 10px;
        }

        input {
          width: 60px;
          border-bottom: 1px solid #999;
          margin: 0 10px;
          text-align: center;
          border-radius: 0;
        }

        .del {
          font-size: 15px;
          color: #ccc;
        }
      }

      &__add {
        padding: 16px 0;
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;

        .add {
          font-size: 22px;
          color: #ccc;
          margin-right: 5px;
        }
      }

      .btn-group {
        display: flex;

        > div {
          flex: 1;
          font-size: 18px;
          line-height: 55px;
          text-align: center;
          color: #666;
        }
      }

      .dropdown-group__wrapper {
        width: 134px;
        position: relative;
        margin-left: 16px;
        font-size: 14px;

        .dropdown-group {
          width: 100%;
          height: 32px;
          border-radius: 5px;
          border: 1px solid #999;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown__menu {
          position: absolute;
          z-index: 10;
          left: 0;
          top: 32px;
          width: 100%;
          border: 1px solid #999;
          border-radius: 5px;
          background: #fff;

          &__item {
            line-height: 32px;
            padding: 0 10px;
          }
        }
      }

    }
  }
</style>
