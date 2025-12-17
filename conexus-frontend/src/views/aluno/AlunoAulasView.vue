<script setup>
// Componentes de Layout
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

// Componente de Conteúdo (Novo nome baseado na sua instrução)
import CalendarioAluno from '@/components/aluno/CalendarioAluno.vue'; 
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-aulas-page">
            <CalendarioAluno />
        </div>
    </v-app>
</template>