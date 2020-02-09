<template>
  <v-sheet class="transparent">
    <v-row dense>
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
            <v-data-table :headers="headers" :items="eventItems" hide-default-footer disable-pagination>
              <template v-slot:item.room_type="{ item }">
                {{ item.room_type | roomType }}
              </template>
            </v-data-table>
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
          </v-card-text>
        </v-card>
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
    roomList: []
  }),
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
