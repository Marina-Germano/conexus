// vuetify.js (CORRIGIDO)

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// 🎯 IMPORTAÇÃO DE LOCALIZAÇÃO DO VUETIFY AQUI
import { pt } from 'vuetify/locale' 

export default createVuetify({
    components,
    directives,

    // 🎯 CONFIGURAÇÃO DE LOCALIZAÇÃO AQUI
    locale: {
        locale: 'pt', // Define o locale padrão como 'pt'
        messages: { pt }, // Fornece os textos de localização em português
        rtl: false, // Right-to-Left (Manter como false)
    },
    
    theme: {
    defaultTheme: 'light',
    themes: {
    light: {
        dark: false,
        colors: {
        background: '#ffffff',
        surface: '#ffffff',
        primary: '#ff9800',
        secondary: '#2c3e50',
        card: '#ffffff',
        }
    },
    dark: {
        dark: true,
        colors: {
        background: '#121212',
        surface: '#181818',
        primary: '#ff9800',
        secondary: '#dcdcdc',
        card: '#1e1e1e',
        }
    }
    }
    }
});