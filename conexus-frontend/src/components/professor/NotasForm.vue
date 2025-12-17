<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';
import { useTurmaStore } from '@/stores/turmaStore';
import { useAvaliacaoStore } from '@/stores/avaliacaoStores';

const alunoTurmaStore = useAlunoTurmaStore();
const turmaStore = useTurmaStore(); 
const avaliacaoStore = useAvaliacaoStore(); 

const NOTA_MINIMA_APROVACAO = 7.0;
const NOTA_MINIMA_RECUPERACAO = 5.0; 

const turmasDisponiveis = ref([]);
const turmaSelecionada = ref(null);
const listaAlunosComNotas = ref([]); 
const estaCarregando = ref(false);
const estaSalvando = ref(false);

const headers = [
    { title: 'Nome do Aluno', key: 'nome', sortable: false },
    { title: 'Matrícula', key: 'idaluno', sortable: false },
    { title: 'Nota P1', key: 'nota1', sortable: false },
    { title: 'Nota P2', key: 'nota2', sortable: false },
    { title: 'Média Final', key: 'notaFinal', sortable: false },
    { title: 'Status', key: 'status', sortable: false },
];

const turmasOptions = computed(() => {
    return turmasDisponiveis.value.map(t => ({
        title: `${t.nome} - ${t.idioma}`, 
        value: t.idturma
    }));
});

function calcularMediaEStatus(aluno) {
    const p1 = parseFloat(aluno.nota1) || 0;
    const p2 = parseFloat(aluno.nota2) || 0;
    
    const media = (p1 + p2) / 2;
    const mediaArredondada = parseFloat(media.toFixed(1));

    let status = 'Pendente';
    let color = 'text-grey-darken-1';

    if (p1 > 0 && p2 > 0) { 
        if (media >= NOTA_MINIMA_APROVACAO) {
            status = 'Aprovado';
            color = 'text-success';
        } else if (media >= NOTA_MINIMA_RECUPERACAO) {
            status = 'Recuperação';
            color = 'text-warning'; 
        } else {
            status = 'Reprovado';
            color = 'text-error'; 
        }
    }

    return { media: mediaArredondada, status, color };
}

const alunosComStatus = computed(() => {
    return listaAlunosComNotas.value.map(aluno => {
        const { media, status, color } = calcularMediaEStatus(aluno);
        
        return {
            ...aluno,
            notaFinal: media, 
            status: status,
            statusColor: color,
        };
    });
});

async function buscarAlunosENotas() {
    if (!turmaSelecionada.value) {
        listaAlunosComNotas.value = [];
        return;
    }
    
    estaCarregando.value = true;
    try {
        const idTurma = turmaSelecionada.value;

        const alunosDaTurma = await alunoTurmaStore.buscarAlunosPorTurma(idTurma);


        const notasExistentes = await avaliacaoStore.buscarNotasPorTurma(idTurma);

        listaAlunosComNotas.value = alunosDaTurma.map(aluno => {
            const notaExistente = notasExistentes.find(n => n.idaluno === aluno.idaluno) || {};
            
            return {
                idaluno: aluno.idaluno, 
                nome: aluno.nome, 
                idTurma: idTurma,
                nota1: notaExistente.nota1 ?? 0,
                nota2: notaExistente.nota2 ?? 0,
                notaFinal: 0, 
            };
        });

    } catch (error) {
        console.error("Erro ao carregar alunos ou notas:", error);
        listaAlunosComNotas.value = [];
    } finally {
        estaCarregando.value = false;
    }
}

async function salvarNotas() {
    if (!turmaSelecionada.value || alunosComStatus.value.length === 0) return;
    
    estaSalvando.value = true;
    
    const payload = alunosComStatus.value.map(aluno => ({
        idaluno: aluno.idaluno,
        idturma: aluno.idTurma,
        nota1: parseFloat(aluno.nota1) || 0,
        nota2: parseFloat(aluno.nota2) || 0,
        notaFinal: aluno.notaFinal,
        status: aluno.status
    }));
    
    try {

        const sucesso = await avaliacaoStore.salvarNotas(payload); 
        
        if (sucesso) {
            alert("Notas salvas com sucesso!");
        } else {
            alert("Falha ao salvar notas. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao salvar notas:", error);
        alert("Erro crítico ao salvar notas.");
    } finally {
        estaSalvando.value = false;
    }
}

watch(turmaSelecionada, buscarAlunosENotas);

onMounted(async () => {
    try {
        await turmaStore.exibir(); 
        //turmasDisponiveis.value = turmaStore.turmas;
    } catch (error) {
        console.error("Erro ao carregar lista de turmas:", error);
    }
});
</script>

<template>
    <v-card class="mx-auto" max-width="1100">
        <v-toolbar color="#ffb300" density="compact">
            <v-toolbar-title class="text-white font-weight-bold ml-2">
                Lançamento de Notas
            </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-row class="mt-2 mb-4">
                <v-col cols="12">
                    <v-select
                        v-model="turmaSelecionada"
                        :items="turmasOptions"
                        label="Selecione a Turma"
                        prepend-icon="mdi-school"
                        variant="outlined"
                        clearable
                        density="comfortable"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
            
            <v-divider></v-divider>
            
            <v-data-table
                :headers="headers"
                :items="alunosComStatus"
                :loading="estaCarregando"
                hide-default-footer
                class="elevation-1 mt-4"
                :items-per-page="-1"
            >
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                </template>
                
                <template v-slot:item.nota1="{ item }">
                    <v-text-field
                        v-model="item.nota1"
                        type="number"
                        density="compact"
                        single-line
                        hide-details
                        min="0"
                        max="10"
                        variant="plain"
                        class="text-center"
                    ></v-text-field>
                </template>

                <template v-slot:item.nota2="{ item }">
                    <v-text-field
                        v-model="item.nota2"
                        type="number"
                        density="compact"
                        single-line
                        hide-details
                        min="0"
                        max="10"
                        variant="plain"
                        class="text-center"
                    ></v-text-field>
                </template>

                <template v-slot:item.notaFinal="{ item }">
                    <v-text-field
                        :model-value="item.notaFinal"
                        type="number"
                        density="compact"
                        single-line
                        hide-details
                        min="0"
                        max="10"
                        variant="plain"
                        readonly 
                        :class="['font-weight-bold text-center', item.statusColor]"
                    ></v-text-field>
                </template>

                <template v-slot:item.status="{ item }">
                    <v-chip 
                        size="small" 
                        label
                        :color="item.status === 'Aprovado' ? 'success' : item.status === 'Recuperação' ? 'warning' : item.status === 'Reprovado' ? 'error' : 'grey'"
                        class="font-weight-bold"
                    >
                        {{ item.status }}
                    </v-chip>
                </template>

                <template v-slot:no-data>
                    <div class="pa-4 text-center">
                        {{ turmaSelecionada ? 'Nenhum aluno encontrado nesta turma.' : 'Selecione uma turma para lançar as notas.' }}
                    </div>
                </template>

            </v-data-table>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 justify-end">
            <v-btn
                color="success"
                size="large"
                elevation="2"
                :loading="estaSalvando"
                :disabled="!turmaSelecionada || alunosComStatus.length === 0 || estaSalvando"
                @click="salvarNotas"
                prepend-icon="mdi-content-save"
                class="font-weight-bold"
            >
                Salvar 
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>

.text-success { color: #4CAF50 !important; }
.text-warning { color: #FFC107 !important; }
.text-error { color: #F44336 !important; }
</style>