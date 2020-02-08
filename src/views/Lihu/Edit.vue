<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title class="lime darken-3">
          编辑信息
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row dense>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="门牌号" v-model="roomInfo.number" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="住户" v-model="roomInfo.inhabitant"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-autocomplete v-model="roomInfo.department" :items="departmentList" label="部门*" :rules="departmentRules"></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="电话" v-model="roomInfo.telephone"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-select :items="$dict.category" label="当前分类*" v-model="roomInfo.category"></v-select>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="当前位置" v-model="roomInfo.position"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-menu v-model="timeMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="roomInfo.return_date"
                      label="返回日期"
                      prepend-icon="event"
                      clearable
                      hide-details
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="roomInfo.return_date" :day-format="$util.pickerDayFormat" @input="timeMenu = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-text-field label="返回城市" v-model="roomInfo.return_city"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-select :items="$dict.callType" label="联系情况*" v-model="roomInfo.called"></v-select>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="备注" v-model="roomInfo.remark"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey lighten-3" text @click="showList">返回</v-btn>
          <v-btn color="success darken-1" :disabled="!valid" :loading="loading" @click="submit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import room from '@/controllers/room'

export default {
  name: 'LihuEdit',
  data: () => ({
    valid: true,
    loading: false,
    timeMenu: false,
    departmentRules: [v => !!v || '请选择部门'],
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
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$nextTick(() => {
          this.loading = true
        })

        let vm = this
        room.update(this.roomInfo).then(res => {
          if (res.success == 0) {
            vm.$store.commit('alertSuccess', '修改成功')
            vm.loading = false
            vm.refresh()
            vm.showList()
          } else {
            vm.$store.commit('alertError', '修改失败')
            vm.loading = false
          }
        })
      }
    }
  },
  activated: function() {
    this.loadInfo()
  }
}
</script>
