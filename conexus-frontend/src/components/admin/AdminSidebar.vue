<script setup>

</script>

<template>
    <v-navigation-drawer 
        permanent 
        width="300" 
        class="border-e-lg"
        app 
        >
        <v-divider></v-divider>

        <v-list density="compact" nav>

            <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/admin/dashboard"></v-list-item>

            <v-list-item prepend-icon="mdi-format-list-bulleted" title="Listar Turmas" value="turmas" to="/admin/turmas"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" title="Listar Estudantes" value="estudantes" to="/admin/alunos"></v-list-item>
            <v-list-item prepend-icon="mdi-account-tie" title="Listar Funcionários" value="funcionarios" to="/admin/funcionarios"></v-list-item>
            <v-list-item prepend-icon="mdi-book-open-variant" title="Listar Materiais" value="materiais" to="/admin/materiais"></v-list-item>
            <v-list-item prepend-icon="mdi-book-open-variant" title="Listar Empréstimos" value="emprestimos" to="/admin/emprestimos"></v-list-item>
            
            <v-divider class="my-3"></v-divider>
            
            <v-list-group value="Relatorios">
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-chart-bar"
                        title="Relatórios"
                    ></v-list-item>
                </template>

                <v-list-item 
                    prepend-icon="mdi-cash" 
                    title="Financeiro" 
                    value="relatorio-financeiro" 
                    to="/admin/reports/finance"
                ></v-list-item>
                
                <v-list-item 
                    prepend-icon="mdi-warehouse" 
                    title="Materiais" 
                    value="relatorio-materiais" 
                    to="/admin/reports/materials"
                ></v-list-item>

            </v-list-group>

            <v-divider class="my-3"></v-divider>
            
            <v-list-item prepend-icon="mdi-logout" title="Sair" value="logout" to="/login"></v-list-item>

        </v-list>
        
    </v-navigation-drawer>
</template>

<style scoped>


/* Estilo para itens de lista normais (Home, Turmas, Sair, etc.) */
.v-list-item:hover {
    background-color: #ff9800 !important; 
    color: white !important; 
}

/* Garante que o texto e o ícone fiquem brancos no hover */
.v-list-item:hover .v-list-item-title,
.v-list-item:hover .v-icon {
    color: white !important;
}

/* Estilo para o V-List-Group (Relatórios) e seus itens internos */
.v-list-group :deep(.v-list-item:hover) {
    background-color: #ff9800 !important;
    color: white !important;
}

.v-list-group :deep(.v-list-item:hover) .v-list-item-title,
.v-list-group :deep(.v-list-item:hover) .v-icon {
    color: white !important;
}
</style>