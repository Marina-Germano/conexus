<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

    const router = useRouter();
    const funcionarioStore = useFuncionarioStore();

    // --- Lógica de Modal para Exclusão ---
    const showDeleteModal = ref(false);
    const funcionarioToDelete = ref(null);
    const isDeleting = ref(false);

    // Definição das colunas da tabela COM largura para o cabeçalho customizado
    const headers = [
        { title: 'Nome', key: 'name', width: '40%', align: 'start' },
        { title: 'CPF', key: 'cpf', width: '25%', align: 'start' },
        { title: 'Cargo', key: 'role', width: '25%', align: 'start' },
        { title: 'Ações', key: 'actions', width: '10%', align: 'center', sortable: false },
    ];

    // Mapeamento de largura para uso na função getColumnWidth
    const columnWidths = headers.reduce((acc, header) => {
        acc[header.key] = header.width;
        return acc;
    }, {});

    function getColumnWidth(key) {
        return columnWidths[key] || 'auto';
    }


    // Obtém o estado de carregamento do store
    const isLoading = computed(() => funcionarioStore.isLoading); 

    // Carrega os funcionários
    onMounted(async () => {
        await funcionarioStore.exibir();
        console.log(funcionarioStore.funcionarios);
    });

    function addNewFuncionario() {
        router.push({ name: 'FuncionarioRegister' });
    }

    // Usando rota nomeada para seguir o padrão
    function editFuncionario(item) {
        router.push({ name: 'FuncionarioEdit', params: { id: item.id } });
    }

    function confirmDelete(item) {
        funcionarioToDelete.value = item;
        showDeleteModal.value = true;
    }

    async function deleteFuncionario() {
        if (funcionarioToDelete.value && funcionarioToDelete.value.id) {
            isDeleting.value = true;
            
            const sucesso = await funcionarioStore.apagarFuncionario(funcionarioToDelete.value.id);

            if (sucesso) {
                console.log('Funcionário excluído com sucesso:', funcionarioToDelete.value.name);
            } else {
                console.error('Falha ao excluir o funcionário.');
            }

            isDeleting.value = false;
            showDeleteModal.value = false;
            funcionarioToDelete.value = null;
        }
    }
</script>

<template>
    <v-card class="funcionario-container" max-width="3000" elevation="6"> 
        <v-container fluid class="pa-0">
            
            <v-data-table
                :headers="headers"
                :items="funcionarioStore.funcionarios" 
                item-key="id"
                :loading="isLoading"
                class="elevation-0 funcionario-table"
                :items-per-page="-1" 
                hide-default-footer
                hide-default-header 
                loading-text="Carregando dados, por favor aguarde..."
            >
                <template #top>
                    
                    <v-toolbar color="orange-darken-1" density="compact" class="header-toolbar-orange">
                        <v-toolbar-title class="text-h6 font-weight-bold text-white ml-2"> Funcionários</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn 
                            color="white" 
                            variant="outlined" 
                            class="text-white font-weight-bold text-none" 
                            @click="addNewFuncionario"
                            elevation="0"
                            size="small"
                        >
                            <v-icon left>mdi-plus</v-icon>
                            Novo Funcionário
                        </v-btn>
                    </v-toolbar>

                    <v-sheet class="custom-header-columns-light text-grey-darken-3">
                        <div class="d-flex align-center"> 
                            <span 
                                v-for="header in headers" 
                                :key="header.key" 
                                class="text-uppercase font-weight-bold text-caption py-2" 
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
                        <td :style="{ width: getColumnWidth('name') }" class="text-left">{{ item.idusuario }}</td>
                        <td :style="{ width: getColumnWidth('cpf') }" class="text-left">{{ item.idfuncionario }}</td>
                        <td :style="{ width: getColumnWidth('role') }" class="text-left">{{ item.cargo }}</td>
                        
                        <td :style="{ width: getColumnWidth('actions') }" class="text-center">
                            <v-btn 
                                color="warning" 
                                size="small"
                                class="mr-2 text-none font-weight-bold" 
                                @click="editFuncionario(item)"
                            >
                                Editar
                            </v-btn>

                            <v-btn 
                                color="error" 
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
                        <v-icon size="40" color="grey-lighten-1">mdi-account-group-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum funcionário encontrado. Cadastre o primeiro!</p>
                    </div>
                </template>

            </v-data-table>
        </v-container>
    </v-card>

    <v-dialog v-model="showDeleteModal" max-width="400">
        <v-card>
            <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza de que deseja excluir o funcionário 
                <span class="font-weight-bold">{{ funcionarioToDelete?.name }}</span>?
                Esta ação é irreversível.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="showDeleteModal = false" :disabled="isDeleting">
                    Cancelar
                </v-btn>
                <v-btn color="error" variant="flat" @click="deleteFuncionario" :loading="isDeleting">
                    Excluir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
/* Estilo para o Card principal */
.funcionario-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

/*  BARRA SUPERIOR LARANJA (v-toolbar) */
.header-toolbar-orange {
    border-radius: 8px 8px 0 0 !important; 
}

/*  CABEÇALHO DAS COLUNAS (v-sheet) */
.custom-header-columns-light {

    border-bottom: 1px solid #ddd; 
    padding: 0 16px; 
}

/* Garante que o span da coluna tenha o padding necessário */
.custom-header-columns-light .d-flex span {
    padding-left: 16px; 
    padding-right: 16px;
}

.funcionario-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}

/* Remove a borda inferior do cabeçalho da tabela padrão */
.funcionario-table :deep(.v-data-table__thead) {
    display: none; 
}

/* Ajuste fino na coluna de ações para centralizar os botões */
.funcionario-table :deep(td:last-child) {
    text-align: center;
}
</style>