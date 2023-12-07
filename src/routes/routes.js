import {createRouter, createWebHashHistory} from 'vue-router'
import Nav from '../components/Nav.vue'
import Home from '../components/Home.vue'
import Ficha from '../components/Ficha.vue'
import Cuentas from '../components/registro.vue'
import Form from '../components/form.vue'
import NuevaContra from '../components/nuevaContraseña.vue'
import recuperarContra from '../components/recuperarContraseña.vue'
import solicitar from '../components/solicitarPedido.vue'
import GestionProductos from '../components/GestionProductos.vue'

const routes = [
  {path: '/', component: Nav, children:[
    {path:'', redirect:'/home'},
    {path: '/home', component: Home},
    {path: '/fichas', component: Ficha},
    {path: '/cuentas', component: Cuentas},
    {path: '/form', component: Form},
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