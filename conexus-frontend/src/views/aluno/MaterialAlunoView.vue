<script setup>
// Componentes de Layout
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

// Componente de Conteúdo
import MaterialContent from '@/components/aluno/AlunoMaterial.vue'; 
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-materiais-page">
            <MaterialContent />
        </div>
    </v-app>
</template>