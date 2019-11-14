<template>
  <section class="add-sub-score">
    <div class="add-sub-score__body">
      <van-cell class="mgt10" v-for="(item,index) in scoreSpan" :key="index">
        <div slot="title">
          <div class="cell-header">
            <van-checkbox
              :disabled="item.stu.length==0"
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
              <div class="fs16">{{item.name}}<span class="fs14">(已选{{totalStu(item)}}人)</span></div>
            </van-checkbox>
            <van-icon @click="handleFold(item)" name="arrow-down" :style="{color:item.stu.length==0?'#ccc':'#999'}"/>
          </div>
          <div class="cell-content" v-show="item.fold">
            <div @click="handleItemClick(stu,item,index)" v-for="(stu,s) in item.stu" :key="s"
                 :class="['cell-content-item',{active:stu.active}]">{{stu.name}}
            </div>
          </div>
        </div>
      </van-cell>
    </div>
    <div class="add-sub-score__footer">
      <van-button type="info" class="btn" id="add" @click="scoreShow=true;leftValue='30%'">加分</van-button>
      <van-button type="info" class="btn" id="sub" @click="scoreShow=true;leftValue='75%'">减分</van-button>
    </div>

    <van-popup v-model="scoreShow" get-container=".add-sub-score__footer" class="score-pop" :style="{left: leftValue}">
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
    name: "addSubScore",
    data() {
      return {
        leftValue: '30%',
        scoreShow: false,
        checkbox: 0,
        scoreSpan: [],
      }
    },
    computed: {},
    created() {
      this.handleList()
    },
    methods: {
      saveRewardScore(score) {
        let accountArr = this.scoreSpan.reduce((t, v, i) => {
          const arr = v.stu.filter(s => s.active).reduce((total, value) => {
            total.push(value.accountNo)
            return total
          }, [])
          t.push(...arr)
          return t
        }, [])
        const str = accountArr.join('|')
        if(str === '') return this.$toast('请选择学生')
        this.$store.commit('setVanLoading',true)
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
          "groupIdList": "",
          "accountNoList": str
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if (res.flag) {
            this.$toast(this.leftValue == '30%' ? '加分成功' : '减分成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleList() {
        //口语的总分都按100分来算
        if(this.$route.params.info.testPaperScore>=20) {
          //总分不小于20
          this.scoreSpan = [
            {name: `满分${this.$route.params.info.testPaperScore}`, min: 1, max: 2, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.9,0)}-${Math.floor(calculate.mul(this.$route.params.info.testPaperScore,0.99,2))}分`, min: 0.9, max: 1, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.8,0)}-${Math.floor(calculate.mul(this.$route.params.info.testPaperScore,0.89,2))}分`, min: 0.8, max: 0.9, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.7,0)}-${Math.floor(calculate.mul(this.$route.params.info.testPaperScore,0.79,2))}分`, min: 0.7, max: 0.8, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.6,0)}-${Math.floor(calculate.mul(this.$route.params.info.testPaperScore,0.69,2))}分`, min: 0.6, max: 0.7, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.6,0)}分以下`, min: 0, max: 0.6, stu: []},
            {name: '未提交', stu: []},
          ]
        }else {
          //总分小于20
          this.scoreSpan = [
            {name: `满分${this.$route.params.info.testPaperScore}`, min: 1, max: 2, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.6,0)}-${Math.floor(calculate.mul(this.$route.params.info.testPaperScore,0.99,2))}分`, min: 0.6, max: 1, stu: []},
            {name: `${calculate.mul(this.$route.params.info.testPaperScore,0.6,0)}分以下`, min: 0, max: 0.6, stu: []},
            {name: '未提交', stu: []},
          ]
        }

        this.$route.params.info.studentStatList.forEach(v => {
          let percent = 0
          if (this.$route.params.info.testPaperScore > 0) {
            // percent = Number((v.score / this.$route.params.info.testPaperScore * 100).toFixed(2))
            percent = calculate.div(v.score,this.$route.params.info.testPaperScore,2)
          }
          if (v.endDate) {
            const index = this.scoreSpan.findIndex(s => percent >= s.min && percent < s.max)
            this.scoreSpan[index].stu.push({
              name: getStudentName(v.accountNo, this.$route.params.info.classId),
              accountNo: v.accountNo
            })
          } else {
            this.scoreSpan[this.scoreSpan.length-1].stu.push({
              name: getStudentName(v.accountNo, this.$route.params.info.classId),
              accountNo: v.accountNo
            })
          }
        })
      },
      handleClosePop(score) {
        this.saveRewardScore(score)
        this.scoreShow = false
      },
      handleFold(item) {
        if (item.stu.length) {
          this.$set(item, 'fold', !item.fold)
        } else {
          this.$toast('此阶段无学生!')
        }
      },
      totalStu(item) {
        return item.stu.reduce((t, v) => {
          if (v.active) {
            t++
          }
          return t
        }, 0)
      },
      handleChange(bol, item) {
        if (item.stu.length) {
          item.stu.forEach(v => {
            this.$set(v, 'active', !item.check)
          })
        } else {
          this.$toast('此阶段无学生!')
        }

      },
      handleItemClick(stu, item, index) {
        this.$set(stu, 'active', !stu.active)
        this.$set(item, 'check', item.stu.some(v => v.active) ? index + 1 : '')
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .add-sub-score {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

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
