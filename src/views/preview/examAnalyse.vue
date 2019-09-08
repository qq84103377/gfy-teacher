<template>
  <section class="exam-analyse-wrap">
    <div class="exam-analyse-wrap__tab">
      <div :class="{active:isExam}" @click="isExam=true">试题分析</div>
      <div :class="{active:!isExam}" @click="isExam=false">得分分析</div>
    </div>
    <div style="flex: 1;overflow-y: auto" v-show="isExam">
      <div class="exam-analyse-wrap__pie">
        <div class="exam-analyse-wrap__pie-label divider">题型分布</div>
        <div id="myChart1" ref="myChart1" class="chart-pie"></div>
      </div>
      <div class="exam-analyse-wrap__histogram van-hairline--bottom">
        <div class="exam-analyse-wrap__histogram-label divider">知识点分布</div>
        <div id="myChart2" ref="myChart2" class="chart-histogram"></div>
      </div>
      <div id="myChart3" ref="myChart3" class="chart-histogram"></div>
      <div class="desc">本张试卷包括题型为<span><span v-for="(item,index) in examInfo.titleTypeCount" :key="index">{{item.value}}道{{item.name}},</span></span>难度为<span><span
        v-for="(item,index) in examInfo.degreeCount"
        :key="index">{{item.name}}:{{item.value}}%,</span></span>知识点涵盖<span><span
        v-for="(item,index) in examInfo.knowledgePointInfos" :key="index">{{item.knowledgePointName}}{{index < examInfo.knowledgePointInfos.length-1?'、':'。'}}</span></span>
      </div>
    </div>
    <div ref="scrollCtn" style="flex: 1;overflow-y: auto" class="pd10" v-show="!isExam">
      <div class="score-table">
        <div class="col">
          <div>#</div>
          <div v-for="(item,index) in scoreInfo" :key="index" @click="handleCharts(index,item,0)"
               :class="{blue:item.active}">{{item.name}}
          </div>
          <div>平均分</div>
          <div>得分率</div>
        </div>
        <div v-if="scoreInfo.length" class="scroll-content">
          <div v-for="(item,index) in scoreInfo[0].exam.arr" :key="index" class="col"
               :class="{'one-item':scoreInfo[0].exam.arr.length==1}">
            <div @click="handleCharts(index,item,1)" :class="{blue:item.active}">第{{index+1}}题</div>
            <div v-for="(a,i) in scoreInfo" :key="i">{{a.exam.arr[index].score}}</div>
            <div>{{averagePoint(index)}}</div>
            <div>{{scoreRate(index)}}</div>
          </div>
        </div>
        <div class="col">
          <div>总分</div>
          <div v-for="(item,index) in scoreInfo" :key="index">{{item.total}}</div>
          <div>-</div>
          <div>-</div>
        </div>
      </div>
      <div class="tip">
        <div>点击题号或者学生姓名可以查看更多比较信息</div>
      </div>
      <div id="myChart4" ref="myChart4" v-show="scoreChartShow" class="chart-histogram mgt10"></div>
      <i @click="backTop" class="iconGFY icon-backtop backtop"></i>
    </div>
  </section>
</template>

