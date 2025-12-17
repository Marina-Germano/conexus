import { defineStore } from "pinia";
import api from '@/plugins/axios'

// Função auxiliar para dividir data e hora (necessário para o seu backend)
const splitDateTime = (dateTimeString) => {
    // Ex: "2025-12-15T09:00:00" -> ["2025-12-15", "09:00:00"]
    const [dataaula, timePart] = dateTimeString.split('T');
    const horainicio = timePart ? timePart.substring(0, 5) : null; // Pega apenas HH:mm
    return { dataaula, horainicio };
};


export const useCalendarioAulaStore =
defineStore('calendarioAula', {
    state:() => ({
        aulas: []
    }),


    actions: {
        // ... (exibir, adicionar, atualizar e apagar permanecem aqui, com a sintaxe corrigida)

        // RF06: Unifica as ações de Adicionar e Atualizar, e faz o mapeamento de campos.
        async saveAula(aulaData) {
            
            // 1. Mapeamento de Campos do Frontend para o Backend
            const { dataaula: start_date, horainicio: start_time } = splitDateTime(aulaData.start);
            const { horainicio: end_time } = splitDateTime(aulaData.end); // Reutiliza a função para pegar só o tempo final
            
            const payload = {
                // Mapeamento dos campos do formulário para o formato da API
                idaula: aulaData.id || 0, // Usado para 'atualizar', 0 para 'adicionar'
                dataaula: start_date,
                horainicio: start_time,
                horafim: end_time,
                idfuncionario: aulaData.professor_id, // Assume que professor_id é o idfuncionario
                idturma: aulaData.turma_id,
                // idmaterial: aulaData.idmaterial, // Incluir se o form tiver este campo
                sala: aulaData.sala_id, // Assume que sala_id é o campo 'sala' da API
                observacoes: aulaData.conteudo || aulaData.title, // Associa o conteúdo/título à observação
                linkreuniao: aulaData.link_reuniao,
                // aulaextra: aulaData.aulaextra // Incluir se o form tiver este campo
                // status: aulaData.status // Se a API gerenciar status
            };

            let sucesso;

            if (aulaData.id) {
                // Edição
                sucesso = await this.atualizar(aulaData.id, payload);
            } else {
                // Cadastro. Nota: a action 'adicionar' espera a estrutura de payload
                sucesso = await this.adicionar(payload);
            }

            if (sucesso) {
                // Após a submissão, re-carrega as aulas para atualizar o calendário
                // Isso é opcional, mas garante que a View esteja sincronizada.
                // Se a View estiver causando o loop, remova esta linha e chame exibir() na View.
                // await this.exibir(); 
            }

            return sucesso;
        },


        async exibir(){
            try{
                const dados = await api.get('/CalendarioAula/buscartodos');
                this.aulas = dados.data.data;
                console.log("Dados de CalendarioAula carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de CalendarioAula", erro);
                return false;
            }
        },

        // ** Importante: A action 'adicionar' agora recebe os dados já MAPEADOS (payload) **
        async adicionar(aulaPayload){
            try{
                // Removendo idaula: 0, pois ele já está no payload
                const dados = await api.post('/CalendarioAula/inserir', aulaPayload); 

                this.aulas.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir CalendarioAula", erro);
                return false;
            }
        },

        // ** Importante: A action 'atualizar' agora recebe os dados já MAPEADOS (payload) **
        async atualizar(id, aulaPayload){
            try{
                const dados = await api.put('/CalendarioAula/atualizar', aulaPayload);
                
                const index = this.aulas.findIndex(item => item.idaula === id);
                if(index!==-1){
                    // Atualiza o item localmente com o que a API retornou
                    this.aulas[index] = { ...this.aulas[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar CalendarioAula", erro);
                return false;
            }
        },

        async apagar(id){
            try{
                await api.delete(`/CalendarioAula/excluir/${id}`);

                this.aulas = this.aulas.filter(item => item.idaula !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar CalendarioAula", erro);
                return false;
            }
        },
        
        async buscarAulasDoAluno(idAluno, idTurma = null) {
            try {
                let url = `/Aula/buscarPorAluno/${idAluno}`;
                if (idTurma) {
                    url += `?idTurma=${idTurma}`; 
                }

                const response = await api.get(url);
                this.aulas = response.data; 
                return true;
            } catch (error) {
                console.log("Erro ao carregar aulas do aluno:", error);
                return false;
            }
        },
    } 
})