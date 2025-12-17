<script setup>
    import FuncionarioTable from '@/components/admin/FuncionarioTable.vue'; 
    import AdminNavbar from '@/components/admin/AdminNavbar.vue';
    import AdminSidebar from '@/components/admin/AdminSidebar.vue';
    
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <div class="pa-4">
        <FuncionarioTable />
    </div>
</template>
