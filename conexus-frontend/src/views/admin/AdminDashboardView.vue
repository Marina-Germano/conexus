<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import DashboardContent from '@/components/admin/DashboardContent.vue';
</script>


<template>

        <AdminSidebar />
        <AdminNavbar />
    <v-app>
        <div class="student-bulletin-page">
            <DashboardContent />
        </div>
    </v-app>
</template>

<style scoped>
.bg-grey-lighten-2 {
    background-color: #e5e5e5 !important;
}
</style>