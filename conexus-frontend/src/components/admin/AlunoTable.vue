<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAlunoStore } from '@/stores/alunoStore';
import { useTurmaStore } from '@/stores/turmaStore';

const router = useRouter();
const alunoStore = useAlunoStore();
// Assumindo que você tem uma turmaStore para buscar nomes de turmas
const turmaStore = useTurmaStore();

const estaCarregando = ref(true);

const mostrarModalExclusao = ref(false);
const alunoParaExcluir = ref(null);
const estaExcluindo = ref(false);

const alunosFormatados = computed(() => {
    // Retorna vazio se os dados ainda não foram carregados ou se estão vazios
    if (!alunoStore.alunos || !alunoStore.alunos.length) {
        return [];
    }

    return alunoStore.alunos.map(aluno => {
        // Encontra a turma. Você precisará garantir que turmaStore.turmas foi carregada.
        // A lógica de associação de turma deve ser feita com base na estrutura de dados real (ex: aluno.idturma)
        const turma = turmaStore.turmas.find(t => t.idturma === aluno.idturma);

        // Adiciona um fallback para o nome da turma
        const turmaDescricao = aluno.turmaNome || turma?.descricao || 'Sem Turma Ativa';
            
        return {
            id: aluno.idaluno,
            nome: aluno.nome,
            cpf: aluno.cpf, 
            turma: turmaDescricao, 
            situacao: aluno.situacao || 'N/A', 
        };
    });
});

// Headers (Cabeçalhos) no formato padrão do v-data-table
const cabecalhos = ref([
    { title: 'Nome', align: 'start', key: 'nome' },
    { title: 'CPF', align: 'start', key: 'cpf' },
    { title: 'Turma', align: 'start', key: 'turma' },
    { title: 'Situação', align: 'start', key: 'situacao' },
    { title: 'Ações', align: 'center', key: 'actions', sortable: false }, 
]);

// Funções de Ação
function editarAluno(item) {
    router.push(`/admin/alunos/cadastro/${item.id}`);
}

function confirmarExclusao(item) {
    alunoParaExcluir.value = item;
    mostrarModalExclusao.value = true;
}

async function excluirAluno() {
    if (alunoParaExcluir.value && alunoParaExcluir.value.id) {
        estaExcluindo.value = true;
        
        // Chamada correta para a action 'apagar'
        const sucesso = await alunoStore.apagar(alunoParaExcluir.value.id); 

        if (sucesso) {
            // Recarrega a lista de alunos
            await alunoStore.exibir(); 
            // Opcional: mostrar um snackbar de sucesso
        } else {
            // Opcional: mostrar um snackbar de erro
        }

        estaExcluindo.value = false;
        mostrarModalExclusao.value = false;
        alunoParaExcluir.value = null;
    }
}

function verContrato(item) {
    // Implementar a lógica de visualização/download de contrato
    console.log(`Visualizando contrato do aluno: ${item.nome}`);
}

function adicionarNovoAluno() {
    router.push('/admin/alunos/cadastro');
}

// Carrega dados no montagem do componente
onMounted(async () => {
    estaCarregando.value = true;
    try {
        // Carrega alunos e turmas em paralelo
        await Promise.all([
            alunoStore.exibir(),
            turmaStore.exibir(),
        ]);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        estaCarregando.value = false;
    }
});
</script>

<template>
    <v-card class="aluno-container" max-width="1500" elevation="2"> 

        <v-toolbar color="orange-darken-1" density="compact" flat>
            <v-toolbar-title class="text-white font-weight-bold ml-2">Estudantes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" prepend-icon="mdi-plus" class="text-none font-weight-bold" @click="adicionarNovoAluno">
                Novo Estudante
            </v-btn>
        </v-toolbar>

        <v-data-table
            :headers="cabecalhos"
            :items="alunosFormatados" 
            class="elevation-0" 
            item-key="id"
            :loading="estaCarregando"
            loading-text="Carregando dados, por favor aguarde..."
        >
            
            <template v-slot:item.actions="{ item }">
                <v-btn 
                    color="warning" 
                    variant="flat" 
                    size="small"
                    class="mr-2 text-none font-weight-bold" 
                    @click="editarAluno(item)"
                >
                    Editar
                </v-btn>

                <v-btn 
                    color="error" 
                    variant="flat" 
                    size="small"
                    class="mr-2 text-none font-weight-bold" 
                    @click="confirmarExclusao(item)"
                >
                    Excluir
                </v-btn>
                
                <v-btn 
                    color="orange" 
                    variant="flat" 
                    size="small"
                    class="text-none font-weight-bold" 
                    @click="verContrato(item)"
                >
                    Contrato
                </v-btn>
            </template>
            
            <template v-slot:no-data>
                <div class="pa-4 text-center" v-if="!estaCarregando">
                    <v-icon size="40" color="grey-lighten-1">mdi-account-school-outline</v-icon>
                    <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum estudante encontrado. Cadastre o primeiro!</p>
                </div>
            </template>

        </v-data-table>

        <v-dialog v-model="mostrarModalExclusao" max-width="400">
            <v-card>
                <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
                <v-card-text>
                    Tem certeza de que deseja excluir o estudante 
                    <span class="font-weight-bold">{{ alunoParaExcluir?.nome }}</span>?
                    Esta ação é irreversível.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="mostrarModalExclusao = false" :disabled="estaExcluindo">
                        Cancelar
                    </v-btn>
                    <v-btn color="error" variant="flat" @click="excluirAluno" :loading="estaExcluindo">
                        Excluir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<style scoped>
/* Estilos para o Card Principal e Cabeçalho */
.aluno-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

/* Garante que o toolbar tenha bordas arredondadas no topo */
.v-toolbar {
    border-radius: 8px 8px 0 0 !important; 
}

/* Estilos de célula e linha */
.v-data-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    vertical-align: middle;
}
</style>