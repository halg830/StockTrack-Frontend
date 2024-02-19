<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStoreUsuarios } from "../stores/usuarios.js";
import VerificarCodigo from "./validarCodigo.vue";
import Cookies from 'js-cookie'

// Alertas notify
const $q = useQuasar();
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

const email = ref("");
const componenteVerificar = ref(false);

const correoValido = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
};

function validarCampo() {
  if (correoValido()) {
    enviarCodigo();
  }
}

const useUsuario = useStoreUsuarios();
async function enviarCodigo() {
  try {
    const response = await useUsuario.codigoRecuperar(email.value);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    Cookies.set('correo', email.value, {expires: 1})
    componenteVerificar.value = true;
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <main>
    <header></header>

    <section v-if="!componenteVerificar">
      <article id="image">
        <img src="/src/assets/logoSena.png" alt="" />
        <p id="message">
            Por favor, digite su correo para el proceso de recuperación de
            contraseña
          </p>
      </article>
      
      <article id="text">
        <div id="text2">
          <h3>Correo electrónico</h3>
        </div>
        <div id="text3">
          <q-form @submit="validarCampo" id="inputcorreo">
            <q-input
              rounded
              outlined
              v-model="email"
              label="Digite su correo aquí..."
              lazy-rules
              hide-bottom-space
              color="dark"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor ingrese su correo',
                (val) =>
                  (val && correoValido()) ||
                  'Por favor ingrese un correo valido',
              ]"
            />
            <q-btn id="buttonpassword" type="submit" class="bg-primary"
              >Recuperar contraseña</q-btn
            >
          </q-form>
        </div>
      </article>
    </section>

    <VerificarCodigo v-if="componenteVerificar" />

    <section v-if="showWindow" id="sectiontwo">
      <article id="image">
        <img src="/src/assets/logoSena.png" alt="" />
      </article>
      <article id="stext">
        <div id="stext1">
          <p class="text-h2" id="smessage">
            ¡El proceso de restablecimiento de contraseña ha sido exitoso!
          </p>
        </div>
        <div id="stext2">
          <p class="text-h4"></p>
          <q-btn
            id="sbuttonpassword"
            type="submit"
            class="bg-primary"
            @click="home()"
            >Ir al inicio</q-btn
          >
        </div>
      </article>
    </section>

    <footer></footer>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  
}

section {
  width: 100%;
  height: 100%;
}

header,
footer {
  width: 100%;
  background-color: #eeeeee;
  height: 7vh;
}

#image {
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
}

img {
  border-radius: 100%;
  width: 200px;
  height: 200px;
}

#text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#text1 {
  width: 50%;
}

#text2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#message {
  margin-left: 150px;
  width: 60%;
  text-align: center;
  font-size: 35px;
}

#text3 {
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
}

#inputcorreo {
  width: 408px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  font-size: 20px;
  border-radius: 25px;
  border: 2px solid black;
  cursor: pointer;
  width: 100%;
  margin-top: 40px;
}



#validation {
  color: red;
  font-size: 20px;
}

#stext {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

#stext1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

#smessage {
  text-align: center;
  width: 60%;
  font-weight: 700;
}

#stext2 {
  width: 50%;
  text-align: center;
}

#sbuttonpassword {
  margin-top: 50px;
  color: white;
  font-weight: bolder;
  border: 2px solid black;
  font-size: 20px;
  border-radius: 25px;
  cursor: pointer;
  width: 200px;
}

@media screen and (min-width: 390px) and (max-width: 520px) {
  #inputcorreo {
    width: 288px;
  }

  #buttonpassword {
    width: 390px;
  }
}

@media screen and (min-width: 0px) and (max-width: 389px) {
  #inputcorreo {
    width: 230px;
  }

  #buttonpassword {
    width: 300px;
  }
}
</style>
