<template>
  <section class="team-select-wrap">
    <div class="team-select-wrap__body">
      <div class="class-select" v-if="$route.query.type === 'team'" v-for="(item,index) in list" :key="index">
<!--        <van-checkbox class="parent-checkbox" style="margin-left: 0;" v-model="item.check" :title="item.className" :disabled="!item.tchSubGroup || item.tchSubGroup.length==0 " @click="handleSelectGroupClass(item)">-->
<!--          <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>-->
<!--          {{item.className}}-->
<!--        </van-checkbox>-->

        <div class="jcsb aic mgb10">
          <van-checkbox class="parent-checkbox" style="margin-left: 0;" v-model="item.check" :title="item.className" :disabled="!item.tchSubGroup || item.tchSubGroup.length==0 " @click="handleSelectGroupClass(item)">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            {{item.className}}
            <span class="mglt10">{{calStuNum(item)}}/{{calGroupNum(item.tchSubGroup)}}</span>
          </van-checkbox>
          <van-icon @click="$set(item,'open',!item.open)" class="mgr10" :name="item.open?'arrow-down':'arrow-up'" />
        </div>
        <div class="team-select-wrap__body__group" v-show="item.open" v-if="!item.tchSubGroup || item.tchSubGroup.length==0">
          此班级无分组
        </div>
        <div class="team-select-wrap__body__group" v-show="item.open" v-else v-for="(g,gi) in item.tchSubGroup" :key="gi">
          <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="g.check" @click="handleSelectParent(g,item)" :disabled="!g.tchClassSubGroupStudent.tchSubGroupStudent || g.tchClassSubGroupStudent.tchSubGroupStudent.length==0">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            {{g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName}}
          </van-checkbox>
          <div v-if="isfEducation!=='true'" class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectGroupStudent(s,g,item)" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
<!--              <span v-if="s.studentNumber>0">{{s.studentNumber}}</span>-->
              {{s.accountNo| getStudentName(item.classId)}}
            </div>
          </div>
          <div v-else class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectGroupStudent(s,g,item)" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
              {{s.parentName?s.parentName:s.parentAccountNo}}
            </div>
          </div>
        </div>
      </div>

      <div class="team-select-wrap__body__group" v-if="$route.query.type === 'class'" v-for="(c,ci) in list" :key="ci">
        <div class="jcsb aic">
          <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="c.check" @click="handleSelectParent(c)"
                        :disabled="c.disabled">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            {{c.className}}
            <span class="mglt10">{{calStuNum(c)}}/{{Object.keys(c.classStudent).length}}</span>
          </van-checkbox>
          <van-icon @click="$set(c,'open',!c.open)" class="mgr10" :name="c.open?'arrow-down':'arrow-up'" />
        </div>
        <div v-if="isfEducation!=='true'" v-show="c.open" class="team-select-wrap__body__group-wrap">
          <div @click="handleSelectChild(s,c)" v-for="(s,si) in c.classStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
<!--            <span v-if="s.studentNumber>0">{{s.studentNumber}}</span>-->
            {{s.accountNo|getStudentName(c.classId)}}
          </div>
        </div>

        <div v-else v-show="c.open" class="team-select-wrap__body__group-wrap">
          <div @click="handleSelectChild(s,c)" v-for="(s,si) in c.classStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
            {{s.parentName?s.parentName:s.parentAccountNo}}
          </div>
        </div>
      </div>

    </div>
    <div class="team-select-wrap__footer">
      <van-button type="info" class="confirm" @click="handleConfirm">确定</van-button>
    </div>
  </section>
</template>

