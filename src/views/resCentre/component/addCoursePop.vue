<template>
  <van-popup
    v-model="show"
    :closeable="true"
    close-icon="close"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="add-course-pop">
      <div class="add-course-pop__header">《{{resName}}》添加至课程</div>
      <div class="add-course-pop__body">
        <div v-if="list.length">
          <div class="subject-title" v-if="gradeTerm">
            {{gradeTerm.split('|')[0]|getGradeName}}{{list[0].tchCourseInfo.subjectType|getSubjectName}}
          </div>
          <van-radio-group class="course-group" v-model="radio">
            <van-radio v-for="(item,index) in list" :key="index" :name="index" class="mgr10 mgb15">
              <i slot="icon"
                 slot-scope="props"
                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              {{item.tchCourseInfo.courseName}}
            </van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="add-course-pop__footer">
        <van-button type="info" class="btn" @click="submit">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {addTeachCourseRes} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "addCoursePop",
    props: ['visible', 'gradeTerm', 'list', 'resName','resourceId','resourceType','isSendTask','listKey'],
    data() {
      return {
        radio: ''
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
          eventBus.$emit('hideNav',true)
        }
      },
    },
    watch: {
      visible(v) {
        if (v) {
          eventBus.$emit('hideNav',false)
        }
      }
    },
    methods: {
      submit() {
        if(this.radio === '') return this.$toast('请选择课程')

        if(this.isSendTask) {
          this.$store.commit("setTchCourseInfo", this.list[this.radio].tchCourseInfo)
          this.$store.commit("setTaskClassInfo", '')
          if(this.listKey === 'exam') {
            this.$router.push(`/addTask?type=exam&_t=new`)
          }else {
            this.$router.push(`/addTask?type=${this.listKey}&_t=new`)
          }
        }else {
          this.$store.commit('setVanLoading',true)
          const {tchCourseId,sysCourseId, relationSeqId, statusCd, courseName} = this.list[this.radio].tchCourseInfo
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "operateRoleType": "A02",
            tchCourseId,
            sysCourseId,
            relationSeqId,
            statusCd,
            "resourceId": this.resourceId,
            "resourceType": this.resourceType,
            addType: 'A01'
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          addTeachCourseRes(params).then(res => {
            this.$store.commit('setVanLoading',false)
            if(res.flag) {
              this.show = false
              this.$emit('success',courseName)
              this.$toast('添加成功')
            }else {
              this.$toast(res.msg)
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .add-course-pop {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      font-size: 18px;
      font-weight: bold;
      padding: 15px 45px;
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .subject-title {
        padding-left: 9px;
        font-size: 15px;
        line-height: 50px;
      }

      .course-group {
        padding-left: 53px;

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      display: flex;
      align-items: center;
      padding: 0 10px;

      .btn {
        flex: 1;
        font-size: 18px;
        border-radius: 20px;
        line-height: 44px;
        height: 44px;
      }
    }
  }
</style>
