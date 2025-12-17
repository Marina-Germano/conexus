<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';


    const authStore = useAuthStore();
    const router = useRouter();

    const showPassword = ref(false); 

    const dadosFormulario = ref({
        cpf: "",
        senha: ""
    });

    async function handleLogin() {
 
        
        const success = await authStore.login(dadosFormulario.value); 

        if (success) {
            const role = authStore.userRole; 
            let redirectRoute = '/'; 


            if (role === 'admin') {
                redirectRoute = '/admin/dashboard';
            } else if (role === 'aluno') {
                redirectRoute = '/aluno/dashboard';
            } else if (role === 'professor') {
                redirectRoute = '/professor/dashboard';
            } else {
                console.warn(`Perfil desconhecido: ${role}. Redirecionando para a raiz.`);
            }

            
            await router.push(redirectRoute);
        }

    }
</script>

<template>
    <v-form @submit.prevent="handleLogin">
        <div class="logo-container">
            <img src="/src/assets/img/2025.png" alt="Logo Quebra-Cabeça" class="logo-img logo-puzzle">
        </div>

        <p class="mb-2 text-subtitle-1 font-weight-regular"> Seu CPF *</p>

        <v-text-field v-model="dadosFormulario.cpf" placeholder="Digite seu CPF" variant="solo" flat
            density="comfortable" hide-details class="rounded-lg mb-4 input-bg-grey" :loading="authStore.loading"></v-text-field>

        <p class="mb-2 text-subtitle-1 font-weight-regular"> Sua senha *</p>

        <v-text-field 
            v-model="dadosFormulario.senha" 
            placeholder="Digite sua senha" 
            :type="showPassword ? 'text' : 'password'" 
            variant="solo" 
            flat
            density="comfortable" 
            hide-details 
            class="rounded-lg mb-6 input-bg-grey" 
            :loading="authStore.loading"
            
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            
            @click:append-inner="showPassword = !showPassword"
        ></v-text-field>

        <v-btn type="submit" block size="large" color="#FF8C36" class="text-white text-none font-weight-bold"
            elevation="0" :loading="authStore.loading" :disabled="authStore.loading">
            Entrar
        </v-btn>

        <v-alert v-if="authStore.error" type="error" class="mt-4" density="compact"
            :text="authStore.error"></v-alert>
    </v-form>
</template>

<style scoped>

    .logo-img {
        height: auto;
    }


    .logo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
    }


    .logo-puzzle {
        max-width: 200px; 
        margin-bottom: 10px;
    }

    .input-bg-grey :deep(.v-field__input) {
        background-color: #e0e0e0;
        border-radius: 4px;
    }

    .v-text-field :deep(.v-field__overlay) {
        background-color: transparent !important;
    }

    .v-text-field :deep(.v-field__field) {
        border-radius: 4px;
    }
</style>