<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStoreUsuarios } from "../stores/usuarios.js";
import VerificarCodigo from "./validarCodigo.vue";
import Cookies from 'js-cookie'
import logoSena from '../assets/logoSena.png'
import { useRouter } from 'vue-router'; 

// Alertas notify
const $q = useQuasar();
const router = useRouter();
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

    Cookies.set('correo', email.value, { expires: 1 })
    componenteVerificar.value = true;
  } catch (error) {
    console.log(error);
  }
}

function home(){
  router.push('/')
}
</script>

<template>
  <main>
    <section v-if="!componenteVerificar" class="sectionone">
      <article id="image">
        <img :src="logoSena" alt="" @click="home" style="cursor: pointer;"/>
        <p id="message">
          Por favor, digite su correo para el proceso de recuperación de
          contraseña.
        </p>
      </article>

      <article id="text">
        <div class="prueba">
          <div id="text2">
            <h3>Correo electrónico</h3>
            <div id="text3">
            <q-form @submit="validarCampo" id="inputcorreo">
              <q-input class="inputcorreo" outlined v-model="email" lazy-rules hide-bottom-space color="dark" bg-color="white" :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor ingrese su correo',
                (val) =>
                  (val && correoValido()) ||
                  'Por favor ingrese un correo valido',
              ]" />
              <q-btn id="buttonpassword" type="submit" class="bg-primary">Recuperar contraseña</q-btn>
            </q-form>
          </div>
          </div>
         
        </div>

      </article>
    </section>

    <VerificarCodigo v-if="componenteVerificar" />

    <section v-if="showWindow" id="sectiontwo">
      <article id="image">
        <img :src="logoSena" alt="" />
      </article>
      <article id="stext">
        <div id="stext1">
          <p class="text-h2" id="smessage">
            ¡El proceso de restablecimiento de contraseña ha sido exitoso!
          </p>
        </div>
        <div id="stext2">
          <p class="text-h4"></p>
          <q-btn id="sbuttonpassword" type="submit" class="bg-primary" @click="home()">Ir al inicio</q-btn>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(../assets/fondo.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow-y: hidden;
}

section {
  width: 100%;
  height: 100vh;
}

#image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}


#text {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}

.prueba{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  border: 2px solid black;
  gap: 50px;
  box-shadow: 25px 20px 5px #888888;
  width: 35%;
  height: 50%;
  text-align: center;
}


#text2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 100%;
}

#message {
  margin-left: 3%;
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 240%;
}



.inputcorreo{
  width: 100%;
}


#inputcorreo {
  width: 100%;
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

@media screen and (min-width: 601px) and (max-width: 960px) {
  #image {
    flex-direction: column;
    width: 100%;
  }
  .prueba{
    width: 55%;
  }
}

@media screen and (min-width: 100px) and (max-width: 600px) {
  #image {
    flex-direction: column;
    width: 100%;
  }
  .prueba{
    width: 90%;
    height: 50%;
  }

  #message {
  font-size: 180%;
}
#buttonpassword {
  margin-top: 30px;
  font-size: 130%;
  width: 80%
}
}

</style>
