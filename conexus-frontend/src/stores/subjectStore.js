//gerenciar Disciplinas

import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        // Lista de disciplinas disponíveis para o formulário de turma
        subjects: [],
    }),

    actions: {
        async fetchSubjects() {
            if (this.subjects.length > 0) return; // Evita buscar se já estiver carregado

            try {
                // Rota de API hipotética para disciplinas
                const response = await api.get('/disciplinas'); 
                // Assumindo que a resposta traz um array de strings ou objetos
                this.subjects = response.data; 
                console.log("Disciplinas carregadas com sucesso.");
                return true;
            } catch (erro) {
                console.error("Erro ao carregar a lista de disciplinas.", erro);
                return false;
            }
        },
    }
});