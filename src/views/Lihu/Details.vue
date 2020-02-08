<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title class="deep-purple darken-3">
          住户信息
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
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
                <v-text-field label="当前分类" v-model="roomInfo.category" readonly></v-text-field>
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
                <v-text-field label="联系情况" v-model="roomInfo.called" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="工号" v-model="roomInfo.staff_number" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="备注" v-model="roomInfo.remark" readonly></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="showList">返回</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import room from '@/controllers/room'

export default {
  name: 'LihuDetails',
  data: () => ({
    roomInfo: {}
  }),
  computed: {
    ...mapState({
      departmentList: state => state.departmentList,
      id: state => state.lihu.roomId,
      refreshEvent: state => state.lihu.refreshEvent
    })
  },
  methods: {
    ...mapActions({
      showList: 'lihu/showList'
    }),

    ...mapMutations({
      refresh: 'lihu/refresh'
    }),

    async loadInfo() {
      if (this.id) {
        this.roomInfo = await room.get(this.id)
        if (this.roomInfo.hr_check == 0) {
          this.roomInfo.department = ''
        }
      } else {
        this.roomInfo = {}
      }
    }
  },
  activated: function() {
    this.loadInfo()
  }
}
</script>
