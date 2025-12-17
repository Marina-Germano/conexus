<script setup>
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
import TurmasProfessor from '@/components/professor/TurmasProfessor.vue'; 

// Variáveis reativas (ref, router.push, etc.) foram removidas do script da View.
</script>

<template>
    <v-app>
        <ProfessorSidebar />
        <ProfessorNavbar />
        <v-main>
            <v-container fluid class="pa-6">
                <TurmasProfessor />
            </v-container>
        </v-main>
    </v-app>
</template>