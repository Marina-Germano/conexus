<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAlunoStore } from '@/stores/alunoStore'; 


const router = useRouter();
const route = useRoute();
const alunoStore = useAlunoStore(); 

const props = defineProps({
    isEditing: {
        type: Boolean,
        default: false
    }
});

const estaCarregando = ref(false);
const titulo = ref(props.isEditing ? 'Editar Estudante' : 'Cadastrar Estudante');
const estaEnviando = ref(false);

const opcoesSituacaoAluno = ['Ativo', 'Inativo', 'Matrícula Pendente', 'Trancado'];

//  visibilidade da senha 
const mostrarSenha = ref(false); 

const dadosFormulario = ref({
    // Dados Pessoais
    idaluno: 0,
    nome: '',
    cpf: '',
    dataNascimento: '', 
    email: '',
    telefone: '',
    situacao: 'Ativo', 


    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',


    senha: '',
    confirmarSenha: '',

    responsavelNome: '',
    responsavelTelefone: '',
});


const cleanDigits = (value) => value ? value.replace(/\D/g, '') : '';

const maskCpf = (value) => {
    let digits = cleanDigits(value);
    digits = digits.substring(0, 11);

    if (digits.length > 9) {
        return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (digits.length > 6) {
        return digits.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (digits.length > 3) {
        return digits.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    } else {
        return digits;
    }
};

const maskTelefone = (value) => {
    let digits = cleanDigits(value);
    digits = digits.substring(0, 11); 

    if (digits.length > 10) {

        return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (digits.length > 6) {
        return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (digits.length > 2) {
        return digits.replace(/^(\d{2})(\d{1,4})$/, '($1) $2');
    } else if (digits.length > 0) {
        return digits.replace(/^(\d{1,2})$/, '($1');
    } else {
        return digits;
    }
};


// REGRAS DE VALIDAÇÃO

const regras = {
    requerido: value => !!value || 'Campo obrigatório.',
    

    cpf: value => {
        const cleaned = cleanDigits(value);
        if (!cleaned) return 'CPF é obrigatório.';
        if (cleaned.length !== 11) return 'CPF deve ter 11 dígitos.';
        return true;
    },
    

    minPass: value => (props.isEditing || !value || value.length >= 6) || 'Mínimo 6 caracteres.',
    
    email: value => /.+@.+\..+/.test(value) || 'Email inválido.',
    

    telefone: value => {
        const cleaned = cleanDigits(value);
        if (!cleaned) return 'Telefone é obrigatório.';
        if (cleaned.length < 10) return 'Telefone deve ter no mínimo 10 dígitos (com DDD).';
        return true;
    },
    

    cep: value => (cleanDigits(value).length === 8) || 'CEP inválido (8 dígitos necessários).'
};

//  BUSCA CEP

async function buscarEnderecoPorCep(cep) {
    const cleanedCep = cleanDigits(cep);

    //  CEP for incompleto
    if (cleanedCep.length !== 8) {
        estaCarregando.value = false;
        return; 
    }
    estaCarregando.value = true;
    
    try {
        // ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();

        if (data.erro) {
            console.warn(`CEP ${cleanedCep} não encontrado.`);
            // Limpa os campos
            dadosFormulario.value.rua = '';
            dadosFormulario.value.bairro = '';
            dadosFormulario.value.complemento = '';
            return;
        }

        // Atribui os dados
        dadosFormulario.value.rua = data.logradouro || '';
        dadosFormulario.value.bairro = data.bairro || '';
        dadosFormulario.value.complemento = data.complemento || '';
        
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert('Falha ao buscar endereço. Por favor, preencha manualmente.');
    } finally {
        estaCarregando.value = false;
    }
}

// WATCHER monitorar  CEP

watch(() => dadosFormulario.value.cep, (newCep) => {
    // Garante que apenas dígitos são considerados e limita a 8 caracteres
    const cleanedCep = cleanDigits(newCep).substring(0, 8);
    // Atualiza o v-model do formulário com a versão limpa (para permitir o preenchimento)
    dadosFormulario.value.cep = cleanedCep; 

    if (cleanedCep.length === 8) {
        buscarEnderecoPorCep(cleanedCep);
    }
});


//  Carregamento e Envio

async function carregarDadosParaEdicao() {
    const id = route.params.id;
    if (id) {
        estaCarregando.value = true;
        const sucesso = await alunoStore.buscarPorId(id);
        
        if (sucesso && alunoStore.alunoSelecionado) {
            // Mapeia os dados da Store para o formulário
            Object.keys(dadosFormulario.value).forEach(key => {
                if (alunoStore.alunoSelecionado[key] !== undefined) {
                    // Aplica as máscaras ao carregar os dados brutos (se vierem sem máscara)
                    if (key === 'cpf') {
                        dadosFormulario.value[key] = maskCpf(alunoStore.alunoSelecionado[key]);
                    } else if (key === 'telefone') {
                        dadosFormulario.value[key] = maskTelefone(alunoStore.alunoSelecionado[key]);
                    } else {
                        dadosFormulario.value[key] = alunoStore.alunoSelecionado[key];
                    }
                }
            });
            dadosFormulario.value.idaluno = alunoStore.alunoSelecionado.idaluno;
        } else {
            alert('Falha ao carregar dados do aluno para edição.');
            router.push('/admin/alunos');
        }
        estaCarregando.value = false;
    }
}

async function lidarComEnvio() {
    if (estaCarregando.value) return; 

    // Validação de Senha
    if (!props.isEditing || (props.isEditing && dadosFormulario.value.senha)) {
        if (!dadosFormulario.value.senha || dadosFormulario.value.senha.length < 6) {
            alert('A senha é obrigatória e deve ter no mínimo 6 caracteres (no cadastro).');
            return;
        }
        if (dadosFormulario.value.senha !== dadosFormulario.value.confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }
    }

    estaEnviando.value = true;
    let sucesso = false;

    // limpa os dados antes de enviar
    const dadosParaEnviar = { ...dadosFormulario.value };
    dadosParaEnviar.cpf = cleanDigits(dadosParaEnviar.cpf);
    dadosParaEnviar.telefone = cleanDigits(dadosParaEnviar.telefone);
    dadosParaEnviar.cep = cleanDigits(dadosParaEnviar.cep); 
    delete dadosParaEnviar.confirmarSenha;

    try {
        if (props.isEditing) {
            sucesso = await alunoStore.atualizar(dadosParaEnviar.idaluno, dadosParaEnviar);
        } else {
            sucesso = await alunoStore.adicionar(dadosParaEnviar);
        }
        
        if (sucesso) {
            alert(`Estudante ${props.isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
            router.push('/admin/alunos'); 
        } else {
            alert('Falha ao salvar o estudante. Verifique os dados e tente novamente.');
        }

    } catch (error) {
        console.error('Erro ao salvar o aluno:', error);
        alert('Ocorreu um erro inesperado ao salvar o estudante.');
    } finally {
        estaEnviando.value = false;
    }
}

function lidarComCancelamento() {
    router.push('/admin/alunos');
}

onMounted(() => {
    if (props.isEditing) {
        carregarDadosParaEdicao();
    }
});
</script>

<template>
        <v-form @submit.prevent="lidarComEnvio">
        <v-container class="mx-auto" max-width="1500">
            
                        <v-card class="mb-6" elevation="0">
                <v-toolbar color="orange" density="compact" class="header-toolbar-orange">
                                        <v-toolbar-title class="text-h6 font-weight-bold text-white">{{ titulo }}</v-toolbar-title>
                    
                    <v-spacer></v-spacer> 
                    
                                        <v-icon @click="lidarComCancelamento" icon="mdi-close" color="white" class="mr-2"></v-icon>
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
                                                        <v-text-field v-model="dadosFormulario.nome" label="Nome Completo: *" variant="outlined" density="compact"
                                :rules="[regras.requerido]" required placeholder="Nome Completo do Aluno"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                                                        <v-text-field 
                                :model-value="dadosFormulario.cpf"
                                @update:modelValue="value => dadosFormulario.cpf = maskCpf(value)"
                                label="CPF: *" 
                                variant="outlined" 
                                density="compact"
                                :rules="[regras.requerido, regras.cpf]" 
                                required 
                                placeholder="999.999.999-99"
                                maxlength="14"
                            ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                                                        <v-text-field v-model="dadosFormulario.dataNascimento" label="Data de Nascimento: *" type="date"
                                variant="outlined" density="compact" :rules="[regras.requerido]" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field v-model="dadosFormulario.email" label="Email: *" type="email" variant="outlined"
                                density="compact" :rules="[regras.requerido, regras.email]" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                                                        <v-text-field 
                                :model-value="dadosFormulario.telefone"
                                @update:modelValue="value => dadosFormulario.telefone = maskTelefone(value)"
                                label="Telefone: *" 
                                variant="outlined"
                                density="compact" 
                                :rules="[regras.requerido, regras.telefone]" 
                                required 
                                placeholder="(99) 99999-9999"
                                maxlength="15"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-select 
                                v-model="dadosFormulario.situacao" 
                                :items="opcoesSituacaoAluno"
                                label="Situação do Aluno: *" 
                                variant="outlined" 
                                density="compact"
                                :rules="[regras.requerido]" required
                            ></v-select>
                        </v-col>

                    </v-row>
                </v-card-text>
            </v-card>
            
            <v-card class="mb-6" elevation="1" :loading="estaCarregando">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-map-marker-outline" class="mr-2"></v-icon>
                    Endereço
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="4" class="py-1">
                            <v-text-field 
                                v-model="dadosFormulario.cep"
                                label="CEP: *" 
                                variant="outlined"
                                density="compact" 
                                :rules="[regras.requerido, regras.cep]"
                                required 
                                placeholder="99999-999"
                                maxlength="8"
                                :loading="estaCarregando"
                                hint="Digite o CEP para buscar o endereço automaticamente."
                                persistent-hint
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field v-model="dadosFormulario.rua" label="Rua/Logradouro: *" variant="outlined"
                                density="compact" :rules="[regras.requerido]" required
                                :disabled="estaCarregando"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2" class="py-1">
                            <v-text-field v-model="dadosFormulario.numero" label="Número: *" variant="outlined"
                                density="compact" :rules="[regras.requerido]" required></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field v-model="dadosFormulario.bairro" label="Bairro: *" variant="outlined"
                                density="compact" :rules="[regras.requerido]" required
                                :disabled="estaCarregando"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field v-model="dadosFormulario.complemento" label="Complemento:" variant="outlined"
                                density="compact" placeholder="Ex: Bloco A, Apartamento 101"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="1">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-account-group-outline" class="mr-2"></v-icon>
                    Responsável Legal (Opcional, se o aluno for menor)
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field v-model="dadosFormulario.responsavelNome" label="Nome do Responsável:"
                                variant="outlined" density="compact" placeholder="Nome Completo"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1">
                            <v-text-field 
                                :model-value="dadosFormulario.responsavelTelefone"
                                @update:modelValue="value => dadosFormulario.responsavelTelefone = maskTelefone(value)"
                                label="Telefone do Responsável:" 
                                variant="outlined"
                                density="compact" 
                                placeholder="(99) 99999-9999"
                                maxlength="15"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="1">
                <v-card-title class="bg-grey-lighten-4 text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon icon="mdi-lock-outline" class="mr-2"></v-icon>
                    Segurança (Acesso ao Sistema)
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12" md="6" class="py-1" v-if="!props.isEditing || dadosFormulario.senha">
                            <v-text-field 
                                v-model="dadosFormulario.senha" 
                                :label="props.isEditing ? 'Nova Senha:' : 'Senha de Acesso: *'" 
                                :type="mostrarSenha ? 'text' : 'password'" 
                                variant="outlined"
                                density="compact" 
                                :rules="[!props.isEditing ? regras.requerido : true, regras.minPass]" 
                                :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="mostrarSenha = !mostrarSenha">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="py-1" v-if="!props.isEditing || dadosFormulario.senha">
                            <v-text-field 
                                v-model="dadosFormulario.confirmarSenha" 
                                :label="props.isEditing ? 'Confirmar Nova Senha:' : 'Confirme sua Senha: *'" 
                                :type="mostrarSenha ? 'text' : 'password'" 
                                variant="outlined" 
                                density="compact" 
                                :rules="[!props.isEditing ? regras.requerido : true]" 
                                :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="mostrarSenha = !mostrarSenha">
                            </v-text-field>
                        </v-col>

                    </v-row>
                </v-card-text>
            </v-card>

            <v-alert type="info" density="compact" variant="tonal" class="mt-4 mb-6">
                Ao clicar em **"SALVAR"**, o estudante será cadastrado e terá acesso liberado com a senha informada.
            </v-alert>

                        <v-row justify="start" class="pt-2">
                <v-col cols="12" sm="4" md="3">
                    <v-btn type="submit" block color="orange-darken-1" size="large" elevation="2"
                        class="text-white font-weight-bold"
                        :loading="estaEnviando" :disabled="estaEnviando">

                                                {{ props.isEditing ? 'Atualizar' : 'Salvar' }}
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="3" md="2">
                                        <v-btn @click="lidarComCancelamento" block variant="text" color="grey-darken-1" size="large"
                        :disabled="estaEnviando">
                        Cancelar
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-form>
</template>

<style scoped>
.header-toolbar-orange {
    background-color: #ff9800 !important; 
    color: white;
}
.header-toolbar-orange .v-toolbar-title {
    color: white !important;
}
</style>