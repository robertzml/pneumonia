<template>
  <v-sheet class="transparent">
    <v-card>
      <v-card-title class="deep-orange darken-2">
        分部门汇总
        <v-spacer></v-spacer>
        <v-btn small text @click.stop="exportDetails">导出部门明细</v-btn>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab>卡片</v-tab>
          <v-tab>表格</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
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
                          <v-list-item-content class="align-end font-weight-bold light-blue--text text--darken-4">{{
                            item.total
                          }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-tab-item>

          <v-tab-item>
            <v-data-table :headers="headers" :items="summaryItem" :items-per-page="10"> </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex'
import FileSaver from 'file-saver'
import Excel from 'exceljs'
//import ExcelJS from 'exceljs/dist/es5/exceljs.browser'
import room from '@/controllers/room'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

export default {
  name: 'SummaryIndex',
  data: () => ({
    tab: null,
    summaryItem: [],
    roomList: [],
    headers: [
      { text: '部门', value: 'name' },
      { text: '未知', value: 'zero' },
      { text: '正常', value: 'one' },
      { text: '房间空关', value: 'two' },
      { text: '医学观察人员', value: 'three' },
      { text: '居家观察人员', value: 'four' },
      { text: '已过观察期人员', value: 'five' },
      { text: '疫区未归人员', value: 'six' },
      { text: '其它省市未归人员', value: 'seven' },
      { text: '未联系上', value: 'eight' },
      { text: '当前蠡湖家园户数', value: 'lihu' },
      { text: '当前青教公寓户数', value: 'young' },
      { text: '校内登记房间合计', value: 'total' }
    ]
  }),
  computed: {
    ...mapState({
      departmentList: state => state.departmentList
    })
  },
  methods: {
    async makeSummary() {
      this.roomList = await room.list()

      this.departmentList.forEach(item => {
        let base = this.roomList.filter(r => r.department == item)

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
    },

    exportTable() {
      let workbook = new Excel.Workbook()

      this.departmentList.forEach(dep => {
        let sheet = workbook.addWorksheet(dep)

        let rows = []
        this.roomList
          .filter(r => r.department == dep)
          .forEach(item => {
            let info = [
              this.$util.roomType(item.room_type),
              item.number,
              item.inhabitant,
              item.department,
              item.telephone,
              this.$util.category(item.category),
              this.$util.callType(item.called),
              item.position
            ]
            rows.push(info)
          })

        sheet.addTable({
          name: dep,
          displayName: dep + '校内居住人员情况',
          ref: 'A1',
          headerRow: true,
          style: {
            theme: 'TableStyleDark3'
          },
          columns: [
            { name: '校内住所', width: 140 },
            { name: '门牌号', width: 100 },
            { name: '住户', width: 100 },
            { name: '部门', width: 180 },
            { name: '电话号码', width: 100 },
            { name: '分类', width: 150 },
            { name: '联系情况', width: 100 },
            { name: '当前位置', width: 100 }
          ],
          rows: rows
        })
      })

      workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, '分部门统计明细.xlsx')
      })
    },

    exportDetails() {
      let workbook = new Excel.Workbook()

      this.departmentList.forEach(dep => {
        let sheet = workbook.addWorksheet(dep)

        sheet.addRow([dep + '校内居住情况'])
        sheet.mergeCells('A1:H1')

        let title = sheet.getRow(1)
        title.height = 18
        title.eachCell(function(cell) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.font = {
            size: 14,
            bold: true
          }
        })

        let header = sheet.getRow(2)
        header.values = ['校内住所', '门牌号', '住户', '部门', '电话号码', '分类', '联系情况', '当前位置']
        header.eachCell(function(cell) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.font = {
            bold: true
          }
        })

        sheet.columns = [
          { key: 'roomType', width: 15 },
          { key: 'number', width: 10 },
          { key: 'inhabitant', width: 15 },
          { key: 'department', width: 25 },
          { key: 'telephone', width: 15 },
          { key: 'category', width: 20 },
          { key: 'called', width: 20 },
          { key: 'position', width: 20 }
        ]

        this.roomList
          .filter(r => r.department == dep)
          .forEach(item => {
            let info = {
              roomType: this.$util.roomType(item.room_type),
              number: item.number,
              inhabitant: item.inhabitant,
              department: item.department,
              telephone: item.telephone,
              category: this.$util.category(item.category),
              called: this.$util.callType(item.called),
              position: item.position
            }

            sheet.addRow(info)
          })

        sheet.eachRow(function(row, rowNumber) {
          if (rowNumber > 1) {
            row.eachCell(function(cell) {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              }
            })
          }
        })
      })

      workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, '分部门统计明细.xlsx')
      })
    }
  },
  mounted: function() {
    this.makeSummary()
  }
}
</script>
