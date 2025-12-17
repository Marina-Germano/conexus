<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMaterialStore } from '@/stores/materialStore'; 

const materialStore = useMaterialStore();

// --- Estado Reativo ---
const filtroCurso = ref('Todos');
const filtroTipo = ref('Todos');

// Usando o estado real da store e um estado de carregamento
const todosOsMateriais = computed(() => materialStore.materiais);
const isLoading = computed(() => materialStore.isLoading); 

// Estes são populados dinamicamente com base nos dados reais disponíveis
const cursosDisponiveis = computed(() => [
    'Todos', 
    ...new Set(todosOsMateriais.value.map(m => m.curso))
]);
const tiposDeMaterial = computed(() => [
    'Todos', 
    ...new Set(todosOsMateriais.value.map(m => m.tipo))
]);


// --- Lógica de Filtro ---
const materiaisFiltrados = computed(() => {
    return todosOsMateriais.value.filter(material => {
        const cursoMatch = filtroCurso.value === 'Todos' || material.curso === filtroCurso.value;
        const tipoMatch = filtroTipo.value === 'Todos' || material.tipo === filtroTipo.value;
        return cursoMatch && tipoMatch;
    });
});

// --- Funções de Ajuda Visual ---
const getCorProgresso = (progresso) => {
    if (progresso === 100) return 'success';
    if (progresso > 50) return 'warning';
    return 'info';
};

const abrirMaterial = (link) => {
    // Lógica para abrir o link do material
    window.open(link, '_blank');
};

onMounted(() => {
    // Carregar todos os materiais do aluno ao montar
    // materialStore.exibirMateriaisDoAluno(); 
});
</script>

<template>
    <v-container fluid class="pa-6 altura-completa-conteudo" role="main">
        
        <v-divider class="mb-8"></v-divider>

        <v-card class="pa-4 mb-6" elevation="4">
            <v-card-title class="headline">
                <v-icon left>mdi-book-multiple</v-icon>
                Biblioteca de Materiais
            </v-card-title>
            
            <v-divider class="mt-2 mb-4"></v-divider>
            
            <v-row>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="filtroCurso"
                        :items="cursosDisponiveis"
                        label="Filtrar por Curso"
                        prepend-icon="mdi-book-open"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="filtroTipo"
                        :items="tiposDeMaterial"
                        label="Filtrar por Tipo"
                        prepend-icon="mdi-file-document-box"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
        </v-card>

        <div v-if="isLoading" class="text-center pa-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-2">Carregando materiais...</p>
        </div>

        <v-row v-else>
            <v-col 
                v-for="material in materiaisFiltrados" 
                :key="material.id" 
                cols="12" sm="6" lg="4"
            >
                <v-card class="material-card elevation-2 hover-effect" @click="abrirMaterial(material.link)">
                    <v-list-item lines="three">
                        <template v-slot:prepend>
                            <v-icon size="40" :color="getCorProgresso(material.progresso)">{{ material.icon }}</v-icon>
                        </template>

                        <v-list-item-title class="font-weight-bold text-wrap">{{ material.titulo }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                            {{ material.curso }} | Tipo: {{ material.tipo }}
                        </v-list-item-subtitle>
                        
                        <v-progress-linear 
                            :model-value="material.progresso" 
                            :color="getCorProgresso(material.progresso)"
                            height="5"
                            class="my-1"
                            rounded
                        ></v-progress-linear>

                        <template v-slot:append>
                            <div class="d-flex flex-column align-center">
                                <v-progress-circular
                                    :model-value="material.progresso"
                                    :color="getCorProgresso(material.progresso)"
                                    :size="48"
                                    :width="5"
                                >
                                    <span class="text-caption font-weight-bold">{{ material.progresso }}%</span>
                                </v-progress-circular>
                                <v-chip 
                                    v-if="material.progresso === 100" 
                                    color="green" 
                                    size="small" 
                                    class="mt-1"
                                    density="comfortable"
                                >
                                    Completo
                                </v-chip>
                            </div>
                        </template>
                    </v-list-item>
                </v-card>
            </v-col>

            <v-col cols="12" v-if="materiaisFiltrados.length === 0 && !isLoading">
                <v-alert type="info" variant="tonal">
                    Nenhum material encontrado para os filtros selecionados.
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.altura-completa-conteudo {
    min-height: calc(100vh - 64px); 
}
.material-card {
    cursor: pointer;
}
.hover-effect {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-effect:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
}
</style>