<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAlunoStore } from '@/stores/alunoStore'; 
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores'; 
import { useAvaliacaoStore } from '@/stores/avaliacaoStores'; 

const alunoStore = useAlunoStore();
const calendarioStore = useCalendarioAulaStore();
const avaliacaoStore = useAvaliacaoStore();

const kpis = ref([]);
const atividades = ref([]);

// Nome do aluno logado (Dinâmico: assume que AlunoStore tem o objeto 'alunoData')
const alunoName = computed(() => {
    // Adicione a sua lógica REAL de autenticação/dados aqui.
    return alunoStore.alunoData?.nome || 'Aluno(a)'; 
});


// Dados dos Cards (KPIs) - Cor #2FA99E aplicada
const dashboardCards = computed(() => {
    const mediaGeral = alunoStore.mediaGeral || 'N/D';
    const faltasMes = alunoStore.faltasMes || '0';
    const proximaProva = calendarioStore.proximaProva?.materia || 'Verificar';
    const trabalhosPendentes = avaliacaoStore.trabalhosPendentes?.length || '0';

    return [
        { title: 'Média Geral', value: mediaGeral, icon: 'mdi-school', color: '#2FA99E', to: '/aluno/notas' },
        { title: 'Faltas no Mês', value: faltasMes, icon: 'mdi-calendar-remove', color: '#2FA99E', to: '/aluno/frequencia' },
        { title: 'Próxima Prova', value: proximaProva, icon: 'mdi-file-edit-outline', color: '#2FA99E', to: '/aluno/calendario' },
        { title: 'Trabalhos Pendentes', value: trabalhosPendentes, icon: 'mdi-folder-alert-outline', color: '#2FA99E', to: '/aluno/trabalhos' },
    ];
});

// Lista de Próximas Atividades (Removendo mock dos textos e datas)
const upcomingActivities = computed(() => {
    if (calendarioStore.proximasAtividades?.length) {
        return calendarioStore.proximasAtividades.slice(0, 3).map(atividade => ({
            icon: atividade.tipo === 'prova' ? 'mdi-calendar-alert' : 'mdi-book-open-page-variant-outline',
            text: atividade.descricao, 
            date: new Date(atividade.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        }));
    }
    
    return [
        { icon: 'mdi-information-outline', text: 'Nenhuma atividade próxima.', date: 'N/D' }
    ];
});

// Carrega os dados reais ao montar o componente
onMounted(async () => {
    try {
        await alunoStore.fetchAlunoData(); 
        await calendarioStore.fetchUpcomingActivities();
    } catch (error) {
        console.error("Erro ao carregar dados do aluno:", error);
    }
});
</script>

<template>
    <v-container fluid class="pa-6" role="main">
        
        <v-row class="mb-8">
            <v-col cols="12">
                <v-card class="pa-4" elevation="4">
                    <div class="d-flex align-center">
                        <v-avatar color="orange-darken-1" size="64" class="mr-4">
                            <v-icon size="40">mdi-account-circle</v-icon>
                        </v-avatar>
                        <div>
                            <p class="text-subtitle-1 text-medium-emphasis mb-1">Bem-vindo(a),</p>
                            <h2 class="text-h5 font-weight-bold text-orange-darken-1">{{ alunoName }}</h2>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        
        <v-row class="mb-8">
            <v-col v-for="(card, index) in dashboardCards" :key="index" cols="12" sm="6" md="3">
                <v-card 
                    :to="card.to" 
                    :color="card.color" 
                    dark 
                    class="pa-5 text-white dashboard-card" 
                    elevation="8"
                >
                    <v-row no-gutters align="start">
                        <v-col cols="4" class="text-start">
                            <v-icon size="64" class="opacity-75">
                                {{ card.icon }}
                            </v-icon>
                        </v-col>
                        <v-col cols="8" class="text-right">
                            <v-card-title class="text-subtitle-2 font-weight-light pa-0">{{ card.title }}</v-card-title>
                            <v-card-text class="text-h6 font-weight-bold pa-0 mt-1">{{ card.value }}</v-card-text>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12" md="12"> 
                <v-card elevation="4" class="card-detalhe">
                    <v-card-title class="bg-teal-lighten-2 text-white text-h6 font-weight-medium">Próximas Atividades</v-card-title>
                    <v-list density="comfortable">
                        <v-list-item v-for="(item, index) in upcomingActivities" :key="index" class="list-item-hover">
                            <template v-slot:prepend>
                                <v-icon :color="index % 2 === 0 ? 'orange-darken-1' : 'teal-darken-1'">{{ item.icon }}</v-icon>
                            </template>
                            <v-list-item-title class="text-body-1">{{ item.text }}</v-list-item-title>
                            <template v-slot:append>
                                <v-chip density="compact" color="blue-grey-darken-1" class="text-white font-weight-bold">{{ item.date }}</v-chip>
                            </template>
                        </v-list-item>
                        
                        <v-list-item to="/aluno/materiais" class="py-2 bg-grey-lighten-4">
                            <v-btn 
                                block 
                                color="teal-darken-1" 
                                variant="flat" 
                                class="font-weight-bold"
                            >
                                Material de Estudo em Destaque
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<style scoped>
.dashboard-card {
    border-radius: 12px;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.dashboard-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25) !important;
}
.card-detalhe {
    border-radius: 8px;
}
.list-item-hover:hover {
    background-color: rgba(0, 0, 0, 0.03); 
}
.v-list {
    padding: 0 !important;
}
.opacity-75 {
    opacity: 0.9;
}
</style>