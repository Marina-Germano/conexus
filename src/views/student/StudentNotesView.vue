<script>
    export default {
    data() {
            return {
            cursoSelecionado: null,

            // MOCK — Substituir pela API
            cursos: [
                { id_curso: 1, nome_curso: 'Inglês Básico' },
                { id_curso: 2, nome_curso: 'Francês Intermediário' },
            ],

            atividades: [],
            };
        },

        computed: {
            mediaFormatada() {
                if (this.atividades.length === 0) return "N/A";
                const soma = this.atividades.reduce((acc, a) => acc + Number(a.nota), 0);
                return soma / this.atividades.length;
            },
        },
        
        methods: {
            carregarAtividades() {
            // MOCK: você vai substituir pelo Axios/fetch da sua API
                if (this.cursoSelecionado === 1) {
                    this.atividades = [
                    { nome_atividade: "Prova 1", nota: 8.5 },
                    { nome_atividade: "Trabalho 1", nota: 9.2 },
                    ];
                } else if (this.cursoSelecionado === 2) {
                    this.atividades = [
                    { nome_atividade: "Prova Oral", nota: 7.8 },
                    { nome_atividade: "Redação", nota: 8.0 },
                    ];
                } else {
                    this.atividades = [];
                }
            },

            formatarNota(valor) {
                return Number(valor).toFixed(1).replace('.', ',');
            },
        },
    };
    import UserHeader from '@/components/UserHeader.vue';
</script>
<template>
    <v-app> 
        <UserHeader /> 
        <v-main>
            <v-container fluid class="pa-6">
                <h1 class="text-h4 mb -6">Meu Boletim</h1>
            </v-container>
            <v-container fluid class="pa-6">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-select
                            v-model="cursoSelecionado"
                            :items="cursos"
                            item-title="nome_curso"
                            item-value="id_curso"
                            label="Escolha um curso"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-btn 
                            color="primary" 
                            class="mt-1"
                            @click="carregarAtividades"
                            block
                        > Exibir Notas </v-btn>
                    </v-col>
                </v-row>
                <div v-if="!cursoSelecionado" class="text-center text-red text-body-1 my-4">
                    Selecione um curso para ver o boletim.
                </div>
                <div v-else-if="cursoSelecionado && atividades.length === 0" class="text-center text-red text-body-1 my-4">
                    Nenhuma atividade encontrada para o curso.
                </div>
                <div v-else>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">Atividade</th>
                                <th class="text-left">Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(atividade, index) in atividades" :key="index">
                            <td>{{ atividade.nome_atividade }}</td>
                            <td>{{ formatarNota(atividade.nota) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="text-left">Média Final</th>
                                <th class="text-left">{{ calcularMediaFinal() }}</th>
                            </tr>
                        </tfoot>
                    </v-table>
                </div>
            </v-container>
        </v-main> 
    </v-app>
</template>
