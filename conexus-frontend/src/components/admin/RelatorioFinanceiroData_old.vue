<script setup>
import { ref, computed, onMounted } from 'vue'; // Importado onMounted
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';

// --- IMPORTS DOS STORES ---
import { useAlunoStore } from '@/stores/alunoStore'; //
import { useFormaPagamentoStore } from '@/stores/formaPagamentoStores';
// Novo Store (Assumindo que você criou)
//import { useFinanceiroStore } from '@/stores/financeiroStore'; 

// Outros Stores (Comentados para referência futura)
/* import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';
// ... (outros stores) ...
*/


const router = useRouter();

// --- INICIALIZAÇÃO DOS STORES ---
const alunoStore = useAlunoStore(); //
const formaPagamentoStore = useFormaPagamentoStore(); //
const financeiroStore = useFinanceiroStore(); // Novo Store

// Outras inicializações (Comentadas para referência futura)
/*
const alunoTurmaStore = useAlunoTurmaStore();
// ... (outras inicializações) ...
*/


// --- PROPS ---
const props = defineProps({
    pageTitle: {
        type: String,
        default: 'Relatório Financeiro'
    },
    // Mantendo a prop por compatibilidade, mas o foco é usar o Store
    financialData: {
        type: Array,
        default: () => []
    }
});

// --- 1. DADOS E ESTRUTURA ---
const reportContent = ref(null);

// **Ajuste:** Se você vai usar o Store, o `financialData` deve ser um computed do Store.
// Usamos o Store como a principal fonte de dados, mas caímos na prop se o Store estiver vazio (fallback).
const reportData = computed(() => {
    // Retorna os dados do Store se existirem, senão usa a Prop (como fallback ou teste)
    return financeiroStore.movimentacoesFinanceiras.length > 0
        ? financeiroStore.movimentacoesFinanceiras
        : props.financialData;
});


// Definição dos cabeçalhos da tabela principal
const headers = [
    { title: 'Aluno', key: 'studentId' },
    { title: 'Valor', key: 'value' },
    { title: 'Data Vencimento', key: 'dueDate' },
    { title: 'Status', key: 'status' },
    { title: 'Data Pagamento', key: 'paymentDate' },
    { title: 'Multa', key: 'fine' },
    { title: 'Valor Total Pago', key: 'totalPaid' },
];

// Cálculo dos totais (agora usando computed properties baseadas em `reportData`)
const totalFines = computed(() => {
    return reportData.value.reduce((acc, item) => acc + item.fine, 0);
});

const totalPaid = computed(() => {
    return reportData.value.reduce((acc, item) => acc + item.totalPaid, 0);
});


// --- 2. LÓGICA DE AÇÕES ---

/**
 * Função para gerar e baixar o PDF do conteúdo do relatório.
 */
const generatePDF = () => {
    // ... (função generatePDF permanece a mesma) ...
    if (!reportContent.value) {
        console.error('O elemento de conteúdo do relatório não foi encontrado.');
        return;
    }

    const options = {
        margin: 10,
        filename: 'relatorio_financeiro_' + new Date().toISOString().slice(0, 10) + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(reportContent.value).set(options).save();
};

/**
 * Função para Cancelar (Volta para a Dashboard/Página anterior).
 */
function cancelForm() {
    router.push('/admin/dashboard'); 
}

// --- 3. LIFECYCLE HOOKS ---

onMounted(() => {
    // Carrega os dados financeiros ao montar o componente
    financeiroStore.buscarDadosFinanceiros(); 
    // Você pode carregar outros dados necessários, como nomes de alunos
    // alunoStore.exibir(); 
});
</script>

<template>
    <v-container fluid class="pa-6" role="main">
        <v-card class="mx-auto" elevation="2" rounded="lg"> 
            
            <v-toolbar color="orange-darken-1" density="compact" flat class="mb-0 rounded-b-0">
                <v-toolbar-title class="text-white font-weight-bold ml-2">{{ props.pageTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon color="white" @click="cancelForm">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container>
                
                <div ref="reportContent" class="pa-4 bg-white report-content-area">
                    
                    <v-table v-if="reportData.length > 0" density="comfortable" class="report-table">
                        <thead>
                            <tr class="bg-orange-lighten-4">
                                <th v-for="header in headers" :key="header.key" class="text-left font-weight-bold text-black">
                                    {{ header.title }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in reportData" :key="item.studentId">
                                <td>{{ item.studentId }}</td>
                                <td>R$ {{ item.value.toFixed(2).replace('.', ',') }}</td>
                                <td>{{ item.dueDate }}</td>
                                <td>{{ item.status }}</td>
                                <td>{{ item.paymentDate }}</td>
                                <td>R$ {{ item.fine.toFixed(2).replace('.', ',') }}</td>
                                <td>R$ {{ item.totalPaid.toFixed(2).replace('.', ',') }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5"></td>
                                <td class="text-right font-weight-bold">Total Multas:</td>
                                <td class="font-weight-bold">R$ {{ totalFines.toFixed(2).replace('.', ',') }}</td>
                            </tr>
                            <tr>
                                <td colspan="5"></td>
                                <td class="text-right font-weight-bold">Total Pago:</td>
                                <td class="font-weight-bold">R$ {{ totalPaid.toFixed(2).replace('.', ',') }}</td>
                            </tr>
                        </tfoot>
                    </v-table>
                    
                    <v-row v-else align="center" justify="center" class="py-12 text-center">
                        <v-col cols="12">
                            <v-icon size="48" color="grey-lighten-1">mdi-currency-usd-off</v-icon>
                            <p class="text-subtitle-1 text-grey-darken-1 mt-2">
                                Nenhum registro financeiro encontrado.
                            </p>
                        </v-col>
                    </v-row>
                </div>
                
                <v-divider class="my-4"></v-divider>
                
                <v-row justify="start" class="pt-2 pb-4 px-3">
                    <v-col cols="12" sm="auto">
                        <v-btn
                            color="orange-darken-1"
                            class="text-white font-weight-bold text-none"
                            prepend-icon="mdi-file-download"
                            @click="generatePDF"
                            :disabled="reportData.length === 0"
                            size="large" 
                            elevation="2"
                        >
                            Exportar para PDF
                        </v-btn>
                    </v-col>
                    
                    <v-col cols="12" sm="auto">
                        <v-btn
                            @click="cancelForm"
                            block 
                            variant="text" 
                            color="grey-darken-1" 
                            size="large"
                            prepend-icon="mdi-close-circle-outline"
                        >
                            Cancelar
                        </v-btn>
                    </v-col>
                </v-row>
                
            </v-container>
        </v-card>
    </v-container>
</template>

<style scoped>
/* Estilos para garantir o visual limpo do relatório */
.report-table {
  width: 100%;
  border-collapse: collapse;
}
.report-table th, .report-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.report-content-area {
    min-height: 400px;
    border: 1px solid #eee; /* Borda sutil para diferenciar a área de impressão */
}
</style>