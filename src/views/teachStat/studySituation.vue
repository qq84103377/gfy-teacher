<template>
  <section class="study-situation">
    <div class="study-situation__tab">
      <div class="study-situation__tab-item" :class="{active:isClass}" @click="toggleTab(true)">班级</div>
      <div class="study-situation__tab-item" :class="{active:!isClass}" @click="toggleTab(false)">个人</div>
    </div>
    <div v-show="isClass">
      <div style="position: relative;">
        <div class="echart-label">章节掌握情况</div>
        <div class="eahcrt-legend">
          <div class="eahcrt-legend-item">班级</div>
          <div class="eahcrt-legend-item">学校</div>
        </div>
        <div v-show="!sectionNotEnough" id="myChart1" ref="myChart1" class="radar-chart"></div>
        <div v-if="sectionNotEnough" class="empty-page">
          <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
          <div class="grey9 fs12">章节数据不足~</div>
        </div>
      </div>
      <div>
        <div class="aic jcsb">
          <div class="echart-label">知识点掌握情况</div>
          <div :class="['rein-btn',{active:barIndexArr.length}]" v-if="isReinforce" @click="showSelectKnw">智能补强</div>
        </div>
        <div v-show="!kwgNotEnough" id="myChart2" ref="myChart2" class="histogram-chart mgt10"></div>
        <div v-show="!kwgNotEnough" class="tip">可在表格内滑动，查看更多内容</div>
        <div v-if="kwgNotEnough" class="empty-page mgb20">
          <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
          <div class="grey9 fs12">知识点数据不足~</div>
        </div>
        <div class="select-tip" v-if="isReinforce">点击知识点(选择),再点击智能补强,方可进行智能补强。</div>
      </div>
    </div>
    <div v-show="!isClass">
      <div class="cell-label">学生列表</div>
      <van-cell style="overflow: inherit" v-for="(item,index) in stuList" :key="index">
        <div slot="title">
          <div @click="selectStu(item,index)" class="aic jcsb">
            <span :class="{blue:false}">{{item.accountNo|getStudentName(item.classId)}}</span>
            <van-icon :name="item.fold?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="item.fold">
            <div style="position: relative;">
              <div class="echart-label">章节掌握情况</div>
              <div class="eahcrt-legend">
                <div class="eahcrt-legend-item">个人</div>
                <div class="eahcrt-legend-item">班级</div>
              </div>
              <div v-show="!item.sectionNotEnough" :id="'radar-stu'+index" class="radar-chart"></div>
              <div v-if="item.sectionNotEnough" class="empty-page">
                <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
                <div class="grey9 fs12">章节数据不足~</div>
              </div>
            </div>
            <div>
              <div class="aic jcsb">
                <div class="echart-label">知识点掌握情况</div>
                <div :class="['rein-btn',{active:item.barIndexArr&&item.barIndexArr.length}]"  v-if="isReinforce" @click="showSelectKnw(item)">智能补强</div>
              </div>
              <div v-show="!item.kwgNotEnough" :id="'his-stu'+index" class="histogram-chart mgt10"></div>
              <div v-show="!item.kwgNotEnough" class="tip">可在表格内滑动，查看更多内容</div>
              <div v-if="item.kwgNotEnough" class="empty-page">
                <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
                <div class="grey9 fs12">知识点数据不足~</div>
              </div>
              <div class="select-tip" v-if="isReinforce">点击知识点(选择),再点击智能补强,方可进行智能补强。</div>
            </div>
          </div>
        </div>
      </van-cell>
    </div>
  </section>
</template>

