<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title class="purple darken-4">
          住户信息
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="门牌号" v-model="roomInfo.number" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="住户" v-model="roomInfo.inhabitant" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="部门" v-model="roomInfo.department" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="电话" v-model="roomInfo.telephone" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="当前分类" :value="$util.category(roomInfo.category)" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="当前位置" v-model="roomInfo.position" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field v-model="roomInfo.return_date" label="返回日期" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="返回城市" v-model="roomInfo.return_city" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="联系情况" :value="$util.callType(roomInfo.called)" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="工号" v-model="roomInfo.staff_number" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="人员性质" :value="$util.staffType(roomInfo.staff_type)" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="居住人数" :value="$util.showReside(roomInfo.reside)" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="核对人" v-model="roomInfo.check_user" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="核对时间" v-model="roomInfo.check_time" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-checkbox v-model="roomInfo.is_check" label="是否核对" readonly=""></v-checkbox>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field label="备注" v-model="roomInfo.remark" readonly></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showRelationCreate">添加家属</v-btn>
          <v-btn color="warning" @click="showCreateRecord">添加日志</v-btn>
          <v-btn color="success" @click="showList">返回</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-subheader>家属情况</v-subheader>
        <v-data-table :headers="relationHeaders" :items="relationItems" hide-default-footer disable-pagination>
          <template v-slot:item.category="{ item }">
            {{ item.category | category }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small color="warning" class="ml-2" @click="editItem(item)">
              <v-icon left dark>edit</v-icon>
              编辑
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-subheader>用户日志</v-subheader>
        <v-data-table :headers="headers" :items="recordItems" hide-default-footer disable-pagination> </v-data-table>
      </v-card>
    </v-col>

    <record-create ref="recordMod" @close="loadRecords"></record-create>

    <relation-edit ref="relationMod" @close="loadRelations"></relation-edit>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import room from '@/controllers/room'
import RecordCreate from '../Record/Create'
import RelationEdit from '../Relation/Edit'

export default {
  name: 'YoungDetails',
  components: {
    RecordCreate,
    RelationEdit
  },
  data: () => ({
    roomInfo: {},
    headers: [
      { text: '房间号', value: 'number' },
      { text: '住户', value: 'inhabitant' },
      { text: '日期', value: 'record_date' },
      { text: '信息', value: 'info' }
    ],
    recordItems: [],
    relationHeaders: [
      { text: '住户', value: 'inhabitant' },
      { text: '电话', value: 'telephone' },
      { text: '分类', value: 'category' },
      { text: '当前位置', value: 'position' },
      { text: '返回日期', value: 'return_date' },
      { text: '返回城市', value: 'return_city' },
      { text: '家属关系', value: 'relation_type' },
      { text: '操作', value: 'action' }
    ],
    relationItems: []
  }),
  computed: {
    ...mapState({
      departmentList: state => state.departmentList,
      id: state => state.young.roomId,
      refreshEvent: state => state.young.refreshEvent
    })
  },
  methods: {
    ...mapActions({
      showList: 'young/showList'
    }),

    ...mapMutations({
      refresh: 'young/refresh'
    }),

    async loadInfo() {
      if (this.id) {
        this.roomInfo = await room.get(this.id)
        if (this.roomInfo.hr_check == 0) {
          this.roomInfo.department = ''
        }

        this.loadRelations()
      } else {
        this.roomInfo = {}
      }
    },

    async loadRecords() {
      if (this.id) {
        let items = await room.loadRecords()
        this.recordItems = items.filter(r => r.room_id == this.id)
      } else {
        this.recordItems = []
      }
    },

    async loadRelations() {
      if (this.roomInfo.number) {
        let items = await room.loadRelations()
        this.relationItems = items.filter(r => r.number == this.roomInfo.number)
      } else {
        this.relationItems = []
      }
    },

    showCreateRecord() {
      this.$refs.recordMod.init(this.roomInfo)
    },

    showRelationCreate() {
      this.$refs.relationMod.init(0)
    },

    editItem(item) {
      this.$refs.relationMod.init(item.id)
    }
  },
  activated: function() {
    this.loadInfo()
    this.loadRecords()
  }
}
</script>
