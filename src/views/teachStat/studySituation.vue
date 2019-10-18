<template>
  <section class="study-situation">
    <div class="study-situation__tab">
      <div class="study-situation__tab-item" :class="{active:isClass}" @click="isClass=true">班级</div>
      <div class="study-situation__tab-item" :class="{active:!isClass}" @click="isClass=false">个人</div>
    </div>
    <div style="position: relative;">
      <div class="echart-label">章节掌握情况</div>
      <div class="eahcrt-legend">
        <div class="eahcrt-legend-item">班级</div>
        <div class="eahcrt-legend-item">学校</div>
      </div>
      <div v-show="!sectionNotEnough" id="myChart1" ref="myChart1" class="radar-chart"></div>
      <div v-if="sectionNotEnough">章节数据不足</div>
    </div>
    <div>
      <div class="echart-label">知识点掌握情况</div>
      <div v-show="!kwgNotEnough" id="myChart2" ref="myChart2" class="histogram-chart mgt10"></div>
      <div v-if="kwgNotEnough">知识点数据不足</div>
    </div>

  </section>
</template>

<script>
  import echarts from "echarts";
  import {getUserKnowledgePointCounter} from '@/api/index'

  export default {
    name: "studySituation",
    data() {
      return {
        gradeSubjectList: JSON.parse(JSON.stringify(this.$parent.gradeSubjectList)),
        sectionNotEnough: false,
        kwgNotEnough: false,
        isClass: true,
      }
    },
    watch: {
      filterParams: {
        handler() {
          this.init()
        },
        deep: true
      }
    },
    computed: {
      filterParams() {
        return {
          classGrade: this.gradeSubjectList[this.$parent.gradeIndex].classGrade,
          subjectType: this.gradeSubjectList[this.$parent.gradeIndex].subjectType,
          classId: this.$parent.classIndex || ''
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "schoolId": this.$store.getters.schoolId,
          roleType: 'A02',
          termType: '',
          ...this.filterParams,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserKnowledgePointCounter(params).then(res => {
          if (res.flag) {
            let courseList = [],
              courseIdList = [],
              sessionIndexList = [],
              sessionList = [],
              knowledgeRadar = []
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
            if (max > 0) {
              this.kwgNotEnough = true
              this.$nextTick(() => {
                this.setCourseOption(xData, totalCounts, rigthCounts, masterys, max);
              })
            } else {
              this.kwgNotEnough = false
            }

            sessionList.forEach(o => {
              let sectionPercent = o.sectionAllCount == 0 ? '0%' : this.toPercent(o.sectionRightCount / o.sectionAllCount);
              knowledgeRadar.push({
                'sectionName': o.sectionName,
                'sectionType': o.sectionType,
                'sessionIndex': o.sessionIndex,
                'sectionAllCount': o.sectionAllCount,
                'sectionRightCount': o.sectionRightCount,
                sectionPercent
              });
            })
            this.setOption(knowledgeRadar);

          } else {
            this.$store.commit('setVanLoading', false)
            this.$toast(res.msg)
          }
        })
      },
      setCourseOption(xData, total, right, mastery, max) {
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
              end: 1
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
        this.drawHistogramX(option1)
      },
      setOption(data) {
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
          series: [{
            name: '班级',
            type: 'radar',
            data: tmpSeriesData,
            lineStyle: {
              color: '#39F0DD'
            },
            itemStyle: {
              borderColor: '#39F0DD'
            }
          }]
        };
        if (tmpRadarIndicator.length >= 3) {
          this.sectionNotEnough = false;
          this.$nextTick(() => {
            this.drawRadar(option)
          })
        } else {
          this.sectionNotEnough = true;
          this.$store.commit('setVanLoading', false)
        }

      },
      toPercent(data) {
        var strData = parseFloat(data) * 10000;
        strData = Math.round(strData);
        strData /= 100.00;
        var ret = strData.toString() + "%";
        return ret;
      },
      drawRadar(option) {
        var myChart = echarts.init(document.getElementById('myChart1'));
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
      drawHistogramX(option) {
        let myChart = echarts.init(document.getElementById('myChart2'));
        myChart.setOption(option, true);
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
        margin-bottom: 6px;

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
          background: linear-gradient(0deg, rgba(140, 247, 238, 1), rgba(57, 240, 221, 1));
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
  }
</style>
