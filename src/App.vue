<script setup>
  import {RouterView} from 'vue-router';
</script>

<template>
  <v-app>
    <menuApp />
    <v-main>
      <RouterView/>
    </v-main>
    <rodapeApp/>
  </v-app>
</template>

<style scoped></style>
