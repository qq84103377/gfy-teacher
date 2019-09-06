<template>
  <section class="statistic-wrap">
    <van-nav-bar
      :title="info.taskName"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs12 blue" @click="viewAnalyse">试卷分析</div>
    </van-nav-bar>
    <div class="statistic-wrap__tab-scroll" v-if="$route.query.type != 'inClass'">
      <div v-for="(item,index) in info.tchClassTastInfo" :key="index" @click="handleSelectTab(item)"
           class="statistic-wrap__tab-scroll-item" :class="{'active':item.active}">{{item.className}}
      </div>
    </div>
    <div style="flex: 1;overflow-y: auto">
      <div class="statistic-wrap__pie-chart">
        <div class="statistic-wrap__pie-chart-label divider">任务完成情况:
          <van-button type="info" class="notice-btn" v-if="!isWk&&$route.query.type != 'inClass'">一键提醒</van-button>
        </div>
        <div id="myChart1" ref="myChart1" class="pie-chart"></div>
      </div>
      <div class="statistic-wrap__achievement">
        <div class="statistic-wrap__achievement-label divider">全班成绩概况:</div>
        <div class="statistic-wrap__achievement-score">
          <div>
            <span>班级平均分</span>
            <span class="red">{{taskFinishInfo.finshCount>0?(taskFinishInfo.totalScore / taskFinishInfo.finshCount).toFixed(2):0}}分</span>
          </div>
          <div>
            <span>班级最高分</span>
            <span class="red">{{taskFinishInfo.maxScore}}分</span>
          </div>
          <div>
            <span>班级最低分</span>
            <span class="red">{{taskFinishInfo.minScore}}分</span>
          </div>
        </div>
      </div>
      <div class="statistic-wrap__histogram" v-if="isTestPaper">
        <div class="statistic-wrap__histogram-label">
          <span class="divider">试卷统计:</span>
          <span class="tag">人数</span>
        </div>
        <div id="myChart2" ref="myChart2" class="histogram-chart"></div>
      </div>
      <div class="statistic-wrap__view" v-if="isWk">
        <div class="statistic-wrap__view-tab">
          <div class="active">按题目查看</div>
          <div @click="$router.push({name:`examView`,params:{info:taskFinishInfo,title:info.taskName}})">按学生查看</div>
        </div>
        <div v-if="!isSpoken">
          <div v-if="taskFinishInfo.examstat.some(v => v.auto_scoring === '0')">
            <div class="fs12 black statistic-wrap__view-label">主观题</div>
            <div class="statistic-wrap__view-subject">
              <div class="statistic-wrap__view-subject-item" @click="$router.push(`/subjectList`)" v-for="(item,index) in taskFinishInfo.examstat"
                   :key="index" v-if="item.auto_scoring === '0'">
                <div class="pd5">
                  <div>第{{item.exam_index}}题</div>
                  <div>平均分: {{item.avg_score}}</div>
                  <div>总分:{{item.total_score}}</div>
                </div>
                <div class="status">{{(item.student_finish_count > 0 && item.finish_count == item.student_finish_count)? '已批改':'批改'}}</div>
              </div>
            </div>
          </div>
          <div v-if="taskFinishInfo.examstat.some(v => v.auto_scoring === '1')">
            <div class="fs12 black statistic-wrap__view-label mgt10">客观题</div>
            <div id="myChart3" ref="myChart3" class="subject-pie"></div>
          </div>
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
          <video style="width: 100%;" controls
                 src="http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718090841_X3NZH_测试.MP4"></video>
          <div class="statistic-wrap__view-desc">
            <div class="statistic-wrap__view-desc-cover"></div>
            <div class="statistic-wrap__view-desc-content">
              <div class="statistic-wrap__view-desc-content-title fs14">我只是个标题我只是个标题我只是个标题我只是我只是个标题我只是个标题我</div>
              <div class="grey6 fs12">发布者:高分云教育1</div>
              <div class="grey6 fs12 aic desc">
                <van-icon name="clock-o"/>
                2019-06-03 14:51:45<i class="iconGFY icon-points mglt10"></i>0
              </div>
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
  import {statTaskStat} from '@/api/index'
  import {getStudentName} from '@/utils/filter'
  export default {
    name: "statistic",
    components: {stuExp, spokenTable},
    data() {
      return {
        isSpoken: false,
        tabIndex: 0,
        isWk: true,
        stuStatInfo: {
          title: '',
          stu: [],
          statDialog: false
        },
        // info: JSON.parse(JSON.stringify(this.$route.query.info)),
        info: JSON.parse(localStorage.getItem('stat')),
        taskFinishInfo: {examstat:[]}
      }
    },
    computed: {
      isTestPaper() {
        return this.$route.query.testPaperId > 0
      }
    },
    methods: {
      viewAnalyse() {
        if(!this.isTestPaper) return this.$toast('不含试卷,无法查看分析')
        this.$router.push(`/examAnalyse?taskId=${this.info.taskId}&classId=${this.info.tchClassTastInfo.find(t => t.active).classId}&testPaperId=${this.$route.query.testPaperId}`)
      },
      async statTaskStat(classId = this.info.tchClassTastInfo[0].classId) {
         let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.info.taskId,
          classId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
      await statTaskStat(params).then(res => {
          if(res.flag) {
            this.taskFinishInfo = res.data[0]
          }else {
            this.$toast(res.msg)
          }
        })
      },
     async handleSelectTab(item) {
        if (item.active) return
       this.$store.commit('setVanLoading',true)
       this.info.tchClassTastInfo.forEach(v => {
          this.$set(v, 'active', false)
        })
        item.active = true

       await this.statTaskStat(item.classId)
       this.$store.commit('setVanLoading',false)
       this.drawPie()
       if(this.isTestPaper) {
         this.drawHistogram()
       }
        this.drawObjectivePie()
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
                  {value: this.taskFinishInfo.studentUnfinishList.reduce((t,v) => {
                      t += v.accountNoList.length
                      return t
                    },0), name: '未完成'},
                  {value: this.taskFinishInfo.finshCount, name: '已完成'}
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
          myChart.setOption(_option,true)
          myChart.on('click', params => {
            this.stuStatInfo.stu = []
            this.stuStatInfo.title = params.name
            if(params.name === '未完成') {
              this.taskFinishInfo.studentUnfinishList.forEach(v => {
                v.accountNoList.forEach(s => {
                  const name = getStudentName(s,this.info.tchClassTastInfo.find(t => t.active).classId)
                  this.stuStatInfo.stu.push(name)
                })
              })
            }else {
              this.taskFinishInfo.finishStudent.reduce((t,v) => {
                const name = getStudentName(v,this.info.tchClassTastInfo.find(t => t.active).classId)
                t.push(name)
                return t
              },this.stuStatInfo.stu)
            }

            this.stuStatInfo.statDialog = true
          })
        });
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
              data: Object.keys(this.taskFinishInfo.testPaperStat).map(v => this.taskFinishInfo.testPaperStat[v]),
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption,true);
      },
      drawObjectivePie() {
        //有客观题才渲染
        if(this.taskFinishInfo.examstat.some(v => v.auto_scoring === '1')) {
          var myChart = echarts.init(document.getElementById('myChart3'));
          const objectiveList = this.taskFinishInfo.examstat.filter(v => v.auto_scoring === '1')
          myChart.getDom().style.height = Math.ceil(objectiveList.length / 6) * 60 + 'px'
          myChart.resize()
          // 指定图表的配置项和数据
          let arr = []
          for (let i = 0; i < objectiveList.length; i++) {
            const correct = Number((objectiveList[i].exam_present.split("%")[0])/100)
            arr.push({
              name: `第${objectiveList[i].exam_index}题`,
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
                  value: correct, name: '正确率', label: {
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
                {value: 1 - correct, name: '错误率'}
              ]
            })
          }
          var questionOption = {
            color: ['#5EF0A6','#FF6666' ],
            series: arr
          };

          myChart.setOption(questionOption,true);

          myChart.on('click', params => {
            console.log(params, '=3=3=');
            const questionList = this.taskFinishInfo.examstat.filter(v => v.auto_scoring === '1')
           const item = questionList[params.seriesIndex]
           const classId = this.info.tchClassTastInfo.find(t => t.active).classId
            // this.$router.push(`/subjectAnalyse?taskId=${this.info.taskId}&examId=${item.exam_id}&classId=${classId}&groupId=${item.group_id}`)
            this.$router.push({path:'/subjectAnalyse',query:{
                taskId:this.info.taskId,
                examId:item.exam_id,
                groupId:item.group_id,
                classId,
                questionList
              }})
          })
        }
      }
    },
   async mounted() {
      this.$store.commit('setVanLoading',true)
     await this.statTaskStat()
     this.$store.commit('setVanLoading',false)
     this.drawPie()
     if(this.isTestPaper) {
       this.drawHistogram()
     }
     this.drawObjectivePie()
     if (!this.isWk && !this.isSpoken) {
      }
    },
    created() {
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
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
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

      > video {
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

        &-item {
          border: 1px solid #fbdd31;
          color: #333;
          font-size: 10px;
          margin-bottom: 5px;
          flex: 0 0 80px;
          margin-right: 8px;
          &:nth-child(4n) {
            margin-right: 0;
          }
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
