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

        <v-list density="comfortable" nav>
            <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/professor/dashboard" active-class="active-amber" class="list-item-professor"></v-list-item>
            <v-list-item prepend-icon="mdi-calendar-check" title="Minhas Aulas" value="aulas" to="/professor/minhas-aulas" active-class="active-amber" class="list-item-professor"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" title="Minhas Turmas" value="turmas" to="/professor/turmas" active-class="active-amber" class="list-item-professor"></v-list-item>
            
            <v-list-item prepend-icon="mdi-book-multiple" title="Materiais Didáticos" value="materiais" :to="{ name: 'ProfessorMateriais' }" active-class="active-amber" class="list-item-professor"></v-list-item>
            
            <v-list-item prepend-icon="mdi-calendar-edit" title="Lançar Presença" value="presenca" to="/professor/lancar-presenca" active-class="active-amber" class="list-item-professor"></v-list-item>
            
            <v-list-item prepend-icon="mdi-chart-line" title="Lançar Notas" value="notas" to="/professor/lancar-notas" active-class="active-amber" class="list-item-professor"></v-list-item>
            
            <v-divider class="my-3"></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Sair" value="logout" to="/login"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
.v-list-item:hover {
    background-color: rgb(236, 188, 87, 0.5) !important; 
}

.v-list-item.active-amber {
    background-color: #ffb300 !important; 
    color: white !important; 
}

.v-list-item.active-amber .v-list-item-title,
.v-list-item.active-amber .v-icon {
    color: white !important;
}

.list-item-professor:not(.active-amber) .v-list-item-title,
.list-item-professor:not(.active-amber) .v-icon {

    color: #444 !important; 
}
</style>