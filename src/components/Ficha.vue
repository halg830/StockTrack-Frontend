
<script setup>

import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();

let numeroFicha = ref(null);
let nombreFicha = ref(null);
let nivelFormacion = ref(null);
let fechaInicio = ref(null);
let fechaFin = ref(null);

let text = ref('');
let dense =  ref(false);


let niveles = ref([
    "Técnico", "Tecnólogo"
])


function agregarFicha() {

    $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
    });
    onReset();

};

function buscarFicha(){
    console.log("Buscando Ficha");
};


function onReset() {
    numeroFicha.value = "";
    nombreFicha.value = "";
    nivelFormacion.value = "";
    fechaInicio.value = "";
    fechaFin.value = "";
};
</script>

<template>
    <div class="container-fichas">
        <section class="container-agregar-fichas">
            <article>
                <div class="q-pa-md" style="width: 400px">
                    <q-form @submit="agregarFicha" @reset="onReset" class="q-gutter-md">
                        <q-input filled v-model="numeroFicha" type="number" label="N° Ficha" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el numero de ficha']" />

                        <q-input filled v-model="nombreFicha" label="Nombre Programa" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el Nombre del Programa']" />

                        <q-select filled v-model="nivelFormacion" label="Nivel de Formación" lazy-rules :options=niveles
                            :rules="[val => val !== null && val !== '' || 'Seleccione un nivel de Formación']" />

                        <q-input filled v-model="fechaInicio" type="date" label="Fecha Inicio" lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione la Fecha de Inicio']" />

                        <q-input filled v-model="fechaFin" type="date" label="Fecha Fin" lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione la Fecha de Finalización']" />
                        <div>
                            <q-btn label="Submit" type="submit" color="primary" />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>

                </div>
            </article>
        </section>
        <section class="container-fichas-existentes">
            <article>
                <div class="busquedas">
                    <h2>Fichas</h2>
                    <q-input filled bottom-slots v-model="text" label="Buscar Ficha" :dense="dense"  style="width: 400px; color: white">
                        <template v-slot:append>
                            <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
                            <q-icon name="search" @click="buscarFicha()"/>
                        </template>
                    </q-input>
                    <div class="fivhas">

                    </div>
                </div>
            </article>
        </section>
    </div>
</template>

<style scoped>
.container-fichas {
    display: flex;
    width: 100%;
    min-height: 100vh;
    align-items: center;
}

.container-fichas-existentes {
    height: 100vh;
    background-color: #39A900;
    width: 50%;
}

.container-agregar-fichas {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 50%;
}
.busquedas{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>  

