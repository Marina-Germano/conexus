<script setup>
import { useTheme } from 'vuetify';
import { useDark } from '@vueuse/core';
import AdminNavbar from '@/components/AdminNavbar.vue';
const theme = useTheme();

// 🎯 1. Usar useDark
// Ele adiciona a classe 'dark' ao <html> ou <body> automaticamente.
const isDark = useDark();

// 🎯 2. Criar um watcher mais simples para SINCRONIZAR O VUETIFY
// (Opcional, mas garante que o tema Vuetify siga o useDark)
watch(isDark, (newValue) => {
    theme.global.name.value = newValue ? 'dark' : 'light';
}, { immediate: true });

// O useDark do Vueuse é mais confiável para aplicar a classe 'dark' ao body.
</script>

<template>
    <AdminNavbar />
    <v-app class="bg-background"> 
        <v-main class="bg-background">
            
        </v-main>
    </v-app>
</template>