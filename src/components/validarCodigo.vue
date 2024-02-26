<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuarios.js";
import NuevaPassword from "./nuevaPassword.vue";
import Cookies from "js-cookie";
import logoSena from '../assets/logoSena.png'

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

function home() {
  router.push('/')
}
</script>

<template>
  <section class="form-container" v-if="!componenteNuevaPass">
    <div class="logo">
      <img :src="logoSena" alt="" srcset="" @click="home" style="max-width: 145px; cursor: pointer;">
    </div>
    <q-form class="form" @submit="validarCampos">

      <div class="form-group">
        <div id="text">
          <label for="email" class="text">Por favor, digite el código de verificación.</label>
        </div>
        <q-input outlined type="number" id="email" class="inputcorreo" v-model="codigo" lazy-rules hide-bottom-space
          color="dark" bg-color="white" :rules="[
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
  height: 100vh;
}

.logo {
  padding: 10px;
  width: 100%;
  height: 5%;
}

.form {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.form-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 33vw;
  padding: 20px;
  min-height: 40vh;
  background-color: #f5f5f5;
  border-radius: 20px;
  gap: 50px;
  box-shadow: 25px 20px 5px #888888;
}

#text {
  text-align: center;
  font-size: 200%;
  width: 100%;
  max-height: 100%;
}


#buttonpassword {
  color: white;
  font-weight: bolder;
  width: 10vw;
  font-size: larger;
  border-radius: 25px;
  cursor: pointer;
}

.inputcorreo {
  width: 20vw;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

@media screen and (max-width: 1000px) and (min-width: 550px) {
  .form-group {
    width: 40vw;
    padding: 15px;
  }
  .inputcorreo {
    width: 30vw;
  }
  #buttonpassword {
    width: 22vw;
  }
}

@media screen and (max-width: 549px) and (min-width: 100px) {
.form-group {
  width: 60vw ;
  padding: 10px;
}
.inputcorreo {
  width: 50vw;
}

#buttonpassword {
  width: 30vw;
}
}

@media screen and (max-height: 660px) {
  .form-container{
    display: flex;
    flex-direction: column;
  }
  .form-group {
    padding: 15px; 
  }
}
</style>
