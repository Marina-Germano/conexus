<script setup>
import { defineEmits, onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores'; 
import { useRouter } from 'vue-router';
import '@/assets/layouts/admin_style.css'

const STATUS_AULA_CORES_LEGENDA = {
    agendada: { cor: 'blue-darken-1', label: 'Agendada' }, 
    realizada: { cor: 'green-darken-1', label: 'Realizada' },      
    reagendada: { cor: 'orange-darken-1', label: 'Reagendada' },
    cancelada: { cor: 'red-darken-3', label: 'Cancelada' }, 
};

const emit = defineEmits(['createEvent', 'editEvent']);
const router = useRouter(); 

const store = useCalendarioAulaStore(); 
const { calendarEvents: rawStoreEvents, loading: storeLoading } = storeToRefs(store); 

const loading = storeLoading;

// VARIÁVEIS DE CONTROLE DA AGENDA
const today = new Date().toISOString().substring(0, 10);
const calendarStart = ref(today); 

// --- NOVO: FUNÇÃO PARA MAPEAR O STATUS DO EVENTO PARA A COR CORRETA ---
const mapearEventosParaView = computed(() => {
    if (!rawStoreEvents.value) return [];
    
    return rawStoreEvents.value.map(event => {
        const statusKey = event.status ? event.status.toLowerCase() : 'agendada';
        const corData = STATUS_AULA_CORES_LEGENDA[statusKey] || STATUS_AULA_CORES_LEGENDA['agendada'];
        
        return {
            ...event,
            // Adiciona a propriedade 'color' que é usada no v-calendar e na v-list-item
            color: corData.cor, 
            statusLabel: corData.label
        };
    });
});

// Agora, calendarEvents é o resultado do mapeamento, incluindo a cor.
const calendarEvents = mapearEventosParaView;

// Navegação de Mês
function changeMonth(delta) {
    const date = new Date(calendarStart.value);
    date.setMonth(date.getMonth() + delta);
    calendarStart.value = date.toISOString().substring(0, 10);
}

const prevMonth = () => changeMonth(-1);
const nextMonth = () => changeMonth(1);

// Função de Volta para Dashboard 
function cancelForm() {
    router.push('/admin/dashboard'); 
}

// Ação de Clique na Data (Criação de Nova Aula)
const handleDateClick = ({ date }) => {
    // Dados iniciais de uma NOVA AULA
    const newAulaData = {
        title: '',
        turma_id: null,
        professor_id: null,
        sala_id: null,
        conteudo: '',
        link_reuniao: '',
        status: 'agendada',
        start: `${date}T09:00:00`, 
        end: `${date}T10:00:00`,
    };
    emit('createEvent', newAulaData); // Dispara a abertura do formulário
};

// --- SIMPLIFICADO: Não precisa mais de event.item || event ---
const handleEventClick = (event) => {
    emit('editEvent', { ...event }); // Dispara a abertura do formulário
};

// auxiliar para formatar a chave do mês e ano
const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
};

// AGRUPAR EVENTOS POR MÊS/ANO
const groupedEvents = computed(() => {
    if (!calendarEvents.value || calendarEvents.value.length === 0) {
    return {};
    }

    const groups = {};
    
    // Usa calendarEvents (já mapeado)
    const sortedEvents = [...calendarEvents.value].sort((a, b) => new Date(a.start) - new Date(b.start));

    sortedEvents.forEach(event => {
    const monthYear = formatMonthYear(event.start);

    if (!groups[monthYear]) {
        groups[monthYear] = [];
    }

    groups[monthYear].push(event);
    });
    
    return groups;
});

// Busca as aulas do banco de dados ao montar o componente
onMounted(() => {
    // Verifique o nome real da action na sua store useCalendarioAulaStore
    store.fetchEvents(); 
});
</script>

<template>
    <v-toolbar color="orange-darken-1" density="compact" flat class="mb-0 rounded-b-0">
    <v-toolbar-title class="text-white font-weight-bold ml-2">
        <v-icon start>mdi-calendar-month</v-icon>
        Gerenciar Agenda e Aulas
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon color="white" @click="cancelForm">
        <v-icon>mdi-close</v-icon>
    </v-btn>
    </v-toolbar>

    <v-card class="pa-4" :loading="loading" elevation="0" rounded="0">

    <v-card-title class="d-flex align-center pb-0">
        <v-spacer></v-spacer>
        <v-btn 
        color="orange-darken-1" 
        @click="handleDateClick({ date: today })"
        >
        <v-icon start>mdi-calendar-plus</v-icon>
        Nova Aula
        </v-btn>
    </v-card-title>
    
    <v-card-text>
        
        <div class="d-flex justify-center align-center py-2">
        <v-btn icon size="small" variant="text" @click="prevMonth">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        
        <h4 class="text-h6 mx-4">
            {{ new Date(calendarStart).toLocaleString('pt-BR', { month: 'long', year: 'numeric' }) }}
        </h4>
        
        <v-btn icon size="small" variant="text" @click="nextMonth">
            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        </div>

        <v-calendar
        class="mt-4"
        type="month"
        :start="calendarStart" 
        :items="calendarEvents"
        :weekdays="[0, 1, 2, 3, 4, 5, 6]"
        @click:date="handleDateClick"
        @click:item="handleEventClick" 
        :today="today"
        color="orange-darken-1"
        ></v-calendar>

        <h3 class="text-h6 mt-6 mb-2 font-weight-bold">
            Mapa de Cores dos Status das Aulas
        </h3>

        <v-card variant="outlined" class="pa-3 mb-6">
            <div class="d-flex flex-wrap align-center">
                <div 
                    v-for="(item, key) in STATUS_AULA_CORES_LEGENDA" 
                    :key="key" 
                    class="d-flex align-center mr-4 my-1"
                >
                    <v-icon :color="item.cor" size="small">mdi-circle</v-icon>
                    <span class="ml-2 text-caption font-weight-medium">{{ item.label }}</span>
                </div>
            </div>
        </v-card>
        
        <h3 class="text-h5 mt-6 mb-3 font-weight-bold">
        Lista Detalhada de Aulas
        </h3>

        <v-divider class="mb-4"></v-divider>

        <div v-if="Object.keys(groupedEvents).length > 0">
        <div v-for="(events, monthYear) in groupedEvents" :key="monthYear" class="mb-6">
            <v-subheader class="text-h6 font-weight-medium bg-grey-lighten-3 rounded-t-lg mb-2">
            {{ monthYear }}
            </v-subheader>
            
            <v-list density="compact" class="py-0">
            <v-list-item
                v-for="event in events"
                :key="event.id"
                :title="event.title"
                :subtitle="event.turma_nome || event.descricao"
                @click="handleEventClick(event)"
                class="border-b"
            >
                <template v-slot:prepend>
                <v-icon :color="event.color">mdi-school</v-icon>
                </template>

                <template v-slot:append>
                <div class="text-caption text-right">
                    {{ new Date(event.start).toLocaleDateString('pt-BR') }}<br>
                    {{ new Date(event.start).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) }}
                </div>
                </template>
            </v-list-item>
            </v-list>
        </div>
        </div>

        <v-alert v-else type="info" variant="tonal">
        Nenhuma aula cadastrada para exibição.
        </v-alert>

        </v-card-text>
    </v-card>
</template>