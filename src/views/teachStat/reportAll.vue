<template>
  <section class="report-all-wrap">
    <van-nav-bar
      :title="decodeURI($route.query.stuName)+'的家庭报告'"
      @click-left="goBack"
      :left-arrow="isApp"/>
    <div class="report-all-wrap__body">
      <div class="fs16" style="font-weight: bold;">一、知识点掌握情况</div>
      <div>
        <div v-for="(item,index) in subjectList" :key="index">
          <div class="fs15 mgt10">{{index+1}}.{{item.subjectName}}</div>
          <div style="position: relative;">
            <div :id="'knowledge'+index" class="histogram-chart mgt10"></div>
            <div class="tip">可在表格内滑动，查看更多内容</div>
            <div class="empty-tip" v-if="!item.kngArr.length">当前无数据~</div>
          </div>
          <div class="stat-table">
<!--            <div class="col">-->
<!--              <div style="font-weight: bold;">知识点名称</div>-->
<!--              <div class="regular-height" v-for="(kng,kngIndex) in item.kngArr" :key="kngIndex">{{kng.name}}</div>-->
<!--            </div>-->
<!--            <div class="row-wrap">-->
              <div class="row row-header" style="font-weight: bold;">
                <div style="flex: 0 0 28%">知识点名称</div>
                <div style="flex: 0 0 16%">正确数</div>
                <div style="flex: 0 0 16%">总题数</div>
                <div style="flex: 0 0 20%">掌握程度</div>
                <div style="flex: 0 0 20%;line-height: initial">班级平均掌握程度</div>
              </div>
              <div class="row" v-for="(kng,kngIndex) in item.kngArr" :key="kngIndex">
                <div style="flex: 0 0 28%">{{kng.name}}</div>
                <div style="flex: 0 0 16%">{{kng.currentNum}}</div>
                <div style="flex: 0 0 16%">{{kng.totalNum}}</div>
                <div style="flex: 0 0 20%">{{kng.masteryNum}}</div>
                <div style="flex: 0 0 20%">{{kng.sdadsa}}</div>
              </div>
<!--            </div>-->
          </div>
          <div v-if="item.kngArr.length" class="tip">
            <div>数据分析:</div>
            <div v-html="handleSuggest(item)">
            </div>
          </div>
          <div v-if="!item.kngArr.length" class="empty-page">
            <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
            <div class="grey9 fs12">当前没有数据~</div>
          </div>
        </div>
      </div>
      <div class="fs16" style="font-weight: bold;">二、任务完成情况</div>
      <div>
        <div v-for="(item,index) in subjectList" :key="index">
          <div class="fs15 mgt10">{{index+1}}.{{item.subjectName}}</div>
