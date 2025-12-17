<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Stores internamente
import { useTurmaStore } from '@/stores/turmaStore';
import { useIdiomaStore } from '@/stores/idiomaStores';
import { useNivelStore } from '@/stores/nivelStores';
import { useFuncionarioStore } from '@/stores/funcionarioStore';

const route = useRoute();
const router = useRouter();

// Inicializa as instâncias dos Stores para uso no componente
const turmaStore = useTurmaStore();
const idiomaStore = useIdiomaStore();
const nivelStore = useNivelStore();
const funcionarioStore = useFuncionarioStore();

// Objeto reativo que armazena os dados do formulário da turma
const turmaForm = reactive({
    idturma: null,
    iddisciplina: null,
    idnivel: null,
    idfuncionario: null,
    descricao: '',
    diassemana: [],
    dataInicio: '',
    horainicio: '',
    capacidadeMaxima: null,
    sala: '',
    imagem: '',
    tiporecorrencia: null,
    imagemFile: null,
    ididioma:'',
});

const estaEnviando = ref(false); 
const estaCarregando = ref(false); 
const form = ref(null);

const turmaId = computed(() => route.params.id);
const isEditing = ref (false);

const idiomas = computed(() => idiomaStore.idiomas);
const niveis = computed(() => nivelStore.niveis);
const funcionarios = computed(() => funcionarioStore.funcionarios);

const recorrencias = ['Manhã', 'Tarde', 'Noite', 'Integral'];

const diasSemanaOptions = [
    { text: 'Segunda', value: 'Seg' },
    { text: 'Terça', value: 'Ter' },
    { text: 'Quarta', value: 'Qua' },
    { text: 'Quinta', value: 'Qui' },
    { text: 'Sexta', value: 'Sex' },
    { text: 'Sábado', value: 'Sáb' },
];

// Regras de validação
const regras = {
    requerido: value => !!value || 'Campo obrigatório.',
    positivo: value => (value > 0) || 'Deve ser maior que zero',
    // Ajuste: Verifica se há arquivo e, se houver, valida o tamanho.
    maxFileSize: v => !v || v.size < 2000000 || 'O tamanho da imagem deve ser menor que 2MB!',
};

const loadTurmaData = () => {
    if (isEditing.value) {
        const turmaData = turmaStore.turmas.find(t => t.idturma == turmaId.value); 

        if (turmaData) {
            turmaForm.idturma = turmaData.idturma;
            turmaForm.iddisciplina = turmaData.iddisciplina;
            turmaForm.idnivel = turmaData.idnivel;
            turmaForm.idfuncionario = turmaData.idfuncionario;
            turmaForm.descricao = turmaData.descricao;
            
            if (turmaData.horainicio) {
                try {
                    const dateObj = new Date(turmaData.horainicio);
                    
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const dd = String(dateObj.getDate()).padStart(2, '0');
                    turmaForm.dataInicio = `${yyyy}-${mm}-${dd}`;
                    
                    const hh = String(dateObj.getHours()).padStart(2, '0');
                    const mi = String(dateObj.getMinutes()).padStart(2, '0');
                    turmaForm.horainicio = `${hh}:${mi}`;
                } catch (e) {
                    console.warn("Horainicio não é um formato de data/hora válido. Usando valor bruto.");
                    turmaForm.horainicio = turmaData.horainicio;
                    turmaForm.dataInicio = '';
                }
            } else {
                turmaForm.horainicio = '';
                turmaForm.dataInicio = '';
            }

            turmaForm.capacidadeMaxima = turmaData.capacidadeMaxima;
            turmaForm.sala = turmaData.sala;
            turmaForm.imagem = turmaData.imagem;
            turmaForm.tiporecorrencia = turmaData.tiporecorrencia;

            if (typeof turmaData.diassemana === 'string') {
                turmaForm.diassemana = turmaData.diassemana.split(',').map(d => d.trim());
            } else {
                turmaForm.diassemana = [];
            }
        }
    }
};

const submitForm = async () => {
    // Adicionado o cheque para garantir que form.value existe
    if (!form.value) return; 

    const validationResult = await form.value.validate(); 
    if (!validationResult.valid) return;

    estaEnviando.value = true;
    
    const payload = { ...turmaForm };
    
    // Lógica para formatar horainicio para o backend
    // if (payload.dataInicio && payload.horainicio) {
    //     payload.horainicio = `${payload.dataInicio}T${payload.horainicio}:00Z`;
    // } else if (payload.dataInicio) {
    //     payload.horainicio = `${payload.dataInicio}T00:00:00Z`;
    // } else {
    //     payload.horainicio = null;
    // }
    
    delete payload.dataInicio;
    
    if (Array.isArray(payload.diassemana)) {
      payload.diassemana = payload.diassemana.join(', ');
    }
    
    delete payload.imagemFile; // O arquivo deve ser enviado separadamente via FormData, se necessário.

    try {
        let success;
        if (isEditing.value) {
            success = await turmaStore.atualizar(payload.idturma, payload); 
        } else {
            success = await turmaStore.adicionar(payload); 
        }
        console.log(payload)
        if (success) {
            alert(`Turma ${isEditing.value ? 'atualizada' : 'cadastrada'} com sucesso!`);
            router.push({ name: 'ListarTurmas' });
        } else {
            alert('Falha ao salvar a turma. Verifique o console.');
        }

    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        alert('Ocorreu um erro inesperado ao salvar a turma.');
    } finally {
        estaEnviando.value = false;
    }
};

