// src/stores/turmaStore.js
import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useTurmaStore = defineStore("turma", {
  state: () => ({
    turmas: []
  }),

  actions: {
    async exibir() {
      try {
        const res = await api.get("/Turma/buscartodos");
        this.turmas = res.data.data;
        return true;
      } catch (error) {
        console.error("Erro ao listar turmas", error);
        return false;
      }
    },

    async adicionar(turma) {
      try {
        const res = await api.post("/Turma/inserir", {
          idturma: 0,
          ididioma: turma.ididioma,
          idnivel: turma.idnivel,
          idfuncionario: turma.idfuncionario,
          descricao: turma.descricao,
          diassemana: turma.diassemana,
          horaInicio: "12:00:00",
          capacidadeMaxima: turma.capacidadeMaxima,
          sala: turma.sala,
          imagem: turma.imagem,
          tipoRecorrencia: turma.tipoRecorrencia
        });

        this.turmas.push(res.data.data);
        return true;
      } catch (error) {
        console.error("Erro ao cadastrar turma", error);
        return false;
      }
    },

    async atualizar(idturma, turma) {
      try {
        const res = await api.put("/Turma/atualizar", {
          idturma,
          iddisciplina: turma.iddisciplina,
          idnivel: turma.idnivel,
          idfuncionario: turma.idfuncionario,
          descricao: turma.descricao,
          diassemana: turma.diassemana,
          horainicio: turma.horainicio,
          capacidadeMaxima: turma.capacidadeMaxima,
          sala: turma.sala,
          imagem: turma.imagem,
          tiporecorrencia: turma.tiporecorrencia
        });

        const index = this.turmas.findIndex(t => t.idturma === idturma);
        if (index !== -1) {
          this.turmas[index] = {
            ...this.turmas[index],
            ...res.data.data
          };
        }

        return true;
      } catch (error) {
        console.error("Erro ao atualizar turma", error);
        return false;
      }
    },

    async apagar(idturma) {
      try {
        await api.delete(`/Turma/excluir/${idturma}`);
        this.turmas = this.turmas.filter(t => t.idturma !== idturma);
        return true;
      } catch (error) {
        console.error("Erro ao apagar turma", error);
        return false;
      }
    }
  }
});
