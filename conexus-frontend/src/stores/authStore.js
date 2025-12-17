// authStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios'; // Mantendo a importação correta

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
        userRole: null, 
        loading: false,
        error: null,
    }),
    
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.userRole === 'admin',
        isStudent: (state) => state.userRole === 'aluno', 
        isTeacher: (state) => state.userRole === 'professor', 
    },
    
    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                // USA A VARIÁVEL 'api' IMPORTADA
                const response = await api.post('/api/login', credentials); 
                
                const { token, user } = response.data.data || response.data; 
                
                this.token = token;
                this.user = user; 
                this.userRole = user.role; 
                
                localStorage.setItem('token', token);
                
                return true;

            } catch (e) {
                this.error = e.response?.data?.message || 'Erro ao fazer login. Verifique seu CPF e senha.';
                this.token = null; 
                this.userRole = null;
                localStorage.removeItem('token');
                
                console.error("Erro na API de login:", e);
                return false; 
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.userRole = null;
            localStorage.removeItem('token');
        }
    },
});