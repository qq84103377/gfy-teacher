<template>

  <div class="score-table">
    <div class="header">
      <span class="header-item team-col" v-if="!classView">组名</span>
      <span class="header-item average" v-if="!classView">平均分</span>
      <span class="header-item">{{isfEducation?'家长':'学生'}}姓名</span>
<!--      <span class="header-item" v-if="isWk">完成时间</span>-->
<!--      <span class="header-item" v-if="isWk">看视频总用时</span>-->
      <span class="header-item" >用时</span>
      <span class="header-item score">测试得分</span>
    </div>
    <div v-if="classView">
      <div class="row" v-for="(item,index) in list" :key="index">
        <div class="row-item">
          <div :class="{stuName:item.redoTimes>0}">{{item.name}}
            <span style="white-space: nowrap" class="blue">({{item.studentRewardScore||0}})</span>
          </div>
        </div>
<!--        <div class="row-item" style="text-align: center" v-if="isWk">-->
<!--          <div>{{item.endDate}}</div>-->
<!--        </div>-->
<!--        <div class="row-item" style="text-align: center" v-if="isWk">-->
<!--          <div>{{item.tvTime}}</div>-->
<!--        </div>-->
        <div class="row-item" >
          <div>{{item.duration}}</div>
        </div>
        <div class="row-item score">
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
        <div class="row-item">
          <div :class="{stuName:s.redoTimes>0}" v-for="(s,index1) in item.stu" :key="index1">{{s.name}}</div>
        </div>
        <div class="row-item">
          <div v-for="(s,index2) in item.stu" :key="index2">{{s.duration}}</div>
        </div>
        <div class="row-item score" >
          <div :class="[{red:examScore>0?(s.score/examScore)<0.6:true},{blue:examScore>0?(s.score/examScore)>=0.6:false}]" v-for="(s,index3) in item.stu" :key="index3" @click="$emit('jump',s)">{{s.score}} ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scoreTable",
    props: ['classView', 'list','examScore',"isfEducation",'isWk'], //examScore试卷总分
    data() {
      return {

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
        &.average {
          flex: 1;
        }

        &.score {
          flex: 1;
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

        &.average {
          flex: 1;
        }
        &.score {
          flex: 1;
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
  }

</style>
