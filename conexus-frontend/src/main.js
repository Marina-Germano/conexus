import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import vuetify from './plugins/vuetify' 
import api from './plugins/axios' 
import App from './App.vue'
import router from './router'
import '@/assets/layouts/admin_style.css'

const app = createApp(App)


const pinia = createPinia()

app.use(pinia) 
app.use(vuetify)
app.use(api)
app.use(router)

app.mount('#app')