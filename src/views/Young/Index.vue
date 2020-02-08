<template>
  <v-sheet class="transparent">
    <v-row dense>
      <v-col cols="12">
        <v-slide-x-transition leave-absolute>
          <keep-alive>
            <component v-bind:is="tab"></component>
          </keep-alive>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import YoungList from './List'
import YoungEdit from './Edit'
import YoungDetails from './Details'

export default {
  name: 'YoungIndex',
  components: {
    YoungList,
    YoungEdit,
    YoungDetails
  },
  data: () => ({}),
  computed: {
    ...mapState({
      tab: state => state.young.tab
    })
  },
  methods: {
    ...mapMutations({
      refresh: 'young/refresh'
    }),

    ...mapActions({
      showList: 'young/showList'
    })
  },
  mounted: function() {
    this.showList()
  }
}
</script>
