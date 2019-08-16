<template>
  <section class="add-task">
    <van-nav-bar
      :title="handleTitle()+'任务'"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="add-task__body">
      <van-cell class="add-task__body__cell">
        <div slot="title" class="add-task__body__cell-ctn mgl5">
          <div><span class="red">*</span>名称:</div>
          <input v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
          <span class="red">{{64 - form.name.length}}</span>
          <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear"/>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title" class="add-task__body__cell-ctn mgl5">
          <div><span class="red">*</span>时长:</div>
          <input v-model="form.duration" type="tel" placeholder="请输入时长">
          <span class="grey9">分钟</span>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell" v-if="$route.query.type != 'exam'">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5">
            <div><span class="red">*</span>{{handleLabel()}}:</div>
            <span class="pdlt10">说和做闻一多</span>
          </div>
          <van-checkbox
            class="allow-fast"
            v-model="form.allowFast"
          >
            <i
              slot="icon"
              slot-scope="props"
              :class="['iconGFY','icon-check',{'normal':!props.checked}]"
            ></i>
            允许快进
          </van-checkbox>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="add-task__body__cell-ctn" :class="{ccc:form.comment}">
            <div>试卷:</div>
            <div class="pdlt10" style="flex:1">{{form.exam || '未选择试卷'}}</div>
            <van-icon v-if="form.exam&&$route.query.type != 'exam'" @click="form.exam = ''" class="close" :class="{ccc:form.comment}" name="clear"/>
            <van-icon v-if="$route.query.type != 'exam'" @click="filterShow=true" class="add" :class="{ccc:form.comment}" name="add"/>
          </div>
          <van-checkbox
            class="allow-fast"
            v-model="form.allowEdit"
            v-if="form.exam"
          >
            <i
              slot="icon"
              slot-scope="props"
              :class="['iconGFY','icon-check',{'normal':!props.checked}]"
            ></i>
            允许学生交卷后重新修改答案
          </van-checkbox>
        </div>

      </van-cell>
      <van-cell class="add-task__body__cell" v-if="$route.query.type != 'exam'">
        <div slot="title">
          <div class="add-task__body__cell-ctn" :class="{ccc:form.exam}">
            <div>心得:</div>
            <van-checkbox
              :disabled="form.exam?true:false"
              class="comment-check"
              v-model="form.comment"
            >
              <i
                slot="icon"
                slot-scope="props"
                :class="['iconGFY','icon-check',{'normal':!props.checked},{'disabled':form.exam}]"
              ></i>
              学习心得
            </van-checkbox>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5">
            <span class="mgr10"><span class="red">*</span>对象:</span>
            <van-radio-group style="display: flex;" v-model="form.object">
              <van-radio name="1" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                班
              </van-radio>
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                组
              </van-radio>
            </van-radio-group>
          </div>
          <div class="mgt15">
            <div class="select-wrap" v-for="(item,index) in teamList" :key="index">
              <div>
                <van-checkbox
                  class="comment-check"
                  style="margin-left: 0;"
                  v-model="item.check"
                  @click="handleCheckParent(item)"
                >
                  <i
                    slot="icon"
                    slot-scope="props"
                    :class="['iconGFY','icon-check',{'normal':!props.checked}]"
                  ></i>
                  {{item.name}}
                </van-checkbox>
                <div class="select-wrap-desc">
                  <div v-if="form.object == 1">发布范围: 全部学生</div>

                  <!--                  <van-checkbox-group v-else class="gfy-checkbox-group" @change="handleCheckChild($event,item)"-->
                  <!--                                      v-model="item.groupSelect">-->
                  <div v-else class="gfy-checkbox-group">
                    <van-checkbox
                      class="gfy-checkbox-group-item"
                      v-for="(g, gi) in item.group"
                      :key="gi"
                      :name="gi"
                      v-model="g.check"
                      @click="handleCheckChild(g,item)"
                    >
                      <i
                        slot="icon"
                        slot-scope="props"
                        :class="['iconGFY','icon-check',{'normal':!props.checked}]"
                      ></i>
                      {{g.name}}
                    </van-checkbox>
                    <!--                  </van-checkbox-group>-->
                  </div>
                </div>
              </div>
              <van-icon @click="$router.push(`/teamSelect?type=${form.object == 1?'class':'team'}`)" class="fs16 grey9"
                        name="arrow"></van-icon>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5">
            <span class="mgr10"><span class="red">*</span>时间设置:</span>
            <van-radio-group style="display: flex;" v-model="form.time">
              <van-radio name="1" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                统一设置
              </van-radio>
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                分班设置
              </van-radio>
            </van-radio-group>
          </div>
          <div class="time-wrap">
            <div @click="showTime=true" class="time-view">{{form.time1}}</div>
            <span class="divider">~</span>
            <div class="time-view">{{form.time2}}</div>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="jcsb">
            <div>描述:</div>
            <span class="red">{{200 - form.desc.length}}</span>
          </div>
          <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内"/>
        </div>
      </van-cell>
    </div>
    <div class="add-task__footer">
      <van-button type="info" class="submit" @click="$router.push(`/taskDetail`)">发布</van-button>
    </div>


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

    <exam-filter :visible.sync="filterShow"></exam-filter>

  </section>
</template>

