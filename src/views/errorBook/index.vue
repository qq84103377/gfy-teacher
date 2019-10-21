<template>
  <section class="error-book">
    <van-nav-bar
      title="错题集"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs12 blue" @click="filterShow=true">筛选</div>
    </van-nav-bar>
    <div class="error-book__tab van-hairline--bottom">
      <span class="fs15 grey6" style="white-space: nowrap">错误率</span>
      <div @click="$set(item,'active',!item.active)" :class="{active:item.active}" v-for="(item,index) in errorPercent"
           :key="index">{{item.value}}
      </div>
    </div>
    <div class="error-book__body">
      <div class="error-book__body-title van-hairline--bottom">课程列表</div>
      <div class="error-book__body-list">
        <div class="list-item van-hairline--bottom">
          <div>
            <div class="fs15 black">《2.7 有理数的乘法》</div>
            <div class="fs12 grey6 mgt5">(错题数:12)</div>
          </div>
          <div class="list-item__btn">添加</div>
        </div>
      </div>
    </div>

    <course-filter @confirm="(a,b,c) => {}" :visible.sync="filterShow" :sysCourseId.sync="sysCourseId"
                   type="myCourse"></course-filter>
  </section>
</template>

<script>
  import courseFilter from '../../components/courseFilter'
  import {getTeacherErrorExamList} from '@/api/index'
  export default {
    components: {courseFilter},
    name: "index",
    data() {
      return {
        filterShow: false,
        sysCourseId: '',
        errorPercent: [
          {value: 0},
          {value: 0.1},
          {value: 0.2},
          {value: 0.3},
          {value: 0.4},
          {value: 0.5},
          {value: 0.6},
          {value: 0.7},
          {value: 0.9},
          {value: 0.9},
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(errorPersent) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: '',
          subjectType: '',
          classGrade: '',
          termType: '',
          errorPersent
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTeacherErrorExamList(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {

          }else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .error-book {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__tab {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0 10px;
      background: #fff;
      overflow-x: auto;
      height: 33px;

      div {
        text-align: center;
        line-height: 19px;
        font-size: 13px;
        color: #333;
        flex: 0 0 33px;
        background: #fff;
        margin-left: 5px;

        &.active {
          background: #E0FFFC;
          color: @blue;
          border-radius: 2px;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      background: #fff;

      &-title {
        line-height: 50px;
        padding: 0 10px;
        font-size: 16px;
        font-weight: bold;
      }

      &-list {
        .list-item {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &__btn {
            flex: 0 0 55px;
            line-height: 25px;
            border-radius: 5px;
            font-size: 14px;
            border: 1px solid @blue;
            color: @blue;
            text-align: center;
            &.active {
              color: #fff;
              background: @blue;
            }
          }
        }
      }
    }
  ;
  }
</style>
