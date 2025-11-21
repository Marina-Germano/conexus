import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

//  Defina constantes para as chaves do localStorage para evitar 'magic strings'
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export const useAuthStore = defineStore('auth', () => {
    
    //  Tenta carregar do localStorage usando as constantes
    const token = ref(localStorage.getItem(TOKEN_KEY) || null);
    const user = ref(JSON.parse(localStorage.getItem(USER_KEY)) || null);
    

    // Propriedades Computadas
    const isAuthenticated = computed(() => !!token.value); 

    const userRole = computed(() => user.value ? user.value.papel : null); 

    const userName = computed(() => user.value ? user.value.nome : 'Convidado');

    //Úteis para o Route Guard e Componentes
    const isAdmin = computed(() => user.value?.papel === 'admin');
    const isProfessor = computed(() => user.value?.papel === 'professor');
    const isAluno = computed(() => user.value?.papel === 'aluno');


    // Funções para modificar o estado
    
    /** * Define o token e os dados do usuário após um login bem-sucedido.
     * @param {string} newToken - O JWT token retornado pela API.
     * @param {object} userData - Os dados do usuário (idusuario, nome, papel).
     */
    function login(newToken, userData) {
        token.value = newToken;
        user.value = userData;

        // Persistência no navegador usando as constantes
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        console.log(`Usuário logado como: ${userData.papel}`);
    }

    function logout() {
        token.value = null;
        user.value = null;
        
        // Remove os dados persistidos usando as constantes
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        console.log('Logout realizado com sucesso.');
    }

    // Retorna todos os estados, getters e ações que estarão disponíveis para a aplicação
    return { 
        token, 
        user, 
        isAuthenticated, 
        userRole, 
        userName, 
        isAdmin, 
        isProfessor, 
        isAluno, 
        login, 
        logout 
    };
});