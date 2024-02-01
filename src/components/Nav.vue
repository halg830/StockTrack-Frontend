<script setup>
import { ref } from 'vue';
import Cookies from 'js-cookie'
import helpersGenerales from '../helpers/generales.js'
import { useStoreUsuarios } from '../stores/usuarios';

const profileDialog = ref(false);

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

const opciones = {
  admin: [
    { label: 'Prueba', o: ['nueva-password', 'recuperar-password'] },
    { label: 'Administración General', o: ['fichas', 'lotes', 'programas', 'distribucion-presupuesto', 'cuentas', 'areas'] },
    // { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: 'Formato de devolución' },
    { label: 'Productos', o: ['listado'] },
  ],
  instructor: [
    { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: ['Formato de devolución', 'Historial'] },
    { label: 'Pedidos', o: ['solicitar-pedido', 'estado', 'historial-pedido'] , e: ['Generar Pedido', 'Estado', 'Historial']},
  ],

  bodega: [
    { label: 'Productos', o: ['registro-devoluciones', 'Historial'], e: ['Registro de devolución', 'Historial'] },
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

      <q-btn-dropdown v-for="(opcion, index) in opciones[rol]" :key="index" class="menuDesplegable"
        :label="opcion.label" flat style="color: black; background: transparent;">
        <router-link v-for="(o, i) in opcion.o" :key="i" :to="'/' + o" class="items">
          <q-item>{{ opcion.e ? opcion.e[i] : helpersGenerales.primeraMayus(o) }}</q-item>
        </router-link>
      </q-btn-dropdown>

      <q-btn class="usuarioMenu" icon="person" style="color: black; background: #39A900;" @click="showProfileDialog" />

      <q-dialog v-model="profileDialog">
        <q-card>
          <q-card-section>
            <p>Correo del usuario: usuario@ejemplo.com</p>
            <q-btn label="Editar perfil" @click="editProfile" />
            <q-btn label="Cerrar sesión" @click="logout" />
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
}</style>
