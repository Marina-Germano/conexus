<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAvaliacaoStore } from '@/stores/avaliacaoStores'; 
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore'; 

// 2. MUDANÇA: Usando useAlunoTurmaStore e renomeando a constante
const alunoTurmaStore = useAlunoTurmaStore();
const avaliacaoStore = useAvaliacaoStore();

const SELECAO_INICIAL = '-- Selecione um Curso --';

// --- Estado Reativo (Carregado da Store) ---
const cursoSelecionado = ref(SELECAO_INICIAL);
const notasDoCurso = computed(() => avaliacaoStore.notas); 
const dadosCarregados = ref(false);
const isLoading = computed(() => avaliacaoStore.isLoading); 

// 3. CORREÇÃO CRÍTICA DO ERRO 'map': 
// Garante que alunoTurmaStore.cursos seja tratado como array vazio ([]) se for undefined/null 
const cursosDisponiveis = computed(() => [
    SELECAO_INICIAL, 
    ...(alunoTurmaStore.cursos ?? []).map(c => c.nome) 
]);

const cabecalhos = ref([
    { title: 'Disciplina', key: 'disciplina' },
    { title: 'Atividade', key: 'atividade' },
    { title: 'Data', key: 'data', align: 'end' },
    { title: 'Nota', key: 'nota', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
]);

const cursoEstaSelecionado = computed(() => cursoSelecionado.value !== SELECAO_INICIAL);

// --- Lógica de Filtro e Visualização ---

const getCorStatus = (status) => {
    switch (status) {
        case 'Aprovado':
            return 'success';
        case 'Recuperação':
            return 'warning';
        case 'Pendente':
            return 'info';
        case 'Reprovado':
            return 'error';
        default:
            return 'grey';
    }
};

async function visualizarBoletim() {
    if (cursoEstaSelecionado.value) {
        // 4. MUDANÇA: Usando alunoTurmaStore para encontrar o ID
        const cursoId = alunoTurmaStore.cursos.find(c => c.nome === cursoSelecionado.value)?.id;
        
        if (cursoId) {
            // Chamada à action usando avaliacaoStore (Correto da alteração anterior)
            const sucesso = await avaliacaoStore.buscarNotasPorCurso(cursoId); 
            dadosCarregados.value = sucesso;
        } else {
            dadosCarregados.value = false;
        }
    } else {
        dadosCarregados.value = false;
    }
}

onMounted(() => {
    // 5. CORREÇÃO CRÍTICA DO CARREGAMENTO: Chamada para popular a lista de cursos
    // Essa action deve ser responsável por buscar os dados do backend e popular alunoTurmaStore.cursos
    alunoTurmaStore.exibir(); 
});
</script>

<template>
    <v-container fluid class="pa-6 altura-completa-conteudo" role="main">

        <v-divider class="mb-8"></v-divider>

        <v-card class="pa-4" elevation="4">
            
            <v-card-title class="headline">
                <v-icon left>mdi-chart-bar</v-icon>
                Relatório de Notas
            </v-card-title>
            
            <v-divider class="mt-2"></v-divider>

            <div class="d-flex align-center my-4 flex-wrap">
                <span class="mr-4 text-h6 text-no-wrap">Escolha Um Curso:</span>
                <v-select 
                    :items="cursosDisponiveis" 
                    v-model="cursoSelecionado" 
                    label="-- Selecione um Curso --" 
                    variant="solo-filled" 
                    density="compact" 
                    hide-details 
                    class="selecao-curso flex-grow-1" 
                ></v-select>
                <v-btn 
                    color="primary" 
                    class="ml-2 mt-2 mt-sm-0 botao-ver-custom" 
                    @click="visualizarBoletim" 
                    :disabled="!cursoEstaSelecionado || isLoading"
                    :loading="isLoading"
                > 
                    Ver 
                </v-btn>
            </div>

            <v-divider></v-divider>

            <div v-if="isLoading" class="text-center pa-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p class="mt-2">Carregando notas...</p>
            </div>
            
            <div v-else-if="!dadosCarregados" class="text-red-darken-1 text-subtitle-1 mt-4 text-center pa-4">
                <v-icon color="red">mdi-alert-circle</v-icon>
                Por favor, escolha um curso e clique em "Ver" para carregar as notas.
            </div>

            <v-data-table 
                v-else 
                :headers="cabecalhos" 
                :items="notasDoCurso" 
                class="elevation-1 mt-4" 
                no-data-text="Nenhuma nota encontrada para este curso."
            >
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getCorStatus(item.status)" density="compact" label class="font-weight-bold"> 
                        {{ item.status }} 
                    </v-chip>
                </template>

                <template v-slot:bottom>
                    <div class="text-center pa-4 text-subtitle-2 font-weight-bold">
                        A Média Final é calculada após a conclusão de todas as atividades.
                    </div>
                </template>
            </v-data-table>

        </v-card>
    </v-container>
</template>

<style scoped>
.selecao-curso {
    max-width: 350px;
}
.altura-completa-conteudo {
    min-height: calc(100vh - 64px); 
}

/* GARANTIA DE COR PARA O BOTÃO 'VER' */
.botao-ver-custom.v-btn {
    /* Fundo: Azul/Verde-água solicitado */
    background-color: #2fa99e !important;
    /* Texto: Branco */
    color: white !important;
}

.botao-ver-custom.v-btn:hover {
    /* Um tom um pouco mais escuro no hover */
    background-color: #248a7f !important; 
    color: white !important;
}

.botao-ver-custom.v-btn:disabled {
    /* Mantém a cor primária com transparência quando desabilitado */
    background-color: rgba(47, 169, 158, 0.4) !important; 
    color: rgba(255, 255, 255, 0.7) !important;
}
</style>