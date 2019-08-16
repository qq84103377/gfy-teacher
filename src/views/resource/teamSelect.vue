<template>
  <section class="team-select-wrap">
    <div class="team-select-wrap__body">
      <div class="class-select" v-if="$route.query.type === 'team'" v-for="(item,index) in list" :key="index">
        <van-checkbox
          class="parent-checkbox"
          style="margin-left: 0;"
          v-model="item.check"
          @click=""
        >
          <i
            slot="icon"
            slot-scope="props"
            :class="['iconGFY','icon-check',{'normal':!props.checked}]"
          ></i>
          {{item.name}}
        </van-checkbox>
        <div class="team-select-wrap__body__group" v-for="(g,gi) in item.group" :key="gi">
          <van-checkbox
            class="gfy-checkbox"
            style="margin-left: 0;"
            v-model="g.check"
            @click="handleSelectParent(g)"
          >
            <i
              slot="icon"
              slot-scope="props"
              :class="['iconGFY','icon-check',{'normal':!props.checked}]"
            ></i>
            {{item.name}}
          </van-checkbox>
          <div class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectChild(s,g)" v-for="(s,si) in g.stu" :key="si"
                 :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">{{s.name}}
            </div>
          </div>
        </div>
      </div>

      <div class="team-select-wrap__body__group" v-else v-for="(c,ci) in list" :key="ci">
        <van-checkbox
          class="gfy-checkbox"
          style="margin-left: 0;"
          v-model="c.check"
          @click="handleSelectParent(c)"
        >
          <i
            slot="icon"
            slot-scope="props"
            :class="['iconGFY','icon-check',{'normal':!props.checked}]"
          ></i>
          {{item.name}}
        </van-checkbox>
        <div class="team-select-wrap__body__group-wrap">
          <div @click="handleSelectChild(s,g)" v-for="(s,si) in g.stu" :key="si"
               :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">{{s.name}}
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
        list: []
      }
    },
    created() {
      // if(this.$route.query.type === 'class') {
      //   this.teamList.map(v => {
      //
      //   })
      // }

      this.list = JSON.parse(JSON.stringify(this.$store.getters.getTeamList))
    },
    methods: {
      handleConfirm() {
        this.$store.commit('setTeamList',this.list)
        this.$router.back()
      },
      handleSelectChild(s, item) {
        this.$set(s, 'active', !s.active)
        if (s.active) {
            this.$set(item,'check',true)
        }else if(item.stu.every(v => !v.active)) {
          this.$set(item,'check',false)

        }
      },
      handleSelectParent(item) {
          item.stu.forEach(v => {
            this.$set(v,'active',!item.check)
          })
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
          margin-bottom: 8px;
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
            flex: 0 0 75px;
            line-height: 32px;
            border-radius: 11px;
            font-size: 12px;
            margin-right: 8px;
            margin-bottom: 10px;
            background: #eee;
            color: #333;
            text-align: center;

            &:nth-child(4n) {
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
