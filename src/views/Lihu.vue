<template>
  <v-row dense>
    <v-col cols="12"> </v-col>
  </v-row>
</template>

<script>
import room from '@/controllers/room'

export default {
  name: 'Lihu',
  data: () => ({
    roomList: []
  }),
  methods: {
    async loadRooms() {
      this.roomList = await room.list()
    }
  },
  mounted: function() {
    this.loadRooms()
  }
}
</script>
