<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useEmprestimoMaterialStore } from '@/stores/emprestimoMaterialStores'; 
import { useAlunoStore } from '@/stores/alunoStore'; 
import { useMaterialStore } from '@/stores/materialStore'; 

const route = useRoute();
const router = useRouter();


const emprestimoStore = useEmprestimoMaterialStore();
const alunoStore = useAlunoStore(); 
const materialStore = useMaterialStore(); 


const isSubmitting = ref(false); 
const formRef = ref(null); 

const emprestimoId = computed(() => route.params.id);
const isEditing = computed(() => !!emprestimoId.value);

const pageTitle = computed(() => 
    isEditing.value ? 'Editar Empréstimo' : 'Cadastrar Novo Empréstimo'
);


const form = ref({
    idemprestimo: null, 
    idaluno: null,
    idmaterial: null,
    dataEmprestimo: new Date().toISOString().substring(0, 10), 
    devolucaoPrevista: null,
    dataDevolvido: null, 
    status: 'emprestado',
    valorMulta: 0.00,
    observacoes: null 
});

// Selects Alunos e Materiais
const alunosOptions = computed(() => 
    alunoStore.alunos.map(a => ({
        title: `${a.nome} (ID: ${a.id})`, 
        value: a.id 
    }))
);

const materialOptions = computed(() => 
    materialStore.materiais.map(m => ({
        title: `${m.titulo} (ID: ${m.idmaterial})`, 
        value: m.idmaterial 
    }))
);

const statusOptions = ref([
    { title: 'Emprestado', value: 'emprestado' },
    { title: 'Devolvido', value: 'devolvido' },
    { title: 'Atrasado', value: 'atrasado' }
]);

// REGRAS 
const regras = {
    requerido: value => !!value || 'Campo obrigatório.',
    dataDevolucaoValida: value => {
        if (!value) return true; 
        if (value < form.value.dataEmprestimo) {
            return 'A devolução não pode ser anterior à data do empréstimo.';
        }
        return true;
    },
    multaValida: value => (value >= 0) || 'O valor da multa deve ser zero ou positivo.'
};


onMounted(async () => {
    //  dados
    await Promise.all([
        alunoStore.carregarAlunos(), 
        materialStore.carregarMateriais(),
    ]);

    //  dados para edição
    if (isEditing.value) {
        const id = parseInt(emprestimoId.value);
        const emprestimo = await emprestimoStore.buscarPorId(id);
        
        if (emprestimo) {
            form.value = {
                ...emprestimo,
                //formato data
                dataEmprestimo: emprestimo.dataEmprestimo ? new Date(emprestimo.dataEmprestimo).toISOString().substring(0, 10) : null,
                devolucaoPrevista: emprestimo.devolucaoPrevista ? new Date(emprestimo.devolucaoPrevista).toISOString().substring(0, 10) : null,
                dataDevolvido: emprestimo.dataDevolvido ? new Date(emprestimo.dataDevolvido).toISOString().substring(0, 10) : null,
                // valor da multa é um número
                valorMulta: parseFloat(emprestimo.valorMulta) || 0.00,
                observacoes: emprestimo.observacoes || null
            };
        } else {
            console.error('Empréstimo não encontrado.');
            router.push({ name: 'ListarEmprestimos' });
        }
    }
});

