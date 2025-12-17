<script setup>
    import FuncionarioForm from '@/components/admin/FuncionarioForm.vue'; 
    import AdminNavbar from '@/components/admin/AdminNavbar.vue';
    import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <v-container fluid>
        <FuncionarioForm />
    </v-container>
</template>