<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuario.js";
import NuevaPassword from "./nuevaContraseña.vue";
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
    <q-form class="form" @submit="validarCampos">
      <div class="form-group">
        <label for="email">Ingresa el código de verificación</label>
        <q-input
          outlined
          type="number"
          id="email"
          placeholder="Ingresa el código"
          v-model="codigo"
          lazy-rules
          :rules="[(val) => val != '' || 'Por favor ingrese el código', (val) => val != null || 'Por favor ingrese el código']"
        />
      </div>

      <q-btn class="form-submit-btn" type="submit" :loading="loadVerificar">
        Enviar Código
      </q-btn>
    </q-form>
  </section>
  <section v-if="componenteNuevaPass">
    <NuevaPassword></NuevaPassword>
  </section>
</template>

<style scoped></style>