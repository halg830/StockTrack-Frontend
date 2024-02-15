<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie'
import { useStoreUsuarios } from '../stores/usuarios';

const router = useRouter();

const userData = ref(JSON.parse(Cookies.get('usuario')));

function guardarCambios() {
    // Aquí iría la lógica para guardar los cambios en el backend
}

function cambiarContraseña() {
    router.push('/nueva-password')
}
</script>

<template>
    <q-card class="profile-card">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <h4>Editar Perfil</h4>
            <q-input v-model="userData.nombre" label="Nombre" readonly style="width: 300px;" />
            <q-input v-model="userData.apellido" label="Apellido" readonly style="width: 300px;" />
            <q-input v-model="userData.identificacion" label="Identificación" readonly style="width: 300px;"/>
            <q-input v-model="userData.correo" label="Correo" style="width: 300px;" />
            <q-input v-model="userData.telefono" label="Teléfono" style="width: 300px;" />
            <q-input v-model="userData.fotoPerfil" label="Foto de perfil" style="width: 300px;" />
            <q-btn @click="guardarCambios" style="margin-top: 20px;">Guardar cambios</q-btn>
            <q-btn @click="cambiarContraseña" style="margin-top: 20px;">Cambiar Contraseña</q-btn>
        </div>
    </q-card>
</template>


<style scoped>
q-input[readonly] {
    background-color: #f9f9f9;
    color: #333;
    cursor: not-allowed;
}
.profile-card {
    width: 400px;
    margin: 0 auto; 
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
