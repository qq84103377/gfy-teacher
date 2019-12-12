<template>
  <div>
    <van-popup
      v-model="visible"
      position="bottom">
      <div class="correct-pop">
        <div class="correct-pop__title">纠错</div>
        <van-cell class="correct-pop__cell">
          <div slot="title" class="aic">
            <div><span class="red">*</span>纠错类型:</div>
            <div class="pdlt10" style="flex:1">{{selectItem.dictValue}}</div>
            <van-icon @click="typeSelect = true" class="add" name="add"/>
          </div>
        </van-cell>
        <van-cell class="correct-pop__cell">
          <div slot="title">
            <div><span class="red">*</span>纠错信息:</div>
            <textarea rows="4" v-model="remark"></textarea>
          </div>
        </van-cell>
        <div class="correct-pop__footer">
          <van-button :loading="btnLoading" loading-text="提交" type="info" class="btn" @click="addErrorCorrectInfo">提交
          </van-button>
        </div>


      </div>
    </van-popup>
    <van-popup
      v-model="typeSelect"
      :style="{height: '90%'}"
      position="bottom">
      <div class="type-pop">
        <div class="type-pop__title">纠错类型</div>
        <van-cell v-for="(item,index) in typeList" :key="index" class="type-pop__cell">
          <div slot="title" @click="handleSelect(item)" class="aic jcsb" :class="{active:item.active}">
            <div>{{item.dictValue}}</div>
            <van-icon v-if="item.active" name="success"/>
          </div>
        </van-cell>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {getSysDictList, addErrorCorrectInfo} from '@/api/index'

  export default {
    name: "correctPop",
    props: ['show', 'correctInfo'],
    computed: {
      visible: {
        get() {
          return this.show
        },
        set(v) {
          this.$emit('update:show', v)
        }
      }
    },
    watch: {
      show(v) {
        if (!v) {
          this.remark = ''
          this.selectItem = {}
          this.typeList.forEach(v => {
            this.$set(v, 'active', false)
          })
        }
      }
    },
    created() {
      this.getSysDictList()
    },
    methods: {
      addErrorCorrectInfo() {
        if (!this.selectItem.dictKey) {
          return this.$toast('请选择错误类型')
        }
        if (!this.remark) {
          return this.$toast('请输入纠错信息')
        }
        this.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "teacherAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "errorType": this.selectItem.dictKey,
          "examId": this.correctInfo.examId,
          "knowledgePointId": this.correctInfo.knowledgePointId,
          "subjectType": this.$route.query.subjectType || localStorage.currentSubjectType,
          "classGrade": this.correctInfo.classGrade || this.$route.query.classGrade,
          "phoneNo": this.$store.getters.getUserInfo.phoneNo,
          "correctInfo": this.remark
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addErrorCorrectInfo(params).then(res => {
          this.btnLoading = false
          if (res.flag) {
            this.visible = false
            this.$toast('提交成功')
            this.$emit('success')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleSelect(item) {
        this.typeList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.typeSelect = false
        this.selectItem = item
      },
      getSysDictList() {
        let obj = {
          "interUser": "123",
          "interPwd": "123",
          "dictCode": "Domain_Error_Type"//字典编码
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSysDictList(params).then(res => {
          if (res.flag) {
            this.typeList = res.data[0].sysDictInfoList
          }
        })
      },

    },
    data() {
      return {
        remark: '',
        typeSelect: false,
        btnLoading: false,
        typeList: [],
        selectItem: {}
      }
    }
  }
</script>

<style lang="less" scoped>
  .correct-pop {

    &__title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      line-height: 47px;
    }

    .align {
      margin-left: -8px;
    }

    &__cell {
      .add {
        font-size: 22px;
        color: @blue;
      }

      textarea {
        margin-top: 15px;
        width: 100%;
        background: #f5f6fa;
        padding: 10px;
        border-radius: 5px;
      }
    }

    &__footer {
      height: 55px;
      padding: 5px 15px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
  .type-pop {
    &__title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      line-height: 47px;
    }

    &__cell {
      .active {
        color: @blue;
      }
    }
  }

</style>
