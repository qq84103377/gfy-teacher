<template>
  <section class="exam-bar">
    <div class="exam-choice" @click="selectPop=!selectPop"><i class="iconGFY icon-file"></i><span
      class="badge">99</span></div>
    <div style="flex: 1">已选入<span class="fs10 red">150</span>道试题</div>
    <div class="select-btn">选择其他</div>
    <div class="add-btn" @click="handleSubmit">{{type=='task'?'发任务':'生成试卷'}}</div>
    <van-overlay
      class-name="exam-bar-overlay"
      :show="selectPop"
      @click="selectPop = false"
    />
    <div class="exam-bar-pop" v-if="selectPop">
      <van-cell>
        <div slot="title" class="jcsb">
          <div>已选题目</div>
          <div>清空练习</div>
        </div>
      </van-cell>
      <van-cell v-for="a in 9" :key="a">
        <div slot="title" class="jcsb">
          <div>选择题</div>
          <div>1道</div>
        </div>
      </van-cell>
    </div>


    <van-popup
      v-model="addExam"
      position="bottom">
      <div class="add-exam-wrap">
        <div class="add-exam-wrap__title">
          <div>生成试卷</div>
          <van-icon name="close"></van-icon>
        </div>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>名称:</div>
            <input style="flex: 1" v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - form.name.length}}</span>
            <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear"/>
          </div>
        </van-cell>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>试卷难度:</div>
            <van-radio-group style="display: flex;" v-model="form.difficult">
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                易
              </van-radio>
              <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                中
              </van-radio>
              <van-radio name="4" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                难
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title" class="aic">
            <div class="fs15 mgr10"><span class="red">*</span>共享级别:</div>
            <van-radio-group style="display: flex;" v-model="form.share">
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅自己
              </van-radio>
              <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                校内
              </van-radio>
              <van-radio name="4" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                公开
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell class="add-exam-wrap__cell">
          <div slot="title">
            <div class="aic">
              <div class="fs15" style="flex: 1"><span class="red">*</span>添加到课程: {{selectCourse}}</div>
              <van-icon @click="showFilter" name="add" class="add"></van-icon>
            </div>
            <div class="red fs12 mgt10">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」</div>
          </div>
        </van-cell>
        <div class="add-exam-wrap__footer">
          <van-button type="info" class="btn" @click="$router.push(`/examDetail`)">提交</van-button>
        </div>
      </div>
    </van-popup>

    <filter-panel :visible.sync="filterShow" title="添加" :list="tempList" @filter="handleFilter"></filter-panel>
  </section>
</template>

<script>
  import filterPanel from './filterPanel'

  export default {
    props: ['type'],
    name: "examBar",
    components: {filterPanel},
    data() {
      return {
        selectPop: false,
        addExam: false,
        filterShow: false,
        form: {
          name: '',
          difficult: '2',
          share: '3',
        },
        list: [
          {name: '初一数学', child: [{name: '奥术大师多'}, {name: '是大V是大V'}, {name: '让各位'}]},
          {name: '阿斯顿撒多', child: [{name: '上厕所'}, {name: '额外若翁'}, {name: '黄金金库'}]},
          {name: '其他', child: [{name: '无'},]},
        ],
        tempList: [],
        selectCourse: ''
      }
    },
    methods: {
      handleFilter(item) {
        this.selectCourse = item.name
        this.list.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v,'check',_v.name === item.name)
          })
        })
      },
      showFilter() {
        this.filterShow = true
        this.$set(this.list[0],'active',true)
        this.tempList = JSON.parse(JSON.stringify(this.list))
      },
      handleSubmit() {
        if (this.type === 'task') {
          this.$router.push(`/addTask?type=exam`)
        } else {
          this.addExam = true
          //examDetail
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .exam-bar {
    background: #fff;
    flex: 0 0 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    position: relative;

    .add-exam-wrap {
      &__title {
        position: relative;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;

        i {
          position: absolute;
          font-size: 22px;
          color: #999;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &__cell {
        .clear {
          margin-left: 10px;
          font-size: 15px;
          color: @blue;
        }

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }

        .iconGFY {
          vertical-align: middle !important;
        }

        .add {
          font-size: 22px;
          color: @blue;
          margin-left: 10px;
        }
      }

      &__footer {
        height: 50px;
        padding: 5px 10px;

        .btn {
          font-size: 18px;
          border-radius: 22px;
          width: 100%;
        }
      }
    }

    .exam-bar-overlay {
      top: -50px;
    }

    &-pop {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 50px;
      background: #fff;
      z-index: 2;
      border-radius: 10px 10px 0px 0px;
      max-height: 440px;
      overflow-y: auto;
    }

    .select-btn, .add-btn {
      flex: 0 0 85px;
      color: #fff;
      background: @blue;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }

    .select-btn {
      background: #4DFEEC;
    }

    .exam-choice {
      position: relative;
      margin: 0 10px;

      .badge {
        position: absolute;
        border-radius: 50%;
        background: red;
        color: #fff;
        font-size: 10px;
        width: 20px;
        height: 20px;
        top: -6px;
        right: -10px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
</style>
