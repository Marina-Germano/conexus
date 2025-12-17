<script setup>
import TurmasForm from '@/components/admin/TurmasForm.vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <v-app>
        <AdminSidebar /> 
        
        <AdminNavbar /> 

        <v-main>
            <TurmasForm />
        </v-main>
    </v-app>
</template>

<style scoped>
/* Estilos de layout da página (se houver) */
</style>