<template>
  <section class="add-sub-group-score">
    <div class="add-sub-group-score__body">
        <van-cell class="mgt10" v-for="(item,index) in groupList" :key="index">
          <div slot="title">
            <div class="cell-header">
              <van-checkbox
                :disabled="handleDisabled(item)"
                @click="handleChange($event,item)"
                class="cell-header__checkbox"
                :name="index+1"
                v-model="item.check"
              >
                <i
                  slot="icon"
                  slot-scope="props"
                  :class="['iconGFY','icon-check',{'normal':!props.checked}]"
                ></i>
                <div class="fs16">{{item.groupName}}&nbsp;<span v-if="index < groupList.length - 2">平均{{item.avgScore}}分</span><span class="fs14">(已选{{totalStu(item)}}人)</span></div>
              </van-checkbox>
              <van-icon @click="handleFold(item)" name="arrow-down"
                        :style="{color:handleDisabled(item)?'#ccc':'#999'}"/>
            </div>
            <div v-show="item.fold">
              <div v-if="item.groupId !== '未提交'" class="cell-content">
                <div @click="handleItemClick(stu,item,index)" v-for="(stu,s) in item.stuList" :key="s"
                     :class="['cell-content-item',{active:stu.active}]">
                  {{stu.name}}
                </div>
              </div>
              <div v-else>
                <div class="pdlt15" v-for="(group,groupIndex) in item.group" :key="groupIndex">
                  <div class="mgt5 mgb5 ellipsis">{{group.groupName}}</div>
                  <div class="cell-content" style="padding: 0;margin: 0;">
                    <div @click="handleItemClick(stu,item,index)" v-for="(stu,s) in group.stuList" :key="s"
                         :class="['cell-content-item',{active:stu.active}]">
                      {{stu.name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-cell>
    </div>
    <div class="add-sub-group-score__footer">
      <van-button type="info" class="btn" id="add" @click="scoreShow=true;leftValue='30%'">加分</van-button>
      <van-button type="info" class="btn" id="sub" @click="scoreShow=true;leftValue='75%'">减分</van-button>
    </div>

    <van-popup v-model="scoreShow" get-container=".add-sub-group-score__footer" class="score-pop"
               :style="{left: leftValue}">
      <div class="score-pop-wrap">
        <div class="score-pop-wrap__item" v-for="item in 5" :key="item" @click="handleClosePop(item)">{{item}}分</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import {getStudentName} from '@/utils/filter'
  import {saveRewardScore} from '@/api/index'
  import * as calculate from '@/utils/calculate'

  export default {
    name: "addSubGroupScore",
    data() {
      return {
        leftValue: '30%',
        scoreShow: false,
        checkbox: 0,
        scoreSpan: [],
        groupList: [{
          groupName: '未分组',
          groupId: '未分组',
          stuList: []
        }, {
          groupName: '未提交',
          groupId: '未提交',
          group: [{
            groupName: '未分组',
            groupId: '未分组',
            stuList: []
          }]
        }
        ],
      }
    },
    computed: {},
    created() {
      this.handleList()
    },
    methods: {
      handleDisabled(item) {
       return (item.groupId !== '未提交' && !item.stuList.length) || (item.groupId === '未提交' && item.group.some(g => !g.stuList.length))
      },
      saveRewardScore(score) {
        let groupArr = []
        let accountArr = this.groupList.reduce((t, v, i) => {
          if(i < this.groupList.length - 2 && v.check) {
            //有分组的
            groupArr.push(v.groupId)
          }
          if(v.groupId === '未提交') {
            v.group.forEach(g => {
              if(g.stuList.some(s => s.active) && g.groupId !== '未分组' && groupArr.indexOf(g.groupId) === -1) {
                groupArr.push(g.groupId)
              }
             const arr = g.stuList.filter(s => s.active).reduce((total,value) => {
                total.push(value.accountNo)
                return total
              },[])
              t.push(...arr)
            })
          }else {
            const arr = v.stuList.filter(s => s.active).reduce((total, value) => {
              total.push(value.accountNo)
              return total
            }, [])
            t.push(...arr)
          }
          return t
        }, [])
        const stuStr = accountArr.join('|')
        if (stuStr === '') return this.$toast('请选择学生')
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.$route.params.info.taskId,
          "type": this.leftValue === '30%' ? "T01" : 'T02',
          score,
          "subjectType": localStorage.currentSubjectType,
          "teacherName": JSON.parse(localStorage.getItem('userInfo')).userName,
          "taskName": JSON.parse(localStorage.getItem('stat')).taskName,
          "termType": this.$route.params.termType,
          "classId": this.$route.params.info.classId,
          "groupIdList": groupArr.join('|'),
          "accountNoList": stuStr
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(this.leftValue == '30%' ? '加分成功' : '减分成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleList() {
        this.$route.params.info.studentStatList.forEach(v => {
          if (this.$route.params.info.finishStudent.includes(v.accountNo)) {
            //已提交
            if (v.groupId) {
              //有分组
              const index = this.groupList.findIndex(g => g.groupId === v.groupId)
              if (index > -1) {
                this.groupList[index].stuList.push({accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)})
                this.groupList[index].avgScore = calculate.div(calculate.add(v.score, this.groupList[index].avgScore), this.groupList[index].stuList.length)
              } else {
                this.groupList.unshift({
                  groupName: v.groupName,
                  groupId: v.groupId,
                  avgScore: v.score,
                  stuList: [{accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)}]
                })
              }
            } else {
              //未分组
              this.groupList[this.groupList.length - 2].stuList.push({accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)})
            }
          } else {
            //未提交
            if (v.groupId) {
              //有分组
              const index = this.groupList[this.groupList.length - 1].group.findIndex(g => g.groupId === v.groupId)
              if (index > -1) {
                this.groupList[this.groupList.length - 1].group[index].stuList.push({accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)})
              } else {
                this.groupList[this.groupList.length - 1].group.unshift({
                  groupName: v.groupName,
                  groupId: v.groupId,
                  avgScore: '',
                  stuList: [{accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)}]
                })
              }
            } else {
              //未分组
              this.groupList[this.groupList.length - 1].group[this.groupList[this.groupList.length - 1].group.length - 1].stuList.push({accountNo: v.accountNo, name: getStudentName(v.accountNo,this.$route.params.info.classId)})
            }
          }
        })
      },
      handleClosePop(score) {
        this.saveRewardScore(score)
        this.scoreShow = false
      },
      handleFold(item) {
        if ((item.groupId !== '未提交' && item.stuList.length) || (item.groupId === '未提交' && item.group.some(v => v.stuList.length))) {
          this.$set(item, 'fold', !item.fold)
        } else {
          this.$toast('没有学生!')
        }
      },
      totalStu(item) {
        if (item.groupId !== '未提交') {
          return item.stuList.reduce((t, v) => {
            if (v.active) {
              t++
            }
            return t
          }, 0)
        } else {
          return item.group.reduce((t, v) => {
            t += v.stuList.reduce((total, s) => {
              if (s.active) {
                total++
              }
              return total
            }, 0)
            return t
          }, 0)
        }
      },
      handleChange(bol, item) {
        if(item.groupId === '未提交') {
          item.group.forEach(g => {
            g.stuList.forEach(s => {
              this.$set(s,'active',!item.check)
            })
          })
        }else {
          item.stuList.forEach(v => {
            this.$set(v, 'active', !item.check)
          })
        }
      },
      handleItemClick(stu, item, index) {
        this.$set(stu, 'active', !stu.active)
        if(item.groupId === '未提交') {
          this.$set(item, 'check', item.group.some(g => g.stuList.some(s => s.active)) ? index + 1 : '')
        }else {
          this.$set(item, 'check', item.stuList.some(v => v.active) ? index + 1 : '')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .add-sub-group-score {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      .ellipsis {
        width: 300px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .cell-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .van-icon {
          padding-left: 50px;
        }

        @{deep} .van-checkbox__icon--disabled {
          i {
            border-color: #ccc;
          }
        }

        &__checkbox {
          .normal {
            background: none;
            border: 1px solid #999;
            border-radius: 1.5px;
          }
        }
      }

      .cell-content {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        padding-left: 15px;

        &-item {
          flex: 0 0 75px;
          line-height: 22px;
          background: #eee;
          color: #999;
          border-radius: 11px;
          font-size: 12px;
          margin-right: 8px;
          margin-bottom: 10px;
          text-align: center;

          &:nth-child(4n) {
            margin-right: 0;
          }

          &.active {
            background: @blue;
            color: #fff;
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 18px;
      background: #fff;
      align-items: center;
      justify-content: space-between;
      display: flex;
      position: relative;

      .btn {
        border-radius: 20px;
        color: #fff;
        font-size: 18px;
        margin-left: 10px;
        flex: 1;
        position: relative;

        &:first-child {
          margin-right: 0;
        }
      }

      .score-pop {
        border-radius: 10px;
        bottom: 55px;
        position: absolute;
        max-height: inherit;
        top: inherit;
        transform: translateX(-50%);
        overflow-y: inherit;

        &-wrap {
          padding: 10px;

          &__item {
            background: #F7DA3F;
            text-align: center;
            width: 85px;
            line-height: 30px;
            border-radius: 5px;
            margin-bottom: 5px;
            font-size: 15px;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }

        &::after {
          width: 0;
          height: 0;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent #fff;
          content: ' ';
          position: absolute;
          bottom: -9px;
          left: 50%;
          transform: translateX(-50%) rotateZ(180deg);
        }
      }
    }

  }
</style>
