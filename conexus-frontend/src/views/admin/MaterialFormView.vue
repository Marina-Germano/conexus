<script setup>
    import MaterialForm from '@/components/admin/MaterialForm.vue'; 
    import AdminNavbar from '@/components/admin/AdminNavbar.vue';
    import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <v-container fluid>
        <MaterialForm />
    </v-container>
</template>