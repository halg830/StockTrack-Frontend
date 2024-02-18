<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Agregar esta línea
import Cookies from 'js-cookie'
import helpersGenerales from '../helpers/generales.js'
import { useStoreUsuarios } from '../stores/usuarios';

const profileDialog = ref(false);
const router = useRouter(); // Agregar esta línea

const showProfileDialog = () => {
  profileDialog.value = true;
};

const editProfile = () => {
};

const logout = () => {
};

const closeProfileDialog = () => {
  profileDialog.value = false;
};

const rol = Cookies.get('rol');
const usuario = JSON.parse(Cookies.get('usuario'));

//Editar Perfil
function Perfil(){
  router.push('/editar-perfil')
}

function cerrarSesion() {
  Cookies.remove('x-token')
  Cookies.remove('id')
  Cookies.remove('rol')
  Cookies.remove('usuario')

  router.push('/')
}
const opciones = {
  admin: [
    { label: 'Administración General', o: [ 'fichas', 'lotes', 'areas', 'productos', 'cuentas'], e: ['Fichas', 'Lotes', 'Areas', 'Productos', 'Cuentas'] },
    // { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: 'Formato de devolución' },
    { label: 'Presupuestos', o: ['programas', 'distribucion-item-lote', 'distribucion-lote-ficha'], e: ['Items', 'Item y lote', 'Lote y ficha'] },
  ],
  instructor: [
    // { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: ['Formato de devolución', 'Historial'] },
    { label: 'Pedidos', o: ['solicitar-pedido', 'historial-pedido'], e: ['Generar Pedido', 'Historial'] },
  ],

  bodega: [
    // { label: 'Productos', o: ['registro-devoluciones', 'Historial'], e: ['Registro de devolución', 'Historial'] },
    { label: 'Pedidos', o: ['historial', 'listado'] },
  ]
}


</script>
<template>
  <div class="stocktrackHome">
    <nav class="header">
      <div class="logo">
        <router-link to="/home" class="boton-home">
          <img src="/src/assets/logoSena.png" alt="" srcset="" style="max-width: 100px;">
        </router-link>
      </div>

      <div class="spacer"></div>

      <q-btn-dropdown v-for="(opcion, index) in opciones[rol]" :key="index" class="menuDesplegable" :label="opcion.label"
        flat style="color: black; background: transparent;">
        <router-link v-for="(o, i) in opcion.o" :key="i" :to="'/' + o" class="items">
          <q-item>{{ opcion.e ? opcion.e[i] : helpersGenerales.primeraMayus(o) }}</q-item>
        </router-link>
      </q-btn-dropdown>

      <q-btn class="usuarioMenu" icon="person" style="color: black; background: #39A900;" @click="showProfileDialog" />

      <q-dialog v-model="profileDialog">
        <q-card>
          <q-card-section>
            <div
              style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin-bottom: 10px;">
              <q-icon name="info" size="md" color="primary" />
              <p style="margin: 0 3px 0px">INFORMACIÓN DE USUARIO</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: center;">
              <img :src="usuario.fotoPerfil" alt="Foto de perfil"
                style="width: 100px; height: 100px; border-radius: 50%;">
            </div>
            <div v-if="usuario">
              <p><q-icon name="person" size="25px" /> Nombre: {{ usuario.nombre }} {{ usuario.apellido }}</p>
              <p><q-icon name="email" size="25px" /> Correo: {{ usuario.correo }}</p>
              <p><q-icon name="phone" size="25px" /> Telefono: {{ usuario.telefono }}</p>
            </div>
            <q-btn label="Editar perfil" @click="Perfil" />
            <q-btn label="Cerrar sesión" @click="cerrarSesion" />
            <q-btn label="Cerrar" color="primary" @click="closeProfileDialog" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </nav>

    <section>
      <router-view></router-view>
    </section>
  </div>
</template>


<style scoped>
.stocktrackHome {
  background-color: #ffffff;
}

.header {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: auto;
}

.spacer {
  flex: 1;
}

.usuarioMenu {
  margin-right: 3%;
}

.q-btn {
  margin-right: 10px;
}

.items {
  text-decoration: none;
  color: black
}
</style>
