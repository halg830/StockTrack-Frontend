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

const loadIngresar = ref(false);
async function login() {
  try {
    loadIngresar.value = true;
    const response = await useUsuario.login(data.value)
    console.log(response);

    if (!response) return

    if (response.status != 200) {
      notificar('negative', response.error)
      return;
    }

    Cookies.set('x-token', response.data.token, { expires: 1 })
    Cookies.set('id', response.data.usuario._id, { expires: 1 })
    Cookies.set('rol', response.data.usuario.rol, { expires: 1 })

    router.push('/nav')
  } catch (error) {
    console.log(error);
  } finally {
    loadIngresar.value = false;
  }

}

function limitarLongitud(input, maxLength) {

  if (data.value[input] > maxLength) {
    data.value[input] = data.value[input].slice(0, maxLength);
  }
}

</script>

<template>
  <main class="container">
    <section class="left-panel">
      <h1 class="registro">Ingresa tu cuentas</h1>
      <q-form @submit="validarCampos" class="form">
        <div class="q-pa-md" style="max-width: 500px">
          <q-input filled v-model="data.identificacion" label="Numero de documento" lazy-rules type="number"
            :rules="[val => val && val.length > 0 || 'Por favor ingrese su documento']"
            :oninput="limitarLongitud('identificacion', 10)">
            <template v-slot:error>
              Please use maximum 3 characters.
            </template>
          </q-input>
        </div>
        <div class="q-pa-md" style="max-width: 500px">
          <q-input filled v-model="data.password" label="Contraseña" lazy-rules type="password"
            :rules="[val => val && val.length > 0 || 'Por favor ingrese su contraseña']">
            <template v-slot:error>
              Please use maximum 3 characters.
            </template>
          </q-input>

        </div>
        <div class="boton">
          <q-btn class="ingresa" type="submit" :loading="loadIngresar">Ingresar</q-btn>
        </div>
      </q-form>


    </section>
    <section class="right-panel">

      <div class="texto">
        <h1 class="txt1">Bienvenido</h1>
        <h3 class="txt2">Si no tienes cuenta aqui puedes crearla</h3>
        <div class="boton">
          <button class="registrate">Registrate</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.texto {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  color: white;

}

.txt1 {
  font-size: 50px;
}

.txt2 {
  font-size: 25px;
  margin-top: -20px;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Dos columnas del 50% cada una */
  height: 100vh;
  /* 100% del viewport height */
}


.right-panel {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-panel {
  background-color: white;
  margin-top: 200px;
}

.right-panel {
  margin: 0 auto;
  background-color: #39A900;
  width: 100%;

}

.ingresa {
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  background-color: #39A900;
  border: none;
}

.registrate {
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  background-color: white;
  border: none;
}

.nombre {
  align-items: center;
  justify-content: center;
  display: flex;
}

.boton {
  align-items: center;
  justify-content: center;
  display: flex;
}


.boton2 {
  justify-content: center;
  display: flex;
}

.ingresar {
  width: 250px;
  background-color: white;
  border: none;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

}

.input {
  width: 500px;
}

.registro {
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 50px;
}

.q-pa-md {
  margin: 0 auto;
}
</style>