<script>
  import echarts from "echarts";
  import {getTestPaperAnalysis, getTestPaperScoreAnalysis} from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  export default {
    name: "examAnalyse",
    data() {
      return {
        isExam: true,
        scoreChartShow: false,
        stuIndex: 0,
        examIndex: 0,
        examInfo: {
          knowledgePointInfos: [],
          knowMap: {},
          titleTypeCount: [],
          titleTypeName: [],
          degreeCount: [],
          useCount: [],
          accuracy: [],
        },
        scoreInfo: []
      }
    },
    created() {
      this.getTestPaperScoreAnalysis()
    },
    methods: {
      scoreRate(index) {
        const hasPoint = this.scoreInfo.reduce((t, v) => {
         if(v.exam.arr[index].score>0) {
           t++
         }
         return t
        }, 0)
        if (this.scoreInfo.length) {
         return (hasPoint / this.scoreInfo.length).toFixed(4) * 100 + '%'
        }else {
          return 0 + '%'
        }
      },
      averagePoint(index) {
        const totalScore = this.scoreInfo.reduce((t, v) => {
          t += v.exam.arr[index].score
          return t
        }, 0)
        if (this.scoreInfo.length) {
         return (totalScore / this.scoreInfo.length).toFixed(2)
        }else {
          return 0
        }
      },
      getTestPaperScoreAnalysis() {
        this.$store.commit('setVanLoading',true)
        const {classId, taskId} = this.$route.query
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          testPaperId: this.$route.query.testPaperId,
          classId,
          taskId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTestPaperScoreAnalysis(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if (res.flag) {
            this.scoreInfo = Object.keys(res.data[0].student).map(v => {
              return {
                name: getStudentName(v, this.$route.query.classId),
                total: res.data[0].student[v].reduce((t, value,i) => {
                  // value.average = this.averagePoint(i)
                  t += value.score
                  return t
                }, 0),
                exam: {
                  arr: res.data[0].student[v]
                }
              }
            })
            console.log(this.scoreInfo);
          }else {
            this.$toast(res.msg)
          }
        })
      },
      async getTestPaperAnalysis() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          testPaperId: this.$route.query.testPaperId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getTestPaperAnalysis(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if (res.flag) {
            this.examInfo = res.data[0]
          }else {
            this.$toast(res.msg)
          }
        })
      },
      backTop() {
        this.$refs['scrollCtn'].scrollTo(0, 0)
      },
      handleCharts(index, item, flag) {
        if(item.active) return
        this.scoreChartShow = true
        if (flag) {
          //点击题目 this.scoreInfo[0].exam.arr[this.examIndex]
          this.$set(this.scoreInfo[0].exam.arr[this.examIndex], 'active', false)
          this.$set(this.scoreInfo[this.stuIndex], 'active', false)
          this.examIndex = index
        } else {
          //点击学生
          this.$set(this.scoreInfo[this.stuIndex], 'active', false)
          this.$set(this.scoreInfo[0].exam.arr[this.examIndex], 'active', false)
          this.stuIndex = index
        }
        this.$set(item, 'active', true)
        this.$nextTick(() => {
          if(flag) {
            let xArr = []
            let scoreArr = []
            let averageArr = []
            this.scoreInfo.forEach(v => {
              xArr.push(getStudentName(v.exam.arr[index].accountNo, this.$route.query.classId))
              scoreArr.push(v.exam.arr[index].score)
              averageArr.push(this.averagePoint(index))
            })
            this.drawHistogramScore(xArr,scoreArr,averageArr)
          }else {
            let scoreArr = []
            let averageArr = []
            const xArr = item.exam.arr.map((v,i) => {
              scoreArr.push(v.score)
              averageArr.push(this.averagePoint(i))
              return `第${i + 1}题`
            })
            this.drawHistogramScore(xArr,scoreArr,averageArr)
          }
          this.$refs['scrollCtn'].scrollTo(0, this.$refs['scrollCtn'].scrollHeight)
        })
      },
      drawPie() {
        var myChart = echarts.init(document.getElementById('myChart1'));
        var color2 = ['#64D5FF', '#FE7624', '#FEE224', '#8A77FF', '#24FE80', '#FBC74D', '#FE4D24', '#8BFE24', '#FE24D8', '#24FEC8', '#64FDFF', '#249AFE', '#8A77FF'];
        var examOption = {
          color: color2,
          // title: {
          //   text: '题型分布',
          //   left:'center'
          // },
          // tooltip: {
          //   trigger: 'item',
          //   formatter: "{a} <br/>{b}: {c} ({d}%)"
          // },
          legend: {
            // orient: 'vertical',
            // x: 'left',
            data: this.examInfo.titleTypeName
          },
          series: [
            {
              name: '题型分布',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],
              // tooltip: {
              //   trigger: 'item',
              //   formatter: "{a} <br/>{b}: {c}题 ({d}%)"
              // },
              label: {
                show: false,
                // normal: {
                //   position: 'inner',
                //   formatter: ' {b}',
                // }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.examInfo.titleTypeCount
            },
            {
              name: '试卷题型难度',
              type: 'pie',
              // tooltip: {
              //   trigger: 'item',
              //   formatter: "{a} <br/>{b}:{d}%"
              // },
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: ' {b}：{d}% ',
                  color: '#999'
                  // backgroundColor: '#eee',
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4
                }
              },
              // data: [{name: '简单', value: 1, itemStyle: {color: '#F2F056'}}, {
              //   name: '中等',
              //   value: 2,
              //   itemStyle: {color: '#56F2E3'}
              // }, {name: '困难', value: 3, itemStyle: {color: '#FF9777'}},]
              data: this.examInfo.degreeCount
            }
          ]
        };


        myChart.setOption(examOption, true);
      },
      drawHistogramY() {
        var myChart = echarts.init(document.getElementById('myChart2'));
        var contentOption = {
          grid: {
            top: '5%',
            left: '4%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.examInfo.knowledgePointInfos.map(v => v.knowledgePointName)
          },
          itemStyle: {
            color: '#56F2E3'
          },
          series: [
            {
              name: '知识点分布',
              type: 'bar',
              data: Object.keys(this.examInfo.knowMap).map(v => this.examInfo.knowMap[v])
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              yAxisIndex: [0],
              start: 0,
              end: 30
            }
          ],
        };

        myChart.setOption(contentOption, true);
      },
      drawHistogramX() {
        var myChart = echarts.init(document.getElementById('myChart3'));
        var goalOption = {
          legend: {
            data: ['使用次数', '正确率']
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 30
            }
          ],
          grid: {
            top: '25%',
            left: '3%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          itemStyle: {
            color: '#56F2E3'
          },
          xAxis: [
            {
              type: 'category',
              data: this.examInfo.useCount.map((v, i) => `第${i + 1}题`),
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                // fontSize: 6,
                interval: 0
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '使用次数',
              // min: 0,
              // max: 100,
              // interval: 100/10,
              axisTick: {
                // show:false
              },
              axisLabel: {
                // show: false,
                formatter: '{value} 次'
              },
              splitLine: {
                show: false
              }
            },
            {
              type: 'value',
              name: '正确率',
              // min: 0,
              // max: 100,
              // interval:10,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: '使用次数',
              type: 'bar',
              data: this.examInfo.useCount.map(v => v.value),
            },
            {
              name: '正确率',
              type: 'line',
              yAxisIndex: 1,
              data: this.examInfo.accuracy,
              itemStyle: {
                color: '#F2C760'
              },
            }
          ]
        };


        myChart.setOption(goalOption, true);
      },
      drawHistogramScore(xArr,scoreArr,averageArr) {
        var myChart = echarts.init(document.getElementById('myChart4'));
        // myChart.getDom().style.width = '100%'
        // myChart.resize()
        var goalOption = {
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 25
            }
          ],
          itemStyle: {
            color: '#56F2E3'
          },
          grid: {
            top: '25%',
            left: '3%',
            right: '0',
            bottom: '1%',
            containLabel: true
          },
          legend: {
            data: ['得分', '平均分'],
          },
          xAxis: [
            {
              type: 'category',
              data: xArr,
              axisPointer: {
                type: 'shadow'
              },
              //设置字体倾斜
              axisLabel: {
                interval: 0,
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '得分',
              // min: 0,
              // max: max,
              // interval: max/10,
              axisLabel: {
                formatter: '{value} 分'
              },
            },
            {
              type: 'value',
              name: '平均分',
              // min: 0,
              // max: max,
              // interval:max/10,
              axisLabel: {
                // show: false,
                formatter: '{value} 分'
              },
              nameTextStyle: {
                // color: '#fff'
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [

            {
              name: '得分',
              type: 'bar',
              // data:socre
              data: scoreArr,
            },
            {
              name: '平均分',
              type: 'line',
              yAxisIndex: 1,
              // data:theAverageScore
              data: averageArr,
              itemStyle: {
                color: '#F2C760'
              },
            }
          ]
        };

        myChart.setOption(goalOption, true);
      },
    },
    async mounted() {
      await this.getTestPaperAnalysis()
      this.drawPie()
      this.drawHistogramY()
      this.drawHistogramX()
      // this.drawHistogramScore()
    }
  }
