import Vue, { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'

Vue.config.devtools = true

const app = createApp(App)

app.mount('#app')
