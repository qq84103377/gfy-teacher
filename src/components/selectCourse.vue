<template>
  <van-popup
    v-model="show"
    :closeable="true"
    close-icon="close"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="add-course-pop">
      <div class="add-course-pop__header">添加</div>
      <div class="add-course-pop__body">
        <div v-for="(item,index) in list" :key="index">
          <div v-if="item.classGrade">
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
          <div v-else>
            <div class="subject-title">无</div>
            <van-radio-group class="course-group" v-model="item.radio">
              <van-radio @click="handleChange(index)" v-for="(c,ci) in item.arr" :key="ci" :name="ci" class="mgr10 mgb15">
                <i slot="icon"
                   slot-scope="props"
                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                {{c.tchCourseInfo.courseName}}
              </van-radio>
            </van-radio-group>
            <div class="fs12 red pdlt10">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div>
          </div>
        </div>
        <div style="text-align: center" v-if="!list.length">当前全部课程已过期，请新建课程</div>

<!--        <div class="pdlt10">-->
<!--          <van-radio @click="clickNone" v-model="none" name="1" class="mgr10 mgb15">-->
<!--            <i slot="icon"-->
<!--               slot-scope="props"-->
<!--               :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>-->
<!--            无-->
<!--          </van-radio>-->
<!--          <div class="fs12 red">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div>-->
<!--        </div>-->

      </div>
      <div class="add-course-pop__footer">
        <van-button type="info" class="btn" @click="submit">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>

  export default {
    name: "addCoursePop",
    props: ['visible', 'list'],
    data() {
      return {
        listIndex: 0,
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
    watch: {
      show(v) {
        if(v) {
          this.listIndex = this.$parent.listIndex
        }
      }
    },
    methods: {
      // clickNone() {
      //   if(!this.none) return
      //   this.list.forEach((v,i) => {
      //       this.$set(v,'radio','')
      //   })
      //   this.listIndex = ''
      // },
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
        // if(this.listIndex === '') return this.$toast('请选择课程')
        if(!this.list.length) return this.$toast('请选择课程')
        this.show = false
          this.$emit('filter',this.listIndex,this.list[this.listIndex].radio,this.list[this.listIndex].arr[this.list[this.listIndex].radio])
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
      text-align: center;
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

      }
      .radio-normal {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
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
