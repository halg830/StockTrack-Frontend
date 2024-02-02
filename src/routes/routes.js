import {createRouter, createWebHashHistory} from 'vue-router'
import Nav from '../components/nav.vue'
import Home from '../components/home.vue'
import Ficha from '../components/Ficha.vue'
import Cuentas from '../components/registro.vue'
import Login from '../components/login.vue'
import NuevaContra from '../components/nuevaContraseña.vue'
import recuperarContra from '../components/recuperarContraseña.vue'
import solicitar from '../components/solicitarPedido.vue'
import GestionProductos from '../components/gestionProductos.vue'
import Lote from '../components/Lote.vue'
import Programa from '../components/programa.vue'
import Area from '../components/area.vue'
import formatoDevolucion from '../components/formatoDevoluciones.vue'
import historial from '../components/historialDevolucion.vue'
import historialPedido from '../components/historialPedido.vue'

const routes = [
  {path: '/', component: Login},
  {path: '/nav', component: Nav, children:[
    {path:'', redirect:'/home'},
    {path: '/home', component: Home},
    {path: '/fichas', component: Ficha},
    {path: '/cuentas', component: Cuentas},
    {path: '/nueva-password', component: NuevaContra},
    {path: '/recuperar-password', component: recuperarContra},
    {path: '/solicitar-pedido', component: solicitar},
    {path: '/listado', component: GestionProductos},
    {path: '/lotes', component: Lote},
    {path: '/programas', component: Programa},
    {path: '/areas', component: Area},
    {path: '/formato-devolucion', component: formatoDevolucion},
    {path: '/historial', component: historial},
    {path: '/historial-pedido', component: historialPedido}
  ]}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})