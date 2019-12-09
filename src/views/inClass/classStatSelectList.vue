<template>
    <section class="class-stat-select-list">
      <div class="class-stat-select-list__body">
        <van-cell-group class="mgt10">
          <van-cell v-for="(item,index) in classList" :key="index" class="fs16"
                    :title="item.className"
                    is-link @click="handleSelectClass(item.classId)"/>
        </van-cell-group>
      </div>
    </section>
</template>

<script>
  import {getTaskGroupByClass} from '@/api/index'
    export default {
        name: "classStatSelectList",
      data() {
        return {
          classList: []
        }
      },
      created() {
          this.getTaskGroupByClass()
      },
      methods: {
        handleSelectClass(classId) {
          this.$router.push({
            path: '/classStatList', query: {
              ...this.$route.query,
              classId
            }
          })
        },
        getTaskGroupByClass() {
          this.$store.commit('setVanLoading', true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "tchCourseId":this.$route.query.tchCourseId,
            "taskType":"T10",
            "roleType":"A02"
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          getTaskGroupByClass(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if(res.flag) {
              this.classList = res.data|| []
            }else {
              this.$toast(res.msg)
            }
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  .class-stat-select-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
