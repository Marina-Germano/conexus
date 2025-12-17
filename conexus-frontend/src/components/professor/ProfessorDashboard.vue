<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

// Importação das Stores necessárias
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores';
import { useTurmaStore } from '@/stores/turmaStore';
import { useAuthStore } from '@/stores/authStore'; 
// OBS: Assumimos que você tem uma store de Presença ou um Getter na CalendarioAulaStore
// para calcular as pendências.

// Inicialização de Hooks e Stores
const router = useRouter(); 
const authStore = useAuthStore();
const calendarioStore = useCalendarioAulaStore();
const turmaStore = useTurmaStore();

// ------------------------------------------------------------------
// ** 1. CARREGAMENTO DINÂMICO DOS DADOS DA API **
// ------------------------------------------------------------------
onMounted(async () => {
    // 1. Carrega todas as aulas do calendário.
    // O nome da Action pode variar (ex: 'buscarAulasDoProfessor').
    // Exemplo: await calendarioStore.buscarAulasDoProfessor(authStore.user?.idfuncionario);
    await calendarioStore.exibir(); 

    // 2. Carrega as turmas associadas a este professor.
    // Exemplo: await turmaStore.buscarTurmasDoProfessor(authStore.user?.idfuncionario);
    await turmaStore.exibir(); 
});


// ------------------------------------------------------------------
// ** 2. PROPRIEDADES COMPUTADAS (Dinâmicas) **
// ------------------------------------------------------------------

// Nome do professor logado (Dinâmico)
const professorName = computed(() => authStore.user?.nome || 'Professor(a)');

// Contagem de turmas ativas (Dinâmico, assume que turmaStore tem o estado 'turmas')
const turmasAtivasCount = computed(() => turmaStore.turmas?.length || 0); 

// Contagem de aulas com presença pendente (Dinâmico/Mock)
// Se não houver um getter na Store, mantemos um mock funcional.
const presencaPendenteCount = computed(() => {
    // Implemente a lógica real aqui: ex: calendarioStore.aulasPendentes.length;
    return 3; // Valor Mock Funcional
});


// Lista de próximas atividades (Dinâmico, mapeando dados da Store)
const proximasAulas = computed(() => {
    // Mapeia os dados brutos da Store para o formato da lista (mostra as 3 primeiras)
    if (calendarioStore.aulas && calendarioStore.aulas.length > 0) {
           // Ajuste as propriedades conforme o modelo de dados real da sua Store
        return calendarioStore.aulas
            .filter(aula => new Date(aula.start) >= new Date()) // Apenas futuras
            .map(aula => ({
                id: aula.id, // ou aula.idaula
                icon: 'mdi-calendar-check',
                title: aula.title || 'Aula Agendada', 
                time: new Date(aula.start).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                color: 'teal-darken-1',
                route: `/professor/aulas/${aula.id}` 
            }))
            .slice(0, 3);
    }
    // Mock de carregamento
    return [
        { id: 0, icon: 'mdi-information-outline', title: 'Nenhuma aula futura encontrada.', time: 'Verifique o calendário.', color: 'grey', route: '/professor/minhas-aulas' }
    ];
});


// ------------------------------------------------------------------
// ** 3. MAPA DE ROTAS E FUNÇÃO DE NAVEGAÇÃO **
// ------------------------------------------------------------------

const routes = {
    turmas: '/professor/turmas', // Mantido como Turmas
    presencaPendente: '/professor/lancar-presenca', // ATUALIZADO
    gerenciamentoCompleto: '/professor/dashboard-completo',
    lancarNotas: '/professor/lancar-notas', // ATUALIZADO
    gerenciarMateriais: '/professor/materiais-didaticos', 
    calendario: '/professor/minhas-aulas' 
};

function goTo(path) {
    router.push(path); 
}
</script>

