<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFormaPagamentoStore } from '@/stores/formaPagamentoStores'; 
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore'; 

const formaPagamentoStore = useFormaPagamentoStore();
const alunoTurmaStore = useAlunoTurmaStore();

const SELECAO_INICIAL = '-- Todas as Transações --';

// --- Estado Reativo ---
const filtroCurso = ref(SELECAO_INICIAL);

// Usando formaPagamentoStore (Mantido)
const todasAsTransacoes = computed(() => formaPagamentoStore.transacoes);
const isLoading = computed(() => formaPagamentoStore.isLoading); 

const cabecalhos = ref([
    { title: 'Descrição', key: 'descricao' },
    { title: 'Vencimento', key: 'vencimento', align: 'start' },
    { title: 'Valor', key: 'valor', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Ações', key: 'acoes', align: 'center', sortable: false },
]);

// 1. CORREÇÃO CRÍTICA DO ERRO 'map': USANDO (?? [])
const cursosDisponiveis = computed(() => [
    SELECAO_INICIAL,
    ...(alunoTurmaStore.cursos ?? []).map(c => c.nome), // <-- Correção aqui
    'Taxas Diversas' 
]);


// --- Lógica de Filtro e Status ---

const transacoesFiltradas = computed(() => {
    if (filtroCurso.value === SELECAO_INICIAL) {
        return todasAsTransacoes.value;
    }
    // Supondo que as transações na store têm um campo 'curso' para filtragem
    return todasAsTransacoes.value.filter(t => t.curso === filtroCurso.value);
});

const getCorStatus = (status) => {
    switch (status) {
        case 'Pago':
            return 'success';
        case 'Aberto':
            return 'primary';
        case 'Atrasado':
            return 'error';
        default:
            return 'grey';
    }
};

async function lidarComPagamento(transacao) {
    const confirmacao = confirm(`Você deseja iniciar o pagamento de ${transacao.valor} referente a ${transacao.descricao}?`);
    if (confirmacao) {
        // Usando formaPagamentoStore (Mantido)
        const sucesso = await formaPagamentoStore.iniciarPagamento(transacao.id);
        
        if (sucesso) {
            alert(`Pagamento de ${transacao.valor} iniciado com sucesso.`);
            // Após o pagamento, recarregamos as transações para atualizar o status
            await formaPagamentoStore.buscarTransacoes(); 
        } else {
            alert('Erro ao iniciar o pagamento. Tente novamente.');
        }
    }
}

onMounted(() => {
    alunoTurmaStore.exibir();
    formaPagamentoStore.exibir();
});
</script>

<template>
    <v-container fluid class="pa-6 altura-completa-conteudo" role="main">
        

        <v-divider class="mb-8"></v-divider>

        <v-card class="pa-4" elevation="4">
            
            <v-card-title class="headline">
                <v-icon left>mdi-cash-multiple</v-icon>
                Extrato de Transações
            </v-card-title>
            
            <v-divider class="mt-2"></v-divider>

            <div class="d-flex align-center my-4 flex-wrap">
                <span class="mr-4 text-h6 text-no-wrap">Filtrar por:</span>
                <v-select
                    :items="cursosDisponiveis"
                    v-model="filtroCurso"
                    label="Filtrar por Curso/Tipo"
                    variant="solo-filled"
                    density="compact"
                    hide-details
                    class="selecao-curso flex-grow-1"
                ></v-select>
            </div>

            <v-divider></v-divider>
            
            <div v-if="isLoading" class="text-center pa-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p class="mt-2">Carregando transações...</p>
            </div>

            <v-data-table
                v-else
                :headers="cabecalhos"
                :items="transacoesFiltradas"
                class="elevation-1 mt-4"
                no-data-text="Nenhuma transação encontrada."
            >
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="getCorStatus(item.status)"
                        density="compact"
                        label
                        class="font-weight-bold"
                    >
                        {{ item.status }}
                    </v-chip>
                </template>
                
                <template v-slot:item.acoes="{ item }">
                    <v-btn
                        v-if="item.status === 'Aberto' || item.status === 'Atrasado'"
                        color="error"
                        density="compact"
                        flat
                        @click="lidarComPagamento(item)"
                    >
                        Pagar
                    </v-btn>
                    <v-icon v-else color="success">mdi-check-circle</v-icon>
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
</style>