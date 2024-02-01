<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { useStoreUsuarios } from '../stores/usuarios';

const router = useRouter();
const isPwd = ref(true);
const isPw = ref(true);
const password = ref('')
const newPassword = ref('');
const confirmPassword = ref('');
const hideOne = ref(true);
const showTwo = ref(false);
const onReset = () => {
  password.value = ''
  newPassword.value = '';
  confirmPassword.value = '';
}

const isPasswordValid = (value) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=/()])[A-Za-z\d@#$%^&+=/()]{8,}$/;
  return passwordRegex.test(value);
}


function messageSuccessful() {
  if (newPassword.value === confirmPassword.value) {
    showTwo.value = true;
    hideOne.value = false;
  }
}

function home() {
  router.push('/')
}

//Formulario
const useUsuario = useStoreUsuarios()
async function cambiarPassword() {
  try {
    const data = {
      password,
      newPassword
    }

    const res = await useUsuario.cambiarPassword(data)
    console.log(res);

    if (!response) return
    if (response.error) {
      notificar('negative', response.error)
      return
    }

    notificar('Contraseña cambiada exitosamente')
  } catch (error) {
    console.log(error);
  }
}

const $q = useQuasar();
const productos = ref([]);
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

</script>

<template>
  <main>
    <header>
    </header>

    <section id="section">
      <article id="image">
        <img src="/src/assets/logoSena.png" alt="">
      </article>
    </section>

    <section id="sectionone" v-if="hideOne">

      <article id="text">
        <div id="text1">
          <p id="message">Diligencie todos los campos para cambiar su contraseña:</p>
        </div>
      </article>

      <article id="sectiontwo">
        <div id="text2">
          <q-form @reset="onReset" id="inputcorreo" class="q-gutter-md" @submit="cambiarPassword">
            <q-input v-model="password" filled :type="isPw ? 'password' : 'text'" label="Digite su contraseña actual"
              lazy-rules hide-bottom-space color="dark" bg-color="white"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese la contraseña']">
              <template v-slot:append>
                <q-icon :name="isPw ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPw = !isPw" />
              </template>
            </q-input>

            <q-input v-model="newPassword" filled :type="isPwd ? 'password' : 'text'" label="Digite una contraseña nueva"
              lazy-rules hide-bottom-space color="dark" bg-color="white" :rules="[val => val && val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
              val => val && /\d/.test(val) || 'La contraseña debe contener al menos un número',
              val => val && /[@#\/]/.test(val) || 'La contraseña debe contener al menos un carácter especial (@, #, / )',
              val => val && isPasswordValid(val) || 'La contraseña debe tener al menos una letra']">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-input v-model="confirmPassword" filled :type="isPw ? 'password' : 'text'" label="Confirme nueva contraseña"
              lazy-rules hide-bottom-space color="dark" bg-color="white"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese la contraseña', val => val && val === newPassword || 'Las contraseñas no coinciden']">
              <template v-slot:append>
                <q-icon :name="isPw ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPw = !isPw" />
              </template>
            </q-input>
            <div id="text3">
              <q-btn id="buttonpassword" type="submit" class="bg-primary" @click="messageSuccessful()">Cambiar
                Contraseña</q-btn>
            </div>
          </q-form>
        </div>


      </article>
    </section>

    <section v-if="showTwo" id="second">
      <article id="stext">
        <div id="stext1">
          <p class="text-h2" id="smessage">¡La contraseña ha sido cambiada exitosamente!</p>
        </div>
        <div id="stext2">
          <p class="text-h4">Ahora puede ingresar al sistema</p>
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
  align-items: center;

}

header,
footer {
  width: 100%;
  background-color: #EEEEEE;
  height: 9vh;
}

#sectionone {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}

#section {
  width: 100%;
  height: 30%;
}


#sectiontwo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  height: 70%;
  gap: 50px;
  background-color: rgb(245, 245, 245);
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
  width: 100%;
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
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  border: 2px solid black;
  font-size: 20px;
  border-radius: 25px;
  cursor: pointer;
}

#validation {
  color: red;
  font-size: 20px;
}

#second {
  height: 100vh;
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

@media screen and (min-width: 521px) and (max-width: 815px) {
  #inputcorreo {
    width: 220px;
  }

  #buttonpassword {
    width: 220px;
    font-size: 20px;
  }
}


@media screen and (min-width: 390px) and (max-width: 520px) {
  #inputcorreo {
    width: 208px;
  }

  #buttonpassword {
    width: 200px;
    font-size: 15px;
  }
}

@media screen and (min-width: 0px) and (max-width: 389px) {

  #inputcorreo {
    width: 150px;
  }

  #buttonpassword {
    width: 150px;
    font-size: 10px;
  }
}</style>