<script setup>
import { ref, onMounted } from 'vue';

import { useEmprestimoMaterialStore } from '@/stores/emprestimoMaterialStores'; 
import { useAlunoStore } from '@/stores/alunoStore'; 
import { useTurmaStore } from '@/stores/turmaStore'; 
import { useMaterialStore } from '@/stores/materialStore'; 
import { useDocumentoAlunoStore } from '@/stores/documentoAlunoStores'; 



const emprestimoStore = useEmprestimoMaterialStore();
const alunoStore = useAlunoStore(); 
const turmaStore = useTurmaStore(); 
const materialStore = useMaterialStore(); 
const documentoStore = useDocumentoAlunoStore(); 



const totalAlunos = ref(0); 
const totalEmprestimosAtivos = ref(0);
const totalTurmas = ref(0);
const totalMaterialEstoque = ref(0);
const materiaisAtrasados = ref(0); 
const documentosPendentes = ref(0); 


const adminName = ref(''); 

onMounted(async () => {
    try {

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        adminName.value = 'Usuário(a)'; 
    }
});
</script>

<template>
    <v-container fluid class="pa-6" role="main">
        <h2 class="text-h4 mb-8 font-weight-bold text-orange-darken-1" id="page-title">
            Painel Administrativo: Visão Geral
        </h2>

        <v-row class="mb-8">
            <v-col cols="12">
                <v-card class="d-flex align-center pa-4" elevation="4">
                    <v-icon icon="mdi-account-star" size="50" color="orange-darken-1" class="mr-4"></v-icon> 
                    <div>
                        <p class="text-subtitle-1 text-medium-emphasis mb-1">Bem-vindo(a),</p>
                        <h2 class="text-h5 font-weight-bold text-orange-darken-1">
                            {{ adminName }}, <span class="text-h6 font-weight-regular">Administrador(a) Central</span>
                        </h2> 
                    </div>
                </v-card>
            </v-col>
        </v-row>
        
        <h3 class="text-h6 mb-4 mt-6">Estatísticas Chave</h3>
        <v-row class="mb-6">
            
            <v-col cols="12" sm="6" md="3">
                <v-card class="pa-4" elevation="4" color="light-blue-lighten-5">
                    <v-icon icon="mdi-account-group" size="30" color="light-blue-darken-3"></v-icon>
                    <div class="text-h5 font-weight-bold text-light-blue-darken-3 mt-2">{{ totalAlunos }}</div>
                    <div class="text-subtitle-2 text-light-blue-darken-3">Alunos Ativos</div>
                </v-card>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
                <v-card class="pa-4" elevation="4" color="green-lighten-5">
                    <v-icon icon="mdi-bookshelf" size="30" color="green-darken-3"></v-icon>
                    <div class="text-h5 font-weight-bold text-green-darken-3 mt-2">{{ totalEmprestimosAtivos }}</div>
                    <div class="text-subtitle-2 text-green-darken-3">Empréstimos Ativos</div>
                </v-card>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
                <v-card class="pa-4" elevation="4" color="purple-lighten-5">
                    <v-icon icon="mdi-school" size="30" color="purple-darken-3"></v-icon>
                    <div class="text-h5 font-weight-bold text-purple-darken-3 mt-2">{{ totalTurmas }}</div>
                    <div class="text-subtitle-2 text-purple-darken-3">Turmas Ativas</div>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card class="pa-4" elevation="4" color="amber-lighten-5">
                    <v-icon icon="mdi-package-variant" size="30" color="amber-darken-3"></v-icon>
                    <div class="text-h5 font-weight-bold text-amber-darken-3 mt-2">{{ totalMaterialEstoque }}</div>
                    <div class="text-subtitle-2 text-amber-darken-3">Materiais no Estoque</div>
                </v-card>
            </v-col>
        </v-row>

        <h3 class="text-h6 mb-4 mt-6">Atenção Necessária</h3>
        <v-divider class="mb-6"></v-divider>

        <v-row class="mb-6">
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4" elevation="4" color="red-lighten-5">
                    <v-card-title class="text-red-darken-3 text-subtitle-1 font-weight-bold pa-0">
                        <v-icon icon="mdi-alert-octagon-outline" class="mr-2"></v-icon>
                        Materiais Atrasados
                    </v-card-title>
                    <v-card-text class="pa-0 pt-2 pb-2">
                        <div class="text-h4 font-weight-bold text-red-darken-3">{{ materiaisAtrasados }}</div>
                    </v-card-text>
                    <v-btn block color="red-darken-1" class="text-white text-none" to="/admin/emprestimos/atrasados" size="small">
                        Verificar Devoluções
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4" elevation="4" color="orange-lighten-5">
                    <v-card-title class="text-orange-darken-3 text-subtitle-1 font-weight-bold pa-0">
                        <v-icon icon="mdi-file-document-outline" class="mr-2"></v-icon>
                        Docs Pendentes
                    </v-card-title>
                    <v-card-text class="pa-0 pt-2 pb-2">
                        <div class="text-h4 font-weight-bold text-orange-darken-3">{{ documentosPendentes }}</div>
                    </v-card-text>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/alunos/documentos" size="small">
                        Gerenciar Documentos
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
        
        <h3 class="text-h6 mb-4 mt-6">Ações Rápidas</h3>
        <v-divider class="mb-6"></v-divider>

        <v-row>
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4" color="orange-darken-1">
                    <div class="text-h6 font-weight-medium mb-4 text-white">Cadastrar Empréstimo</div>
                    <v-btn block color="white" class="text-orange-darken-1 text-none" to="/admin/emprestimos/cadastro">
                        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                        Novo Empréstimo
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4">Cadastrar Aluno</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/alunos/cadastro">
                        Matricular Novo Aluno
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4">Cadastrar Turma</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/turmas/nova">
                        Criar Nova Turma
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4">Cadastrar Funcionário</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/funcionarios/cadastro">
                        Adicionar Funcionário
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4">Cadastro de Material</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/materiais/cadastro">
                        Incluir Novo Material
                    </v-btn>
                </v-card>
            </v-col>
            
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4" id="relatorio-fin">Relatório Financeiro</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/reports/finance"
                        aria-labelledby="relatorio-fin">
                        Gerar Relatório
                    </v-btn>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-4 text-center" elevation="4">
                    <div class="text-h6 font-weight-medium mb-4" id="relatorio-mat">Relatório de Materiais</div>
                    <v-btn block color="orange-darken-1" class="text-white text-none" to="/admin/reports/materials"
                        aria-labelledby="relatorio-mat">
                        Gerar Relatório
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<style scoped>

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style>