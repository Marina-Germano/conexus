import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useTipoMaterialStore =
defineStore('tipoMaterial', {
    state:() => ({
        tiposMaterial: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/TipoMaterial/buscartodos'
                );
                this.tiposMaterial = dados.data.data;
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de TipoMaterial", erro);
                return false;
            }
        },

        async adicionar(tipoMaterial){
            try{
                const dados = await api.post('/TipoMaterial/inserir', {
                    idtipomaterial: 0,
                    descricao: tipoMaterial.descricao
                });

                this.tiposMaterial.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir TipoMaterial", erro);
                return false;
            }
        },

        async atualizar(id, tipoMaterial){
            try{
                const dados = await api.put('/TipoMaterial/atualizar',{
                    idtipomaterial: id,
                    descricao: tipoMaterial.descricao
                });

                const index = this.tiposMaterial.findIndex(item => item.idtipomaterial === id);
                if(index!==-1){
                    this.tiposMaterial[index] = { ...this.tiposMaterial[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar TipoMaterial", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/TipoMaterial/excluir/${id}`);

                this.tiposMaterial = this.tiposMaterial.filter(item =>
                    item.idtipomaterial !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar TipoMaterial", erro);
                return false;
            }
        }
    }
})