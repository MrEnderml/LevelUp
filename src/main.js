import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Tooltip from './components/Tooltip.vue'
import SvgIcon from './components/SvgIcon.vue';

const app = createApp(App)

app.component('Tooltip', Tooltip) 
app.component('SvgIcon', SvgIcon);

app.mount('#app')