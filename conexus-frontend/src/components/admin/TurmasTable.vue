<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Stores necessárias
import { useTurmaStore } from '@/stores/turmaStore'; 
import { useIdiomaStore } from '@/stores/idiomaStores'; 
import { useNivelStore } from '@/stores/nivelStores'; 
import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

const router = useRouter();
const turmaStore = useTurmaStore(); 
const idiomaStore = useIdiomaStore(); 
const nivelStore = useNivelStore(); 
const funcionarioStore = useFuncionarioStore(); 

const isLoading = ref(true);

// Confirmação de exclusão
const showDeleteModal = ref(false);
const turmaToDelete = ref(null);
const isDeleting = ref(false);

// Mapeia os dias da semana de forma mais legível
const diasDaSemanaMap = {
    'S': 'Segunda',
    'T': 'Terça',
    'Q': 'Quarta',
    'R': 'Quinta',
    'X': 'Sexta',
    'B': 'Sábado',
};

// Mapeia e formata os dados das turmas para exibição na tabela
const turmasFormatadas = computed(() => {
    if (!turmaStore.turmas.length) {
        return [];
    }

    return turmaStore.turmas.map(item => {
        
        // Busca a descrição do Idioma/Disciplina
        const idiomaDescricao = idiomaStore.idiomas.find(i => 
            i.ididioma === item.iddisciplina)?.descricao || 'N/A'; //

        // Busca a descrição do Nível
        const nivelDescricao = nivelStore.niveis.find(n => 
            n.idnivel === item.idnivel)?.descricao || 'N/A'; //

        // Busca o Professor (Funcionario)
        const professor = funcionarioStore.funcionarios.find(f => 
            f.idfuncionario === item.idfuncionario)?.nome || 'Não Atribuído'; // Assumindo que o funcionário tem um campo 'nome'

        // Formata os dias da semana (ex: 'S,Q,X' -> 'Segunda, Quarta, Sexta')
        const diasFormatados = item.diassemana 
            ? item.diassemana.split(',').map(d => diasDaSemanaMap[d] || d).join(', ') 
            : 'N/A';
        
        // Formata a hora para HH:MM
        const horaFormatada = item.horainicio 
            ? item.horainicio.substring(0, 5) 
            : 'N/A';
            
        return {
            id: item.idturma,
            descricao: item.descricao,
            idioma: idiomaDescricao,
            nivel: nivelDescricao,
            professor: professor,
            sala: item.sala || 'N/A',
            diassemana: diasFormatados,
            horainicio: horaFormatada,
            capacidadeMaxima: item.capacidadeMaxima,
            // Adicione outros campos necessários aqui
        };
    });
});

// Headers da Tabela
const headers = ref([
    { title: 'Descrição', align: 'start', key: 'descricao' },
    { title: 'Sala', align: 'start', key: 'sala' },
    { title: 'Idioma', align: 'start', key: 'idioma' },
    { title: 'Nível', align: 'start', key: 'nivel' },
    { title: 'Professor', align: 'start', key: 'professor' },
    { title: 'Horário', align: 'start', key: 'horainicio' },
    { title: 'Ações', align: 'center', key: 'actions', sortable: false }, 
]);

// Função para definir a largura das colunas
const getColumnWidth = (key) => {
    if (key === 'actions') return '220px'; 
    if (key === 'descricao') return '25%'; 
    if (key === 'professor') return '15%';
    return '10%'; 
};

// --- Ações ---

function editTurma(item) {
    // Redireciona para o formulário de edição de turma
    router.push(`/admin/turmas/novo/${item.id}`);
}

