<script>
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
import PresencaProfessor from'@/components/professor/PresencaProfessor.vue';

</script>

<template>
    <v-app>
        <ProfessorSidebar />
        <ProfessorNavbar />
        <v-main>
            <v-container fluid class="pa-6">
                <PresencaProfessor/>
            </v-container>
        </v-main>
    </v-app>
</template>