<template>
    <main class="container">
        <section class="left-panel">
            <img src="" alt="">
            <h1 class="nombre">Stock track</h1>
            <div class="boton2">
                <button class="ingresar">Regresa</button>
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
                    <q-input filled label="Identificacion" bottom-slots :error="!isValid" hint="Max 3 characters" input-class="input">
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
<style coped>
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Dos columnas del 50% cada una */
    height: 100vh;
    /* 100% del viewport height */
}

.left-panel,
.right-panel {
    padding: 20px;
    box-sizing: border-box;
}

.left-panel {
    background-color: #39A900;
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
.input{
    width: 500px;
}
.registro{
    justify-content: center;
    align-items: center;
    display: flex;
}
</style>