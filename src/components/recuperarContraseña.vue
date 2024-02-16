<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const email = ref('');
const showWindow = ref(false);
const hideWindow = ref(true);
const router = useRouter();

const onReset = () => {
  email.value = '';
}

const correoValido = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
}

function validarCampo() {
  if (correoValido()) {
    showWindow.value = true;
    hideWindow.value = false;
  }
}

function home(){
  router.push('/')
}

</script>

<template>
  <main>

    <header>
    </header>


    <section v-if="hideWindow">
      <article id="image">
        <img src="/src/assets/logoSena.png" alt="">
      </article>
      <article id="text">
        <div id="text1">
          <p id="message">Por favor, digite su correo para el proceso de recuperación de contraseña</p>
        </div>
        <div id="text2">
          <h3>Correo electrónico</h3>
        </div>
        <div id="text3">
          <q-form @reset="validarCampo" id="inputcorreo">
            <q-input rounded outlined v-model="email" label="Digite su correo aquí..." lazy-rules hide-bottom-space
              color="dark"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese su correo', val => val && correoValido() || 'Por favor ingrese un correo valido']" />
              <q-btn id="buttonpassword" type="submit" class="bg-primary" >Recuperar
                contraseña</q-btn>
          </q-form>

        </div>

      </article>
    </section>

    <section v-if="showWindow" id="sectiontwo">
      <article id="image">
        <img src="/src/assets/logoSena.png" alt="">
      </article>
      <article id="stext">
        <div id="stext1">
          <p class="text-h2" id="smessage">¡El proceso de restablecimiento de contraseña ha sido exitoso!</p>
        </div>
        <div id="stext2">
          <p class="text-h4">En los próximos minutos le enviaremos a
            {{ email }} las instrucciones para ingresar una nueva contraseña</p>
          <q-btn id="sbuttonpassword" type="submit" class="bg-primary" @click="home()">Ir al inicio</q-btn>
        </div>
      </article>


    </section>

    <footer>
    </footer>

    
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
  background-color: #EEEEEE;
  height: 7vh;
}

#image {
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

#text2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#message {
  text-align: center;
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
  width: 450px;
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