<script>
  import {formatTime} from '@/utils/filter'
  import examFilter from '../../components/examFilter'

  export default {
    name: "addTask",
    components: {examFilter},
    data() {
      return {
        filterShow: false,
        currentDate: new Date(),
        form: {
          name: '',
          duration: '',
          allowFast: false,
          allowEdit: false,
          comment: false,
          exam: 'sdasdsa',
          object: '1',
          time: '1',
          time1: formatTime(new Date()),
          time2: formatTime(new Date()),
          desc: '',
          class: [
            {
              groupSelect: [],
              name: '龙江智慧一班',
              group: [{name: '哈哈组笑组笑组笑组笑组笑口组', stu: [{name: '李华啊'}, {name: '李华啊'},]}, {
                name: '哈哈组笑口组',
                stu: [{name: '李华啊'}, {name: '李华啊'},]
              }, {name: '哈哈组笑口组', stu: [{name: '李华啊'}, {name: '李华啊'},]}, {
                name: '哈哈组笑口组',
                stu: [{name: '李华啊'}, {name: '李华啊'}, {name: '李华啊'}, {name: '李华啊'},]
              },]
            },
            {
              groupSelect: [],
              name: '龙江智慧一班',
              group: [{name: '哈哈组笑口组', stu: [{name: '李华啊'}, {name: '李华啊'},]}, {
                name: '哈哈组笑口组',
                stu: [{name: '李华啊'}, {name: '李华啊'},]
              }, {name: '哈哈组笑口组', stu: [{name: '李华啊'}, {name: '李华啊'},]}, {
                name: '哈哈组笑口组',
                stu: [{name: '李华啊'}, {name: '李华啊'},]
              },]
            }
          ]
        },
        showTime: false,
      }
    },
    methods: {
      handleLabel() {
        if (this.$route.query.type === 'lesson') {
          return '微课'
        } else if (this.$route.query.type === 'material') {
          return '素材'
        }
      },
      handleTitle() {
        if (this.$route.query.type === 'lesson') {
          return '微课'
        } else if (this.$route.query.type === 'material') {
          return '学资源'
        } else if (this.$route.query.type === 'exam') {
          return '试卷'
        }
      },
      handleCheckChild(group, classItem) {

        group.stu.forEach(v => {
          this.$set(v, 'active', !group.check)
        })
        if (group.check) {
          // 取消勾选

          let count = classItem.group.reduce((t, v) => {
            if (v.check) {
              t++
            }
            return t
          }, 0)
          if (count == 1) {
            this.$set(classItem, 'check', false)
          }
        } else {
          // 点击勾选

          this.$set(classItem, 'check', true)
        }
      },
      handleCheckParent(item) {
        // if (item.check) {
        // 取消勾选
        // item.groupSelect = []
        item.group.forEach(v => {
          this.$set(v, 'check', !item.check)
          v.stu.forEach(_v => {
            this.$set(_v, 'active', !item.check)
          })
        })
        // } else {
        //确认勾选
        // let arr = item.group.reduce((t, v, i) => {
        //   t.push(i)
        //   return t
        // }, [])
        // item.groupSelect = arr

        // }
      },
      handleSelectTime(v) {
        this.form.time1 = formatTime(v)
        this.showTime = false
      }
    },
    computed: {
      teamList() {
        return this.$store.getters.getTeamList
      }
    },
    created() {
      this.$store.commit('setTeamList', this.form.class)
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .add-task {
    display: flex;
    flex-direction: column;

    .mgl5 {
      margin-left: -7px;
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__cell {

        .allow-fast {
          padding-left: 43px;
          display: flex;
          align-items: center;

          .icon-check {
            vertical-align: initial;
          }
        }

        .select-wrap {
          background: #F5F6FA;
          border-radius: 5px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;

          .comment-check {
            .icon-check {
              vertical-align: initial;
            }
          }


          &-desc {
            color: #666;
            font-size: 12px;
            padding-left: 25px;

            .gfy-checkbox-group {
              display: flex;
              flex-wrap: wrap;

              .normal {
                background: none;
                border: 1px solid #999;
                border-radius: 1.5px;
              }

              &-item {
                margin-right: 15px;
              }
            }

          }
        }

        .time-wrap {
          background: #f5f6fa;
          padding: 10px 6px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;

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

        .comment-check {
          margin-left: 10px;

          .icon-check {
            vertical-align: initial;
          }
        }

        .normal {
          background: none;
          border: 1px solid #999;
          border-radius: 1.5px;
        }

        .disabled {
          background: none;
          border: 1px solid #ccc;
        }

        &-ctn {
          display: flex;
          align-items: center;

          input {
            flex: 1;
            padding: 0 10px;
          }

          .radio-normal {
            border: 1px solid #999;
            border-radius: 50%;
            background: none;
          }
        }

        .img-group {
          display: flex;
          flex-wrap: wrap;
          margin-top: 18px;

          .img-wrap {
            position: relative;
            flex: 0 0 107px;
            height: 70px;
            margin-right: 10px;
            margin-bottom: 10px;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              position: absolute;
              right: -6px;
              top: -6px;
              width: 15px;
              height: 15px;
              font-size: 15px;
              color: #000;

            }
          }
        }

        .close, .add {
          color: @blue;
          margin-left: 10px;
        }

        .add {
          font-size: 22px;
        }

        textarea {
          background: #F5F6FA;
          border-radius: 5px;
          height: 105px;
          width: 100%;
          margin-top: 15px;
          padding: 10px;
        }
      }


    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;

      .submit {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }

    @{deep} .van-popup--bottom {
      overflow-y: hidden;
    }
  }
</style>
