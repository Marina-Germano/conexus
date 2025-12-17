import { defineStore } from "pinia";
import api from '@/plugins/axios';

export const useMaterialStore = defineStore('material', {

  state: () => ({
    materiais: []
  }),

  actions: {

    async exibir() {
      try {
        const dados = await api.get('/Material/buscartodos');
        this.materiais = dados.data.data;
        return true;
      } catch (erro) {
        console.error("Erro ao carregar materiais", erro);
        return false;
      }
    },

    async salvarMaterial(material, id = null) {
      return id
        ? await this.atualizar(id, material)
        : await this.adicionar(material);
    },

    async adicionar(material) {
      try {
        const materialRes = await api.post("/Material/inserir",{
        idmaterial:0,
        idtipoMaterial:material.idtipoMaterial,
        ididioma:material.ididioma,
        idnivel: material.idnivel,
        idturma: material.idturma,
        titulo: material.titulo,
        descricao: material.descricao,
        quantidade: material.quantidade,
        formatoArquivo: material.formatoArquivo,
        arquivo: material.arquivo,
        dataCadastro:material.dataCadastro
        });

  

          this.materiais.push( materialRes.data.data);
          return true;
      }catch(error){
          console.log("Erro ao inserir o material", error);
          return false;
      }
  },


    async atualizar(id, material) {
      try {
        const formData = this._montarFormData(material);
        formData.append('idmaterial', id);

        await api.put('/Material/atualizar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        return true;
      } catch (erro) {
        console.error("Erro ao atualizar material", erro);
        return false;
      }
    },

    async apagar(id) {
      try {
        await api.delete(`/Material/excluir/${id}`);
        this.materiais = this.materiais.filter(m => m.idmaterial !== id);
        return true;
      } catch (erro) {
        console.error("Erro ao apagar material", erro);
        return false;
      }
    },


    _montarFormData(material) {
      const formData = new FormData();

      formData.append('titulo', material.titulo);
      formData.append('descricao', material.descricao ?? '');
      formData.append('quantidade', material.quantidade);
      formData.append('idtipo_material', material.idtipomaterial);
      formData.append('iddisciplina', material.ididioma);
      formData.append('idnivel', material.idnivel);
      formData.append('idturma', material.idturma ?? 0);

      if (material.arquivo) {
        formData.append('arquivo', material.arquivo);
        formData.append('formatoarquivo', material.arquivo.type);
      }

      return formData;
    }
  }
});
