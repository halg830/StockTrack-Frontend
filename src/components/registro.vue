<template>
    <main class="container">
        <section class="left-panel">
            <h1></h1>

            <div class="card">
                <div class="box">
                    <img class="img-perfil" src="../assets/perfil-removebg-preview.png" alt="">
                    <p class="name">Juan Juan gutierez gutierez</p>

                    <div class="toggler">
                        <input id="toggler-1" name="toggler-1" type="checkbox" value="1">
                        <label for="toggler-1">
                            <svg class="toggler-on" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 130.2 130.2">
                                <polyline class="path check" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>
                            </svg>
                            <svg class="toggler-off" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 130.2 130.2">
                                <line class="path line" x1="34.4" y1="34.4" x2="95.8" y2="95.8"></line>
                                <line class="path line" x1="95.8" y1="34.4" x2="34.4" y2="95.8"></line>
                            </svg>
                        </label>
                    </div>
                </div>

            </div>

        </section>
        <section class="right-panel">
            <h1 class="registro">Registro</h1>
            <q-form class="form">
                <div class="q-pa-md" style="max-width: 500px">
                    <q-inpu ut filled label="Nombre" bottom-slots :error="!isValid" hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-inpu>
                </div>
                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled label="Identificacion" bottom-slots :error="!isValid" hint="Max 3 characters"
                        input-class="input">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>
                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled label="Nombre de usuario" bottom-slots :error="!isValid" hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>
                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled label="Nombre de usuario" bottom-slots :error="!isValid" hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>

                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled v-model="model" label="Telefono" bottom-slots :error="!isValid" hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>
                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled v-model="model" label="Codigo Rol" bottom-slots :error="!isValid"
                        hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>
                <div class="q-pa-md" style="max-width: 500px">
                    <q-input filled v-model="model" label="Contraseña" bottom-slots :error="!isValid"
                        hint="Max 3 characters">
                        <template v-slot:error>
                            Please use maximum 3 characters.
                        </template>
                    </q-input>
                </div>
            </q-form>
            <div class="boton">

                <button class="ingresa">Registrese</button>
            </div>

        </section>
    </main>
</template>
<script setup >
import { ref, watch } from 'vue'

let model = ref('')
let isValid = ref(null)

watch(model, () => {
    if (model.value.length <= 3) {
        isValid.value = false
    } else {
        isValid.value = true
    }
})
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Kanit:wght@500&display=swap');
.name{
    font-size: 15px;
    font-family: "Inter", sans-serif;
    margin-top:20px;
    align-items: center;
    justify-content: center;
    display: flex;
}
.box {
    display: flex;
    width: 100%;
    height: 70px;
    border-bottom: solid black 1px;
}

.img-perfil {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.card {
    margin-left: 200px;
    margin-top: 200px;
    width: 500px;
    height: 500px;
    border-radius: 30px;
    background: #e0e0e0;
}

.form {
    width: 500px;
    margin-top: -100px;
}

.container {
    display: flex;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
}

.left-panel {
    background-color: #39A900;
    display: flex;
}

.right-panel {
    margin: 0 auto;
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

.nombre {
    align-items: center;
    justify-content: center;
    display: flex;
}

.boton {
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
}

/* estilos de check activo inactivo */
.toggler {
    align-items: center;
    /* width: 72px; */
    /* margin: 15px 271px; */
    display: flex;
    justify-content: flex-end;
    width: 38%;
}

.toggler input {
  display: none;
}

.toggler label {
  display: block;
  position: relative;
  width: 72px;
  height: 36px;
  border: 1px solid #d6d6d6;
  border-radius: 36px;
  background: #e4e8e8;
  cursor: pointer;
}

.toggler label::after {
  display: block;
  border-radius: 100%;
  background-color: #d7062a;
  content: '';
  animation-name: toggler-size;
  animation-duration: 0.15s;
  animation-timing-function: ease-out;
  animation-direction: forwards;
  animation-iteration-count: 1;
  animation-play-state: running;
}

.toggler label::after, .toggler label .toggler-on, .toggler label .toggler-off {
  position: absolute;
  top: 50%;
  left: 25%;
  width: 26px;
  height: 26px;
  transform: translateY(-50%) translateX(-50%);
  transition: left 0.15s ease-in-out, background-color 0.2s ease-out, width 0.15s ease-in-out, height 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.toggler input:checked + label::after, .toggler input:checked + label .toggler-on, .toggler input:checked + label .toggler-off {
  left: 75%;
}

.toggler input:checked + label::after {
  background-color: #50ac5d;
  animation-name: toggler-size2;
}

.toggler .toggler-on, .toggler .toggler-off {
  opacity: 1;
  z-index: 2;
}

.toggler input:checked + label .toggler-off, .toggler input:not(:checked) + label .toggler-on {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggler .path {
  fill: none;
  stroke: #fefefe;
  stroke-width: 7px;
  stroke-linecap: round;
  stroke-miterlimit: 10;
}

@keyframes toggler-size {
  0%, 100% {
    width: 26px;
    height: 26px;
  }

  50% {
    width: 20px;
    height: 20px;
  }
}

@keyframes toggler-size2 {
  0%, 100% {
    width: 26px;
    height: 26px;
  }

  50% {
    width: 20px;
    height: 20px;
  }
}
 
</style>