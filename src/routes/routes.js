import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/nav.vue";
import Home from "../components/home.vue";
import Destino from "../components/destino.vue";
import Cuentas from "../components/registro.vue";
import Login from "../components/login.vue";
import NuevaContra from "../components/nuevaContraseña.vue";
import recuperarContra from "../components/recuperarContraseña.vue";
import solicitar from "../components/solicitarPedido.vue";
import solicitarSalida from "../components/solicitarSalida.vue";
import GestionProductos from "../components/gestionProductos.vue";
import Lote from "../components/lote.vue";
import Dependencia from "../components/dependencia.vue";
import Area from "../components/area.vue";
import historialPedido from "../components/historialPedido.vue";
import distribucionLoteDependencia from "../components/distribucionLoteDependencia.vue";
import distribucionDependenciaRed from "../components/distribucionDependenciaRed.vue";
import editarPerfil from "../components/editarPerfil.vue";
import redConocimiento from "../components/redConocimiento.vue";
import conexionRedLote from "../components/conexionRedLote.vue";
import entrada from "../components/entrada.vue";
import historialSalida from "../components/historialSalida.vue";
import contrato from "../components/contrato.vue";
import proceso from "../components/proceso.vue";
import disRedArea from '../components/distribucionRedArea.vue';
import disAreaDestino from '../components/distribucionAreaDestino.vue';
import proveedor from '../components/proveedor.vue';
import disContratoLote from '../components/distribucionContratoLote.vue';
import { useStoreUsuarios } from "../stores/usuarios.js";

const checkAuth = () => {
  const useUsuario = useStoreUsuarios();

  const token = useUsuario.token;

  if (!token) return false;
  return true;
};

const auth = (to, from, next) => {
  if (checkAuth()) {
    const useUsuario = useStoreUsuarios();
    const rol = useUsuario.usuario.rol;
    console.log(rol);
    if (!to.meta.rol.includes(rol)) {
      return next({ path: "/" });
    }
    next();
  } else {
    return next({ path: "/" });
  }
};

const routes = [
  { path: "/", component: Login },
  { path: "/recuperar-password", component: recuperarContra },
  {
    path: "/nav",
    component: Nav,
    children: [
      { path: "/nav", redirect: "/home" },
      { path: "/home", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: Home, },
      { path: "/destinos", beforeEnter: auth, meta: { rol: ["admin"] }, component: Destino, },
      { path: "/cuentas", beforeEnter: auth, meta: { rol: ["admin"] }, component: Cuentas, },
      { path: "/contrato/:id", beforeEnter: auth, props: true,meta: { rol: ["admin"] }, component: contrato,},
      { path: "/proceso", beforeEnter: auth, meta: { rol: ["admin"] }, component: proceso,},
      { path: "/nueva-password", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: NuevaContra,},
      { path: "/solicitar-pedido", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: solicitar,},
      { path: "/solicitar-salida/:idPedido", beforeEnter: auth, meta: { rol: ["admin"] }, name: "Salida", props: true, component: solicitarSalida,},
      { path: "/productos", beforeEnter: auth, meta: { rol: ["admin", "bodega"] }, component: GestionProductos,},
      { path: "/entrada", beforeEnter: auth, meta: { rol: ["admin", "bodega"] }, component: entrada,},
      { path: "/lotes", beforeEnter: auth, meta: { rol: ["admin", "bodega"] }, component: Lote,},
      { path: "/lotes/:idContrato", name: "LoteConID", props: true, beforeEnter: auth, meta: { rol: ["admin", "bodega"] }, component: Lote, },
      { path: "/dependencia", beforeEnter: auth, meta: { rol: ["admin"] }, component: Dependencia,},
      { path: "/areas", beforeEnter: auth, meta: { rol: ["admin"] }, component: Area,},
      { path: "/historial-pedido", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: historialPedido,},
      { path: "/historial-salida", beforeEnter: auth, meta: { rol: ["admin"] }, component: historialSalida,},
      { path: "/distribucion-dependencia/:idDependencia", beforeEnter: auth, meta: { rol: ["admin"] }, name: "Lote Dependencia", component: distribucionLoteDependencia, props: true,},
      // { path: "/distribucion-dependencia-red", beforeEnter: auth, meta: { rol: ["admin"] }, component: distribucionDependenciaRed,},
      { path: "/distribucion-dependencia-red/:idDistribucionDependencia", beforeEnter: auth, meta: { rol: ["admin"] }, name: "Dependencia Red", component: distribucionDependenciaRed, props: true,},
      { path: '/distribucion-red-area/:idDisDependenciaRed', beforeEnter: auth, meta: { rol: ['admin'] }, name: 'Red Area', component: disRedArea, props: true,},
      { path: '/distribucion-area-destino/:idDisRedArea', beforeEnter: auth, meta: { rol: ['admin'] }, name: 'Area Destino', component: disAreaDestino, props: true,},
      { path: '/distribucion-contrato-lote/:idContrato', beforeEnter: auth, meta: { rol: ['admin'] }, name: 'Contrato Lote', component: disContratoLote, props: true,},
      { path: "/red-conocimiento", beforeEnter: auth, meta: { rol: ["admin"] }, component: redConocimiento,},
      { path: "/conexion-red-lote/:conexion/:id", beforeEnter: auth, meta: { rol: ["admin"] }, props: true, component: conexionRedLote,},
      { path: "/editar-perfil", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: editarPerfil,},
      { path: "/entrada", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: editarPerfil,},
      { path: "/proveedor", beforeEnter: auth, meta: { rol: ["admin", "instructor", "bodega"] }, component: proveedor,},
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
