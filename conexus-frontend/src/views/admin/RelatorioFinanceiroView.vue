<script setup>
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
// Importa o componente que contém toda a lógica, mock e o relatório
import RelatorioFinanceiroData from '@/components/admin/RelatorioFinanceiroData.vue';

</script>

<template>
    <v-app>
        <AdminSidebar />
        <AdminNavbar />

        <v-main>
            <div class="relatorio-financeiro-page">
                <RelatorioFinanceiroData />
            </div>
        </v-main>
    </v-app>
</template>