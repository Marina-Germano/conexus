<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
// Importação CORRETA do Store de Materiais
import { useMaterialStore } from '@/stores/materialStore';

const router = useRouter();
const materialStore = useMaterialStore(); // Inicializa o Store
const isLoading = ref(true); // Estado de carregamento

// --- PROPS ---
// A prop 'materials' foi mantida, mas será ignorada internamente
// em favor dos dados buscados pelo Store.
const props = defineProps({
    pageTitle: {
        type: String,
        default: 'Relatório de Materiais'
    },
    materials: {
        type: Array,
        default: () => []
    }
});

// --- 1. DADOS E ESTRUTURA ---
const reportContent = ref(null);

const headers = [
    { title: 'Título', align: 'start', key: 'title' },
    { title: 'Quantidade', key: 'quantity' },
    { title: 'Formato do Arquivo', key: 'format' },
];

// Fonte de dados: Busca no Store e mapeia para o formato da tabela.
const reportMaterials = computed(() => {
    // Acessa o estado 'materiais' do Store
    if (!materialStore.materiais || materialStore.materiais.length === 0) {
        return [];
    }
    
    // Mapeamento: Store (titulo, quantidade, formatoarquivo) 
    // -> Tabela (title, quantity, format)
    return materialStore.materiais.map(item => ({
        title: item.titulo,
        quantity: item.quantidade,
        format: item.formatoarquivo,
    }));
});

// --- LIFECYCLE HOOKS: Busca os dados ao montar o componente ---
onMounted(async () => {
    isLoading.value = true;
    // Chama a action exibir() do Store
    await materialStore.exibir(); 
    isLoading.value = false;
});

// --- 2. LÓGICA DE AÇÕES ---
const generatePDF = () => {
    if (!reportContent.value) {
        console.error('O elemento de conteúdo do relatório não foi encontrado.');
        return;
    }

    const options = {
        margin: 10,
        filename: 'relatorio_de_materiais_' + new Date().toISOString().slice(0, 10) + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(reportContent.value).set(options).save();
};

function cancelForm() {
    router.push('/admin/dashboard'); 
}

</script>

<template>
    <v-card class="mx-auto" elevation="2" rounded="lg"> 
        
        <v-toolbar color="orange-darken-1" density="compact" flat class="mb-0 rounded-b-0">
            <v-toolbar-title class="text-white font-weight-bold ml-2">{{ props.pageTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon color="white" @click="cancelForm">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>

        <v-container>
            
            <v-row justify="center" v-if="isLoading" class="py-12 text-center">
                <v-col cols="12">
                    <v-progress-circular 
                        indeterminate 
                        color="orange-darken-1"
                        size="64"
                    ></v-progress-circular>
                    <p class="mt-4">Carregando dados do material...</p>
                </v-col>
            </v-row>

            <div v-else ref="reportContent" class="pa-4 bg-white report-content-area">
                
                <v-table v-if="reportMaterials.length > 0" density="comfortable" class="report-table">
                    <thead>
                        <tr class="bg-orange-lighten-4">
                            <th v-for="header in headers" :key="header.key" class="text-left font-weight-bold text-black">
                                {{ header.title }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reportMaterials" :key="item.title">
                            <td>{{ item.title }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.format }}</td>
                        </tr>
                    </tbody>
                </v-table>

                <v-row v-else align="center" justify="center" class="py-12 text-center">
                    <v-col cols="12">
                        <v-icon size="48" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">
                            Nenhum material encontrado.
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
                        :disabled="reportMaterials.length === 0"
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
/* Estilo para garantir que a área do PDF tenha fundo branco */
.report-content-area {
    min-height: 400px;
    border: 1px solid #eee; /* Borda sutil para diferenciar a área de impressão */
}
</style>