import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Tooltip from './components/Tooltip.vue'

const app = createApp(App)

app.component('Tooltip', Tooltip) 

app.mount('#app')