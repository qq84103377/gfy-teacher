<template>

  <div class="score-table">
    <div class="header">
      <span class="header-item team-col" v-if="!classView">组名</span>
      <span class="header-item average" v-if="!classView">平均分</span>
      <span class="header-item" :class="{name:!classView}">{{isfEducation?'家长':'学生'}}姓名</span>
      <span class="header-item" v-if="isWk">完成时间</span>
      <span class="header-item" v-if="isWk" :style="{flex: classView?'1':'0 0 16%'}">看视频<br/>总用时
        <i @click="showTip=true" style="vertical-align: baseline" class="iconGFY icon-tip"></i>
      </span>
      <span class="header-item" :style="{flex: !isWk||classView?'1':'0 0 16%'}">测试总<br v-if="isWk"/>用时</span>
<!--      <span class="header-item" v-if="!isWk">用时</span>-->
      <span class="header-item score" v-if="isTest>0">测试得分</span>
    </div>
    <div v-if="classView">
      <div class="row" v-for="(item,index) in list" :key="index">
        <div class="row-item">
          <div :class="{stuName:item.redoTimes>0}">{{item.name}}
            <span style="white-space: nowrap" class="blue">({{item.studentRewardScore||0}})</span>
          </div>
        </div>
        <div class="row-item" style="text-align: center" v-if="isWk">
          <div>{{item.endDate}}</div>
        </div>
        <div class="row-item" style="text-align: center" v-if="isWk">
          <div>{{item.tvTime}}</div>
        </div>
        <div class="row-item" style="text-align: center">
          <div>{{item.duration}}</div>
        </div>
<!--        <div class="row-item" v-if="!isWk">-->
<!--          <div>{{item.duration}}</div>-->
<!--        </div>-->
        <div class="row-item score" v-if="isTest>0">
          <div :class="[{red:examScore>0?(item.score/examScore)<0.6:true},{blue:examScore>0?(item.score/examScore)>=0.6:false}]" @click="$emit('jump',item)">{{item.score}} ></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row" v-for="(item,index) in list" :key="index">
        <div class="row-item team-col">
          <span class="vertical">{{item.groupName || '未分组'}}</span>
          <span style="white-space: nowrap" class="blue">({{item.groupScore||0}})</span>
        </div>
        <div class="row-item average">{{item.average}}</div>
        <div class="row-item name">
          <div :class="{stuName:s.redoTimes>0}" v-for="(s,index1) in item.stu" :key="index1">{{s.name}}</div>
        </div>
        <div class="row-item" v-if="isWk">
          <div style="text-align: center" v-for="(s,index2) in item.stu" :key="index2">{{s.endDate}}</div>
        </div>
        <div class="row-item" style="flex: 0 0 16%" v-if="isWk">
          <div v-for="(s,index2) in item.stu" :key="index2">{{s.tvTime}}</div>
        </div>
        <div class="row-item" :style="{flex: !isWk?'1':'0 0 16%'}">
          <div v-for="(s,index2) in item.stu" :key="index2">{{s.duration}}</div>
        </div>
        <div class="row-item score" v-if="isTest>0">
          <div :class="[{red:examScore>0?(s.score/examScore)<0.6:true},{blue:examScore>0?(s.score/examScore)>=0.6:false}]" v-for="(s,index3) in item.stu" :key="index3" @click="$emit('jump',s)">{{s.score}}></div>
        </div>
      </div>
    </div>

    <van-popup v-model="showTip" style="width: 60%;">
      <div class="pd10 fs14" style="">
        学生在规定微课观看时间里，没有正确完成，且没有停留在答题页面，如：退出、关闭浏览器等，系统无法记录他的观看时长，则显示为“未记录”。
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "scoreTable",
    props: ['classView', 'list','examScore',"isfEducation",'isWk','isTest'], //examScore试卷总分
    data() {
      return {
        showTip: false,
      }
    },
    mounted() {
        if(!this.classView) {
         this.$nextTick(() => {
           //要先从后面的列开始合并 不然会出错
           // this.mergeCell(this.id,0,0,1)
           // this.mergeCell(this.id,0,0,0)
         })
        }
    },
    // watch: {
    //   classView(v) {
    //     if (!v) {
    //       this.$nextTick(() => {
    //         this.mergeCell(this.id, 0, 0, 1)
    //         this.mergeCell(this.id, 0, 0, 0)
    //       })
    //     }
    //   }
    // },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      mergeCell(table1, startRow, endRow, col) {
        let tb = document.getElementById(table1);
        if (!tb || !tb.rows || tb.rows.length <= 0) {
          return;
        }
        if (col >= tb.rows[0].cells.length || (startRow >= endRow && endRow != 0)) {
          return;
        }
        if (endRow == 0) {
          endRow = tb.rows.length - 1;
        }
        for (let i = startRow; i < endRow; i++) {
          if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) { //如果相等就合并单元格,合并之后跳过下一行
            tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col]);
            tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan) + 1;
          } else {
            this.mergeCell(table1, i + 1, endRow, col);
            break;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .score-table {
    border: 1px solid #F5F6FA;
    border-top: 2px solid @blue;
    border-bottom: none;
    color: #333;
    font-size: 12px;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;

    .header {
      display: flex;
      align-items: center;
      font-weight: bold;
      .icon-tip{
        margin-left: 2px;
      }
      .header-item {
        height: 44px;
        flex: 1;
        text-align: center;
        border-right: 1px solid #F5F6FA;
        border-bottom: 1px solid #F5F6FA;
        display: flex;
        align-items: center;
        justify-content: center;
        &.team-col {
          flex: 0 0 10%;
        }
        &.name {
          flex: 0 0 14%;
        }
        &.average {
          flex: 0 0 12%;
        }

        &.score {
          flex: 0 0 10%;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
    .row {
      display: flex;
      .row-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #F5F6FA;
        border-bottom: 1px solid #F5F6FA;
        &.team-col {
          flex: 0 0 10%;

          .vertical {
            padding: 0 10px;
            word-break: break-all;
          }
        }
        &.name {
          flex: 0 0 14%;
        }
        &.average {
          flex: 0 0 12%;
        }
        &.score {
          flex: 0 0 10%;
        }
        &:last-child {
          border-right: none;
        }
        >div {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-bottom: 1px solid #F5F6FA;
          flex-direction: column;
          &:last-child {
            border-bottom: none;
          }
        }
        .stuName {
          position: relative;
          overflow: hidden;
          &::after {
            position: absolute;
            left: -29px;
            top: -11px;
            width: 80px;
            height: 30px;
            line-height: 45px;
            font-size: 10px;
            color: #fff;
            background: #f8d25c;
            content: '重做';
            transform: rotateZ(-30deg);
            text-align: center;
          }
        }
      }
    }

    &.scroll-table{
      overflow-x: auto;
      .header-item{
        flex: 0 0 20%;
        &.team-col {
          flex: 0 0 10%;
        }
        &.average {
          flex: 1;
        }

        &.score {
          flex: 1;
        }
      }
      .row-item{
        flex: 0 0 20%;
        &.team-col {
          flex: 0 0 10%;
        }
        &.average {
          flex: 1;
        }

        &.score {
          flex: 1;
        }
      }
    }
  }

</style>
