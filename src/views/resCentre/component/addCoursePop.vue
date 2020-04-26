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
        <div v-for="(item,index) in list" :key="index">
<!--          <div class="subject-title" v-if="gradeTerm">-->
<!--            {{gradeTerm.split('|')[0]|getGradeName}}{{list[0].tchCourseInfo.subjectType|getSubjectName}}-->
<!--          </div>-->
          <div class="subject-title">{{item.classGrade|getGradeName}}{{item.arr[0].tchCourseInfo.subjectType|getSubjectName}}</div>
          <van-radio-group class="course-group" v-model="item.radio">
            <van-radio @click="handleChange(index)" v-for="(c,ci) in item.arr" :key="ci" :name="ci" class="mgr10 mgb15">
              <i slot="icon"
                 slot-scope="props"
                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              {{c.tchCourseInfo.courseName}}
            </van-radio>
          </van-radio-group>
        </div>
        <div style="text-align: center" v-if="!list.length">当前全部课程已过期，请新建课程</div>
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
    props: ['visible', 'gradeTerm', 'list', 'resName','resourceId','resourceType','isSendTask','listKey','tabIndex'],
    data() {
      return {
        // radio: ''
        listIndex: ''
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
        }
      },
    },
    methods: {
      handleChange(index) {
        if(this.listIndex === index) return
        this.list.forEach((v,i) => {
          if(index !== i) {
            this.$set(v,'radio','')
          }
        })
        this.listIndex = index
      },
      submit() {
        if(this.listIndex === '') return this.$toast('请选择课程')
        this.show = false
        if(this.isSendTask) {
          this.$store.commit("setTchCourseInfo", this.list[this.listIndex].arr[this.list[this.listIndex].radio].tchCourseInfo)
          this.$store.commit("setTaskClassInfo", '')
          if(this.listKey === 'exam') {
            this.$router.push(`/addTask?type=exam&_t=new&isRes=1&isPri=${this.tabIndex}`)
          }else {
            this.$router.push(`/addTask?type=${this.listKey}&_t=new&isRes=1&isPri=${this.tabIndex}`)
          }
        }else {
          this.$store.commit('setVanLoading',true)
          const {tchCourseId,sysCourseId, relationSeqId, statusCd, courseName} = this.list[this.listIndex].arr[this.list[this.listIndex].radio].tchCourseInfo
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
