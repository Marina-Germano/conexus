<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMaterialStore } from '@/stores/materialStore';
import MaterialForm from '@/components/professor/MaterialForm.vue';


import { useTurmaStore } from '@/stores/turmaStore';

const materialStore = useMaterialStore();
const turmaStore = useTurmaStore();


const turmasDoProfessor = computed(() => turmaStore.turmas || []);

const materiais = computed(() => materialStore.materiais || []);

const isLoading = ref(false); 
const dialogCadastrar = ref(false);


const materialForm = ref({
    idmaterial: null,
    titulo: '',
    descricao: '',
    tipo: null,
    idioma: '',
    nivel: null, 
    link: '',
    idturma: null, 
});

const headers = ref([
    { title: 'Título', align: 'start', key: 'titulo' },
    { title: 'Idioma', align: 'start', key: 'idioma' },
    { title: 'Nível', align: 'start', key: 'nivel' },
    { title: 'Tipo', align: 'start', key: 'tipo' },
    { title: 'Link', align: 'start', key: 'link' },
    { title: 'Ações', align: 'center', key: 'actions', sortable: false },
]);


async function fetchMateriais() {
    isLoading.value = true;
    try {
        await materialStore.exibir();
        
        await turmaStore.exibir(); 
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    materialForm.value = {
        idmaterial: null,
        titulo: '',
        descricao: '',
        tipo: null,
        idioma: '',
        nivel: null,
        link: '',
        idturma: null, 
    };
}

function novoMaterial() {
    resetForm();
    dialogCadastrar.value = true;
}
 
// Liga o item da tabela ao v-model do formulário filho
function editItem(item) {
    
    materialForm.value = { ...item }; 
    dialogCadastrar.value = true;
}

async function deleteItem(item) {
    if (confirm(`Tem certeza que deseja apagar o material "${item.titulo}"?`)) {
        try {
            await materialStore.apagar(item.idmaterial);
        } catch (error) {
            console.error("Erro ao apagar material:", error);
            alert("Falha ao apagar o material. Tente novamente.");
        }
    }
}
//  recebe o evento salvo do MaterialForm.vue
async function salvarMaterial(formData) {

    dialogCadastrar.value = true; 
    try {
        const isEditing = !!formData.idmaterial;
        
        if (isEditing) {
            await materialStore.editar(formData); 
        } else {
            await materialStore.cadastrar(formData);
        }
        
        dialogCadastrar.value = false; 
    } catch (error) {
        console.error("Erro ao salvar material:", error);
        alert("Falha ao salvar material. Verifique os dados e tente novamente.");
    } 
}

onMounted(() => {
    fetchMateriais();
});
</script>

<template>
    <v-card class="material-container mt-4" max-width="1200" elevation="2"> 
        
        <v-toolbar color="orange-darken-1" density="compact" flat class="custom-toolbar">
            <v-toolbar-title class="text-white font-weight-bold ml-2">Meus Materiais Didáticos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                color="white"
                class="text-none font-weight-bold"
                icon="mdi-plus"
                size="small"
                @click="novoMaterial"
                title="Cadastrar Novo Material"
            ></v-btn>
        </v-toolbar>

        <v-container fluid class="pa-0">
            <v-data-table
                :headers="headers"
                :items="materiais" 
                item-key="idmaterial"
                :loading="isLoading"
                class="elevation-0 material-table"
                :items-per-page="10" 
                loading-text="Carregando dados, por favor aguarde..."
            >
                <template #item.link="{ item }">
                    <v-btn 
                        v-if="item.link" 
                        icon="mdi-link" 
                        size="small" 
                        variant="text"
                        :href="item.link" 
                        target="_blank"
                    ></v-btn>
                    <span v-else>N/A</span>
                </template>
                
                <template #item.actions="{ item }">
                    <v-icon
                        size="small"
                        class="me-2"
                        color="primary"
                        @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        size="small"
                        color="error"
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                
                <template #no-data>
                    <div class="pa-4 text-center" v-if="!isLoading">
                        <v-icon size="40" color="grey-lighten-1">mdi-book-open-page-variant-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum material didático cadastrado por você.</p>
                    </div>
                </template>
            </v-data-table>
        </v-container>
    </v-card>

    <v-dialog v-model="dialogCadastrar" max-width="500px">
        <MaterialForm 
            v-model="materialForm" 
            :turmasDisponiveis="turmasDoProfessor" 
            @save="salvarMaterial"
            @close="dialogCadastrar = false"
        />
    </v-dialog>
</template>

<style scoped>
.material-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

.custom-toolbar {
    background-color: #ffb300 !important; 
    border-radius: 8px 8px 0 0 !important;
    min-height: 48px !important; 
}

.material-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}

.material-table :deep(th) {
    font-weight: bold !important;
    text-transform: uppercase !important;
    font-size: 0.75rem !important; 
}
</style>