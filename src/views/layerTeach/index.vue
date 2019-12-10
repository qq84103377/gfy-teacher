<template>
    <section class="layer-teach">
      <van-nav-bar :title="$route.query.taskName" @click-left="$router.back()" left-arrow/>
      <div class="layer-teach__tab-scroll">
        <div v-for="(item,index) in tchClassTastInfo" :key="index" @click="handleSelectTab(item)" class="layer-teach__tab-scroll-item" :class="{'active':item.active}">{{item.className}}
        </div>
      </div>
      <div v-if="!vanLoading && isNull" style="text-align: center;color: #999999">
        <img class="null-tips" src="../../assets/img/preview/task_null.png" alt />
        <div>该任务没有分层信息!</div>
      </div>
      <div v-if="!isNull" class="layer-teach__body">
        <div class="layer-teach__body__pie-chart">
          <div class="layer-teach__body__pie-chart-label divider">任务完成情况:</div>
          <div id="myChart1" ref="myChart1" class="pie-chart"></div>
        </div>
        <div class="layer-teach__body__achievement">
          <div class="layer-teach__body__achievement-label divider">全班成绩概况:</div>
          <div class="layer-teach__body__achievement-score">
            <div>
              <span>班级平均分</span>
              <span class="mgt10">{{calculate.div(taskInfo.totalScore||0,taskInfo.finshCount||0,0)}}分</span>
            </div>
            <div>
              <span>班级最高分</span>
              <span class="mgt10">{{taskInfo.maxScore || 0}}分</span>
            </div>
            <div>
              <span>班级最低分</span>
              <span class="red mgt10">{{taskInfo.minScore || 0}}分</span>
            </div>
          </div>
        </div>
      </div>

      <van-dialog v-model="stuStatInfo.statDialog" :show-confirm-button="false">
        <div class="stat-dialog-wrap">
          <div class="stat-dialog-wrap__header"><span class="stat-dialog-wrap__header-title">{{stuStatInfo.title}}学生</span>
            <van-icon class="icon-close" name="clear" @click="stuStatInfo.statDialog=false" />
          </div>
          <div class="stat-dialog-wrap__body">
            <div v-for="(item,index) in stuStatInfo.stu" :key="index">{{item}}</div>
          </div>
        </div>
      </van-dialog>

    </section>
</template>

<script>
  import { mapMutations, mapGetters, mapState } from 'vuex'
  import { getStudentName } from '@/utils/filter'
  import * as calculate from '@/utils/calculate'
  import {getLayerTaskInfoDetail} from '@/api/index'
  import echarts from "echarts";
  export default {
        name: "index",
      data() {
          return {
            taskIndex: 0,
            taskInfo: {},
            stuStatInfo: {
              title: '',
              stu: [],
              statDialog: false
            },
            isNull: false,
            tchClassTastInfo: JSON.parse(JSON.stringify(this.$route.query.tchClassTastInfo))
          }
      },
      computed: {
          classId() {
            const item = this.tchClassTastInfo.find(v => v.active)
             return item?item.classId:''
          },
        calculate() {
            return calculate
        },
        ...mapState({
          vanLoading: state => state.setting.vanLoading
        }),
      },
      methods: {
        drawPie() {
          this.$nextTick(() => {
            if(this.isNull) return
            let myChart = echarts.init(this.$refs.myChart1);
            // 绘制图表
            var _option = {
              calculable: true,
              color: ['#FB5522', '#2BFF93'],
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
                    formatter: `{b}{d}%>\n({c}人)`,
                    align: 'left'
                  },
                  labelLine: {
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
                    {
                      value: this.taskInfo.studentUnfinishList.reduce((t, v) => {
                        t += (v.accountNoList?v.accountNoList.length:0)
                        return t
                      }, 0), name: '未完成'
                    },
                    { value: this.taskInfo.finshCount, name: '已完成' }
                  ]
                }
              ],
            };
            myChart.setOption(_option, true)
            myChart.on('click', params => {
              this.stuStatInfo.stu = []
              this.stuStatInfo.title = params.name
              if (params.name === '未完成') {
                this.taskInfo.studentUnfinishList.forEach(v => {
                  (v.accountNoList||[]).forEach(s => {
                    const name = getStudentName(s, this.classId)
                    this.stuStatInfo.stu.push(name)
                  })
                })
              } else {
                this.taskInfo.finishStudent.reduce((t, v) => {
                  const name = getStudentName(v, this.classId)
                  t.push(name)
                  return t
                }, this.stuStatInfo.stu)
              }

              this.stuStatInfo.statDialog = true
            })
          });
        },
       async handleSelectTab(item) {
          if (item.active) return
         this.$store.commit('setVanLoading',true)
         this.tchClassTastInfo.forEach(v => {
            this.$set(v, 'active', false)
          })
          item.active = true
         await this.getLayerTaskInfoDetail()
          this.drawPie()
         this.$store.commit('setVanLoading',false)
       },
        async getLayerTaskInfoDetail() {
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            tchCourseId: this.$route.query.tchCourseId,
            taskId: this.$route.query.taskId,
            classId: this.classId
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          await getLayerTaskInfoDetail(params).then(res => {
            if(res.flag) {
              this.isNull = false
              this.taskInfo = res.data || {}
            }else {
              this.taskInfo = {}
              this.isNull = true
              this.$toast(res.msg)
            }
          })
        }
      },
      async created() {
        this.$store.commit('setVanLoading',true)
       await this.getLayerTaskInfoDetail()
        this.drawPie()
        this.$store.commit('setVanLoading',false)
      }
    }
</script>

<style lang="less" scoped>
  .layer-teach {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .divider {
      &::after {
        content: " ";
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
          background: linear-gradient(
            0deg,
            rgba(57, 240, 221, 1),
            rgba(140, 247, 238, 1)
          );
          color: #fff;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      &__pie-chart {
        background: #fff;
        padding: 15px 10px;

        &-label {
          font-size: 15px;
          color: #333;

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
          }
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
    .pie-chart {
      width: 100%;
      height: 200px;
      margin: 0 auto;
      margin-top: 20px;
    }
    .null-tips {
      margin-top: 50px;
      width: 100%;
    }
  }
</style>
