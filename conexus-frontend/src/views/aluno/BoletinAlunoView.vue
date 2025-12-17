<script setup>
// Componentes de Layout
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

// Componente de Conteúdo
import BoletimAluno from '@/components/aluno/BoletimAluno.vue';
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-boletim-page">
            <BoletimAluno />
        </div>
    </v-app>
</template>