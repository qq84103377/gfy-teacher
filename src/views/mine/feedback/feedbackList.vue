<template>
  <div class="feedbackList">
    <div class="maxBox" v-if="list!=null&&list.length>0">
      <div>
        <div class="list" v-for="item in list " :key="item.feedbackId" @click="gotoDetail(item)">
          <span class="badge" v-if="item.feedbackStatus == 'S07'">解决</span>
          <van-row >
            <van-col span="16">
              <p>编号:{{item.feedbackId}}</p>
            </van-col>
            <van-col span="8">
              <p class="createDate">{{item.createDate|dealTime}}</p>
            </van-col>
          </van-row>
          <div class="txt">
            <span class="title">{{item.problemTitle}}</span>
            <span
              class="status"
              :style="{color:handleColor(item.feedbackStatus)}"
            >{{handleStatus(item.feedbackStatus)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="placeholderImg" >
      <img src="@assets/img/blank.png"/>
      <p>暂无记录~</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @deep: ~'>>>';
  .feedbackList{
    background-color: #f5f5f6;
    .maxBox{
      overflow-y: scroll;
      .list {
        width: 95%;
        height: 90px;
        background: #fff;
        border-radius: 10px;
        text-align: left;
        margin: 10px auto;
        position: relative;
        overflow: hidden;
        .badge {
          position: absolute;
          text-align: center;
          line-height: 96px;
          right: -28px;
          top: -28px;
          width: 56px;
          height: 56px;
          font-size: 10px;
          background: #24b969;
          color: #fff;
          transform: rotateZ(45deg);
        }
        @{deep} .van-row{
          height: 33px;
          border-bottom: 1px solid #F5F6FA;
          p {
            font-size: 14px;
            line-height: 33px;
            text-indent: 10px;
            color: #666;

          }
        }

        .txt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px auto;
          width: 95%;
          font-size: 14px;
          line-height: 20px;
          color: #333;
          .title {
            flex: 0 0 205px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .status {
            margin-right: 40px;
          }
        }
      }
    }
    .placeholderImg{
      width: 100%;
      height: 100%;
      text-align: center;
      .column-center;
      img {
        width: 300px;
        margin: 10px auto;
      }
      p{
        font-size: 12px;
        color: #999999;
        text-align: center;
        margin-top: 15px;
      }
    }
  }


</style>

<script>
  import { pubApi } from "@/api/parent-GFY";
  export default {
    data() {
      return {
        loading: true
      };
    },
    filters: {
      dealTxt: function(val) {
        if (val == null || val.length == 0) {
          return "暂无描述";
        } else {
          return val;
        }
      },
      dealTime(value) {
        var time = new Date(value);
        return (
          time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate()
        );
      }
    },
    computed: {
      list: {
        get() {
          return this.$store.state.feedBackList;
        },
        set(val) {
          this.$store.state.feedBackList = val;
        }
      }
    },

    methods: {
      handleColor(status) {
        switch (status) {
          case "S01":
            return "#24B969";
          case "S02":
            return "#FF9000";
          case "S03":
            return "#24B969";
          case "S07":
            return "#999";
          case "S08":
            return "#999";
          case "S09":
            return "#999";
        }
      },
      handleStatus(status) {
        switch (status) {
          case "S01":
            return "待回复";
          case "S02":
            return "待确认";
          case "S03":
            return "待回复";
          case "S07":
            return "已结束";
          case "S08":
            return "已结束";
          case "S09":
            return "已结束";
        }
      },
      gotoDetail(obj) {
        var query = {
          objectId: obj.feedbackId,
          title: obj.problemTitle,
          status: obj.feedbackStatus,
          evaluationScore: obj.evaluationScore
        };
        this.$router.push({ path: "/feedbackDetail", query });
      },

      feedbackList() {
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            accountNo: this.$store.getters.getUserInfo.accountNo,
            pageSize: 100,
            currentPage: 1
          })
        };
        pubApi.getMyFeedBackList(json).then(data => {
          this.loading = false;
          if (data.flag) {
            if (data.data != null && data.data.length > 0) {
              this.list = data.data;
            } else {
              this.list = null;
            }
          } else {
            this.list = null;
          }
        });
      }
    },
    activated() {
      this.feedbackList();
    }
  };
</script>

