<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 🎯 CORREÇÃO CRÍTICA: Importa o Pinia Store
import { useAuthStore } from '@/stores/auth'; 

// Variáveis de estado
const cpf = ref('');
const senha = ref('');
const mensagem = ref('');
const tipoMensagem = ref('error');
const loading = ref(false);
const form = ref(null);

const router = useRouter();
// 🎯 CORREÇÃO CRÍTICA: Instancia o Pinia Store
const authStore = useAuthStore(); 

// Regras de validação (Vuetify)
const cpfRules = [
  v => !!v || 'CPF é obrigatório',
  v => (v && v.length === 11) || 'CPF deve ter 11 dígitos',
];
const senhaRules = [
  v => !!v || 'Senha é obrigatória',
];


async function handleLogin() {
    // Validação do formulário antes de prosseguir
    const { valid } = await form.value.validate();
    if (!valid) {
        mensagem.value = 'Preencha todos os campos obrigatórios corretamente.';
        tipoMensagem.value = 'warning';
        return;
    }

    loading.value = true;
    mensagem.value = '';

    // -------------------------------------------------------------------------
    // 🚧 BLOCO DE SIMULAÇÃO DE LOGIN (ATENÇÃO: Remova este bloco ao integrar a API real)
    // -------------------------------------------------------------------------
    setTimeout(() => {
        
        // Simulação dos dados que viriam da API após autenticação bem-sucedida
        const token = 'fake-admin-token-123';
        const user = {
            idusuario: 1,
            nome: 'Admin Teste',
            papel: 'admin' // 🎯 Define o papel como 'admin' para passar no Route Guard
        };

        // 1. Salva o estado no Pinia Store
        authStore.login(token, user); 

        // 2. Redireciona para o Dashboard Admin
        router.push('/admin/dashboard');
        
        loading.value = false;
    }, 500); 
    // -------------------------------------------------------------------------
}
</script>

<template>
    <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4"> 
                <v-card class="elevation-12"> 
                    <v-toolbar color="primary" dark flat> 
                        <v-toolbar-title>Bem-vindo!</v-toolbar-title>
                    </v-toolbar>
                    
                    <v-card-text>
                        <v-alert v-if="mensagem" :type="tipoMensagem" dismissible class="mb-4">
                            {{ mensagem }}
                        </v-alert>

                        <!-- O ref="form" é necessário para chamar a validação do Vuetify -->
                        <v-form ref="form" @submit.prevent="handleLogin">
                            <v-text-field
                                v-model="cpf"
                                label="Seu CPF"
                                name="cpf"
                                prepend-icon="mdi-account"
                                type="text"
                                maxlength="11"
                                :rules="cpfRules"
                                required 
                            ></v-text-field>

                            <v-text-field
                                v-model="senha"
                                label="Sua Senha"
                                name="senha"
                                prepend-icon="mdi-lock"
                                type="password"
                                maxlength="20"
                                :rules="senhaRules"
                                required
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :loading="loading"
                            color="primary"
                            @click="handleLogin"
                            block
                            class="mb-4 mx-4"
                        >
                            Login (Simulado ADMIN)
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>