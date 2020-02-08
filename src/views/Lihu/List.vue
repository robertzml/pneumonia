<template>
  <v-row dense>
    <v-col cols="12">
      <v-card flat>
        <v-card-subtitle>
          筛选
        </v-card-subtitle>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4" sm="6">
              <v-combobox v-model="filter.department" :items="departmentList" label="部门" multiple clearable hide-details></v-combobox>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-menu v-model="timeMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="filter.time" label="返回日期" prepend-icon="event" clearable hide-details readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="filter.time" :day-format="$util.pickerDayFormat" @input="timeMenu = false"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field v-model="filter.text" append-icon="search" label="搜索" clearable single-line hide-details> </v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-select :items="$dict.category" label="住户分类" multiple clearable v-model="filter.category" hide-details></v-select>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-select :items="$dict.callType" label="联系情况" multiple clearable v-model="filter.called" hide-details></v-select>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-checkbox v-model="filter.hr_check" label="部门需核对" hide-details></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-card-title class="indigo darken-2">
          蠡湖家园
        </v-card-title>
        <v-card-text class="px-0">
          <v-data-table :headers="headers" :items="filterData" :search="filter.text" :items-per-page="10">
            <template v-slot:item.category="{ item }">
              {{ item.category | category }}
            </template>
            <template v-slot:item.called="{ item }">
              {{ item.called | callType }}
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn small color="primary" @click="viewItem(item)">
                <v-icon left dark>pageview</v-icon>
                查看
              </v-btn>
              <v-btn small color="warning" class="ml-2" @click="editItem(item)">
                <v-icon left dark>edit</v-icon>
                编辑
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import room from '@/controllers/room'

export default {
  name: 'LihuList',
  data: () => ({
    search: '',
    timeMenu: false,
    filter: {
      hr_check: false,
      department: '',
      category: [],
      called: [],
      time: null,
      text: ''
    },
    headers: [
      { text: '门牌号', value: 'number' },
      { text: '住户', value: 'inhabitant' },
      { text: '部门', value: 'department' },
      { text: '电话', value: 'telephone' },
      { text: '分类', value: 'category' },
      { text: '当前位置', value: 'position' },
      { text: '返回日期', value: 'return_date' },
      { text: '返回城市', value: 'return_city' },
      { text: '联系情况', value: 'called' },
      { text: '操作', value: 'action', sortable: false }
    ],
    roomList: [],
    dialog: false,
    roomInfo: {}
  }),
  computed: {
    ...mapState({
      departmentList: state => state.departmentList,
      refreshEvent: state => state.lihu.refreshEvent
    }),
    filterData: function() {
      let temp = this.roomList

      if (this.filter.hr_check) {
        temp = temp.filter(r => r.hr_check == 0)
      }

      if (this.filter.department.length > 0) {
        temp = temp.filter(r => this.filter.department.includes(r.department))
      }

      if (this.filter.category.length > 0) {
        temp = temp.filter(r => this.filter.category.includes(r.category))
      }

      if (this.filter.called.length > 0) {
        temp = temp.filter(r => this.filter.called.includes(r.called))
      }

      if (this.filter.time) {
        temp = temp.filter(r => r.return_date == this.filter.time)
      }

      return temp
    }
  },
  watch: {
    refreshEvent: function() {
      this.loadRooms()
    }
  },
  methods: {
    ...mapActions({
      showEdit: 'lihu/showEdit',
      showDetails: 'lihu/showDetails'
    }),

    async loadRooms() {
      let data = await room.list()
      this.roomList = data.filter(r => r.room_type == 1)
    },

    viewItem(item) {
      this.showDetails(item.id)
    },

    editItem(item) {
      this.showEdit(item.id)
    }
  },
  mounted: function() {
    this.loadRooms()
  }
}
</script>
