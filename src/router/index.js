import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // rota login
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      redirect: '/login',
      name: 'HomeDefault',
    },

    // rota admin
    {
      path: '/admin',
      meta: { requiresAuth: true, roles: ['admin'] }, 
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/AdminHomeView.vue'),
        }
      ]
    },

  ]
});

//  Lógica de Proteção
router.beforeEach((to, from, next) => {
  //  instanciar o Store
  const authStore = useAuthStore();
  const requiredAuth = to.meta.requiresAuth;
  const requiredRoles = to.meta.roles;

  //  Redireciona usuários logados que tentam acessar a tela de login
  if (to.path === '/login' && authStore.isAuthenticated) {
    // Redireciona para o dashboard correto baseado no papel
    if (authStore.userRole === 'admin') {
      return next('/admin/dashboard');
    }
    return next('/');
  }

  //  Verifica se a rota requer autenticação e se o usuário NÃO está autenticado
  if (requiredAuth && !authStore.isAuthenticated) {
    // Envia para a tela de login
    return next('/login');
  }

  //  Verifica se a rota requer papéis específicos e se o papel do usuário NÃO é permitido
  if (requiredRoles && !requiredRoles.includes(authStore.userRole)) {
    // Redireciona para a tela de login (ou uma página de acesso negado)
    console.warn(`Acesso negado. Usuário (${authStore.userRole}) tentou acessar ${to.path}.`);
    return next('/login'); 
  }


  next();
});

export default router;