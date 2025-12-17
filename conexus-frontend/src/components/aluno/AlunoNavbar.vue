<script setup>
import { useTheme } from "vuetify";
import { ref, onMounted, onUnmounted } from "vue";
import { useSettingsStore } from "@/stores/settings";
import '@/assets/layouts/aluno_header_styles.css'

/* -----------------------------
 TEMA + ZOOM
------------------------------ */
const theme = useTheme();
const isDark = ref(theme.global.current.value.dark);
const settingsStore = useSettingsStore();

/* -----------------------------
 NAVBAR STATE
------------------------------ */
const showProfile = ref(false);
// REMOVIDO: const showSearch = ref(false);


const user = ref({
  name: "Alexandre Quintão",
  email: "alexandre@example.com",
  avatar: "https://i.pravatar.cc/200"
});

/* -----------------------------
 FUNÇÕES
------------------------------ */
function toggleProfile() {
  showProfile.value = !showProfile.value;
  // showSearch.value = false; // REMOVIDO: Não é mais necessário
}

// REMOVIDO: function toggleSearch() { ... }

function closeOnScroll() {
  showProfile.value = false;
  // showSearch.value = false; // REMOVIDO: Não é mais necessário
}

function toggleTheme() {
  const newTheme = theme.global.current.value.dark ? "light" : "dark";
  theme.global.name.value = newTheme;
  isDark.value = theme.global.current.value.dark;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(newTheme);
}

/* -----------------------------
 MOUNT / UNMOUNT
------------------------------ */
onMounted(() => {
  const root = document.documentElement;
  root.classList.add(isDark.value ? "dark" : "light");
  window.addEventListener("scroll", closeOnScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", closeOnScroll);
});
</script>

<template>
  <v-app-bar flat height="64" class="px-4 nav-wrapper border-b-sm" color="#2fa99e">
    <img src="/src/assets/img/2025_01.png" alt="Logo Conexus" style="width: 80px" >
    <img src="/src/assets/img/Conexus14.png" alt="Logo Conexus" style="width: 150px" >

    <v-spacer></v-spacer>

    <v-btn icon title="Reduzir Zoom" @click="settingsStore.zoomOut">
      <v-icon>mdi-minus</v-icon>
    </v-btn>

    <v-btn icon title="Aumentar Zoom" @click="settingsStore.zoomIn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn icon title="Redefinir Zoom" @click="settingsStore.resetZoom">
      <v-icon>mdi-sync</v-icon>
    </v-btn>

    <v-btn icon title="Tema" @click="toggleTheme">
      <v-icon>
        {{ isDark ? "mdi-white-balance-sunny" : "mdi-weather-night" }}
      </v-icon>
    </v-btn>

    <v-btn icon title="Perfil" @click="toggleProfile">
      <v-avatar size="34">
        <img :src="user.avatar" alt="avatar">
      </v-avatar>
    </v-btn>

    <div class="profile-menu" :class="{ active: showProfile }">
      <div class="profile-header">
        <v-avatar size="46" class="mb-2">
          <img :src="user.avatar" alt="Avatar" />
        </v-avatar>

        <h3>{{ user.name }}</h3>
        <p class="email">{{ user.email }}</p>
      </div>

      <v-divider class="my-2"></v-divider>

      <v-btn variant="text" prepend-icon="mdi-account" block>
        Meu Perfil
      </v-btn>

      <v-btn variant="text" prepend-icon="mdi-logout" block>
        Logout
      </v-btn>
    </div>
    
  </v-app-bar>
</template>

<style scoped>
/*DROPDOWN DE PERFIL*/
.profile-menu {
  position: absolute;
  top: 85px;
  right: 20px;
  width: 240px;
  background: var(--color-background-elevated, #fff); 
  border: 1px solid var(--color-border-subtle, #ddd);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 12px rgba(0,0,0,0.4); 
  transform: scale(0);
  transform-origin: top right;
  transition: 0.15s ease;
  z-index: 9999 !important;
}


.profile-header h3 {
  font-size: 1.3rem;
  color: var(--color-text-default, #222); 
  margin: 0;
}

.profile-header .email {

  color: var(--color-text-default, #444); 
  font-size: 0.85rem;
  opacity: 0.8;
}

/* Força os ícones dentro de v-btn na v-app-bar (nav-wrapper) para branco */
.nav-wrapper :deep(.v-btn .v-icon) {
  color: white !important;
}

</style>