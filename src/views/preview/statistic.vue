<template>
  <section class="statistic-wrap">
    <van-nav-bar
      title="安顺达会计师大家开始打卡机sad啊是的的"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs12 blue" @click="$router.push(`/examAnalyse`)">试卷分析</div>
    </van-nav-bar>
    <div class="statistic-wrap__tab-scroll">
      <div v-for="(item,index) in classList" :key="index" @click="handleSelectTab(item)"
           class="statistic-wrap__tab-scroll-item" :class="{'active':item.active}">{{item.name}}
      </div>
    </div>
    <div style="flex: 1;overflow-y: auto">
      <div class="statistic-wrap__pie-chart">
        <div class="statistic-wrap__pie-chart-label divider">任务完成情况:
          <van-button type="info" class="notice-btn" v-if="!isWk">一键提醒</van-button>
        </div>
        <div id="myChart1" ref="myChart1" class="pie-chart"></div>
      </div>
      <div class="statistic-wrap__achievement">
        <div class="statistic-wrap__achievement-label divider">全班成绩概况:</div>
        <div class="statistic-wrap__achievement-score">
          <div>
            <span>班级平均分</span>
            <span class="red">98分</span>
          </div>
          <div>
            <span>班级最高分</span>
            <span class="red">100分</span>
          </div>
          <div>
            <span>班级最低分</span>
            <span class="red">1分</span>
          </div>
        </div>
      </div>
      <div class="statistic-wrap__histogram" v-if="!isWk&&!isSpoken">
        <div class="statistic-wrap__histogram-label">
          <span class="divider">试卷统计:</span>
          <span class="tag">人数</span>
        </div>
        <div id="myChart2" ref="myChart2" class="histogram-chart"></div>
      </div>
      <div class="statistic-wrap__view" v-if="!isWk">
        <div class="statistic-wrap__view-tab">
          <div class="active">按题目查看</div>
          <div @click="$router.push(`/examView`)">按学生查看</div>
        </div>
        <div v-if="!isSpoken">
          <div class="fs12 black statistic-wrap__view-label">主观题</div>
          <div class="statistic-wrap__view-subject">
            <div class="statistic-wrap__view-subject-item" @click="$router.push(`/subjectList`)" v-for="a in 8" :key="a">
              <div class="pd5">
                <div>主观题(1题)</div>
                <div>平均分: 0.00</div>
                <div>总分:5</div>
              </div>
              <div class="status">已批改</div>
            </div>
          </div>
          <div class="fs12 black statistic-wrap__view-label mgt10">客观题</div>
          <div id="myChart3" ref="myChart3" class="subject-pie"></div>
        </div>
        <div v-else>
          <spoken-table type="statistic"></spoken-table>
        </div>
      </div>
      <div class="statistic-wrap__view" v-else>
        <div class="statistic-wrap__view-tab">
          <div :class="{active:!tabIndex}" @click="tabIndex=0">微课详情</div>
          <div :class="{active:tabIndex}" @click="tabIndex=1">学生心得详情</div>
        </div>
        <div v-if="!tabIndex">
          <video style="width: 100%;" controls src="http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718090841_X3NZH_测试.MP4"></video>
          <div class="statistic-wrap__view-desc">
            <div class="statistic-wrap__view-desc-cover"></div>
            <div class="statistic-wrap__view-desc-content">
              <div class="statistic-wrap__view-desc-content-title fs14">我只是个标题我只是个标题我只是个标题我只是我只是个标题我只是个标题我</div>
              <div class="grey6 fs12">发布者:高分云教育1</div>
              <div class="grey6 fs12 aic desc"><van-icon name="clock-o" />2019-06-03 14:51:45<i class="iconGFY icon-points mglt10"></i>0</div>
            </div>
          </div>
        </div>
        <stu-exp v-else></stu-exp>
      </div>
    </div>

    <div class="statistic-wrap__footer">
      <van-button class="btn" type="info" @click="$router.push(`/addSubScore`)">加分/减分</van-button>
      <van-button class="btn" type="info" @click="$router.push(`/briefing`)">分享报告</van-button>
    </div>


    <van-dialog v-model="stuStatInfo.statDialog" :show-confirm-button="false">
      <div class="stat-dialog-wrap">
        <div class="stat-dialog-wrap__header"><span
          class="stat-dialog-wrap__header-title">{{stuStatInfo.title}}学生</span>
          <van-icon class="icon-close" name="clear" @click="stuStatInfo.statDialog=false"/>
        </div>
        <div class="stat-dialog-wrap__body">
          <div v-for="(item,index) in stuStatInfo.stu" :key="index">{{item}}</div>
        </div>
