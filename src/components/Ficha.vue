<script setup>

import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();

let numeroFicha = ref(null);
let nombreFicha = ref(null);
let nivelFormacion = ref(null);
let fechaInicio = ref(null);
let fechaFin = ref(null);

let pagination = ref({rowsPerPage: 0});
let text = ref('');
let dense =  ref(false);

let textAgregarEditar = ref("Agregar Fichas")

let niveles = ref([
    "Técnico", "Tecnólogo"
])

let rows = ref([
    {nombre: "Ficha 1", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
    {nombre: "Ficha 3", numero: "2557356", nivelFormacion:"Tecnologo", fechaInicio:"12-12-2024", fechaFin:"12-12-2026", estado: 1},
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
            <h3>{{textAgregarEditar}}</h3>
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
                    <q-input filled bottom-slots v-model="text" label="Buscar Ficha" :dense="dense" style="width: 400px; color: white" bg-color="white">
                        <template v-slot:append>
                          <q-icon v-if="text !== ''" name="delete" @click="text = ''" class="cursor-pointer" />
                          <q-icon name="search" @click="buscarFicha()" />
                        </template>
                      </q-input>
                      
                        <div class="q-pa-md">
                            <q-table
                              class="my-sticky-virtscroll-table"
                              virtual-scroll
                              flat bordered
                              v-model:pagination="pagination"
                              :rows-per-page-options="[0]"
                              :virtual-scroll-sticky-size-start="48"
                              row-key="index"
                              :rows="rows"
                              :columns="columns"
                              style="height: 52vh;"
                            >
                            <template v-slot:body-cell-opciones="props">
                                <q-td :props="props" class="botones">
                                  <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                                  <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)"
                                    v-if="props.row.estado == 1" />
                                  <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else />
                                </q-td>
                              </template>
                            </q-table>
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 50%;
}
.container-agregar-fichas h3{
    padding: 0;
    margin: 5px;
}
.busquedas{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.fichas{
    background-color: white;
    border-radius: 5px;
    margin: 0;
    
}
</style>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #21BA45

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>