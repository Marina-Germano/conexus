<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const drawer = ref(false);


const userName = computed(() => authStore.user?.nome || 'Convidado');
const userRole = computed(() => authStore.user?.papel || 'deslogado'); 

const navigationLinks = computed(() => {
    switch (userRole.value) {
        case 'admin':
            return [
                { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/admin/dashboard' },
                { title: 'Cadastrar Aluno', icon: 'mdi-account-plus', route: '/admin/register-student' },
                { title: 'Cadastrar Funcionário', icon: 'mdi-briefcase-account', route: '/admin/register-employer' },
                { title: 'Cadastrar Turma', icon: 'mdi-google-classroom', route: '/admin/register-class' }, 
                { title: 'Relatório Financeiro', icon: 'mdi-cash-multiple', route: '/admin/financial-report' }, 
                { title: 'Relatório de Materiais', icon: 'mdi-book-multiple', route: '/admin/material-report' },
            ];
        case 'professor':
            return [
                { title: 'Home Professor', icon: 'mdi-home', route: '/teacher/home' }, 
                { title: 'Cadastrar Material', icon: 'mdi-book-plus', route: '/teacher/register-material' }, 
                { title: 'Minhas Turmas', icon: 'mdi-account-group', route: '/teacher/my-classes' },
            ];
        case 'aluno':
            return [
                { title: 'Home Aluno', icon: 'mdi-home', route: '/student/home' },
                { title: 'Minhas Aulas', icon: 'mdi-video', route: '/student/contents' },
                { title: 'Minhas Playlists', icon: 'mdi-playlist-play', route: '/student/playlists' },
            ];
        default:
            return [];
    }
});

const navigateTo = (route) => {
    router.push(route);
    // Fecha o drawer em telas pequenas após a navegação
    if (drawer.value) {
        drawer.value = false;
    }
};

const logout = () => {
    //  Chama a ação de logout do Store e redireciona
    authStore.logout();
    router.push('/login');
};
</script>

<template>
    <v-navigation-drawer 
        v-model="drawer" 
        app 
        temporary 
        class="deep-purple accent-4" 
        dark
    >
        <v-list>
            <v-list-item class="mb-2">
                <v-list-item-title class="text-h6">
                    Conexus
                </v-list-item-title>
                <v-list-item-subtitle>
                    Usuário: {{ userName }} ({{ userRole.toUpperCase() }})
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
        
        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item
                v-for="item in navigationLinks"
                :key="item.title"
                :prepend-icon="item.icon"
                :title="item.title"
                @click="navigateTo(item.route)"
                :active="router.currentRoute.value.path === item.route"
                class="text-uppercase"
            ></v-list-item>
        </v-list>
        
        <template v-slot:append>
            <div class="pa-2">
                <v-btn block color="red" @click="logout">
                    <v-icon left>mdi-logout</v-icon>
                    Sair
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Painel {{ userRole.toUpperCase() }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout" title="Sair">
            <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
    </v-app-bar>
</template>