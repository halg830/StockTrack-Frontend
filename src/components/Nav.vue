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
</script>
<template>
  <div class="stocktrackHome">
    <nav class="header">
      <div class="logo">
        <img src="/src/assets/logoSena.png" alt="" srcset="" style="max-width: 100px;">
      </div>

      <div class="spacer"></div>

      <q-btn-dropdown class="menuDesplegable" label="Administración General"  flat
        style="color: black; background: transparent;">
        <q-item @click="nav('fichas')">Fichas</q-item>
        <q-item @click="nav('lotes')">Lotes</q-item>
        <q-item @click="nav('presupuestos')">Presupuestos</q-item>
        <q-item @click="nav('cuentas')">Cuentas</q-item>
      </q-btn-dropdown>

      <q-btn-dropdown class="menuDesplegable" label="Devoluciones"  flat
        style="color: black; background: transparent;">
        <q-item @click="nav('formato-devolucion')">Formato de devolución</q-item>
        <q-item @click="nav('historial')">Historial</q-item>
      </q-btn-dropdown>

      <q-btn-dropdown class="menuDesplegable" label="Productos" flat
        style="color: black; background: transparent;">
        <q-item @click="navigateTo('listado')">Listado</q-item>
        <q-item @click="navigateTo('reportes')">Reportes</q-item>
      </q-btn-dropdown>

      <q-btn class="usuarioMenu" icon="person" style="color: black; background: #39A900;" @click="showProfileDialog" />
      
      <q-dialog v-model="profileDialog" persistent>
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
</style>
