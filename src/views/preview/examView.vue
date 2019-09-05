<template>
  <section class="exam-view-wrap">
    <van-nav-bar
      :title="$route.params.title"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="exam-view-wrap__tab">
      <div @click="handleToggle(true)" :class="{active:classView}">班级查看</div>
      <div @click="handleToggle(false)" :class="{active:!classView}">小组查看</div>
    </div>
    <div class="exam-view-wrap__body">
      <score-table :list="classList" :isSpoken="isSpoken" :classView="true" v-show="classView"></score-table>
      <score-table :list="groupList" :isSpoken="isSpoken" :classView="false" v-show="!classView"></score-table>
    </div>
  </section>
</template>

<script>
  import scoreTable from '../../components/scoreTable'
  import {getStudentName} from '@/utils/filter'
  export default {
    name: "examView",
    data() {
      return {
        classView: true, //按班级查看
        isSpoken: true
      }
    },
    computed: {
      classList() {
       return  this.$route.params.info.studentStatList.reduce((t,v) => {
          if(v.endDate) {
            t.push({...v,name:getStudentName(v.accountNo,this.$route.params.info.classId),duration: `${Math.floor(v.duration/60)}分钟${v.duration%60}秒`})
          }
          return t
        },[])
      },
      groupList() {
        return  this.$route.params.info.studentStatList.reduce((t,v) => {
          if(v.endDate) {
            const index = t.findIndex(g => g.groupId === v.groupId)
            const item = {...v,name:getStudentName(v.accountNo,this.$route.params.info.classId),duration: `${Math.floor(v.duration/60)}分钟${v.duration%60}秒`}
            if(index > -1) {
              // 已存在相同组
              t[index].stu.push(item)
             const total = t[index].stu.reduce((total,s) => {
                total += s.score
                return total
              },0)
              t[index].average = (total / t[index].stu.length).toFixed(2)
            }else {
              t.push({
                groupId:v.groupId,
                groupName: v.groupName,
                average: item.score,
                stu: [item]
              })
            }

          }
          return t
        },[])
      }
    },
    created() {
    },
    components: {scoreTable},
    methods: {
      handleToggle(bol) {
        //班级未分组时,无法切换小组查看 弹出toast
        if(JSON.parse(localStorage[`subGroup_${localStorage.currentSubjectType}_${this.$route.params.info.classId}`]).length === 0) {
         return this.$toast('该班级未分组,无法进行小组查看')
        }
        this.classView = bol
      },
    }
  }
</script>

<style lang="less" scoped>
  .exam-view-wrap {
    flex-direction: column;
    display: flex;

    &__tab {
      flex: 0 0 48px;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > div {
        border-radius: 15px;
        font-size: 15px;
        color: #999;
        background: #F5F6FA;
        margin-right: 20px;
        line-height: 30px;
        padding: 0 15px;

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 0 10px 10px;

    }
  }
</style>
