<script setup>
import EmprestimoMaterialTable from '@/components/admin/EmprestimoMaterialTable.vue'; 
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <div class="pa-4"> 
        <EmprestimoMaterialTable />
    </div>
</template>

<style scoped>

</style>