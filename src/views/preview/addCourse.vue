<template>
  <section class="add-course-wrap">
    <div class="add-course-wrap__body">
      <div class="name">
        <van-field
          label-class="gfy-label"
          label-width="12vw"
          required
          clearable
          label="名称:"
          @click-right-icon="filterShow=true">
          <div slot="input" class="input-wrap">
            <input maxlength="64" v-model="form.name" style="width: 100%" placeholder="请输入名称,字数在64字内"/>
            <span class="num-tip">{{64 - form.name.length}}</span>
            <van-icon @click="form.name = ''" class="close" name="clear"/>
          </div>
          <div v-if="!isEdit" slot="right-icon" class="fs14 blue">
            筛选
          </div>
        </van-field>
        <div class="search-wrap" v-show="form.name">
          <van-cell v-for="a in 10" :key="a">
            <div slot="title" class="aic jcsb search-wrap__item">
              <div class="search-wrap__item-title">
                jksdakjsdjksdakjsdjksdakjsdjksdakjsdjksdakjsdjksdakjsdjksdakjsdjksdakjsd
              </div>
              <div class="jcsb aic fs10" style="flex: 0 0 25%">
                <span class="tag">人教版</span>
                <span class="tag">初一</span>
              </div>
            </div>
          </van-cell>
        </div>
<!--        <van-overlay-->
<!--          :show="showMask"-->
<!--          @click="showMask = false"-->
<!--        />-->
      </div>
      <van-cell v-if="!isEdit" class="class-group">
        <div slot="title">
          <div class="gfy-label class-label jcsb aic">
            <div><span style="color: red">*</span>课程:</div>
            <div class="blue">其他共享课程</div>
          </div>
          <van-radio-group class="gfy-radio-group" v-model="form.course">
            <van-radio name="1" class="mgr10 mgb10"><i slot="icon" slot-scope="props"
                                                       :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              会议鲁迅先生 <span class="grey9 fs10">(创建人:管理员5,使用次数:7)</span></van-radio>
            <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              会议鲁迅先生 <span class="grey9 fs10">(创建人:管理员5,使用次数:7)</span></van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell class="class-group">
        <div slot="title">
          <div class="gfy-label class-label"><span style="color: red">*</span>选择班级:</div>
          <van-checkbox-group class="gfy-checkbox-group" v-model="result">
            <van-checkbox
              class="gfy-checkbox-group-item"
              v-for="(item, index) in list"
              :key="item"
              :name="item"
            >
              <i
                slot="icon"
                slot-scope="props"
                :class="['iconGFY','icon-check',{'normal':!props.checked}]"
              ></i>
              龙江智慧一般 {{ item }}
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label">
          <div style="display: flex;" class="mgb20">
            <span style="color: red">*</span><span class="mgr15">时间设置:</span>
            <van-radio-group style="display: flex;" v-model="form.radio">
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                统一设置
              </van-radio>
              <van-radio name="1"><i slot="icon" slot-scope="props"
                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i> 分班设置
              </van-radio>
            </van-radio-group>
          </div>
          <div class="time-group">
            <span class=" fs14 mgr10 class-name" :style="{width:className.length>6?'100%':'auto'}">{{className}}</span>
            <div style="display: flex;align-items: center;flex: 1">
              <div @click="showTime=true" class="time-view">{{form.time1}}</div>
              <span class="divider">~</span>
              <div class="time-view">{{form.time2}}</div>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label aic">
          <span class="mgr10">共享:</span>
          <van-radio-group style="display: flex;" v-model="form.share">
            <van-radio :disabled="!isEdit" name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked&&isEdit},{'icon-radio-disable':!isEdit}]"></i>
              个人
            </van-radio>
            <van-radio v-if="isEdit" name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                               :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              校内
            </van-radio>
            <van-radio v-if="isEdit" name="4"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              共享
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title" class="gfy-label">
          <div class="jcsb aic">
            <span>描述:</span>
            <span style="color: red">{{200 - form.desc.length}}</span>
          </div>
          <textarea placeholder="请输入描述，字数在200字内" maxlength="200" v-model="form.desc" class="gfy-textarea"
                    rows="3"></textarea>
        </div>
      </van-cell>
      <van-popup
        v-model="showTime"
        position="bottom"
        :style="{ height: '35%' }">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @confirm="handleSelectTime"
          @cancel="showTime=false"
        />
      </van-popup>
    </div>

    <div class="add-course-wrap__footer" v-if="isEdit">
      <van-button class="edit-btn" type="info">取消</van-button>
      <van-button class="edit-btn" type="info">提交</van-button>
    </div>
    <div class="add-course-wrap__footer" v-else>
      <van-button class="submit-btn" type="info">提交</van-button>
    </div>
    <div class="mask" @click="form.name = ''" v-show="form.name"></div>

    <course-filter :visible.sync="filterShow"></course-filter>
  </section>
