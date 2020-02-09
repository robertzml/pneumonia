<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-card-title class="lime darken-3">
            添加日志
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row dense>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="门牌号" v-model="recordInfo.number" readonly></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="住户" v-model="recordInfo.inhabitant" readonly></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-menu
                    v-model="timeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="recordInfo.record_date"
                        label="日志日期"
                        prepend-icon="event"
                        hide-details
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="recordInfo.record_date" :day-format="$util.pickerDayFormat" @input="timeMenu = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field label="信息" v-model="recordInfo.info"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-grey lighten-3" text @click="dialog = false">返回</v-btn>
            <v-btn color="success darken-1" :disabled="!valid" :loading="loading" @click="submit">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import room from '@/controllers/room'

export default {
  name: 'RecordCreate',
  data: () => ({
    dialog: false,
    valid: true,
    loading: false,
    timeMenu: false,
    departmentRules: [v => !!v || '请选择部门'],
    recordInfo: {}
  }),
  methods: {
    init(roomInfo) {
      this.recordInfo.room_type = roomInfo.room_type
      this.recordInfo.room_id = roomInfo.id
      this.recordInfo.number = roomInfo.number
      this.recordInfo.inhabitant = roomInfo.inhabitant
      this.recordInfo.record_date = this.$moment().format('YYYY-MM-DD')
      this.recordInfo.info = ''

      this.dialog = true
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$nextTick(() => {
          this.loading = true
        })

        let vm = this
        room.insertRecord(this.recordInfo).then(res => {
          if (res.success == 0) {
            vm.$store.commit('alertSuccess', '添加成功')
            vm.loading = false
            vm.$emit('close')
            vm.dialog = false
          } else {
            vm.$store.commit('alertError', '添加失败')
            vm.loading = false
          }
        })
      }
    }
  },
  mounted: function() {}
}
</script>
