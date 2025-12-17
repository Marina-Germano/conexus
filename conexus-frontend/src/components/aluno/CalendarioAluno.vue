<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores'; 
import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

// --- STORES E ESTADO DE DATA ---
const calendarioAulaStore = useCalendarioAulaStore();
const funcionarioStore = useFuncionarioStore();

// Usando o estado real da store
const aulasDoMes = computed(() => calendarioAulaStore.aulas);
const isLoading = computed(() => calendarioAulaStore.isLoading); 

const dataAtual = ref(new Date()); 
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // Nomes abreviados

// --- FUNÇÕES DE CALENDÁRIO ---

const mesDoCalendario = computed(() => dataAtual.value.getMonth());
const anoDoCalendario = computed(() => dataAtual.value.getFullYear());

function mudarMes(delta) {
    const novaData = new Date(dataAtual.value);
    novaData.setMonth(novaData.getMonth() + delta);
    dataAtual.value = novaData;
    // Chamar a action para recarregar as aulas do novo mês (descomente quando estiver pronto)
    // calendarioAulaStore.exibir(anoDoCalendario.value, mesDoCalendario.value);
}

function getDiasDoMes() {
    const ano = anoDoCalendario.value;
    const mes = mesDoCalendario.value;
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const numDias = ultimoDia.getDate();
    const diaDaSemanaInicio = primeiroDia.getDay(); 
    
    const dias = [];
    
    // Preencher dias vazios no início
    for (let i = 0; i < diaDaSemanaInicio; i++) {
        dias.push({ isVazio: true });
    }

    // Obter a data de hoje para destacar
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    // Preencher dias do mês
    for (let i = 1; i <= numDias; i++) {
        const dataCompleta = new Date(ano, mes, i);
        const aulasDoDia = buscarAulasPorDia(dataCompleta);
        const dataFormatada = dataCompleta.toLocaleDateString('pt-BR');

        dias.push({ 
            isVazio: false, 
            numero: i, 
            data: dataFormatada, 
            isHoje: dataFormatada === hoje,
            aulas: aulasDoDia
        });
    }

    // Preencher dias vazios no final
    while (dias.length % 7 !== 0) {
        dias.push({ isVazio: true });
    }

    return dias;
}

function buscarAulasPorDia(data) {
    const dataString = data.toLocaleDateString('pt-BR'); 
    
    // Se a store de aulas não foi carregada ou está vazia
    if (!aulasDoMes.value || aulasDoMes.value.length === 0) {
        return [];
    }

    // Esta parte do código depende da estrutura real da sua store
    return aulasDoMes.value.filter(aula => {
        // Assegure que aula.dataaula é uma string de data válida
        const dataAulaFormatada = new Date(aula.dataaula).toLocaleDateString('pt-BR');
        return dataAulaFormatada === dataString;
    }).map(aula => {
        // Assume que a store de funcionário tem um getter eficiente
        const professor = funcionarioStore.getFuncionarioById(aula.idfuncionario)?.nome || 'Professor Desconhecido';
        return {
            ...aula,
            // Certifica que horainicio está formatado corretamente (ex: 08:00)
            horainicio: aula.horainicio ? aula.horainicio.substring(0, 5) : 'N/A',
            professor: professor
        };
    });
}

const diasDoCalendario = computed(() => getDiasDoMes());

// --- CICLO DE VIDA ---
onMounted(() => {
    // Chame as actions de carregamento aqui
    // funcionarioStore.exibir(); 
    // calendarioAulaStore.exibir(); 
});

// Supondo que você terá uma modal de detalhes da aula
function abrirModalAula(aula) {
    alert(`Detalhes da Aula: ${aula.titulo || aula.descricao}: ${aula.professor} - ${aula.horainicio} na sala ${aula.sala}`);
    // Implementação real abriria um v-dialog
}

</script>

