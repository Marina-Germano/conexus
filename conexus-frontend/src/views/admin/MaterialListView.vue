<script setup>
    import MaterialTable from '@/components/admin/MaterialTable.vue'; 
    import AdminNavbar from '@/components/admin/AdminNavbar.vue';
    import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <div class="pa-4">
        <MaterialTable />
    </div>
</template>