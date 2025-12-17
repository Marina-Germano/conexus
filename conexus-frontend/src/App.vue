<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const rotasSemCabecalho = ['login', 'register']; 
const showFullLayout = computed(() => {
    return !rotasSemCabecalho.includes(route.name);
});
</script>

<template>
  <v-app>
    <template v-if="showFullLayout">
      <v-main>
        <router-view /> </v-main>
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>