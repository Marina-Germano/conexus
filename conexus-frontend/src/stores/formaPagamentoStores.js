import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useFormaPagamentoStore =
defineStore('formaPagamento', {
    state:() => ({
        formasPagamento: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/FormaPagamento/buscartodos'
                ); //
                this.formasPagamento = dados.data.data;
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados da forma de pagamento", erro);
                return false;
            }
        },

        async adicionar(formaPagamento){
            try{
                const dados = await api.post('/FormaPagamento/inserir', {
                    idformaPagamento: 0, //
                    formaPagamento1: formaPagamento.formaPagamento1 //
                });

                this.formasPagamento.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir a forma de pagamento", erro);
                return false;
            }
        },

        async atualizar(id, formaPagamento){
            try{
                const dados = await api.put('/FormaPagamento/atualizar',{
                    idformaPagamento: id, //
                    formaPagamento1: formaPagamento.formaPagamento1 //
                });

                const index = this.formasPagamento.findIndex(item => item.idformaPagamento === id);
                if(index!==-1){
                    this.formasPagamento[index] = { ...this.formasPagamento[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar a forma de pagamento", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/FormaPagamento/excluir/${id}`); //

                this.formasPagamento = this.formasPagamento.filter(item =>
                    item.idformaPagamento !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar a forma de pagamento", erro);
                return false;
            }
        }
    }
})