<script setup>
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import ReportTableMaterials from '@/components/admin/RelatorioMateriais.vue'; 
</script>

<template>
    <v-app>
        <AdminSidebar />
        <AdminNavbar style="z-index: 999;" /> 

        <v-main>
            <div class="relatorio-materiais-page">
                <ReportTableMaterials />
            </div>
        </v-main>
    </v-app>
</template>

<style scoped>
/* Estilos específicos para a página, como padding */
.relatorio-materiais-page {
    padding: 24px; /* Exemplo de espaçamento */
}
</style>
