<template>
  <v-sheet class="transparent">
    <v-card>
      <v-card-title class="deep-orange darken-2">
        分部门汇总
      </v-card-title>
      <v-card-text>
        <v-data-iterator :items="summaryItem" :disable-pagination="true" hide-default-footer>
          <template v-slot:default="props">
            <v-row>
              <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                <v-card :elevation="16" hover>
                  <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>未知:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.zero }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>正常:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.one }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>房间空关:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.two }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content class="red--text">医学观察人员:</v-list-item-content>
                      <v-list-item-content class="align-end red--text">{{ item.three }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content class="red--text">居家观察人员:</v-list-item-content>
                      <v-list-item-content class="align-end red--text">{{ item.four }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>已过观察期人员:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.five }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>疫区未归人员:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.six }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>其它省市未归人员:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.seven }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>未联系上:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.eight }}</v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-content>当前蠡湖家园户数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.lihu }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>当前青教公寓户数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.young }}</v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-content class="font-weight-bold light-blue--text text--darken-4">校内登记房间合计:</v-list-item-content>
                      <v-list-item-content class="align-end font-weight-bold light-blue--text text--darken-4">{{ item.total }}</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex'
import room from '@/controllers/room'

export default {
  name: 'SummaryIndex',
  data: () => ({
    summaryItem: []
  }),
  computed: {
    ...mapState({
      departmentList: state => state.departmentList
    })
  },
  methods: {
    async makeSummary() {
      let rooms = await room.list()

      this.departmentList.forEach(item => {
        let base = rooms.filter(r => r.department == item)

        let sum = {}
        sum.name = item
        sum.zero = base.filter(r => r.category == 0).length
        sum.one = base.filter(r => r.category == 1).length
        sum.two = base.filter(r => r.category == 2).length
        sum.three = base.filter(r => r.category == 3).length
        sum.four = base.filter(r => r.category == 4).length
        sum.five = base.filter(r => r.category == 5).length
        sum.six = base.filter(r => r.category == 6).length
        sum.seven = base.filter(r => r.category == 7).length
        sum.eight = base.filter(r => r.category == 8).length

        sum.lihu = base.filter(r => r.position == '蠡湖家园' && r.room_type == 1).length
        sum.young = base.filter(r => r.position == '青教' && r.room_type == 2).length

        sum.total = base.length
        this.summaryItem.push(sum)
      })
    }
  },
  mounted: function() {
    this.makeSummary()
  }
}
</script>
