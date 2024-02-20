<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuarios.js";
import logoSena from '../assets/logoSena.png'

const router = useRouter();
const showOne = ref(true);
const showTwo = ref(false);
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
    showOne.value = false;
    showTwo.value = true;
    
    notificar("positive", "Contraseña actulizada con éxito");
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
  <main>
    <section class="form-containe" v-if="showOne">
      <div class="logo">
        <img :src="logoSena" alt="" srcset="" style="max-width: 145px;">
      </div>
      <form class="form2" @submit="validarCampos">
        <div class="form-group">

          <label class="text-h6" for="email">Por favor, ingrese la nueva contraseña</label>
          <q-input class="inputpassword" outlined="" color="dark" bg-color="white" type="password" id="email"
            v-model="data.password" lazy-rules :rules="[
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

    <section v-if="showTwo" id="second">
      <div class="logo">
        <img :src="logoSena" alt="" srcset="" style="max-width: 145px;">
      </div>
      <article id="stext">
        <div id="stext11">
          <p  id="smessage">¡La contraseña ha sido cambiada exitosamente!</p> 
        <div id="stext2">
          <p id="smessage2">Ahora puede ingresar al sistema</p>
          <q-btn id="sbuttonpassword" type="submit" class="bg-primary" @click="router.push('/')">Ir al inicio</q-btn>
        </div>
        </div>
       
      </article>

    </section>
  </main>
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
  font-size: 115%;
  border-radius: 25px;
  cursor: pointer;
}

.inputpassword {
  width: 70%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#second {
  height: 100%;
}

#stext {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
}

#stext11{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  box-shadow: 25px 20px 5px #888888;
  border: 2px solid black;
  width: 40vw;
  height: 55vh;
  gap: 50px;
}


#smessage {
  text-align: center;
  font-size: 3vw;
  font-weight: bolder;
}

#smessage2{
  font-size: 2vw;
}

#stext2 {
  width: 50%;
  text-align: center;

}

#sbuttonpassword {
  color: white;
  font-weight: bolder;
  font-size: 1vw;
  border-radius: 25px;
  width: 50%;
}

@media screen and (min-width: 751px) and (max-width: 1000px) {
  #stext11{
    width: 50vw;
  }
  #smessage {
  font-size: 4vw;
}
  #smessage2{
  font-size: 3vw;
}

#sbuttonpassword {
  font-size: 2vw;
  width: 70%;
}
}


@media screen and (min-width: 400px) and (max-width: 750px){

  .form-group {
    width: 50%;
  }
  #stext11{
    width: 60vw;
  }
  #smessage {
  font-size: 5vw;
}
  #smessage2{
  font-size: 4vw;
}

#sbuttonpassword {
  font-size: 2vw;
  width: 80%;
}
}

@media screen and (min-width: 100px) and (max-width: 399px){

.form-group {
  width: 80%;
}
#stext11{
    width: 70vw;
  }
  #smessage {
  font-size: 6vw;
}
  #smessage2{
  font-size: 5vw;
}

#sbuttonpassword {
  font-size: 3vw;
  width: 90%;
}
}
</style>
