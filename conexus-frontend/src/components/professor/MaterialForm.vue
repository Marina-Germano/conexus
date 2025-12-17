<script setup>
import { ref, computed } from 'vue';

// Define as props, incluindo a lista de turmas que virá do componente pai
const props = defineProps({
    turmasDisponiveis: {
        type: Array,
        default: () => []
    }
});

// defineModel é usado para gerenciar o objeto de dados do formulário
const model = defineModel({
    type: Object,
    required: true,
    default: () => ({
        idmaterial: null,
        titulo: '',
        descricao: '',
        tipo: null,
        idioma: '',
        nivel: null, 
        link: '',
        idturma: null, 
    })
});

// Define os eventos que este componente irá disparar para o pai
const emit = defineEmits(['save', 'close']);

const tiposMaterial = [
    'apostila', 'livro', 'exercício', 'áudio', 'vídeo', 'link', 'outro'
];

const niveisIdioma = [
    'Básico A1', 'Básico A2', 'Intermediário B1', 'Intermediário B2', 'Avançado C1', 'Avançado C2'
];

// Mapeia turmas para o formato esperado pelo v-select (title e value)
const turmasOptions = computed(() => {
    return props.turmasDisponiveis.map(t => ({
        title: `Turma: ${t.nome} - ${t.idioma}`, 
        value: t.idturma
    }));
});

// Funções de ação
function submitForm() {
    emit('save', model.value);
}

function closeDialog() {
    emit('close');
}

// Variável simulada para desabilitar o botão enquanto salva
const estaEnviando = ref(false); 
</script>

<template>
    <v-card>
        
        <v-toolbar
            color="#ffb300"
            density="compact"
            flat
        >
            <v-toolbar-title class="text-white font-weight-bold ml-2">
                {{ model.idmaterial ? 'Editar Material' : 'Novo Material Didático' }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="closeDialog" color="white"></v-btn>
        </v-toolbar>

        <v-card-text class="pt-4 pb-2">
            <v-container>
                <v-row dense>
                    
                    <v-col cols="12">
                        <v-select
                            v-model="model.idturma"
                            :items="turmasOptions"
                            label="Turma Destino"
                            prepend-icon="mdi-school"
                            required
                            density="compact"
                            variant="outlined"
                        ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                            v-model="model.titulo"
                            label="Título do Material"
                            prepend-icon="mdi-format-title"
                            required
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-textarea
                            v-model="model.descricao"
                            label="Descrição (Opcional)"
                            prepend-icon="mdi-text"
                            density="compact"
                            rows="2"
                            variant="outlined"
                        ></v-textarea>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                        <v-select
                            v-model="model.tipo"
                            :items="tiposMaterial"
                            label="Tipo"
                            prepend-icon="mdi-file-document-outline"
                            required
                            density="compact"
                            variant="outlined"
                        ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="model.idioma"
                            label="Idioma"
                            prepend-icon="mdi-translate"
                            required
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                        <v-select
                            v-model="model.nivel"
                            :items="niveisIdioma"
                            label="Nível"
                            prepend-icon="mdi-chart-bar"
                            required
                            density="compact"
                            variant="outlined"
                        ></v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="model.link"
                            label="Link para Download (URL) (Opcional)"
                            prepend-icon="mdi-link"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>

                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
            <v-row no-gutters justify="end">
                <v-col cols="12" sm="4" md="3" class="mb-2 mb-sm-0 mr-sm-2">
                    <v-btn block color="error" size="large" elevation="2"
                        class="font-weight-bold"
                        @click="closeDialog"
                        prepend-icon="mdi-close">
                        Cancelar
                    </v-btn>
                </v-col>
                
                <v-col cols="12" sm="4" md="3">
                    <v-btn block color="success" size="large" elevation="2"
                        class="text-white font-weight-bold"
                        :loading="estaEnviando" 
                        :disabled="estaEnviando"
                        @click="submitForm"
                        prepend-icon="mdi-content-save">
                        {{ model.idmaterial ? 'Atualizar' : 'Salvar' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.v-card-actions .v-btn {
    text-transform: none; 
}
</style>