<template>
  <section class="board-detail">
    <van-nav-bar
      :title="info.name"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="board-detail__body">
      <video v-if="type === 'mp4'" controls="controls"
             controlsList="nodownload" :src="info.dataUrl"></video>
      <audio v-else-if="type === 'mp3' && info.dataUrl"
             controls="controls"
             controlsList="nodownload" :src="info.dataUrl"></audio>
      <img v-else-if="type === 'img' && info.dataUrl"
           :src="info.dataUrl"/>
<!--      <PDF v-else-if=" type === 'pdf' && info.dataUrl" :url="info.dataUrl"-->
<!--           style="width: 100%;height: 60vh;overflow-y: scroll"></PDF>-->
<!--      <iframe v-else-if=" type === 'pdf' && info.dataUrl && !vanLoading" :src="info.dataUrl"></iframe>-->
      <iframe v-else-if=" (type === 'office'||type === 'pdf') && info.dataUrl && !vanLoading" :src="info.dataUrl"></iframe>


      <list-item class="mgt10" :itemTitle="info.name">
        <div slot="cover" class="cover"><i class="iconGFY" :class="iconType"></i><img v-if="iconType === 'img'" :src="info.dataUrl" alt=""></div>
        <div slot="desc">
          <div class="desc-top">
            发布者:{{info.belongAccountName}}
          </div>
          <div class="desc-bottom">
            <div>
              <van-icon name="clock-o"></van-icon>
              {{info.createDate}}
            </div>
            <div><i class="iconGFY icon-points"></i>{{info.useCount}}</div>
            <div><i class="iconGFY icon-download"></i>{{info.downCount}}</div>
          </div>
        </div>
      </list-item>

    </div>
  </section>
</template>

<script>
  import { mapMutations, mapGetters, mapState } from 'vuex'
  import listItem from '../../components/list-item'
  import {pubApi} from '@/api/parent-GFY'
  import PDF from '../../components/pdfJS'
  export default {
    name: "boardDetail",
    components: {listItem,PDF},
    data() {
      return {
        info: this.$route.query.data,
        type: '',
        iconType: ''
      }
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      })
    },
    methods: {
      handleIcon (url) {
        var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
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
          t = 'img'
        } else if (t == 'mp4' || t == 'mp3') {
          t = 'icon-video'
        } else {
          // t = 'unkown'
        }
        return t
      },
      getUrlSuffix (url) {
        var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
        console.log(t)
        if (t == 'ppt' || t == 'pptx') {
          t = 'office'
        } else if (t == 'doc' || t == 'docx') {
          t = 'office'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'office'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          t = 'rar'
        } else if (t == 'pdf') {
          t = 'pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'img'
        } else if (t == 'mp4') {
          t = 'mp4'
        } else if (t == 'mp3') {
          t = 'mp3'
        } else {
          t = 'unkown'
        }
        return t
      },
      checkUrlPermission() {
// 课件鉴权
        let permissionParams = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          'url': this.info.dataUrl,
          'sysTypeCd': 'S03'
        }
        this.$store.commit('setVanLoading', true)
        pubApi.checkUrlPermission({requestJson: JSON.stringify(permissionParams)}).then((respone) => {
          this.$store.commit('setVanLoading', false)
          if (respone.flag) {
            if (this.type == 'office' || this.type == 'pdf') {
              if (this.info.dataUrl.indexOf('pubquanlang') > -1) {
                this.info.dataUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl

              } else {
                this.info.dataUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl
              }
            } else {
              this.info.dataUrl = respone.data[0].accessUrl
            }
          } else {
            this.info.dataUrl = ''
          }
        })
      }
    },
    created() {
        if (this.info.resourceType === 'R01' || this.$route.query.type === 'board') {
          this.type = this.getUrlSuffix(this.info.dataUrl)
          this.iconType = this.handleIcon(this.info.dataUrl)
          this.checkUrlPermission()
        }

    }
  }
</script>

<style lang="less" scoped>
  .board-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      padding: 10px;
      flex: 1;
      overflow-y: auto;

      > img, >video,>iframe {
        width: 100%;
        height: 350px;
      }
      >audio {
        height: 95px;
        width: 100%;
      }
      .cover {
        background: #F3D233;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .desc-top {
        font-size: 10px;
        color: #666;
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;
        justify-content: flex-start;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 6px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
