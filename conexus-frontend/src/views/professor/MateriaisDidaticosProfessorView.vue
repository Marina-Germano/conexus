<script setup>

import MateriaisDidaticosProfessor from '@/components/professor/MateriaisDidaticosProfessor.vue'; 
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessotNavbar from '@/components/professor/ProfessotNavbar.vue';
// Certifique-se que o caminho de importação está correto.
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessotNavbar/>
        <v-main>
            <v-container fluid class="pa-6">
                <MateriaisDidaticosProfessor/>
            </v-container>
        </v-main>
    </v-app>
</template>