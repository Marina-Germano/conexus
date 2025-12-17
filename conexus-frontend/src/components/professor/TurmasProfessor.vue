<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTurmaStore } from '@/stores/turmaStore';

const router = useRouter(); 
const turmaStore = useTurmaStore();


const turmas = computed(() => turmaStore.turmas || []);
const isLoading = ref(true);

const headers = ref([
    { title: 'Sala', align: 'start', key: 'sala' },
    { title: 'Idioma', align: 'start', key: 'idioma.nome' },
    { title: 'Nível', align: 'start', key: 'nivel.nome' },
    { title: 'Dias da Semana', align: 'start', key: 'diassemana' },
    { title: 'Horário', align: 'start', key: 'horainicio' },
    { title: 'Ações', align: 'center', key: 'actions', sortable: false },
]);


const getColumnWidth = (key) => {
    if (key === 'actions') return '150px';
    if (key === 'sala') return '12%';
    if (key === 'idioma.nome') return '18%';
    if (key === 'nivel.nome') return '18%';
    if (key === 'diassemana') return '22%';
    if (key === 'horainicio') return '12%';
    return 'auto';
};

//  buscar dados
async function fetchTurmas() {
    isLoading.value = true;
    try {
        await turmaStore.exibir();
    } catch (error) {
        console.error("Erro ao carregar turmas:", error);
    } finally {
        isLoading.value = false;
    }
}

function handleMarcarPresenca(item) {
    router.push({
        name: 'RegistroPresenca',
        params: {
            turmaId: item.idturma
        }
    });
}

function goToDashboard() {
    router.push({ path: '/professor/dashboard' });
}

onMounted(() => {
    fetchTurmas();
});
</script>

<template>
    
    <v-card class="turma-container" max-width="1200" elevation="2">
        
        <v-toolbar color="orange-darken-1" density="compact" flat class="custom-toolbar">
            <v-toolbar-title class="text-white font-weight-bold ml-2">Turmas</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                color="white"
                @click="goToDashboard"
                title="Voltar para o Dashboard"
            ></v-btn>
        </v-toolbar>

        <v-container fluid class="pa-0">
            
            <v-data-table
                :headers="headers"
                :items="turmas"
                item-key="idturma"
                :loading="isLoading"
                class="elevation-0 turma-table"
                :items-per-page="10"
                loading-text="Carregando dados, por favor aguarde..."
            >
                
                <template #item="{ item }">
                    <tr class="table-row">
                        <td :style="{ width: getColumnWidth('sala') }" class="text-left">{{ item.sala }}</td>
                        <td :style="{ width: getColumnWidth('idioma.nome') }" class="text-left">
                            {{ item.idioma ? item.idioma.nome : 'N/A' }}
                        </td>
                        <td :style="{ width: getColumnWidth('nivel.nome') }" class="text-left">
                            {{ item.nivel ? item.nivel.nome : 'N/A' }}
                        </td>
                        <td :style="{ width: getColumnWidth('diassemana') }" class="text-left">{{ item.diassemana }}</td>
                        <td :style="{ width: getColumnWidth('horainicio') }" class="text-left">
                            {{ item.horainicio ? item.horainicio.substring(0, 5) : 'N/A' }}
                        </td>
                        
                        <td :style="{ width: getColumnWidth('actions') }" class="text-center">
                            <v-btn 
                                color="#ffb300"
                                size="small"
                                class="text-none font-weight-bold" 
                                @click="handleMarcarPresenca(item)"
                            >
                                <v-icon start icon="mdi-account-check"></v-icon>
                                Marcar Presença
                            </v-btn>
                        </td>
                    </tr>
                </template>
                
                <template #no-data>
                    <div class="pa-4 text-center" v-if="!isLoading">
                        <v-icon size="40" color="grey-lighten-1">mdi-school-outline</v-icon>
                        <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhuma turma encontrada.</p>
                    </div>
                </template>

            </v-data-table>
        </v-container>
    </v-card>
</template>

<style scoped>
.turma-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

.custom-toolbar {
    background-color: #ffb300 !important; 
    border-radius: 8px 8px 0 0 !important;
    min-height: 48px !important; 
}


.turma-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    border-bottom: 1px solid #eee; 
    vertical-align: middle;
}


.turma-table :deep(td:last-child) {
    text-align: center;
}

.turma-table :deep(th) {
    font-weight: bold !important;
    text-transform: uppercase !important;
    font-size: 0.75rem !important; 
}
</style>