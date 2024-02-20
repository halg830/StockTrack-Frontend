<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuarios.js";

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
const data = ref({ password: "" });
const checkPassword = ref("");
const useUsuario = useStoreUsuarios();
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
    router.push("/");
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
  <section class="form-containe">
    <div class="logo">
      <img src="/src/assets/logoSena.png" alt="" srcset="" style="max-width: 145px;">
    </div>
    <form class="form2" @submit="validarCampos">
      <div class="form-group">

        <label class="text-h6" for="email">Por favor, ingrese la nueva contraseña</label>
        <q-input class="inputpassword" outlined="" color="dark" bg-color="white" type="password" id="email"
          v-model="data.password"  lazy-rules :rules="[
            (val) => val != '' || 'Por favor ingrese una contraseña',
            (val) =>
              vali.test(val) ||
              'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.',
          ]" />



        <label class="text-h6" for="email">Confirmar Contraseña</label>
        <q-input outlined class="inputpassword" color="dark" bg-color="white" type="password" id="email"
          v-model="checkPassword" lazy-rules :rules="[
            (val) => val != '' || 'Por favor confirme su contraseña',
            (val) => val === data.password || 'Las contraseñas no coinciden',
            (val) =>
              vali.test(val) ||
              'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.',
          ]" />


        <q-btn class="bg-primary" id="buttonpassword" :loading="loadNuevaPass" type="submit">
          Cambiar Contraseña
        </q-btn>
      </div>
    </form>
  </section>
</template>

<style scoped>


.form2 {
  width: 100%;
  height: 70vh;
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
  width: 30%;
  height: 80%;
  background-color: #f5f5f5;
  border-radius: 20px;
  margin-bottom: 50px;
  gap: 20px;
  border: 2px solid black;
  text-align: center;
  box-shadow: 25px 20px 5px #888888;
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  border: 2px solid black;
  width: 55%;
  font-size: 15px;
  border-radius: 25px;
  cursor: pointer;
}

.inputpassword {
  width: 70%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
</style>
