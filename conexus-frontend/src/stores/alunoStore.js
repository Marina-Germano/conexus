import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useAlunoStore =
defineStore('aluno', {
    state:() => ({
        alunos: []
    }),

    actions: {
        async exibir(){
            try{
                const dados = await api.get(
                    '/Aluno/buscartodos'
                );
                // CORREÇÃO: Usando spread operator para evitar loop de reatividade 
                this.alunos = [...dados.data.data]; 
                console.log("dados carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados do aluno", erro);
                return false;
            }
        },

        async adicionar(aluno){
            try{
                // 1️⃣ cria usuário
                    const usuarioRes = await api.post("/Usuario/inserir", {
                    nome: aluno.nome,
                    cpf: aluno.cpf,
                    email: aluno.email,
                    telefone: aluno.telefone,
                    dataNascimento: aluno.dataNascimento,
                    senha: aluno.senha,
                    papel: "aluno",
                    idusuario: 0,
                    ativo: true,
                    foto: "",
                    tentativasLogin: 0,
                    bloqueado: true

                  });
                 const idusuario = usuarioRes.data.data;
                 console.log(usuarioRes.data)
                const dados = await api.post('/Aluno/inserir', {
                    id: 0,
                    idaluno: 0,
                    //nomealuno: aluno.nomealuno,
                    idusuario,
                    numero:aluno.numero,
                    cep: aluno.cep,
                    rua: aluno.rua,
                    bairro: aluno.bairro,
                    complemento: aluno.complemento,
                    responsavel: aluno.responsavel,
                    telResponsavel: aluno.telResponsavel,
                    situacao: aluno.situacao,
                }); 

                this.alunos.push(dados.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir o aluno", erro);
                return false;
            }
        },

        async atualizar(id, aluno){
            try{
                const dados = await api.put('/Aluno/atualizar',{
                    id: id,
                    nomealuno: aluno.nomealuno,
                    idusuario: aluno.idusuario,
                    cep: aluno.cep,
                    rua: aluno.rua,
                    bairro: aluno.bairro,
                    complemento: aluno.complemento,
                    responsavel: aluno.responsavel,
                    telresponsavel: aluno.telresponsavel,
                    situacao: aluno.situacao,
                }); 

                const index = this.alunos.findIndex(item => item.id === id);
                if(index!==-1){
                    this.alunos[index] = { ...this.alunos[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar o aluno", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/Aluno/excluir/${id}`); 

                this.alunos = this.alunos.filter(item => 
                    item.id !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar o aluno", erro);
                return false;
            }
        }
    }
})