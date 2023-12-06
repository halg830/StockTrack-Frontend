<script setup>
import { ref } from 'vue';

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

const opciones = [
  {label: 'Prueba', o:['form', 'nueva-contraseña', 'recuperar-contraseña', 'solicitar-pedido']},
  {label: 'Administración General', o: ['fichas', 'lotes', 'presupuestos', 'cuentas']},
  {label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: 'Formato de devolución'},
  {label: 'Productos', o: ['listado', 'reportes']},
]

const primeraMayus = (cadena) => cadena.charAt(0).toUpperCase() + cadena.slice(1);

</script>
<template>
  <div class="stocktrackHome">
    <nav class="header">
      <div class="logo">
        <img src="/src/assets/logoSena.png" alt="" srcset="" style="max-width: 100px;">
      </div>

      <div class="spacer"></div>

      <q-btn-dropdown v-for="(opcion, index) in opciones" :key="index" class="menuDesplegable" :label="opcion.label" flat style="color: black; background: transparent;">
        <router-link v-for="(o,i) in opcion.o" :key="i" :to="'/' + o" class="items">
          <q-item>{{ opcion.e && i==0 ? opcion.e : primeraMayus(o) }}</q-item>
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

.items{
  text-decoration: none;
  color: black
}
</style>
