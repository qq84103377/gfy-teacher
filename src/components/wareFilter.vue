<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="ware-filter-wrap">
      <div class="ware-filter-wrap__header van-hairline--bottom">
        <div class="ware-filter-wrap__header-tab">
          <span>选择课件</span>
          <van-icon class="icon-close" @click="show=false" name="close"/>
        </div>
      </div>
      <div class="ware-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="selectTab('all')" :class="{blue:largeClass.all}">全部
          </div>
        </div>
        <div>
          <div @click="selectTab('personal')" :class="{blue:largeClass.personal}">个人
          </div>
        </div>
        <div>
          <div @click="selectTab('school')" :class="{blue:largeClass.school}">校内
          </div>
        </div>
        <div>
          <div @click="selectTab('share')" :class="{blue:largeClass.share}">共享
          </div>
        </div>
      </div>
      <div class="ware-filter-wrap__body">
        <div class="ware-filter-wrap__body-left">
          <div @click="handleType(item)" v-for="(item,index) in typeList" :key="index" :class="{active:item.active}">
            {{item.name}}
          </div>
        </div>
        <div class="ware-filter-wrap__body-right">
          <div v-if="!isLoading&&courseList.length==0" class="empty-page">
            <img src="../assets/img/empty-1.png" alt />
            <span style="font-size: 14px">当前没有{{currentTypeName}}，快去上传{{currentTypeName}}吧！</span>
          </div>
          <div v-for="(item,index) in courseList" :key="index" @click="handleSelect(item)"
               :class="['cell__item',{active:item.check}]">
            <div>
              {{item.coursewareName || item.testPaperName}}
            </div>
            <van-icon v-show="item.check" class="check blue" name="success"/>
          </div>
        </div>
      </div>
      <div class="ware-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {teachApi} from '@/api/parent-GFY'

  export default {
    name: "wareFilter",
    props: ['visible'],
    data() {
      return {
        largeClass: {
          all: true,
          personal: false,
          school: false,
          share: false,
        },
        typeList: [{name: '课件', active: true, coursewareClassify: 'C03', resourceType: 'R01'}, {
          name: '视频',
          coursewareClassify: 'C01|C04',
          resourceType: 'R01'
        }, {name: '试卷', coursewareClassify: '', resourceType: 'R02'}],
        courseList: [],
        selectArr: [],
        currentTypeName: "课件",
        isLoading: false
      }
    },
    watch: {
      visible(v) {
        if (!v) {
          this.selectArr = []
          this.courseList.forEach(v => {
            this.$set(v,'check',false)
          })
        }
      }
    },
    created() {
      this.getList()
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
      activeType() {
        return this.typeList.filter(v => v.active)[0]
      }
    },
    methods: {
      confirm() {
        this.show = false
        this.$emit('confirm',this.selectArr)
      },
      getList() {
        this.courseList = []
        this.isLoading = true
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": this.activeType.resourceType,
          "shareType": this.largeClass.all ? '' : this.largeClass.personal ? 'S01' : this.largeClass.school ? 'S02' : 'S03',
          "sourceName": "",
          "pageSize": "999",
          "coursewareClassify": this.activeType.coursewareClassify,
          "currentPage": 1
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          this.isLoading = false
          const key = this.activeType.coursewareClassify ? 'courseware' : 'testPaperInfo'
          if (res.flag && res.data.length && res.data[0][key]) {
            res.data[0][key].forEach(v => {
              // 选中已经保存在selectArr的数据
              this.$set(v, 'check', this.selectArr.some(s => s.resourceId === (this.activeType.coursewareClassify ? v.coursewareId : v.testPaperId)))
            })
            this.courseList = res.data[0][key]
          }else {
            this.courseList = []
          }
        })
      },
      selectTab(type) {
        if (this.largeClass[type]) return
        for (let k in this.largeClass) {
          this.largeClass[k] = false
        }
        this.largeClass[type] = true
        this.getList()
      },
      handleSelect(item) {
        this.$set(item, 'check', !item.check)
        if (item.check) {
          // const {}
          let dataType = "D05";
          if (item.url) {
            let suf = item.url.substring(item.url.lastIndexOf(".") + 1).toLowerCase();
            if (suf == "mp4" || suf == "mp3" || suf == "avi" || suf == "wmv") {
              dataType = "D03";
            } else if (suf == "jpg" || suf == "png" || suf == "jpeg" || suf == "bmp" || suf == "gif") {
              dataType = "D01";
            } else {
              dataType = "D04";
            }
          }
          this.selectArr.push({
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            accountNo: this.$store.getters.getUserInfo.accountNo,
            accountType: 'A02',
            belongSchoolId: this.$store.getters.schoolId,
            dataUrl: item.url,
            dataType,
            resourceType: this.activeType.resourceType,
            resourceClass: 'C01',
            resourceId: this.activeType.coursewareClassify ? item.coursewareId : item.testPaperId,
            majorLevel: 'M01',
            tchCourseId: this.$route.query.tchCourseId,
            subjectType: this.$route.query.subjectType,
            classId: this.$route.query.classId,
          })
        } else {
          const index = this.selectArr.findIndex(v => v.resourceId === (this.activeType.coursewareClassify ? item.coursewareId : item.testPaperId))
          this.selectArr.splice(index, 1)
        }
      },
      handleType(item) {
        if (item.active) return
        try{MobclickAgent.onEvent('clickSelectWareType')}catch(e){console.log(e)}
        this.currentTypeName = item.name
        this.typeList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.getList()
      },
    }
  }
</script>

<style lang="less" scoped>
  .ware-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        text-align: center;
        position: relative;

        span {
          font-weight: bold;
          font-size: 18px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }

        .icon-close {
          font-size: 22px;
          color: #ccc;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }


    }

    &__dropdown {
      display: flex;
      flex: 0 0 44px;

      > div {
        flex: 1;
        font-size: 16px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
        position: relative;

        &:last-child {
          border-right: none;
        }

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }
    }

    &__body {
      display: flex;
      flex: 1;

      &-left {
        flex: 0 0 95px;
        overflow-y: auto;

        > div {
          text-align: center;
          line-height: 44px;
          font-size: 15px;
          border-left: 2.5px solid transparent;

          &.active {
            color: @blue;
            border-left: 2.5px solid #16aab7;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;


        .cell__item {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
          word-break: break-all;
          border-bottom: 1px solid #ebedf0;
          padding: 0 20px;

          div {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
            -webkit-box-orient: vertical;
            word-break: break-all;
            flex: 1;
          }
          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 6px 10px;

      .confirm-btn {
        width: 100%;
        color: #fff;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
  .null-tips {
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
</style>
