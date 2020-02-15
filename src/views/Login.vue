<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card class="elevation-12">
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>用户登录</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                label="用户名"
                autofocus
                prepend-icon="person"
                type="text"
                v-model="loginUser.userName"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" block @click.stop="submit" @keyup.enter.native="submit">登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'Login',
  data: () => ({
    valid: true,
    loginUser: {
      userName: ''
    },
    nameRules: [v => !!v || '请输入用户名']
  }),
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['getToken']),

    submit() {
      if (this.$refs.form.validate()) {
        // console.log(this.loginUser.userName)
        if (this.loginUser.userName.search(/张明亮|朱家聪|岳静|姜沁瑶|季文达/gi) > -1) {
          this.login(this.loginUser).then(() => {
            this.getToken()
            this.$router.push({ name: 'Home' })
          })
        }
      }
    }
  },
  mounted: function() {}
}
</script>
