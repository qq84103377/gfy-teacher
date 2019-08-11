<template>
  <section class="add-sub-score">
    <div class="add-sub-score__body">
      <van-cell class="mgt10" v-for="(item,index) in list" :key="index">
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
        <div class="score-pop-wrap__item" @click="handleClosePop">1分</div>
        <div class="score-pop-wrap__item" @click="handleClosePop">2分</div>
        <div class="score-pop-wrap__item" @click="handleClosePop">3分</div>
        <div class="score-pop-wrap__item" @click="handleClosePop">4分</div>
        <div class="score-pop-wrap__item" @click="handleClosePop">5分</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  export default {
    name: "addSubScore",
    data() {
      return {
        leftValue: '30%',
        scoreShow: false,
        checkbox: 0,
        list: [{
          name: '满分',
          stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'}, {name: '李华ds'},]
        }, {name: '90-99分', stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'},]}, {
          name: '80-89分',
          stu: []
        }, {
          name: '70-79分',
          stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'}, {name: '李华ds'},]
        }, {
          name: '60-69分',
          stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'}, {name: '李华ds'},]
        }, {
          name: '60以下',
          stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'}, {name: '李华ds'},]
        }, {name: '未提交', stu: [{name: '李华'}, {name: '李华ds'}, {name: '李华sadasd'}, {name: '李华ds'}, {name: '李华ds'},]},]
      }
    },
    methods: {
      handleClosePop() {
        this.scoreShow = false
        this.$toast(this.leftValue=='30%'?'加分成功':'减分成功')
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
