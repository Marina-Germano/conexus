<script setup>
// Componentes de Layout
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

// Componente de Conteúdo
import FormularioAluno from '@/components/aluno/FormularioAluno.vue'; 
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-contato-page">
            <FormularioAluno />
        </div>
    </v-app>
</template>