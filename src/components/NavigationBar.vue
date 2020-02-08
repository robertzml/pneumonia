<template>
  <v-list dense>
    <v-list-item :to="{ name: 'lihu' }">
      <v-list-item-content>
        <v-list-item-title>
          蠡湖家园
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item :to="{ name: 'young' }">
      <v-list-item-content>
        <v-list-item-title>
          青教公寓
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      items: []
    }
  },
  methods: {
    navTo: function(item) {
      this.$router.push({ name: item.name })
    }
  },
  mounted: function() {}
}
</script>
