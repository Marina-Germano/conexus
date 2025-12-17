// Arquivo: @/stores/avaliacaoStore.js

import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useAvaliacaoStore = defineStore('avaliacao', {
    state: () => ({
        // O estado pode ser vazio ou conter notas de uma turma sendo editada
    }),
    actions: {
        
        async buscarNotasPorTurma(idTurma) {
            // Busca as notas existentes para todos os alunos de uma turma específica
            try {
                // Endpoint sugerido: /Avaliacao/buscarporturma/1
                const response = await api.get(`/Avaliacao/buscartodos`);
                return response.data; // Retorna uma lista de { idaluno, idturma, nota1, nota2, notaFinal }
            } catch (erro) {
                console.error(`Erro ao buscar notas para a turma ${idTurma}`, erro);
                return [];
            }
        },

        async salvarNotas(registrosNotas) {
            // Envia um array de objetos para salvar ou atualizar as notas em lote.
            try {
                const response = await api.post('/Avaliacao/salvarnotas', registrosNotas);
                console.log("Notas registradas com sucesso!", response.data);
                return true;
            } catch (erro) {
                console.error("Erro ao salvar notas", erro);
                return false;
            }
        }
    }
});