</template>

<script>
  import {generateTimeReqestNumber} from '@/utils/filter'
  import courseFilter from '../../components/courseFilter'

  export default {
    name: "addCourse",
    props: ['isEdit'],
    data() {
      return {
        filterShow: false,
        showTime: false,
        form: {
          share: '',
          desc: '',
          name: '',
          course: '',
          radio: '2',
          time1: generateTimeReqestNumber(new Date()),
          time2: generateTimeReqestNumber(new Date()),
        },
        list: ['a', 'b', 'c'],
        result: [],
        currentDate: new Date(),
        className: '电话的的的123',
      }
    },
    computed: {
      showMask: {
        get() {
          return this.form.name ? true : false
        },
        set(v) {
          if (!v) {
            this.form.name = ''
          }
        }
      }
    },
    components: {courseFilter},
    methods: {
      handleSelectTime(v) {
        this.form.time1 = generateTimeReqestNumber(v)
        this.showTime = false
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .add-course-wrap {
    display: flex;
    flex-direction: column;

    &__body {
      flex: 1;
      overflow-y: auto;
    }

    @{deep} .gfy-label {
      font-size: 15px;
      color: #000;
    }

    .name {
      padding-left: 8px;
      position: relative;

      .search-wrap {
        background: #fff;
        position: absolute;
        width: 100%;
        top: 44px;
        left: 0;
        z-index: 2;
        box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
        border-radius: 0px 0px 10px 10px;
        max-height: 176px;
        overflow-y: auto;

        @{deep} .van-cell__title {
          width: 100%;
        }

        &__item {
          &-title {
            flex: 0 0 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .tag {
            color: @blue;
            font-size: 10px;
            background: #E0FFFC;
            line-height: 20px;
            padding: 0 5px;
            border-radius: 8px;
          }
        }


      }


    }

    .input-wrap {
      position: relative;
      padding-right: 40px;

      .num-tip {
        position: absolute;
        color: red;
        font-size: 10px;
        right: 22px;
        top: 50%;
        transform: translateY(-50%);
      }

      .close {
        margin-left: 10px;
        position: absolute;
        font-size: 15px;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: @blue;
      }
    }

    .class-group {
      .class-label {
        margin-bottom: 14px;
      }

      .gfy-radio-group {
        padding-left: 8px;
      }

      .gfy-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        padding-left: 8px;

        .normal {
          background: none;
          border: 1px solid #999;
          border-radius: 1.5px;
        }

        &-item {
          margin-right: 13px;
          margin-bottom: 18px;
        }
      }
    }

    .time-group {
      align-items: center;
      background: #f5f6fa;
      border-radius: 10px;
      display: flex;
      padding: 10px;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 5px;
      .class-name {

      }
      .divider {
        margin: 0 5px;
      }

      .time-view {
        flex: 1;
        /*width: 120px;*/
        height: 18px;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
      }
    }

    .radio-normal {
      border: 1px solid #999;
      border-radius: 50%;
      background: none;
    }

    .gfy-textarea {
      width: 100%;
      margin-top: 15px;
      background: #F5F6FA;
      padding: 15px 12px;
      border-radius: 5px;
      color: #1e1e1e;
      font-size: 14px;
    }

    @{deep} .van-radio__label {
      margin-left: 5px;
    }

    @{deep} .van-popup--bottom {
      overflow-y: hidden;
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .submit-btn {
        flex: 1;
        border-radius: 21px;
        font-size: 16px;
      }

      .edit-btn {
        flex: 0 0 125px;
        border-radius: 21px;
        font-size: 16px;
        margin-right: 20px;
        line-height: 30px;
        height: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    .mask {
      width: 100%;
      height: calc(100% - 44px);
      position: absolute;
      background: rgba(0, 0, 0, .3);
      z-index: 1;
      left: 0;
      top: 44px;
    }
  }
</style>
