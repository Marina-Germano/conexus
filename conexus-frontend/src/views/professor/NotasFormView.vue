<script setup>
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
import NotasForm from '@/components/professor/NotasForm.vue';

</script>

<template>
    <v-app>
        <ProfessorSidebar />
        <ProfessorNavbar />
        <v-main>
            <v-container fluid class="pa-6">
                <NotasForm/>
            </v-container>
        </v-main>
    </v-app>
</template>