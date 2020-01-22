<template>
  <section class="res-centre-wrap">
    <van-nav-bar
      :left-arrow="canBack"
      @click-left="goBack"
      title="资源中心">
    </van-nav-bar>
    <div class="res-centre-wrap__tab">
      <div class="van-hairline--right" @click="toggleTab(0)" :class="{active:!tabIndex}">平台资源</div>
      <div :class="{active:tabIndex}" @click="toggleTab(1)">私人资源</div>
    </div>
    <div class="res-centre-wrap__body">
      <div class="res-centre-wrap__body__title">筛选</div>
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
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
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
        <div slot="title" @click="versionFilterShow=true" class="aic jcsb">
          <div class="fs16">教材</div>
          <div class="fs15"><span class="blue mgr10">{{versionLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
        <div slot="title" @click="resCourseFilterShow=true" class="aic jcsb">
          <div style="flex: 0 0 15%" class="fs16">课程</div>
          <!--          <div style="flex: 0 0 80%;justify-content: flex-end" class="fs15 aic">-->
          <!--          </div>-->
          <div style="flex: 1;width: 50px;text-align: right" class="van-ellipsis"><span class="blue mgr10">{{courseLabel}}</span>
          </div>
          <van-icon class="fs15" name="arrow"/>
        </div>
      </van-cell>

      <div class="sticky-wrap" ref="sticky-wrap" v-if="isIOS">
        <div class="res-centre-wrap__body__title">资源类型</div>
        <div class="res-centre-wrap__body__tab" v-show="tabIndex == 0">
          <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===1}" @click="selectResource(1)">微课
          </div>
          <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===2}" @click="selectResource(2)">素材
          </div>
          <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===3}" @click="selectResource(3)">试卷
          </div>
          <div class="res-centre-wrap__body__tab-item" @click="viewQuestion">试题</div>
        </div>
        <div class="res-centre-wrap__body__tab" v-show="tabIndex == 1">
          <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===1}" @click="selectResource(1)">
            微课
          </div>
          <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===2}" @click="selectResource(2)">
            素材
          </div>
          <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===3}" @click="selectResource(3)">
            试卷
          </div>
          <div class="res-centre-wrap__body__tab-item" @click="viewQuestion">试题</div>
        </div>
      </div>
      <van-sticky v-else>
        <div style="background: #f5f5f5;">
          <div class="res-centre-wrap__body__title">资源类型</div>
          <div class="res-centre-wrap__body__tab" v-show="tabIndex == 0">
            <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===1}" @click="selectResource(1)">
              微课
            </div>
            <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===2}" @click="selectResource(2)">
              素材
            </div>
            <div class="res-centre-wrap__body__tab-item" :class="{active:resourceIndex===3}" @click="selectResource(3)">
              试卷
            </div>
            <div class="res-centre-wrap__body__tab-item" @click="viewQuestion">试题</div>
          </div>
          <div class="res-centre-wrap__body__tab" v-show="tabIndex == 1">
            <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===1}"
                 @click="selectResource(1)">
              微课
            </div>
            <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===2}"
                 @click="selectResource(2)">
              素材
            </div>
            <div class="res-centre-wrap__body__tab-item" :class="{active:priSourceIndex===3}"
                 @click="selectResource(3)">
              试卷
            </div>
            <div class="res-centre-wrap__body__tab-item" @click="viewQuestion">试题</div>
          </div>
        </div>
      </van-sticky>
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && curListLength==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/empty-1.png" alt/>
        </div>
        <van-list v-model="listLoading" :finished="curFinish" :finished-text="curListLength>0?'没有更多了':'当前没有资源！'"
                  @load="onLoad" :offset='80'>
          <!--    平台资源      微课-->
          <div>
            <list-item class="mgt10" style="background: #fff;" v-if="resourceIndex==1&&tabIndex == 0"
                       v-for="(item,index) in lessonList" :key="index"
                       :itemTitle="item.resCourseWareInfo.coursewareName"
                       @clickTo="goVideoPage(item)">
              <div slot="cover" class="cover" :style="{'background':item.resCourseWareInfo.imageUrl?'none':'#67E0A3'}">
                <img
                  v-if="item.resCourseWareInfo.imageUrl" :src="item.resCourseWareInfo.imageUrl" alt=""><i v-else
                                                                                                          :class="['iconGFY', handleMediaIcon(item.resCourseWareInfo.srcUrl)]"></i>
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
                <div @click="collect(item,item.resCourseWareInfo.coursewareId,item.resCourseWareInfo.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.resCourseWareInfo.coursewareName,item.resCourseWareInfo.coursewareId,'R01','lessonList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'lesson')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
          <!--    平台资源      素材-->
          <div>
            <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;" v-if="resourceIndex==2&&tabIndex == 0"
                       v-for="(item,index) in materialList" :key="index"
                       :itemTitle="item.resCourseWareInfo.coursewareName">
              <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item.resCourseWareInfo)"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.resCourseWareInfo.shareType === 'S01','icon-school':item.resCourseWareInfo.shareType === 'S02','icon-share':item.resCourseWareInfo.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.resCourseWareInfo.qualityType === 'Q01','icon-boutique':item.resCourseWareInfo.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.userName}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.resCourseWareInfo.downCount||0}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item,item.resCourseWareInfo.coursewareId,item.resCourseWareInfo.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.resCourseWareInfo.coursewareName,item.resCourseWareInfo.coursewareId,'R01','materialList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="download(item.resCourseWareInfo.srcUrl,item.resCourseWareInfo.coursewareName,item)">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
                </div>
                <div @click="sendTask(item,'material')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
          <!--    平台资源      试卷-->
          <div>
            <list-item @clickTo="viewDetail(item)" class="mgt10" v-if="resourceIndex==3&&tabIndex == 0"
                       style="background: #fff;" v-for="(item,index) in examList" :key="index"
                       :itemTitle="item.testPaperName">
              <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div style="white-space: nowrap"><i class="iconGFY icon-difficult"></i>{{item.testPaperDegree==='D01'?'容易':item.testPaperDegree==='D02'?'中等':'困难'}}
                  </div>
                  <div><i class="iconGFY icon-zhu"></i>{{item.subjectiveItemNum || 0}}</div>
                  <div><i class="iconGFY icon-ke"></i>{{item.objectiveItemNum || 0}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.downCount || 0}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item,item.testPaperId,item.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.testPaperName,item.testPaperId,'R02','examList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'exam')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
          <!--私人资源  微课-->
          <div>
            <list-item ref='listItem1' class="mgt10" style="background: #fff;" v-if="priSourceIndex==1&&tabIndex == 1"
                       v-for="(item,index) in priLessonList" :key="index" :can-slide="true"
                       :itemTitle="item.courseware_name" @del="delRes(item,index)" @clickDel='clickDel(index)'
                       @clickTo="goVideoPage(item)">
              <div slot="cover" class="cover" :style="{'background':item.image_url?'none':'#67E0A3'}">
                <img v-if="item.image_url" :src="item.image_url" alt=""><i v-else :class="['iconGFY', handleMediaIcon(item.src_url)]"></i>
              </div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div v-if="item.belong_account_no !== item.account_no"
                     @click="priListKey='priLessonList';collect(item,item.courseware_id,item.status_cd,index)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                  <span>取消收藏</span>
                </div>
                <div
                  @click="showAddPop(item.courseware_name,item.courseware_id,'R01','priLessonList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'lesson')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
          <!--私人资源 素材-->
          <div>
            <list-item ref='listItem2' @clickTo="goto(item)" class="mgt10" style="background: #fff;"
                       v-if="priSourceIndex==2&&tabIndex == 1" :can-slide="true"
                       v-for="(item,index) in priMaterialList" :key="index" @del="delRes(item,index)"
                       @clickDel='clickDel(index)'
                       :itemTitle="item.courseware_name">
              <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item)"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.down_count || 0}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div v-if="item.belong_account_no !== item.account_no"
                     @click="priListKey='priMaterialList';collect(item,item.courseware_id,item.status_cd,index)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                  <span>取消收藏</span>
                </div>
                <div
                  @click="showAddPop(item.courseware_name,item.courseware_id,'R01','priMaterialList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="download(item.src_url,item.courseware_name,item)">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
                </div>
                <div @click="sendTask(item,'material')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
          <!--私人资源 试卷-->
         <div>
           <list-item ref='listItem3' @clickTo="viewDetail(item)" class="mgt10" v-if="priSourceIndex==3&&tabIndex == 1"
                      :can-slide="item.belong_account_no == $store.getters.getUserInfo.accountNo"
                      @del="delTestPaper(item,index)"
                      @clickDel='clickDel(index)'
                      style="background: #fff;" v-for="(item,index) in priExamList" :key="index"
                      :itemTitle="item.test_paper_name">
             <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
             <div slot="desc">
               <div class="desc-top">
                 <i class="iconGFY"
                    :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                 <i class="iconGFY"
                    :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
               </div>
               <div class="desc-bottom">
                 <div style="white-space: nowrap"><i class="iconGFY icon-difficult"></i>{{item.test_paper_degree==='D01'?'容易':item.test_paper_degree==='D02'?'中等':'困难'}}
                 </div>
                 <div><i class="iconGFY icon-zhu"></i>{{item.subjective_item_num || 0}}</div>
                 <div><i class="iconGFY icon-ke"></i>{{item.objective_item_num || 0}}</div>
                 <div><i class="iconGFY icon-download"></i>{{item.down_count || 0}}</div>
                 <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                 <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
               </div>
             </div>
             <div slot="btn" class="btn-group van-hairline--top">
               <div v-if="item.belong_account_no !== item.account_no"
                    @click="priListKey='priExamList';collect(item,item.test_paper_id,item.status_cd,index)">
                 <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                 <span>取消收藏</span>
               </div>
               <div
                 @click="showAddPop(item.test_paper_name,item.test_paper_id,'R02','priExamList')">
                 <i class="iconGFY icon-circle-plus-yellow"></i>
                 <span>添加</span>
               </div>
               <div @click="sendTask(item,'exam')">
                 <i class="iconGFY icon-plane"></i>
                 <span>发任务</span>
               </div>
             </div>
             <div slot="remark" class="remark" v-if="item.record">
               <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
               <div>
                 <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
               </div>
             </div>
           </list-item>
         </div>
        </van-list>
      </van-pull-refresh>

    </div>


    <subject-filter :label.sync="subjectLabel" :visible.sync="subjectFilterShow"></subject-filter>
    <version-filter :gradeTerm.sync="gradeTerm" :label.sync="versionLabel"
                    :visible.sync="versionFilterShow"></version-filter>
    <area-filter :label.sync="areaLabel" :visible.sync="areaFilterShow" @filter="v => areaCode = v"></area-filter>
    <res-course-filter :label.sync="courseLabel" :visible.sync="resCourseFilterShow"
                       @filter="handleFilter"></res-course-filter>
    <add-course-pop @success="saveRecord" :isSendTask="isSendTask" :resourceType="resourceType" :resourceId="resourceId"
                    :resName="resName"
                    :listKey="listKey" :list="courseList" :gradeTerm="gradeTerm"
                    :visible.sync="addCourseShow"></add-course-pop>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import subjectFilter from './component/subjectFilter'
  import versionFilter from './component/versionFilter'
  import areaFilter from './component/areaFilter'
  import resCourseFilter from './component/resCourseFilter'
  import addCoursePop from './component/addCoursePop'
  import {
    getResCourseWareInfo,
    delCollectInfo,
    createCollectInfo,
    getClassTeachCourseInfo,
    getSysCourseTestPaperList,
    getCollectInfoDetailV2,
    delTestPaper,
    delCourseWare,
    updateCourseWareCount,
  } from '@/api/index'
  import {getGradeName, getSubjectName, toHump, formatTime} from "../../utils/filter";
  import {teachApi, pubApi} from '@/api/parent-GFY'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "index",
    props: ['canBack'],
    components: {listItem, subjectFilter, versionFilter, areaFilter, resCourseFilter, addCoursePop},
    data() {
      return {
        resourceIndex: 1,
        priSourceIndex: 1,
        listLoading: false,
        refLoading: false,
        finished: false,
        tabIndex: 0,
        activeNames: [],
        activeNames1: [],
        subjectFilterShow: false,
        versionFilterShow: false,
        areaFilterShow: false,
        resCourseFilterShow: false,
        addCourseShow: false,
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
        gradeTerm: '', //年级学期
        lessonList: [],
        lessonListPage: 0,
        lessonListTotal: 0,
        lessonListFinish: false,
        lessonListInit: false,
        materialList: [],
        materialListPage: 0,
        materialListTotal: 0,
        materialListFinish: false,
        materialListInit: false,
        examList: [],
        examListPage: 0,
        examListTotal: 0,
        examListFinish: false,
        examListInit: false,
        priLessonList: [],
        priLessonListPage: 0,
        priLessonListTotal: 0,
        priLessonListFinish: false,
        priLessonListInit: false,
        priMaterialList: [],
        priMaterialListPage: 0,
        priMaterialListTotal: 0,
        priMaterialListFinish: false,
        priMaterialListInit: false,
        priExamList: [],
        priExamListPage: 0,
        priExamListTotal: 0,
        priExamListFinish: false,
        priExamListInit: false,
        courseList: [],
        resName: '',
        resourceId: '',
        resourceType: '',
        listKey: '', // 平台资源点击添加时属于哪个列表
        priListKey: '', // 私人资源点击添加时属于哪个列表
        isSendTask: false,
        accessUrl: '',
        firstClickPri: false,
        isIOS: false,
        clickIndex:0
      }
    },
    computed: {
      curListLength() {
        let length = 0
        if (this.tabIndex) {
          switch (this.priSourceIndex) {
            case 1:
              length = this.priLessonList.length
              break
            case 2:
              length = this.priMaterialList.length
              break
            case 3:
              length = this.priExamList.length
              break
          }
        } else {
          switch (this.resourceIndex) {
            case 1:
              length = this.lessonList.length
              break
            case 2:
              length = this.materialList.length
              break
            case 3:
              length = this.examList.length
              break
          }
        }
        return length
      },
      curFinish() {
        return this[`${this.curKey}Finish`]
      },
      curKey() {
        let key = ''
        if (this.tabIndex) {
          switch (this.priSourceIndex) {
            case 1:
              key = 'priLessonList'
              break
            case 2:
              key = 'priMaterialList'
              break
            case 3:
              key = 'priExamList'
              break
          }
        } else {
          switch (this.resourceIndex) {
            case 1:
              key = 'lessonList'
              break
            case 2:
              key = 'materialList'
              break
            case 3:
              key = 'examList'
              break
          }
        }
        return key
      }
    },
    watch: {
      resourceIndex(v) {

      },
      subjectFilterShow(v) {
        if (this.canBack) return
        eventBus.$emit('hideNav', !v)
      },
      versionFilterShow(v) {
        if (this.canBack) return
        eventBus.$emit('hideNav', !v)
      },
      areaFilterShow(v) {
        if (this.canBack) return
        eventBus.$emit('hideNav', !v)
      },
      resCourseFilterShow(v) {
        if (this.canBack) return
        eventBus.$emit('hideNav', !v)
      },
      addCourseShow(v) {
        if (this.canBack) return
        eventBus.$emit('hideNav', !v)
      },
      subjectLabel() {
        //由于切换了筛选条件,所有类型资源数据先初始化
        //私人资源
        this.priLessonListInit = false
        this.priLessonListPage = 0
        this.priLessonListTotal = 0
        this.priMaterialListInit = false
        this.priMaterialListPage = 0
        this.priMaterialListTotal = 0
        this.priExamListInit = false
        this.priExamListPage = 0
        this.priExamListTotal = 0

        this.firstClickPri = false
        this[`${this.curKey}Init`] = true
        if (this.tabIndex) {
          this.onRefresh()
        }
      },
      courseId() {
        this.lessonListInit = false
        this.lessonListPage = 0
        this.lessonListTotal = 0
        this.materialListInit = false
        this.materialListPage = 0
        this.materialListTotal = 0
        this.examListInit = false
        this.examListPage = 0
        this.examListTotal = 0
        this[`${this.curKey}Init`] = true
        if (!this.tabIndex) this.onRefresh()

        this.courseList = []
      },
      areaCode() {
        this.lessonListInit = false
        this.lessonListPage = 0
        this.lessonListTotal = 0
        this.materialListInit = false
        this.materialListPage = 0
        this.materialListTotal = 0
        this.examListInit = false
        this.examListPage = 0
        this.examListTotal = 0
        this[`${this.curKey}Init`] = true
        if (!this.tabIndex) this.onRefresh()
        this.courseList = []
      },
    },
    beforeRouteLeave(to, from, next) {
    if (this.subjectFilterShow) {
      this.subjectFilterShow=false
      next(false)
    } else if (this.versionFilterShow) {
      this.versionFilterShow = false
      next(false)
    } else if (this.areaFilterShow) {
      this.areaFilterShow = false
      next(false)
    } else if (this.resCourseFilterShow) {
      this.resCourseFilterShow = false
      next(false)
    } else if (this.addCourseShow) {
      this.addCourseShow = false
      next(false)
    } else if (this.$refs['listItem1']&&this.$refs['listItem1'][this.clickIndex]&&this.$refs['listItem1'][this.clickIndex].showDialog) {
      this.$refs['listItem1'][this.clickIndex].close()
      next(false)
    }else if (this.$refs['listItem2']&&this.$refs['listItem2'][this.clickIndex]&&this.$refs['listItem2'][this.clickIndex].showDialog) {
      this.$refs['listItem2'][this.clickIndex].close()
      next(false)
    }else if (this.$refs['listItem3']&&this.$refs['listItem3'][this.clickIndex]&&this.$refs['listItem3'][this.clickIndex].showDialog) {
      this.$refs['listItem3'][this.clickIndex].close()
      next(false)
    }else {
      next()
    }
  },
    created() {
      this.checkPlatform()
      this.$store.commit('setErrorBookQuestionCourse', [])
      if (this.$route.path === '/resCentre') {
        this.$store.commit('setTchCourseInfo', {})
      }
    },
    mounted() {
      if (this.isIOS) {
        this.$refs['sticky-wrap'].style.position = this.isSupportSticky()
        this.$refs['sticky-wrap'].style.zIndex = '20'
      }
    },
    methods: {
      clickDel(index){
       this.clickIndex=index
      },
      async delRes(item,index) {
        if(item.belong_account_no !== item.account_no) {
          //这是别人的资源,不能删除
          return this.$toast('非本账号的资源无法删除')
        }
        await this.delCourseWare(item.courseware_id)
        this.collect(item, item.object_id, item.status_cd, index, true)
        },
      async delCourseWare(coursewareId) {
        let obj = {
          "courseWareList":[{coursewareId}]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await delCourseWare(params)
        //   .then(res => {
        //   if(res.flag) {
        //
        //   }
        // })
      },
      handleMediaIcon(srcUrl) {
        try{
          let t = srcUrl.substring(srcUrl.lastIndexOf('.') + 1).toLowerCase()
          if (t == 'mp3') {
            t = 'icon-audio'
          } else {
            t = 'icon-video'
          }
          return t
        }catch{

        }
      },
      checkPlatform() {
        let u = navigator.userAgent;

        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

        this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      },
      isSupportSticky() {
        let prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
        let element = document.createElement('div');
        let name
        for (let i = 0; i < prefixTestList.length; i++) {
          if ('position' in element.style) {
            element.style['position'] = prefixTestList[i] + 'sticky';
            if (element.style['position'] === (prefixTestList[i] + 'sticky')) {
              name = prefixTestList[i] + 'sticky'
              break
            }
          }
        }
        return name
      },
      selectResource(num) {
        if (this.tabIndex) {
          this.priSourceIndex = num
        } else {
          this.resourceIndex = num
        }
        if (!this[`${this.curKey}Init`]) {
          this.onLoad()
        }
        this[`${this.curKey}Init`] = true
      },
      async onLoad() {
        // if (!this.courseId&&!this.tabIndex) return
        this[`${this.curKey}Page`]++
        if (this[`${this.curKey}Page`] > this[`${this.curKey}Total`] && this[`${this.curKey}Page`] > 1) {
          //这里的Page-1是因为第一次(切换tab时this.curFinish变化,导致分页组件自动触发onLoad事件),导致page+1,
          this[`${this.curKey}Page`]--
          return
        }
        if (this.tabIndex) {
          if (this.priSourceIndex == 1) {
            this.getCollectInfoDetailV2('C03')
          } else if (this.priSourceIndex == 2) {
            this.getCollectInfoDetailV2('C04')
          } else if (this.priSourceIndex == 3) {
            this.getCollectInfoDetailV2('C02')
          }
        } else {
          if (this.resourceIndex == 1) {
            this.getResCourseWareInfo('C01', this.lessonListPage)
          } else if (this.resourceIndex == 2) {
            this.getResCourseWareInfo('C02', this.materialListPage)
          } else if (this.resourceIndex == 3) {
            this.getSysCourseTestPaperList()
          }
        }
      },
      async onRefresh() {
        this[`${this.curKey}Finish`] = false
        this[`${this.curKey}Page`] = 0
        this.onLoad()
      },
      goBack() {
        this.common.goBack(this)
      },
      updateCourseWareCount(item) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          courseWareId: item.courseware_id || item.resCourseWareInfo.coursewareId,
          "countType":"C02",
          "sysTypeCd":"S02"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateCourseWareCount(params).then(res => {
          if(res.flag) {
            if(item.courseware_id) {
              item.down_count++
            }else {
              item.resCourseWareInfo.downCount++
            }
          }
        })
      },
      async download(srcUrl, name, item) {
        let url = srcUrl;
        if (url.indexOf("pubquanlang") > -1) {
          this.accessUrl = url;
        } else {
          let json = {
            requestJson: JSON.stringify({
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
              "belongSchoolId": this.$store.getters.schoolId,
              url: url,
              sysTypeCd: "S03"
            })
          };
          await pubApi.checkUrlPermission(json).then(data => {
            console.log(data, "checkUrlPermission");
            if (data.flag) {
              this.accessUrl = data.data[0].accessUrl;
            }
          });
        }
        this.updateCourseWareCount(item)
        this.downLoadToOpen(srcUrl, name);
      },
      downLoadToOpen(srcUrl, name) {

        var _this = this;
        // 文件后缀
        var type = srcUrl
          .substring(srcUrl.lastIndexOf(".") + 1)
          .toLowerCase();
        var fileName = name + "." + type;
        var url = _this.accessUrl; //课件路径
        var targetPath = cordova.file.dataDirectory + "Download/gaofenyun/" + fileName; //要下载的目标路径及文件名
        var trustHosts = true;
        // 初始化FileTransfer对象
        var fileTransfer = new FileTransfer();
        // 下载进度
        fileTransfer.onprogress = function (progressEvent) {
          if (progressEvent.lengthComputable) {
            let downloadProgress =
              ((progressEvent.loaded / progressEvent.total).toFixed(2) * 100).toFixed(2);
            console.log(downloadProgress, progressEvent);
            _this.$toast.loading({
              mask: true,
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: "文件下载中..." + downloadProgress + "%"
            });
          } else {
            _this.$toast.clear();
            _this.$toast('下载完成');
          }
        };
        // 调用download方法
        fileTransfer.download(
          url, //url网络下载路径
          targetPath, //url本地存储路径
          function (entry) {
            console.log("download complete: " + entry.toURL());
            entry.file(data => {
              _this.$toast.clear();
              _this.$toast('下载完成');
              console.log("showOpenWithDialog data", data);
              // showOpenWithDialog使用手机上安装的程序打开下载的文件
              cordova.plugins.fileOpener2.showOpenWithDialog(
                targetPath,
                data.type,
                function onSuccess(data) {
                  console.log("成功预览:" + targetPath);
                },
                function onError(error) {
                  console.log(
                    "出错！请在" +
                    cordova.file.externalDataDirectory +
                    "目录下查看"
                  );
                }
              );
            });
          },
          function (error) {
            _this.$toast.clear();
            _this.$toast.fail("下载失败");
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
          }
        );
      },
      delTestPaper(item, index) {
        let obj = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          "testPaperInfo": {"testPaperId": item.test_paper_id}
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        delTestPaper(params).then(res => {
          if (res.flag) {
            this.priExamList.splice(index, 1)
            this.$toast('删除成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleYearSection() {
        const year = this.subjectLabel.substr(0, 2)
        if (year === '小学') {
          return 'Y01'
        } else if (year === '初中') {
          return 'Y02'
        } else {
          return 'Y03'
        }
      },
      getCollectInfoDetailV2(objectTypeCd) {
        const page = this[`${this.curKey}Page`]
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: localStorage.currentSubjectType,
          yearSection: this.handleYearSection(),
          "pageSize": 10,
          "currentPage": page,
          "orderByType": "T01",
          "resCollectInfo": {
            objectTypeCd,
            "objectId": null,
            "collectType": "",
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "statusCd": "S01"
          },
          "filterParam": {
            "titleDegree": "",
            "belongType": "",
            "belongAreaCode": '',
            "keyWord": "",
            "createYear": "",
            "courseWareType": ""
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }

        getCollectInfoDetailV2(params).then(res => {
          this.$store.commit('setVanLoading', false)
          this[`${this.curKey}Total`] = res.total
          this.listLoading = false
          this.refLoading = false
          if (res.flag) {
            this[this.curKey] = page === 1 ? (res.data || []) : this[this.curKey].concat(res.data || [])
            if (page >= res.total) {
              this[`${this.curKey}Finish`] = true
            }
          } else {
            this[this.curKey] = page === 1 ? [] : this[this.curKey].concat([])
            this[`${this.curKey}Finish`] = true
            this.$toast(res.msg)
          }
        })
      },
      toggleTab(value) {
        if (this.tabIndex == value) return
        this.tabIndex = value
        if (!this.firstClickPri) {
          this[`${this.curKey}Init`] = true
          this.onLoad()
        }
        this.firstClickPri = true
      },
      viewQuestion() {
        if (this.canBack) {
          //有左上角返回按钮的时候
          if (this.$route.query.from === 'examDetail') {
            if (this.tabIndex) {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=examDetail&year=${this.handleYearSection()}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            } else {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=examDetail&isRes=1&areaCode=&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            }
          } else if (this.$route.query.from === 'questionList') {
            this.$store.commit('setIsRevert', true)
            if (this.tabIndex) {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=questionList&year=${this.handleYearSection()}&tchCourseId=${this.$route.query.tchCourseId}&sysCourseId=${this.$route.query.sysCourseId}&relationCourseId=${this.$route.query.relationCourseId}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            } else {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&tchCourseId=${this.$route.query.tchCourseId}&sysCourseId=${this.$route.query.sysCourseId}&relationCourseId=${this.$route.query.relationCourseId}&from=questionList&isRes=1&areaCode=&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            }
            // this.$emit('viewRes',1)
            // this.isRevert = true
          }
        } else {
          if (this.tabIndex) {
            this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&year=${this.handleYearSection()}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
          } else {
            this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&isRes=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
          }
        }

      },
      viewDetail(item) {
        if (this.tabIndex) {
          //私人资源
          let humpObj = {}
          for (let k in item) {
            const humpKey = toHump(k)
            humpObj[humpKey] = item[k]
          }
          this.$store.commit('setResourceInfo', humpObj)
          this.$store.commit("setTaskClassInfo", '')
          this.$router.push({
            path: `/examDetail`, query: {
              flag: 1,
              "sysCourseId": this.courseId,
              type: 0,
              testPaperId: humpObj.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.gradeTerm.split('|')[0],
              title: humpObj.testPaperName,
            }
          })
        } else {
          //平台资源
          this.$store.commit('setResourceInfo', item)
          this.$store.commit("setTaskClassInfo", '')
          this.$router.push({
            path: `/examDetail`, query: {
              flag: 1,
              "sysCourseId": this.courseId,
              type: 0,
              testPaperId: item.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.gradeTerm.split('|')[0],
              title: item.testPaperName,
            }
          })
        }
      },
      goto(item) {
        if (this.tabIndex) {
          let humpObj = {}
          for (let k in item) {
            const humpKey = toHump(k)
            humpObj[humpKey] = item[k]
          }
          //私人资源素材的时间需要转格式
          humpObj.createDate = formatTime(humpObj.createDate)
          this.$router.push({path: '/materialDetail', query: {data: humpObj}})
        } else {
          this.$router.push({path: '/materialDetail', query: {data: item.resCourseWareInfo}})
        }
      },
      sendTask(obj, key) {
        if (this.tabIndex) {
          if (key === 'exam') {
            if (!obj.objective_item_num && !obj.subjective_item_num) {
              return this.$toast('该试卷不含试题')
            }
            let humpObj = {}
            for (let k in obj) {
              const humpKey = toHump(k)
              humpObj[humpKey] = obj[k]
            }
            this.$store.commit('setResourceInfo', humpObj)
            this.showAddPop(obj.test_paper_name, '', 'R02', key)
          } else {
            let humpObj = {}
            for (let k in obj) {
              const humpKey = toHump(k)
              humpObj[humpKey] = obj[k]
            }
            this.$store.commit('setResourceInfo', humpObj)
            this.showAddPop(obj.courseware_name, '', 'R01', key)
          }

        } else {
          if (key === 'exam') {
            if (!obj.objectiveItemNum && !obj.subjectiveItemNum) {
              return this.$toast('该试卷不含试题')
            }
            this.$store.commit('setResourceInfo', obj)
            this.showAddPop(obj.testPaperName, '', 'R02', key)
          } else {
            this.$store.commit('setResourceInfo', obj.resCourseWareInfo)
            this.showAddPop(obj.resCourseWareInfo.coursewareName, '', 'R01', key)
          }
        }
      },
      goVideoPage(item) {
        if (this.tabIndex ? !item.src_url : !item.resCourseWareInfo.srcUrl) return
        this.checkUrlPermission(item)
      },
      checkUrlPermission(item) {
        // 课件鉴权
        let permissionParams = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          'url': this.tabIndex ? item.src_url : item.resCourseWareInfo.srcUrl,
          'sysTypeCd': 'S03'
        }
        this.$store.commit('setVanLoading', true)
        pubApi.checkUrlPermission({requestJson: JSON.stringify(permissionParams)}).then((respone) => {
          this.$store.commit('setVanLoading', false)
          let src_url, srcUrl
          if (respone.flag) {
            this.tabIndex ? src_url = respone.data[0].accessUrl
              : srcUrl = respone.data[0].accessUrl
          } else {
            this.tabIndex ? src_url = ''
              : srcUrl = ''
          }

          if (this.tabIndex ? !src_url : !srcUrl) {
            this.$toast('暂无资源')
            return
          }

          this.$router.push({
            name: 'videoPage',
            query: {
              src: this.tabIndex ? src_url : srcUrl,
              title: this.tabIndex ? item.courseware_name : item.resCourseWareInfo.coursewareName,
              isMp3: (this.tabIndex ? item.coursewareType : item.resCourseWareInfo.coursewareType) == "T06" ? true : false
            }
          })
        }).catch(() => {
          this.$store.commit('setVanLoading', false)
          this.$toast('资源错误')
        })
      },
      getSysCourseTestPaperList() {
        if (!this.courseId) return
        const page = this.examListPage
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          sysCourseIdList: [this.courseId],
          "pageSize": "10",
          "currentPage": page,
          "orderByType": "T05"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSysCourseTestPaperList(params).then(res => {
          this.$store.commit('setVanLoading', false)
          this.examListTotal = res.total
          this.listLoading = false
          this.refLoading = false
          if (res.flag) {
            this.examList = page === 1 ? (res.data || []) : this.examList.concat(res.data || [])
            if (page >= res.total) {
              this.examListFinish = true
            }
          } else {
            this.examList = page === 1 ? [] : this.examList.concat([])
            this.examListFinish = true
            this.$toast(res.msg)
          }
        })
      },
      saveRecord(courseName) {
        if (this.tabIndex) {
          let item = {}
          if (this.priListKey === 'priExamList') {
            item = this[this.priListKey].find(v => this.resourceId === v.test_paper_id)
          } else {
            item = this[this.priListKey].find(v => this.resourceId === v.courseware_id)
          }
          if (item.record) {
            //有添加记录
            item.record.push(`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`)
          } else {
            this.$set(item, 'record', [`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`])
          }
        } else {
          let item = {}
          if (this.listKey === 'examList') {
            item = this[this.listKey].find(v => this.resourceId === v.testPaperId)
          } else {
            item = this[this.listKey].find(v => this.resourceId === v.resCourseWareInfo.coursewareId)
          }
          if (item.record) {
            //有添加记录
            item.record.push(`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`)
          } else {
            this.$set(item, 'record', [`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`])
          }
        }
      },
      showAddPop(name, id, resourceType, key) {
        if (!id) {
          this.isSendTask = true
        } else {
          this.isSendTask = false
        }
        this.addCourseShow = true
        this.resName = name
        this.resourceId = id
        this.resourceType = resourceType
        if (this.tabIndex) {
          this.priListKey = key
        }
        this.listKey = key
        if (!this.courseList.length) {
          this.getClassTeachCourseInfo()
        }
      },
      getClassTeachCourseInfo() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          // "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "subjectType": localStorage.getItem("currentSubjectType"),
          classGrade: this.gradeTerm.split('|')[0],
          termType: '',
          "pageSize": "999",
          "courseType": "C01,C02",
          "currentPage": 1,
          "isFinish":2
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.courseList = res.data || []
          }
        })
      },
      handleIcon(item) {
        const type = item.src_url || item.srcUrl
        let t = type.substring(type.lastIndexOf('.') + 1).toLowerCase()
        if (t == 'ppt' || t == 'pptx') {
          t = 'icon-ppt'
        } else if (t == 'doc' || t == 'docx') {
          t = 'icon-doc'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'icon-xls'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          // t = 'icon'
        } else if (t == 'pdf') {
          t = 'icon-pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'icon-img'
        } else if (t == 'mp4') {
          t = 'icon-video'
        } else if (t == 'mp3') {
          t = 'icon-audio'
        } else {
          // t = 'unkown'
        }
        return t
      },
      getObjectTypeCd() {
        if(this.tabIndex) {
          if(this.priSourceIndex === 1) {
            return 'C03'
          }else if(this.priSourceIndex === 2) {
            return 'C04'
          }else if(this.priSourceIndex === 3) {
            return 'C02'
          }
        }else {
          if(this.resourceIndex === 1) {
            return 'C03'
          }else if(this.resourceIndex === 2) {
            return 'C04'
          }else if(this.resourceIndex === 3) {
            return 'C02'
          }
        }
      },
      collect(item, objectId, statusCd, index, bol) {
        this.$store.commit('setVanLoading', true)
        if (this.tabIndex ? item.collect_id : item.collectId) {
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "collectId": this.tabIndex ? item.collect_id : item.collectId,
              "objectTypeCd": this.getObjectTypeCd(),
              objectId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              statusCd,
            },
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          delCollectInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if (res.flag) {
              this.$toast(bol?'删除成功':'取消收藏')
              console.log(this.priListKey,this[this.priListKey],'=d=d=d=d');
              this.tabIndex ?
                this[this.curKey].splice(index, 1)
                : item.collectId = 0
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          //私人资源不能收藏
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "objectTypeCd": this.getObjectTypeCd(),
              objectId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              statusCd,
              "subjectType": localStorage.currentSubjectType
            },
            "sysTypeCd": "S02"
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          createCollectInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if (res.flag) {
              this.$toast('收藏成功')
              item.collectId = res.resCollectInfo.collectId
            } else {
              this.$toast(res.msg)
            }
          })
        }
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
            if (!this.lessonList.length) {
              this.getResCourseWareInfo('C01', this.lessonListPage)
            }
          } else if (value == '2') {
            //素材
            if (!this.materialList.length) {
              this.getResCourseWareInfo('C02', this.materialListPage)
            }
          } else if (value == '3') {
            //试卷
            if (!this.examList.length) {
              this.getSysCourseTestPaperList()
            }
          }
        }
      },
      getResCourseWareInfo(queryType, currentPage) {
        if (!this.courseId) return
        const page = currentPage
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          queryType, //C01 微课 C02 素材
          "sysCourseIdList": [this.courseId],
          "areaCode": this.areaCode || null,
          "orderByType": "T05",
          "pageSize": "10",
          "currentPage": page,
          "filterParam": {"shareType": "", "courseWareType": ""}
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getResCourseWareInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          this[`${this.curKey}Total`] = res.total
          this.listLoading = false
          this.refLoading = false
          if (res.flag) {
            this[this.curKey] = page === 1 ? (res.resCourseWareOrderInfoList || []) : this[this.curKey].concat(res.resCourseWareOrderInfoList || [])
            if (page >= res.total) {
              this[`${this.curKey}Finish`] = true
            }
          } else {
            this[this.curKey] = page === 1 ? [] : this[this.curKey].concat([])
            this[`${this.curKey}Finish`] = true
            this.$toast(res.msg)
          }
        })
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

      .sticky-wrap {
        top: 0;
        z-index: 10;
        background: #f5f5f5;
      }


      &__title {
        line-height: 44px;
        padding: 0 15px;
        font-size: 16px;
        color: #999;
      }

      &__tab {
        display: flex;
        align-items: center;
        padding: 0 15px 10px;

        &-item {
          width: 70px;
          line-height: 24px;
          border-radius: 12px;
          text-align: center;
          background: #fff;
          font-size: 16px;
          color: #333;
          margin-right: 10px;

          &.active {
            background: @blue;
            color: #fff;
          }
        }
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

    .null-tips {
      margin-top: 50px;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
  }
</style>
