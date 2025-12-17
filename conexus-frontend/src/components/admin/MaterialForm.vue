<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 

import { useMaterialStore } from '@/stores/materialStore';
import { useIdiomaStore } from '@/stores/idiomaStores';
import { useNivelStore } from '@/stores/nivelStores';
import { useTipoMaterialStore } from '@/stores/tipoMaterialStores';

const route = useRoute();
const router = useRouter();

const materialStore = useMaterialStore();
const idiomaStore = useIdiomaStore();
const nivelStore = useNivelStore();
const tipoMaterialStore = useTipoMaterialStore();

// --- ESTADOS DE CONTROLE ---
const form = ref(null);
const isLoadingData = ref(false);
const isSubmitting = ref(false); 

// --- DADOS E REGRAS ---
const defaultFormData = {
    titulo: '',
    idtipoMaterial: null, 
    descricao: '',
    ididioma: null,
    idnivel: null,
    quantidade: 0,
    arquivo: null, 
    idmaterial:'',
    idturma :'',
    formatoArquivo:'',
    dataCadastro:''
};

const materialForm = reactive({ ...defaultFormData });

const rules = {
    required: v => !!v || 'Campo obrigatório',
    minQuantity: v => v >= 0 || 'A quantidade não pode ser negativa',
};


// --- PROPRIEDADES COMPUTADAS ---
const materialId = computed(() => route.params.id);
const isEditing = computed(() => !!materialId.value);

// Opções de Lookup
const idiomaOptions = computed(() => idiomaStore.idiomas.map(i => ({ title: i.descricao, value: i.ididioma })));
const nivelOptions = computed(() => nivelStore.niveis.map(n => ({ title: n.descricao, value: n.idnivel })));
const tipoMaterialOptions = computed(() => tipoMaterialStore.tiposMaterial.map(t => ({ title: t.descricao, value: t.idtipoMaterial })));


const formTitle = computed(() => {
    return isEditing.value ? 'Editar Material' : 'Cadastrar Material';
});

const submitButtonText = computed(() => {
    return isEditing.value ? 'Salvar Alterações' : 'Salvar'; 
});


/** Carrega os dados edição */
async function loadMaterialData() {
    if (isEditing.value && materialId.value) {
        isLoadingData.value = true;
        
        await materialStore.exibir(); 
        
        const data = materialStore.getMaterialById(materialId.value);
        
        if (data) {
            Object.assign(materialForm, {
                ...defaultFormData, 
                ...data,
                idtipomaterial: data.idtipomaterial || data.idTipoMaterial, 
            });
        } else {
            console.error("Material não encontrado.");
            router.push('/admin/materiais');
        }
        isLoadingData.value = false;
    } else {
        resetForm();
    }
}


/** Reseta o formulário  */
function resetForm() {
    Object.assign(materialForm, defaultFormData);
    if (form.value) {
        form.value.resetValidation();
    }
}

    /** Criação ou Edição */
    async function handleSubmit() {
    if (isSubmitting.value || !form.value) return;

    const { valid } = await form.value.validate();
    if (!valid) return;

    isSubmitting.value = true;

    try {
        let sucesso = false;
        if (isEditing.value) {
            sucesso = await materialStore.atualizar( materialForm.idmaterial, materialForm );
        } else {
            sucesso = await materialStore.adicionar(materialForm);
        }

        if (sucesso) {
        alert(`Material ${isEditing.value ? 'atualizado' : 'cadastrado'} com sucesso!`);
        await materialStore.exibir();
        router.push('/admin/materiais');
        } else {
        alert('Falha ao salvar o material.');
        }
    } catch (error) {
        console.log('Erro ao salvar material', error);
        alert('Erro inesperado ao salvar.');
    } finally {
        isSubmitting.value = false;
    }
    }


/**cancelar e navegar de volta */
function cancelForm() {
    router.push('/admin/materiais');
}


// --- CICLOS DE VIDA ---

onMounted(async () => {
    isLoadingData.value = true;
    await Promise.all([
        idiomaStore.exibir(), 
        nivelStore.exibir(),
        tipoMaterialStore.exibir(),
    ]);
    isLoadingData.value = false; 

    await loadMaterialData();
});

</script>

