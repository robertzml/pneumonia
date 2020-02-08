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
import LihuList from './List'
import LihuEdit from './Edit'
import LihuDetails from './Details'

export default {
  name: 'LihuIndex',
  components: {
    LihuList,
    LihuEdit,
    LihuDetails
  },
  data: () => ({}),
  computed: {
    ...mapState({
      tab: state => state.lihu.tab
    })
  },
  methods: {
    ...mapMutations({
      refresh: 'lihu/refresh'
    }),

    ...mapActions({
      showList: 'lihu/showList'
    })
  },
  mounted: function() {
    this.showList()
  }
}
</script>
