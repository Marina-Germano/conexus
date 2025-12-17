import { defineStore } from "pinia";
import api from '@/plugins/axios'


export const useAlunoTurmaStore =
defineStore('alunoTurma', {
    state:() => ({
        alunosTurmas: []
    }),

    actions: {
        
        async exibir(){
            try{
                const dados = await api.get(
                    '/AlunoTurma/buscartodos'
                );
                this.alunosTurmas = dados.data.data;
                console.log("Dados de AlunoTurma carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de AlunoTurma", erro);
                return false;
            }
        },

        async adicionar(alunoTurma){
            try{
                const dados = await api.post('/AlunoTurma/inserir', {
                    idalunoTurma: 0, 
                    idaluno: alunoTurma.idaluno,
                    idturma: alunoTurma.idturma,
                    datamatricula: alunoTurma.datamatricula
                });

                this.alunosTurmas.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir AlunoTurma", erro);
                return false;
            }
        },

        async atualizar(id, alunoTurma){
            try{
                const dados = await api.put('/AlunoTurma/atualizar',{
                    idalunoTurma: id,
                    idaluno: alunoTurma.idaluno,
                    idturma: alunoTurma.idturma,
                    datamatricula: alunoTurma.datamatricula
                });

                const index = this.alunosTurmas.findIndex(item => item.idalunoTurma === id);
                if(index!==-1){
                    this.alunosTurmas[index] = { ...this.alunosTurmas[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar AlunoTurma", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/AlunoTurma/excluir/${id}`);

                this.alunosTurmas = this.alunosTurmas.filter(item =>
                    item.idalunoTurma !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar AlunoTurma", erro);
                return false;
            }
        }, // <-- NOTA: Não precisa de vírgula se for o último item do objeto 'actions'

        // FUNÇÃO DE BUSCAR TURMAS DO PROFESSOR (Corrigida)
        async buscarTurmasPorProfessor(idProfessor) {
            try {
                const dados = await api.get(
                    `/AlunoTurma/buscarturmasporprofessor/${idProfessor}`
                );
                // Assumindo que a API retorna dados formatados
                return dados.data; 
            } catch (erro) {
                console.error("Erro ao carregar turmas do professor:", erro);
                return [];
            }
        },

        // FUNÇÃO DE BUSCAR ALUNOS POR TURMA (Corrigida)
        async buscarAlunosPorTurma(idTurma){
            try{
                const dados = await api.get(`/AlunoTurma/buscarPorTurma/${idTurma}`);
                return dados.data.data;
            }catch(erro){
                console.error(`Erro ao buscar alunos para a turma ${idTurma}`, erro);
                return [];
            }
        },

    }, // <-- Fechamento CORRETO do bloco 'actions'

    // getteres aqui se houver
    // ...
})