<script>
  import echarts from "echarts";
  import {getUserKnowledgePointCounterV2} from '@/api/index'
  import * as calculate from '@/utils/calculate'
  import {getFontSize} from "../../utils/filter";

  export default {
    name: "studySituation",
    props: ['isReinforce'],
    data() {
      return {
        gradeSubjectList: JSON.parse(JSON.stringify(this.$parent.gradeSubjectList)),
        sectionNotEnough: false,
        kwgNotEnough: false,
        isClass: true,
        stuList: JSON.parse(localStorage.classMap)[this.$parent.classIndex].studentInfo,
        barOption: {},
        barIndexArr: [],
        xData: [], //记录班级数据的知识点
      }
    },
    watch: {
      filterParams: {
        handler() {
          this.handleLoad()
        },
        deep: true,
        immediate: true
      },
    },
    computed: {
      filterParams() {
        return {
          classGrade: this.gradeSubjectList[this.$parent.tempGradeIndex].classGrade,
          subjectType: this.gradeSubjectList[this.$parent.tempGradeIndex].teacherInfoList[this.$parent.tempSubjectIndex].subjectType,
          classId: this.$parent.classIndex || ''
        }
      }
    },
    mounted() {
      // this.init()
    },
     beforeRouteLeave(to, from, next) {
      
    if (this.$parent.showTime) {
      this.$parent.showTime=false
      next(false)
    } else if (this.$parent.masterGradePop) {
      this.$parent.masterGradePop=false
      next(false)
    } else if (this.$parent.masterClassPop) {
      this.$parent.masterClassPop = false
      next(false)
    } else if (this.$parent.gradePop) {
      this.$parent.gradePop = false
      next(false)
    } else if (this.$parent.classPop) {
      this.$parent.classPop = false
      next(false)
    } else {
        next()
    }
  
    },
    methods: {
      showSelectKnw(item) {
        if(this.isClass) {
          if(this.barIndexArr.length) {
            this.$emit('showPop',this.xData.filter((v,i) => this.barIndexArr.includes(i)),this.gradeSubjectList[this.$parent.gradeIndex].subjectType,this.gradeSubjectList[this.$parent.gradeIndex].classGrade,this.$parent.classIndex)
          }else {
            this.$toast('请选择知识点')
          }
        }else {
          if(item.barIndexArr.length) {
            this.$emit('showPop',item.xData.filter((v,i) => item.barIndexArr.includes(i)),this.gradeSubjectList[this.$parent.gradeIndex].subjectType,this.gradeSubjectList[this.$parent.gradeIndex].classGrade,this.$parent.classIndex,item.accountNo)
          }else {
            this.$toast('请选择知识点')
          }
        }
      },
      handleLoad() {
        if (this.isClass) {
          this.init()
        }
          this.stuList = JSON.parse(localStorage.classMap)[this.filterParams.classId].studentInfo
      },
      toggleTab(bol) {
        if (this.isClass === bol) return
        this.isClass = bol
        if (bol) {
          this.init()
        }
      },
      selectStu(item, index) {

        this.$set(item, 'fold', !item.fold)
        if(!item.done) {
          this.$nextTick(() => {
            this.init(item, index)
          })
        }
      },
      init(item, index) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "schoolId": this.$store.getters.schoolId,
          roleType: 'A03',
          termType: '',
          ...this.filterParams,
          beignDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          accountNo:item?item.accountNo:''
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserKnowledgePointCounterV2(params).then(res => {
          if(!this.isClass) {
            this.$set(item,'done',true)
          }
          if (res.flag) {
            let courseList = [],
              courseIdList = [],
              sessionIndexList = [],
              sessionList = [],
              knowledgeRadar = []
            res.data[0].sectionItemList.forEach(v => {
              const index = courseIdList.findIndex(c => v.courseKnowledgePointItem[0].courseId === c)
              const otherItem = res.data[0].contrastMapList.find(con => con.courseId === v.courseKnowledgePointItem[0].courseId)
              if (index < 0) {
                courseIdList.push(v.courseKnowledgePointItem[0].courseId)
                v['knowledgePointItem'] = [];
                v['courseAllCount'] = 0;
                v['courseRightCount'] = 0;
                v['otherAllCount'] = otherItem.contrastTotalCount || 0;
                v['otherRightCount'] = otherItem.contrastRightCount || 0;
                courseList.push(v)
              }
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].knowledgePointItem.push(v.courseKnowledgePointItem[0].knowledgePointItem[0]);
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].courseAllCount += parseInt(v.courseKnowledgePointItem[0].knowledgePointItem[0].totalCount || 0);
              courseList[courseIdList.indexOf(v.courseKnowledgePointItem[0].courseId)].courseRightCount += parseInt(v.courseKnowledgePointItem[0].knowledgePointItem[0].rigthCount || 0);
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
                  'sectionRightCount': 0,
                  'otherAllCount': obj.otherAllCount,
                  'otherRightCount': obj.otherRightCount
                });
              }
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].courseList.push(obj);
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].sectionAllCount += parseInt(obj.courseAllCount);
              sessionList[sessionIndexList.indexOf(obj.sessionIndex)].sectionRightCount += parseInt(obj.courseRightCount);
              obj.knowledgePointItem.forEach(k => {
                xData.push({name:k.knowledgePointName,id:k.knowledgePointId,mastery:(((k.rigthCount||0) / k.totalCount) * 100).toFixed(2)});
                totalCounts.push(k.totalCount);
                rigthCounts.push(k.rigthCount||0);
                masterys.push((((k.rigthCount||0) / k.totalCount) * 100).toFixed(2));
                if (k.totalCount > max) {
                  max = k.totalCount;
                }
              })
            })
            //柱状图
            if(this.isClass) {
              this.xData = xData
            }else {
              this.$set(item,'xData',xData)
            }
            this.setCourseOption(xData, totalCounts, rigthCounts, masterys, max, index,item);

            sessionList.forEach(o => {
              const otherObj = o.courseList.reduce((t, course) => {
                t.otherAllCount = calculate.add(course.otherAllCount, t.otherAllCount)
                t.otherRightCount = calculate.add(course.otherRightCount, t.otherRightCount)
                return t
              }, {otherAllCount: 0, otherRightCount: 0})
              let sectionPercent = o.sectionAllCount == 0 ? '0%' : this.toPercent(o.sectionRightCount / o.sectionAllCount);
              knowledgeRadar.push({
                'sectionName': o.sectionName,
                'sectionType': o.sectionType,
                'sessionIndex': o.sessionIndex,
                'sectionAllCount': o.sectionAllCount,
                'sectionRightCount': o.sectionRightCount,
                sectionPercent,
                otherCountPercent: calculate.div(otherObj.otherRightCount, otherObj.otherAllCount)
              });
            })
            //雷达图
            this.setOption(knowledgeRadar, index);

          } else {
            this.$store.commit('setVanLoading', false)
            this.$toast(res.msg)
          }
        })
      },
      setCourseOption(xData, total, right, mastery, max, index,item) {
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
              end: xData.length>5 ? (5/xData.length)*100:100
            }
          ],
          legend: {
            data: ['总题数', '正确数', '掌握度']
          },
          xAxis: [
            {
              type: 'category',
              triggerEvent: true,
              data: xData.map(v => {
                return {value: v.name, textStyle: {color: '#333'}}
              }),
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
              data: total,
              barWidth: xData.length>5?'25%':`${xData.length*5}%`,
              itemStyle: {
                normal: {
                  color: '#56F2E3'
                },
              }
            },
            {
              name: '正确数',
              type: 'bar',
              data: right,
              barWidth: xData.length>5?'25%':`${xData.length*5}%`,
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            },
            {
              name: '掌握度',
              type: 'line',
              yAxisIndex: 1,
              data: mastery,
              itemStyle: {
                normal: {
                  color: '#E139F0'
                },
              }
            }
          ],
          textStyle:{
            fontSize: getFontSize(0.12),
          }
        };
        if(this.isClass) {
          this.barOption = option1
          this.barIndexArr = []
        }else {
          this.$set(item,'barOption',option1)
          this.$set(item,'barIndexArr',[])
        }
        if (max > 0) {
          if (this.isClass) {
            this.kwgNotEnough = false
          } else {
            this.$set(this.stuList[index], 'kwgNotEnough', false)
          }
          this.$nextTick(() => {
            this.drawHistogramX(option1, index, item)
          })
        } else {
          if (this.isClass) {
            this.kwgNotEnough = true
          } else {
            this.$set(this.stuList[index], 'kwgNotEnough', true)
          }
        }
      },
      setOption(data, index) {
        let tmpRadarIndicator = [];
        for (let d = 0; d < data.length; d++) {
          let name = "";
          if (data[d].sectionName == "" || data[d].sectionName == null) {
            name = "其他"
          } else {
            name = data[d].sectionName;
          }
          tmpRadarIndicator.push({name: name, max: 100});
        }

        let tmpSeriesData = [];
        let tmpSeriesData_value = [];
        for (let d = 0; d < data.length; d++) {
          tmpSeriesData_value.push(parseFloat(data[d].sectionPercent.replace("%", "")));
        }
        tmpSeriesData.push({value: tmpSeriesData_value, name: ''});
        let option = {
          title: {
            text: ''
          },
          tooltip: {},
          radar: {
            indicator: tmpRadarIndicator
          },
          series: [
            {
              name: this.isClass ? '班级' : '个人',
              type: 'radar',
              data: tmpSeriesData,
              lineStyle: {
                color: '#39F0DD'
              },
              itemStyle: {
                borderColor: '#39F0DD'
              }
            },
            {
              name: this.isClass ? '学校' : '班级',
              type: 'radar',
              data: [{value: data.map(v => calculate.mul(v.otherCountPercent, 100)), name: ''}],
              lineStyle: {
                color: '#D677EA'
              },
              itemStyle: {
                borderColor: '#D677EA'
              }
            },
          ],
          textStyle:{
            fontSize: getFontSize(0.12),
          }
        };
        if (tmpRadarIndicator.length >= 3) {
          if (this.isClass) {
            this.sectionNotEnough = false
          } else {
            this.$set(this.stuList[index], 'sectionNotEnough', false)
          }
          this.$nextTick(() => {
            this.drawRadar(option, index)
          })
        } else {
          if (this.isClass) {
            this.sectionNotEnough = true
          } else {
            this.$set(this.stuList[index], 'sectionNotEnough', true)
          }
          this.$store.commit('setVanLoading', false)
        }

      },
      toPercent(data) {
        let strData = parseFloat(data) * 10000;
        strData = Math.round(strData);
        strData /= 100.00;
        let ret = strData.toString() + "%";
        return ret;
      },
      drawRadar(option, index) {
        var myChart = echarts.init(document.getElementById(this.isClass ? 'myChart1' : 'radar-stu' + index));
        // 指定图表的配置项和数据
        // var option = {
        //   title: {
        //     text: ''
        //   },
        //   tooltip: {},
        //   radar: {
        //     name: {
        //       textStyle: {
        //         color: '#333',
        //       }
        //     },
        //     indicator: [{name: '的速度', max: 100}, {name: '啊十大三大', max: 100}, ]
        //   },
        //   series: [
        //     {
        //       name: '班级',
        //       type: 'radar',
        //       // areaStyle: {normal: {}},
        //       data: [{value: [20, 30], name: 'zscs'}],
        //       lineStyle: {
        //         color: '#39F0DD'
        //       },
        //       itemStyle: {
        //         borderColor: '#39F0DD'
        //       }
        //     },
        //     {
        //       name: '学校',
        //       type: 'radar',
        //       // areaStyle: {normal: {}},
        //       data: [{value: [55, 66], name: 'zscs'}],
        //       lineStyle: {
        //         color: '#D677EA'
        //       },
        //       itemStyle: {
        //         borderColor: '#D677EA'
        //       }
        //     },
        //   ]
        // };
        myChart.setOption(option, true);
        this.$store.commit('setVanLoading', false)
      },
      drawHistogramX(option, index, item) {
        let myChart = echarts.init(document.getElementById(this.isClass ? 'myChart2' : 'his-stu' + index));
        myChart.setOption(option, true);
        myChart.off('click')
        myChart.off('dataZoom')
        if (this.isReinforce) {
          myChart.on('click', params => {
            const selectIndex = params.seriesType ? params.dataIndex : (params.event.target.anid.split('_')[1] * 1)

            if(this.isClass) {
              const barIndex = this.barIndexArr.indexOf(selectIndex)
              if (barIndex > -1) {
                this.barIndexArr.splice(barIndex, 1)
              } else {
                this.barIndexArr.push(selectIndex)
              }
              this.barOption.xAxis[0].data = this.barOption.xAxis[0].data.map((v, i) => {
                return {value: v.value, textStyle: {color: this.barIndexArr.some(b => b == i)?'#39F0DD':'#333'}}
              })
            }else {
              const barIndex = item.barIndexArr.indexOf(selectIndex)
              if (barIndex > -1) {
                item.barIndexArr.splice(barIndex, 1)
              } else {
                item.barIndexArr.push(selectIndex)
              }
              item.barOption.xAxis[0].data = item.barOption.xAxis[0].data.map((v, i) => {
                return {value: v.value, textStyle: {color: item.barIndexArr.some(b => b == i)?'#39F0DD':'#333'}}
              })
            }

            let myChart = echarts.init(document.getElementById(this.isClass ? 'myChart2' : 'his-stu' + index));
            myChart.setOption(this.isClass?this.barOption:item.barOption, true);
          })
          //记录滑动的位置,防止重新绘制图表时返回初始位置
          myChart.on('dataZoom',event => {
            if (this.isReinforce) {
              if (event.batch) {
                if(this.isClass) {
                  this.barOption.dataZoom[0].start = event.batch[0].start;
                  this.barOption.dataZoom[0].end = event.batch[0].end;
                }else {
                  item.barOption.dataZoom[0].start = event.batch[0].start;
                  item.barOption.dataZoom[0].end = event.batch[0].end;
                }
              }
            }
          });
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  .study-situation {
    padding: 0 10px;
    margin-top: 10px;
    background: #fff;

    .eahcrt-legend {
      position: absolute;
      right: 10px;
      top: 0;

      &-item {
        font-size: 14px;

        &:before {
          content: ' ';
          display: inline-block;
          width: 20px;
          height: 13px;
          background: @blue;
          margin-right: 8px;
        }

        &:last-child:before {
          background: #D677EA;
        }
      }
    }

    .radar-chart {
      width: 100%;
      height: 300px;
    }

    .histogram-chart {
      width: 100%;
      height: 400px;
    }

    &__tab {
      padding: 10px 0 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-item {
        text-align: center;
        flex: 0 0 92px;
        line-height: 30px;
        border-radius: 15px;
        color: #999;
        font-size: 15px;
        background: #F5F6FA;

        &:first-child {
          margin-right: 20px;
        }

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }
      }
    }

    .echart-label {
      font-size: 15px;
      color: #333;
      font-weight: bold;
      line-height: 22px;

      &:after {
        width: 30px;
        height: 2px;
        background: @blue;
        display: block;
        content: ' ';
      }
    }

    .cell-label {
      font-size: 16px;
      color: #333;
      line-height: 44px;
      display: flex;
      align-items: center;

      &:before {
        margin-right: 5px;
        width: 2px;
        background: @blue;
        height: 17px;
        content: '';
      }
    }

    .select-tip {
      background: #f5f5f5;
      border-radius: 2px;
      line-height: 20px;
      padding: 0 5px;
      color: #999;
      font-size: 10px;
      margin: 10px 0;
    }

    .rein-btn {
      font-size: 12px;
      font-weight: bold;
      line-height: 25px;
      padding: 0 10px;
      background: #f5f5f5;
      color: #333;
      border-radius: 5px;

      &.active {
        background: @blue;
        color: #fff;
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
</style>
