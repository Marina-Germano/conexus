

import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useUsuarioStore =
defineStore('usuario', {
    state:() => ({
        usuarios: []
    }),


    actions: {

        async exibir(){
            try{
                const dados = await api.get(
                    '/Usuario/buscartodos'
                );
                this.usuarios = dados.data.data;
                console.log("Dados dos usuários carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados do usuário", erro);
                return false;
            }
        },

        async adicionar(usuario){
            try{
                const dados = await api.post('/Usuario/inserir', {
                    idusuario: 0,
                    nome: usuario.nome,
                    telefone: usuario.telefone,
                    email: usuario.email,
                    datanascimento: usuario.datanascimento,
                    cpf: usuario.cpf,
                    senha: usuario.senha,
                    perfil: usuario.perfil,
                    papel: usuario.papel,
                    ativo: usuario.ativo,
                    foto: usuario.foto,
                    tentativaslogin: usuario.tentativaslogin,
                    bloqueado: usuario.bloqueado
                });

                this.usuarios.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir o usuário", erro);
                return false;
            }
        },

        async atualizar(id, usuario){
            try{
                const dados = await api.put('/Usuario/atualizar',{
                    idusuario: id,
                    nome: usuario.nome,
                    telefone: usuario.telefone,
                    email: usuario.email,
                    datanascimento: usuario.datanascimento,
                    cpf: usuario.cpf,
                    senha: usuario.senha,
                    perfil: usuario.perfil,
                    papel: usuario.papel,
                    ativo: usuario.ativo,
                    foto: usuario.foto,
                    tentativaslogin: usuario.tentativaslogin,
                    bloqueado: usuario.bloqueado
                });

                const index = this.usuarios.findIndex(item => item.idusuario === id);
                if(index!==-1){
                    this.usuarios[index] = { ...this.usuarios[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar o usuário", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Usuario/excluir/${id}`);

                this.usuarios = this.usuarios.filter(item =>
                    item.idusuario !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar o usuário", erro);
                return false;
            }
        }
    }
})