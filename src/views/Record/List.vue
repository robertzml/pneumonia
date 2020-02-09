<template>
  <v-sheet class="transparent">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-card-title class="green darken-2">
            日志列表
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            <v-btn text icon @click.stop="loadRecords"><v-icon>refresh</v-icon></v-btn>
          </v-card-title>
          <v-card-text class="px-0">
            <v-data-table :headers="headers" :items="recordItems" :search="search" :items-per-page="10">
              <template v-slot:item.room_type="{ item }">
                {{ item.room_type | roomType }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import room from '@/controllers/room'

export default {
  name: 'RecordList',
  data: () => ({
    search: '',
    headers: [
      { text: '住所', value: 'room_type' },
      { text: '房间号', value: 'number' },
      { text: '住户', value: 'inhabitant' },
      { text: '日期', value: 'record_date' },
      { text: '信息', value: 'info' }
    ],
    recordItems: []
  }),
  methods: {
    async loadRecords() {
      this.recordItems = await room.loadRecords()
    }
  },
  mounted: function() {
    this.loadRecords()
  }
}
</script>
