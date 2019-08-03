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
      <div class="desc">本张试卷包括题型为1道单选题，1道文言文阅读，难度为简单：0%，中等：0%，困难：100%， 知识点涵盖字词积累、修改病句。</div>
    </div>
    <div ref="scrollCtn" style="flex: 1;overflow-y: auto" class="pd10" v-show="!isExam">
      <div class="score-table">
        <div class="col">
          <div>#</div>
          <div v-for="a in 25" :key="a" @click="handleCharts(a)">陈超怀</div>
          <div>平均分</div>
          <div>得分率</div>
        </div>
        <div class="scroll-content">
          <div v-for="a in 5" :key="a" class="col">
            <div @click="handleCharts(a)">第一题</div>
            <div v-for="a in 25" :key="a">5</div>
            <div>33%</div>
            <div>10%</div>
          </div>
        </div>
        <div class="col">
          <div>总分</div>
          <div v-for="a in 25" :key="a">6</div>
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

  export default {
    name: "examAnalyse",
    data() {
      return {
        isExam: true,
        scoreChartShow: false,
      }
    },
    methods: {
      backTop() {
        this.$refs['scrollCtn'].scrollTo(0, 0)
      },
      handleCharts(index) {
        this.scoreChartShow = true
        this.$nextTick(() => {
          this.drawHistogramScore(index)
          this.$refs['scrollCtn'].scrollTo(0, this.$refs['scrollCtn'].scrollHeight)
        })
      },
      drawPie() {
        var myChart = echarts.init(document.getElementById('myChart1'));
        var color2 = ['#01B9FF', '#ffb91f', '#52c9ce', '#f15c6d', '#f15c6d', '#355e82', '#ce6382', '#8331f1'];
        var examOption = {
          // color:color2,
          // title: {
          //   text: '题型分布',
          //   left:'center'
          // },
          // tooltip: {
          //   trigger: 'item',
          //   formatter: "{a} <br/>{b}: {c} ({d}%)"
          // },
          // legend: {
          //   orient: 'vertical',
          //   x: 'left',
          //   data:['单选题','文言文阅读']
          // },
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
              data: [{name: '单选题', value: 1}, {name: '文言文阅读', value: 2},]
            },
            {
              name: '试卷题型难度',
              type: 'pie',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}:{d}%"
              },
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
              data: [{name: '简单', value: 1, itemStyle: {color: '#F2F056'}}, {
                name: '中等',
                value: 2,
                itemStyle: {color: '#56F2E3'}
              }, {name: '困难', value: 3, itemStyle: {color: '#FF9777'}},]
            }
          ]
        };


        myChart.setOption(examOption);
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
            data: ['单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '单选题', '多选题', '作文']
          },
          itemStyle: {
            color: '#56F2E3'
          },
          series: [
            {
              name: '知识点分布',
              type: 'bar',
              data: ['2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '2', '5', '9']
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

        myChart.setOption(contentOption);
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
            top: '15%',
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
              data: ['第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题',],
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
              data: ['23', '2', '4', '55', '23', '2', '4', '23', '2', '4', '55', '23', '2', '4',],
            },
            {
              name: '正确率',
              type: 'line',
              yAxisIndex: 1,
              data: ['2', '1', '4', '2', '1', '2', '33', '2', '1', '4', '2', '1', '2', '33'],
              itemStyle: {
                color: '#F2C760'
              },
            }
          ]
        };


        myChart.setOption(goalOption);
      },
      drawHistogramScore(index) {
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
            top: '15%',
            left: '3%',
            right: '15%',
            bottom: '1%',
            containLabel: true
          },
          legend: {
            data: ['得分', '平均分']
          },
          xAxis: [
            {
              type: 'category',
              data: ['第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题', '第一题',],
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
                show: false,
                formatter: '{value} 分'
              },
              nameTextStyle: {
                color: '#fff'
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
              data: ['23', '2', '4', '55', '23', '2', '4', '23', '2', '4', '55', '23', '2', '4',],
            },
            {
              name: '平均分',
              type: 'line',
              yAxisIndex: 1,
              // data:theAverageScore
              data: [index, '1', '4', '2', '1', '2', '33', '2', '1', '4', '2', '1', '2', '33'],
              itemStyle: {
                color: '#F2C760'
              },
            }
          ]
        };

        myChart.setOption(goalOption);
      },
    },
    mounted() {
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
          background: linear-gradient(0deg, rgba(140, 247, 238, 1), rgba(57, 240, 221, 1));
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
      }

      .chart-pie {
        width: 100%;
        height: 200px;
      }
    }

    &__histogram {
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .chart-histogram {
      width: 100%;
      height: 200px;
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
