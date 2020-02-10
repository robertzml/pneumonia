<template>
  <v-sheet class="transparent">
    <v-row dense>
      <v-col cols="12">
        <v-alert type="info">
          <ol>
            <li>已返校户数:计算当前位置在蠡湖家园或青教，且无返回日期，或返回日期早于等于日报日期.</li>
            <li>今日返校:计算当前位置在蠡湖家园或青教.</li>
            <li>目前隔离户数:在医学观察或脱离观察期的住户中，计算返回日期还在日报日期的15天内.</li>
            <li>累计解除隔离户数:在医学观察或脱离观察期的住户中，返回日期已早于日报日期15天.</li>
            <li>
              几个关键城市，首先筛选出返回城市包含了相应关键字，疫区包括(湖南、河南、安徽、浙江、广东)，即为总户数。
              已返校户数判断当前位置是否在蠡湖家园或青教。 隔离相关数据在医学观察人员和解除观察人中筛选。
            </li>
          </ol>
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title class="brown darken-4">
            学校日报
            <v-spacer></v-spacer>
            <v-menu v-model="timeMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="eventDate" label="日报日期" prepend-icon="event" clearable hide-details readonly v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="eventDate" :day-format="$util.pickerDayFormat" @input="timeMenu = false" @change="selectDate"></v-date-picker>
            </v-menu>
          </v-card-title>
          <v-card-text class="pt-2">
            <v-data-table
              v-model="selected"
              item-key="category"
              show-select
              single-select
              :headers="headers"
              :items="eventItems"
              hide-default-footer
              disable-pagination
            >
              <template v-slot:item.room_type="{ item }">
                {{ item.room_type | roomType }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-subheader class="headline">{{ title }}</v-subheader>
        <v-tabs v-model="tab">
          <v-tab>
            合计
          </v-tab>
          <v-tab>
            已返校户数
          </v-tab>
          <v-tab>
            今日返校户数
          </v-tab>
          <v-tab>
            目前隔离户数
          </v-tab>
          <v-tab>
            今日新增隔离户数
          </v-tab>
          <v-tab>
            累计解除隔离户数
          </v-tab>
          <v-tab>
            今日解除隔离户数
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="total_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="return_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="return_today_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="isolation_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="isolation_today_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="relief_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table :headers="findHeaders" :items="relief_today_amount_list" :items-per-page="10">
              <template v-slot:item.category="{ item }">
                {{ item.category | category }}
              </template>
              <template v-slot:item.called="{ item }">
                {{ item.called | callType }}
              </template>
              <template v-slot:item.reside="{ item }">
                {{ item.reside | showReside }}
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import room from '@/controllers/room'

export default {
  name: 'EventIndex',
  data: () => ({
    timeMenu: false,
    eventDate: null,
    selected: [],
    tab: null,
    headers: [
      { text: '分组', value: 'category' },
      { text: '合计', value: 'total' },
      { text: '已返校户数', value: 'return_amount' },
      { text: '今日返校户数', value: 'return_today_amount' },
      { text: '目前隔离户数', value: 'isolation_amount' },
      { text: '目前隔离人数', value: 'isolation_reside' },
      { text: '今日新增隔离户数', value: 'isolation_today_amount' },
      { text: '今日新增隔离人数', value: 'isolation_today_reside' },
      { text: '累计解除隔离户数', value: 'relief_amount' },
      { text: '累计解除隔离人数', value: 'relief_reside' },
      { text: '今日解除隔离户数', value: 'relief_today_amount' },
      { text: '今日解除隔离人数', value: 'relief_today_reside' }
    ],
    eventItems: [],
    roomList: [],
    findHeaders: [
      { text: '门牌号', value: 'number' },
      { text: '住户', value: 'inhabitant' },
      { text: '部门', value: 'department' },
      { text: '电话', value: 'telephone' },
      { text: '分类', value: 'category' },
      { text: '当前位置', value: 'position' },
      { text: '返回日期', value: 'return_date' },
      { text: '返回城市', value: 'return_city' },
      { text: '居住人数', value: 'reside' },
      { text: '联系情况', value: 'called' },
      { text: '操作', value: 'action', sortable: false }
    ],
    title: '',
    total_list: [],
    return_amount_list: [],
    return_today_amount_list: [],
    isolation_amount_list: [],
    isolation_today_amount_list: [],
    relief_amount_list: [],
    relief_today_amount_list: []
  }),
  watch: {
    selected: function() {
      this.calcDetails()
    }
  },
  methods: {
    async loadData() {
      this.roomList = await room.list()
    },

    selectDate(val) {
      this.eventItems = []
      // console.log('invoke' + val)

      this.makeLihu(val)
      this.makeYoung(val)
      this.makeHuBei(val)
      this.makeWenZhou(val)
      this.makeAffect(val)

      this.calcDetails()
    },

    // 计算详细
    calcDetails() {
      this.title = ''
      this.total_list = []
      this.return_amount_list = []
      this.return_today_amount_list = []
      this.isolation_amount_list = []
      this.isolation_today_amount_list = []
      this.relief_amount_list = []
      this.relief_today_amount_list = []

      if (this.selected.length > 0) {
        const sel = this.selected[0]
        // console.log(sel)
        if (this.eventDate) {
          this.title = sel.category + ' - ' + this.eventDate
          if (sel.category == '蠡湖家园总户数') {
            this.detailsLihu(this.eventDate)
          } else if (sel.category == '青教公寓总户数') {
            this.detailsYoung(this.eventDate)
          } else if (sel.category == '涉湖北户数') {
            this.detailsHuBei(this.eventDate)
          }
        }
      }
    },

    // 蠡湖家园统计
    makeLihu(val) {
      let record = {}
      const current = val

      let rooms = this.roomList.filter(r => r.room_type == 1)
      record.category = '蠡湖家园总户数'
      record.total = rooms.length
      record.return_amount = 0 //rooms.filter(r => r.position == '蠡湖家园').length
      record.return_today_amount = rooms.filter(r => r.return_date == current && r.position == '蠡湖家园').length
      record.isolation_amount = 0
      record.isolation_reside = 0
      record.isolation_today_amount = 0
      record.isolation_today_reside = 0
      record.relief_amount = 0
      record.relief_reside = 0
      record.relief_today_amount = 0
      record.relief_today_reside = 0

      // 返校总数
      rooms.forEach(item => {
        if (item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              record.return_amount += 1
            }
          } else {
            record.return_amount += 1
          }
        }
      })

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 今天累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              record.isolation_amount += 1
              if (item.reside != -1) {
                record.isolation_reside += item.reside
              }
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            record.isolation_today_amount += 1
            if (item.reside != -1) {
              record.isolation_today_reside += item.reside
            }
          }

          // 今日累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            record.relief_amount += 1
            if (item.reside != -1) {
              record.relief_reside += item.reside
            }
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            record.relief_today_amount += 1
            if (item.reside != -1) {
              record.relief_today_reside += item.reside
            }
          }
        })

      this.eventItems.push(record)
    },

    // 蠡湖家园详细
    detailsLihu(val) {
      const current = val

      const rooms = this.roomList.filter(r => r.room_type == 1)
      rooms.forEach(item => {
        // 总户数
        this.total_list.push(item)

        // 返校总数
        if (item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              this.return_amount_list.push(item)
            }
          } else {
            this.return_amount_list.push(item)
          }
        }
      })

      // 今日返校
      rooms
        .filter(r => r.return_date == current && r.position == '蠡湖家园')
        .forEach(item => {
          this.return_today_amount_list.push(item)
        })

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              this.isolation_amount_list.push(item)
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            this.isolation_today_amount_list.push(item)
          }

          // 今日累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            this.relief_amount_list.push(item)
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            this.relief_today_amount_list.push(item)
          }
        })
    },

    // 青教统计
    makeYoung(val) {
      let record = {}
      const current = val

      let rooms = this.roomList.filter(r => r.room_type == 2)
      record.category = '青教公寓总户数'
      record.total = rooms.length
      record.return_amount = 0 //rooms.filter(r => r.position == '青教').length
      record.return_today_amount = rooms.filter(r => r.return_date == current && r.position == '青教').length
      record.isolation_amount = 0
      record.isolation_reside = 0
      record.isolation_today_amount = 0
      record.isolation_today_reside = 0
      record.relief_amount = 0
      record.relief_reside = 0
      record.relief_today_amount = 0
      record.relief_today_reside = 0

      // 返校总数
      rooms.forEach(item => {
        if (item.position == '青教') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              record.return_amount += 1
            }
          } else {
            record.return_amount += 1
          }
        }
      })

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 目前累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              record.isolation_amount += 1
              if (item.reside != -1) {
                record.isolation_reside += item.reside
              }
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            record.isolation_today_amount += 1
            if (item.reside != -1) {
              record.isolation_today_reside += item.reside
            }
          }

          // 累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            record.relief_amount += 1
            if (item.reside != -1) {
              record.relief_reside += item.reside
            }
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            record.relief_today_amount += 1
            if (item.reside != -1) {
              record.relief_today_reside += item.reside
            }
          }
        })
      this.eventItems.push(record)
    },

    // 青教详细
    detailsYoung(val) {
      const current = val

      const rooms = this.roomList.filter(r => r.room_type == 2)
      rooms.forEach(item => {
        // 总户数
        this.total_list.push(item)

        // 返校总数
        if (item.position == '青教') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              this.return_amount_list.push(item)
            }
          } else {
            this.return_amount_list.push(item)
          }
        }
      })

      // 今日返校
      rooms
        .filter(r => r.return_date == current && r.position == '青教')
        .forEach(item => {
          this.return_today_amount_list.push(item)
        })

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              this.isolation_amount_list.push(item)
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            this.isolation_today_amount_list.push(item)
          }

          // 今日累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            this.relief_amount_list.push(item)
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            this.relief_today_amount_list.push(item)
          }
        })
    },

    makeHuBei(val) {
      let record = {}
      const current = val

      let rooms = this.roomList.filter(r => r.return_city && r.return_city.search(/湖北/gi) > -1)
      record.category = '涉湖北户数'
      record.total = rooms.length
      record.return_amount = 0
      record.return_today_amount = 0
      record.isolation_amount = 0
      record.isolation_reside = 0
      record.isolation_today_amount = 0
      record.isolation_today_reside = 0
      record.relief_amount = 0
      record.relief_reside = 0
      record.relief_today_amount = 0
      record.relief_today_reside = 0

      // 返校总数
      rooms.forEach(item => {
        if (item.position == '青教' || item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              record.return_amount += 1
            }
          } else {
            record.return_amount += 1
          }
        }
      })

      // 今日返校
      record.return_today_amount = rooms.filter(r => r.return_date == current && (r.position == '青教' || r.position == '蠡湖家园')).length

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 目前累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              record.isolation_amount += 1
              if (item.reside != -1) {
                record.isolation_reside += item.reside
              }
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            record.isolation_today_amount += 1
            if (item.reside != -1) {
              record.isolation_today_reside += item.reside
            }
          }

          // 累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            record.relief_amount += 1
            if (item.reside != -1) {
              record.relief_reside += item.reside
            }
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            record.relief_today_amount += 1
            if (item.reside != -1) {
              record.relief_today_reside += item.reside
            }
          }
        })

      this.eventItems.push(record)
    },

    // 湖北详细
    detailsHuBei(val) {
      const current = val

      const rooms = this.roomList.filter(r => r.return_city && r.return_city.search(/湖北/gi) > -1)
      rooms.forEach(item => {
        // 总户数
        this.total_list.push(item)

        // 返校总数
        if (item.position == '青教' || item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              this.return_amount_list.push(item)
            }
          } else {
            this.return_amount_list.push(item)
          }
        }

        // 今日返校
        rooms
          .filter(r => r.return_date == current && (r.position == '青教' || r.position == '蠡湖家园'))
          .forEach(item => {
            this.return_today_amount_list.push(item)
          })

        rooms
          .filter(r => r.return_date && (r.category == 3 || r.category == 5))
          .forEach(item => {
            // 目前累计隔离
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              if (rd.add(15, 'days').isAfter(current)) {
                this.isolation_amount_list.push(item)
              }
            }

            // 今日新增隔离
            rd = this.$moment(item.return_date)
            if (rd.isSame(current)) {
              this.isolation_today_amount_list.push(item)
            }

            // 累计解除
            rd = this.$moment(item.return_date)
            if (rd.add(14, 'days').isBefore(current)) {
              this.relief_amount_list.push(item)
            }

            // 今日解除
            rd = this.$moment(item.return_date)
            if (rd.add(15, 'days').isSame(current)) {
              this.relief_today_amount_list.push(item)
            }
          })
      })
    },

    makeWenZhou(val) {
      let record = {}
      const current = val

      let rooms = this.roomList.filter(r => r.return_city && r.return_city.search(/温州/gi) > -1)
      record.category = '涉温州户数'
      record.total = rooms.length
      record.return_amount = 0
      record.return_today_amount = 0
      record.isolation_amount = 0
      record.isolation_reside = 0
      record.isolation_today_amount = 0
      record.isolation_today_reside = 0
      record.relief_amount = 0
      record.relief_reside = 0
      record.relief_today_amount = 0
      record.relief_today_reside = 0

      // 返校总数
      rooms.forEach(item => {
        if (item.position == '青教' || item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              record.return_amount += 1
            }
          } else {
            record.return_amount += 1
          }
        }
      })

      // 今日返校
      record.return_today_amount = rooms.filter(r => r.return_date == current && (r.position == '青教' || r.position == '蠡湖家园')).length

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 目前累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              record.isolation_amount += 1
              if (item.reside != -1) {
                record.isolation_reside += item.reside
              }
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            record.isolation_today_amount += 1
            if (item.reside != -1) {
              record.isolation_today_reside += item.reside
            }
          }

          // 累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            record.relief_amount += 1
            if (item.reside != -1) {
              record.relief_reside += item.reside
            }
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            record.relief_today_amount += 1
            if (item.reside != -1) {
              record.relief_today_reside += item.reside
            }
          }
        })

      this.eventItems.push(record)
    },

    // 其它疫区
    makeAffect(val) {
      let record = {}
      const current = val

      let rooms = this.roomList.filter(r => r.return_city && r.return_city.search(/湖南|河南|浙江|安徽|广东/gi) > -1)
      record.category = '涉疫区户数'
      record.total = rooms.length
      record.return_amount = 0
      record.return_today_amount = 0
      record.isolation_amount = 0
      record.isolation_reside = 0
      record.isolation_today_amount = 0
      record.isolation_today_reside = 0
      record.relief_amount = 0
      record.relief_reside = 0
      record.relief_today_amount = 0
      record.relief_today_reside = 0

      // 返校总数
      rooms.forEach(item => {
        if (item.position == '青教' || item.position == '蠡湖家园') {
          if (item.return_date) {
            let rd = this.$moment(item.return_date)
            if (rd.isBefore(current) || rd.isSame(current)) {
              record.return_amount += 1
            }
          } else {
            record.return_amount += 1
          }
        }
      })

      // 今日返校
      record.return_today_amount = rooms.filter(r => r.return_date == current && (r.position == '青教' || r.position == '蠡湖家园')).length

      rooms
        .filter(r => r.return_date && (r.category == 3 || r.category == 5))
        .forEach(item => {
          // 目前累计隔离
          let rd = this.$moment(item.return_date)
          if (rd.isBefore(current) || rd.isSame(current)) {
            if (rd.add(15, 'days').isAfter(current)) {
              record.isolation_amount += 1
              if (item.reside != -1) {
                record.isolation_reside += item.reside
              }
            }
          }

          // 今日新增隔离
          rd = this.$moment(item.return_date)
          if (rd.isSame(current)) {
            record.isolation_today_amount += 1
            if (item.reside != -1) {
              record.isolation_today_reside += item.reside
            }
          }

          // 累计解除
          rd = this.$moment(item.return_date)
          if (rd.add(14, 'days').isBefore(current)) {
            record.relief_amount += 1
            if (item.reside != -1) {
              record.relief_reside += item.reside
            }
          }

          // 今日解除
          rd = this.$moment(item.return_date)
          if (rd.add(15, 'days').isSame(current)) {
            record.relief_today_amount += 1
            if (item.reside != -1) {
              record.relief_today_reside += item.reside
            }
          }
        })

      this.eventItems.push(record)
    }
  },
  mounted: function() {
    this.loadData()
  }
}
</script>
