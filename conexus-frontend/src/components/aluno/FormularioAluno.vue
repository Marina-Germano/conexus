<script setup>
import { ref } from 'vue';
import { useContatoStore } from '@/stores/contatoStores'; 

const contatoStore = useContatoStore(); 

const email = ref('');
const telefone = ref('');
const matricula = ref('');
const motivo = ref(null);
const mensagem = ref('');
const arquivo = ref(null);

// Dados estáticos de contato da empresa
const contactInfo = ref({
    telefone: '(32) 99999-9999',
    email: 'contato@conexus.com.br',
    endereco: 'Av. Principal, 1234 - Centro - Cidade/Estado'
});

// Estado para controlar o Snackbar (notificação)
const snackbar = ref(false);
const snackbarTexto = ref('');
const snackbarCor = ref('success');
const formValido = ref(true);
const isLoading = ref(false);

const motivos = ref([
    'Dúvida Financeira',
    'Suporte Técnico',
    'Sugestão/Reclamação',
    'Informações Sobre Cursos',
    'Outro Assunto',
]);

// Validações básicas
const regraObrigatoria = [(v) => !!v || 'Campo obrigatório'];

async function enviarFormulario() {
    isLoading.value = true;

    if (!formValido.value) {
        snackbarTexto.value = 'Preencha todos os campos obrigatórios!';
        snackbarCor.value = 'error';
        snackbar.value = true;
        isLoading.value = false;
        return;
    }

    try {
        // Chamada à action real da Store para envio
        const sucesso = await contatoStore.enviarMensagem({
            email: email.value,
            telefone: telefone.value,
            matricula: matricula.value,
            motivo: motivo.value,
            mensagem: mensagem.value,
            arquivo: arquivo.value 
        });

        if (sucesso) {
            snackbarTexto.value = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
            snackbarCor.value = 'success';
            // Limpar campos
            email.value = '';
            telefone.value = '';
            matricula.value = '';
            motivo.value = null;
            mensagem.value = '';
            arquivo.value = null;
        } else {
            throw new Error(contatoStore.error || 'Erro desconhecido ao enviar.');
        }

    } catch (erro) {
        console.error("Erro ao enviar formulário", erro);
        snackbarTexto.value = `Erro ao enviar mensagem: ${erro.message || 'Tente novamente.'}`;
        snackbarCor.value = 'error';
    } finally {
        snackbar.value = true;
        isLoading.value = false;
    }
}
</script>
<template>
    <v-container fluid class="pa-6 altura-completa-conteudo" role="main">
        

        <v-divider class="mb-8"></v-divider>

        <v-row>
            <v-col cols="12" md="8">
                <v-card class="pa-6" elevation="4">
                    <v-card-title class="headline mb-4">Envie Sua Mensagem</v-card-title>
                    
                    <v-form v-model="formValido" @submit.prevent="enviarFormulario">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="email" 
                                    :rules="regraObrigatoria"
                                    label="Seu Email" 
                                    prepend-inner-icon="mdi-email" 
                                    variant="outlined"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="telefone" 
                                    label="Telefone (Opcional)" 
                                    prepend-inner-icon="mdi-phone" 
                                    variant="outlined"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="matricula" 
                                    :rules="regraObrigatoria"
                                    label="Número de Matrícula" 
                                    prepend-inner-icon="mdi-badge-account" 
                                    variant="outlined"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="motivo"
                                    :rules="regraObrigatoria"
                                    :items="motivos"
                                    label="Motivo do Contato"
                                    prepend-inner-icon="mdi-help-circle"
                                    variant="outlined"
                                    required
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="mensagem"
                                    :rules="regraObrigatoria"
                                    label="Sua Mensagem"
                                    prepend-inner-icon="mdi-message"
                                    variant="outlined"
                                    rows="4"
                                    required
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input
                                    v-model="arquivo"
                                    label="Anexar Arquivo (Opcional)"
                                    prepend-icon="mdi-paperclip"
                                    variant="outlined"
                                    chips
                                    show-size
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn 
                                    type="submit" 
                                    color="teal" 
                                    size="large"
                                    :disabled="!formValido || isLoading"
                                    :loading="isLoading"
                                >
                                    Enviar Mensagem
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-row>
                    <v-col cols="12">
                        <v-card class="text-center pa-4" elevation="2">
                            <v-icon size="40" color="teal">mdi-phone</v-icon>
                            <v-card-title class="text-subtitle-1 font-weight-bold">Telefone</v-card-title>
                            <v-card-text class="py-0">
                                <p class="text-h6 font-weight-bold">{{ contactInfo.telefone }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card class="text-center pa-4" elevation="2">
                            <v-icon size="40" color="teal">mdi-email</v-icon>
                            <v-card-title class="text-subtitle-1 font-weight-bold">Email de Contato</v-card-title>
                            <v-card-text class="py-0">
                                <p class="text-h6 font-weight-bold">{{ contactInfo.email }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card class="text-center pa-4" elevation="2">
                            <v-icon size="40" color="teal">mdi-map-marker</v-icon>
                            <v-card-title class="text-subtitle-1 font-weight-bold">Endereço</v-card-title>
                            <v-card-text class="py-0">
                                <p class="text-body-1">{{ contactInfo.endereco }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-snackbar
            v-model="snackbar"
            :timeout="3000"
            :color="snackbarCor"
            location="bottom right"
        >
            {{ snackbarTexto }}
            <template v-slot:actions>
                <v-btn
                    color="white"
                    variant="text"
                    @click="snackbar = false"
                >
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>

    </v-container>
</template>

<style scoped>
.altura-completa-conteudo {
    min-height: calc(100vh - 64px); 
}
/* Removendo o text-h6 do telefone e email para evitar quebra de linha em telas pequenas */
.v-card-text p {
    word-break: break-all;
}
</style>