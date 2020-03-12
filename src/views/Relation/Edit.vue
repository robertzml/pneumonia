<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-card-title class="lime darken-3">
            编辑家属
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row dense>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="门牌号" v-model="relationInfo.number" :rules="numberRules"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="住户" v-model="relationInfo.inhabitant"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="电话" v-model="relationInfo.telephone"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select :items="$dict.category" label="当前分类*" v-model="relationInfo.category"></v-select>
                </v-col>

                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="当前位置" v-model="relationInfo.position"></v-text-field>
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
                        v-model="relationInfo.return_date"
                        label="返回日期"
                        prepend-icon="event"
                        clearable
                        hide-details
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="relationInfo.return_date" :day-format="$util.pickerDayFormat" @input="timeMenu = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="返回城市" v-model="relationInfo.return_city"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="工号" v-model="relationInfo.staff_number"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="身份证" v-model="relationInfo.identity_card"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field label="家属关系" v-model="relationInfo.relation_type"></v-text-field>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field label="备注" v-model="relationInfo.remark"></v-text-field>
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
  name: 'RelationEdit',
  data: () => ({
    dialog: false,
    valid: true,
    loading: false,
    timeMenu: false,
    relationId: 0,
    relationInfo: {
      number: '',
      inhabitant: '',
      telephone: '',
      category: 0,
      position: '',
      remark: '',
      return_date: '',
      return_city: '',
      relation_type: '',
      identity_card: '',
      staff_number: ''
    },
    numberRules: [v => !!v || '请输入门牌号']
  }),
  methods: {
    init(id) {
      if (id == 0) {
        this.relationId = 0
        this.relationInfo = {
          number: '',
          inhabitant: '',
          telephone: '',
          category: 0,
          position: '',
          remark: '',
          return_date: '',
          return_city: '',
          relation_type: '',
          identity_card: '',
          staff_number: ''
        }
      } else {
        this.relationId = id
        this.loadRelation()
      }

      this.dialog = true
      this.loading = false

      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    async loadRelation() {
      this.relationInfo = await room.getRelation(this.relationId)
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$nextTick(() => {
          this.loading = true
        })

        let vm = this

        if (this.relationId == 0) {
          room.insertRelation(this.relationInfo).then(res => {
            if (res.success == 0) {
              vm.$store.commit('alertSuccess', '修改成功')
              vm.loading = false
              vm.$emit('close')
              vm.dialog = false
            } else {
              vm.$store.commit('alertError', '修改失败')
              vm.loading = false
            }
          })
        } else {
          room.updateRelation(this.relationInfo).then(res => {
            if (res.success == 0) {
              vm.$store.commit('alertSuccess', '修改成功')
              vm.loading = false
              vm.$emit('close')
              vm.dialog = false
            } else {
              vm.$store.commit('alertError', '修改失败')
              vm.loading = false
            }
          })
        }
      }
    }
  }
}
</script>
