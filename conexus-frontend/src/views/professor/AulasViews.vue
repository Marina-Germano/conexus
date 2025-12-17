<script setup>
import AulasFrom from '@/components/professor/AulasFrom.vue';
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessotNavbar from '@/components/professor/ProfessotNavbar.vue';
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessotNavbar/>
        <v-main>
            <v-container fluid class="pa-6">
                <AulasFrom/>
            </v-container>
        </v-main>
    </v-app>
</template>