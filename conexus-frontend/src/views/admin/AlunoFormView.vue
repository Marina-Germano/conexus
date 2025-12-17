<script setup>
import AlunoForm from '@/components/admin/AlunoForm.vue'; 
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';

</script>

<template>

        <AdminSidebar />
        <AdminNavbar />
    <v-app>
        <div class="student-bulletin-page">
            <AlunoForm />
        </div>
    </v-app>
</template>