</script>

<style lang="less" scoped>
  .exam-analyse-wrap {
    display: flex;
    flex-direction: column;

    .divider {
      &::after {
        content: ' ';
        display: block;
        width: 30px;
        height: 2px;
        background: @blue;
      }
    }

    &__tab {
      flex: 0 0 48px;
      /*height: 50px;*/
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > div {
        border-radius: 15px;
        font-size: 15px;
        color: #999;
        background: #F5F6FA;
        margin-right: 20px;
        line-height: 30px;
        padding: 0 15px;

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &__pie, &__histogram {
      &-label {
        color: #333;
        font-size: 15px;
        padding-left: 10px;
        line-height: 26px;
        margin-bottom: 10px;
      }

      .chart-pie {
        width: 100%;
        height: 200px;
      }
    }

    &__histogram {
      padding-bottom: 30px;
      margin-bottom: 10px;
    }

    .chart-histogram {
      width: 100%;
      height: 250px;
      &#myChart4 {
        padding-right: 50px;
      }
    }


    .desc {
      padding: 10px;
      border-radius: 5px;
      font-size: 11px;
      color: #999;
      width: 90%;
      margin: 10px auto;
      background: #F5F6FA;
    }

    .score-table {
      border-top: 2px solid @blue;
      overflow-x: hidden;
      width: 100%;
      display: flex;
      font-size: 12px;
      color: #333;
      position: relative;
      /*&::after {*/
      /*  z-index: -1;*/
      /*  position: absolute;*/
      /*  content: ' ';*/
      /*  width: 100%;*/
      /*  height: 86px;*/
      /*  bottom: 0;*/
      /*  left: 0;*/
      /*  background: #e0fffc;*/
      /*}*/
      /*&::before {*/
      /*  z-index: -1;*/
      /*  position: absolute;*/
      /*  content: ' ';*/
      /*  width: 100%;*/
      /*  height: 43px;*/
      /*  top: 0;*/
      /*  left: 0;*/
      /*  background: #e0fffc;*/
      /*}*/

      .col {
        flex: 0 0 89px;

        > div {
          background: #fff;
          line-height: 44px;
          text-align: center;

          &:first-child, &:nth-last-child(2), &:last-child {
            background: #e0fffc;
          }
        }

        &.one-item {
          flex: 1;
        }
      }

      .scroll-content {
        flex: 1;
        overflow-x: auto;
        display: flex;
        white-space: nowrap;
      }
    }

    .tip {
      margin-top: 8px;
      color: #999;
      font-size: 10px;
      display: flex;

      > div {
        background: #F5F6FA;
        padding: 5px 8px;

      }
    }

    .backtop {
      position: fixed;
      right: 10px;
      bottom: 40px;
    }
  }
</style>
