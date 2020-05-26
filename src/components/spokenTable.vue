<template>
  <div class="spoken-table" :class="{sticky:type=='analyse' || type == 'personal'}">
    <div class="row table-head">
      <div class="col">序号</div>
      <div class="col ex-width" v-if="type == 'statistic' || type == 'personal'">词汇/句子</div>
      <div class="col" v-if="type == 'statistic'">平均分</div>
      <div class="col ex-width" v-if="type == 'analyse'">学生姓名</div>
      <div class="col" v-if="type == 'analyse' || type == 'personal'">得分</div>
<!--      <div class="col" v-if="type == 'analyse' || type == 'personal'">学生录音</div>-->
    </div>
    <div class="scroll-area">
      <div class="row" v-for="(item,index) in list" :key="index">
        <div class="col">{{index+1}}</div>
        <div class="col ex-width pd5" style="word-break: break-all" v-if="type == 'statistic'">{{item.splitSentence.sentenceContent}}</div>
        <div class="col ex-width pd5" v-if="type == 'personal'">{{item.sentenceContent}}</div>
        <div class="col blue" v-if="type == 'statistic'" @click="jump(index)">{{item.splitSentence.spliteSentenAverage || 0}} ></div>
        <div class="col ex-width" v-if="type == 'analyse'">{{getStudentName(item.accountNo,classId)}}</div>
        <div class="col" v-if="type == 'analyse' || type == 'personal'">{{item.score}}</div>
<!--        <div class="col" v-if="type == 'analyse' || type == 'personal'">-->
<!--          <van-icon @click="play(index,item)" class="blue audio-icon" :name="item.play?'pause-circle':'play-circle'"></van-icon>-->
<!--          <audio :id="'audio'+ index" :src="item.studentAnswer"></audio>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {getStudentName} from '@/utils/filter'
  export default {
        name: "spokenTable",
      props: ['type','list','classId'], //statistic 统计页面  analyse 题目分析  personal 个人分析
      data() {
          return {
            playIndex: null,
            // list: [
            //   {word: 'Words and expressions？Words and',score: 9,average: 100,name: '裘千仞欧阳修',src:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'},
            //   {word: 'Words and expressions？Words and',score: 9,average: 100,name: '裘千仞欧阳修',src:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'},
            //   {word: 'Words and expressions？Words and',score: 9,average: 100,name: '裘千仞欧阳修',src:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'},
            //   {word: 'Words and expressions？Words and',score: 9,average: 100,name: '裘千仞欧阳修',src:'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201907/20190718082513_bE83G_允儿 - 简单爱 (Live).MP3'},
            // ]
          }
      },
    computed: {
      getStudentName() {
        return getStudentName
      }
    },
      methods: {
          play(index,item) {
            this.$emit('play')
            if(item.play) {
              this.$set(item,'play',false)
              document.getElementById('audio' + index).pause()
            } else {
              if(this.playIndex !== null) {
                // 上一个正在播放的音频暂停
                document.getElementById('audio' + this.playIndex).pause()
                this.$set(this.list[this.playIndex],'play',false)
              }
              this.playIndex = index
              this.$set(item,'play',true)
              document.getElementById('audio' + index).play()
              document.getElementById('audio' + index).removeEventListener('ended', this.playEndedHandler, false)
              document.getElementById('audio' + index).addEventListener('ended', () => {
                this.$set(item,'play',false)
              }, false)
            }
          },
        playAll() {
          if(this.playIndex !== null) {
            // 上一个正在播放的音频暂停
            document.getElementById('audio' + this.playIndex).pause()
            this.$set(this.list[this.playIndex],'play',false)
          }
          this.playIndex = 0
          const audio = document.getElementById('audio' + this.playIndex)
          this.$set(this.list[this.playIndex],'play',true)
          audio.play()
          audio.addEventListener('ended', this.playEndedHandler, false)
        },
        playEndedHandler() {
          this.$set(this.list[this.playIndex],'play',false)
          this.playIndex++
          if (this.playIndex > this.list.length - 1) return
          const audio = document.getElementById('audio' + this.playIndex)
          audio.play()
          this.$set(this.list[this.playIndex],'play',true)
          audio.addEventListener('ended', this.playEndedHandler, false)
        },
        pauseAll() {
          this.$set(this.list[this.playIndex],'play',false)
          document.getElementById('audio' + this.playIndex).removeEventListener('ended', this.playEndedHandler, false)
          document.getElementById('audio' + this.playIndex).pause()
        },
        jump(index) {
            if(this.type === 'statistic') {
              this.$router.push({name:'spokenAnalyse',params:{type:'analyse',info:this.list,classId:this.classId,index}})
            }else {
              this.$router.push({name:'spokenAnalyse',params:{type:'personal',info:this.list,classId:this.classId,index}})
            }
        }
      }
    }
</script>

<style lang="less" scoped>
  .spoken-table {
    border: 1px solid #F5F6FA;
    border-top: 2px solid @blue;
    border-bottom: none;
    color: #333;
    font-size: 12px;
    width: 100%;

    &.sticky {
      max-height: 100%;
      display: flex;
      flex-direction: column;
      .scroll-area {
        flex: 1;
        overflow-y: auto;
      }
      .table-head {
        flex: 0 0 44px;
      }
    }

    .row {
      display: flex;
      .col {
        flex: 1;
        text-align: center;
        /*line-height: 44px;*/
        min-height: 44px;
        line-height: 22px;
        border-right: 1px solid #F5F6FA;
        border-bottom: 1px solid #F5F6FA;
        display: flex;
        align-items: center;
        justify-content: center;
        &:last-child {
          border-right: none;
        }
        &.ex-width {
          flex: 2.5;
        }
      }
    }
    .audio-icon {
      font-size: 22px;
      vertical-align: middle;
    }
  }
</style>
