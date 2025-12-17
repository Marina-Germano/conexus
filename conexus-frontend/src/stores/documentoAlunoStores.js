import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useDocumentoAlunoStore =
defineStore('documentoAluno', {
    state:() => ({
        documentosAluno: []
    }),


    actions: {

        async exibir(){
            try{
                const dados = await api.get(
                    '/DocumentoAluno/buscartodos'
                ); 
                this.documentosAluno = dados.data.data;
                console.log("Dados de DocumentoAluno carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de DocumentoAluno", erro);
                return false;
            }
        },

        async adicionar(documentoAluno){
            try{
                const dados = await api.post('/DocumentoAluno/inserir', {

                    iddocumento: 0, 
                    idaluno: documentoAluno.idaluno,
                    idtipodocumento: documentoAluno.idtipodocumento,
                    caminhoarquivo: documentoAluno.caminhoarquivo,
                    dataenvio: documentoAluno.dataenvio,
                    observacoes: documentoAluno.observacoes,
                    statusdocumento: documentoAluno.statusdocumento
                });

                this.documentosAluno.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir DocumentoAluno", erro);
                return false;
            }
        },

        async atualizar(id, documentoAluno){
            try{
                const dados = await api.put('/DocumentoAluno/atualizar',{
                    iddocumento: id,
                    idaluno: documentoAluno.idaluno,
                    idtipodocumento: documentoAluno.idtipodocumento,
                    caminhoarquivo: documentoAluno.caminhoarquivo,
                    dataenvio: documentoAluno.dataenvio,
                    observacoes: documentoAluno.observacoes,
                    statusdocumento: documentoAluno.statusdocumento
                });

                const index = this.documentosAluno.findIndex(item => item.iddocumento === id);
                if(index!==-1){
                    this.documentosAluno[index] = { ...this.documentosAluno[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar DocumentoAluno", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/DocumentoAluno/excluir/${id}`); //

                this.documentosAluno = this.documentosAluno.filter(item =>
                    item.iddocumento !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar DocumentoAluno", erro);
                return false;
            }
        }
    }
})