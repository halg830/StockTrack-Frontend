<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStoreUsuario } from "../stores/usuario";

const router = useRouter();
// Notificación
const $q = useQuasar();
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

//Enviar nueva contraseña
const data = ref({password: ''});
const checkPassword = ref("");
const useUsuario = useStoreUsuario();
const loadNuevaPass = ref(false);

async function nuevaPassword() {
  try {
    loadNuevaPass.value = true;

    const response = await useUsuario.nuevaPassword(data.value);

    if (!response) return;

    if (response.status != 200) {
      notificar("negative", response.error);
      return;
    }

    notificar("positive", "Contraseña actulizada con éxito");
    router.push("/login");
  } catch (error) {
    console.log(error);
  } finally {
    loadNuevaPass.value = false;
  }
}

// Validaciones
const vali = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
function validarCampos() {
  data.value = {
    ...data.value,
    correo: Cookies.get("correo"),
    codigo: Cookies.get("codigo"),
  };

  const arrData = Object.entries(data.value);
  for (const d of arrData) {
    if (d[1] === null) {
      notificar("negative", "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
    }
  }

  nuevaPassword();
}
</script>

<template>
  <section class="form-container">
    <div class="logo-container">Nueva Contraseña</div>

    <form class="form" @submit="validarCampos">
      <div class="form-group" >
        <label for="email">Nueva Contraseña</label>
        <q-input
          outlined=""
          type="password"
          id="email"
          v-model="data.password"
          placeholder="Ingresa la nueva contraseña"
          lazy-rules
          :rules="[(val) => val != '' || 'Por favor ingrese una contraseña', val=> vali.test(val) || 'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.']"
        />
      </div>
      <div class="form-group">
        <label style="margin-top: 20px" for="email">Confirmar Contraseña</label>
        <q-input
          outlined
          type="password"
          id="email"
          v-model="checkPassword"
          placeholder="Confirma la contraseña"
          lazy-rules
          :rules="[(val) => val != '' || 'Por favor confirme su contraseña', (val)=> val===data.password || 'Las contraseñas no coinciden', val=> vali.test(val) || 'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.']"
        />
      </div>

      <q-btn class="form-submit-btn" :loading="loadNuevaPass" type="submit">
        Cambiar Contraseña
      </q-btn>
    </form>
  </section>
</template>

<style scoped>
</style>