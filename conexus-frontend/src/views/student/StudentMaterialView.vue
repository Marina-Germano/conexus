<script>
    export default {
    name: "MateriaisView",

    data() {
        return {
        // imagens default para quando vier null
        defaultProfessorImg:
            "/escola-de-idiomas/conexus_sistema/public/img/pic-1.jpg",
        defaultThumbImg:
            "/escola-de-idiomas/conexus_sistema/public/img/english-course-1024x576.jpg",

        // mock de exemplo — depois substitui pelo retorno da API
        materiais: [
            {
            id: 1,
            professor_nome: "Carlos Almeida",
            professor_foto: "/img/prof1.jpg",
            data_cadastro: "2025-02-10",
            turma_imagem: "/img/material1.jpg",
            quantidade: 5,
            titulo: "Módulo de Gramática"
            },
            {
            id: 2,
            professor_nome: "Ana Duarte",
            professor_foto: null,
            data_cadastro: "2025-02-05",
            turma_imagem: null,
            quantidade: 3,
            titulo: "Vocabulário Essencial"
            }
        ]
        };
    },

    methods: {
        acessarModulo(id) {
        // Substituir com a navegação real:
        console.log("Acessar módulo:", id);
        // ex: this.$router.push(`/material/${id}`)
        },

        formatarData(data) {
        if (!data) return "";
        return new Date(data).toLocaleDateString("pt-BR");
        }
    }
    };
</script>

