<script setup>
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
import ProfessorDashboardt from '@/components/professor/ProfessorDashboard.vue'; 
</script>


<template>
        <ProfessorSidebar />
        <ProfessorNavbar />
    <v-app>
        <div class="aluno-dashboard-page">
            <ProfessorDashboardt />
        </div>
    </v-app>
</template>
