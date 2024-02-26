<script setup>
import { Cookies, useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { useStoreUsuarios } from '../stores/usuarios';

const router = useRouter();
const isPwd = ref(true);
const isPwdb = ref(true);
const isPw = ref(true);
const password = ref('')
const newPassword = ref('');
const confirmPassword = ref('');
const loadingContraseña = ref(false);
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
  Cookies.remove()
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
const data = ref({
  password,
  newPassword, confirmPassword
})
async function cambiarPassword() {
  loadingContraseña.value = true;
  try {
    const response = await useUsuario.cambiarPassword(data.value)
    loadingContraseña.value = false;
    console.log(response);

    if (!response) return
    if (response.error) {
      notificar('negative', response.error)
      return
    }

    messageSuccessful()
  } catch (error) {
    console.log(error);
  }
}

//Notificaciones
const $q = useQuasar();
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
    <section id="sectionone" v-if="hideOne">

      <article id="text">
          <p id="message">Diligencie todos los campos para cambiar su contraseña:</p>
      </article>

      <article id="sectiontwo">
        <q-form @reset="onReset" class="q-gutter-lg" @submit="cambiarPassword">
          <div class="cajas">
            <label class="text-h6 text-weight-bold" for="">Contraseña actual </label>
            <q-input v-model="password" class="inputpassword" filled :type="isPw ? 'password' : 'text'" 
              lazy-rules hide-bottom-space color="dark" bg-color="white"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese la contraseña']">
              <template v-slot:append>
                <q-icon :name="isPw ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPw = !isPw" />
              </template>
            </q-input>
          </div>
          <div class="cajas">
            <label class="text-h6 text-weight-bold" for="">Nueva contraseña </label>
            <q-input v-model="newPassword" class="inputpassword" filled :type="isPwd ? 'password' : 'text'" 
              lazy-rules hide-bottom-space color="dark" bg-color="white" :rules="[val => val && val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
              val => val && /\d/.test(val) || 'La contraseña debe contener al menos un número',
              val => val && /[@#\/]/.test(val) || 'La contraseña debe contener al menos un carácter especial (@, #, / )',
              val => val && isPasswordValid(val) || 'La contraseña debe tener al menos una letra']">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="cajas">
            <label class="text-h6 text-weight-bold" for="">Confirmar contraseña </label>
            <q-input v-model="confirmPassword" class="inputpassword" filled :type="isPwdb ? 'password' : 'text'"
               lazy-rules hide-bottom-space color="dark" bg-color="white"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese la contraseña', val => val && val === newPassword || 'Las contraseñas no coinciden']">
              <template v-slot:append>
                <q-icon :name="isPwdb ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwdb = !isPwdb" />
              </template>
            </q-input>
          </div>

          <div id="text3">
            <q-btn id="buttonpassword" type="submit" class="bg-primary" :loading="loadingContraseña">Cambiar
              Contraseña</q-btn>
              
          </div>
        </q-form>


      </article>
    </section>

    <section v-if="showTwo" id="second">
      <article id="stext">
        <div id="stext1">
          <p class="text-h2" id="smessage">¡La contraseña ha sido cambiada exitosamente!</p>
        </div>
        <div id="stext2">
          <p class="text-h4">Por favor vuelva a iniciar sesión</p>
          <q-btn id="sbuttonpassword" type="submit" class="bg-primary" @click="home()">Ir al inicio</q-btn>
        </div>
      </article>

    </section>


  </main>
</template>




<style scoped>
main {
  width: 100%;
  height: 100%;
}

#sectionone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 100%;
}

#sectiontwo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  min-height: 80%;
  background-color: rgb(245, 245, 245);
  border-radius: 20px;
  text-align: center;
}

#text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.inputpassword{
  width: 100%;
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  font-size: 20px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
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

</style>