<script>
export default {
  name: "teamSelect",
  data() {
    return {
      list: [],
      sendStudent: {},
      sendGroup: {},
      isfEducation: this.$route.query.isfEducation
    }
  },
  created() {
    // if(this.$route.query.type === 'class') {
    //   this.teamList.map(v => {
    //
    //   })
    // }
    let classInfo = this.$store.getters.getTaskClassInfo
    if (classInfo) {
      this.list = JSON.parse(classInfo);
    }
    //获取选中班级学生
    this.sendStudent = this.$store.getters.getSendTaskClassStudent
    //获取选中班级分组
    this.sendGroup = this.$store.getters.getSendTaskClassSubGroup
    //this.list = JSON.parse(JSON.stringify(this.$store.getters.getTeamList))
  },
  methods: {
    calGroupNum(groupList) {
      return groupList.reduce((t,v) => {
        if(v.tchClassSubGroupStudent && v.tchClassSubGroupStudent.tchSubGroupStudent) {
          t += v.tchClassSubGroupStudent.tchSubGroupStudent.length || 0
        }
        return t
      },0)
    },
    calStuNum(item) {
      if(this.$route.query.type === 'class') {
        //按班
        return Object.keys(item.classStudent).reduce((t,v) => {
          if(item.classStudent[v].active) t++
          return t
        },0)
      }else {
        //按组
        return item.tchSubGroup.reduce((total,v) => {
          if(v.tchClassSubGroupStudent && v.tchClassSubGroupStudent.tchSubGroupStudent) {
            total += v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t,s) => {
              if(s.active) t++
              return t
            },0)
          }
          return total
        },0)
      }
    },
    handleConfirm() {
      this.$store.commit('setTeamList', this.list)
      this.$store.commit("setTaskClassInfo", JSON.stringify(this.list))
      this.$router.back()
    },
    handleSelectGroupClass(item) {
      if (!item.tchSubGroup || item.tchSubGroup.length == 0) return
      this.$set(item, 'check', !item.check)
      item.tchSubGroup.forEach(ele => {
        if (ele.tchClassSubGroupStudent && ele.tchClassSubGroupStudent.tchSubGroupStudent) {
          ele.check = !item.check
          this.handleSelectParent(ele)
        }
      })
    },
    handleSelectChild(s, item) {
      this.$set(s, 'active', !s.active)
      if (s.active) {
        this.$set(item, 'check', true)
      } else {
        let classStudent = item.classStudent
        let flag = false
        for (let k in classStudent) {
          if (classStudent[k].active) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.$set(item, 'check', false)
        }
      }
    },
    handleSelectParent(p, item) {
      if (p.classStudent || (p.tchClassSubGroupStudent && p.tchClassSubGroupStudent.tchSubGroupStudent)) {
        this.$set(p, 'check', !p.check)
      }
      let classStudent = p.classStudent
      for (let k in classStudent) {
        classStudent[k].active = p.check
      }

      if (p.tchClassSubGroupStudent && p.tchClassSubGroupStudent.tchSubGroupStudent) {
        let groupStudent = p.tchClassSubGroupStudent.tchSubGroupStudent
        for (let k in groupStudent) {
          groupStudent[k].active = p.check
        }
      }

      if (item) {
        let flag1 = false
        for (let sub of item.tchSubGroup) {
          if (sub.check) {
            flag1 = true
            break
          }
        }
        item.check = flag1
      }

    },
    handleSelectGroupStudent(s, group, item) {
      this.$set(s, 'active', !s.active)
      let flag = false
      for (let stu of group.tchClassSubGroupStudent.tchSubGroupStudent) {
        if (stu.active) {
          flag = true
          break
        }
      }
      group.check = flag
      let flag1 = false
      for (let sub of item.tchSubGroup) {
        if (sub.check) {
          flag1 = true
          break
        }
      }
      item.check = flag1
    }
  }

}
</script>

<style lang="less" scoped>
.team-select-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 15px;
    .class-select {
      padding-left: 10px;
      .parent-checkbox {
        margin-left: -10px !important;
        /*margin-bottom: 8px;*/
      }
    }

    .normal {
      background: none;
      border: 1px solid #999;
      border-radius: 1.5px;
    }
    &__group {
      background: #fff;
      font-size: 14px;
      border-radius: 5px;
      margin-bottom: 10px;
      .gfy-checkbox {
        padding: 16px 0 10px 5px;

        i {
          vertical-align: inherit;
        }
      }

      &-wrap {
        padding-left: 5px;
        display: flex;
        flex-wrap: wrap;

        &-item {
          flex: 0 0 98px;
          line-height: 32px;
          border-radius: 15px;
          font-size: 12px;
          margin-right: 14px;
          margin-bottom: 10px;
          background: #eee;
          color: #333;
          text-align: center;
          > span {
            margin-right: 7px;
          }
          &:nth-child(3n) {
            margin-right: 0;
          }

          &.active {
            background: @blue;
            color: #fff;
          }
        }
      }
    }
  }

  &__footer {
    flex: 0 0 55px;
    padding: 5px 10px;

    .confirm {
      width: 100%;
      font-size: 16px;
      border-radius: 22px;
    }
  }
}
</style>
