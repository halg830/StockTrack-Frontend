import { createApp } from 'vue'
import {router} from './routes/routes.js'
import {createPinia} from 'pinia'
import axios from 'axios'
import { Quasar, Dialog, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'

axios.defaults.baseURL = ''

const pinia = createPinia()
const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: { Dialog, Notify },
  config: {
    notify: {}
  }
})

myApp.use(pinia)
myApp.use(router)

myApp.mount('#app')
