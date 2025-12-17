<script setup>

</script>

<template>
    <v-navigation-drawer 
        permanent 
        width="250" 
        class="border-e-lg"
        app 
    >
        
        <v-divider></v-divider>

        <v-list density="compact" nav>
            
            <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/aluno/dashboard" class="item-lista-personalizado"></v-list-item>
            
            <v-list-item prepend-icon="mdi-calendar-check" title="Aulas" value="aulas" to="/aluno/aulas" class="item-lista-personalizado"></v-list-item>
            
            <v-list-item prepend-icon="mdi-book-multiple" title="Materiais" value="materiais" to="/aluno/materiais" class="item-lista-personalizado"></v-list-item>
            
            <v-list-item prepend-icon="mdi-chart-bar" title="Boletim" value="boletim" to="/aluno/boletim" class="item-lista-personalizado"></v-list-item>
            
            <v-list-item prepend-icon="mdi-cash-multiple" title="Financeiro" value="financeiro" to="/aluno/financeiro" class="item-lista-personalizado"></v-list-item>
            
            <v-list-item prepend-icon="mdi-headset" title="Fale Conosco" value="contato" to="/aluno/contato" class="item-lista-personalizado"></v-list-item>
            
            <v-divider class="my-3"></v-divider>
            
            <v-list-item prepend-icon="mdi-logout" title="Sair" value="logout" to="/login"></v-list-item>
            
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>


/*  ESTADO DE HOVER (Azul/Verde-água suave) */
.v-list-item:hover {
    background-color: rgba(47, 169, 158, 0.1) !important;
}

/*  ESTADO ATIVO (Item selecionado) */
.v-list-item--active {

    background-color: #2fa99e !important;
    color: white !important; 
}

/* Garante que o texto e o ícone do item ATIVO fiquem brancos */
.v-list-item--active .v-list-item-title,
.v-list-item--active .v-icon {
    color: white !important;
}

/*  Estilo Padrão do Texto e Ícones (Modo Claro) */
html.light .v-list-item:not(.v-list-item--active) .v-list-item-title,
html.light .v-list-item:not(.v-list-item--active) .v-icon {
    color: #005A5A !important;
}

</style>