const cancelForm = () => {
    router.push({ name: 'ListarTurmas' });
};

onMounted(async () => {
    estaCarregando.value = true;
    
    await Promise.all([
      idiomaStore.exibir(), 
      nivelStore.exibir(), 
      funcionarioStore.exibir(), 
    ]);
    
    estaCarregando.value = false;

    if (isEditing.value) {
      await turmaStore.exibir();
      loadTurmaData();
    }
});
</script>

<template>
    <v-form ref="form" @submit.prevent="submitForm">
        <v-container class="mx-auto" max-width="1500">
            
            <v-card class="mb-6" elevation="0">
                <v-toolbar color="orange" density="compact" class="header-toolbar-orange">
                    <v-toolbar-title class="text-h6 font-weight-bold text-white">
                        {{ isEditing ? 'Cadastrar Turma':'Editar Turma' }}
                    </v-toolbar-title>
                    
                    <v-spacer></v-spacer> 
                    
                    <v-icon @click="cancelForm" icon="mdi-close" color="white" class="mr-2"></v-icon>
                </v-toolbar>
            </v-card>

            <v-card class="mb-6" elevation="1" :loading="estaCarregando">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-account-group-outline" class="mr-2"></v-icon>
                    Informações da Turma
                </v-card-title>

                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="turmaForm.descricao" 
                                label="Nome/Descrição da Turma *" 
                                placeholder="Digite o nome da turma" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-select 
                                v-model="turmaForm.tiporecorrencia" 
                                :items="recorrencias" 
                                label="Turno/Período *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]"></v-select>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model.number="turmaForm.capacidadeMaxima" 
                                label="Capacidade Máxima de Alunos *" 
                                placeholder="Ex: 30" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                type="number"
                                :rules="[regras.requerido, regras.positivo]">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-select 
                                v-model="turmaForm.idfuncionario" 
                                :items="funcionarios" 
                                item-title="nome" 
                                item-value="idfuncionario" 
                                label="Professor Principal *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]" 
                                :loading="estaCarregando"></v-select>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field
                                v-model="turmaForm.sala" 
                                label="Sala da Turma *" 
                                placeholder="Ex: Sala 101, Bloco B" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-select 
                                v-model="turmaForm.idnivel" 
                                :items="niveis" 
                                item-title="descricao" 
                                item-value="idnivel" 
                                label="Nível da Turma *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]" 
                                :loading="estaCarregando"></v-select>
                        </v-col>
                        
                        <v-col cols="12" class="py-1">
                            <v-select 
                                v-model="turmaForm.ididioma" 
                                :items="idiomas" 
                                item-title="descricao" 
                                item-value="ididioma" 
                                label="Disciplinas Ofertadas *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]" 
                                :loading="estaCarregando"></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            
            <v-card class="mb-6" elevation="1">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                    Agendamento e Horários
                </v-card-title>
                
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="turmaForm.dataInicio" 
                                label="Data de Início *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                type="date" 
                                prepend-inner-icon="mdi-calendar" 
                                :rules="[regras.requerido]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="turmaForm.horainicio" 
                                label="Hora Início *" 
                                required 
                                variant="outlined" 
                                density="compact" 
                                type="time" 
                                prepend-inner-icon="mdi-clock-outline" 
                                :rules="[regras.requerido]"></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" class="py-1">
                            <v-label class="text-subtitle-1 font-weight-medium mb-3">Dias da Semana *</v-label>
                            <v-chip-group v-model="turmaForm.diassemana" multiple mandatory column>
                                <v-chip 
                                    v-for="dia in diasSemanaOptions" 
                                    :key="dia.value"
                                    :value="dia.value" 
                                    filter 
                                    variant="outlined" 
                                    color="orange-darken-1" 
                                    size="default">{{ dia.text }}</v-chip>
                            </v-chip-group>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="1">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-camera-outline" class="mr-2"></v-icon>
                    Mídia
                </v-card-title>
                
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <v-file-input 
                                v-model="turmaForm.imagemFile" 
                                label="Imagem da Turma (opcional)" 
                                variant="outlined" 
                                density="compact" 
                                prepend-icon="mdi-camera" 
                                clearable 
                                :rules="turmaForm.imagemFile ? [regras.maxFileSize] : []">
                                </v-file-input>
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
                        :loading="estaEnviando" 
                        :disabled="estaEnviando">
                        {{ isEditing ? 'Atualizar':'Salvar'}}
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="3" md="2">
                    <v-btn 
                        @click="cancelForm" 
                        block 
                        variant="text" 
                        color="grey-darken-1" 
                        size="large"
                        :disabled="estaEnviando">
                        Cancelar
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-form>
</template>

<style scoped>
.header-toolbar-orange {
    background-color: #ff9800 !important; 
    color: white;
}
.header-toolbar-orange .v-toolbar-title {
    color: white !important;
}

/* Reduz o espaçamento vertical entre as linhas do formulário */
.v-col {
    padding-top: 8px;
    padding-bottom: 8px;
}
</style>