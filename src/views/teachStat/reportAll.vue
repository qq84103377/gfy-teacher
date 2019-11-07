<template>
    <section class="report-all-wrap">
      <van-nav-bar
        :title="(getStudentName($route.query.accountNo,$route.query.classId))+'的家庭报告'"
        @click-left="$router.back()"
        left-arrow/>
      <div class="report-all-wrap__body">
        <div class="fs16" style="font-weight: bold;">一、知识点掌握情况</div>
       <div>
         <div class="fs15 mgt10" v-for="(item,index) in subjectList" :key="index">{{index+1}}.{{item.subjectName}}</div>
       </div>
        <div class="fs16" style="font-weight: bold;">二、任务完成情况</div>
        <div>
          <div class="fs15 mgt10" v-for="(item,index) in subjectList" :key="index">{{index+1}}.{{item.subjectName}}</div>
        </div>
        <div class="fs16" style="font-weight: bold;">三、成绩趋势分析</div>
        <div>
          <div class="fs15 mgt10" v-for="(item,index) in subjectList" :key="index">{{index+1}}.{{item.subjectName}}</div>
        </div>
      </div>
      <div class="report-all-wrap__footer">
        <van-button class="btn" type="info">分享给家长</van-button>
      </div>
    </section>
</template>

<script>
  import {getSubjectName, getStudentName} from '@/utils/filter'
    export default {
        name: "reportAll",
      computed: {
        getStudentName() {
          return getStudentName
        },
      },
      data() {
          return {
            gradeList: [
              {classGrade: 'G01', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G02', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G03', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G04', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G05', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G06', subject: ['S01', 'S02', 'S03']},
              {classGrade: 'G07', subject: ['S01', 'S02', 'S03', 'S06', 'S07', 'S08', 'S09']},
              {classGrade: 'G08', subject: ['S01', 'S02', 'S03', 'S04', 'S06', 'S07', 'S08', 'S09']},
              {classGrade: 'G09', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07']},
              {classGrade: 'G10', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
              {classGrade: 'G11', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
              {classGrade: 'G12', subject: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09']},
            ],
            subjectList: []
          }
      },
      mounted() {
        this.init()
      },
      methods: {
        init() {
            this.subjectList = this.gradeList.find(v => this.$route.query.classGrade === v.classGrade).subject.map(v => {
              return {
                subjectName: getSubjectName(v),
                subjectType: v,
                kngArr: [],
                statInfo: {total: 0, finish: 0, percent: 0, arrLength: 0},
                scoreInfo: {total: 0, maxDate:'',maxScore:0,maxAvg:0,minDate:'',minScore:0,minAvg:0, suggest:''}
              }
            })
        }
      }
    }
</script>

<style lang="less" scoped>
  .report-all-wrap {
    display: flex;
    flex-direction: column;
    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    &__footer {
      flex: 0 0 55px;
      display: flex;
      align-items: center;
      padding: 0 17px;
      .btn {
        line-height: 44px;
        height: 44px;
        border-radius: 20px;
        flex: 1;
        font-size: 18px;
      }
    }
  }
</style>
