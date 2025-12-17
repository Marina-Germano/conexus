<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMaterialStore } from '@/stores/materialStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const materialStore = useMaterialStore();

// --- Lógica de Modal para Exclusão ---
const showDeleteModal = ref(false);
const materialToDelete = ref(null);
const isDeleting = ref(false);

// Definição das colunas da tabela com a largura necessária para o cabeçalho customizado
const headers = [
    { title: 'Título', key: 'titulo', width: '25%', align: 'left' },
    { title: 'Tipo', key: 'tipoMaterial', width: '15%', align: 'left' },
    { title: 'Idioma', key: 'idioma', width: '15%', align: 'left' },
    { title: 'Nível', key: 'nivel', width: '15%', align: 'left' },
    { title: 'Quantidade', key: 'quantidade', width: '10%', align: 'left' },
    { title: 'Cadastro', key: 'dataCadastro', width: '10%', align: 'left' },
    { title: 'Ações', key: 'actions', width: '10%', align: 'center' },
];

// Mapeamento de largura para uso no cabeçalho customizado
const columnWidths = headers.reduce((acc, header) => {
    acc[header.key] = header.width;
    return acc;
}, {});

// FUNÇÃO ESSENCIAL para o cabeçalho CUSTOMIZADO (necessário para o slot #top)
function getColumnWidth(key) {
    return columnWidths[key] || 'auto';
}

const materiais = computed(() => materialStore.materiais);
const isLoading = computed(() => materialStore.isLoading);

onMounted(() => {
    materialStore.exibir();
});

function goToCadastro() {
    router.push({ name: 'CadastrarMaterial' });
}

function editarMaterial(item) {
    router.push({ name: 'EditarMaterial', params: { id: item.idmaterial } });
}

function confirmDelete(item) {
    materialToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteMaterial() {
    if (!materialToDelete.value) return;

    isDeleting.value = true;
    const id = materialToDelete.value.idmaterial;
    
    try {
        const sucesso = await materialStore.apagarMaterial(id);
        
        if (!sucesso) {
            console.error("Falha ao excluir o material.");
        }
    } catch (error) {
        console.error("Erro durante a exclusão:", error);
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
        materialToDelete.value = null;
    }
}
</script>

<template>
    <v-card class="material-container ml-4" max-width="1500" elevation="6"> 
        <v-container fluid class="pa-0">
            <v-toolbar color="orange-darken-1" density="compact" class="header-toolbar-orange">
                <v-toolbar-title class="text-white font-weight-bold ml-2">Materiais</v-toolbar-title>
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
                    Novo Material
                </v-btn>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="materiais" 
                class="elevation-0 material-table" item-key="idmaterial"
                :loading="isLoading"
                loading-text="Carregando dados, por favor aguarde..."
                hide-default-header
                hide-default-footer
                :items-per-page="-1" 
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
                        <td :style="{ width: columnWidths.titulo }" class="text-left">{{ item.titulo }}</td>
                        
                        <td :style="{ width: columnWidths.tipoMaterial }" class="text-left">
                            {{ item.tipoMaterial?.descricao || 'N/A' }}
                        </td>
                        <td :style="{ width: columnWidths.idioma }" class="text-left">
                            {{ item.idioma?.descricao || 'N/A' }}
                        </td>
                        <td :style="{ width: columnWidths.nivel }" class="text-left">
                            {{ item.nivel?.descricao || 'N/A' }}
                        </td>
                        
                        <td :style="{ width: columnWidths.quantidade }" class="text-left">{{ item.quantidade }}</td>
                        
                        <td :style="{ width: columnWidths.dataCadastro }" class="text-left">
                            {{ item.dataCadastro ? new Date(item.dataCadastro).toLocaleDateString('pt-BR') : 'N/A' }}
                        </td>
                        
                        <td :style="{ width: columnWidths.actions }" class="text-center">
                            <v-btn 
                                color="warning" 
                                variant="flat" 
                                size="small"
                                class="mr-2 text-none font-weight-bold" 
                                @click="editarMaterial(item)"
                            >
                                Editar
                            </v-btn>

                            <v-btn 
                                color="error" 
                                variant="flat" 
                                size="small"
                                class="text-none font-weight-bold" 
                                @click="confirmDelete(item)"
                            >
                                Excluir
                            </v-btn>
                            </td>
                    </tr>
                </template>
                
                <template #no-data>
                    <div class="pa-4 text-center" v-if="!isLoading">
                        <v-icon size="40" color="grey-lighten-1">mdi-book-open-page-variant-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum material encontrado. Cadastre o primeiro!</p>
                    </div>
                </template>

            </v-data-table>
        </v-container>
    </v-card>

    <v-dialog v-model="showDeleteModal" max-width="400">
        <v-card>
            <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza de que deseja excluir o material 
                <span class="font-weight-bold">{{ materialToDelete?.titulo }}</span>?
                Esta ação é irreversível.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="showDeleteModal = false" :disabled="isDeleting">
                    Cancelar
                </v-btn>
                <v-btn color="error" variant="flat" @click="deleteMaterial" :loading="isDeleting">
                    Excluir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
/* Estilo para o Card principal */
.material-container {
    border-radius: 8px;
    max-width: 1500px; 
    /* A margem de espaçamento lateral (ml-4) está na tag <v-card> */
}

/*  BARRA SUPERIOR LARANJA (v-toolbar) */
.header-toolbar-orange {
    border-radius: 8px 8px 0 0 !important; 
}

/*  CABEÇALHO DAS COLUNAS (v-sheet) - ESTILO PADRÃO ALUNO/MATERIAL */
.custom-header-columns-light {

    border-bottom: 1px solid #ddd; 
    padding: 0; 
}

/* Garante que o span da coluna tenha o padding necessário */
.custom-header-columns-light .d-flex span {
    padding: 12px 16px !important; 
}

.material-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}

/* Remove a borda inferior do cabeçalho da tabela padrão */
.material-table :deep(.v-data-table__thead) {
    display: none; 
}

/* Ajuste fino na coluna de ações para centralizar os botões */
.material-table :deep(td:last-child) {
    text-align: center;
}
</style>