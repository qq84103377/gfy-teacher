<template>
    <section class="spoken-analyse">
      <van-nav-bar
        title="题目分析"
        @click-left="goBack"
        left-arrow>
      </van-nav-bar>
      <div class="spoken-analyse__topic" v-if="$route.params.type == 'analyse'">{{info[index].splitSentence.sentenceContent}}</div>
<!--     <div class="play-all-wrap" v-if="$route.params.type == 'personal'"> <div class="play-all" :class="{'is-play':isPlay}" @click="playAll">{{isPlay?'停止播放':'播放全部'}}</div></div>-->
      <div class="spoken-analyse__body">
        <spoken-table @play="isPlay = false" ref="spoken" :classId="$route.params.classId" :type="$route.params.type" :list="$route.params.type === 'personal'?info:info[index].splitInfoStudentAnswers"></spoken-table>
      </div>
      <div class="spoken-analyse__footer"  v-if="$route.params.type == 'analyse'">
        <van-button @click="toggle(0)" class="btn mgr10" type="info">上一题</van-button>
        <van-button @click="toggle(1)" class="btn" type="info">下一题</van-button>
      </div>
    </section>
</template>

<script>
  import spokenTable from '../../components/spokenTable'
    export default {
        name: "spokenAnalyse",
      data() {
        return {
          isPlay: false,
          index: this.$route.params.index
        }
      },
      components: {spokenTable},
      computed: {
        info() {
          return this.$route.params.info
        }
      },
      methods: {
         goBack(){
          this.common.goBack(this)
        },
        toggle(type) {
          if(type) {
            // 下一题
            if(this.index < this.info.length -1) {
              this.index++
            }else {
              this.$toast('没有下一题了!')
            }
          }else {
            //上一题
            if(this.index > 0) {
              this.index--
            }else {
              this.$toast('没有上一题了!')
            }
          }
        },
          playAll() {
            if(this.isPlay) {
              this.isPlay=false
              this.$refs['spoken'].pauseAll()
            }else {
              this.isPlay=true
              this.$refs['spoken'].playAll()
            }
          }
      }
    }
</script>

<style lang="less" scoped>
  .spoken-analyse {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__topic {
      /*flex: 0 0 50px;*/
      padding: 5px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      text-align: center;
    }
    .play-all-wrap {
      padding: 10px 10px 0;
      background: #fff;
      .play-all {
        background: #E0FFFC;
        width: 85px;
        line-height: 25px;
        border-radius: 12px;
        font-size: 12px;
        color: @blue;
        position: relative;
        padding-left: 25px;
        &::before {
          content: '';
          width: 0px;
          height: 0px;
          border-width:0 6px 9px;
          border-style:solid;
          border-color:transparent transparent @blue;
          transform: translateY(-50%) rotateZ(90deg);
          position: absolute;
          left: 8px;
          top: 50%;
        }
        &.is-play::before {
          content: '||';
          border: none;
          transform: none;
          top: auto;
        }
      }

    }

    &__body {
      flex: 1;
      overflow-y: auto;
      background: #fff;
      padding: 10px;
    }
    &__footer {
      flex: 0 0 55px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 18px;
      .btn {
        flex: 1;
        border-radius: 20px;
        font-size: 18px;
        color: #fff;
      }
    }
  }
</style>
