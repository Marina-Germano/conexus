import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useContatoStore =
defineStore('contato', {
    state:() => ({
        contatos: []
    }),


    actions: {

        async exibir(){
            try{
                const dados = await api.get(
                    '/Contato/buscartodos'
                ); //
                this.contatos = dados.data.data;
                console.log("Dados de Contato carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de Contato", erro);
                return false;
            }
        },

        async adicionar(contato){
            try{
                const dados = await api.post('/Contato/inserir', {
                    idcontato: 0,
                    idusuario: contato.idusuario,
                    nome: contato.nome,
                    email: contato.email,
                    telefone: contato.telefone,
                    arquivo: contato.arquivo,
                    ativocontato: contato.ativocontato,
                    mensagem: contato.mensagem
                });

                this.contatos.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir Contato", erro);
                return false;
            }
        },

        async atualizar(id, contato){
            try{
                const dados = await api.put('/Contato/atualizar',{
                    idcontato: id,
                    idusuario: contato.idusuario,
                    nome: contato.nome,
                    email: contato.email,
                    telefone: contato.telefone,
                    arquivo: contato.arquivo,
                    ativocontato: contato.ativocontato,
                    mensagem: contato.mensagem
                });

                const index = this.contatos.findIndex(item => item.idcontato === id);
                if(index!==-1){
                    this.contatos[index] = { ...this.contatos[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar Contato", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Contato/excluir/${id}`); 

                this.contatos = this.contatos.filter(item =>
                    item.idcontato !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar Contato", erro);
                return false;
            }
        }
    }
})