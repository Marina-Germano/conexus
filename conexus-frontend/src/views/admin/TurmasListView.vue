<script setup>

import TurmasTable from '@/components/admin/TurmasTable.vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <div class="pa-4">
        <TurmasTable />
    </div>
</template>

<style scoped>

</style>

