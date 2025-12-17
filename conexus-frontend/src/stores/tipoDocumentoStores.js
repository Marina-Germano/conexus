import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useTipoDocumentoStore =
defineStore('tipoDocumento', {
    state:() => ({
        tiposDocumento: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/TipoDocumento/buscartodos'
                );
                this.tiposDocumento = dados.data.data;
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de TipoDocumento", erro);
                return false;
            }
        },

        async adicionar(tipoDocumento){
            try{
                const dados = await api.post('/TipoDocumento/inserir', {
                    idtipodocumento: 0,
                    descricao: tipoDocumento.descricao
                });

                this.tiposDocumento.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir TipoDocumento", erro);
                return false;
            }
        },

        async atualizar(id, tipoDocumento){
            try{
                const dados = await api.put('/TipoDocumento/atualizar',{
                    idtipodocumento: id,
                    descricao: tipoDocumento.descricao
                });

                const index = this.tiposDocumento.findIndex(item => item.idtipodocumento === id);
                if(index!==-1){
                    this.tiposDocumento[index] = { ...this.tiposDocumento[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar TipoDocumento", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/TipoDocumento/excluir/${id}`);

                this.tiposDocumento = this.tiposDocumento.filter(item =>
                    item.idtipodocumento !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar TipoDocumento", erro);
                return false;
            }
        }
    }
})