<template>
    <v-container fluid>
        <v-skeleton-loader
            v-if="isLoadingData"
            type="article"
        ></v-skeleton-loader>

        <v-form v-else @submit.prevent="handleSubmit" ref="form" autocomplete="off">
            <v-card elevation="2" rounded="lg">
                
                <v-toolbar color="orange-darken-1" density="compact" flat class="rounded-b-0">
                    <v-toolbar-title class="text-white font-weight-bold ml-2">{{ formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon color="white" @click="cancelForm">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    
                    <v-card elevation="0" class="mb-6">
                        <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center py-2">
                            <v-icon icon="mdi-book-multiple-outline" class="mr-2"></v-icon>
                            Informações Básicas e Arquivo
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <v-row>
                                <v-col cols="12" md="6" class="py-1">
                                    <v-text-field v-model="materialForm.titulo" label="Título *" variant="outlined" density="compact"
                                        :rules="[rules.required]" hint="Título do material (ex: Livro de Gramática A1)"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6" class="py-1">
                                    <v-file-input v-model="materialForm.arquivo" label="Arquivo do Material (Opcional)" prepend-icon="mdi-file-upload"
                                        variant="outlined" density="compact" clearable truncate-length="20"
                                        hint="Selecione um novo arquivo para upload (PDF, ePub, etc.)"></v-file-input>
                                </v-col>
                                
                                <v-col cols="12" class="py-1">
                                    <v-textarea v-model="materialForm.descricao" label="Descrição Detalhada (Opcional)" variant="outlined"
                                        density="compact" rows="3" hint="Detalhes sobre o conteúdo, público-alvo e uso do material."></v-textarea>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card elevation="0" class="mb-6">
                        <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center py-2">
                            <v-icon icon="mdi-tag-outline" class="mr-2"></v-icon>
                            Classificação e Controle
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <v-row>
                                <v-col cols="12" md="4" class="py-1">
                                    <v-select v-model="materialForm.idtipoMaterial" label="Tipo de Material *" :items="tipoMaterialOptions"
                                        variant="outlined" density="compact" :rules="[rules.required]"
                                        item-title="title" item-value="value"
                                        hint="Ex: Livro, Apostila, Vídeo, Áudio."></v-select>
                                </v-col>

                                <v-col cols="12" md="4" class="py-1">
                                    <v-select v-model="materialForm.ididioma" label="Idioma *" :items="idiomaOptions" variant="outlined"
                                        density="compact" :rules="[rules.required]"
                                        item-title="title" item-value="value"
                                        hint="Idioma principal do material."></v-select>
                                </v-col>

                                <v-col cols="12" md="4" class="py-1">
                                    <v-select v-model="materialForm.idnivel" label="Nível de Proficiência *" :items="nivelOptions" variant="outlined"
                                        density="compact" :rules="[rules.required]"
                                        item-title="title" item-value="value"
                                        hint="Nível de proficiência (Básico, Intermediário, Avançado, etc.)"></v-select>
                                </v-col>

                                <v-col cols="12" md="4" class="py-1">
                                    <v-text-field v-model="materialForm.quantidade" label="Quantidade em Estoque *" variant="outlined"
                                        density="compact" type="number" min="0" :rules="[rules.required, rules.minQuantity]"
                                        hint="Apenas para materiais físicos/contáveis."></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-alert
                        v-if="isEditing"
                        type="info"
                        density="compact"
                        variant="tonal"
                        class="mt-4"
                    >
                        Deixe o campo **Arquivo** vazio para manter o arquivo atual.
                    </v-alert>

                </v-card-text>

            </v-card>
            
            <v-row justify="start" class="pt-4 pl-3 pr-3">
                <v-col cols="12" sm="4" md="3">
                    <v-btn 
                        type="submit" 
                        block 
                        color="orange-darken-1" 
                        size="large" 
                        elevation="2"
                        class="text-white font-weight-bold"
                        :loading="isSubmitting" 
                        :disabled="isSubmitting">
                        {{ submitButtonText }} 
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="3" md="2">
                    <v-btn 
                        @click="cancelForm" 
                        block 
                        variant="text" 
                        color="grey-darken-1" 
                        size="large"
                        :disabled="isSubmitting">
                        Cancelar
                    </v-btn>
                </v-col>
            </v-row>

        </v-form>
    </v-container>
</template>

<style scoped>
/* Estilos específicos se necessário */
</style>