<template>
  <section class="report-detail">
    <van-nav-bar
      :title="(getStudentName(stuList[stuIndex].accountNo,stuList[stuIndex].classId))+'的家庭报告'"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs14 blue" @click="">生成报告</div>
    </van-nav-bar>
    <div class="report-detail__tab">
      <div @click="toggleTab(item,index)" :class="['report-detail__tab-item',{'blue':item.active}]"
           v-for="(item,index) in tabList" :key="index">{{item.name}}
      </div>
    </div>
    <div class="report-detail__body" ref="body">
      <van-cell v-for="(item,index) in subjectList" :key="index">
        <div slot="title">
          <div @click="selectItem(item,index)" class="aic jcsb">
            <span>{{item.subjectName}}</span>
            <van-icon :name="item[keyFlod]?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="item[keyFlod]">
            <div v-show="tabIndex===0">
              <div :id="'knowledge'+index" class="histogram-chart mgt10"></div>
              <div class="stat-table">
                <div class="col">
                  <div style="font-weight: bold;">知识点名称</div>
                  <div class="regular-height" v-for="(kng,kngIndex) in item.kngArr" :key="kngIndex">{{kng.name}}</div>
                </div>
                <div class="row-wrap">
                  <div class="row row-header" style="font-weight: bold;">
                    <div style="flex: 0 0 33%">正确数</div>
                    <div style="flex: 0 0 33%">总题数</div>
                    <div style="flex: 0 0 33%">掌握程度</div>
                    <div style="flex: 0 0 33%">班级平均掌握程度</div>
                    <div style="flex: 0 0 33%">建议</div>
                  </div>
                  <div class="row" v-for="(kng,kngIndex) in item.kngArr" :key="kngIndex">
                    <div style="flex: 0 0 33%">{{kng.currentNum}}</div>
                    <div style="flex: 0 0 33%">{{kng.totalNum}}</div>
                    <div style="flex: 0 0 33%">{{kng.masteryNum}}</div>
                    <div style="flex: 0 0 33%">{{kng.sdadsa}}</div>
                    <div v-html="handleSuggest(kng.currentNum,kng.totalNum,kng.masteryNum)" class="regular-height"
                         style="flex: 0 0 33%;flex-direction: column;text-align: left">
                    </div>
                  </div>
                </div>
              </div>
              <div class="tip">可在表格内滑动，查看学生更多任务情况</div>
            </div>
            <div v-show="tabIndex===1">
              <div :id="'task'+index" class="histogram-chart mgt10"></div>
              <div class="data-analyse fs12">
                <div style="font-weight: bold;">数据分析:</div>
                <div class="grey9">
                  <div>总任务数为{{item.statInfo.total}}个，已完成任务数为{{item.statInfo.finish}}个；</div>
                  <div>完成任务占比为：{{item.statInfo.percent|mul(100,0)}}%。</div>
                  <div class="red">完成情况表现:{{item.statInfo.suggest}}</div>
                </div>
              </div>
            </div>
            <div v-show="tabIndex===2">
              <div :id="'score'+index" class="histogram-chart mgt10"></div>
              <div class="data-analyse fs12">
                <div style="font-weight: bold;">数据分析:</div>
                <div class="grey9">
                  <div>总任务数为20个，已完成任务数为15个；</div>
                  <div>完成任务占比为：75%。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-cell>
    </div>
    <div class="report-detail__footer">
      <van-button type="info" class="btn" @click="toggleStu(0)">上一个</van-button>
      <van-button type="info" class="btn" @click="toggleStu(1)">下一个</van-button>
    </div>
  </section>
</template>

