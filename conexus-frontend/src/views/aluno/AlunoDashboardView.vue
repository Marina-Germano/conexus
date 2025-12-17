<script setup>
// Componentes de Layout
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

// Componente de Conteúdo (Mantendo o nome original do arquivo que enviaste)
import AlunoDashboardContent from '@/components/aluno/AlunoDashboardContent.vue'; 
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-dashboard-page">
            <AlunoDashboardContent />
        </div>
    </v-app>
</template>