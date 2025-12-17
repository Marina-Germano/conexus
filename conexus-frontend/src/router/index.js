import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/LoginView.vue')
        },

        // --- ADMIN ---
        
        {
            path: '/admin',
            redirect: { name: 'AdminDashboard' }
        },
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard',
            component: () => import('@/views/admin/AdminDashboardView.vue')
        },
        
        {
            path: '/admin/turmas',
            name: 'ListarTurmas',
            component: () => import('@/views/admin/TurmasListView.vue')
        },
        {
            path: '/admin/turmas/nova',
            name: 'CadastrarTurma',
            component: () => import('@/views/admin/TurmasFormView.vue')
        },
        {
            path: '/admin/turmas/:id',
            name: 'EditarTurma',
            component: () => import('@/views/admin/TurmasFormView.vue'),
        },

        {
            path: '/admin/alunos',
            name: 'ListarAlunos',
            component: () => import('@/views/admin/AlunoListView.vue') 
        },
        {
            path: '/admin/alunos/cadastro',
            name: 'CadastrarAluno',
            component: () => import('@/views/admin/AlunoFormView.vue'),
        },
        {
            path: '/admin/alunos/cadastro/:id', 
            name: 'EditarAluno',
            component: () => import('@/views/admin/AlunoFormView.vue'), 
        },
        
        {
            path: '/admin/funcionarios',
            name: 'FuncionarioList',
            component: () => import('@/views/admin/FuncionarioListView.vue'),
        },
        {
            path: '/admin/funcionarios/cadastro',
            name: 'FuncionarioRegister',
            component: () => import('@/views/admin/FuncionarioFormView.vue'),
        },
        {
            path: '/admin/funcionarios/cadastro/:id',
            name: 'FuncionarioEdit',
            component: () => import('@/views/admin/FuncionarioFormView.vue'), 
        },
        
        {
            path: '/admin/materiais',
            name: 'ListarMateriais',
            component: () => import('@/views/admin/MaterialListView.vue')
        },
        {
            path: '/admin/materiais/cadastro',
            name: 'CadastrarMaterial',
            component: () => import('@/views/admin/MaterialFormView.vue')
        },
        {
            path: '/admin/materiais/cadastro/:id',
            name: 'EditarMaterial',
            component: () => import('@/views/admin/MaterialFormView.vue'),
        },
        {
            path: '/admin/emprestimos',
            name: 'ListarEmprestimos',
            component: () => import('@/views/admin/EmprestimoMaterialListagem.vue') 
        },
        {
            path: '/admin/emprestimos/cadastro',
            name: 'CadastrarEmprestimo',
            component: () => import('@/views/admin/EmprestimoMaterialCadastroEdicao.vue'),
        },
        {
            path: '/admin/emprestimos/cadastro/:id',
            name: 'EditarEmprestimo',
            component: () => import('@/views/admin/EmprestimoMaterialCadastroEdicao.vue'),
        },

        {
            path: '/admin/reports/finance',
            name: 'RelatorioFinanceiro',
            component: () => import('@/views/admin/RelatorioFinanceiroView.vue')
        },
        {
            path: '/admin/reports/materials',
            name: 'RelatorioMateriais',
            component: () => import('@/views/admin/RelatorioMateriaisView.vue')
        },

        // --- PROFESSOR ---
        {
            path: '/professor',
            redirect: { name: 'ProfessorDashboard' }
        },
        {
            path: '/professor/dashboard',
            name: 'ProfessorDashboard',
            component: () => import('@/views/professor/ProfessorDashboardView.vue') 
        },
        {
            path: '/professor/turmas',
            name: 'ProfessorTurmas', 
            component: () => import('@/views/professor/ProfessorTurmasView.vue')
        },
        {
            path: '/professor/minhas-aulas',
            name: 'ProfessorMinhasAulas',
            component: () => import('@/views/professor/AulasViews.vue')
        },
        {
            path: '/professor/registro-presenca/:turmaId',
            name: 'RegistroPresenca', 
            component: () => import('@/views/professor/RegistroPresencaView.vue') 
        },
        
        {
        path: '/professor/lancamento-notas/:turmaId',
        name: 'LancamentoNotas',
        component: () => import('@/views/professor/NotasFormView.vue') 
        },

        {
            path: '/professor/materiais/:id?',
            name: 'ProfessorMateriais',
            component: () => import('@/views/professor/MateriaisDidaticosProfessorView.vue') 
        },

        // --- ALUNO ---
        
        {
            path: '/aluno',
            redirect: { name: 'AlunoDashboard' }
        },
        {
            path: '/aluno/dashboard',
            name: 'AlunoDashboard',
            component: () => import('@/views/aluno/AlunoDashboardView.vue') 
        },
        {
            path: '/aluno/minhaaulas',
            name: 'AlunoMinhasAulas',
            component: () => import('@/views/aluno/AlunoAulasView.vue') 
        },
        {
            path: '/aluno/aulas', 
            name: 'AlunoAulas',
            component: () => import('@/views/aluno/AlunoAulasView.vue') 
        },
        {
            path: '/aluno/boletim',
            name: 'AlunoBoletim',
            component: () => import('@/views/aluno/BoletinAlunoView.vue') 
        },
        {
            path: '/aluno/financeiro',
            name: 'AlunoFinanceiro',
            component: () => import('@/views/aluno/FinanciroAlunoView.vue') 
        },
        {
            path: '/aluno/materiais',
            name: 'AlunoMateriais',
            component: () => import('@/views/aluno/MaterialAlunoView.vue') 
        },
        {
            path: '/aluno/contato',
            name: 'AlunoContato',
            component: () => import('@/views/aluno/AlunoView.vue')
        },
    ]
})

export default router