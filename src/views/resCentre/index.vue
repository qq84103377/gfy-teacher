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
        <div slot="title" @click="changeList(area,'地区');filterShow=true" class="aic jcsb">
          <div class="fs16">地区</div>
          <div class="fs15"><span class="blue mgr10">{{filter.area}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell">
        <div slot="title" @click="changeList(subject,'科目');filterShow=true" class="aic jcsb">
          <div class="fs16">学科</div>
          <div class="fs15"><span class="blue mgr10">{{filter.subject}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-if="!tabIndex">
        <div slot="title" @click="changeList(res,'教材');filterShow=true" class="aic jcsb">
          <div class="fs16">教材</div>
          <div class="fs15"><span class="blue mgr10">{{filter.res}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-if="!tabIndex">
        <div slot="title" @click="changeList(course,'课程');filterShow=true" class="aic jcsb">
          <div class="fs16">课程</div>
          <div class="fs15"><span class="blue mgr10">{{filter.course}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <div class="res-centre-wrap__body__title">资源类型</div>
      <van-collapse class="res-centre-wrap__body__collapse" v-show="!tabIndex" v-model="activeNames">
        <van-collapse-item title="微课" name="1">
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
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
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
                <div @click="">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
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
        <van-collapse-item title="试卷" name="3">
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
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
      </van-collapse>
      <!--      因为私人资源可以左滑删除 所以只能渲染两个collapse 左滑删除没办法动态更新-->
      <van-collapse class="res-centre-wrap__body__collapse" v-show="tabIndex" v-model="activeNames1">
        <van-collapse-item title="微课" name="1">
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr" :can-slide="true"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
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
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr" :can-slide="true"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
                <div @click="">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
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
        <van-collapse-item title="试卷" name="3">
          <div>
            <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10 list-item" style="background: #fff;"
                       v-for="(item,index) in arr" :can-slide="true"
                       :key=index>
              <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY icon-personal"></i>
                  <i class="iconGFY icon-choice"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>裘千仞</div>
                  <div><i class="iconGFY icon-points"></i>0</div>
                  <div><i class="iconGFY icon-star"></i>10</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'collect',!item.collect)">
                  <van-icon class="fs15 yellow" :name="item.collect?'star':'star-o'"></van-icon>
                  <span>收藏</span>
                </div>
                <div @click="addPop=true">
                  <van-icon class="fs15 orange" name="add-o"></van-icon>
                  <span>添加</span>
                </div>
                <div @click="$router.push(`/addTask?type=spoken`)">
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

    <filter-panel @selectParent="selectParent" :label="label" :visible.sync="filterShow" :title="title" :list="list" @filter="handleFilter"></filter-panel>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import filterPanel from '../../components/filterPanel'
  import {getTextBookVersionInfo, getSubjectType} from '@/api/index'

  export default {
    name: "index",
    components: {listItem, filterPanel},
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
        filterShow: false,
        title: '',
        filter: {
          area: '',
          subject: '',
          res: '',
          course: ''
        },
        area: [
          {name: '广东', child: [{name: '广州市'}, {name: '清远市'}, {name: '韶关市'}]},
          {name: '广西', child: [{name: '玉林市'}, {name: '贵港市'}, {name: '南陵市'}]},
        ],
        res: [
          {name: '粤教沪科版(沪粤版)', child: [{name: '亲年级上册'}, {name: '八年级下册'}, {name: '老头教学'}]},
          {name: '外研版', child: [{name: 'asdasd'}, {name: '八年级fdfgd下册'}, {name: '老头sdfs教学'}]},
        ],
        subject: [
          {name: '小学',value:'Y01',active:true,child:[]},
          {name: '初中',value:'Y02',active:false,child:[]},
          {name: '高中',value:'Y03',active:false,child:[]},
        ],
        course: [
          {name: '一单元', child: [{name: '说和做砂进口的'}, {name: '的境况是假的'}, {name: '健康的时刻纯净水'}]},
          {name: '五座', child: [{name: '四渡赤水都吃'}, {name: 'as'}, {name: '的深V是'}]},
        ],
        list: [
          {name: '小学',value:'Y01',active:true,child:[]},
          {name: '初中',value:'Y02',active:false,child:[]},
          {name: '高中',value:'Y03',active:false,child:[]},
        ],
        label: 'subjectName'
      }
    },
    created() {
      this.getTextBookVersionInfo()
      this.getSubjectType()
    },
    methods: {
      selectParent(index) {
        if(this.title === '科目') {
          this.getSubjectType(index)
        }
      },
      getSubjectType(index = 0) {
        if(this.subject[index].done) return
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          yearSection: this.subject[index].value,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSubjectType(params).then(res => {
          this.$set(this.subject[index],'done',true) // 是否已加载了数据
          if(res.flag) {
            this.subject[index].child = res.resSubjectTypeInfoList
            this.list[index].child = res.resSubjectTypeInfoList
          }
        })
      },
      getTextBookVersionInfo() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "yearSection": "Y02",
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getTextBookVersionInfo(params).then(res => {
          if(res.flag) {
            res.textbookVersionList
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
      changeList(arr, title) {
        if(title === '科目') {
          this.label = 'subjectName'
        }
        this.title = title
        this.$set(arr[0], 'active', true)
        this.list = JSON.parse(JSON.stringify(arr))
      },
      handleFilter(item) {
        if (this.title === '地区') {
          this.filter.area = item.name
          this.checkItem(this.area, item)
        } else if (this.title === '教材') {
          this.filter.res = item.name
          this.checkItem(this.res, item)
        } else if (this.title === '科目') {
          this.filter.subject = item.name
          this.checkItem(this.subject, item)
        } else if (this.title === '课程') {
          this.filter.course = item.name
          this.checkItem(this.course, item)
        }
      },
      checkItem(arr, item) {
        arr.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v, 'check', _v.name === item.name)
          })
        })
      }
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
