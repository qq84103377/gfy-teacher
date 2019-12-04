<template>
  <section class="reinforce-wrap">
    <filter-wrap>
      <study-situation @showPop="showPop" slot="reinforce" :is-reinforce="true"></study-situation>
    </filter-wrap>

    <van-popup
      closeable
      v-model="show"
      round
      close-icon="close"
      position="bottom"
      :style="{ height: '93%' }">
      <div class="reinforce-pop-wrap">
        <div class="reinforce-pop-wrap__header van-hairline--bottom">已选知识点</div>
        <div class="reinforce-pop-wrap__body">
          <div class="knw-table">
            <div class="row header">
              <div class="row-item">已选知识点</div>
              <div class="row-item">掌握程度</div>
              <div class="row-item-child">
                <div class="title-width">智能推荐</div>
                <div class="row-item__group group-title">
                  <div>难度</div>
                  <div>题型</div>
                  <div>数量</div>
                  <div>现有试题</div>
                </div>
              </div>
              <div class="row-item">是否移除知识点</div>
            </div>
            <div class="row" v-for="(item,index) in knwArr" :key="index">
              <div class="row-item">{{item.name}}</div>
              <div class="row-item">
                <div v-html="calculateMastery(item.mastery * 1)"></div>
              </div>
              <div class="row-item-child">
                <div v-for="(exam,ei) in item.examTypeArr" :key="ei" class="row-item__group">
                  <div @click="diffPop=true;diff=exam.diff;knwIndex=index;diffIndex=ei">{{exam.diff}}
                    <van-icon name="arrow-down"/>
                  </div>
                  <div>{{exam.name}}</div>
                  <div>
                    <input type="tel" @input="handleInput($event,exam)" v-model="exam.num">
                  </div>
                  <div>20</div>
                </div>
              </div>
              <div class="row-item">
                <van-icon @click="knwArr.splice(index,1)" name="cross"/>
              </div>
            </div>
          </div>
        </div>
        <div class="reinforce-pop-wrap__footer">
          <van-button type="info" class="btn">发布任务</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup round v-model="diffPop">
      <div class="diff-pop-wrap">
        <div class="diff-pop-wrap__item" :class="{blue:diff==='简单'}" @click="selectDiff('简单')">简单</div>
        <div class="diff-pop-wrap__item van-hairline--bottom van-hairline--top" :class="{blue:diff==='中等'}" @click="selectDiff('中等')">中等</div>
        <div class="diff-pop-wrap__item" :class="{blue:diff==='困难'}" @click="selectDiff('困难')">困难</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import filterWrap from '../teachStat/index'
  import studySituation from '../teachStat/studySituation'

  export default {
    name: "index",
    data() {
      return {
        show: false,
        knwArr: [],
        subjectInitData: {
          'S01': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '现代文阅读',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '文言文阅读',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '古诗文默写',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '语言表达',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '名著导读',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '基础题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '名编名句默写',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '现代文阅读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '文言文阅读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '古诗文默写',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '语言表达',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '名著导读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '基础题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '名编名句默写',
                  num: 0,
                  diff: '中等'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '现代文阅读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '文言文阅读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '古诗文默写',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '语言表达',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '名著导读',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '基础题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '名编名句默写',
                  num: 0,
                  diff: '困难'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '现代文阅读',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '文言文阅读',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '古诗文默写',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '语言表达',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '名著导读',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '基础题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '名编名句默写',
                  num: 0,
                  diff: '困难'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '中等'
                },
              ]
            },
          ],
          'S02': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 10,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '解答题',
                  num: 0,
                  diff: '简单'
                }
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '解答题',
                  num: 0,
                  diff: '中等'
                }
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '解答题',
                  num: 1,
                  diff: '中等'
                }
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '解答题',
                  num: 2,
                  diff: '困难'
                }
              ]
            },
          ],
          'S03': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '完形填空',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '阅读理解',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '配对阅读',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '短文填空',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '读写综合',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '听力理解',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '完形填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '阅读理解',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '配对阅读',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '短文填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '读写综合',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '听力理解',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '完形填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '阅读理解',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '配对阅读',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '短文填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '读写综合',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '听力理解',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '困难'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '完形填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '阅读理解',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '配对阅读',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '短文填空',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '读写综合',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '听力理解',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '作文',
                  num: 0,
                  diff: '困难'
                },
              ]
            },
          ],
          'S04': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '作图题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '综合能力题',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '实验题',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '作图题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '综合能力题',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '实验题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '作图题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '综合能力题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '实验题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '作图题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '综合能力题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '实验题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
          ],
          'S05': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '推断题',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '实验探究题',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '推断题',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '实验探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '推断题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '实验探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '计算题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '推断题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '实验探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
          ],
          'S06': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '辩析题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '分析说明题',
                  num: 0,
                  diff: '简单'
                },
                {
                  name: '综合探究题',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '辩析题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '分析说明题',
                  num: 1,
                  diff: '中等'
                },
                {
                  name: '综合探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '辩析题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '分析说明题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '综合探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '简单题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '辩析题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '分析说明题',
                  num: 1,
                  diff: '困难'
                },
                {
                  name: '综合探究题',
                  num: 1,
                  diff: '中等'
                },
              ]
            },
          ],
          'S07': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '材料分析题',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '材料分析题',
                  num: 2,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '材料分析题',
                  num: 2,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '材料分析题',
                  num: 2,
                  diff: '困难'
                },
              ]
            },
          ],
          'S08': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '多选题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '非选择题',
                  num: 3,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '多选题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '非选择题',
                  num: 5,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '多选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '非选择题',
                  num: 5,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '单选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '多选题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '非选择题',
                  num: 5,
                  diff: '中等'
                },
              ]
            },
          ],
          'S09': [
            {
              min: 0,
              max: 60,
              examType: [
                {
                  name: '选择题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '简单'
                },
                {
                  name: '综合体',
                  num: 0,
                  diff: '简单'
                },
              ]
            },
            {
              min: 60,
              max: 80,
              examType: [
                {
                  name: '选择题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '中等'
                },
                {
                  name: '综合体',
                  num: 2,
                  diff: '中等'
                },
              ]
            },
            {
              min: 80,
              max: 90,
              examType: [
                {
                  name: '选择题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '综合体',
                  num: 2,
                  diff: '中等'
                },
              ]
            },
            {
              min: 90,
              max: 101,
              examType: [
                {
                  name: '选择题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '填空题',
                  num: 5,
                  diff: '困难'
                },
                {
                  name: '综合体',
                  num: 3,
                  diff: '中等'
                },
              ]
            },
          ],
        },
        diffPop: false,
        diff: '',
        knwIndex: 0,
        diffIndex: 0,
      }
    },
    components: {filterWrap, studySituation},
    methods: {
      selectDiff(diff) {
        this.knwArr[this.knwIndex].examTypeArr[this.diffIndex].diff = diff
        this.diffPop = false
      },
      handleInput(e,item) {
        const reg = /^[1-9]\d*$/
        if(!reg.test(e.target.value)) {
          e.target.value = e.target.value.substr(0,e.target.value.length-1)
          this.$set(item,'num',e.target.value)
        }
      },
      showPop(arr, subjectType) {
        const subjectData = this.subjectInitData[subjectType]
        arr.forEach(v => {
         const masteryItem = subjectData.find(s => v.mastery * 1 >= s.min && v.mastery * 1 < s.max)
          v.examTypeArr = JSON.parse(JSON.stringify(masteryItem.examType))
        })
        this.knwArr = arr
        this.show = true
      },
      calculateMastery(num) {
        if (num >= 90) {
          return `<div>90-100%</div><div>(优秀)</div>`
        } else if (num < 90 && num >= 80) {
          return `<div>80-89%</div><div>(良好)</div>`
        } else if (num < 80 && num >= 60) {
          return `<div>60-79%</div><div>(一般)</div>`
        } else if (num < 60) {
          return `<div>0-59%</div><div>(薄弱)</div>`
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .reinforce-wrap {
    .diff-pop-wrap {
      padding: 0 30px;
      &__item {
        width: 160px;
        font-size: 15px;
        line-height: 50px;
        text-align: center;
      }
    }
    .reinforce-pop-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;

      &__header {
        font-size: 18px;
        font-weight: bold;
        flex: 0 0 50px;
        line-height: 50px;
        text-align: center;
      }

      &__body {
        flex: 1;
        overflow-y: auto;
        padding: 10px;

        .knw-table {
          font-size: 10px;
          width: 100%;
          border-left: 1px solid #ccc;
          border-top: 1px solid #ccc;

          .row {
            display: flex;

            &.header {
              font-weight: bold;
            }

            &-item {
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              flex: 0 0 13%;
              border-right: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
            }

            &-item-child {
              flex: 1;
              display: flex;
              flex-direction: column;

              .title-width {
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
              }

              .row-item__group {
                display: flex;
                flex: 1;

                > div {
                  flex: 1;
                  text-align: center;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-right: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  height: 100%;
                  min-height: 44px;
                  input{
                    width: 100%;
                    height: 100%;
                    text-align: center;
                  }
                }

                &.group-title {
                  > div {
                    height: 34px;
                    min-height: 34px;
                  }
                }
              }
            }
          }
        }
      }

      &__footer {
        flex: 0 0 55px;
        padding: 0 10px;
        display: flex;
        align-items: center;

        .btn {
          width: 100%;
          height: 44px;
          line-height: 44px;
          border-radius: 22px;
          font-size: 18px;
        }
      }
    }
  }
</style>