function confirmDelete(item) {
    turmaToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteTurma() {
    if (turmaToDelete.value && turmaToDelete.value.id) {
        isDeleting.value = true;
        
        // Chama a ação apagar da Turma Store
        const sucesso = await turmaStore.apagar(turmaToDelete.value.id); //

        if (sucesso) {
             alert(`Turma "${turmaToDelete.value.descricao}" excluída com sucesso!`);
        } else {
             alert('Falha ao excluir a turma.');
        }

        isDeleting.value = false;
        showDeleteModal.value = false;
        turmaToDelete.value = null;
    }
}

// Redireciona para o formulário de cadastro de Nova Turma
function addNewTurma() {
    router.push('/admin/turmas/novo');
}


// --- Carregamento de Dados ---
onMounted(async () => {
    isLoading.value = true;
    await Promise.all([
        turmaStore.exibir(), //
        idiomaStore.exibir(), //
        nivelStore.exibir(), //
        funcionarioStore.exibir(), //
    ]); 
    isLoading.value = false;
});
</script>

<template>
    
    <v-card class="turma-container" max-width="3000" elevation="6"> 
        <v-container fluid class="pa-0">
            
            <v-data-table
                :headers="headers"
                :items="turmasFormatadas" 
                item-key="id"
                :loading="isLoading"
                class="elevation-0 turma-table"
                :items-per-page="-1" 
                hide-default-footer
                hide-default-header 
                loading-text="Carregando dados, por favor aguarde..."
            >
                <template #top>
                    
                    <v-toolbar color="orange" density="compact" class="header-toolbar-orange">
                        <v-toolbar-title class="text-h6 font-weight-bold text-white"> Turmas</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn 
                            color="white" 
                            variant="outlined" 
                            class="text-white font-weight-bold text-none" 
                            @click="addNewTurma"
                            elevation="0"
                            size="small"
                        >
                            <v-icon left>mdi-plus</v-icon>
                            Nova Turma
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
                        <td :style="{ width: getColumnWidth('descricao') }" class="text-left">{{ item.descricao }}</td>
                        <td :style="{ width: getColumnWidth('sala') }" class="text-left">{{ item.sala }}</td>
                        <td :style="{ width: getColumnWidth('idioma') }" class="text-left">{{ item.idioma }}</td>
                        <td :style="{ width: getColumnWidth('nivel') }" class="text-left">{{ item.nivel }}</td>
                        <td :style="{ width: getColumnWidth('professor') }" class="text-left">{{ item.professor }}</td>
                        <td :style="{ width: getColumnWidth('horainicio') }" class="text-left">{{ item.horainicio }}</td>
                        
                        <td :style="{ width: getColumnWidth('actions') }" class="text-center">
                            <v-btn 
                                color="warning" 
                                size="small"
                                class="mr-2 text-none font-weight-bold" 
                                @click="editTurma(item)"
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
                        <v-icon size="40" color="grey-lighten-1">mdi-school-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhuma turma encontrada. Cadastre a primeira!</p>
                    </div>
                </template>

            </v-data-table>
        </v-container>
    </v-card>

    <v-dialog v-model="showDeleteModal" max-width="400">
        <v-card>
            <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza de que deseja excluir a turma 
                <span class="font-weight-bold">{{ turmaToDelete?.descricao }}</span>?
                Esta ação é irreversível.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="showDeleteModal = false" :disabled="isDeleting">
                    Cancelar
                </v-btn>
                <v-btn color="error" variant="flat" @click="deleteTurma" :loading="isDeleting">
                    Excluir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
/* Estilo para o Card principal */
.turma-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

/* 1. BARRA SUPERIOR LARANJA (v-toolbar) */
.header-toolbar-orange {
    border-radius: 8px 8px 0 0 !important; 
}

/* 2. CABEÇALHO DAS COLUNAS (v-sheet) */
.custom-header-columns-light {

    border-bottom: 1px solid #ddd; 
    padding: 0 16px;
}

/* Garante que o span da coluna tenha o padding necessário */
.custom-header-columns-light .d-flex span {
    padding-left: 16px; 
    padding-right: 16px;
}


.turma-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}

/* Remove a borda inferior do cabeçalho da tabela padrão */
.turma-table :deep(.v-data-table__thead) {
    display: none; 
}

/* Ajuste fino na coluna de ações para centralizar os botões */
.turma-table :deep(td:last-child) {
    text-align: center;
}
</style>