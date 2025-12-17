<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';
import { usePresencaStore } from '@/stores/presencaStores';
import { useTurmaStore } from '@/stores/turmaStore';
import { useAuthStore } from '@/stores/authStore'; 


const route = useRoute();
const router = useRouter();

const alunoTurmaStore = useAlunoTurmaStore();
const presencaStore = usePresencaStore();
const turmaStore = useTurmaStore();
const authStore = useAuthStore();

const turmaId = route.params.turmaId;
const alunos = ref([]);
const turmaInfo = ref(null);
const loading = ref(true);
const saving = ref(false);

const presencaStatus = ref({}); 

const hoje = computed(() => {
    return new Date().toISOString().split('T')[0];
});


async function carregarDados() {
    loading.value = true;
    try {
        if (!turmaId) return; 


        turmaInfo.value = await turmaStore.buscarPorId(turmaId); 
        

        const alunosDaTurma = await alunoTurmaStore.buscarAlunosPorTurma(turmaId);

        if (alunosDaTurma && alunosDaTurma.length > 0) {
            alunos.value = alunosDaTurma;
            

            alunosDaTurma.forEach(aluno => {
                presencaStatus.value[aluno.idalunoTurma] = true; 
            });
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        loading.value = false;
    }
}

async function salvar() {

    saving.value = true;
    const registrosParaSalvar = [];
    

    const idfuncionario = authStore.user?.idfuncionario; 

    if (!idfuncionario) {
        alert('Usuário não autenticado. Impossível salvar a presença.');
        saving.value = false;
        return;
    }


    for (const idalunoturma in presencaStatus.value) {
        registrosParaSalvar.push({
            idalunoturma: parseInt(idalunoturma),
            idfuncionario: idfuncionario,
            presente: presencaStatus.value[idalunoturma],
            data: hoje.value 
        });
    }

    try {

        const sucesso = await presencaStore.registrarPresencas(registrosParaSalvar); 

        if (sucesso) {
            alert('Registro de presença salvo com sucesso!');

            router.push({ name: 'ProfessorTurmas' }); 
        } else {
            alert('Falha ao salvar. Verifique a API e os logs.');
        }

    } catch (error) {
        console.error("Erro ao salvar presenças:", error);
    } finally {

        saving.value = false;
    }
}

function voltar() {
    router.push({ name: 'ProfessorTurmas' });
}

onMounted(() => {
    if (!turmaId) {
        router.push({ name: 'ProfessorTurmas' });
        return;
    }
    // Chama a nova função simplificada
    carregarDados();
});
</script>

<template>
    <v-card elevation="2">
        
        <v-card-title class="text-h5 font-weight-bold bg-orange-darken-1 text-white pa-4">
            <v-icon start>mdi-list-status</v-icon>
            Registro de Presença para 
            <span v-if="turmaInfo" class="ml-2">
                {{ turmaInfo.descricao }}
            </span>
            <span v-else class="ml-2">
                [Carregando Turma...]
            </span>
        </v-card-title>
        
        <v-card-text class="pa-4">
            
            <div v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <span class="ml-3">Buscando alunos...</span>
            </div>
            
            <v-alert v-else-if="alunos.length === 0" type="warning" variant="tonal" class="mb-4">
                Nenhum aluno matriculado nesta turma.
            </v-alert>

            <v-form v-else @submit.prevent="salvar">
                <v-alert type="info" variant="tonal" class="mb-4">
                    Marque os alunos que estão **Presentes** na aula de hoje ({{ hoje }}).
                </v-alert>
                
                <v-table class="mb-6">
                    <thead>
                        <tr>
                            <th class="text-left" style="width: 70%;">Aluno</th>
                            <th class="text-center" style="width: 30%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="aluno in alunos" :key="aluno.idalunoTurma">
                            <td>{{ aluno.aluno ? aluno.aluno.nomealuno : 'Aluno Não Identificado' }}</td> 
                            <td class="text-center">
                                <v-checkbox
                                    v-model="presencaStatus[aluno.idalunoTurma]"
                                    :label="presencaStatus[aluno.idalunoTurma] ? 'Presente' : 'Faltou'"
                                    :color="presencaStatus[aluno.idalunoTurma] ? 'success' : 'error'"
                                    density="compact"
                                    hide-details
                                ></v-checkbox>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <v-divider class="my-4"></v-divider>

                <v-btn
                    type="submit"
                    color="success"
                    :loading="saving"
                    :disabled="alunos.length === 0 || saving"
                    size="large"
                >
                    <v-icon start icon="mdi-content-save"></v-icon>
                    Salvar
                </v-btn>
                
                <v-btn
                    color="grey-darken-1"
                    variant="tonal"
                    @click="voltar"
                    class="ml-3"
                    :disabled="saving"
                >
                    Voltar para Turmas
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>