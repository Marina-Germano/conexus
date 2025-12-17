<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEmprestimoMaterialStore } from '@/stores/emprestimoMaterialStores'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const emprestimoStore = useEmprestimoMaterialStore();

// --- Lógica de Modal para Exclusão ---
const showDeleteModal = ref(false);
const emprestimoToDelete = ref(null);
const isDeleting = ref(false);

// Definição das colunas da tabela
const headers = [
    { title: ' Empréstimo', key: 'idemprestimo', width: '8%', align: 'left' },
    { title: ' Aluno', key: 'idaluno', width: '10%', align: 'left' }, 
    { title: 'Material', key: 'idmaterial', width: '10%', align: 'left' }, 
    { title: 'Data Empréstimo', key: 'dataEmprestimo', width: '12%', align: 'left' },
    { title: 'Devolução Prevista', key: 'devolucaoPrevista', width: '13%', align: 'left' },
    { title: 'Data Devolvido', key: 'dataDevolvido', width: '13%', align: 'left' },
    { title: 'Status', key: 'status', width: '10%', align: 'left' },
    { title: 'Valor Multa', key: 'valorMulta', width: '8%', align: 'left' },
    { title: 'Ações', key: 'actions', width: '16%', align: 'center' },
];

// Mapeamento de largura para uso no cabeçalho customizado
const columnWidths = headers.reduce((acc, header) => {
    acc[header.key] = header.width;
    return acc;
}, {});

function getColumnWidth(key) {
    return columnWidths[key] || 'auto';
}

const emprestimos = computed(() => emprestimoStore.emprestimos); 
const isLoading = computed(() => emprestimoStore.isLoading); 

onMounted(() => {
    emprestimoStore.exibir(); 
});

function goToCadastro() {
    router.push({ name: 'CadastrarEmprestimo' });
}

function editarEmprestimo(item) {
    router.push({ name: 'EditarEmprestimo', params: { id: item.idemprestimo } });
}

function confirmDelete(item) {
    emprestimoToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteEmprestimo() {
    if (!emprestimoToDelete.value) return;

    isDeleting.value = true;
    const id = emprestimoToDelete.value.idemprestimo;
    
    try {
        const sucesso = await emprestimoStore.apagar(id); 
        
        if (!sucesso) {
            console.error("Falha ao excluir o empréstimo.");
        }
    } catch (error) {
        console.error("Erro durante a exclusão:", error);
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
        emprestimoToDelete.value = null;
    }
}

const formatarData = (data) => {
    if (!data) return 'N/A';
    try {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    } catch {
        return 'Data Inválida';
    }
}
</script>

<template>
    <v-card class="emprestimo-container ml-4" max-width="1500" elevation="6"> 
        <v-container fluid class="pa-0">
            
            <v-toolbar color="orange-darken-1" density="compact" class="header-toolbar-orange">
                <v-toolbar-title class="text-white font-weight-bold ml-2">Empréstimos de Material</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn 
                    color="white" 
                    variant="outlined" 
                    prepend-icon="mdi-plus" 
                    class="text-white font-weight-bold text-none" 
                    @click="goToCadastro"
                    elevation="0"
                    size="small"
                >
                    Novo Empréstimo
                </v-btn>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="emprestimos" 
                item-key="idemprestimo"
                :loading="isLoading"
                class="elevation-0 emprestimo-table"
                :items-per-page="-1" 
                hide-default-footer
                hide-default-header 
                loading-text="Carregando dados, por favor aguarde..."
            >
                <template #top>
                    <v-sheet class="custom-header-columns-light text-grey-darken-3">
                        <div class="d-flex align-center"> 
                            <span 
                                v-for="header in headers" 
                                :key="header.key" 
                                class="text-uppercase font-weight-bold text-caption" 
                                :style="{ 
                                    width: getColumnWidth(header.key), 
                                    textAlign: header.align === 'center' ? 'center' : 'left' 
                                }"
                            >
                                {{ header.title }}
                            </span>
                        </div>
                    </v-sheet>
                </template>
                
                <template #item="{ item }">
                    <tr class="table-row">
                        <td :style="{ width: columnWidths.idemprestimo }" class="text-left">{{ item.idemprestimo }}</td>
                        <td :style="{ width: columnWidths.idaluno }" class="text-left">{{ item.idaluno }}</td> 
                        <td :style="{ width: columnWidths.idmaterial }" class="text-left">{{ item.idmaterial }}</td> 
                        <td :style="{ width: columnWidths.dataEmprestimo }" class="text-left">
                            {{ formatarData(item.dataEmprestimo) }}
                        </td>
                        <td :style="{ width: columnWidths.devolucaoPrevista }" class="text-left">
                            {{ formatarData(item.devolucaoPrevista) }}
                        </td>
                        <td :style="{ width: columnWidths.dataDevolvido }" class="text-left">
                            {{ item.dataDevolvido ? formatarData(item.dataDevolvido) : 'Pendente' }}
                        </td>
                        <td :style="{ width: columnWidths.status }" class="text-left">{{ item.status }}</td>
                        <td :style="{ width: columnWidths.valorMulta }" class="text-left">R$ {{ (item.valorMulta || 0).toFixed(2).replace('.', ',') }}</td>
                        
                        <td :style="{ width: columnWidths.actions }" class="text-center">
                            <v-btn 
                                color="warning" 
                                size="small"
                                class="mr-2 text-none font-weight-bold" 
                                @click="editarEmprestimo(item)"
                                variant="flat" >
                                Editar
                            </v-btn>

                            <v-btn 
                                color="error" 
                                size="small"
                                class="text-none font-weight-bold" 
                                @click="confirmDelete(item)"
                                variant="flat" >
                                Excluir
                            </v-btn>
                        </td>
                    </tr>
                </template>
                
                <template #no-data>
                    <div class="pa-4 text-center" v-if="!isLoading">
                        <v-icon size="40" color="grey-lighten-1">mdi-book-open-variant-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum empréstimo encontrado.</p>
                    </div>
                </template>

            </v-data-table>
        </v-container>
    </v-card>

    <v-dialog v-model="showDeleteModal" max-width="400">
        <v-card>
            <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza de que deseja excluir o empréstimo ID 
                <span class="font-weight-bold">{{ emprestimoToDelete?.idemprestimo }}</span>?
                Esta ação é irreversível.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="showDeleteModal = false" :disabled="isDeleting">
                    Cancelar
                </v-btn>
                <v-btn color="error" variant="flat" @click="deleteEmprestimo" :loading="isDeleting">
                    Excluir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.emprestimo-container {
    border-radius: 8px;
    max-width: 1500px; 
}
.header-toolbar-orange {
    border-radius: 8px 8px 0 0 !important; 
}
/* Estilos para o cabeçalho customizado da tabela */
.custom-header-columns-light {
    border-bottom: 1px solid #ddd; 
    padding: 0; 
}
.custom-header-columns-light .d-flex span {
    padding: 12px 16px !important; 
}

.emprestimo-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}
.emprestimo-table :deep(.v-data-table__thead) {
    display: none; 
}
.emprestimo-table :deep(td:last-child) {
    text-align: center;
}
</style>