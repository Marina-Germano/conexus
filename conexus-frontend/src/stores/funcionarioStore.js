// src/stores/funcionarioStore.js
import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useFuncionarioStore = defineStore("funcionario", {
  state: () => ({
    funcionarios: []
  }),

  actions: {
    async exibir() {
      try {
        const res = await api.get("/Funcionario/buscartodos");
        this.funcionarios = res.data.data;
        return true;
      } catch (error) {
        console.error("Erro ao listar funcionários", error);
        return false;
      }
    },

    async adicionar(form) {
      try {
        // 1️⃣ cria usuário
        const usuarioRes = await api.post("/Usuario/inserir", {

          nome: form.nome,
          cpf: form.cpf,
          email: form.email,
          telefone: form.telefone,
          dataNascimento: form.dataNascimento,
          senha: form.senha,
          papel: "funcionario",
          idusuario: 0,
          ativo: true,
          foto: "",
          tentativasLogin: 0,
          bloqueado: true
        });

        const idusuario = usuarioRes.data.data;

        // 2️⃣ cria funcionário
        const funcRes = await api.post("/Funcionario/inserir", {
          idfuncionario: 0,
          idusuario,
          cargo: form.cargo,
          especialidade: form.especialidade
        });

        this.funcionarios.push(funcRes.data);
        return true;
      } catch (error) {
        console.error("Erro ao cadastrar funcionário", error);
        return false;
      }
    },

    async atualizar(idfuncionario, form) {
      try {
        const funcionario = this.funcionarios.find(
          f => f.idfuncionario === idfuncionario
        );

        if (!funcionario) return false;

        const idusuario = funcionario.idusuario;

        // 1️⃣ atualiza usuário
        await api.put("/Usuario/atualizar", {
          idusuario,
          nome: form.nome,
          cpf: form.cpf,
          email: form.email,
          telefone: form.telefone,
          dataNascimento: form.dataNascimento
        });

        // 2️⃣ atualiza funcionário
        const funcRes = await api.put("/Funcionario/atualizar", {
          idfuncionario,
          idusuario,
          cargo: form.cargo,
          especialidade: form.especialidade
        });

        const index = this.funcionarios.findIndex(
          f => f.idfuncionario === idfuncionario
        );

        if (index !== -1) {
          this.funcionarios[index] = {
            ...this.funcionarios[index],
            ...funcRes.data
          };
        }

        return true;
      } catch (error) {
        console.error("Erro ao atualizar funcionário", error);
        return false;
      }
    },

    async apagar(idfuncionario) {
      try {
        const funcionario = this.funcionarios.find(
          f => f.idfuncionario === idfuncionario
        );

        if (!funcionario) return false;

        await api.delete(`/Funcionario/excluir/${idfuncionario}`);
        await api.delete(`/Usuario/excluir/${funcionario.idusuario}`);

        this.funcionarios = this.funcionarios.filter(
          f => f.idfuncionario !== idfuncionario
        );

        return true;
      } catch (error) {
        console.error("Erro ao apagar funcionário", error);
        return false;
      }
    }
  }
});
