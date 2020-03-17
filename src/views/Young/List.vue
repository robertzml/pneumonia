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
              <v-text-field
                v-model="filter.pattern"
                append-icon="filter"
                label="返回城市过滤"
                clearable
                single-line
                hint="如:湖南|安徽|河南"
                persistent-hint
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-card-title class="pink darken-4">
          青教公寓
          <v-spacer></v-spacer>
          <v-btn small text @click.stop="exportList">导出全部数据</v-btn>
          <v-btn small text @click.stop="exportRelation">导出家属数据</v-btn>
          <v-btn text icon @click.stop="refresh"><v-icon>refresh</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="px-0">
          <v-data-table :headers="headers" :items="filterData" :search="filter.text" :items-per-page="10">
            <template v-slot:item.category="{ item }">
              {{ item.category | category }}
            </template>
            <template v-slot:item.called="{ item }">
              {{ item.called | callType }}
            </template>
            <template v-slot:item.reside="{ item }">
              {{ item.reside | showReside }}
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
import { mapState, mapMutations, mapActions } from 'vuex'
import room from '@/controllers/room'
import FileSaver from 'file-saver'
import Excel from 'exceljs'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

export default {
  name: 'YoungList',
  data: () => ({
    search: '',
    timeMenu: false,
    filter: {
      is_check: false,
      department: '',
      category: [],
      called: [],
      time: null,
      text: '',
      pattern: ''
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
      { text: '居住人数', value: 'reside' },
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
      refreshEvent: state => state.young.refreshEvent
    }),
    filterData: function() {
      let temp = this.roomList

      /*
      if (this.filter.is_check) {
        temp = temp.filter(r => r.is_check == 0)
      }
      */
      if (this.filter.pattern) {
        const pattern = eval('/' + this.filter.pattern + '/gi')
        temp = temp.filter(r => r.return_city.search(pattern) > -1)
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
      showEdit: 'young/showEdit',
      showDetails: 'young/showDetails'
    }),

    ...mapMutations({
      refresh: 'young/refresh'
    }),

    async loadRooms() {
      let data = await room.list()
      this.roomList = data.filter(r => r.room_type == 2)
    },

    viewItem(item) {
      this.showDetails(item.id)
    },

    editItem(item) {
      this.showEdit(item.id)
    },

    exportList() {
      let workbook = new Excel.Workbook()

      let sheet = workbook.addWorksheet('青教公寓住户列表')

      sheet.columns = [
        { header: '门牌号', key: 'number', width: 10 },
        { header: '住户', key: 'inhabitant', width: 10 },
        { header: '部门', key: 'department', width: 18 },
        { header: '电话', key: 'telephone', width: 12 },
        { header: '分类', key: 'category', width: 15 },
        { header: '联系情况', key: 'called', width: 12 },
        { header: '当前位置', key: 'position', width: 10 },
        { header: '备注', key: 'remark', width: 20 },
        { header: '返回日期', key: 'return_date', width: 12 },
        { header: '返回城市', key: 'return_city', width: 12 },
        { header: '工号', key: 'staff_number', width: 12 },
        { header: '人员性质', key: 'staff_type', width: 10 },
        { header: '居住人数', key: 'reside', width: 5 },
        { header: '是否核对', key: 'is_check', width: 5 }
      ]

      this.roomList.forEach(item => {
        let info = {
          number: item.number,
          inhabitant: item.inhabitant,
          department: item.department,
          telephone: item.telephone,
          category: this.$util.category(item.category),
          called: this.$util.callType(item.called),
          position: item.position,
          remark: item.remark,
          return_date: item.return_date,
          return_city: item.return_city,
          staff_number: item.staff_number,
          staff_type: this.$util.staffType(item.staff_type),
          reside: item.reside == -1 ? '' : item.reside,
          is_check: item.is_check ? '是' : '否'
        }

        sheet.addRow(info)
      })

      sheet.eachRow(function(row) {
        row.eachCell(function(cell) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, '青教公寓住户列表.xlsx')
      })
    },

    // 导出家属
    async exportRelation() {
      const relations = await room.loadRelations()

      let workbook = new Excel.Workbook()

      let sheet = workbook.addWorksheet('青教公寓住户列表')

      sheet.columns = [
        { header: '门牌号', key: 'number', width: 10 },
        { header: '住户', key: 'inhabitant', width: 10 },
        { header: '电话', key: 'telephone', width: 12 },
        { header: '分类', key: 'category', width: 15 },
        { header: '关系', key: 'relation', width: 12 },
        { header: '当前位置', key: 'position', width: 10 },
        { header: '备注', key: 'remark', width: 20 },
        { header: '返回日期', key: 'return_date', width: 12 },
        { header: '返回城市', key: 'return_city', width: 12 },
        { header: '身份证号', key: 'identity_card', width: 16 },
        { header: '工号', key: 'staff_number', width: 12 }
      ]

      relations.forEach(item => {
        let info = {
          number: item.number,
          inhabitant: item.inhabitant,
          telephone: item.telephone,
          category: this.$util.category(item.category),
          relation: item.relation_type,
          position: item.position,
          remark: item.remark,
          return_date: item.return_date,
          return_city: item.return_city,
          identity_card: item.identity_card,
          staff_number: item.staff_number
        }

        sheet.addRow(info)
      })

      sheet.eachRow(function(row) {
        row.eachCell(function(cell) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, '青教公寓家属列表.xlsx')
      })
    }
  },
  mounted: function() {
    this.loadRooms()
  }
}
</script>
