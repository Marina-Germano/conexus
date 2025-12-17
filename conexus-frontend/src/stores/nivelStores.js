import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useNivelStore =
defineStore('nivel', {
    state:() => ({
        niveis: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/Nivel/buscartodos'
                ); //
                this.niveis = dados.data.data;
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de Nível", erro);
                return false;
            }
        },

        async adicionar(nivel){
            try{
                const dados = await api.post('/Nivel/inserir', {
                    idnivel: 0, //
                    descricao: nivel.descricao //
                });

                this.niveis.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir Nível", erro);
                return false;
            }
        },

        async atualizar(id, nivel){
            try{
                const dados = await api.put('/Nivel/atualizar',{
                    idnivel: id, //
                    descricao: nivel.descricao //
                });

                const index = this.niveis.findIndex(item => item.idnivel === id);
                if(index!==-1){
                    this.niveis[index] = { ...this.niveis[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar Nível", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Nivel/excluir/${id}`); //

                this.niveis = this.niveis.filter(item =>
                    item.idnivel !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar Nível", erro);
                return false;
            }
        }
    }
})