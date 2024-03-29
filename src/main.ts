import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// import css
import 'vue3-emoji-picker/css'
// Import Quasar css
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from './router'
import NoMessage from './UIcomponents/NoMessage.vue'
import './assets/main.css'

const app = createApp(App)

app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })
app.use(createPinia())
app.use(router)

app.component('NoMessage', NoMessage)

app.mount('#app')
