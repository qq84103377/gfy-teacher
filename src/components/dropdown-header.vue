<template>
  <div class="dropdown-header van-hairline--bottom">
    <slot name="left"></slot>
    <van-dropdown-menu active-color="none" class="dropdown-btn">
      <van-dropdown-item ref="dropdown" :title="courseName" :value="tchCourseId">
        <div style="flex: 1;overflow-y: auto" class="pd10">
          <van-pull-refresh v-model="refLoad" @refresh="onRefresh">
            <van-list v-model="listLoad" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
              <div v-for="(item,index) in list" :key="index" class="list-wrap" :class="{active:item.tchCourseInfo.tchCourseId == tchCourseId}">
                <list-item @clickTo="selectCourse(item.tchCourseInfo,index,item.resourceCount)" :fold="item.fold" class="mgt10" style="background: #fff;"  :itemTitle="item.tchCourseInfo.courseName" :class-info-list="item.tchCourseInfo.tchClassCourseInfo" >
                  <div v-if="item.tchCourseInfo.tchClassCourseInfo.length>2" @click="$set(item,'fold',!item.fold)" slot="btn" class="fs10" style="text-align: right"><i class="iconGFY icon-ellipsis"></i></div>
                </list-item>
              </div>
            </van-list>
          </van-pull-refresh>

        </div>
        <div class="folder-btn" @click="$refs['dropdown'].toggle(false)"><i class="iconGFY icon-fold"></i></div>
      </van-dropdown-item>

    </van-dropdown-menu>
    <slot name="right"></slot>
  </div>
</template>

<script>
  import listItem from './list-item'
    export default {
        name: "dropdown-header",
      props: ['list','courseName','tchCourseId','refLoading','listLoading','finished'],
      components: {listItem},
      data(){
          return {
            courseList: this.list,
            // refLoading: false,
            // listLoading: false,
            // finished: false,
          }
      },
      computed: {
        refLoad: {
          get() {
            return this.refLoading
          },
          set(v) {
            this.$emit('update:refLoading',v)
          }
        },
        listLoad: {
          get() {
            return this.listLoading
          },
          set(v) {
            this.$emit('update:listLoading',v)
          }
        },
      },
      methods:{
        selectCourse(tchCourseInfo,index,resourceCount) {
          this.$emit('selectCourse',tchCourseInfo,index,resourceCount)
          this.$refs['dropdown'].toggle(false)
        },
        onLoad() {
          this.$emit('onLoad')
        },
        onRefresh() {
          this.$emit('refresh')
        },
        chooseCourse(obj){
          console.log({"选择课程":obj})
          console.log(obj.tchCourseInfo.tchCourseId)
          this.$parent.getCourseTaskList(obj.tchCourseInfo.courseName,obj.tchCourseInfo.tchCourseId)
        }
      }
    }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .dropdown-header {
    flex: 0 0 55px;
    padding: 8px 9px;
    color: #16AAB7;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .btn-left {
      background: #e0fffc;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 66px;
      height: 27px;
      border-radius: 13px;
      margin-right: 10px;
    }
    .dropdown-btn {
      background: #e0fffc;
      font-size: 14px;
      border-radius: 20px;
      width: 230px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 39px;
      &::after {
        border: none;
      }
      @{deep} .van-overlay {
        top: 2px;
      }
      @{deep} .van-dropdown-menu__title{
        text-align: center;
        padding-right: 10px;
        width: 170px;
        display: inline-block;
        overflow : hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #16AAB7;
        &::after {
          right: 6px;
          top: 8px;
          content: '';
        }
        &--down::after{
          top: 11px;
          content: '';
        }
      }
      @{deep} .van-dropdown-item__content {
        height: 95%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
      }
      .list-wrap{
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .active{
        border: 1px solid #39f0dd;
      }
      .folder-btn {
        width: 100%;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