<!--        <div class="stat-dialog-wrap__footer">-->
<!--          <van-button class="dialog-btn" type="info" @click="stuStatInfo.statDialog=false">确定</van-button>-->
<!--        </div>-->
      </div>
    </van-dialog>
  </section>
</template>

<script>
  import spokenTable from '../../components/spokenTable'
  import echarts from "echarts";
  import stuExp from '../../components/stuExp'
  export default {
    name: "statistic",
    components: {stuExp,spokenTable},
    data() {
      return {
        isSpoken: true,
        tabIndex: 0,
        isWk: true,
        stuStatInfo: {
          title: '',
          stu: ['撒大声地阿达', '撒大声', '撒大', '撒大声地阿', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达', '撒大声地阿达',],
          statDialog: false
        },
        classList: [{name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'}, {name: '龙江智慧一般'},],
      }
    },
    methods: {
      handleSelectTab(item) {
        if (item.active) return
        this.classList.forEach(v => {
          this.$set(v, 'active', false)
        })
        item.active = true
      },
      drawPie() {
        this.$nextTick(() => {
          let myChart = echarts.init(this.$refs.myChart1);
          // 绘制图表
          var _option = {
            // title: {
            //   text: '任务完成情况',
            //   x: 20,
            //   y: 10
            // },
            calculable: true,
            // tooltip: {
            //   trigger: 'item',
            //   formatter: "{a} <br/>{b} : {c} ({d}%)"
            // },
            color: ['#FB5522', '#2BFF93'],
            series: [
              {
                name: '文言文全章复习与巩固',
                type: 'pie',
                radius: [0, 53],
                // center: [150, 170],
                label: {
                  // normal: {
                  //   show: true
                  // },
                  emphasis: {
                    show: true
                  },
                  position: 'outside',
                  formatter: `{b}{d}%>\n({c}人)`,
                  align: 'left'
                },
                lableLine: {
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
                  {value: 2, name: '未完成'},
                  {value: 4, name: '已完成'}
                ]
              }
            ],
            // toolbox: {
            // 	show: true,
            // 	feature: {
            // 		mark: {show: true},
            // 		dataView: {show: true, readOnly: false},
            // 		magicType: {
            // 			show: true,
            // 			type: ['pie', 'funnel']
            // 		},
            // 		restore: {show: true},
            // 		saveAsImage: {show: true}
            // 	}
            // }
          };
          myChart.setOption(_option)
          myChart.on('click', params => {
            console.log(params, '=3=3=');
            this.stuStatInfo.statDialog = true
            this.stuStatInfo.title = params.name
          })
        });
      },
      drawHistogram() {
        var myChart = echarts.init(document.getElementById('myChart2'));
        // 指定图表的配置项和数据
        var paperOption = {
          calculable: true,
          // tooltip: {
          //   trigger: 'item',
          //   formatter: "{b} : {c}人"
          // },
          // legend: {
          //   data: ['人数']
          // },
          xAxis: {
            data: ['0-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            axisLabel: {
              // fontSize: 6,
              interval: 0
            },
            // splitLine: {
            //   interval: 0,
            //   show: true
            // }
          },
          yAxis: {},
          series: [
            {
              name: '人数',
              type: 'bar',
              data: ['800', '200', '300', '199', '499', '299'],
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption);
      },
      drawObjectivePie() {
        var myChart = echarts.init(document.getElementById('myChart3'));
        myChart.getDom().style.height = Math.ceil(4 / 6) * 60 + 'px'
        myChart.resize()
        // 指定图表的配置项和数据
        let arr = []
        for (let i = 0; i < 4; i++) {
          console.log(((i % 6 == 0 || i / 6 > 1) ? Math.floor(i / 6) * 50 : 0));
          arr.push({
            name: `第${i + 1}题`,
            type: 'pie',
            radius: [22, 26],
            center: [28 + i % 6 * 60, 28 + (((i + 1) / 6 > 1) ? Math.floor(i / 6) * 60 : 0)],
            label: {
              show: false,
              position: 'center',
              formatter: ''
            },
            hoverAnimation: false,
            data: [
              {
                value: i, name: '正确率', label: {
                  show: true,
                  position: 'center',
                  formatter: '{a}\n{d}%',
                  textStyle: {
                    baseline: 'bottom',
                    fontSize: 12,
                    color: '#000'
                  }
                },
              },
              {value: i * 3, name: '错误率'}
            ]
          })

        }
        var questionOption = {
          color: ['#FF6666', '#5EF0A6'],
          series: arr
        };

        myChart.setOption(questionOption);

        myChart.on('click', params => {
          console.log(params, '=3=3=');
          this.$router.push(`/subjectAnalyse`)
        })
      }
    },
    mounted() {
      this.drawPie()
      if(!this.isWk&&!this.isSpoken) {
        this.drawHistogram()
        this.drawObjectivePie()
      }
    }
  }
</script>

<style lang="less" scoped>
  .statistic-wrap {
    background: #f5f5f5;
    flex-direction: column;
    display: flex;

    .pie-chart {
      width: 100%;
      height: 160px;
      margin: 0 auto;
    }

    .subject-pie {
      width: 100%;
      margin: 0 auto;
    }

    .histogram-chart {
      width: 100%;
      height: 300px;
      margin: 0 auto;
    }

    .divider {
      &::after {
        content: ' ';
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
          background: linear-gradient(0deg, rgba(57, 240, 221, 1),rgba(140, 247, 238, 1));
          color: #fff;
        }
      }
    }

    &__pie-chart {
      background: #fff;
      padding: 15px 10px;

      &-label {
        font-size: 15px;
        color: #333;

        .notice-btn {
          font-size: 12px;
          color: #fff;
          width: 82px;
          border-radius: 11px;
          height: 26px;
          line-height: 26px;
        }
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

          .red {
            color: #ff6666;
            margin-top: 8px;
          }
        }
      }
    }

    &__histogram {
      margin-top: 5px;
      padding: 15px 10px;
      background: #fff;

      &-label {
        font-size: 15px;
        line-height: 26px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tag {
          font-size: 10px;

          &::before {
            background: @graOrange;
            display: inline-block;
            width: 19px;
            height: 9px;
            content: ' ';
            margin-right: 5px;
          }
        }
      }
    }

    &__view {
      padding: 15px 10px;
      margin-top: 5px;
      background: #fff;
      >video {
        width: 100%;
        height: 200px;
      }

      &-tab {
        display: flex;
        margin-bottom: 16px;

        > div {
          background: #f5f6fa;
          border-radius: 11px;
          font-size: 14px;
          color: #333;
          line-height: 26px;
          text-align: center;
          padding: 0 9px;
          margin-right: 8px;

          &.active {
            background: @graOrange;
            color: #fff;
          }
        }
      }

      &-label {
        line-height: 24px;
        margin-bottom: 10px;

        &::after {
          width: 18px;
          content: " ";
          display: block;
          height: 2px;
          background: @blue;
        }
      }

      &-subject {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &-item {
          border: 1px solid #fbdd31;
          color: #333;
          font-size: 10px;
          margin-bottom: 5px;
          flex: 0 0 80px;

          .status {
            color: #fff;
            background: @graOrange;
            display: flex;
            height: 18px;
            align-items: center;
            justify-content: center;
          }
        }
      }

      &-desc {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-cover {
          flex: 0 0 69px;
          height: 74px;
          border-radius: 5px;
          background: #b9fff8;
          margin-right: 4px;
        }
        &-content {
          .desc {
            i {
              margin-right: 3px;
            }
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn {
        border-radius: 22px;
        color: #fff;
        font-size: 18px;
        flex: 1;

        &:first-child {
          margin-right: 23px;
        }
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
  }
</style>
