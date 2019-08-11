<template>
  <table :id="id" class="score-table">
    <tr>
      <th v-show="!classView" class="team-th">组名</th>
      <th v-show="!classView">平均分</th>
      <th>学生姓名</th>
      <th>用时</th>
      <th>测试得分</th>
    </tr>
    <tr v-for="a in 5" :key="a">
      <td v-show="!classView">
        <div class="team-td">容桂初一智慧一班第一组</div>
      </td>
      <td v-show="!classView">89</td>
      <td>G7101</td>
      <td>20分30秒</td>
      <td @click="$router.push(isSpoken?`/spokenAnalyse?type=personal`:`/stuAnalyse`)">89 ></td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: "scoreTable",
    props: ['id', 'classView', 'list','isSpoken'],
    mounted() {
        if(!this.classView) {
         this.$nextTick(() => {
           //要先从后面的列开始合并 不然会出错
           this.mergeCell(this.id,0,0,1)
           this.mergeCell(this.id,0,0,0)
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

    tr {
      th, td {
        text-align: center;
        line-height: 44px;
        border-right: 1px solid #F5F6FA;
        border-bottom: 1px solid #F5F6FA;

        &:last-child {
          border-right: none;
        }
      }

      td:last-child {
        color: @blue;
      }

      .team-th {
        width: 70px;
      }

      .team-td {
        width: 12px;
        margin: 0 auto;
      }
    }
  }

</style>
