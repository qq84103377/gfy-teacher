<template>
  <section class="res-centre-wrap">
    <van-nav-bar
      title="资源中心">
    </van-nav-bar>
    <div class="res-centre-wrap__tab">
      <div class="van-hairline--right" @click="tabIndex=0" :class="{active:!tabIndex}">平台资源</div>
      <div :class="{active:tabIndex}" @click="tabIndex=1">私人资源</div>
    </div>
    <div class="res-centre-wrap__body">
      <div class="res-centre-wrap__body__title">筛选</div>
      <van-cell class="res-centre-wrap__body__cell" v-if="!tabIndex">
        <div slot="title" @click="areaFilterShow=true" class="aic jcsb">
          <div class="fs16">地区</div>
          <div class="fs15"><span class="blue mgr10">{{areaLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell">
        <div slot="title" @click="subjectFilterShow=true" class="aic jcsb">
          <div class="fs16">学科</div>
          <div class="fs15"><span class="blue mgr10">{{subjectLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-if="!tabIndex">
        <div slot="title" @click="versionFilterShow=true" class="aic jcsb">
          <div class="fs16">教材</div>
          <div class="fs15"><span class="blue mgr10">{{versionLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-if="!tabIndex">
        <div slot="title" @click="resCourseFilterShow=true" class="aic jcsb">
          <div class="fs16">课程</div>
          <div class="fs15"><span class="blue mgr10">{{courseLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <div class="res-centre-wrap__body__title">资源类型</div>
      <van-collapse class="res-centre-wrap__body__collapse" @change="handleChange" v-show="!tabIndex"
                    v-model="activeNames">
        <van-collapse-item title="微课" name="1">
          <div>
            <list-item class="mgt10" style="background: #fff;" @del="modifyTeachCourseRes(item,index)"
                       v-for="(item,index) in lessonList" :key="index"
                       :itemTitle="item.resCourseWareInfo.coursewareName"
                       @clickTo="goVideoPage(item)">
              <div slot="cover" class="cover" :style="{'background':item.resCourseWareInfo.imageUrl?'none':'#67E0A3'}">
                <img
                  v-if="item.resCourseWareInfo.imageUrl" :src="item.resCourseWareInfo.imageUrl" alt=""><i v-else
                                                                                                          class="iconGFY icon-video"></i>
              </div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.resCourseWareInfo.shareType === 'S01','icon-school':item.resCourseWareInfo.shareType === 'S02','icon-share':item.resCourseWareInfo.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.resCourseWareInfo.qualityType === 'Q01','icon-boutique':item.resCourseWareInfo.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.userName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>收藏</span>
                </div>
                <div @click="">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item)">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div>初一数学《雅鲁藏布大峡谷》课文朗读</div>
                  <div>初一数学《雅鲁藏布大峡谷》课文朗读</div>
                  <div>初一数学《雅鲁藏布大峡谷》课文朗读</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
        <van-collapse-item title="素材" name="2">
        </van-collapse-item>
        <van-collapse-item title="试卷" name="3">
        </van-collapse-item>
      </van-collapse>
      <!--      因为私人资源可以左滑删除 所以只能渲染两个collapse 左滑删除没办法动态更新-->
      <van-collapse v-if="0" class="res-centre-wrap__body__collapse" v-show="tabIndex" v-model="activeNames1">
        <van-collapse-item title="微课" name="1">
        </van-collapse-item>
        <van-collapse-item title="素材" name="2">

        </van-collapse-item>
        <van-collapse-item title="试卷" name="3">

        </van-collapse-item>
      </van-collapse>
      <van-cell is-link to="/questionList">
        <div slot="title" class="fs16">试题</div>
      </van-cell>
    </div>

    <van-popup
      v-model="addPop"
      class="add-pop"
      position="bottom">
      <div class="add-pop-wrap">
        <div class="add-pop-wrap__title"><span>雅鲁藏布大峡谷》课文朗读添加至课程</span>
          <van-icon name="close"></van-icon>
        </div>
        <div class="add-pop-wrap__body">
          <div class="add-pop-wrap__body__radio-group van-hairline--bottom" v-for="(item,index) in addCourseList"
               :key="index">
            <div class="fs15">{{item.name}}</div>
            <van-radio-group class="radio-group" v-model="item.radio">
              <van-radio @click="handleClickRadio(item,ci)" v-for="(c,ci) in item.child" :key="ci" :name="ci"
                         class="mgr10 mgb15"><i slot="icon" slot-scope="props"
                                                :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                <div class="aic">{{c.name}} <span v-if="c.name=='无'" class="red mglt10" style="word-break: break-all;">asdjasjkdkjasdkjakdjas</span>
                </div>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="add-pop-wrap__footer">
          <van-button type="info" class="btn">确定</van-button>
        </div>
      </div>
    </van-popup>

    <subject-filter :label.sync="subjectLabel" :visible.sync="subjectFilterShow"></subject-filter>
    <version-filter :label.sync="versionLabel" :visible.sync="versionFilterShow"></version-filter>
    <area-filter :label.sync="areaLabel" :visible.sync="areaFilterShow" @filter="v => areaCode = v"></area-filter>
    <res-course-filter :label.sync="courseLabel" :visible.sync="resCourseFilterShow"
                       @filter="handleFilter"></res-course-filter>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import subjectFilter from './component/subjectFilter'
  import versionFilter from './component/versionFilter'
  import areaFilter from './component/areaFilter'
  import resCourseFilter from './component/resCourseFilter'
  import {getResCourseWareInfo, delCollectInfo, createCollectInfo} from '@/api/index'

  export default {
    name: "index",
    components: {listItem, subjectFilter, versionFilter, areaFilter, resCourseFilter},
    data() {
      return {
        arr: [{}, {}],
        addCourseList: [
          {name: 'asdx', child: [{name: 'csasac'}, {name: '是大V是'},]},
          {name: '床单asas啊', child: [{name: '官方发布'}, {name: '胜多负少的'}, {name: '无'},]},
          {name: '床单asas啊', child: [{name: '官方发布'}, {name: '胜多负少的'}, {name: '无'},]},
          {name: '床单asas啊', child: [{name: '官方发布'}, {name: '胜多负少的'}, {name: '无'},]},
          {name: '床单asas啊', child: [{name: '官方发布'}, {name: '胜多负少的'}, {name: '无'},]},
        ],
        addPop: false,
        tabIndex: 0,
        activeNames: [],
        activeNames1: [],
        subjectFilterShow: false,
        versionFilterShow: false,
        areaFilterShow: false,
        resCourseFilterShow: false,
        subjectLabel: '',
        versionLabel: '',
        areaLabel: '',
        courseLabel: '',
        filter: {
          area: '',
          subject: '',
          res: '',
          course: ''
        },
        courseId: '',
        areaCode: '',
        lessonList: []
      }
    },
    created() {
    },
    methods: {
      collect(item) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "resCollectInfo": {
            "objectTypeCd": "C03",
            "objectId": 3090,
            "collectType": "C01",
            "accountNo": 12134,
            "statusCd": "S01",
            "subjectType": "S01"
          }, "sysTypeCd": "S02"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        createCollectInfo(params).then(res => {
          if (res.flag) {

          }
        })
      },
      handleChange(activeArr) {
        if (activeArr.length > this.activeNames.length) {
          //有展开
          let value = '' //展开的index
          activeArr.forEach(v => {
            if (this.activeNames.indexOf(v) === -1) {
              value = v
            }
          })
          if (value == '1') {
            // 微课
            this.getResCourseWareInfo('C01')
          }
        }
      },
      getResCourseWareInfo(queryType) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          queryType, //C01 微课 C02 素材
          "sysCourseIdList": [this.courseId],
          "areaCode": this.areaCode,
          "orderByType": "T05",
          "pageSize": "9999",
          "currentPage": 1,
          "filterParam": {"shareType": "", "courseWareType": ""}
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getResCourseWareInfo(params).then(res => {
          if (res.flag) {
            this.lessonList = res.resCourseWareOrderInfoList || []
          }
        })
      },
      handleClickRadio(item, index) {
        this.addCourseList.forEach(v => {
          // v.radio = ''
          this.$set(v, 'radio', '')
        })
        this.$set(item, 'radio', index)
        // item.radio = index
      },
      handleFilter(id) {
        this.courseId = id
      },
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .res-centre-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .add-pop {
      /*max-height: 93%;*/
      height: 93%;
      overflow-y: hidden;
    }

    .add-pop-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;

      .radio-normal {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
      }

      &__title {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 0 10px;
        justify-content: space-between;

        span {
          flex: 1;
          text-align: center;
        }

        i {
          flex: 0 0 22px;
          font-size: 22px;
          color: #999;
          margin-left: 15px;
        }
      }

      &__body {
        flex: 1;
        overflow-y: auto;

        &__radio-group {
          padding: 10px;

          .radio-group {
            padding-left: 53px;
            margin-top: 15px;

            i {
              vertical-align: middle;
            }
          }
        }
      }

      &__footer {
        flex: 0 0 50px;
        padding: 5px 10px;

        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 18px;
        }
      }
    }

    &__tab {
      display: flex;
      background: #fff;
      flex: 0 0 44px;

      > div {
        font-weight: bold;
        flex: 1;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        color: #333;

        &.active {
          color: @blue;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__title {
        line-height: 44px;
        padding: 0 15px;
        font-size: 16px;
        color: #999;
      }

      &__collapse {
        @{deep} .van-cell__title {
          font-size: 16px;

        }

        @{deep} .van-collapse-item__content {
          background: none;
          padding: 0;
        }

        .list-item:last-child {
          margin-bottom: 10px;
        }
      }

      .remark {
        display: flex;
        font-size: 12px;
        color: #666;
        padding-bottom: 10px;

        .icon-lamp {
          margin-right: 5px;
        }
      }

      .cover {
        background: #FCA361;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;

        img {
          border-radius: 5px;
          width: 100%;
          height: 100%;
        }
      }

      .desc-top {
        display: flex;
        margin-bottom: 10px;


        .iconGFY {
          margin-right: 5px;
        }
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
