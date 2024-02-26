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
import Lote from '../components/lote.vue'
import Item from '../components/item.vue'
import Area from '../components/area.vue'
import formatoDevolucion from '../components/formatoDevoluciones.vue'
import historial from '../components/historialDevolucion.vue'
import historialPedido from '../components/historialPedido.vue'
import distribucionItemLote from '../components/distribucionItemLote.vue';
import distribucionLoteFicha from '../components/distribucionLoteFicha.vue';
import editarPerfil from '../components/editarPerfil.vue';
import {useStoreUsuarios} from '../stores/usuarios.js'

// const checkAuth = () => {
//   const useUsuario = useStoreUsuarios()

//   const token = useUsuario.token

//   if (!token) return false
//   return true
// };

// const auth = (to, from, next) => {
//   if (checkAuth()) {
//       const useUsuario = useStoreUsuarios()
//       const rol = useUsuario.usuario.rol
//       console.log(rol);
//       if (!to.meta.rol.includes(rol)) {
//           return next({ name: '' })
//       }
//       next()
//   } else {
//       return next({ name: '' })
//   }
// }

const routes = [
  { path: '/', component: Login},
  { path: '/recuperar-password', component: recuperarContra},
  { path: '/nav', component: Nav, children:[
    { path:'/nav', redirect:'/home'},
    { path: '/home', component: Home },
    { path: '/fichas', component: Ficha},
    { path: '/cuentas', component: Cuentas},
    { path: '/nueva-password', component: NuevaContra},
    { path: '/solicitar-pedido', component: solicitar},
    { path: '/productos', component: GestionProductos},
    { path: '/lotes', component: Lote},
    { path: '/item', component: Item},
    { path: '/areas', component: Area},
    { path: '/formato-devolucion', component: formatoDevolucion},
    { path: '/historial', component: historial},
    { path: '/historial-pedido', component: historialPedido},
    { path: '/distribucion-item-lote', component: distribucionItemLote},
    { path: '/distribucion-item-lote/:idDistribucion', name: 'LoteConID', component: distribucionItemLote, props: true },
    { path: '/distribucion-lote-ficha', component: distribucionLoteFicha},
    { path: '/distribucion-lote-fichaidDistribucionPresupuesto', name: 'Fichas', component: distribucionLoteFicha},
    { path: '/editar-perfil', component: editarPerfil}
  ]}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})