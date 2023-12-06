<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const newPassword = ref('')
const confirmPassword = ref('')
const onReset = () => {
  newPassword.value = ''
}

const isPasswordValid = (value) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=/()])[A-Za-z\d@#$%^&+=/()]{8,}$/;
  return passwordRegex.test(value);
}


</script>

<template>
  <main>
    <header>
    </header>

    <section id="sectionone">
      <article id="image">
        <img src="src/assets/Stocktrack.jpg" alt="">
      </article>
      <article id="text">
        <div id="text1">
          <p id="message">Diligencie todos los campos para cambiar su contraseña:</p>
        </div>
      </article>
    </section>

    <section id="sectiontwo">
      <article>
        <div id="text2">
          <p class="text-h5">Nueva contraseña</p>
          <q-form @reset="onReset" id="inputcorreo">
            <q-input square v-model="newPassword" label="Digite una contraseña nueva" lazy-rules hide-bottom-space bg-color="white"
              color="dark" :rules="[val => val && val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
              val => val && /\d/.test(val) || 'La contraseña debe contener al menos un número',
              val => val && /[@#\/]/.test(val) || 'La contraseña debe contener al menos un carácter especial',
              val => val && isPasswordValid(val) || 'La contraseña no cumple con los requisitos']" />
          </q-form>
        </div>
        <div id="text2">
          <p class="text-h5">Confirme contraseña</p>
          <q-form @reset="onReset" id="inputcorreo">
            <q-input square v-model="confirmPassword" label="Confirme nueva contraseña" lazy-rules hide-bottom-space
              color="dark" bg-color="white"
              :rules="[val => val && val.length > 0 || 'Por favor ingrese la contraseña', val => val && val === newPassword || 'No coinciden las contraseñas']" />
          </q-form>
        </div>

        <div id="text3">
          <button id="buttonpassword" type="button" class="bg-primary">Cambiar Contraseña</button>
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

#sectiontwo {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 120vh;
  background-color: gray;

}

#sectionone {
  width: 100%;
  height: 80%;
}

header,
footer {
  width: 100%;
  background-color: #EEEEEE;
  height: 6vh;
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
  font-size: 30px;
  border-radius: 25px;
  cursor: pointer;
  width: 500px;
  height: 50px;
}

#validation {
  color: red;
  font-size: 20px;
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