<script>
  import echarts from "echarts";
  import {getUserKnowledgePointCounter, statStuTaskFinishInfo, getStudentScoreStatistics} from '@/api/index'
  import {getStudentName, getSubjectName, getTaskTypeName} from '@/utils/filter'
  import * as calculate from '@/utils/calculate'

  export default {
    name: "reportDetail",
    data() {
      return {
        tabList: [
          {name: '知识点掌握情况',scrollTop:0, active: true},
          {name: '任务完成情况',scrollTop:0, active: false},
          {name: '成绩趋势分析',scrollTop:0, active: false},
        ],
        subjectList: [],
        stuList: JSON.parse(JSON.stringify(this.$route.params.stuList)),
        stuIndex: this.$route.params.stuIndex,
        gradeList: [
          {classGrade: 'G01', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G02', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G03', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G04', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G05', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G06', subject: ['S01', 'S02', 'S03']},
          {classGrade: 'G07', subject: ['S01', 'S02', 'S03', 'S06', 'S07', 'S08', 'S09']},
          {classGrade: 'G08', subject: ['S01', 'S02', 'S03', 'S04', 'S06', 'S07', 'S08', 'S09']},
          {classGrade: 'G09', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07']},
          {classGrade: 'G10', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
          {classGrade: 'G11', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
          {classGrade: 'G12', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
        ]
      }
    },
    computed: {
      tabIndex() {
        return this.tabList.findIndex(v => v.active)
      },
      getStudentName() {
        return getStudentName
      },
      keyFlod() {
        const index = this.tabList.findIndex(v => v.active)
        if (index === 0) {
          return 'kngFold'
        } else if (index === 1) {
          return 'taskFold'
        } else if (index === 2) {
          return 'scoreFold'
        }
      },
    },
    methods: {
      getStudentScoreStatistics(item, index) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          eChartsType: 'T01',
          termType: '',
          ...this.$route.params.filterParams,
          subjectType: item.subjectType,
          accountNo: this.stuList[this.stuIndex].accountNo,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getStudentScoreStatistics(params).then(res => {
          if (res.flag) {
            this.drawHistogram3(res.data||[], index)
            this.$set(item, 'scoreDone', true)  // 标记该科目的任务完成情况已加载完毕,下次无需再加载
            this.$store.commit('setVanLoading', false)
          } else {
            this.$toast(res.msg)
            this.$store.commit('setVanLoading', false)
          }
        })
      },
      statStuTaskFinishInfo(item, index) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          roleType: 'A03',
          termType: '',
          ...this.$route.params.filterParams,
          subjectType: item.subjectType,
          accountNo: this.stuList[this.stuIndex].accountNo
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        statStuTaskFinishInfo(params).then(res => {
          if (res.flag && res.data[0]) {
            let info = res.data[0].tchCourseTaskCount.reduce((t, v) => {
              t.total += v.total_count
              t.finish += v.total_finish
              return t
            }, {total: 0, finish: 0})
            info.percent = calculate.div(info.finish, info.total, 2)
            if (info.percent < 0.6) {
              info.suggest = '较差，需要继续加强任务的完成率，积极完成老师布置的任务，加强监督。'
            } else if (info.percent >= 0.6 && info.percent < 0.8) {
              info.suggest = '一般，需要继续加强任务的完成率，积极完成老师布置的任务，加强激励和监督方式。'
            } else if (info.percent >= 0.8 && info.percent < 0.9) {
              info.suggest = '良好，需要继续加强任务的完成率，积极完成老师布置的任务，加强激励方式。'
            } else if (info.percent >= 0.9) {
              info.suggest = '优秀，请继续保持，同时继续完成任务的占比，做到百分百完成。'
            }
            this.$set(item, 'statInfo', info)
            this.drawHistogram2(res.data[0].tchCourseTaskCount, index)
            this.$set(item, 'statDone', true)  // 标记该科目的任务完成情况已加载完毕,下次无需再加载
            this.$store.commit('setVanLoading', false)
          } else {
            this.$toast(res.msg)
            this.$store.commit('setVanLoading', false)
          }
        })
      },
      handleSuggest(currentNum, totalNum, masteryNum) {
        let suggest = ''
        if (calculate.div(currentNum, totalNum) <= 0.8 && totalNum <= 20) {
          //正确数<=总题数的80% && 总题数<=20题
          suggest = `<div>①该知识点的练习过少，建议使用<span class="blue">“自主学习--测试---练”</span>功能加强练习。</div>`
        } else if (calculate.div(currentNum, totalNum) > 0.8 && totalNum <= 20) {
          //正确数>总题数的80% && 总题数<=20题
          suggest = `<div>①该知识点的练习量一般，建议使用<span class="blue">“自主学习--测试---测试”</span>功能进行深入检测。</div>`
        }

        if (masteryNum <= 90) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}该知识点的掌握程度较低，建议使用<span class="blue">“自主学习--学习--微课”</span>功能重新梳理知识点；使用<span class="blue">“自主学习--学习--素材”</span>功能，
巩固老师课堂所讲知识点。</div>`
        } else if (masteryNum > 90 && masteryNum < 95) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}该知识点的掌握程度一般，建议使用<span class="blue">“自主学习--学习--素材”</span>功能进一步梳理知识点，深入巩固知识点。</div>`
        } else if (masteryNum >= 95) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}该知识点的掌握程度良好，建议使用<span class="blue">“自主学习--学习--测试”</span>功能进一步练习举一反三的题目。</div>`
        }
        return suggest
      },
      getSubjectType() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "yearSection": "Y02"
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSubjectType(params).then(res => {

        })
      },
      toggleStu(type) {
        if (type) {
          //下一个
          if (this.stuIndex < this.stuList.length - 1) {
            //可以下一个
            this.stuIndex++
            this.init()
          } else {
            this.$toast('没有下一个了')
          }
        } else {
          //上一个
          if (this.stuIndex > 0) {
            //可以上一个
            this.stuIndex--
            this.init()
          } else {
            this.$toast('没有上一个了')
          }
        }
      },
      selectItem(item, index) {
        this.$set(item, this.keyFlod, !item[this.keyFlod])
        if (!item[this.keyFlod]) return
        this.$nextTick(() => {
          if (this.tabIndex === 0) {
            if (item.kngDone) return
            this.getUserKnowledgePointCounter(item, index)
          } else if (this.tabIndex === 1) {
            if (item.statDone) return
            this.statStuTaskFinishInfo(item, index)
          } else if (this.tabIndex === 2) {
            if (item.scoreDone) return
            this.getStudentScoreStatistics(item, index)
          }
        })
      },
      toggleTab(item, index) {
        if (item.active) return
        //切换前记录高度
        this.tabList[this.tabIndex].scrollTop = this.$refs["body"].scrollTop
        this.tabList.forEach(v => {
          v.active = false
        })
        item.active = true
        this.$nextTick(() => {
          this.$refs["body"].scrollTo(0, item.scrollTop);
        })
      },
      getUserKnowledgePointCounter(item, index) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "schoolId": this.$store.getters.schoolId,
          roleType: 'A03',
          termType: '',
          ...this.$route.params.filterParams,
          subjectType: item.subjectType,
          accountNo: this.stuList[this.stuIndex].accountNo
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserKnowledgePointCounter(params).then(res => {
          if (res.flag) {
            let courseList = [],
              courseIdList = [],
              sessionIndexList = [],
              sessionList = []
            // knowledgeRadar = []
            res.data[0].sectionItemList.forEach(v => {
              const index = courseIdList.findIndex(c => v.courseKnowledgePointItem[0].courseId === c)
              if (index < 0) {
                courseIdList.push(v.courseKnowledgePointItem[0].courseId)
                v['knowledgePointItem'] = [];
                v['courseAllCount'] = 0;
                v['courseRightCount'] = 0;
                courseList.push(v)
              }
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].knowledgePointItem.push(v.courseKnowledgePointItem[0].knowledgePointItem[0]);
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].courseAllCount += parseInt(v.courseKnowledgePointItem[0].knowledgePointItem[0].totalCount);
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].courseRightCount += parseInt(v.courseKnowledgePointItem[0].knowledgePointItem[0].rigthCount);
            })

            let xData = [], totalCounts = [], rigthCounts = [], masterys = [], max = 0;
            courseList.forEach(obj => {
              if (sessionIndexList.indexOf(obj.sessionIndex) < 0) {
                sessionIndexList.push(obj.sessionIndex);
                sessionList.push({
                  'sectionName': obj.sectionName,
                  'sectionType': obj.sectionType,
                  'sessionIndex': obj.sessionIndex,
                  'courseList': [],
                  'sectionAllCount': 0,
                  'sectionRightCount': 0
                });
              }
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].courseList.push(obj);
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].sectionAllCount += parseInt(obj.courseAllCount);
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].sectionRightCount += parseInt(obj.courseRightCount);
              obj.knowledgePointItem.forEach(k => {
                xData.push(k.knowledgePointName);
                totalCounts.push(k.totalCount);
                rigthCounts.push(k.rigthCount);
                masterys.push(((k.rigthCount / k.totalCount) * 100).toFixed(2));
                if (k.totalCount > max) {
                  max = k.totalCount;
                }
              })
            })
            //柱状图
            this.setCourseOption(xData, totalCounts, rigthCounts, masterys, max, item, index);


            // sessionList.forEach(o => {
            //   let sectionPercent = o.sectionAllCount == 0 ? '0%' : this.toPercent(o.sectionRightCount / o.sectionAllCount);
            //   knowledgeRadar.push({
            //     'sectionName': o.sectionName,
            //     'sectionType': o.sectionType,
            //     'sessionIndex': o.sessionIndex,
            //     'sectionAllCount': o.sectionAllCount,
            //     'sectionRightCount': o.sectionRightCount,
            //     sectionPercent
            //   });
            // })
            //雷达图
            // this.setOption(knowledgeRadar, index);

          } else {
            this.$store.commit('setVanLoading', false)
            this.$toast(res.msg)
          }
        })
      },
      setCourseOption(xData, total, right, mastery, max, item, index) {
        let option1 = {
          grid: {
            // top: '25%',
            left: '3%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: xData.length ? Math.ceil(100 / xData.length) : 100
            }
          ],
          legend: {
            data: ['总题数', '正确数', '掌握度']
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisPointer: {
                type: 'shadow'
              },
              //设置字体倾斜
              axisLabel: {
                interval: 0,
                rotate: 30,//倾斜度 -90 至 90 默认为0
                margin: 2/*,
                    textStyle:{
                        fontWeight:"bolder",
                        color:"#000000"
                    }*/
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '题数',
              min: 0,
              max: max,
              interval: max / 5,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '掌握度',
              min: 0,
              max: 100,
              interval: 20,
              axisLabel: {
                formatter: '{value}%'
              }
            }
          ],
          series: [
            {
              name: '总题数',
              type: 'bar',
              data: total
            },
            {
              name: '正确数',
              type: 'bar',
              data: right
            },
            {
              name: '掌握度',
              type: 'line',
              yAxisIndex: 1,
              data: mastery
            }
          ]
        };
        // if (max > 0) {
        //     this.$set(item, 'kwgNotEnough', false)
        this.$nextTick(() => {
          this.drawHistogram1(option1, index)
          this.renderKnowledgeTable(xData, total, right, mastery, item)
          this.$set(item, 'kngDone', true)  // 标记该科目的知识点掌握情况已加载完毕,下次无需再加载
          this.$store.commit('setVanLoading', false)
        })
        // } else {
        //     this.$set(item, 'kwgNotEnough', true)
        // }
      },
      renderKnowledgeTable(kngArr, totalArr, rightArr, masteryArr, subjectItem) {
        const tableData = kngArr.reduce((t, v, i) => {
          t.push({name: v, currentNum: rightArr[i], totalNum: totalArr[i], masteryNum: masteryArr[i]})
          return t
        }, [])
        this.$set(subjectItem, 'kngArr', tableData)
      },
      drawHistogram1(option1, index) {
        var myChart = echarts.init(document.getElementById('knowledge' + index))
        myChart.setOption(option1, true)
      },
      drawHistogram2(arr, index) {
        var myChart = echarts.init(document.getElementById('task' + index));
        let option1 = {
          grid: {
            // top: '25%',
            left: '3%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: arr.length ? Math.ceil(100 / arr.length) : 100
            }
          ],
          legend: {
            data: ['任务数', '已完成任务数']
          },
          xAxis: [
            {
              type: 'category',
              data: arr.map(v => getTaskTypeName(v.tast_type)),
              axisPointer: {
                type: 'shadow'
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量',
              // min: 0,
              // max: 3,
              // interval: 3 / 5,
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '任务数',
              type: 'bar',
              data: arr.map(v => v.total_count)
            },
            {
              name: '已完成任务数',
              type: 'bar',
              data: arr.map(v => v.total_finish)
            }
          ]
        };
        myChart.setOption(option1, true);

      },
      drawHistogram3(arr, index) {
        //对数组相同日期进行去重,并将相同日期的成绩取平均值
        const dateArr = arr.map(v => v.scoreDate.substr(0, 10))
        const uniqueDateArr = [...new Set(dateArr)]
        const newArr = uniqueDateArr.map(v => {
          const filterArr = arr.filter(obj => obj.scoreDate.indexOf(v) > -1)
          const totalScore = filterArr.reduce((t, f) => {
            return t = calculate.add(t, f.statisticsScore)
          }, 0)
          const avgScore = calculate.div(totalScore, filterArr.length, 0)
          return {date: v, score: avgScore}
        })
        var myChart = echarts.init(document.getElementById('score' + index));
        let option1 = {
          grid: {
            // top: '25%',
            left: '3%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              // end: 100 / 3
              end: newArr.length ? Math.ceil(100 / newArr.length) : 100
            }
          ],
          xAxis: [
            {
              // type: 'value',
              data: newArr.map(v => v.date),
              // axisPointer: {
              //   type: 'shadow'
              // },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '成绩',
              // min: 0,
              // max: 3,
              // interval: 3 / 5,
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '成绩',
              type: 'line',
              data: newArr.map(v => v.score)
            }
          ]
        };
        myChart.setOption(option1, true);

      },
      init() {
        this.subjectList = []
        this.$nextTick(() => {
          this.subjectList = this.gradeList.find(v => this.$route.params.filterParams.classGrade === v.classGrade).subject.map(v => {
            return {
              subjectName: getSubjectName(v),
              subjectType: v,
              kngArr: [],
              statInfo: {total: 0, finish: 0, percent: 0},
              kngFold: false,
              taskFold: false,
              scoreFold: false
            }
          })
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .report-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__tab {
      flex: 0 0 44px;
      margin-bottom: 10px;
      background: #fff;
      display: flex;

      &-item {
        flex: 1;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        line-height: 44px;
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .data-analyse {
        padding: 0 28px;

        > div:last-child {
          padding-left: 20px;
        }
      }

      .histogram-chart {
        width: 100%;
        height: 400px;
      }

      .stat-table {
        margin-top: 15px;
        font-size: 12px;
        border-top: 1.5px solid @blue;
        width: 100%;
        /*overflow-x: auto;*/
        position: relative;

        .row-wrap {
          overflow-x: auto;
          margin-left: 90px;

          &.blank-right {
            margin-right: 81px;
          }
        }

        .row, .col {
          display: flex;
          flex-wrap: nowrap;

          &.row-header {
            height: 44px;
          }

          > div {
            padding: 0 10px;
            color: #333;
            flex: 0 0 50%;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #eee;
            border-bottom: 1px solid #eee;
            text-align: center;
            background: #fff;
          }

        }

        .col {
          display: block;
          border-left: 1px solid #eee;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;

          > div {
            width: 90px;

            &.active {
              color: #16AAB7;
            }
          }

          &.bg {
            > div {
              background: #E0FFFC;
            }
          }

          &.fixed-right {
            right: 0;
            left: auto;
          }
        }

        &.narrow {
          .row-wrap {
            margin: 0 35px;
          }

          .col {
            > div {
              width: 35px;
              padding: 0;
            }
          }

          .row {
            > div {
              flex: 0 0 50%;
              padding: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
            }
          }
        }

      }

      .tip {
        margin-top: 10px;
        display: inline-block;
        font-size: 10px;
        color: #999;
        background: #F5F6FA;
        border-radius: 2px;
        padding: 4px 7px;
      }
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0 15px;

      .btn {
        flex: 1;
        border-radius: 20px;
        font-size: 18px;
        line-height: 44px;
        height: 44px;

        &:first-child {
          margin-right: 10px;
        }
      }
    }

    .regular-height {
      height: 420px;
      line-height: 16px;
    }
  }
</style>