<template>
    <v-container fluid class="pa-6" role="main">
        
        <h3 class="text-h5 mb-4 font-weight-medium"> Calendário de Aulas</h3>
        <v-divider class="mb-8"></v-divider>

        <v-card class="calendar-card" elevation="4">
            
            <v-card-title class="headline d-flex justify-space-between align-center pa-4 bg-primary text-white">
                <v-btn icon @click="mudarMes(-1)" flat color="white">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-h6 font-weight-bold">
                    {{ dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }}
                </span>
                <v-btn icon @click="mudarMes(1)" flat color="white">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-card-title>

            <v-row no-gutters class="dias-semana-cabecalho text-center text-caption py-3 font-weight-bold border-b">
                <v-col v-for="dia in diasDaSemana" :key="dia" class="text-uppercase">{{ dia }}</v-col>
            </v-row>
            
            <div v-if="isLoading" class="text-center pa-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p class="mt-4 text-subtitle-1 text-medium-emphasis">Carregando calendário...</p>
            </div>

            <div v-else class="calendar-grid-row">
                <div 
                    v-for="(dia, index) in diasDoCalendario" 
                    :key="index"
                    class="calendar-day-col"
                    :class="{ 
                        'is-vazio': dia.isVazio, 
                        'day-with-class': dia.aulas && dia.aulas.length > 0,
                    }"
                >
                    <div class="day-content">
                        <div v-if="!dia.isVazio" class="day-number-wrapper">
                            <span 
                                class="day-number" 
                                :class="{ 'highlight-today': dia.isHoje }"
                            >
                                {{ dia.numero }}
                            </span>
                        </div>
                        
                        <div v-if="dia.aulas && dia.aulas.length > 0" class="mt-1">
                            <v-sheet 
                                v-for="aula in dia.aulas.slice(0, 3)" 
                                :key="aula.idaula"
                                elevation="1"
                                color="teal-lighten-5" 
                                class="aula-event-sheet text-caption text-truncate"
                                :class="{'bg-teal-lighten-4': dia.isHoje}"
                                @click.stop="abrirModalAula(aula)"
                            >
                                <span class="font-weight-bold">{{ aula.horainicio }}</span>
                                <span class="ml-1 text-medium-emphasis">({{ aula.sala }})</span>
                            </v-sheet>
                            
                            <v-chip 
                                v-if="dia.aulas.length > 3" 
                                density="compact" 
                                size="x-small"
                                color="grey"
                                class="mt-1 text-truncate"
                            >
                                +{{ dia.aulas.length - 3 }} Aulas
                            </v-chip>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-container>
</template>

<style scoped>
/* Cor da barra do mês (verde-água) */
.bg-primary {
    background-color: #2fa99e !important;
}

/* Garante que o texto do mês na barra de título fique branco */
.bg-primary.v-card-title span {
    color: white !important;
}

.text-white {
    color: white;
}
.calendar-card {
    border-radius: 8px;
    overflow: hidden; 
}

/* 1. LAYOUT DA GRADE */
.calendar-grid-row {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    /* Usando variáveis para ser compatível com Dark Mode */
    border-left: 1px solid rgb(var(--v-theme-surface-variant)); 
    border-top: 1px solid rgb(var(--v-theme-surface-variant)); 
}

.calendar-day-col {
    flex: 0 0 14.2857%; 
    max-width: 14.2857%;
    min-height: 120px; 
    padding: 0 !important;
    
    /* Inverte as bordas para criar a grade */
    border-right: 1px solid rgb(var(--v-theme-surface-variant));
    border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
    
    background-color: rgb(var(--v-theme-surface)); /* Fundo padrão do tema */
    transition: background-color 0.15s ease;
}

/* 2. ESTADOS DO DIA */
.is-vazio {
    background-color: rgba(var(--v-theme-surface-variant), 0.1) !important; /* Fundo mais claro para dias vazios */
}

/* ALTERAÇÃO CRÍTICA AQUI:
  Muda o efeito de hover de volta para o azul/verde-água com baixa opacidade 
  (cor hexadecimal #2fa99e convertida para RGBa com 10% de opacidade).
*/
.calendar-day-col:hover:not(.is-vazio) {
    background-color: rgba(47, 169, 158, 0.1) !important; 
    cursor: pointer;
}

/* 3. CONTEÚDO DO DIA */
.day-content {
    padding: 8px;
    height: 100%;
}

.day-number-wrapper {
    display: flex;
    justify-content: flex-end; 
    margin-bottom: 5px;
}

.day-number {
    font-size: 1.1em;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface));
    width: auto;
    height: 28px;
    line-height: 28px;
    text-align: center;
    padding: 0 8px;
}

.highlight-today {
    background-color: #2fa99e !important; /* Cor exata solicitada */
    color: white !important;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    padding: 0;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 4. ESTILO DOS EVENTOS (AULAS) */
.aula-event-sheet {
    padding: 2px 4px;
    border-radius: 4px;
    margin-bottom: 4px;
    cursor: pointer;
    line-height: 1.4;
    font-size: 0.75rem; 
    color: rgb(var(--v-theme-on-surface));
}

.aula-event-sheet:hover {
    background-color: var(--v-theme-teal-lighten-4); 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>