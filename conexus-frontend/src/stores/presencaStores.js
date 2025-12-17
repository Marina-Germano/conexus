
import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const usePresencaStore = defineStore('presenca', {
    state: () => ({

    }),
    actions: {
        
        async buscarPresencasPorAula(idAula) {
            try {
                const response = await api.get(`/Presenca/buscarporaula/${idAula}`);
                return response.data; 
            } catch (erro) {
                console.error(`Erro ao buscar presenças para a aula ${idAula}`, erro);
                return [];
            }
        },

        async registrarPresencas(registrosPresenca) {
            try {
                const response = await api.post('/Presenca/registrar', registrosPresenca);
                console.log("Presenças registradas com sucesso!", response.data);
                return true;
            } catch (erro) {
                console.error("Erro ao registrar presenças", erro);
                return false;
            }
        }
    }
});