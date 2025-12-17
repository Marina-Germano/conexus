<script setup>
import EmprestimoMaterialForm from '@/components/admin/EmprestimoMaterialForm.vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';

</script>

<template>
    <AdminNavbar />
    <AdminSidebar />
    <div class="pa-4">
        <EmprestimoMaterialForm :is-editing="isEditing" />
    </div>
</template>

<style scoped>
/* Você pode adicionar estilos específicos de layout aqui se precisar */
</style>