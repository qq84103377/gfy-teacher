<template>
  <section class="board-class-list">
    <div class="board-class-list__tab">
      <div @click="changeTab(false)" class="van-hairline--right" :class="{active:!tabIndex}">教师白板</div>
      <div @click="changeTab(true)" :class="{active:tabIndex}">学生白板</div>
    </div>
    <div class="board-class-list__body" ref="body">
      <van-cell-group v-if="!tabIndex" class="mgt10">
        <van-cell v-for="(item,index) in classList" :key="index" class="fs14"
                  :title="item.className"
                  is-link @click="handleSelectClass(item.classId)"/>
      </van-cell-group>
      <van-collapse @change="handleChange" v-else v-model="activeNames" class="mgt10">
        <van-collapse-item class="fs16" v-for="(item,index) in classList" :key="index" :title="item.className"
                           :name="index">
          <van-cell class="fs12" v-for="(b,bi) in item.boardList" :key="bi"
                    :title="b.name"
                    is-link @click="handleSelectBoard(item.classId,b.batchNo)"/>
        </van-collapse-item>
      </van-collapse>
    </div>
  </section>
</template>

<script>
  import {getClassDataGroupByClass, getClassDataGroupByTeacher} from '@/api/index'
  import {mapMutations, mapGetters, mapState} from 'vuex'

  export default {
    name: "boardClassList",
    data() {
      return {
        classList: [],
        classBoardList: [],
        activeNames: [],
      }
    },
    computed: {
      ...mapState({
        tabIndex: state => state.setting.isStuBoard
      })
    },
    methods: {
      handleChange(activeArr) {
        if (activeArr.length > this.activeNames.length) {
          //有展开
          let value = '' //展开的index
          activeArr.forEach(v => {
            if (this.activeNames.indexOf(v) === -1) {
              value = v
            }
          })
          this.getClassDataGroupByTeacher(value)
        }
      },
      changeTab(bol) {
        this.$store.commit('setIsStuBoard',bol)
      },
      getClassDataGroupByClass() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          tchCourseId: this.$route.query.tchCourseId,
          resourceClass: 'C02',
          accountType: this.tabIndex ? 'A03' : 'A02',
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassDataGroupByClass(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.classList = res.data || []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      getClassDataGroupByTeacher(index) {
        if (this.classList[index].done) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          tchCourseId: this.$route.query.tchCourseId,
          resourceClass: 'C02',
          roleType: 'A02',
          classId: this.classList[index].classId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassDataGroupByTeacher(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$set(this.classList[index], 'boardList', res.data || [])
            this.$set(this.classList[index], 'done', true)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleSelectBoard(classId,batchNo) {
        this.$router.push({
          path: '/boardList', query: {
            ...this.$route.query,
            classId,
            batchNo
          }
        })
      },
      handleSelectClass(classId) {
        this.$router.push({
          path: '/boardList', query: {
            ...this.$route.query,
            classId
          }
        })
      },
    },
    created() {
      this.$store.commit('setIsStuBoard',false)
      this.getClassDataGroupByClass()
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .board-class-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__tab {
      background: #fff;
      flex: 0 0 44px;
      display: flex;
      align-items: center;

      > div {
        flex: 1;
        color: #333;
        font-size: 16px;
        text-align: center;
        line-height: 44px;

        &.active {
          color: @blue;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      @{deep} .van-collapse-item__content {
        padding: 0;
        padding-left: 10px;
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

