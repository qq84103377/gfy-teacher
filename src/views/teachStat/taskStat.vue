<template>
  <section class="task-stat-wrap">
    <van-cell title="资源类型" style="background: #f5f5f5;color: #999"/>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="学生任务统计" name="1">
        <div class="van-hairline--bottom">
          <div class="echart-label">各类任务数分布情况:</div>
          <div id="myChart1" ref="myChart1" class="pie-chart"></div>
        </div>
        <div class="mgt10 van-hairline--bottom">
          <div class="echart-label"><div class="aic jcsb"><span>任务完成情况分布:</span><div class="tag">人数</div></div></div>
          <div id="myChart2" ref="myChart2" class="histogram-chart"></div>
        </div>
        <div class="mgt10">
          <div class="echart-label">学生任务完成情况</div>
          <div class="fs10 grey9 mgt5">（需要查看更加详细的数据，请登录PC端）</div>

          <div class="stat-table">
            <div class="col">
              <div style="font-weight: bold;">姓名</div>
              <div v-for="(item,index) in statInfo.statAccountList" :key="index">{{item.account_no|getStudentName(60)}}</div>
            </div>
            <div class="row-wrap">
              <div class="row" style="font-weight: bold;">
                <div>总任务数</div>
                <div>完成总任务数</div>
                <div>完成微课程任务数</div>
                <div>完成素材任务数</div>
                <div>完成试卷任务数</div>
                <div>完成讨论任务数</div>
                <div v-if="filterParams.subjectType === 'S03'">完成口语任务数</div>
                <div>做题正确率</div>
                <div>任务完成率</div>
              </div>
              <div class="row" v-for="(item,index) in statInfo.statAccountList" :key="index">
                <div>{{item.total_count}}</div>
                <div>{{item.total_finish}}</div>
                <div>{{item.tv_count}}</div>
                <div>{{item.T04_count}}</div>
                <div>{{item.paper_count}}</div>
                <div>{{item.discuss_count}}</div>
                <div v-if="filterParams.subjectType === 'S03'">{{item.T13_count}}</div>
                <div>{{item.accuracy || 0}}</div>
                <div>{{item.finish_precent}}</div>
              </div>
            </div>
          </div>
          <div class="tip">可在表格内滑动，查看学生更多任务情况</div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="教师统计" name="2">
        <div class="stat-table">
          <div class="col bg">
            <div style="font-weight: bold;">姓名</div>
            <div>是的打开发看</div>
          </div>
          <div class="row-wrap blank-right">
            <div class="row" style="font-weight: bold;">
              <div>已结束课程</div>
              <div>课前任务数</div>
              <div>学生课前完成率</div>
              <div>随堂任务数</div>
              <div>已结束任务</div>
              <div>学生任务完成率</div>
            </div>
            <div class="row">
              <div>123</div>
              <div>123</div>
              <div>123</div>
              <div>123</div>
              <div>123</div>
              <div>123</div>
            </div>
          </div>
          <div class="col bg fixed-right">
            <div style="font-weight: bold;">课堂次数</div>
            <div>22</div>
          </div>
        </div>
        <div class="tip">
          <div>1.可在表格白色区域内左右滑动查看更多信息</div>
          <div>2.点击学生课堂次数查看展开课堂情况</div>
        </div>

      </van-collapse-item>
      <van-collapse-item title="班级统计" name="3">

      </van-collapse-item>
      <van-collapse-item title="个人统计" name="4">

      </van-collapse-item>
    </van-collapse>
  </section>
</template>

<script>
  import {statCourseByTeacher} from '@/api/index'
  import echarts from "echarts";

  export default {
    name: "taskStat",
    data() {
      return {
        activeNames: ['1'],
        gradeSubjectList: JSON.parse(JSON.stringify(this.$parent.gradeSubjectList)),
        statInfo: {taskTypeCount:[],finishStat:{},statAccountList: []}
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
    watch: {
      filterParams: {
        handler() {
          this.init()
        },
        deep: true
      }
    },
    created() {
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        await this.statCourseByTeacher()
        this.drawPie()
        this.drawHistogram()
      },
      drawHistogram() {
        var myChart = echarts.init(document.getElementById('myChart2'));
        // 指定图表的配置项和数据
        var paperOption = {
          calculable: true,
          grid: {
            top: '15%',
            left: '0%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            data: ['0-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            axisLabel: {
              // fontSize: 6,
              interval: 0
            },
          },
          yAxis: {},
          series: [
            {
              name: '人数',
              type: 'bar',
              data: [this.statInfo.finishStat['finish_0_50'] || 0,this.statInfo.finishStat['finish_50_60'] || 0,this.statInfo.finishStat['finish_60_70'] || 0,this.statInfo.finishStat['finish_70_80'] || 0,this.statInfo.finishStat['finish_80_90'] || 0,this.statInfo.finishStat['finish_90_100'] || 0],
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption, true);
      },
      drawPie() {
        let myChart = echarts.init(this.$refs.myChart1);
        // 绘制图表
        var _option = {
          calculable: true,
          color: ['#B3E850', '#67E0A3','#F792F3','#FCA361','#FBDD31','#74F8E1','#f00','#2736F7'],
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
                formatter: `{b}`,
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
              data: this.statInfo.taskTypeCount.map(v => {
                return {value:v.taskTypeCount,name:v.taskTypeName}
              })
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
        myChart.setOption(_option, true)
      },
      async statCourseByTeacher() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectTypeNot: 'S20',
          ...this.filterParams
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
       await statCourseByTeacher(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if(res.flag&&res.data[0]) {
            this.statInfo = res.data[0]
          }else {
            this.$toast(res.msg)
            this.statInfo =  {taskTypeCount:[],finishStat:{},statAccountList:[]}
          }

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .task-stat-wrap {
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
      .tag {
        font-size: 10px;
        &:before {
          background: #FEB524;
          vertical-align: middle;
          content: ' ';
          width: 20px;
          height: 10px;
          margin-right: 2px;
          display: inline-block;
        }
      }
    }
    .pie-chart {
      width: 100%;
      height: 200px;
    }
    .histogram-chart {
      width: 100%;
      height: 300px;
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
        margin-left: 81px;
        &.blank-right {
          margin-right: 81px;
        }
      }
      .row,.col {
        display: flex;
        flex-wrap: nowrap;
        >div {
          padding: 0 10px;
          color: #333;
          flex: 0 0 80px;
          height: 44px;
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
        >div {
          width: 80px;
          &.active {
            color: #16AAB7;
          }
        }
        &.bg {
          >div {
            background: #E0FFFC;
          }
        }
        &.fixed-right {
          right: 0;
          left: auto;
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
</style>
