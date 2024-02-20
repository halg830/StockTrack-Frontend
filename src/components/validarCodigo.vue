<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuarios.js";
import NuevaPassword from "./nuevaPassword.vue";
import Cookies from "js-cookie";

// Notificación
const $q = useQuasar();
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

//Verificar el código
const codigo = ref("");
const useUsuario = useStoreUsuarios();
const componenteNuevaPass = ref(false);
const loadVerificar = ref(false);

async function confirmarCodigo() {
  try {
    loadVerificar.value = true;
    const response = await useUsuario.confirmarCodigo(codigo.value);

    if (!response) return;

    if (response.status != 200) {
      notificar("negative", response.error);
      return;
    }

    Cookies.set("codigo", codigo.value, { expires: 1 });
    componenteNuevaPass.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    loadVerificar.value = false;
  }
}

// Validaciones
function validarCampos() {
  if (codigo.value === null || codigo.value === "") {
    notificar("negative", "Por favor complete todos los campos");
    return;
  }

  confirmarCodigo();
}
</script>

<template>

  
  <section class="form-container" v-if="!componenteNuevaPass">
    <div class="logo">
    <img src="/src/assets/logoSena.png" alt="" srcset="" style="max-width: 145px;">
  </div>
    <q-form class="form" @submit="validarCampos">
      
      <div class="form-group">
        <div id="text">
        <label for="email" class="text-h4">Por favor, digite el código de verificación.</label>
      </div>
        <q-input outlined type="number" id="email"  class="inputcorreo" v-model="codigo"
          lazy-rules hide-bottom-space color="dark" bg-color="white" :rules="[
            (val) => val != '' || 'Por favor ingrese el código',
            (val) => val != null || 'Por favor ingrese el código',
          ]" />
        <q-btn id="buttonpassword" class="bg-primary" type="submit" :loading="loadVerificar">
          Enviar
        </q-btn>
      </div>


    </q-form>
  </section>
  <section v-if="componenteNuevaPass">
    <NuevaPassword></NuevaPassword>
  </section>
</template>

<style scoped>
.form-container {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}

.logo {
  padding: 10px;
  width: 100%;
  height: 5vh;
}

.form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
 
}

.form-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 35%;
  height: 50%;
  background-color: #f5f5f5;
  border-radius: 20px;
  border: 2px solid black;
  gap: 50px;
  box-shadow: 25px 20px 5px #888888;
}

#text {
  text-align: center;
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  border: 2px solid black;
  width: 30%;
  font-size: larger;
  border-radius: 25px;
  cursor: pointer;
}

.inputcorreo {
  width: 60%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
</style>
