<template>
  <section class="report-detail">
    <van-nav-bar
      :title="stuList[stuIndex].accountNo|getStudentName(stuList[stuIndex].classId)"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs14 blue" @click="">生成报告</div>
    </van-nav-bar>
    <div class="report-detail__tab">
      <div @click="toggleTab(item,index)" :class="['report-detail__tab-item',{'blue':item.active}]"
           v-for="(item,index) in tabList" :key="index">{{item.name}}
      </div>
    </div>
    <div class="report-detail__body">
      <van-cell v-for="(item,index) in subjectList" :key="index">
        <div slot="title">
          <div @click="selectItem(item,index)" class="aic jcsb">
            <span>{{item.name}}</span>
            <van-icon :name="item.fold?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="item.fold">
            <div v-show="tabIndex===0">
              <div :id="'knowledge'+index" class="histogram-chart mgt10"></div>
              <div class="stat-table">
                <div class="col">
                  <div style="font-weight: bold;">知识点名称</div>
                  <div class="regular-height" v-for="(item,index) in 10" :key="index">as空间的哈数据库的哈数据肯定</div>
                </div>
                <div class="row-wrap">
                  <div class="row row-header" style="font-weight: bold;">
                    <div style="flex: 0 0 33%">正确数</div>
                    <div style="flex: 0 0 33%">总题数</div>
                    <div style="flex: 0 0 33%">掌握程度</div>
                    <div style="flex: 0 0 33%">班级平均掌握程度</div>
                    <div style="flex: 0 0 33%">建议</div>
                  </div>
                  <div class="row" v-for="(item,index) in 10" :key="index">
                    <div style="flex: 0 0 33%">{{item}}</div>
                    <div style="flex: 0 0 33%">{{item}}</div>
                    <div style="flex: 0 0 33%">{{item}}</div>
                    <div style="flex: 0 0 33%">{{item}}</div>
                    <div class="regular-height" style="flex: 0 0 33%;flex-direction: column;text-align: left">
                      <div>①该知识点的练习量一般，建议使用“自主学习--测试---测试”功能进行深入检测。</div>
                      <div>②该知识点的掌握程度较低，建议使用“自主学习--学习--微课”功能重新梳理知识点；使用“自主学习--学习--素材”功能，
                        巩固老师课堂所讲知识点。
                      </div>
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
                  <div>总任务数为20个，已完成任务数为15个；</div>
                  <div>完成任务占比为：75%。</div>
                  <div class="red">完成情况表现:较差,需要继续加强任务的完成率,积极完成老师布置的任务.</div>
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

  export default {
    name: "reportDetail",
    data() {
      return {
        tabList: [
          {name: '知识点掌握情况', active: true},
          {name: '任务完成情况', active: false},
          {name: '成绩趋势分析', active: false},
        ],
        subjectList: [{name:'语文'},{name: '数学'},{name: '英语'}],
        stuList: JSON.parse(JSON.stringify(this.$route.params.stuList)),
        stuIndex: this.$route.params.stuIndex,
      }
    },
    computed: {
      tabIndex() {
        return this.tabList.findIndex(v => v.active)
      }
    },
    methods: {
      toggleStu(type) {
        if(type) {
          //下一个
          if(this.stuIndex < this.stuList.length - 1) {
            //可以下一个
            this.stuIndex++
          }else {
            this.$toast('没有下一个了')
          }
        }else {
          //上一个
          if(this.stuIndex > 0) {
            //可以上一个
            this.stuIndex--
          }else {
            this.$toast('没有上一个了')
          }
        }
      },
      selectItem(item,index) {
        this.$set(item,'fold',!item.fold)
        if(!item.fold) return
        this.$nextTick(() => {
          if(this.tabIndex===0) {
            this.drawHistogram1(index)
          }else if(this.tabIndex===1) {
            this.drawHistogram2(index)
          }else if(this.tabIndex===2) {
            this.drawHistogram3(index)
          }
        })
      },
      toggleTab(item,index) {
        this.tabList.forEach(v => {
          v.active = false
        })
        item.active = true
        const subIndex = this.subjectList.findIndex(v => v.fold)
        if(subIndex>-1) {
         this.$nextTick(() => {
           if(index===0) {
             this.drawHistogram1(subIndex)
           }else if (index ===1) {
             this.drawHistogram2(subIndex)
           }else if (index ===2) {
             this.drawHistogram3(subIndex)
           }
         })
        }
      },
      drawHistogram1(index) {
        var myChart = echarts.init(document.getElementById('knowledge' + index));
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
              end: 100 / 3
            }
          ],
          legend: {
            data: ['总题数', '正确数', '掌握数']
          },
          xAxis: [
            {
              type: 'category',
              data: ['sdssd', '硕大的', '小程序'],
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
              // min: 0,
              // max: 3,
              // interval: 3 / 5,
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
              data: [1, 2, 3]
            },
            {
              name: '正确数',
              type: 'bar',
              data: [4, 5, 6]
            },
            {
              name: '掌握度',
              type: 'line',
              yAxisIndex: 1,
              data: [7, 8, 9]
            }
          ]
        };
        myChart.setOption(option1, true);

      },
      drawHistogram2(index) {
        var myChart = echarts.init(document.getElementById('task'+index));
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
              end: 100 / 3
            }
          ],
          legend: {
            data: ['任务数','已完成任务数']
          },
          xAxis: [
            {
              type: 'category',
              data: ['sdssd', '硕大的', '小程序'],
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
              name: '任务数',
              // min: 0,
              // max: 3,
              // interval: 3 / 5,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '已完成任务数',
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
              name: '任务数',
              type: 'bar',
              data: [1, 2, 3]
            },
            {
              name: '已完成任务数',
              type: 'bar',
              data: [4, 5, 6]
            }
          ]
        };
        myChart.setOption(option1, true);

      },
      drawHistogram3(index) {
        var myChart = echarts.init(document.getElementById('score'+index));
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
              end: 100 / 3
            }
          ],
          xAxis: [
            {
              // type: 'value',
              data: ['2019-02-01', '2019-03-01', '2019-04-01'],
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
              name: '日期',
              type: 'line',
              data: [80, 20, 30]
            }
          ]
        };
        myChart.setOption(option1, true);

      },
    },
    mounted() {

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
        >div:last-child {
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