//  Salvar
async function salvar() {
    const validationResult = await formRef.value.validate();
    if (!validationResult.valid) return;

    isSubmitting.value = true;

    const payload = {
        idemprestimo: form.value.idemprestimo,
        idaluno: form.value.idaluno,
        idmaterial: form.value.idmaterial,
        dataemprestimo: form.value.dataEmprestimo,
        dataprevistadevolucao: form.value.devolucaoPrevista,
        datadevolvido: form.value.dataDevolvido,
        status: form.value.status,
        observacoes: form.value.observacoes,
        valormulta: parseFloat(form.value.valorMulta) || 0
    };

    try {
        let sucesso;

        if (isEditing.value) {
            sucesso = await emprestimoStore.atualizar(payload.idemprestimo, payload);
        } else {
            sucesso = await emprestimoStore.adicionar(payload);
        }

        if (sucesso) {
            router.push({ name: 'ListarEmprestimos' });
        } else {
            alert('Falha ao salvar o empréstimo.');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar empréstimo.');
    } finally {
        isSubmitting.value = false;
    }
}


function voltarParaLista() {
    router.push({ name: 'ListarEmprestimos' });
}
</script>

<template>
    <v-card class="mx-auto" max-width="900" elevation="1"> 
        
        <v-toolbar color="orange" density="compact">
            <v-toolbar-title class="text-h6 font-weight-bold text-white ml-2">
                {{ pageTitle }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn 
                icon="mdi-close" 
                variant="text" 
                color="white"
                @click="voltarParaLista"
            ></v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
            <v-form @submit.prevent="salvar" ref="formRef"> 
                
                <v-card class="mb-6" elevation="0">
                    <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                        <v-icon icon="mdi-book-arrow-up" class="mr-2"></v-icon>
                        Detalhes do Empréstimo
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-row>
                            <v-col cols="12" md="6" class="py-1">
                                <v-select
                                    v-model="form.idaluno"
                                    :items="alunosOptions"
                                    label="Aluno *"
                                    variant="outlined"
                                    density="compact"
                                    :disabled="isEditing || isSubmitting"
                                    :rules="[regras.requerido]"
                                    required
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6" class="py-1">
                                <v-select
                                    v-model="form.idmaterial"
                                    :items="materialOptions"
                                    label="Material *"
                                    variant="outlined"
                                    density="compact"
                                    :disabled="isEditing || isSubmitting"
                                    :rules="[regras.requerido]"
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6" class="py-1">
                                <v-text-field
                                    v-model="form.dataEmprestimo"
                                    label="Data do Empréstimo *"
                                    type="date"
                                    variant="outlined"
                                    density="compact"
                                    :rules="[regras.requerido]" :disabled="isSubmitting"
                                    required
                                    
                                    ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" class="py-1">
                                <v-text-field
                                    v-model="form.devolucaoPrevista"
                                    label="Devolução Prevista *"
                                    type="date"
                                    variant="outlined"
                                    density="compact"
                                    :min="form.dataEmprestimo"
                                    :rules="[regras.requerido]"
                                    :disabled="isSubmitting"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                
                <v-card class="mb-6" elevation="0" v-if="isEditing">
                    <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                        <v-icon icon="mdi-sync" class="mr-2"></v-icon>
                        Controle de Devolução
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-row>
                            <v-col cols="12" md="4" class="py-1">
                                <v-text-field
                                    v-model="form.dataDevolvido"
                                    label="Data Devolvido (opcional)"
                                    type="date"
                                    variant="outlined"
                                    density="compact"
                                    clearable
                                    :rules="[regras.dataDevolucaoValida]"
                                    :disabled="isSubmitting"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" class="py-1">
                                <v-select
                                    v-model="form.status"
                                    :items="statusOptions"
                                    label="Status *"
                                    variant="outlined"
                                    density="compact"
                                    :rules="[regras.requerido]"
                                    :disabled="isSubmitting"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="4" class="py-1">
                                <v-text-field
                                    v-model.number="form.valorMulta"
                                    label="Valor Multa (R$)"
                                    type="number"
                                    variant="outlined"
                                    density="compact"
                                    min="0"
                                    prefix="R$"
                                    :rules="[regras.multaValida]"
                                    :disabled="isSubmitting"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <v-card class="mb-6" elevation="0">
                    <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                        <v-icon icon="mdi-note-text-outline" class="mr-2"></v-icon>
                        Observações
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-row>
                            <v-col cols="12" class="py-1">
                                <v-textarea
                                    v-model="form.observacoes"
                                    label="Observações (opcional)"
                                    variant="outlined"
                                    density="compact"
                                    rows="3"
                                    clearable
                                    :disabled="isSubmitting"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                
                <v-row justify="start" class="pt-2">
                    <v-col cols="12" sm="4" md="3">
                        <v-btn 
                            type="submit" 
                            block 
                            color="orange-darken-1" 
                            size="large" 
                            elevation="2"
                            class="text-white font-weight-bold" 
                            :loading="isSubmitting" 
                            :disabled="isSubmitting"
                        >
                            {{ isEditing ? 'Atualizar' : 'Salvar' }}
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="3" md="2">
                        <v-btn 
                            @click="voltarParaLista" 
                            block 
                            variant="text" 
                            color="grey-darken-1" 
                            size="large"
                            :disabled="isSubmitting"
                        >
                            Cancelar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<style scoped>

.v-col {
    padding-top: 8px;
    padding-bottom: 8px;
}
.bg-grey-lighten-4 {
    background-color: #f5f5f5 !important;
}
.v-card-title {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>