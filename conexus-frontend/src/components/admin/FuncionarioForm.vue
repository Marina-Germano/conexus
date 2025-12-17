<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFuncionarioStore } from '@/stores/funcionarioStore';

    const route = useRoute();
    const router = useRouter();
    const funcionarioStore = useFuncionarioStore();

    const funcionarioForm = reactive({
        nome: '',
        cpf: '',
        dataNascimento: '',
        email: '',
        telefone: '',
        cargo: '',
        especialidade: '',
        senha: '',
        confirmaSenha: ''
    });

    const form = ref(null);
    const estaEnviando = ref(false);
    const estaCarregando = ref(false);

    const funcionarioId = computed(() => route.params.id);
    const isEditing = computed(() => !!funcionarioId.value);

    const limparNumeros = v => v ? String(v).replace(/\D/g, '') : '';

    const cpfMasked = computed({
        get: () => funcionarioForm.cpf,
        set: v => funcionarioForm.cpf = limparNumeros(v)
    });

    const telefoneMasked = computed({
        get: () => funcionarioForm.telefone,
        set: v => funcionarioForm.telefone = limparNumeros(v)
    });

    //Regras 
    const regras = {
        requerido: v => !!v || 'Campo obrigatório',
        email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
        cpf: v => limparNumeros(v).length === 11 || 'CPF inválido',
        telefone: v => {
            const l = limparNumeros(v).length;
            return (l === 10 || l === 11) || 'Telefone inválido';
        },
        senha: v => v.length >= 6 || 'Mínimo 6 caracteres',
        senhasIguais: () =>
            funcionarioForm.senha === funcionarioForm.confirmaSenha || 'Senhas diferentes'
    };

    const carregarFuncionario = async () => {
        await funcionarioStore.exibir();
        const data = funcionarioStore.buscarPorId(funcionarioId.value);
        if (!data) return;

        Object.assign(funcionarioForm, {
            ...data,
            cpf: limparNumeros(data.cpf),
            telefone: limparNumeros(data.telefone),
            senha: '',
            confirmaSenha: ''
        });
    };

    //Salvar
   const submitForm = async () => {
    if (!form.value) return;

    const validationResult = await form.value.validate();
    if (!validationResult.valid) return;

    estaEnviando.value = true;

    const payload = {
        ...funcionarioForm,
        cpf: funcionarioForm.cpf,
        telefone: funcionarioForm.telefone
    };

    try {
        let success;

        if (isEditing.value) {
            success = await funcionarioStore.atualizar(
                funcionarioForm.idfuncionario,
                payload
            );
        } else {
            success = await funcionarioStore.adicionar(payload);
        }

        if (success) {
            alert(
              `Funcionário ${
                isEditing.value ? "atualizado" : "cadastrado"
              } com sucesso!`
            );
            router.push({ name: 'FuncionarioList' });
        } else {
            alert("Falha ao salvar funcionário.");
        }

    } catch (error) {
        console.error("Erro ao salvar funcionário", error);
        alert("Erro inesperado ao salvar.");
    } finally {
        estaEnviando.value = false;
    }
};


    //Cancelar

const cancelForm = () => {
    router.push({ name: 'FuncionarioList' });
};


    onMounted(async () => {
        estaCarregando.value = true;
        if (isEditing.value) await carregarFuncionario();
        estaCarregando.value = false;
    });
    </script>


<template>
    <v-form ref="form" @submit.prevent="submitForm">
        <v-container class="mx-auto" max-width="1500"> 
            
            <v-card class="mb-6" elevation="0">
                <v-toolbar color="orange" density="compact" class="header-toolbar-orange">
                    <v-toolbar-title class="text-h6 font-weight-bold text-white">
                        {{ isEditing ? 'Editar Funcionário' : 'Cadastrar Funcionário' }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer> 
                    <v-icon @click="cancelForm" icon="mdi-close" color="white" class="mr-2"></v-icon>
                </v-toolbar>
            </v-card>

            <v-card class="mb-6" elevation="1" :loading="estaCarregando">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-account-details-outline" class="mr-2"></v-icon>
                    Informações Pessoais
                </v-card-title>

                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.nome" 
                                label="Nome Completo *" 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]">
                            </v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.email" 
                                label="E-mail *" 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido, regras.emailValido]">
                            </v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="cpfMasked" 
                                label="CPF *" 
                                placeholder="999.999.999-99"
                                variant="outlined" 
                                density="compact"
                                type="tel"
                                maxlength="14" 
                                :rules="[regras.requerido, regras.cpfValido]">
                            </v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.dataNascimento" 
                                label="Data de Nascimento *" 
                                variant="outlined" 
                                density="compact" 
                                type="date"
                                prepend-inner-icon="mdi-calendar"
                                :rules="[regras.requerido]">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.cargo" 
                                label="Cargo *" 
                                variant="outlined" 
                                density="compact" 
                                :rules="[regras.requerido]">
                            </v-text-field>
                            </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="telefoneMasked" 
                                label="Telefone *" 
                                placeholder="(99) 99999-9999"
                                variant="outlined" 
                                density="compact" 
                                type="tel"
                                maxlength="15" 
                                :rules="[regras.requerido, regras.telefoneValido]">
                            </v-text-field>
                        </v-col>
                        
                        <v-col cols="12" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.especialidade" 
                                label="Especialidade do Professor (opcional)" 
                                variant="outlined" 
                                density="compact">
                            </v-text-field>
                        </v-col>

                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="1">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-shield-lock-outline" class="mr-2"></v-icon>
                    Segurança (Acesso ao Sistema)
                </v-card-title>
                
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.senha" 
                                label="Senha *" 
                                variant="outlined" 
                                density="compact" 
                                type="password" 
                                :rules="isEditing ? [] : [regras.requerido, regras.minSenha]">
                                </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                v-model="funcionarioForm.confirmaSenha" 
                                label="Confirme sua Senha *" 
                                variant="outlined" 
                                density="compact" 
                                type="password" 
                                :rules="isEditing ? [regras.senhasIguais] : [regras.requerido, regras.senhasIguais]">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-row justify="start" class="pt-2">
                <v-col cols="12" sm="4" md="3">
                    <v-btn 
                        type="submit" 
                        block 
                        color="orange-darken-1" 
                        size="large" 
                        elevation="2"
                        class="text-white font-weight-bold"
                        :loading="estaEnviando" 
                        :disabled="estaEnviando">
                        {{ isEditing ? 'Atualizar' : 'Salvar'}}
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="3" md="2">
                    <v-btn 
                        @click="cancelForm" 
                        block 
                        variant="text" 
                        color="grey-darken-1" 
                        size="large"
                        :disabled="estaEnviando">
                        Cancelar
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-form>
</template>

<style scoped>
/* Estilos replicados do formulário de Turma */
.header-toolbar-orange {
    background-color: #ff9800 !important; 
    color: white;
}
.header-toolbar-orange .v-toolbar-title {
    color: white !important;
}
.v-col {
    padding-top: 8px;
    padding-bottom: 8px;
}
</style>