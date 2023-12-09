import {createRouter, createWebHashHistory} from 'vue-router'
import Nav from '../components/nav.vue'
import Home from '../components/home.vue'
import Ficha from '../components/ficha.vue'
import Cuentas from '../components/registro.vue'
import Login from '../components/login.vue'
import NuevaContra from '../components/nuevaContraseña.vue'
import recuperarContra from '../components/recuperarContraseña.vue'
import solicitar from '../components/solicitarPedido.vue'
import GestionProductos from '../components/gestionProductos.vue'

const routes = [
  {path: '/', component: Login},
  {path: '/nav', component: Nav, children:[
    {path:'', redirect:'/home'},
    {path: '/home', component: Home},
    {path: '/fichas', component: Ficha},
    {path: '/cuentas', component: Cuentas},
    {path: '/nueva-contraseña', component: NuevaContra},
    {path: '/recuperar-contraseña', component: recuperarContra},
    {path: '/solicitar-pedido', component: solicitar},
    {path: '/listado', component: GestionProductos}
  ]}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})