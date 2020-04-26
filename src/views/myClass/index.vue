<template>
  <section class="my-class-wrap">
    <div class="my-class-wrap__body">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="学生分组" name="1">
          <van-cell v-for="(value,key) in classList" :key="key" v-if="value.teacherInfoList.some(v => v.subjectType !== 'S20')" :title="value.className" @click="viewClassDetail(key,value)" is-link />
          <div v-if="!Object.keys(classList).length" class="empty-page">
            <img src="../../assets/img/empty-2.png" alt />
            <div class="grey9 fs12">当前没有班级！</div>
          </div>
        </van-collapse-item>
        <van-collapse-item title="家长信息" name="2" v-if='showfEduction'>
          <van-cell v-for="(value,key) in classList" :key="key" v-if="value.teacherInfoList.some(v => v.subjectType == 'S20')" :title="value.className" @click="viewParentClassDetail(key,value)" is-link />
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

export default {
  name: "index",
  data() {
    return {
      classList: JSON.parse(localStorage.classMap),
      activeNames: ['1'],
      showfEduction: localStorage.getItem('showfEduction')
    }
  },
  methods:{
    viewClassDetail(key,value) {
      try{MobclickAgent.onEvent('clickGroupClass')}catch(e){console.log(e)}
      this.$router.push(`/classDetail?classId=${key}&className=${value.className}`)
    },
    viewParentClassDetail(key,value) {
      try{MobclickAgent.onEvent('clickMyClassParent')}catch(e){console.log(e)}
      this.$router.push(`/fClassDetail?classId=${key}&className=${value.className}&isClassParent=true`)
    }
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
    padding-bottom: 0;
  }
}
</style>
