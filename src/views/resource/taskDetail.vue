<template>
    <section class="task-detail">
      <div class="task-detail__body">
        <div class="task-detail__body__top">
          <div class="fs18 mgb10" style="font-weight: bold;">练习发布成功</div>
          <div class="red fs10">您可以把练习分享诶家长，督促学生及时完成练习</div>
        </div>
        <div class="task-detail__body__center">
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>名称</div>
              <div class="ellipsis">{{taskDetail.taskName}}</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>开始时间</div>
              <div>2017-1-19 15:29</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>结束时间</div>
              <div>2017-1-19 15:29</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title">
              <div>描述:</div>
              <div class="desc">{{taskDetail.desc}}</div>
            </div>
          </van-cell>
        </div>
        <div class="task-detail__body__center">
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>类型</div>
              <div>{{taskDetail.taskType|dealType(taskTypeList)}}</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>题量</div>
              <div>{{taskDetail.examCount}}道</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title" class="task-detail__body__center__cell">
              <div>时长</div>
              <div>{{taskDetail.duration}}分钟</div>
            </div>
          </van-cell>
          <van-cell>
            <div slot="title">
              <div class="task-detail__body__center__cell">
                <div>备注:</div>
                <div class="fs10 red">{{200 - remark.length}}</div>
              </div>
              <textarea rows="1" maxlength="200" v-model="remark" placeholder="请输入描述，字数在200字内"></textarea>
            </div>

          </van-cell>
        </div>
      </div>
      <div class="task-detail__footer">
        <van-button type="info" class="btn" @click="shareBarShow = true">分享给家长</van-button>
        <van-button type="info" class="btn" @click="$router.go(-2)">完成</van-button>
      </div>
      <share-bar :show.sync="shareBarShow"></share-bar>
    </section>
</template>

<script>
  import shareBar from '../../components/shareBar'

  export default {
    name: "taskDetail",
    components: {shareBar},
    data() {
      return {
        remark: '',
        shareBarShow: false,
        taskDetail: {},
        taskTypeList : this.$store.getters.taskTypeList

      }
    },
    mounted() {
      this.taskDetail = this.$store.getters.getSendTaskInfo
      console.log(this.taskTypeList)
    }
  }
</script>

<style lang="less" scoped>
  .task-detail {
    display: flex;
    background: #f5f5f5;
    flex-direction: column;
    &__body {
      flex: 1;
      overflow-y: auto;
      &__top {
        background: #fff;
        text-align: center;
        padding: 20px 0;
        margin-bottom: 5px;
      }
      &__center {
        background: #fff;
        margin-bottom: 10px;
        .desc,textarea {
          width: 100%;
          background: #F5F6FA;
          border-radius: 5px;
          padding: 10px;
        }
        &__cell {
          display: flex;
          justify-content: space-between;
          .ellipsis {
            /*flex: 0 0 50%;*/
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      &__bottom {
        background: #fff;
        margin-bottom: 10px;
      }
    }
    &__footer {
      flex: 0 0 55px;
      padding: 5px 15px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn {
        flex: 1;
        font-size: 16px;
        border-radius: 22px;
        margin-right: 23px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>
