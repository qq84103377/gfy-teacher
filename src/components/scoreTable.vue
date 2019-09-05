<template>

  <div class="score-table">
    <div class="header">
      <span class="header-item team-col" v-if="!classView">组名</span>
      <span class="header-item average" v-if="!classView">平均分</span>
      <span class="header-item">学生姓名</span>
      <span class="header-item">用时</span>
      <span class="header-item score">测试得分</span>
    </div>
    <div class="row">
      <div class="row-item team-col" v-if="!classView">桂容桂容桂</div>
      <div class="row-item average" v-if="!classView">89</div>
      <div class="row-item">
        <div v-for="a in 3" :key="a">欧阳锋</div>
      </div>
      <div class="row-item">
        <div v-for="a in 3" :key="a">20分30秒</div>
      </div>
      <div class="row-item  score blue">
        <div v-for="a in 3" :key="a" @click="$router.push(isSpoken?`/spokenAnalyse?type=personal`:`/stuAnalyse`)">89 ></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scoreTable",
    props: ['classView', 'list','isSpoken'],
    data() {
      return {
        tableData: [
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
          {teamName:'容桂初一智慧一班第一组容桂初一智慧一班第一组',average: 90,name:'欧阳修裘千仞',time: '20分30秒',score:90},
        ]
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
      line-height: 44px;
      display: flex;
      align-items: center;
      .header-item {
        flex: 1;
        text-align: center;
        border-right: 1px solid #F5F6FA;
        border-bottom: 1px solid #F5F6FA;
        &.team-col {
          flex: 0 0 10%;
        }
        &.average {
          flex: 0 0 15%;
        }

        &.score {
          flex: 0 0 18%;
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
          padding: 0 10px;
        }

        &.average {
          flex: 0 0 15%;
        }
        &.score {
          flex: 0 0 18%;
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
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }

</style>
