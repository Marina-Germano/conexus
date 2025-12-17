<script setup>
import AlunoNavbar from '@/components/aluno/AlunoNavbar.vue';
import AlunoSidebar from '@/components/aluno/AlunoSidebar.vue';

import FinanceiroAluno from '@/components/aluno/FinanceiroAluno.vue';
</script>

<template>
    <AlunoNavbar />
    <AlunoSidebar />
    <v-app>
        <div class="aluno-financeiro-page">
            <FinanceiroAluno/>
        </div>
    </v-app>
</template>