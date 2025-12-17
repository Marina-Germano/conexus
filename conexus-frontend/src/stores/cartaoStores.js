import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useCartaoStore =
defineStore('cartao', {

    state:() => ({

        cartoes: []
    }),


    actions: {

        async exibir(){
            try{
                const dados = await api.get(
                    '/Cartao/buscartodos'
                ); 
                this.cartoes = dados.data.data;
                console.log("Dados dos cartões carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados do cartão", erro);
                return false;
            }
        },

        async adicionar(cartao){
            try{
                const dados = await api.post('/Cartao/inserir', {
                    idcartao: 0, 
                    idaluno: cartao.idaluno,
                    nomeTitular: cartao.nomeTitular,
                    bandeira: cartao.bandeira,
                    ultimosDigitos: cartao.ultimosDigitos,
                    numeroCriptografado: cartao.numeroCriptografado,
                    validadeMes: cartao.validadeMes,
                    validadeAno: cartao.validadeAno
                });

                this.cartoes.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir o cartão", erro);
                return false;
            }
        },

        async atualizar(id, cartao){
            try{
                const dados = await api.put('/Cartao/atualizar',{
                    idcartao: id, 
                    idaluno: cartao.idaluno,
                    nomeTitular: cartao.nomeTitular,
                    bandeira: cartao.bandeira,
                    ultimosDigitos: cartao.ultimosDigitos,
                    numeroCriptografado: cartao.numeroCriptografado,
                    validadeMes: cartao.validadeMes,
                    validadeAno: cartao.validadeAno
                });

                const index = this.cartoes.findIndex(item => item.idcartao === id);
                if(index!==-1){
                    this.cartoes[index] = { ...this.cartoes[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar o cartão", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Cartao/excluir/${id}`); 

                this.cartoes = this.cartoes.filter(item =>
                    item.idcartao !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar o cartão", erro);
                return false;
            }
        }
    }
})