<!--          <div style="position: relative;">-->
<!--            <div :id="'task'+index" class="histogram-chart mgt10"></div>-->
<!--            <div class="tip">可在表格内滑动，查看更多内容</div>-->
<!--            <div class="empty-tip" v-if="!item.statInfo.arrLength">当前无数据~</div>-->
<!--          </div>-->
          <div class="stat-table">
            <div class="row row-header" style="font-weight: bold;">
              <div style="flex: 0 0 34%">任务类型</div>
              <div style="flex: 0 0 33%">任务数</div>
              <div style="flex: 0 0 33%">已完成任务数</div>
            </div>
            <div class="row" v-for="(task,taskIndex) in item.statInfo.taskArr" :key="taskIndex">
              <div style="flex: 0 0 34%">{{task.name}}</div>
              <div style="flex: 0 0 33%">{{task.total_count||0}}</div>
              <div style="flex: 0 0 33%">{{task.total_finish||0}}</div>
            </div>
          </div>
          <div class="data-analyse fs12">
            <div style="font-weight: bold;">数据分析:</div>
            <div class="grey9" v-if="item.statInfo.taskArr.length">
              <div>总任务数为{{item.statInfo.total}}个，已完成任务数为{{item.statInfo.finish}}个；</div>
              <div>完成任务占比为：{{item.statInfo.percent|mul(100,0)}}%。</div>
              <div class="red">完成情况表现:{{item.statInfo.suggest}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fs16" style="font-weight: bold;">三、成绩趋势分析</div>
      <div>
        <div v-for="(item,index) in subjectList" :key="index">
          <div class="fs15 mgt10">{{index+1}}.{{item.subjectName}}</div>
          <div style="position: relative;">
            <div :id="'score'+index" class="histogram-chart mgt10"></div>
            <div class="tip">可在表格内滑动，查看更多内容</div>
            <div class="empty-tip" v-if="!item.scoreInfo.minDate">当前无数据~</div>
          </div>
          <div class="data-analyse fs12">
            <div style="font-weight: bold;">数据分析:</div>
            <div class="grey9" v-if="item.scoreInfo.minDate">
              <div>
                当前科目记录成绩的任务总共有{{item.scoreInfo.total}}个，其中成绩最高的为{{item.scoreInfo.maxDate}},成绩为：{{item.scoreInfo.maxScore}},班级平均成绩为：{{item.scoreInfo.maxAvg}}。
              </div>
              <div>成绩最低为{{item.scoreInfo.minDate}}成绩为：{{item.scoreInfo.minScore}},班级平均成绩为：{{item.scoreInfo.minAvg}}。
              </div>
              <div>{{item.scoreInfo.suggest}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isApp" class="report-all-wrap__footer">
      <van-button class="btn" type="info" @click="shareBarShow=true">分享给家长</van-button>
    </div>
    <share-bar :show.sync="shareBarShow" :title="decodeURI($route.query.stuName)+'的家庭报告'" :link="link"></share-bar>


<!--    <div v-if="!isApp" class="report-all-wrap__open-app">-->
<!--      <img src="http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/feedback/information/201907/icon-48-mdpi.png" alt="">-->
<!--      <div class="report-all-wrap__open-app__ctn">-->
<!--        <div class="fs15 mgb10">全朗e家</div>-->
<!--        <div class="fs10">查看孩子更多的学习情况</div>-->
<!--      </div>-->
<!--      <a class="report-all-wrap__open-app__btn">打开</a>-->
<!--    </div>-->
  </section>
</template>

<script>
  import shareBar from '../../components/shareBar'
  import echarts from "echarts";
  import {getSubjectName, getTaskTypeName} from '@/utils/filter'
  import {getUserKnowledgePointCounter, statStuTaskFinishInfo, getStudentScoreStatistics} from '@/api/index'
  import * as calculate from '@/utils/calculate'

  export default {
    name: "reportAll",
    components: {shareBar},
    computed: {
      decodeURI() {
        return decodeURI
      },
      link() {
        const {stuName,accountNo,classId,classGrade,startDate,endDate,operateAccountNo,belongSchoolId} = this.$route.query
        return `${process.env.VUE_APP_HOST}/#/reportAll?stuName=${encodeURI(stuName)}&accountNo=${accountNo}&classId=${classId}&classGrade=${classGrade}&startDate=${startDate}&endDate=${endDate}&operateAccountNo=${operateAccountNo}&belongSchoolId=${belongSchoolId}`
      },
      isApp() {
        return 'cordova' in window
      }
    },
    data() {
      return {
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
        ],
        subjectList: [],
        shareBarShow: false,
      }
    },
    mounted() {
      this.$store.commit('setVanLoading', true)
      this.init()
      const arr = this.subjectList.reduce((t, v, i) => {
        t.push(...[this.getUserKnowledgePointCounter(v, i), this.statStuTaskFinishInfo(v, i), this.getStudentScoreStatistics(v, i)])
        return t
      }, [])
      Promise.all(arr).then(res => {
        this.$store.commit('setVanLoading', false)
      })
    },
    methods: {
      checkOutApp() {

        var isBlur = false;

        // 通过URL scheme来调起APP

        location.href = 'gfy://test:8080/index';

        setTimeout(() => {

          if (!isBlur) {

            //跳转APP下载页
            // location.href = 'http://www.baidu.com';

          }

        }, 2000);

        // window 每次失去焦點

        window.onblur = () => {

          console.log('失去焦點');

          isBlur = true;

        };

        var hiddenProperty = 'hidden' in document ? 'hidden' :

          'webkitHidden' in document ? 'webkitHidden' :

            'mozHidden' in document ? 'mozHidden' :

              null;

        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

        var onVisibilityChange = () => {

          if (document[hiddenProperty]) {

            console.log('失去焦點');

            isBlur = true;

          }

        }

        document.addEventListener(visibilityChangeEvent, onVisibilityChange);

      },
      goBack(){
          this.common.goBack(this)
        },
      handleSuggest(item) {
        let currentNum = 0, totalNum = 0, masteryNum = 0, suggest = ''
        item.kngArr.forEach(v => {
          currentNum = calculate.add(currentNum,v.currentNum)
          totalNum = calculate.add(totalNum,v.totalNum)
          masteryNum = calculate.add(masteryNum,v.masteryNum)
        })
        currentNum = calculate.div(currentNum,item.kngArr.length)
        totalNum = calculate.div(totalNum,item.kngArr.length)
        masteryNum = calculate.div(masteryNum,item.kngArr.length)

        if (calculate.div(currentNum, totalNum) <= 0.8 && totalNum <= 20) {
          //正确数<=总题数的80% && 总题数<=20题
          suggest = `<div>①总正确数低于等于总题数的80%，练习量较少，建议使用<span class="blue">“自主学习--测试---练”</span>功能加强练习。</div>`
        } else if (calculate.div(currentNum, totalNum) > 0.8 && totalNum <= 20) {
          //正确数>总题数的80% && 总题数<=20题
          suggest = `<div>①总正确数高于总题数的80%，但总题数不高，练习量一般，建议使用<span class="blue">“自主学习--测试---测试”</span>功能进行深入检测。</div>`
        }

        if (masteryNum <= 90) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}总掌握程度低于等于90%，掌握程度较低，建议使用<span class="blue">“自主学习--学习--微课”</span>功能重新梳理知识点；使用<span class="blue">“自主学习--学习--素材”</span>功能，
巩固老师课堂所讲知识点。</div>`
        } else if (masteryNum > 90 && masteryNum < 95) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}总掌握程度90%-95%，掌握程度一般，建议使用<span class="blue">“自主学习--学习--素材”</span>功能进一步梳理知识点，深入巩固知识点。</div>`
        } else if (masteryNum >= 95) {
          suggest += `<div>${totalNum <= 20 ? '②' : '①'}总掌握程度大于等于95%以上，掌握程度良好，建议使用<span class="blue">“自主学习--学习--测试”</span>功能进一步练习举一反三的题目。</div>`
        }
        return suggest
      },
      renderKnowledgeTable(kngArr, totalArr, rightArr, masteryArr, subjectItem) {
        const tableData = kngArr.reduce((t, v, i) => {
          t.push({name: v, currentNum: rightArr[i], totalNum: totalArr[i], masteryNum: masteryArr[i]})
          return t
        }, [])
        this.$set(subjectItem, 'kngArr', tableData)
      },
      async getStudentScoreStatistics(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          eChartsType: 'T01',
          termType: '',
          subjectType: item.subjectType,
          ...this.$route.query,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getStudentScoreStatistics(params).then(res => {
          if (res.flag) {
            this.drawHistogram3(res.data || [], index, item)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      async statStuTaskFinishInfo(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          roleType: 'A03',
          termType: '',
          ...this.$route.query,
          subjectType: item.subjectType,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await statStuTaskFinishInfo(params).then(res => {
          if (res.flag) {
            const tchCourseTaskCount = res.data[0] ? res.data[0].tchCourseTaskCount : []
            let info = tchCourseTaskCount.reduce((t, v) => {
              this.$set(v,'name',getTaskTypeName(v.tast_type))
              t.total += v.total_count
              t.finish += v.total_finish
              return t
            }, {total: 0, finish: 0})
            info.percent = calculate.div(info.finish, info.total)
            info.taskArr = tchCourseTaskCount
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
            // this.drawHistogram2(tchCourseTaskCount, index)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      drawHistogram3(arr, index, item) {
        //对数组相同日期进行去重,并将相同日期的成绩取平均值
        const dateArr = arr.map(v => v.scoreDate.substr(0, 10))
        const uniqueDateArr = [...new Set(dateArr)]
        let maxObj = {maxDate: '', maxScore: 0, maxAvg: 0},
          minObj = {minDate: '', minScore: 0, minAvg: 0},
          maxScore = 0,
          minScore = 0,
          preScore = 0, // 上一个节点的分数
          totalValue = 0, // 总计差值
          avgValue = 0, //平均差值
          isLineUp = true, // 是否直线上升
          isLineDown = true // 是否直线下降
        const newArr = uniqueDateArr.map((v, i) => {
          const filterArr = arr.filter(obj => obj.scoreDate.indexOf(v) > -1)
          const scoreObj = filterArr.reduce((t, f) => {
            t.totalScore = calculate.add(t.totalScore, f.statisticsScore)
            t.avgScore = calculate.add(t.avgScore, f.avgScore)
            return t
          }, {totalScore: 0, avgScore: 0})
          const totalScoreAvg = calculate.div(scoreObj.totalScore, filterArr.length, 0)
          const scoreAvg = calculate.div(scoreObj.avgScore, filterArr.length, 0)

          if (i > 0) {
            //判断是否保持上升
            isLineUp = totalScoreAvg >= preScore && isLineUp
            //判断是否保持下降
            isLineDown = totalScoreAvg <= preScore && isLineDown
            //本次分数 - 上一个分数 = 本次差值
            totalValue += calculate.sub(totalScoreAvg, preScore, 0)

            if (maxScore <= totalScoreAvg) {
              maxScore = totalScoreAvg // 最高分
              maxObj = {maxDate: v, maxScore: totalScoreAvg, maxAvg: scoreAvg}
            }
            if (minScore >= totalScoreAvg) {
              minScore = totalScoreAvg // 最低分
              minObj = {minDate: v, minScore: totalScoreAvg, minAvg: scoreAvg}
            }
          } else {
            maxScore = totalScoreAvg // 最高分
            maxObj = {maxDate: v, maxScore: totalScoreAvg, maxAvg: scoreAvg}
            minScore = totalScoreAvg // 最低分
            minObj = {minDate: v, minScore: totalScoreAvg, minAvg: scoreAvg}
          }
          preScore = totalScoreAvg
          return {date: v, score: totalScoreAvg, scoreAvg}
        })
        if (newArr.length > 1) {
          //起码要有两个节点才能算出幅度
          avgValue = calculate.div(totalValue, newArr.length - 1)
        }
        let suggest = ''
        if (avgValue === 0) {
          //趋势持平
          suggest = `曲线整体呈水平状态，平均幅度接近0，说明学生在这个阶段的成绩处于保持的状态，既没有明显的进步，也没有的退步迹象，建议使用平台的自主学习功能，查找自己的知识漏洞进一步突破。`
        } else if (avgValue > 0) {
          //上升趋势
          if (isLineUp) {
            //直线上升
            suggest = `曲线整体呈直线上升的趋势，平均增幅为${avgValue}分，说明学生在这个阶段成绩在稳步上升，学生对于平台提供的学习内容，和学习方法掌握得较好，建议可以继续多使用平台的自主学习功能，进一步深化知识的学习。`
          } else {
            //波动上升
            suggest = `曲线整体呈波动上升的趋势，平均幅度为${avgValue}分，说明学生在这个阶段成绩在逐步上升，但是不够稳定，成绩时高时低，存在明显的知识漏洞；建议使用平台的自主学习功能，根据知识点的掌握情况，进行有针对性的学习。`
          }
        } else if (avgValue < 0) {
          // 下降趋势
          if (isLineDown) {
            //直线下降
            suggest = `曲线整体呈直线下降的趋势，平均幅度为${avgValue}分，说明学生在这个阶段成绩在逐步下降，存在的原因有：①没有认真及时完成老师布置的任务。（完成任务数过低，掌握程度低）。②较少使用平台的自主学习功能。
建议：①认真完成老师布置的平台任务，初步掌握老师所教的知识点，提高任务完成数和掌握程度。
②在课后的时间多使用平台的自主学习功能，利用其中的微课、素材和试题的学习，进一步深化知识点的掌握程度。`
          } else {
            //波动下降
            suggest = `曲线整体呈波动下降的趋势，平均幅度为${avgValue}分，说明学生在这个阶段的成绩在逐步下降，并且出现小幅度波动性的上升情况，学生没有养成良好的学习习惯，对于知识点之间的综合考察能力较差，建议多使用平台的自主学习功能，多看微课，重新梳理知识点。`
          }
        }
        this.$set(item, 'scoreInfo', {total: newArr.length, ...maxObj, ...minObj, suggest})
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
            },
            {
              name: '平均分',
              type: 'line',
              data: newArr.map(v => v.scoreAvg),
              itemStyle: {
                opacity: 0
              },
              lineStyle: {
                opacity: 0
              }
            },
          ]
        };
        myChart.setOption(option1, true);

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
      drawHistogram1(option1, index) {
        var myChart = echarts.init(document.getElementById('knowledge' + index))
        myChart.setOption(option1, true)
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
              end: xData.length>5 ? (5/xData.length)*100:100
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
              barWidth: xData.length>5?'25%':`${xData.length*5}%`,
              data: total
            },
            {
              name: '正确数',
              type: 'bar',
              barWidth: xData.length>5?'25%':`${xData.length*5}%`,
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
        })
        // } else {
        //     this.$set(item, 'kwgNotEnough', true)
        // }
      },
      async getUserKnowledgePointCounter(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          roleType: 'A03',
          termType: '',
          ...this.$route.query,
          subjectType: item.subjectType,
          "schoolId": this.$route.query.belongSchoolId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getUserKnowledgePointCounter(params).then(res => {
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
            this.$toast(res.msg)
          }
        })
      },
      init() {
        this.subjectList = this.gradeList.find(v => this.$route.query.classGrade === v.classGrade).subject.map(v => {
          return {
            subjectName: getSubjectName(v),
            subjectType: v,
            kngArr: [],
            statInfo: {total: 0, finish: 0, percent: 0, taskArr: []},
            scoreInfo: {total: 0, maxDate: '', maxScore: 0, maxAvg: 0, minDate: '', minScore: 0, minAvg: 0, suggest: ''}
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .report-all-wrap {
    display: flex;
    flex-direction: column;

    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      .data-analyse {
        /*padding: 0 28px;*/
        margin-top: 10px;

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
        border-left: 1px solid #eee;
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
            padding: 0 6px;
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
      display: flex;
      align-items: center;
      padding: 0 17px;

      .btn {
        line-height: 44px;
        height: 44px;
        border-radius: 20px;
        flex: 1;
        font-size: 18px;
      }
    }

    &__open-app{
      flex: 0 0 75px;
      background: #eee;
      align-items: center;
      padding: 0 10px;
      display: flex;
      img {
        flex: 0 0 50px;
        height: 50px;
        margin-right: 10px;
      }
      &__ctn{
        flex: 1;
      }
      &__btn{
        flex: 0 0 60px;
        line-height: 25px;
        border-radius: 12px;
        background: #fff;
        font-size: 12px;
        text-align: center;
      }
    }

    .regular-height {
      height: 420px;
      line-height: 16px;
    }
  }
</style>
