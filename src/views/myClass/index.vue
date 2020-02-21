<template>
  <section class="my-class-wrap">
    <div class="my-class-wrap__body">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="学生分组" name="1">
          <van-cell v-for="(value,key) in classList" :key="key" v-if="value.teacherInfoList.some(v => v.subjectType !== 'S20')" :title="value.className" @click="$router.push(`/classDetail?classId=${key}&className=${value.className}`)" is-link />
          <div v-if="!Object.keys(classList).length" class="empty-page">
            <img src="../../assets/img/empty-2.png" alt />
            <div class="grey9 fs12">当前没有班级！</div>
          </div>
        </van-collapse-item>
        <van-collapse-item title="家长信息" name="2">
          <van-cell v-for="(value,key) in classList" :key="key" v-if="value.teacherInfoList.some(v => v.subjectType == 'S20')" :title="value.className" @click="$router.push(`/fClassDetail?classId=${key}&className=${value.className}&isClassParent=true`)" is-link />
          <div v-if="!Object.keys(classList).length" class="empty-page">
            <img src="../../assets/img/empty-2.png" alt />
            <div class="grey9 fs12">当前没有班级！</div>
          </div>
        </van-collapse-item>
      </van-collapse>

    </div>
  </section>
</template>

<script>
import {
 getSubGroupParent
} from '@/api/index'

export default {
  name: "index",
  data() {
    return {
      classList: JSON.parse(localStorage.classMap),
      activeNames: ['1']
    }
  },
  mounted() {
    this.getSubGroupParent()
  },
  methods: {
    async getSubGroupParent(classId) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "tchCourseId": '',
        "classId": '',
        "subjectType": 'S20',
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getSubGroupParent(params).then(res => {
        console.log(res, 'getSubGroupParent res')
      })
    },
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.my-class-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  &__body {
    flex: 1;
    overflow-y: auto;
  }
  @{deep}.van-collapse-item__content {
    padding-top: 0;
  }
}
</style>