<template>
    <v-container fluid class="pa-4">
        <h1 class="text-h5 mb-4 text-orange-darken-1">Painel do Professor</h1>

        <v-row>
            <v-col cols="12" md="4">
                
                <v-card class="pa-4 mb-4" elevation="4">
                    <div class="d-flex align-center">
                        <v-avatar color="orange-darken-1" size="64" class="mr-4">
                            <v-icon size="40">mdi-account-circle</v-icon>
                        </v-avatar>
                        <div>
                            <p class="text-subtitle-1 text-medium-emphasis mb-1">Bem-vindo(a),</p>
                            <h2 class="text-h5 font-weight-bold text-orange-darken-1">{{ professorName }}</h2>
                        </div>
                    </div>
                </v-card>

                <v-card class="pa-4" elevation="4">
                    <h3 class="text-subtitle-1 font-weight-medium mb-3">Gerenciamento Rápido</h3>
                    
                    <v-list density="compact" class="pa-0">
                        <v-list-item 
                            :title="`Turmas Ativas: ${turmasAtivasCount}`"
                            prepend-icon="mdi-account-group-outline"
                            :append-class="turmasAtivasCount > 0 ? 'text-green-darken-1' : ''"
                            @click="goTo(routes.turmas)"
                        ></v-list-item>
                        
                        <v-list-item 
                            :title="`Aulas com Presença Pendente: ${presencaPendenteCount}`"
                            prepend-icon="mdi-clipboard-list-outline"
                            :append-class="presencaPendenteCount > 0 ? 'text-red-darken-1' : ''"
                            @click="goTo(routes.presencaPendente)"
                        >
                            <template v-slot:append>
                                <v-chip v-if="presencaPendenteCount > 0" size="small" color="red" label>{{ presencaPendenteCount }}</v-chip>
                            </template>
                        </v-list-item>
                    </v-list>
                    
                    <v-divider class="my-3"></v-divider>
                    
                    <v-btn 
                        block 
                        variant="text" 
                        color="orange-darken-1" 
                        size="small" 
                        @click="goTo(routes.gerenciamentoCompleto)"
                    >
                        Acessar Gerenciamento Completo
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-card 
                            class="pa-4 d-flex align-center justify-space-between rounded-lg bg-orange-lighten-4" 
                            elevation="4" 
                            link 
                            @click="goTo(routes.lancarNotas)"
                        >
                            <div>
                                <h3 class="text-h6 font-weight-medium text-orange-darken-2">Lançar Notas</h3>
                                <p class="text-caption text-medium-emphasis">Registrar notas e avaliações.</p>
                            </div>
                            <v-icon size="56" color="orange-darken-2">mdi-chart-bar</v-icon>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-card 
                            class="pa-4 d-flex align-center justify-space-between rounded-lg bg-blue-grey-lighten-4" 
                            elevation="4" 
                            link 
                            @click="goTo(routes.gerenciarMateriais)"
                        >
                            <div>
                                <h3 class="text-h6 font-weight-medium text-blue-grey-darken-2">Gerenciar Materiais</h3>
                                <p class="text-caption text-medium-emphasis">Adicionar ou editar materiais didáticos.</p>
                            </div>
                            <v-icon size="56" color="blue-grey-darken-2">mdi-bookshelf</v-icon>
                        </v-card>
                    </v-col>
                </v-row>
                
                <v-card class="pa-4 mt-4" elevation="4">
                    <h3 class="text-subtitle-1 font-weight-medium mb-3">Próximas Atividades</h3>
                    
                    <v-list density="comfortable">
                        <v-list-item 
                            v-for="aula in proximasAulas" 
                            :key="aula.id" 
                            class="px-0" 
                            @click="goTo(aula.route)"
                            link
                        >
                            <v-list-item-title class="font-weight-regular">{{ aula.title }}</v-list-item-title>
                            <v-list-item-subtitle class="text-caption">{{ aula.time }}</v-list-item-subtitle>
                            
                            <template v-slot:prepend>
                                <v-icon :color="aula.color">{{ aula.icon }}</v-icon>
                            </template>
                            
                            <template v-slot:append>
                                <v-btn 
                                    icon 
                                    variant="plain" 
                                    size="small" 
                                    :color="aula.color" 
                                >
                                    <v-icon>mdi-arrow-right</v-icon>
                                </v-btn>
                            </template>
                        </v-list-item>
                    </v-list>

                    <v-divider class="my-3"></v-divider>
                    
                    <v-btn 
                        variant="text" 
                        color="orange-darken-1" 
                        size="small" 
                        @click="goTo(routes.calendario)"
                    >
                        <v-icon start>mdi-calendar</v-icon>
                        Ver Calendário de Aulas
                    </v-btn>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>