import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useIdiomaStore =
defineStore('idioma', {
    state:() => ({
        idiomas: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/Idioma/buscartodos'
                ); //
                this.idiomas = dados.data.data;
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados do idioma", erro);
                return false;
            }
        },

        async adicionar(idioma){
            try{
                const dados = await api.post('/Idioma/inserir', {
                    ididioma: 0,
                    descricao: idioma.descricao
                });

                this.idiomas.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir o idioma", erro);
                return false;
            }
        },

        async atualizar(id, idioma){
            try{
                const dados = await api.put('/Idioma/atualizar',{
                    ididioma: id,
                    descricao: idioma.descricao
                });

                const index = this.idiomas.findIndex(item => item.ididioma === id);
                if(index!==-1){
                    this.idiomas[index] = { ...this.idiomas[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar o idioma", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Idioma/excluir/${id}`); //

                this.idiomas = this.idiomas.filter(item =>
                    item.ididioma !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar o idioma", erro);
                return false;
            }
        }
    }
})