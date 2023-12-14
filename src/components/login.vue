<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { useStoreUsuarios } from '../stores/usuarios.js'
import { useQuasar } from 'quasar';

const useUsuario = useStoreUsuarios();
const router = useRouter()
const data = ref({});
const $q = useQuasar()

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

function validarCampos() {
  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }
    if (typeof d[1] === 'string') {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }
  }

  login()
}

async function login() {
  const response = await useUsuario.login(data.value)
  console.log(response);

  if (!response) return

  if (response.status != 200) {
    notificar('negative', response.error)
    return;
  }

  Cookies.set('x-token', response.data.token, { expires: 1 })
  router.push('/nav')
}

function limitarLongitud(input, maxLength) {
  
  if (data.value[input] > maxLength) {
    data.value[input] = data.value[input].slice(0, maxLength);
  }
}

</script>

<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form @submit="validarCampos" class="q-gutter-md">
      <q-input filled v-model="data.identificacion" label="Numero de documento" lazy-rules type="number"
        :rules="[val => val && val.length > 0 || 'Por favor ingrese su documento']" :oninput="limitarLongitud('identificacion', 10)" />

      <q-input filled v-model="data.password" label="Contraseña" lazy-rules type="password"
        :rules="[val => val && val.length > 0 || 'Por favor ingrese su contraseña']" />

      <div>
        <q-btn label="Ingresar" type="submit" color="primary" />
      </div>
    </q-form>

  </div>
</template>