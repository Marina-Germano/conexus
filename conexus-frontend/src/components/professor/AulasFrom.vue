<script setup>
import { ref, watch, toRaw } from 'vue';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores';

const props = defineProps({
    modelValue: Boolean,
    initialData: Object,
    isEditing: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const store = useCalendarioAulaStore(); 
const formRef = ref(null);

const formData = ref({});

const rules = { required: v => !!v || 'Campo obrigatório' };


const statusAulaOptions = [
    { title: 'Agendada', value: 'agendada', color: 'blue-darken-1' }, 
    { title: 'Realizada', value: 'realizada', color: 'green-darken-1' }, 
    { title: 'Reagendada', value: 'reagendada', color: 'orange-darken-1' },
    { title: 'Cancelada', value: 'cancelada', color: 'red-darken-3' }
];


const mockTurmas = [];

const mockSalas = [];


watch(() => props.initialData, (newVal) => {
    
    if (!newVal || Object.keys(newVal).length === 0) {
        formData.value = {
            title: '',
            turma_id: null,
            professor_id: null,
            sala_id: null,
            conteudo: '',
            link_reuniao: '',
            status: 'agendada',
            start: `${new Date().toISOString().substring(0, 10)}T09:00:00`,
            end: `${new Date().toISOString().substring(0, 10)}T10:00:00`,
        };
    } else {
        
        formData.value = { ...newVal };
    }
}, { immediate: true });


async function handleSubmit() {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
    await store.saveAula(toRaw(formData.value)); 
    
    closeDialog(); 
}

async function handleDelete() {
    if (confirm('Tem certeza que deseja excluir esta Aula? Esta ação não pode ser desfeita.')) {
        await store.deleteAula(formData.value.id); 
        
        closeDialog(); 
    }
}

function closeDialog() {
    emit('update:modelValue', false);
}
</script>

<template>
    
    <v-dialog :model-value="modelValue" @update:model-value="closeDialog" max-width="700">
        <v-card>
            <v-card-title class="bg-orange-darken-1 text-white">
                <v-icon start>mdi-account-clock-outline</v-icon>
                {{ isEditing ? 'Editar Aula' : 'Cadastrar Nova Aula' }}
            </v-card-title>
            <v-card-text class="pt-4">
                <v-form ref="formRef" @submit.prevent="handleSubmit">
                    
                    <v-row>
                        <v-col cols="12" sm="6" class="py-0">
                            <v-select
                                v-model="formData.turma_id"
                                :items="mockTurmas"
                                item-title="nome" item-value="id"
                                label="Turma *"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" class="py-0">
                            <v-text-field
                                v-model="formData.title"
                                label="Título/Assunto da Aula *"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                                hint="Ex: Unit 5 - Simple Past"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="6" class="py-0">
                            <v-text-field
                                v-model="formData.start"
                                label="Início (Data e Hora) *"
                                type="datetime-local"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" class="py-0">
                            <v-text-field
                                v-model="formData.end"
                                label="Fim (Data e Hora) *"
                                type="datetime-local"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="4" class="py-0">
                            <v-select
                                v-model="formData.sala_id"
                                :items="mockSalas"
                                item-title="nome" item-value="id"
                                label="Sala (Local) *"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" class="py-0">
                            <v-select
                                v-model="formData.status"
                                :items="statusAulaOptions"
                                item-title="title" item-value="value"
                                label="Status da Aula *"
                                :rules="[rules.required]"
                                variant="outlined" density="compact" class="mb-2"
                                
                            >
                            <template v-slot:item="{ props, item }">
                                <v-list-item 
                                    v-bind="props" 
                                    :title="item.title"
                                    :prepend-icon="`mdi-circle-small`"
                                    :color="item.raw.color"
                                ></v-list-item>
                            </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="4" class="py-0">
                            <v-text-field 
                                v-model="formData.link_reuniao" 
                                label="Link de Reunião (Se Online)" 
                                variant="outlined" 
                                density="compact" 
                                class="mb-2"
                                hint="URL para Google Meet, Zoom, etc."
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-textarea
                        v-model="formData.conteudo"
                        label="Conteúdo Programático da Aula"
                        variant="outlined" density="compact" rows="3" class="mb-2"
                        hint="Descreva os tópicos a serem abordados"
                    ></v-textarea>

                    <v-alert
                        v-if="isEditing && formData.status === 'realizada'"
                        type="info"
                        variant="tonal"
                        class="mb-3"
                    >
                        <div class="d-flex align-center justify-space-between">
                            <span>Gerenciar Presença (RF07) e Conteúdo.</span>
                            <v-btn color="blue" variant="tonal" size="small">
                                <v-icon start>mdi-list-status</v-icon>
                                Abrir Diário
                            </v-btn>
                        </div>
                    </v-alert>
                    
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4 d-flex justify-space-between">
                <v-btn v-if="isEditing" color="red-darken-1" variant="tonal" @click="handleDelete">
                    <v-icon start>mdi-delete</v-icon> Excluir Aula
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>

                <v-btn color="orange-darken-1" variant="flat" @click="handleSubmit">
                    <v-icon start>mdi-content-save</v-icon>
                    {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Aula' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>