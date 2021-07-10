import { createApp } from 'vue'
import App from './App.vue'
import { devtools } from './devtools'
import './styles/global.scss'

createApp(App).use(devtools).mount('#app')
